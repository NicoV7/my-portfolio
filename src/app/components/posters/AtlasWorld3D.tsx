'use client'

import * as THREE from 'three'
import { Suspense, useMemo, useRef, Component, type ReactNode, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { CarBody } from './CarMarker3D'
import AtlasLighting from './AtlasLighting'

const PAPER = '#ffffff'
const { lerp, clamp, degToRad } = THREE.MathUtils

const CAR_Y = 0.5 // low enough that the cast shadow grounds it, clear of the relief
// journey (p=0) camera pose — MUST match the <Canvas camera> default so the car's
// unproject placement along the trail is unchanged until the finale scrubs in
const WORLD_POS = new THREE.Vector3(0, 22, 6)
const WORLD_TGT = new THREE.Vector3(0, 0, 0)
const HERO_RADIUS = 7
const HERO_ELEV = degToRad(35) // above the ground plane
const ORBIT_SPEED = 0.3 // rad/s, continuous turntable once descended
// finale is two stages of one scrub: DRIVE-OUT (car keeps driving forward off the road,
// camera top-down) for progress [0, DRIVE_END], then the camera ZOOM for [DRIVE_END, 1]
const DRIVE_END = 0.45
const DRIVE_DIST = 6 // world units the car drives off the road before the zoom
const DOWN = new THREE.Vector3(0, 0, 1) // world +Z = screen-down under the journey camera

/**
 * Pale 3D ground behind the Route Map atlas (replaces flat #fafaf7) AND the car,
 * in ONE WebGL context — a second full-viewport context blanked the small car
 * marker on some tabs. Near-white surface with gentle relief so it reads 3D but
 * bright white; the car is placed at the DOM trail-tracker's screen position
 * (unprojected onto the ground) so it drives the exact same measured trail, and
 * casts a real-time shadow onto the ground via AtlasLighting.
 */
function Ground() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(240, 240, 140, 140)
    const p = g.attributes.position as THREE.BufferAttribute
    // gentle swells (kept low so the surface stays bright white, not grey)
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      const z = Math.sin(x * 0.05) * Math.cos(y * 0.045) * 0.3 + Math.sin(x * 0.13 + 1.3) * Math.cos(y * 0.11 - 0.7) * 0.12
      p.setZ(i, z)
    }
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial color={PAPER} roughness={0.96} metalness={0} />
    </mesh>
  )
}

function CarOnGround({
  groupRef,
  trackerRef,
  finaleOn,
  progressRef,
  centerRef,
}: {
  groupRef: RefObject<THREE.Group | null>
  trackerRef: RefObject<HTMLElement | null>
  finaleOn: boolean
  progressRef: RefObject<number>
  centerRef: RefObject<THREE.Vector3>
}) {
  const camera = useThree((s) => s.camera)
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const ndc = useRef(new THREE.Vector2())
  const hit = useRef(new THREE.Vector3())
  const yaw = useRef(0)
  const scl = useRef(0.3)
  const shadowed = useRef(false)
  // live anchor = the car's LAST trail position; the drive-out starts exactly here so it
  // never teleports. Latched with hysteresis so scrub jitter can't re-capture it.
  const inFinale = useRef(false)
  const anchor = useRef(new THREE.Vector3())

  useFrame((_, dt) => {
    const el = trackerRef.current
    const g = groupRef.current
    if (!el || !g) return
    // the GLB loads async; flag its meshes as shadow-casters once they exist
    if (!shadowed.current) {
      let any = false
      g.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          o.castShadow = true
          any = true
        }
      })
      if (any) shadowed.current = true
    }

    // hysteresis latch: enter the finale hand-off at 0.03, leave at 0.01 — the finale scrub
    // now starts as the car reaches node 7 ('top bottom'), so this captures the anchor while
    // node 7 is still framed; the band stops boundary jitter re-capturing (the old teleport)
    const p = progressRef.current ?? 0
    if (p > 0.03) inFinale.current = true
    else if (p < 0.01) inFinale.current = false

    if (finaleOn || inFinale.current) {
      // DRIVE-OUT then ZOOM: one continuous motion from the LIVE anchor (the car's real
      // trail position) to a FIXED centred target straight DOWN. Targeting screen-centre
      // (world 0,0) rather than anchor+down means the car always converges to the SAME spot
      // and the camera always frames it centred — screen-size-independent (no small-screen jank).
      const tx = DOWN.x * DRIVE_DIST // CENTER.x (0) + down
      const tz = DOWN.z * DRIVE_DIST // CENTER.z (0) + down
      const dp = clamp((p - 0.03) / (DRIVE_END - 0.03), 0, 1)
      const s = dp * dp * (3 - 2 * dp) // smoothstep
      g.position.x = lerp(anchor.current.x, tx, s)
      g.position.z = lerp(anchor.current.z, tz, s)
      g.position.y = CAR_Y
      const zp = clamp((p - DRIVE_END) / (1 - DRIVE_END), 0, 1)
      scl.current = lerp(0.3, 0.85, zp * zp * (3 - 2 * zp)) // grows only during the zoom
      g.scale.setScalar(scl.current)
      // turn to face DOWN (+Z, yaw 0) and drive down; damped shortest-arc
      let dy = 0 - yaw.current
      dy = Math.atan2(Math.sin(dy), Math.cos(dy))
      yaw.current += dy * (1 - Math.exp(-dt / 0.2))
      g.rotation.y = yaw.current
      centerRef.current.set(tx, CAR_Y, tz) // the camera orbits where the car drove to
      return
    }

    const r = el.getBoundingClientRect()
    if (r.width === 0) return
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    ndc.current.set((cx / window.innerWidth) * 2 - 1, -(cy / window.innerHeight) * 2 + 1)
    ray.setFromCamera(ndc.current, camera)
    if (!ray.ray.intersectPlane(plane, hit.current)) return

    // tight follow (was 0.06): the tracker is already smoothed by its MotionPath scrub, so a
    // slow second lerp double-smoothed it into corner-cutting on the tight node-7 turn
    const k = 1 - Math.exp(-dt / 0.02)
    g.position.x = lerp(g.position.x, hit.current.x, k)
    g.position.z = lerp(g.position.z, hit.current.z, k)
    g.position.y = CAR_Y // low enough that the cast shadow grounds it, clear of the relief

    scl.current += (0.3 - scl.current) * clamp(dt * 3, 0, 1)
    g.scale.setScalar(scl.current)

    // heading from the tracker's smooth MotionPath rotation (NOT velocity, which
    // jittered/flipped) → world yaw, damped shortest-arc so it never spins wild
    const tr = getComputedStyle(el).transform
    const m = tr && tr !== 'none' ? new DOMMatrix(tr) : null
    const screenAngle = m ? Math.atan2(m.b, m.a) : 0
    const target = Math.PI / 2 - screenAngle
    let d = target - yaw.current
    d = Math.atan2(Math.sin(d), Math.cos(d))
    yaw.current += d * (1 - Math.exp(-dt / 0.12))
    g.rotation.y = yaw.current
    anchor.current.copy(g.position) // freeze-point for the drive-out = latest trail position
  })

  return (
    <group ref={groupRef} scale={0.3}>
      <CarBody />
    </group>
  )
}

/**
 * Finale camera move. Two independent drivers that don't fight:
 *  - DESCENT (scroll-scrubbed, reversible): `progressRef` 0->1 morphs the camera from the
 *    journey pose to the hero orbit and eases fov 32->50. At p=0 it reproduces the exact
 *    world pose, so the car's trail placement is untouched until the finale scrubs in.
 *  - ORBIT (time-based, continuous): azimuth advances off the frame clock so once descended
 *    the camera circles the parked car "forever". Reduced-motion pins a static hero framing.
 */
function FinaleCamera({ progressRef, centerRef }: { progressRef: RefObject<number>; centerRef: RefObject<THREE.Vector3> }) {
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera)
  const p = useRef(0)
  const theta = useRef(0)
  const orbit = useRef(new THREE.Vector3())
  const tgt = useRef(new THREE.Vector3())
  const reduce = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useFrame((_, dt) => {
    // the zoom only runs in stage 2: stage 1 (progress < DRIVE_END) is the drive-out and
    // the camera holds the top-down journey pose
    const raw = clamp(progressRef.current ?? 0, 0, 1)
    const target = clamp((raw - DRIVE_END) / (1 - DRIVE_END), 0, 1)
    p.current = reduce ? target : lerp(p.current, target, 1 - Math.exp(-dt / 0.12))
    const pp = p.current
    const c = centerRef.current

    // orbit only turns once we've descended (scaled by pp) so it never swirls while overhead;
    // frozen under reduced-motion for a still hero shot
    if (!reduce) theta.current += dt * ORBIT_SPEED * pp
    const horiz = Math.cos(HERO_ELEV) * HERO_RADIUS
    orbit.current.set(
      c.x + Math.sin(theta.current) * horiz,
      c.y + Math.sin(HERO_ELEV) * HERO_RADIUS,
      c.z + Math.cos(theta.current) * horiz
    )

    camera.position.lerpVectors(WORLD_POS, orbit.current, pp)
    tgt.current.lerpVectors(WORLD_TGT, c, pp)
    camera.lookAt(tgt.current)

    const fov = lerp(32, 50, pp)
    if (Math.abs(camera.fov - fov) > 0.001) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  })
  return null
}

/** Any WebGL/context failure drops the whole backdrop silently (page shows through). */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function AtlasWorld3D({
  trackerRef,
  finaleOn = false,
  finaleProgressRef,
  lightSide = -1,
  blurred = false,
}: {
  trackerRef: RefObject<HTMLElement | null>
  finaleOn?: boolean
  finaleProgressRef?: RefObject<number>
  lightSide?: number
  blurred?: boolean
}) {
  const carGroup = useRef<THREE.Group>(null)
  const fallbackProgress = useRef(0)
  const progressRef = finaleProgressRef ?? fallbackProgress
  // where the car drives to off the road; shared so the camera orbits the ACTUAL rest point
  const finaleCenter = useRef(new THREE.Vector3(0, CAR_Y, 0))
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      // blur+fade behind the SHOW ALL projects overlay so its text reads clearly
      style={{
        filter: blurred ? 'blur(12px)' : 'none',
        opacity: blurred ? 0.5 : 1,
        transition: 'filter 400ms ease, opacity 400ms ease',
      }}
    >
      <CanvasBoundary>
        <Canvas
          shadows="variance"
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 22, 6], fov: 32, near: 0.1, far: 120 }}
          onCreated={({ scene }) => {
            scene.background = new THREE.Color(PAPER)
            scene.fog = new THREE.Fog(PAPER, 45, 115)
          }}
        >
          <Suspense fallback={null}>
            <FinaleCamera progressRef={progressRef} centerRef={finaleCenter} />
            <AtlasLighting targetRef={carGroup} lightSide={lightSide} />
            <Ground />
            <CarOnGround
              groupRef={carGroup}
              trackerRef={trackerRef}
              finaleOn={finaleOn}
              progressRef={progressRef}
              centerRef={finaleCenter}
            />
            {/* subtle contact/ambient occlusion — small radius so the white ground
                doesn't grey; mostly darkens the car's contact + crevices */}
            <EffectComposer enableNormalPass={false}>
              <N8AO aoRadius={1.1} intensity={2.6} distanceFalloff={1} halfRes color="#0a0a0a" />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </CanvasBoundary>
    </div>
  )
}

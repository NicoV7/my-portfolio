'use client'

import * as THREE from 'three'
import { Suspense, useMemo, useRef, Component, type ReactNode, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CarBody } from './CarMarker3D'
import AtlasLighting from './AtlasLighting'

const PAPER = '#ffffff'
const { lerp, clamp } = THREE.MathUtils

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
}: {
  groupRef: RefObject<THREE.Group | null>
  trackerRef: RefObject<HTMLElement | null>
  finaleOn: boolean
}) {
  const camera = useThree((s) => s.camera)
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const ndc = useRef(new THREE.Vector2())
  const hit = useRef(new THREE.Vector3())
  const yaw = useRef(0)
  const scl = useRef(0.3)
  const spin = useRef(0)
  const shadowed = useRef(false)

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
    const r = el.getBoundingClientRect()
    if (r.width === 0) return
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    ndc.current.set((cx / window.innerWidth) * 2 - 1, -(cy / window.innerHeight) * 2 + 1)
    ray.setFromCamera(ndc.current, camera)
    if (!ray.ray.intersectPlane(plane, hit.current)) return

    const k = 1 - Math.exp(-dt / 0.06)
    g.position.x = lerp(g.position.x, hit.current.x, k)
    g.position.z = lerp(g.position.z, hit.current.z, k)
    g.position.y = 0.5 // low enough that the cast shadow grounds it, clear of the relief

    scl.current += ((finaleOn ? 0.85 : 0.3) - scl.current) * clamp(dt * 3, 0, 1)
    g.scale.setScalar(scl.current)

    if (finaleOn) {
      spin.current += dt * 0.3
      g.rotation.y = spin.current
      return
    }
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
  })

  return (
    <group ref={groupRef} scale={0.3}>
      <CarBody />
    </group>
  )
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
  lightSide = -1,
}: {
  trackerRef: RefObject<HTMLElement | null>
  finaleOn?: boolean
  lightSide?: number
}) {
  const carGroup = useRef<THREE.Group>(null)
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <CanvasBoundary>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 22, 6], fov: 32, near: 0.1, far: 120 }}
          onCreated={({ scene }) => {
            scene.background = new THREE.Color(PAPER)
            scene.fog = new THREE.Fog(PAPER, 45, 115)
          }}
        >
          <Suspense fallback={null}>
            <AtlasLighting targetRef={carGroup} lightSide={lightSide} />
            <Ground />
            <CarOnGround groupRef={carGroup} trackerRef={trackerRef} finaleOn={finaleOn} />
          </Suspense>
        </Canvas>
      </CanvasBoundary>
    </div>
  )
}

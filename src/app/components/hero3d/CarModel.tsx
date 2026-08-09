'use client'

import * as THREE from 'three'
import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { curve, progressToT } from './curve'

/**
 * Real W204 Mercedes-AMG C63 sedan (Ddiaz Design, CC-BY-NC-SA — see
 * public/models/CREDITS.md). Loaded from GLB, normalized, repainted glossy
 * white, and rigged: the 4 wheels are reparented onto steer/spin pivots so they
 * turn and spin with the drive. Desktop gets live CubeCamera paint reflections;
 * mobile reflects the scene environment.
 */
export const MODEL_URL = '/models/c63-w204/c63.glb'

const TARGET_LENGTH = 4.7
// GLB length is along Z already (nose +Z) → no reorient. Pivots therefore align
// with the world axle (X) / up (Y); if this model ever needed a 90° reorient the
// spin axis below would have to follow.
const FLIP_FRONT = false

const MAX_SPIN = 26 // rad/s of wheel spin at full drive speed
const SLIP_SPIN = 42 // extra spin during a burnout launch
const STEER_GAIN = 4
const MAX_STEER = 0.5

const WHEEL_MATS = new Set(['c63rin', 'c63rin2', 'llanta'])

export default function CarModel({
  progressRef,
  speedRef,
  slipRef,
  nightRef,
}: {
  progressRef: RefObject<number>
  speedRef?: RefObject<number>
  slipRef?: RefObject<number>
  nightRef?: RefObject<number>
}) {
  const { scene } = useGLTF(MODEL_URL)
  const built = useMemo(() => buildCar(scene), [scene])
  const ta = useRef(new THREE.Vector3())
  const tb = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta)
    const speed = speedRef?.current ?? 0
    const slip = slipRef?.current ?? 0
    const spin = (speed * MAX_SPIN + slip * SLIP_SPIN) * dt
    for (const p of built.allPivots) p.rotation.x -= spin

    const t = progressToT(progressRef.current)
    curve.getTangentAt(t, ta.current).normalize()
    curve.getTangentAt(Math.min(1, t + 0.02), tb.current).normalize()
    let d = Math.atan2(tb.current.x, tb.current.z) - Math.atan2(ta.current.x, ta.current.z)
    d = Math.atan2(Math.sin(d), Math.cos(d))
    const steer = THREE.MathUtils.clamp(d * STEER_GAIN, -MAX_STEER, MAX_STEER)
    for (const p of built.frontPivots) p.rotation.y = steer

    // night-gated only (no daytime base) so day scenes stay fully unlit. Front
    // headlamps now read HOTTER than the tails: the "glowing red" note was the
    // rear halos dominating the chase-cam — headlights must clearly be "on".
    const n = THREE.MathUtils.clamp(nightRef?.current ?? 0, 0, 1)
    for (const lm of built.frontLensMats) lm.emissiveIntensity = n * 9
    for (const lm of built.rearLensMats) lm.emissiveIntensity = n * 5
  })

  // Realtime CubeCamera reflections were too heavy with the full road-trip scene
  // (6 scene renders/frame → WebGL context loss). Clearcoat + lights carry the shine.
  return (
    <group>
      <primitive object={built.root} />
      <Headlights nightRef={nightRef} />
    </group>
  )
}

/**
 * Night-only headlight FX layered on the GLB's own (now-emissive) lenses: a soft
 * glow sprite for the bloom halo + a real cast SpotLight pooling light on the
 * asphalt, seated at the real front-lens position (z≈2.1) so nothing pokes out of
 * the fender. The lens glow itself is driven on the GLB material in CarModel.
 */
function Headlights({ nightRef }: { nightRef?: RefObject<number> }) {
  const glowTex = useMemo(makeRadialTexture, [])
  const glowMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: glowTex,
        color: '#eef6ff',
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [glowTex]
  )

  const rearGlowMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: glowTex,
        color: '#ff2f26',
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [glowTex]
  )

  const spots = useRef<THREE.SpotLight[]>([])
  const target = useRef<THREE.Object3D>(null)

  useFrame(() => {
    const n = THREE.MathUtils.clamp(nightRef?.current ?? 0, 0, 1)
    // front headlamp bloom pushed up, rear red pulled down: the beams + road
    // pools are the "lights on" cue, the tails a supporting accent (not the star)
    glowMat.opacity = n * 0.95
    rearGlowMat.opacity = n * 0.32
    for (const s of spots.current) {
      if (!s) continue
      s.intensity = n * 75
      if (target.current) s.target = target.current
    }
  })

  return (
    <group>
      {/* shared aim point ahead + low so both beams pool on the road */}
      <object3D ref={target} position={[0, 0.02, 9]} />
      {[0.75, -0.75].map((x, i) => (
        <group key={x} position={[x, 0.55, 2.1]}>
          <sprite material={glowMat} scale={[0.55, 0.4, 0.55]} />
          <spotLight
            ref={(r) => {
              if (r) spots.current[i] = r
            }}
            position={[0, 0, 0]}
            color="#eaf6ff"
            angle={0.62}
            penumbra={0.8}
            distance={40}
            decay={1.2}
            intensity={0}
          />
        </group>
      ))}
      {/* rear red halos: the strongest night cue from the trailing chase-cam */}
      {[0.7, -0.7].map((x) => (
        <sprite key={x} material={rearGlowMat} position={[x, 0.5, -2.05]} scale={[0.5, 0.36, 0.5]} />
      ))}
    </group>
  )
}

/** Radial white→transparent glow for the lens sprites. */
function makeRadialTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(220,238,255,0.7)')
  g.addColorStop(1, 'rgba(210,232,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

interface Built {
  root: THREE.Object3D
  paintMat: THREE.MeshPhysicalMaterial
  frontPivots: THREE.Group[]
  allPivots: THREE.Group[]
  /** GLB lamp lenses split by world-Z: the chase-cam sees the REAR, so red
   *  taillights are the primary "lights on" cue; front lenses drive the beams. */
  frontLensMats: THREE.MeshStandardMaterial[]
  rearLensMats: THREE.MeshStandardMaterial[]
}

const LENS_MATS = new Set(['c63luz', 'c63luz2'])

/** Normalize + repaint + rig the 4 wheels onto steer/spin pivots. */
function buildCar(scene: THREE.Object3D): Built {
  const root = scene.clone(true)

  const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3())
  const longIsX = size.x > size.z
  const scale = TARGET_LENGTH / Math.max(size.x, size.z)
  const orientY = (longIsX ? Math.PI / 2 : 0) + (FLIP_FRONT ? Math.PI : 0)

  // Bake the whole normalization into root so its local frame is world-aligned
  // (X = width/axle, Y = up, Z = forward) — this is what lets the wheel pivots
  // spin about local X and steer about local Y.
  root.scale.setScalar(scale)
  root.rotation.y = orientY
  root.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(root)
  const c = box.getCenter(new THREE.Vector3())
  root.position.set(-c.x, -box.min.y, -c.z)
  root.updateMatrixWorld(true)

  // White car paint = low-metalness pigment under a glossy clearcoat (high
  // metalness would mirror the dark scene and read black).
  const paintMat = new THREE.MeshPhysicalMaterial({
    color: '#eef1f4',
    metalness: 0.1,
    roughness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.07,
    envMapIntensity: 1.3,
  })

  const wheelMeshes: THREE.Mesh[] = []
  const frontLensMats: THREE.MeshStandardMaterial[] = []
  const rearLensMats: THREE.MeshStandardMaterial[] = []
  const mc = new THREE.Vector3()
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return
    o.castShadow = true
    o.receiveShadow = true
    const wasArray = Array.isArray(o.material)
    const arr = (wasArray ? o.material : [o.material]) as THREE.Material[]
    // same bbox-center-sign trick as the wheel clustering: nose is +Z after
    // normalization, so lens meshes at z<0 are the red rear cluster
    const isFront = new THREE.Box3().setFromObject(o).getCenter(mc).z > 0
    const remapped = arr.map((m) => {
      const name = (m as THREE.Material | undefined)?.name
      if (name === 'c63color') return paintMat
      if (name && LENS_MATS.has(name)) {
        const lm = new THREE.MeshStandardMaterial(
          isFront
            ? { color: '#f2f7ff', emissive: '#e6f1ff', metalness: 0.2, roughness: 0.2, toneMapped: false }
            : { color: '#ff5347', emissive: '#ff2a2a', metalness: 0.2, roughness: 0.2, toneMapped: false }
        )
        lm.emissiveIntensity = 0
        ;(isFront ? frontLensMats : rearLensMats).push(lm)
        return lm
      }
      return m
    })
    if (remapped.some((m, i) => m !== arr[i])) o.material = wasArray ? remapped : remapped[0]
    if (arr.some((m) => m && WHEEL_MATS.has((m as THREE.Material).name))) wheelMeshes.push(o)
  })

  // Cluster wheel meshes into 4 corners by the sign of their centered world pos.
  root.updateMatrixWorld(true)
  const clusters = new Map<string, { meshes: THREE.Mesh[]; sum: THREE.Vector3; n: number; front: boolean }>()
  const wc = new THREE.Vector3()
  for (const m of wheelMeshes) {
    new THREE.Box3().setFromObject(m).getCenter(wc)
    const key = (wc.x > 0 ? 'R' : 'L') + (wc.z > 0 ? 'F' : 'B')
    const cl = clusters.get(key) ?? { meshes: [], sum: new THREE.Vector3(), n: 0, front: wc.z > 0 }
    cl.meshes.push(m)
    cl.sum.add(wc)
    cl.n++
    clusters.set(key, cl)
  }

  const frontPivots: THREE.Group[] = []
  const allPivots: THREE.Group[] = []
  for (const cl of clusters.values()) {
    const center = cl.sum.clone().multiplyScalar(1 / cl.n)
    const pivot = new THREE.Group()
    pivot.rotation.order = 'YXZ'
    root.add(pivot)
    pivot.position.copy(root.worldToLocal(center.clone()))
    root.updateMatrixWorld(true)
    for (const m of cl.meshes) pivot.attach(m)
    allPivots.push(pivot)
    if (cl.front) frontPivots.push(pivot)
  }

  return { root, paintMat, frontPivots, allPivots, frontLensMats, rearLensMats }
}

useGLTF.preload(MODEL_URL)

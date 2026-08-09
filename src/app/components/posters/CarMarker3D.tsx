'use client'

import * as THREE from 'three'
import { Component, Suspense, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import type { Group } from 'three'

/**
 * The ONE persistent C63 (public/models/CREDITS.md): it drives the trail as a
 * small top-down marker, then the SAME canvas/context zooms into a 3/4 hero at
 * the finale. The `zoomed` prop (marker → hero) is eased inside `Rig`'s frame
 * loop to lerp the camera — so the zoom is seamless (one canvas, no reload).
 * On a cold browser where the GLB is still downloading or WebGL is unavailable,
 * it degrades to a clean 2D car (CarFallback2D), never a broken/blank state.
 */

export const MARKER_MODEL_URL = '/models/c63-w204/c63.glb'
const TARGET_LENGTH = 4.7
// nose is +Z in the GLB; yaw so it points +X (screen-right) to match MotionPath
// autoRotate, which aligns the wrapper's +x axis to the path tangent.
const NOSE_TO_SCREEN_RIGHT = -Math.PI / 2

const MARKER_POS = new THREE.Vector3(0, 7, 2.1)
const MARKER_TGT = new THREE.Vector3(0, 0, 0)
const HERO_POS = new THREE.Vector3(3.6, 1.85, 4.7)
const HERO_TGT = new THREE.Vector3(0, 0.45, 0)

/** the normalized, white-repainted C63 primitive, shared by the marker + finale. */
export function CarBody() {
  const { scene } = useGLTF(MARKER_MODEL_URL)
  const car = useMemo(() => {
    const root = scene.clone(true)
    const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3())
    root.scale.setScalar(TARGET_LENGTH / Math.max(size.x, size.z))
    root.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(root)
    const c = box.getCenter(new THREE.Vector3())
    root.position.set(-c.x, -box.min.y, -c.z)

    // white paint = low-metalness pigment under a glossy clearcoat, matches the
    // hero CarModel so marker and finale car are the same material
    const paint = new THREE.MeshPhysicalMaterial({
      color: '#eef1f4',
      metalness: 0.1,
      roughness: 0.34,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.5,
    })
    root.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return
      const arr = (Array.isArray(o.material) ? o.material : [o.material]) as THREE.Material[]
      const remapped = arr.map((m) => (m?.name === 'c63color' ? paint : m))
      if (remapped.some((m, i) => m !== arr[i])) o.material = Array.isArray(o.material) ? remapped : remapped[0]
    })
    return root
  }, [scene])

  return <primitive object={car} />
}

/** eases an internal 0→1 toward `zoomed`, lerping the camera from the top-down
 *  marker to the 3/4 hero and idle-spinning the car once zoomed in. Kept inside
 *  the R3F frame loop (no external state object) so the dolly is reliable. */
function Rig({ zoomed, car }: { zoomed: boolean; car: React.RefObject<Group | null> }) {
  const { camera } = useThree()
  const v = useRef(0)
  const spin = useRef(0)
  const tgt = useRef(new THREE.Vector3())
  useFrame((_, dt) => {
    const target = zoomed ? 1 : 0
    v.current += (target - v.current) * Math.min(1, dt * 1.6)
    camera.position.lerpVectors(MARKER_POS, HERO_POS, v.current)
    tgt.current.lerpVectors(MARKER_TGT, HERO_TGT, v.current)
    camera.lookAt(tgt.current)
    if (v.current > 0.6) spin.current += dt * 0.25
    if (car.current) car.current.rotation.y = NOSE_TO_SCREEN_RIGHT + spin.current
  })
  return null
}

/** clean 2D C63 that stands in for the canvas whenever WebGL/GLB can't run
 *  (cold-load suspend, context loss, unsupported browser) — never a broken glyph. */
export function CarFallback2D() {
  return (
    <div className="h-full w-full overflow-hidden rounded-full border-2 border-white shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
      {/* plain <img>: this must render even if the 3D/Next runtime is degraded */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/posters/jdm/car.jpg" alt="" className="h-full w-full scale-[1.7] object-cover object-[55%_60%]" />
    </div>
  )
}

/** Shows the 2D fallback on any Canvas error (WebGL context loss, GLB parse),
 *  then auto-retries by remounting the Canvas — so a TRANSIENT context loss
 *  (GPU reset, tab throttling, dev-reload context exhaustion) recovers the full
 *  3D car instead of latching to 2D forever. Gives up after a few tries. */
class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean; retryKey: number; tries: number }
> {
  state = { failed: false, retryKey: 0, tries: 0 }
  private timer?: ReturnType<typeof setTimeout>
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    if (this.state.tries >= 3) return
    this.timer = setTimeout(
      () => this.setState((s) => ({ failed: false, retryKey: s.retryKey + 1, tries: s.tries + 1 })),
      1800
    )
  }
  componentWillUnmount() {
    clearTimeout(this.timer)
  }
  render() {
    if (this.state.failed) return this.props.fallback
    return (
      <div key={this.state.retryKey} className="h-full w-full">
        {this.props.children}
      </div>
    )
  }
}

export default function CarMarker3D({ zoomed = false, dpr = 1.5 }: { zoomed?: boolean; dpr?: number }) {
  const car = useRef<Group>(null)
  // context loss doesn't throw and three can't fully self-restore, so REMOUNT
  // the Canvas (fresh renderer + context) on loss; cap remounts then give up to 2D
  const [remountKey, setRemountKey] = useState(0)
  const [dead, setDead] = useState(false)
  const remounts = useRef(0)
  // no WebGL (headless/blocked) or too many losses → 2D car, never a crash
  if (dead || (typeof window !== 'undefined' && !('WebGLRenderingContext' in window))) return <CarFallback2D />
  return (
    <CanvasErrorBoundary fallback={<CarFallback2D />}>
      <Canvas
        key={remountKey}
        dpr={dpr}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        camera={{ position: [0, 7, 2.1], fov: 30, near: 0.1, far: 60 }}
        onCreated={({ gl }) => {
          const el = gl.domElement
          el.addEventListener('webglcontextlost', (e) => {
            // preventDefault lets the browser reclaim the context; then remount clean
            e.preventDefault()
            if (remounts.current >= 3) return setDead(true)
            remounts.current += 1
            setTimeout(() => setRemountKey((k) => k + 1), 400)
          })
        }}
      >
        <hemisphereLight args={['#ffffff', '#e6ebff', 1.5]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 9, 5]} intensity={3} />
        <directionalLight position={[-4, 6, -2]} intensity={1.1} color="#dfe7ff" />
        {/* Suspense so the GLB download can't throw on a cold browser */}
        <Suspense fallback={null}>
          <group ref={car} rotation-y={NOSE_TO_SCREEN_RIGHT}>
            <CarBody />
          </group>
        </Suspense>
        <Rig zoomed={zoomed} car={car} />
      </Canvas>
    </CanvasErrorBoundary>
  )
}

useGLTF.preload(MARKER_MODEL_URL)

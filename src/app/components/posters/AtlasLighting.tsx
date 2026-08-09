'use client'

import * as THREE from 'three'
import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'

const { lerp } = THREE.MathUtils

/**
 * Raytraced-look lighting rig for the atlas ground. PCSS soft shadows give a real
 * penumbra (crisp at the tyre contact, softer with distance); a procedural IBL
 * environment gives the paint/chrome/glass accurate reflections. The shadow/key
 * light TRACKS the car (tight frustum) and rakes FROM the side the active photo
 * is aligned to — its horizontal offset eases L↔R as stops alternate.
 */
export default function AtlasLighting({
  targetRef,
  lightSide = -1,
}: {
  targetRef: RefObject<THREE.Object3D | null>
  lightSide?: number
}) {
  const light = useRef<THREE.DirectionalLight>(null)
  const offX = useRef(-11)

  useFrame((_, dt) => {
    const t = targetRef.current
    const l = light.current
    if (!t || !l) return
    // ease the key across so it rakes from the active photo's side, not a snap;
    // Y/Z follow the car so the shadow frustum stays tight (diffuse dir shifts by design)
    offX.current = lerp(offX.current, lightSide * 11, 1 - Math.exp(-dt / 0.5))
    l.position.set(t.position.x + offX.current, t.position.y + 15, t.position.z + 4)
    l.target.position.copy(t.position)
    l.target.updateMatrixWorld()
  })

  return (
    <>
      <hemisphereLight args={['#ffffff', '#f6f5f1', 1.15]} />
      <ambientLight intensity={0.85} />
      <directionalLight
        ref={light}
        intensity={1.0}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0004}
        shadow-camera-near={1}
        shadow-camera-far={45}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      {/* procedural IBL (no HDRI download) — reflections are the raytraced tell */}
      <Environment resolution={256} frames={1} background={false}>
        <Lightformer form="rect" intensity={2} position={[-12, 8, -6]} scale={[18, 6, 1]} color="#fff3e2" />
        <Lightformer form="rect" intensity={1.4} position={[12, 6, 8]} scale={[14, 7, 1]} color="#e2ecff" />
        <Lightformer
          form="rect"
          intensity={1.1}
          position={[0, 12, 2]}
          scale={[16, 5, 1]}
          rotation={[Math.PI / 2, 0, 0]}
          color="#ffffff"
        />
        <Lightformer form="rect" intensity={0.4} position={[0, -6, 4]} scale={[14, 4, 1]} color="#dfe6f2" />
      </Environment>
    </>
  )
}

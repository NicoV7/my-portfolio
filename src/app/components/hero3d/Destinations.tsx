'use client'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { curve, STOP_TS, STOP_POSITIONS } from './curve'
import { milestones } from '../../../data/milestones'

const SIDE = 6.4 // how far off the road shoulder the signs sit
const NEON = ['#4ea1ff', '#ff3d7f', '#39e6c3', '#ffa63d', '#b96bff', '#3dff88']

/** Roadside sign gantries, one per stop; the active one lights up. */
export default function Destinations({ activeIndex }: { activeIndex: number }) {
  const signs = useMemo(
    () =>
      STOP_POSITIONS.map((pos, i) => {
        const tan = curve.getTangentAt(STOP_TS[i]).normalize()
        const rx = tan.z
        const rz = -tan.x
        const at: [number, number, number] = [pos.x + rx * SIDE, 0, pos.z + rz * SIDE]
        // face the panel back toward the road center
        const yaw = Math.atan2(pos.x - at[0], pos.z - at[2])
        return { at, yaw, id: milestones[i].id }
      }),
    []
  )

  return (
    <group>
      {signs.map((s, i) => (
        <Sign
          key={s.id}
          position={s.at}
          yaw={s.yaw}
          neon={NEON[i % NEON.length]}
          active={i === activeIndex}
        />
      ))}
    </group>
  )
}

function Sign({
  position,
  yaw,
  neon,
  active,
}: {
  position: [number, number, number]
  yaw: number
  neon: string
  active: boolean
}) {
  const face = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (!face.current) return
    const pulse = active ? 3.4 + Math.sin(state.clock.elapsedTime * 3) * 0.8 : 1.1
    face.current.emissiveIntensity = pulse
  })

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* post */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 2.6, 8]} />
        <meshStandardMaterial color="#31363e" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* sign frame */}
      <mesh position={[0, 2.5, 0.06]}>
        <boxGeometry args={[1.9, 1.05, 0.08]} />
        <meshStandardMaterial color="#0c0f14" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* lit face (accent) */}
      <mesh position={[0, 2.5, 0.11]}>
        <planeGeometry args={[1.72, 0.88]} />
        <meshStandardMaterial
          ref={face}
          color={neon}
          emissive={neon}
          emissiveIntensity={1.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

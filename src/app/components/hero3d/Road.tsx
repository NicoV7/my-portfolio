'use client'

import * as THREE from 'three'
import { useMemo, type RefObject } from 'react'
import { curve } from './curve'
import { sampleCurve, buildStrip, buildDashes, offsetSamples } from './roadGeometry'

/** Kept for LevelLighting, which sets the path tone here; Road reads it once. */
export const roadColorRef = { current: new THREE.Color('#d9d6d1') }

const HALF_WIDTH = 4.6
const EDGE = HALF_WIDTH * 0.9

/**
 * The path — a clean light ribbon swept along the shared drive curve on a
 * near-white ground (the "canvas"). The night-highway furniture (guardrails,
 * streetlights, delineators, wet mirror asphalt) is retired for the white world.
 */
export default function Road({
  mobile = false,
}: {
  mobile?: boolean
  nightRef?: RefObject<number>
  groundColorRef?: RefObject<THREE.Color>
}) {
  const seg = mobile ? 150 : 280

  const geo = useMemo(() => {
    const s = sampleCurve(curve, seg)
    return {
      asphalt: buildStrip(s, HALF_WIDTH, 0),
      dashes: buildDashes(s, { halfWidth: 0.11, y: 0.02, dash: 2.4, gap: 3.4 }),
      edgeL: buildStrip(offsetSamples(s, -EDGE), 0.09, 0.02),
      edgeR: buildStrip(offsetSamples(s, EDGE), 0.09, 0.02),
    }
  }, [seg])

  return (
    <group>
      {/* near-white ground = the canvas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, -0.04, 0]} receiveShadow>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color="#efeee9" roughness={1} metalness={0} />
      </mesh>

      {/* the path — soft grey ribbon */}
      <mesh geometry={geo.asphalt} receiveShadow>
        <meshStandardMaterial color={roadColorRef.current} roughness={0.85} metalness={0} />
      </mesh>

      {/* centerline + quiet edges */}
      <mesh geometry={geo.dashes}>
        <meshStandardMaterial color="#8f8a82" roughness={0.9} />
      </mesh>
      <mesh geometry={geo.edgeL}>
        <meshStandardMaterial color="#c7c2ba" roughness={0.9} />
      </mesh>
      <mesh geometry={geo.edgeR}>
        <meshStandardMaterial color="#c7c2ba" roughness={0.9} />
      </mesh>
    </group>
  )
}

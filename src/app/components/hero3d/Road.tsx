'use client'

import * as THREE from 'three'
import { useMemo, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import { curve } from './curve'
import {
  sampleCurve,
  buildStrip,
  buildDashes,
  offsetSamples,
  railCurve,
  type Samples,
} from './roadGeometry'

const HALF_WIDTH = 4.6 // asphalt half-width → ~9.2u carriageway
const EDGE = HALF_WIDTH * 0.9 // painted edge line
const RAIL = HALF_WIDTH + 0.7 // guardrail offset
const RAIL_Y = 0.55
const POST_H = 0.75

/** Realistic dusk highway swept along the shared drive curve. */
export default function Road({
  mobile = false,
  nightRef,
  groundColorRef,
}: {
  mobile?: boolean
  nightRef?: RefObject<number>
  groundColorRef?: RefObject<THREE.Color>
}) {
  const seg = mobile ? 150 : 280

  // Shared materials for the emissive road furniture so a single useFrame can
  // fade them with the day/night cycle (they must NOT glow at noon), and so the
  // shoulder ground can take the active biome's ground colour instead of a fixed
  // near-black plane (which read as wet asphalt under the daytime regions).
  const groundMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0c0e12', roughness: 1, metalness: 0 }),
    []
  )
  const capMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffb739',
        emissive: '#ff8a1e',
        emissiveIntensity: 2.2,
        toneMapped: false,
      }),
    []
  )
  const lampMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffdca0',
        emissive: '#ffb54a',
        emissiveIntensity: 4,
        toneMapped: false,
      }),
    []
  )

  useFrame(() => {
    const n = THREE.MathUtils.clamp(nightRef?.current ?? 1, 0, 1)
    // reflectors/lamps only earn their glow at night; a small floor keeps
    // retroreflectors readable at dusk without blazing at noon.
    capMat.emissiveIntensity = 0.15 + n * 2.05
    lampMat.emissiveIntensity = n * 4
    if (groundColorRef?.current) groundMat.color.copy(groundColorRef.current)
  })

  const geo = useMemo(() => {
    const s = sampleCurve(curve, seg)
    return {
      asphalt: buildStrip(s, HALF_WIDTH, 0),
      dashes: buildDashes(s, { halfWidth: 0.11, y: 0.02, dash: 2.4, gap: 3.4 }),
      edgeL: buildStrip(offsetSamples(s, -EDGE), 0.09, 0.02),
      edgeR: buildStrip(offsetSamples(s, EDGE), 0.09, 0.02),
      railL: new THREE.TubeGeometry(railCurve(offsetSamples(s, -RAIL), RAIL_Y), seg, 0.05, 6, false),
      railR: new THREE.TubeGeometry(railCurve(offsetSamples(s, RAIL), RAIL_Y), seg, 0.05, 6, false),
      posts: postTransforms(s, mobile ? 16 : 9),
      lamps: lampTransforms(s, mobile ? 60 : 34),
    }
  }, [seg, mobile])

  return (
    <group>
      {/* ground / shoulder terrain — colour tracks the active biome */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, -0.04, 0]} receiveShadow material={groundMat}>
        <planeGeometry args={[400, 400]} />
      </mesh>

      {/* wet asphalt — reflects the car, neon and streetlights */}
      <mesh geometry={geo.asphalt} receiveShadow>
        <MeshReflectorMaterial
          resolution={mobile ? 256 : 512}
          mixBlur={6}
          mixStrength={1.1}
          blur={[320, 90]}
          mirror={0.5}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.1}
          depthScale={1}
          roughness={0.62}
          metalness={0.8}
          color="#0a0b0f"
        />
      </mesh>

      {/* painted lines */}
      <mesh geometry={geo.edgeL}>
        <meshStandardMaterial color="#d7dce3" roughness={0.5} emissive="#20242b" />
      </mesh>
      <mesh geometry={geo.edgeR}>
        <meshStandardMaterial color="#d7dce3" roughness={0.5} emissive="#20242b" />
      </mesh>
      <mesh geometry={geo.dashes}>
        <meshStandardMaterial color="#e7b93a" roughness={0.5} emissive="#3a2c07" />
      </mesh>

      {/* guardrails */}
      <mesh geometry={geo.railL} castShadow>
        <meshStandardMaterial color="#9aa1aa" metalness={0.9} roughness={0.35} />
      </mesh>
      <mesh geometry={geo.railR} castShadow>
        <meshStandardMaterial color="#9aa1aa" metalness={0.9} roughness={0.35} />
      </mesh>

      {/* guardrail posts + amber delineators (speed reference as the car passes) */}
      {geo.posts.map((p, i) => (
        <group key={i} position={[p[0], 0, p[1]]}>
          <mesh position={[0, POST_H / 2, 0]}>
            <cylinderGeometry args={[0.05, 0.05, POST_H, 6]} />
            <meshStandardMaterial color="#3a3f47" metalness={0.7} roughness={0.5} />
          </mesh>
          <mesh position={[0, POST_H, 0]} material={capMat}>
            <boxGeometry args={[0.09, 0.16, 0.03]} />
          </mesh>
        </group>
      ))}

      {/* streetlights — warm lamps that glow + reflect on the wet road */}
      {geo.lamps.map((p, i) => (
        <group key={`l${i}`} position={[p.x, 0, p.z]} rotation={[0, p.yaw, 0]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.08, 0.11, 6, 8]} />
            <meshStandardMaterial color="#2a2e35" metalness={0.7} roughness={0.5} />
          </mesh>
          <mesh position={[0, 5.95, -0.9]}>
            <boxGeometry args={[0.14, 0.1, 1.9]} />
            <meshStandardMaterial color="#2a2e35" metalness={0.7} roughness={0.5} />
          </mesh>
          <mesh position={[0, 5.85, -1.75]} material={lampMat}>
            <boxGeometry args={[0.34, 0.14, 0.6]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Streetlight base positions along the right shoulder, aimed at the road. */
function lampTransforms(s: Samples, step: number): { x: number; z: number; yaw: number }[] {
  const edge = offsetSamples(s, RAIL + 2.4)
  const out: { x: number; z: number; yaw: number }[] = []
  for (let i = step; i < edge.points.length - step; i += step) {
    const t = s.tangents[i]
    // face the arm toward road center (−right of travel)
    out.push({ x: edge.points[i].x, z: edge.points[i].z, yaw: Math.atan2(-t.z, t.x) })
  }
  return out
}

/** Post XZ positions along both guardrails, every `step` samples. */
function postTransforms(s: Samples, step: number): [number, number][] {
  const out: [number, number][] = []
  for (const side of [-RAIL, RAIL]) {
    const edge = offsetSamples(s, side)
    for (let i = 0; i < edge.points.length; i += step) {
      out.push([edge.points[i].x, edge.points[i].z])
    }
  }
  return out
}

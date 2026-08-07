'use client'

import * as THREE from 'three'
import { useMemo } from 'react'
import { placeAlongBand, bandCenter, KitModel, preloadKits, CITY_LOW, CITY_MID, type Placement } from './kit'
import type { RegionKey } from '../curve'

// Warm the GLB fetch/parse for the collegiate halls (reused City-Kit low/mid
// buildings dressed as stone/brick campus halls — Berkeley ships no dedicated
// campus GLBs).
preloadKits(...CITY_LOW, ...CITY_MID)

/**
 * ① UC Berkeley — the DAY campus level, origin of the drive.
 *
 * A leafy university, not a neon city: a pale-stone Sather Tower (Campanile)
 * standing tall and set back on one side as the hero landmark, real GLB
 * collegiate halls (City-Kit low/mid buildings recoloured to Berkeley brick +
 * pale campus stone — there are no dedicated Berkeley GLBs), oak-green tree
 * canopies, low lawns + hedges dressing the roadside, classic campus lamp posts,
 * and a couple of California-gold banners. The tower/trees/lawns/lamps/banners
 * are procedural, deterministic geometry — plain meshes; the halls are
 * auto-normalised GLB clones (NO emissive — it's day, no night-city glow).
 *
 * Corridor safety: every tall prop (halls, trees, tower, lamps, banners) is
 * pushed out with `minSide >= 8` (marker sits at ±6.4, guardrail ±5.3). Only the
 * flat, low lawn/hedge dressing rides closer, and it can't clip the chase cam.
 */

// ---- palette ---------------------------------------------------------------
const STONE = '#cbb892' // pale campus stone (Campanile / stone halls)
const STONE_LT = '#ddd2b6' // lighter stone trim / plinths
const BRICK = '#8a4b3a' // collegiate red brick
const BRICK_DK = '#733d2f'
const TRIM = '#efe7d2' // cornices / entablature / pediment
const CAP = '#c7bfa6' // pyramidal tower cap
const GLASS = '#3a4a52' // recessed window glazing (day, unlit)
const HALL_TINTS = [STONE, BRICK, '#c9b89a', BRICK_DK, STONE_LT] // stone/brick campus wash for GLB halls
// GLB pool for the halls: City-Kit low + mid buildings, cloned/tinted per hall.
const HALL_KIT = [...CITY_LOW, ...CITY_MID]
const CANOPY = ['#4f7a37', '#5c8a3f', '#6b9a48', '#43702f', '#578038']
const TRUNK = '#5c4433'
const LAWN = '#5f7f3a'
const HEDGE = '#4d6d31'
const HILL_A = '#6b8a4f'
const HILL_B = '#7c9a5e'
const GOLD = '#ffc72c' // California gold — banners + finial only

// deterministic hash (no per-frame Math.random)
const hash01 = (n: number) => {
  const s = Math.sin(n * 74.311) * 45219.113
  return s - Math.floor(s)
}

// ---- Sather Tower / Campanile ---------------------------------------------
// Tall pale-stone shaft, four clock faces near the top, an arched belfry and a
// pyramidal stone cap with a small gold finial. The drive's hero landmark.
function Campanile() {
  const H = 40 // shaft height above its plinth
  const W = 3.4 // shaft width
  const faces = [
    { p: [0, 0, 1] as [number, number, number], r: [0, 0, 0] as [number, number, number] },
    { p: [0, 0, -1] as [number, number, number], r: [0, 0, 0] as [number, number, number] },
    { p: [1, 0, 0] as [number, number, number], r: [0, Math.PI / 2, 0] as [number, number, number] },
    { p: [-1, 0, 0] as [number, number, number], r: [0, Math.PI / 2, 0] as [number, number, number] },
  ]
  const clockY = H - 1.5
  return (
    <group>
      {/* stepped stone plinth */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[W + 2.4, 2, W + 2.4]} />
        <meshStandardMaterial color={STONE_LT} roughness={0.9} metalness={0.03} />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[W + 1.2, 1, W + 1.2]} />
        <meshStandardMaterial color={STONE_LT} roughness={0.9} metalness={0.03} />
      </mesh>
      {/* main shaft */}
      <mesh position={[0, H / 2 + 2.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, W]} />
        <meshStandardMaterial color={STONE} roughness={0.85} metalness={0.04} />
      </mesh>
      {/* corner pilaster ribs for vertical relief */}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * (W / 2), H / 2 + 2.9, sz * (W / 2)]}>
          <boxGeometry args={[0.4, H, 0.4]} />
          <meshStandardMaterial color={STONE_LT} roughness={0.85} />
        </mesh>
      ))}
      {/* tall recessed shaft windows (dark slots) on all four faces */}
      {faces.map((f, i) => (
        <mesh key={`sw${i}`} position={[f.p[0] * (W / 2 + 0.02), H * 0.45 + 2.9, f.p[2] * (W / 2 + 0.02)]} rotation={f.r}>
          <boxGeometry args={[0.8, H * 0.5, 0.1]} />
          <meshStandardMaterial color={GLASS} roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
      {/* clock band + four white clock faces */}
      <mesh position={[0, clockY + 2.9, 0]}>
        <boxGeometry args={[W + 0.3, 3, W + 0.3]} />
        <meshStandardMaterial color={STONE_LT} roughness={0.85} />
      </mesh>
      {faces.map((f, i) => (
        <group key={`clk${i}`} position={[f.p[0] * (W / 2 + 0.28), clockY + 2.9, f.p[2] * (W / 2 + 0.28)]} rotation={f.r}>
          <mesh>
            <boxGeometry args={[1.5, 1.5, 0.12]} />
            <meshStandardMaterial color={TRIM} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[1.1, 1.1, 0.06]} />
            <meshStandardMaterial color="#f7f2e4" roughness={0.5} />
          </mesh>
          {/* hands */}
          <mesh position={[0, 0.18, 0.13]}>
            <boxGeometry args={[0.08, 0.5, 0.03]} />
            <meshStandardMaterial color="#222" roughness={0.6} />
          </mesh>
          <mesh position={[0.2, 0, 0.13]}>
            <boxGeometry args={[0.42, 0.08, 0.03]} />
            <meshStandardMaterial color="#222" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* belfry with arched dark openings */}
      <mesh position={[0, H + 5.4, 0]}>
        <boxGeometry args={[W - 0.1, 3, W - 0.1]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
      {faces.map((f, i) => (
        <mesh key={`arch${i}`} position={[f.p[0] * (W / 2 - 0.02), H + 5.2, f.p[2] * (W / 2 - 0.02)]} rotation={f.r}>
          <boxGeometry args={[1.0, 2.1, 0.2]} />
          <meshStandardMaterial color="#171512" roughness={0.9} />
        </mesh>
      ))}
      {/* cornice */}
      <mesh position={[0, H + 7.1, 0]}>
        <boxGeometry args={[W + 1, 0.7, W + 1]} />
        <meshStandardMaterial color={STONE_LT} roughness={0.85} />
      </mesh>
      {/* pyramidal stone cap */}
      <mesh position={[0, H + 10.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[W * 0.98, 5.4, 4]} />
        <meshStandardMaterial color={CAP} roughness={0.8} metalness={0.05} />
      </mesh>
      {/* gold finial */}
      <mesh position={[0, H + 13.2, 0]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.25} roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}

// ---- Tree (oak-ish canopy on a trunk) -------------------------------------
function Tree({ scale, tint }: { scale: number; tint: string }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.26, 2.4, 7]} />
        <meshStandardMaterial color={TRUNK} roughness={0.95} />
      </mesh>
      <mesh position={[0, 3.4, 0]} castShadow>
        <sphereGeometry args={[1.55, 10, 9]} />
        <meshStandardMaterial color={tint} roughness={1} />
      </mesh>
      <mesh position={[0.85, 2.9, 0.25]} castShadow>
        <sphereGeometry args={[1.0, 9, 8]} />
        <meshStandardMaterial color={tint} roughness={1} />
      </mesh>
      <mesh position={[-0.7, 3.0, -0.4]} castShadow>
        <sphereGeometry args={[0.95, 9, 8]} />
        <meshStandardMaterial color={tint} roughness={1} />
      </mesh>
    </group>
  )
}

// ---- Campus lamp post (day; faint globe, not neon) ------------------------
function LampPost() {
  return (
    <group>
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.08, 0.13, 4.8, 8]} />
        <meshStandardMaterial color="#2c2f2b" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, 4.9, 0]}>
        <boxGeometry args={[0.42, 0.42, 0.42]} />
        <meshStandardMaterial color="#2c2f2b" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, 5.15, 0]}>
        <sphereGeometry args={[0.26, 10, 10]} />
        <meshStandardMaterial color="#fff6d8" emissive="#fff2c8" emissiveIntensity={0.3} roughness={0.4} />
      </mesh>
    </group>
  )
}

// ---- Campus banner (California gold) --------------------------------------
function Banner({ road, color }: { road: number; color: string }) {
  return (
    <group>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 6, 6]} />
        <meshStandardMaterial color="#3a3d38" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* arm reaches toward the road */}
      <mesh position={[road * 0.6, 4.6, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#3a3d38" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* hanging banner cloth */}
      <mesh position={[road * 1.0, 3.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.95, 2.4]} />
        <meshStandardMaterial color={color} roughness={0.75} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[road * 1.0, 4.7, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={GOLD} roughness={0.5} metalness={0.4} />
      </mesh>
    </group>
  )
}

// ---- distant wooded Berkeley-hills silhouette ------------------------------
function Hill({ position, radius, height, color }: { position: [number, number, number]; radius: number; height: number; color: string }) {
  return (
    <mesh position={position} scale={[radius, height, radius]}>
      <sphereGeometry args={[1, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0} />
    </mesh>
  )
}

export default function BerkeleyRegion({ active, band }: { active: boolean; band: RegionKey }) {
  // hero landmark — Sather Tower set well back on the right side of the band
  const tower = useMemo<Placement>(() => bandCenter(band, 24), [band])

  // collegiate halls lining both sides — real GLB City-Kit buildings recoloured
  // as stone/brick campus halls, varied in kit/height/tint. Kept clear of the
  // camera corridor via minSide >= 11. Day campus, so NO emissive.
  const hallsR = useMemo(
    () =>
      placeAlongBand(band, 5, 15, { jitterSide: 3, jitterAlong: 0.35, minSide: 11 }).map((p, i) => ({
        ...p,
        url: HALL_KIT[(i * 2) % HALL_KIT.length],
        height: 8 + hash01(i + 1) * 8, // 8–16 m
        tint: HALL_TINTS[i % HALL_TINTS.length],
      })),
    [band]
  )
  const hallsL = useMemo(
    () =>
      placeAlongBand(band, 5, -15, { jitterSide: 3, jitterAlong: 0.4, minSide: 11 }).map((p, i) => ({
        ...p,
        url: HALL_KIT[(i * 2 + 1) % HALL_KIT.length],
        height: 8 + hash01(i + 21) * 8, // 8–16 m
        tint: HALL_TINTS[(i + 2) % HALL_TINTS.length],
      })),
    [band]
  )

  // roadside oak canopies — a near row each side plus a fuller back row for depth
  const treesR = useMemo(() => placeAlongBand(band, 8, 9, { jitterSide: 1.2, jitterAlong: 0.3, minSide: 8 }), [band])
  const treesL = useMemo(() => placeAlongBand(band, 8, -9, { jitterSide: 1.2, jitterAlong: 0.35, minSide: 8 }), [band])
  const treesBackR = useMemo(() => placeAlongBand(band, 6, 30, { jitterSide: 6, jitterAlong: 0.5, minSide: 20 }), [band])
  const treesBackL = useMemo(() => placeAlongBand(band, 6, -30, { jitterSide: 6, jitterAlong: 0.5, minSide: 20 }), [band])

  // lawn strips + hedges dressing the verge (flat/low — safe close to the road)
  const lawnR = useMemo(() => placeAlongBand(band, 12, 7.2, { jitterAlong: 0.15 }), [band])
  const lawnL = useMemo(() => placeAlongBand(band, 12, -7.2, { jitterAlong: 0.15 }), [band])
  const hedgeR = useMemo(() => placeAlongBand(band, 7, 8.2, { jitterAlong: 0.3, minSide: 8 }), [band])
  const hedgeL = useMemo(() => placeAlongBand(band, 7, -8.2, { jitterAlong: 0.3, minSide: 8 }), [band])

  // campus lamp posts (alternating sides) + a couple of gold banners
  const lampsR = useMemo(() => placeAlongBand(band, 5, 8, { minSide: 8 }), [band])
  const lampsL = useMemo(() => placeAlongBand(band, 5, -8, { jitterAlong: 0.2, minSide: 8 }), [band])
  const banners = useMemo(() => placeAlongBand(band, 3, -8.5, { jitterAlong: 0.25, minSide: 8 }), [band])

  // wooded hills on the horizon (leafy Berkeley backdrop)
  const hillsR = useMemo(() => placeAlongBand(band, 3, 66, { jitterAlong: 0.5 }), [band])
  const hillsL = useMemo(() => placeAlongBand(band, 3, -70, { jitterAlong: 0.5 }), [band])

  if (!active) return null

  return (
    <group>
      {/* wooded hills far on the horizon (drawn first, farthest back) */}
      {hillsR.map((h, i) => (
        <Hill
          key={`hr${i}`}
          position={[h.position[0], -1, h.position[2]]}
          radius={34 + hash01(i + 5) * 16}
          height={14 + hash01(i + 8) * 9}
          color={i % 2 ? HILL_B : HILL_A}
        />
      ))}
      {hillsL.map((h, i) => (
        <Hill
          key={`hl${i}`}
          position={[h.position[0], -1, h.position[2]]}
          radius={34 + hash01(i + 15) * 16}
          height={14 + hash01(i + 18) * 9}
          color={i % 2 ? HILL_A : HILL_B}
        />
      ))}

      {/* hero — Sather Tower / Campanile */}
      <group position={[tower.position[0], 0, tower.position[2]]} rotation={[0, tower.yaw, 0]}>
        <Campanile />
      </group>

      {/* collegiate halls — GLB City-Kit buildings, stone/brick tinted (day, no glow) */}
      {[...hallsR, ...hallsL].map((p, i) => (
        <KitModel
          key={`hall${i}`}
          url={p.url}
          position={[p.position[0], 0, p.position[2]]}
          yaw={p.yaw}
          height={p.height}
          tint={p.tint}
        />
      ))}

      {/* lawns + hedges dressing the roadside verge */}
      {[...lawnR, ...lawnL].map((p, i) => (
        <mesh key={`lawn${i}`} position={[p.position[0], 0.08, p.position[2]]} rotation={[0, p.yaw, 0]} receiveShadow>
          <boxGeometry args={[2.4, 0.16, 4.2]} />
          <meshStandardMaterial color={LAWN} roughness={1} metalness={0} />
        </mesh>
      ))}
      {[...hedgeR, ...hedgeL].map((p, i) => (
        <mesh key={`hedge${i}`} position={[p.position[0], 0.5, p.position[2]]} rotation={[0, p.yaw, 0]} castShadow>
          <boxGeometry args={[0.9, 1.0, 3.0]} />
          <meshStandardMaterial color={HEDGE} roughness={1} metalness={0} />
        </mesh>
      ))}

      {/* trees */}
      {[...treesR, ...treesL].map((p, i) => (
        <group key={`t${i}`} position={[p.position[0], 0, p.position[2]]}>
          <Tree scale={0.9 + hash01(i + 2) * 0.5} tint={CANOPY[i % CANOPY.length]} />
        </group>
      ))}
      {[...treesBackR, ...treesBackL].map((p, i) => (
        <group key={`tb${i}`} position={[p.position[0], 0, p.position[2]]}>
          <Tree scale={1.1 + hash01(i + 11) * 0.6} tint={CANOPY[(i + 2) % CANOPY.length]} />
        </group>
      ))}

      {/* campus lamp posts */}
      {[...lampsR, ...lampsL].map((p, i) => (
        <group key={`lamp${i}`} position={[p.position[0], 0, p.position[2]]} rotation={[0, p.yaw, 0]}>
          <LampPost />
        </group>
      ))}

      {/* California-gold banners */}
      {banners.map((p, i) => (
        <group key={`ban${i}`} position={[p.position[0], 0, p.position[2]]} rotation={[0, p.yaw, 0]}>
          <Banner road={1} color={i % 2 ? GOLD : '#003262'} />
        </group>
      ))}
    </group>
  )
}

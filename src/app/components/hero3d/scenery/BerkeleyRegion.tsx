'use client'

import * as THREE from 'three'
import { useMemo } from 'react'
import { placeAlongBand, bandCenter, KitModel, preloadKits, CITY_LOW, CITY_MID, type Placement, type GouacheSpec } from './kit'
import { makeRamp } from '../toonRamp'
import type { RegionKey } from '../curve'

// Warm the GLB fetch/parse for the collegiate halls (reused City-Kit low/mid
// buildings dressed as pastel campus halls — Berkeley ships no dedicated
// campus GLBs).
preloadKits(...CITY_LOW, ...CITY_MID)

/**
 * ① UC Berkeley — the DAY campus level, origin of the drive.
 *
 * GOUACHE RESTYLE (gate frame d1-campus): the whole scene lives inside the
 * dawn-pastel reference palette — cream, lavender, blush, peach-terracotta,
 * dusty mauve. Every surface is a matte `MeshToonMaterial` shaded by a smooth
 * mauve→cream ramp (see toonRamp.ts), so shadows tint mauve and highlights
 * roll to cream instead of PBR speculars. Trees/lawns follow the REFERENCE
 * (peach/lavender/pink blobs), not real-world greens. Nothing here glows —
 * the white C63 is the only crisp object in frame.
 *
 * A pale-terracotta Sather Tower (Campanile) is the hero landmark; GLB
 * City-Kit halls get the gouache pass with nearest-of-palette quantization.
 *
 * Corridor safety: every tall prop (halls, trees, tower, lamps, banners) is
 * pushed out with `minSide >= 8` (marker sits at ±6.4, guardrail ±5.3). Only the
 * flat, low lawn/hedge dressing rides closer, and it can't clip the chase cam.
 */

// ---- d1 reference palette --------------------------------------------------
const CREAM = '#fdf1e5'
const LAVENDER = '#cfcbf0'
const BLUSH = '#f3e0e0'
const PEACH = '#d6aea1' // peach-terracotta (Campanile shaft, roofs)
const PINK = '#ecd3d0'
const MAUVE = '#aa8b93' // dusty mauve (poles, glazing)
const MAUVE_GREY = '#b19ba7'
const DEEP_MAUVE = '#8f6c75' // darkest value in frame — NO pure black anywhere

// Smooth gouache lighting ramp: deep-mauve shadows → cream highlights.
const D1_STOPS = [DEEP_MAUVE, MAUVE_GREY, PINK, CREAM]
const D1_RAMP = makeRamp(D1_STOPS)

// Gouache spec for GLB halls: parts snap to the scene palette (module-const so
// KitModel's memo stays stable).
const D1_GOUACHE: GouacheSpec = {
  ramp: D1_STOPS,
  palette: [CREAM, LAVENDER, BLUSH, PEACH, PINK, MAUVE, MAUVE_GREY, DEEP_MAUVE],
}

// GLB pool for the halls: City-Kit low + mid buildings, gouache-quantized.
const HALL_KIT = [...CITY_LOW, ...CITY_MID]
// Reference trees are pastel blobs — peach / lavender / pink / cream, NOT green.
const CANOPY = [PEACH, LAVENDER, PINK, '#e8c9ab', BLUSH]
const TRUNK = DEEP_MAUVE
const LAWN = PINK
const HEDGE = MAUVE_GREY
const HILL_A = LAVENDER
const HILL_B = MAUVE_GREY

// deterministic hash (no per-frame Math.random)
const hash01 = (n: number) => {
  const s = Math.sin(n * 74.311) * 45219.113
  return s - Math.floor(s)
}

// ---- Sather Tower / Campanile ---------------------------------------------
// Tall peach-terracotta shaft, four clock faces near the top, an arched belfry
// and a pyramidal cream cap. Matte gouache throughout — the drive's hero
// landmark reads as a soft monument, not stone masonry.
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
      {/* stepped plinth */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[W + 2.4, 2, W + 2.4]} />
        <meshToonMaterial color={PINK} gradientMap={D1_RAMP} />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[W + 1.2, 1, W + 1.2]} />
        <meshToonMaterial color={PINK} gradientMap={D1_RAMP} />
      </mesh>
      {/* main shaft — peach terracotta, like the reference tower */}
      <mesh position={[0, H / 2 + 2.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H, W]} />
        <meshToonMaterial color={PEACH} gradientMap={D1_RAMP} />
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
          <meshToonMaterial color={PINK} gradientMap={D1_RAMP} />
        </mesh>
      ))}
      {/* tall recessed shaft windows (soft mauve slots, not dark glass) */}
      {faces.map((f, i) => (
        <mesh key={`sw${i}`} position={[f.p[0] * (W / 2 + 0.02), H * 0.45 + 2.9, f.p[2] * (W / 2 + 0.02)]} rotation={f.r}>
          <boxGeometry args={[0.8, H * 0.5, 0.1]} />
          <meshToonMaterial color={MAUVE} gradientMap={D1_RAMP} />
        </mesh>
      ))}
      {/* clock band + four cream clock faces */}
      <mesh position={[0, clockY + 2.9, 0]}>
        <boxGeometry args={[W + 0.3, 3, W + 0.3]} />
        <meshToonMaterial color={PINK} gradientMap={D1_RAMP} />
      </mesh>
      {faces.map((f, i) => (
        <group key={`clk${i}`} position={[f.p[0] * (W / 2 + 0.28), clockY + 2.9, f.p[2] * (W / 2 + 0.28)]} rotation={f.r}>
          <mesh>
            <boxGeometry args={[1.5, 1.5, 0.12]} />
            <meshToonMaterial color={CREAM} gradientMap={D1_RAMP} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[1.1, 1.1, 0.06]} />
            <meshToonMaterial color={CREAM} gradientMap={D1_RAMP} />
          </mesh>
          {/* hands — deep mauve, the darkest value allowed in frame */}
          <mesh position={[0, 0.18, 0.13]}>
            <boxGeometry args={[0.08, 0.5, 0.03]} />
            <meshToonMaterial color={DEEP_MAUVE} gradientMap={D1_RAMP} />
          </mesh>
          <mesh position={[0.2, 0, 0.13]}>
            <boxGeometry args={[0.42, 0.08, 0.03]} />
            <meshToonMaterial color={DEEP_MAUVE} gradientMap={D1_RAMP} />
          </mesh>
        </group>
      ))}
      {/* belfry with arched openings (deep-mauve recesses, not black) */}
      <mesh position={[0, H + 5.4, 0]}>
        <boxGeometry args={[W - 0.1, 3, W - 0.1]} />
        <meshToonMaterial color={PEACH} gradientMap={D1_RAMP} />
      </mesh>
      {faces.map((f, i) => (
        <mesh key={`arch${i}`} position={[f.p[0] * (W / 2 - 0.02), H + 5.2, f.p[2] * (W / 2 - 0.02)]} rotation={f.r}>
          <boxGeometry args={[1.0, 2.1, 0.2]} />
          <meshToonMaterial color={DEEP_MAUVE} gradientMap={D1_RAMP} />
        </mesh>
      ))}
      {/* cornice */}
      <mesh position={[0, H + 7.1, 0]}>
        <boxGeometry args={[W + 1, 0.7, W + 1]} />
        <meshToonMaterial color={PINK} gradientMap={D1_RAMP} />
      </mesh>
      {/* pyramidal cap — cream, like the reference spire */}
      <mesh position={[0, H + 10.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[W * 0.98, 5.4, 4]} />
        <meshToonMaterial color={PINK} gradientMap={D1_RAMP} />
      </mesh>
      {/* finial — matte cream, no glow (nothing emits in this level) */}
      <mesh position={[0, H + 13.2, 0]}>
        <sphereGeometry args={[0.28, 10, 10]} />
        <meshToonMaterial color={CREAM} gradientMap={D1_RAMP} />
      </mesh>
    </group>
  )
}

// ---- Tree (soft pastel blob canopy on a mauve trunk) -----------------------
function Tree({ scale, tint }: { scale: number; tint: string }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.26, 2.4, 7]} />
        <meshToonMaterial color={TRUNK} gradientMap={D1_RAMP} />
      </mesh>
      <mesh position={[0, 3.4, 0]} castShadow>
        <sphereGeometry args={[1.55, 12, 10]} />
        <meshToonMaterial color={tint} gradientMap={D1_RAMP} />
      </mesh>
      <mesh position={[0.85, 2.9, 0.25]} castShadow>
        <sphereGeometry args={[1.0, 10, 9]} />
        <meshToonMaterial color={tint} gradientMap={D1_RAMP} />
      </mesh>
      <mesh position={[-0.7, 3.0, -0.4]} castShadow>
        <sphereGeometry args={[0.95, 10, 9]} />
        <meshToonMaterial color={tint} gradientMap={D1_RAMP} />
      </mesh>
    </group>
  )
}

// ---- Campus lamp post (matte — a shape, not a light source at dawn) --------
function LampPost() {
  return (
    <group>
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.08, 0.13, 4.8, 8]} />
        <meshToonMaterial color={MAUVE} gradientMap={D1_RAMP} />
      </mesh>
      <mesh position={[0, 4.9, 0]}>
        <boxGeometry args={[0.42, 0.42, 0.42]} />
        <meshToonMaterial color={MAUVE} gradientMap={D1_RAMP} />
      </mesh>
      <mesh position={[0, 5.15, 0]}>
        <sphereGeometry args={[0.26, 10, 10]} />
        <meshToonMaterial color={CREAM} gradientMap={D1_RAMP} />
      </mesh>
    </group>
  )
}

// ---- Campus banner (soft palette cloth — no gold/navy pop) -----------------
function Banner({ road, color }: { road: number; color: string }) {
  return (
    <group>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 6, 6]} />
        <meshToonMaterial color={MAUVE} gradientMap={D1_RAMP} />
      </mesh>
      {/* arm reaches toward the road */}
      <mesh position={[road * 0.6, 4.6, 0]}>
        <boxGeometry args={[1.2, 0.08, 0.08]} />
        <meshToonMaterial color={MAUVE} gradientMap={D1_RAMP} />
      </mesh>
      {/* hanging banner cloth */}
      <mesh position={[road * 1.0, 3.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.95, 2.4]} />
        <meshToonMaterial color={color} gradientMap={D1_RAMP} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[road * 1.0, 4.7, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshToonMaterial color={CREAM} gradientMap={D1_RAMP} />
      </mesh>
    </group>
  )
}

// ---- distant hills — lavender/mauve silhouettes, Monument Valley depth -----
function Hill({ position, radius, height, color }: { position: [number, number, number]; radius: number; height: number; color: string }) {
  return (
    <mesh position={position} scale={[radius, height, radius]}>
      <sphereGeometry args={[1, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshToonMaterial color={color} gradientMap={D1_RAMP} />
    </mesh>
  )
}

export default function BerkeleyRegion({ active, band }: { active: boolean; band: RegionKey }) {
  // hero landmark — Sather Tower set well back on the right side of the band
  const tower = useMemo<Placement>(() => bandCenter(band, 24), [band])

  // collegiate halls lining both sides — real GLB City-Kit buildings run through
  // the gouache pass (nearest-of-palette quantization), varied in kit/height.
  // Kept clear of the camera corridor via minSide >= 11. Day campus, no emissive.
  const hallsR = useMemo(
    () =>
      placeAlongBand(band, 5, 15, { jitterSide: 3, jitterAlong: 0.35, minSide: 11 }).map((p, i) => ({
        ...p,
        url: HALL_KIT[(i * 2) % HALL_KIT.length],
        height: 8 + hash01(i + 1) * 8, // 8–16 m
      })),
    [band]
  )
  const hallsL = useMemo(
    () =>
      placeAlongBand(band, 5, -15, { jitterSide: 3, jitterAlong: 0.4, minSide: 11 }).map((p, i) => ({
        ...p,
        url: HALL_KIT[(i * 2 + 1) % HALL_KIT.length],
        height: 8 + hash01(i + 21) * 8, // 8–16 m
      })),
    [band]
  )

  // roadside pastel canopies — a near row each side plus a fuller back row for depth
  const treesR = useMemo(() => placeAlongBand(band, 8, 9, { jitterSide: 1.2, jitterAlong: 0.3, minSide: 8 }), [band])
  const treesL = useMemo(() => placeAlongBand(band, 8, -9, { jitterSide: 1.2, jitterAlong: 0.35, minSide: 8 }), [band])
  const treesBackR = useMemo(() => placeAlongBand(band, 6, 30, { jitterSide: 6, jitterAlong: 0.5, minSide: 20 }), [band])
  const treesBackL = useMemo(() => placeAlongBand(band, 6, -30, { jitterSide: 6, jitterAlong: 0.5, minSide: 20 }), [band])

  // lawn strips + hedges dressing the verge (flat/low — safe close to the road)
  const lawnR = useMemo(() => placeAlongBand(band, 12, 7.2, { jitterAlong: 0.15 }), [band])
  const lawnL = useMemo(() => placeAlongBand(band, 12, -7.2, { jitterAlong: 0.15 }), [band])
  const hedgeR = useMemo(() => placeAlongBand(band, 7, 8.2, { jitterAlong: 0.3, minSide: 8 }), [band])
  const hedgeL = useMemo(() => placeAlongBand(band, 7, -8.2, { jitterAlong: 0.3, minSide: 8 }), [band])

  // campus lamp posts (alternating sides) + a couple of soft banners
  const lampsR = useMemo(() => placeAlongBand(band, 5, 8, { minSide: 8 }), [band])
  const lampsL = useMemo(() => placeAlongBand(band, 5, -8, { jitterAlong: 0.2, minSide: 8 }), [band])
  const banners = useMemo(() => placeAlongBand(band, 3, -8.5, { jitterAlong: 0.25, minSide: 8 }), [band])

  // lavender hills on the horizon (dawn backdrop)
  const hillsR = useMemo(() => placeAlongBand(band, 3, 66, { jitterAlong: 0.5 }), [band])
  const hillsL = useMemo(() => placeAlongBand(band, 3, -70, { jitterAlong: 0.5 }), [band])

  if (!active) return null

  return (
    <group>
      {/* hills far on the horizon (drawn first, farthest back) */}
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

      {/* collegiate halls — GLB City-Kit buildings, gouache palette pass (day, no glow) */}
      {[...hallsR, ...hallsL].map((p, i) => (
        <KitModel
          key={`hall${i}`}
          url={p.url}
          position={[p.position[0], 0, p.position[2]]}
          yaw={p.yaw}
          height={p.height}
          gouache={D1_GOUACHE}
        />
      ))}

      {/* lawns + hedges dressing the roadside verge */}
      {[...lawnR, ...lawnL].map((p, i) => (
        <mesh key={`lawn${i}`} position={[p.position[0], 0.08, p.position[2]]} rotation={[0, p.yaw, 0]} receiveShadow>
          <boxGeometry args={[2.4, 0.16, 4.2]} />
          <meshToonMaterial color={LAWN} gradientMap={D1_RAMP} />
        </mesh>
      ))}
      {[...hedgeR, ...hedgeL].map((p, i) => (
        <mesh key={`hedge${i}`} position={[p.position[0], 0.5, p.position[2]]} rotation={[0, p.yaw, 0]} castShadow>
          <boxGeometry args={[0.9, 1.0, 3.0]} />
          <meshToonMaterial color={HEDGE} gradientMap={D1_RAMP} />
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

      {/* soft palette banners (peach / deep mauve — the old gold/navy pop is gone) */}
      {banners.map((p, i) => (
        <group key={`ban${i}`} position={[p.position[0], 0, p.position[2]]} rotation={[0, p.yaw, 0]}>
          <Banner road={1} color={i % 2 ? PEACH : DEEP_MAUVE} />
        </group>
      ))}
    </group>
  )
}

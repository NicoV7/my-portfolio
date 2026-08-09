'use client'

import { useMemo } from 'react'
import { placeAlongBand, bandCenter, NeonSign, CitySkyline, KitModel, preloadKits, type GouacheSpec } from './kit'
import { makeRamp } from '../toonRamp'

// Real CC0 tuner cars (Quaternius Cars Bundle) parked at the meet.
const CAR_KIT = [
  'sports-car',
  'car',
  'suv',
  'taxi',
  'police-car',
  'sports-car-1mkmfkaz5v',
  'car-unqqkultru',
].map((n) => `/models/kits/cars/${n}.glb`)
preloadKits(...CAR_KIT)

/**
 * ④ Night tuner-culture street meet.
 *
 * GOUACHE RESTYLE (gate frame d2-tuner): everything is matte near-black indigo
 * (#050819…#374b77) shaded by a smooth indigo→periwinkle toon ramp — soft
 * gouache night, not glossy PBR. The ONLY hot elements are the neon signage in
 * emissive magenta (#ff3da0) / cyan (#35e0ff), plus the warm festival
 * string-light bulbs the reference frame hangs across the street. Parked cars
 * are matte periwinkle/slate silhouettes (no underglow, no lit headlights),
 * so the white C63 and the neons carry the frame.
 *
 * Fully deterministic — all randomness comes from a stable hash, never per-frame.
 */

// ---- d2 reference palette --------------------------------------------------
const INK = '#0a1029' // deep indigo shadow (never pure black)
const INDIGO = '#121632'
const VIOLET_NAVY = '#201b3e'
const VIOLET = '#333159'
const SLATE = '#1d315d'
const SLATE_LT = '#374b77'
const PERIWINKLE = '#7483ab'

// accent neons — EMISSIVE only, the sole hot colors in the level
const MAGENTA = '#ff3da0'
const CYAN = '#35e0ff'
const NEONS = [MAGENTA, CYAN]
// warm festival bulbs (reference: string lights over the street)
const BULB = '#ffdfae'

// Smooth gouache night ramp: ink shadow → periwinkle-lit highlight.
const D2_STOPS = [INK, VIOLET_NAVY, SLATE_LT, '#96a3c8']
const D2_RAMP = makeRamp(D2_STOPS)

// Parked street cars quantize to the matte periwinkle/slate family.
const D2_CAR_GOUACHE: GouacheSpec = {
  ramp: D2_STOPS,
  palette: [PERIWINKLE, SLATE_LT, VIOLET, SLATE, VIOLET_NAVY],
}
// Background skyline quantizes darker — silhouettes, not subjects.
const D2_CITY_GOUACHE: GouacheSpec = {
  ramp: D2_STOPS,
  palette: [INDIGO, VIOLET_NAVY, SLATE, VIOLET],
}

/** Stable per-index pseudo-random in [0,1). No per-frame Math.random. */
const hash01 = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}
const pick = <T,>(arr: T[], n: number): T => arr[Math.floor(hash01(n) * arr.length) % arr.length]

/** Low-poly matte tuner car: body + cabin + 4 wheels, length along local +z. */
function CarSilhouette({
  position,
  yaw = 0,
  color = VIOLET_NAVY,
  underglow,
  scale = 1,
  poppedHood = false,
}: {
  position: [number, number, number]
  yaw?: number
  color?: string
  underglow?: string
  scale?: number
  poppedHood?: boolean
}) {
  const wheelX = 0.82
  const wheelZ = 1.35
  return (
    <group position={position} rotation={[0, yaw, 0]} scale={scale}>
      {/* low body — matte gouache, no metallic paint */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.7, 4]} />
        <meshToonMaterial color={color} gradientMap={D2_RAMP} />
      </mesh>
      {/* cabin / greenhouse */}
      <mesh position={[0, 1.05, -0.2]} castShadow>
        <boxGeometry args={[1.55, 0.6, 2.1]} />
        <meshToonMaterial color={INK} gradientMap={D2_RAMP} />
      </mesh>
      {/* windshield */}
      <mesh position={[0, 1.05, 0.86]} rotation={[0.5, 0, 0]}>
        <planeGeometry args={[1.4, 0.7]} />
        <meshToonMaterial color={SLATE} gradientMap={D2_RAMP} />
      </mesh>
      {/* front splitter / lip */}
      <mesh position={[0, 0.24, 2.02]}>
        <boxGeometry args={[1.9, 0.1, 0.3]} />
        <meshToonMaterial color={INK} gradientMap={D2_RAMP} />
      </mesh>
      {/* headlight bars — parked & off: matte periwinkle glints, not lights */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.6, 2.0]}>
          <boxGeometry args={[0.36, 0.12, 0.06]} />
          <meshToonMaterial color={PERIWINKLE} gradientMap={D2_RAMP} />
        </mesh>
      ))}
      {/* rear tail bar — off */}
      <mesh position={[0, 0.62, -1.98]}>
        <boxGeometry args={[1.55, 0.14, 0.06]} />
        <meshToonMaterial color={VIOLET} gradientMap={D2_RAMP} />
      </mesh>
      {/* rear wing */}
      <mesh position={[0, 1.02, -1.95]}>
        <boxGeometry args={[1.7, 0.08, 0.4]} />
        <meshToonMaterial color={INK} gradientMap={D2_RAMP} />
      </mesh>
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0.86, -1.95]}>
          <boxGeometry args={[0.08, 0.34, 0.2]} />
          <meshToonMaterial color={INK} gradientMap={D2_RAMP} />
        </mesh>
      ))}
      {/* popped hood */}
      {poppedHood && (
        <mesh position={[0, 0.98, 1.15]} rotation={[-0.55, 0, 0]}>
          <boxGeometry args={[1.6, 0.06, 1.3]} />
          <meshToonMaterial color={color} gradientMap={D2_RAMP} />
        </mesh>
      )}
      {/* engine-bay glow if hood popped (cyan — allowed neon accent) */}
      {poppedHood && (
        <mesh position={[0, 0.62, 1.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.3, 1.0]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      )}
      {/* 4 wheels (axis along x) */}
      {[
        [-wheelX, 0.34, wheelZ],
        [wheelX, 0.34, wheelZ],
        [-wheelX, 0.34, -wheelZ],
        [wheelX, 0.34, -wheelZ],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.28, 12]} />
          <meshToonMaterial color={INK} gradientMap={D2_RAMP} />
        </mesh>
      ))}
      {/* underglow strip — garage showpieces only (magenta/cyan neon accent) */}
      {underglow && (
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[1.7, 0.06, 3.7]} />
          <meshStandardMaterial color={underglow} emissive={underglow} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

/** Stacked vertical JDM storefront neon sign (Japanese-shopfront feel). */
function JdmStackSign({
  position,
  yaw = 0,
  seed = 0,
}: {
  position: [number, number, number]
  yaw?: number
  seed?: number
}) {
  const rows = 3 + Math.floor(hash01(seed) * 3) // 3..5 stacked panels
  const w = 0.9
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* matte indigo backing pole */}
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[w + 0.25, rows * 0.95 + 0.4, 0.18]} />
        <meshToonMaterial color={INK} gradientMap={D2_RAMP} />
      </mesh>
      {Array.from({ length: rows }).map((_, r) => {
        const c = NEONS[Math.floor(hash01(seed * 7 + r) * NEONS.length)]
        const y = (r - (rows - 1) / 2) * 0.95
        return (
          <mesh key={r} position={[0, y, 0]}>
            <planeGeometry args={[w, 0.72]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3.2} toneMapped={false} />
          </mesh>
        )
      })}
    </group>
  )
}

/** Torii-like neon gate arching over the road — landmark, spans the carriageway. */
function ToriiGate({ position, yaw = 0 }: { position: [number, number, number]; yaw?: number }) {
  const px = 7.4 // pillar offset from road center (local x) — clears the ~9.2u carriageway
  const H = 8.4
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* two matte pillars */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * px, H / 2, 0]} castShadow>
            <boxGeometry args={[0.7, H, 0.7]} />
            <meshToonMaterial color={VIOLET_NAVY} gradientMap={D2_RAMP} />
          </mesh>
          {/* vertical neon tube running up the pillar */}
          <mesh position={[s * px - s * 0.4, H / 2, 0.36]}>
            <boxGeometry args={[0.1, H - 0.6, 0.1]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={3.4} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* kasagi — top beam (slight overhang past pillars) */}
      <mesh position={[0, H + 0.3, 0]}>
        <boxGeometry args={[px * 2 + 2.2, 0.7, 1.0]} />
        <meshToonMaterial color={VIOLET_NAVY} gradientMap={D2_RAMP} />
      </mesh>
      {/* nuki — lower cross beam */}
      <mesh position={[0, H - 1.1, 0]}>
        <boxGeometry args={[px * 2 + 0.4, 0.5, 0.8]} />
        <meshToonMaterial color={VIOLET_NAVY} gradientMap={D2_RAMP} />
      </mesh>
      {/* neon edge on the top beam */}
      <mesh position={[0, H + 0.66, 0.52]}>
        <boxGeometry args={[px * 2 + 2.0, 0.12, 0.1]} />
        <meshStandardMaterial color={MAGENTA} emissive={MAGENTA} emissiveIntensity={3.8} toneMapped={false} />
      </mesh>
      <mesh position={[0, H - 0.86, 0.42]}>
        <boxGeometry args={[px * 2 + 0.2, 0.1, 0.1]} />
        <meshStandardMaterial color={MAGENTA} emissive={MAGENTA} emissiveIntensity={3.6} toneMapped={false} />
      </mesh>
      {/* center hanging shop sign */}
      <NeonSign position={[0, H - 2.4, 0.5]} size={[2.6, 1.2]} color={CYAN} intensity={3.6} />
    </group>
  )
}

/** Festival string-lights sagging across the road — warm bulbs (reference). */
function StringLights({
  position,
  yaw = 0,
  span = 15,
  bulbs = 13,
}: {
  position: [number, number, number]
  yaw?: number
  span?: number
  bulbs?: number
}) {
  const sag = 2.2
  const y0 = 7.2
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {Array.from({ length: bulbs }).map((_, i) => {
        const u = i / (bulbs - 1) // 0..1 across span
        const x = (u - 0.5) * span
        const dip = Math.sin(u * Math.PI) * sag // catenary-ish sag
        return (
          <mesh key={i} position={[x, y0 - dip, 0]}>
            <sphereGeometry args={[0.13, 8, 8]} />
            <meshStandardMaterial color={BULB} emissive={BULB} emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        )
      })}
    </group>
  )
}

/** Low overpass the car drives beneath — matte indigo deck, neon accents only. */
function Overpass({ position, yaw = 0 }: { position: [number, number, number]; yaw?: number }) {
  const deckW = 17 // across-road span (local x)
  const y = 5.4
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* deck */}
      <mesh position={[0, y, 0]} castShadow>
        <boxGeometry args={[deckW, 1.1, 5]} />
        <meshToonMaterial color={INDIGO} gradientMap={D2_RAMP} />
      </mesh>
      {/* support pillars */}
      {[-7.6, 7.6].map((x) => (
        <mesh key={x} position={[x, y / 2, 0]} castShadow>
          <boxGeometry args={[0.7, y, 0.9]} />
          <meshToonMaterial color={INDIGO} gradientMap={D2_RAMP} />
        </mesh>
      ))}
      {/* graffiti-ish emissive tags on the pillars + deck face */}
      {[-7.6, 7.6].map((x, i) => (
        <mesh key={`g${x}`} position={[x, 2.2 + i * 0.4, 0.47]}>
          <planeGeometry args={[0.9, 1.6]} />
          <meshStandardMaterial
            color={i ? MAGENTA : CYAN}
            emissive={i ? MAGENTA : CYAN}
            emissiveIntensity={2.2}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh position={[-2.4, y, 2.55]}>
        <planeGeometry args={[5, 0.7]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2} transparent opacity={0.8} toneMapped={false} />
      </mesh>
      {/* neon strip lighting under the deck */}
      {[-1.9, 1.9].map((z, i) => (
        <mesh key={z} position={[0, y - 0.62, z]}>
          <boxGeometry args={[deckW - 0.6, 0.14, 0.14]} />
          <meshStandardMaterial
            color={i ? CYAN : MAGENTA}
            emissive={i ? CYAN : MAGENTA}
            emissiveIntensity={3.6}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* dripping neon runners down the pillars */}
      {[-7.6, 7.6].map((x) => (
        <mesh key={`d${x}`} position={[x, y - 1.6, 0.46]}>
          <boxGeometry args={[0.08, 2.4, 0.08]} />
          <meshStandardMaterial color={MAGENTA} emissive={MAGENTA} emissiveIntensity={3} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/** Hero neon tuner garage: two open roll-up bays, interior glow, lift, tool wall, sign. */
function TunerGarage({ position, yaw = 0 }: { position: [number, number, number]; yaw?: number }) {
  const L = 13 // width along the road (local z)
  const D = 8 // depth into the lot (local x)
  const H = 6.6
  const cx = D / 2 - 2 // building center x; open front face sits at local x = -2
  const back = cx + D / 2
  const bays = [-L / 3, L / 3] // two roll-up door bays
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* back wall */}
      <mesh position={[back, H / 2, 0]} castShadow>
        <boxGeometry args={[0.4, H, L]} />
        <meshToonMaterial color={INDIGO} gradientMap={D2_RAMP} />
      </mesh>
      {/* side walls */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[cx, H / 2, s * (L / 2)]} castShadow>
          <boxGeometry args={[D, H, 0.4]} />
          <meshToonMaterial color={INDIGO} gradientMap={D2_RAMP} />
        </mesh>
      ))}
      {/* center divider between the two bays (front face) */}
      <mesh position={[-1.6, H / 2, 0]}>
        <boxGeometry args={[1.4, H, 0.5]} />
        <meshToonMaterial color={INDIGO} gradientMap={D2_RAMP} />
      </mesh>
      {/* roof */}
      <mesh position={[cx, H, 0]} castShadow>
        <boxGeometry args={[D + 0.2, 0.4, L + 0.2]} />
        <meshToonMaterial color={INK} gradientMap={D2_RAMP} />
      </mesh>
      {/* roof-edge neon band (landmark glow) */}
      <mesh position={[-2, H + 0.05, 0]}>
        <boxGeometry args={[0.16, 0.16, L + 0.2]} />
        <meshStandardMaterial color={MAGENTA} emissive={MAGENTA} emissiveIntensity={3.6} toneMapped={false} />
      </mesh>
      {/* floor slab */}
      <mesh position={[cx, 0.03, 0]}>
        <boxGeometry args={[D, 0.06, L]} />
        <meshToonMaterial color={VIOLET_NAVY} gradientMap={D2_RAMP} />
      </mesh>

      {/* interior glow — dim cyan wash, not a flat lightbox (gouache: soft pools) */}
      <mesh position={[back - 0.25, H / 2 - 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[L - 1.2, H - 1]} />
        <meshStandardMaterial color="#0f2733" emissive={CYAN} emissiveIntensity={0.35} />
      </mesh>
      {/* tool wall — pegboard of small neon tool glints on the back wall */}
      {Array.from({ length: 18 }).map((_, i) => {
        const zc = (i % 6) * 1.4 - 3.5
        const yc = 2.4 + Math.floor(i / 6) * 1.0
        const c = pick(NEONS, i + 3)
        return (
          <mesh key={`tool${i}`} position={[back - 0.35, yc, zc]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.35, 0.5]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.7} />
          </mesh>
        )
      })}
      {/* interior ceiling strip lights — warm, modest (not a hot element) */}
      {[-3.5, -1.2, 1.2, 3.5].map((z) => (
        <mesh key={z} position={[cx, H - 0.4, z]}>
          <boxGeometry args={[D - 1, 0.1, 0.16]} />
          <meshStandardMaterial color={BULB} emissive={BULB} emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      ))}

      {/* ROLL-UP DOORS rolled up into segmented bundles above each bay (axis along local z) */}
      {bays.map((bz) => (
        <mesh key={`roll${bz}`} position={[-2, H - 0.6, bz]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 4.4, 16]} />
          <meshToonMaterial color={VIOLET_NAVY} gradientMap={D2_RAMP} />
        </mesh>
      ))}
      {/* a couple of hanging door panel segments per bay (partially lowered top slats) */}
      {bays.map((bz) =>
        [0, 1].map((i) => (
          <mesh key={`slat${bz}-${i}`} position={[-2, H - 1.5 - i * 0.34, bz]}>
            <boxGeometry args={[0.12, 0.3, 4.2]} />
            <meshToonMaterial color={VIOLET} gradientMap={D2_RAMP} />
          </mesh>
        ))
      )}

      {/* 2-POST CAR LIFT (far bay) with a raised car on the platform */}
      {[-1.1, 1.1].map((z) => (
        <mesh key={z} position={[cx + 0.5, 2.1, L / 3 + z]}>
          <boxGeometry args={[0.28, 4.2, 0.28]} />
          <meshToonMaterial color={SLATE_LT} gradientMap={D2_RAMP} />
        </mesh>
      ))}
      <mesh position={[cx + 0.5, 3.2, L / 3]}>
        <boxGeometry args={[3.2, 0.18, 2.4]} />
        <meshToonMaterial color={INDIGO} gradientMap={D2_RAMP} />
      </mesh>
      <CarSilhouette position={[cx + 0.5, 3.35, L / 3]} yaw={0} color={SLATE} underglow={CYAN} scale={0.82} />

      {/* a project car sitting in the near bay, hood popped */}
      <CarSilhouette position={[cx + 0.2, 0, -L / 3]} yaw={0} color={VIOLET} underglow={MAGENTA} poppedHood scale={0.9} />

      {/* neon JDM shop sign banner mounted on the facade above the openings */}
      <NeonSign position={[-2.2, H - 0.55, 0]} yaw={-Math.PI / 2} size={[6.2, 1.0]} color={MAGENTA} intensity={3.8} />
      <NeonSign position={[-2.2, H - 1.9, L / 2 - 1.4]} yaw={-Math.PI / 2} size={[1.4, 2.4]} color={CYAN} intensity={3.2} />

      {/* facade accent tubes framing the whole opening */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[-2, H / 2, s * (L / 2 - 0.15)]}>
          <boxGeometry args={[0.08, H - 0.4, 0.1]} />
          <meshStandardMaterial color={MAGENTA} emissive={MAGENTA} emissiveIntensity={3} toneMapped={false} />
        </mesh>
      ))}

      {/* wet-floor reflective glow puddle spilling out front — y=0.11 keeps it
          clear ABOVE the floor slab (box spans y 0→0.06) so the two emissive/lit
          ground planes don't z-fight where they overlap at the bay mouth. */}
      <mesh position={[-4.6, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, L - 1]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.85} transparent opacity={0.45} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function TunerRegion({ active }: { active: boolean }) {
  // garage pulled in so its lit open bay frames the stop (buildings now clear the corridor)
  const garage = useMemo(() => bandCenter('tuner', 10), [])

  // side 7.8 (±jitter → 7.1–8.5), minSide 7.5 keeps the parked rows clear of the
  // guardrail (5.3) / asphalt (4.6).
  const carsRight = useMemo(
    () => placeAlongBand('tuner', 7, 7.8, { jitterAlong: 0.5, jitterSide: 0.7, minSide: 7.5 }),
    []
  )
  const carsLeft = useMemo(
    () => placeAlongBand('tuner', 6, -7.8, { jitterAlong: 0.5, jitterSide: 0.7, minSide: 7.5 }),
    []
  )
  // Near-road storefront props: floor |side| at 8 so inward jitter (8.5−1.4=7.1)
  // can't creep toward the stop interior (marker at 6.4) / carriageway.
  const signsRight = useMemo(
    () => placeAlongBand('tuner', 8, 8.5, { jitterAlong: 0.35, jitterSide: 1.4, minSide: 8 }),
    []
  )
  const signsLeft = useMemo(
    () => placeAlongBand('tuner', 7, -8.5, { jitterAlong: 0.35, jitterSide: 1.4, minSide: 8 }),
    []
  )
  const overpasses = useMemo(() => placeAlongBand('tuner', 3, 0), [])
  // torii arches over the stop (band centre), the meet's signature landmark
  const gate = useMemo(() => bandCenter('tuner', 0), [])
  const strings = useMemo(() => placeAlongBand('tuner', 5, 0, { jitterAlong: 0.2 }), [])

  if (!active) return null

  return (
    <group>
      {/* real GLB city skyline behind the meet — gouache-quantized to the indigo
          family (silhouettes with a faint magenta window tint), clamped well off
          the chase-cam corridor (farSide 30 / midSide 20 / nearSide 16) */}
      <CitySkyline band="tuner" windowColor={MAGENTA} farSide={30} midSide={20} nearSide={16} gouache={D2_CITY_GOUACHE} />

      {/* stacked JDM storefront neon lining both sides */}
      {signsRight.map((p, i) => (
        <JdmStackSign key={`sr${i}`} position={[p.position[0], 3 + hash01(i) * 1.5, p.position[2]]} yaw={p.yaw + Math.PI / 2} seed={i + 1} />
      ))}
      {signsLeft.map((p, i) => (
        <JdmStackSign key={`sl${i}`} position={[p.position[0], 3 + hash01(i + 40) * 1.5, p.position[2]]} yaw={p.yaw - Math.PI / 2} seed={i + 20} />
      ))}

      {/* horizontal neon storefront bars for extra glow */}
      {signsRight.map((p, i) => (
        <NeonSign
          key={`nr${i}`}
          position={[p.position[0], 1.6, p.position[2]]}
          yaw={p.yaw + Math.PI / 2}
          size={[2.4, 0.5]}
          color={NEONS[i % NEONS.length]}
          intensity={3}
        />
      ))}
      {signsLeft.map((p, i) => (
        <NeonSign
          key={`nl${i}`}
          position={[p.position[0], 2.1, p.position[2]]}
          yaw={p.yaw - Math.PI / 2}
          size={[2.2, 0.5]}
          color={NEONS[(i + 1) % NEONS.length]}
          intensity={3}
        />
      ))}

      {/* parked GLB tuner cars lining both curbs — matte periwinkle/slate gouache
          silhouettes (reference: no underglow, no lit lamps — the neon carries) */}
      {carsRight.map((p, i) => (
        <KitModel
          key={`cr${i}`}
          url={CAR_KIT[i % CAR_KIT.length]}
          position={p.position}
          yaw={p.yaw}
          height={1.5}
          gouache={D2_CAR_GOUACHE}
        />
      ))}
      {carsLeft.map((p, i) => (
        <KitModel
          key={`cl${i}`}
          url={CAR_KIT[(i + 3) % CAR_KIT.length]}
          position={p.position}
          yaw={p.yaw + Math.PI}
          height={1.5}
          gouache={D2_CAR_GOUACHE}
        />
      ))}

      {/* Overhead elements spread to distinct points so they never pile up: overpass
          ≈f0.0, torii at the stop (f0.5), string-lights ≈f0.75/1.0. */}

      {/* single low underpass with neon tags (near-end of the band) */}
      <Overpass position={overpasses[0].position} yaw={overpasses[0].yaw} />

      {/* single torii-like neon gate arching over the road (landmark) */}
      <ToriiGate position={gate.position} yaw={gate.yaw} />

      {/* hanging festival string-lights across the road (far half, clear of the torii) */}
      {strings.slice(3).map((p, i) => (
        <StringLights key={`str${i}`} position={[p.position[0], 0, p.position[2]]} yaw={p.yaw} />
      ))}

      {/* HERO: the neon tuner garage */}
      <TunerGarage position={garage.position} yaw={garage.yaw} />
    </group>
  )
}

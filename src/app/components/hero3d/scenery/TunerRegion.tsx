'use client'

import { useMemo } from 'react'
import { placeAlongBand, bandCenter, NeonSign, CitySkyline, KitModel, preloadKits } from './kit'

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
 * ④ Night tuner-culture street meet — Fast & Furious underground vibe.
 *
 * Iconic hero landmark: a big two-bay neon TUNER GARAGE with open roll-up doors,
 * interior glow spilling onto a wet street, a 2-post car lift, a tool wall and a
 * JDM shop sign. The street is a dense meet: rows of low parked tuner cars with
 * colored underglow pools bleeding onto the wet asphalt, some with popped hoods
 * and roof light bars; stacked Japanese storefront neon; a glowing torii gate
 * arching over the road; hanging festival string-lights; a graffiti-tagged neon
 * underpass; and a real GLB city skyline (CitySkyline) with magenta window-glow
 * set well back behind the meet, clamped clear of the chase-cam corridor.
 * Fully deterministic — all randomness comes from a stable hash, never per-frame.
 */

const MAGENTA = '#ff2fd0'
const CYAN = '#22e0ff'
const PURPLE = '#b04cff'
const HOTPINK = '#ff1e6b'
const NEONS = [MAGENTA, CYAN, PURPLE]
const CAR_HUES = ['#ff2fd0', '#22e0ff', '#b04cff', '#ff1e6b', '#39ff14', '#ffae00']

/** Stable per-index pseudo-random in [0,1). No per-frame Math.random. */
const hash01 = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}
const pick = <T,>(arr: T[], n: number): T => arr[Math.floor(hash01(n) * arr.length) % arr.length]

/** Low-poly tuner car: body + cabin + 4 wheels, length along local +z. */
function CarSilhouette({
  position,
  yaw = 0,
  color = '#12131a',
  underglow,
  scale = 1,
  poppedHood = false,
  lightBar,
}: {
  position: [number, number, number]
  yaw?: number
  color?: string
  underglow?: string
  scale?: number
  poppedHood?: boolean
  lightBar?: string
}) {
  const wheelX = 0.82
  const wheelZ = 1.35
  return (
    <group position={position} rotation={[0, yaw, 0]} scale={scale}>
      {/* low body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.7, 4]} />
        <meshStandardMaterial color={color} metalness={0.75} roughness={0.28} />
      </mesh>
      {/* cabin / greenhouse */}
      <mesh position={[0, 1.05, -0.2]} castShadow>
        <boxGeometry args={[1.55, 0.6, 2.1]} />
        <meshStandardMaterial color="#05060b" metalness={0.4} roughness={0.15} />
      </mesh>
      {/* windshield tint glow (subtle) */}
      <mesh position={[0, 1.05, 0.86]} rotation={[0.5, 0, 0]}>
        <planeGeometry args={[1.4, 0.7]} />
        <meshStandardMaterial color="#0a1a22" metalness={0.2} roughness={0.1} />
      </mesh>
      {/* front splitter / lip */}
      <mesh position={[0, 0.24, 2.02]}>
        <boxGeometry args={[1.9, 0.1, 0.3]} />
        <meshStandardMaterial color="#050509" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* headlight bars */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.6, 2.0]}>
          <boxGeometry args={[0.36, 0.12, 0.06]} />
          {/* near-white base — keep intensity low so it doesn't blow past the
              0.72 bloom threshold into a solid white blob */}
          <meshStandardMaterial color="#dff6ff" emissive="#dff6ff" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      ))}
      {/* rear tail bar */}
      <mesh position={[0, 0.62, -1.98]}>
        <boxGeometry args={[1.55, 0.14, 0.06]} />
        <meshStandardMaterial color="#ff1133" emissive="#ff1133" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      {/* rear wing */}
      <mesh position={[0, 1.02, -1.95]}>
        <boxGeometry args={[1.7, 0.08, 0.4]} />
        <meshStandardMaterial color="#08080d" metalness={0.6} roughness={0.4} />
      </mesh>
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0.86, -1.95]}>
          <boxGeometry args={[0.08, 0.34, 0.2]} />
          <meshStandardMaterial color="#08080d" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* popped hood */}
      {poppedHood && (
        <mesh position={[0, 0.98, 1.15]} rotation={[-0.55, 0, 0]}>
          <boxGeometry args={[1.6, 0.06, 1.3]} />
          <meshStandardMaterial color={color} metalness={0.75} roughness={0.3} />
        </mesh>
      )}
      {/* engine-bay glow if hood popped */}
      {poppedHood && (
        <mesh position={[0, 0.62, 1.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.3, 1.0]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
      )}
      {/* roof light bar */}
      {lightBar && (
        <mesh position={[0, 1.4, -0.2]}>
          <boxGeometry args={[1.5, 0.12, 0.16]} />
          <meshStandardMaterial color={lightBar} emissive={lightBar} emissiveIntensity={2.8} toneMapped={false} />
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
          <meshStandardMaterial color="#0b0b0e" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
      {/* underglow strip */}
      {underglow && (
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[1.7, 0.06, 3.7]} />
          <meshStandardMaterial color={underglow} emissive={underglow} emissiveIntensity={3} toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

/** Flat glowing pool on the wet asphalt beneath a car — implied reflection. */
function GlowPool({
  position,
  color,
  size = [3.2, 5],
}: {
  position: [number, number, number]
  color: string
  size?: [number, number]
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.3}
        transparent
        opacity={0.42}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
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
      {/* dark backing pole */}
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[w + 0.25, rows * 0.95 + 0.4, 0.18]} />
        <meshStandardMaterial color="#05040a" metalness={0.5} roughness={0.7} />
      </mesh>
      {Array.from({ length: rows }).map((_, r) => {
        const c = NEONS[Math.floor(hash01(seed * 7 + r) * NEONS.length)]
        const y = (r - (rows - 1) / 2) * 0.95
        return (
          <mesh key={r} position={[0, y, 0]}>
            <planeGeometry args={[w, 0.72]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3.4} toneMapped={false} />
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
  const topBeam = HOTPINK
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* two pillars */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * px, H / 2, 0]} castShadow>
            <boxGeometry args={[0.7, H, 0.7]} />
            <meshStandardMaterial color="#0c0a12" metalness={0.5} roughness={0.6} />
          </mesh>
          {/* vertical neon tube running up the pillar */}
          <mesh position={[s * px - s * 0.4, H / 2, 0.36]}>
            <boxGeometry args={[0.1, H - 0.6, 0.1]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={3.6} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* kasagi — top beam (slight overhang past pillars) */}
      <mesh position={[0, H + 0.3, 0]}>
        <boxGeometry args={[px * 2 + 2.2, 0.7, 1.0]} />
        <meshStandardMaterial color="#120810" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* nuki — lower cross beam */}
      <mesh position={[0, H - 1.1, 0]}>
        <boxGeometry args={[px * 2 + 0.4, 0.5, 0.8]} />
        <meshStandardMaterial color="#120810" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* neon edge on the top beam */}
      <mesh position={[0, H + 0.66, 0.52]}>
        <boxGeometry args={[px * 2 + 2.0, 0.12, 0.1]} />
        <meshStandardMaterial color={topBeam} emissive={topBeam} emissiveIntensity={4.2} toneMapped={false} />
      </mesh>
      <mesh position={[0, H - 0.86, 0.42]}>
        <boxGeometry args={[px * 2 + 0.2, 0.1, 0.1]} />
        <meshStandardMaterial color={MAGENTA} emissive={MAGENTA} emissiveIntensity={4} toneMapped={false} />
      </mesh>
      {/* center hanging shop sign */}
      <NeonSign position={[0, H - 2.4, 0.5]} size={[2.6, 1.2]} color={CYAN} intensity={4} />
    </group>
  )
}

/** Festival string-lights sagging across the road on a catenary arc. */
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
        const c = NEONS[i % NEONS.length]
        return (
          <mesh key={i} position={[x, y0 - dip, 0]}>
            <sphereGeometry args={[0.13, 8, 8]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3.2} toneMapped={false} />
          </mesh>
        )
      })}
    </group>
  )
}

/** Low neon overpass the car drives beneath, with graffiti-tag emissive decals. */
function Overpass({ position, yaw = 0 }: { position: [number, number, number]; yaw?: number }) {
  const deckW = 17 // across-road span (local x)
  const y = 5.4
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* deck */}
      <mesh position={[0, y, 0]} castShadow>
        <boxGeometry args={[deckW, 1.1, 5]} />
        <meshStandardMaterial color="#0a0910" metalness={0.4} roughness={0.7} />
      </mesh>
      {/* support pillars */}
      {[-7.6, 7.6].map((x) => (
        <mesh key={x} position={[x, y / 2, 0]} castShadow>
          <boxGeometry args={[0.7, y, 0.9]} />
          <meshStandardMaterial color="#0b0a11" metalness={0.4} roughness={0.7} />
        </mesh>
      ))}
      {/* graffiti-ish emissive tags on the pillars + deck face */}
      {[-7.6, 7.6].map((x, i) => (
        <mesh key={`g${x}`} position={[x, 2.2 + i * 0.4, 0.47]}>
          <planeGeometry args={[0.9, 1.6]} />
          <meshStandardMaterial
            color={i ? MAGENTA : CYAN}
            emissive={i ? MAGENTA : CYAN}
            emissiveIntensity={2.4}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh position={[-2.4, y, 2.55]}>
        <planeGeometry args={[5, 0.7]} />
        <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={2.2} transparent opacity={0.8} toneMapped={false} />
      </mesh>
      {/* neon strip lighting under the deck */}
      {[-1.9, 1.9].map((z, i) => (
        <mesh key={z} position={[0, y - 0.62, z]}>
          <boxGeometry args={[deckW - 0.6, 0.14, 0.14]} />
          <meshStandardMaterial
            color={i ? CYAN : MAGENTA}
            emissive={i ? CYAN : MAGENTA}
            emissiveIntensity={4}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* dripping neon runners down the pillars */}
      {[-7.6, 7.6].map((x) => (
        <mesh key={`d${x}`} position={[x, y - 1.6, 0.46]}>
          <boxGeometry args={[0.08, 2.4, 0.08]} />
          <meshStandardMaterial color={HOTPINK} emissive={HOTPINK} emissiveIntensity={3.4} toneMapped={false} />
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
  const wallMat = { color: '#0b0916', metalness: 0.35, roughness: 0.75 }
  const bays = [-L / 3, L / 3] // two roll-up door bays
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* back wall */}
      <mesh position={[back, H / 2, 0]} castShadow>
        <boxGeometry args={[0.4, H, L]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>
      {/* side walls */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[cx, H / 2, s * (L / 2)]} castShadow>
          <boxGeometry args={[D, H, 0.4]} />
          <meshStandardMaterial {...wallMat} />
        </mesh>
      ))}
      {/* center divider between the two bays (front face) */}
      <mesh position={[-1.6, H / 2, 0]}>
        <boxGeometry args={[1.4, H, 0.5]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>
      {/* roof */}
      <mesh position={[cx, H, 0]} castShadow>
        <boxGeometry args={[D + 0.2, 0.4, L + 0.2]} />
        <meshStandardMaterial color="#080711" metalness={0.4} roughness={0.7} />
      </mesh>
      {/* roof-edge neon band (landmark glow) */}
      <mesh position={[-2, H + 0.05, 0]}>
        <boxGeometry args={[0.16, 0.16, L + 0.2]} />
        <meshStandardMaterial color={MAGENTA} emissive={MAGENTA} emissiveIntensity={4} toneMapped={false} />
      </mesh>
      {/* floor slab (wet, faintly lit) */}
      <mesh position={[cx, 0.03, 0]}>
        <boxGeometry args={[D, 0.06, L]} />
        <meshStandardMaterial color="#14101c" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* interior glow — bright emissive back wall spilling out the open front */}
      <mesh position={[back - 0.25, H / 2 - 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[L - 1.2, H - 1]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {/* tool wall — pegboard of small colored tool glints on the back wall */}
      {Array.from({ length: 18 }).map((_, i) => {
        const zc = (i % 6) * 1.4 - 3.5
        const yc = 2.4 + Math.floor(i / 6) * 1.0
        const c = pick(NEONS, i + 3)
        return (
          <mesh key={`tool${i}`} position={[back - 0.35, yc, zc]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.35, 0.5]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        )
      })}
      {/* interior ceiling strip lights */}
      {[-3.5, -1.2, 1.2, 3.5].map((z) => (
        <mesh key={z} position={[cx, H - 0.4, z]}>
          <boxGeometry args={[D - 1, 0.1, 0.16]} />
          {/* near-white ceiling tubes: keep below the bloom threshold's white-out */}
          <meshStandardMaterial color="#eafcff" emissive="#eafcff" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      ))}

      {/* ROLL-UP DOORS rolled up into segmented bundles above each bay (axis along local z) */}
      {bays.map((bz) => (
        <mesh key={`roll${bz}`} position={[-2, H - 0.6, bz]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 4.4, 16]} />
          <meshStandardMaterial color="#1a1d26" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {/* a couple of hanging door panel segments per bay (partially lowered top slats) */}
      {bays.map((bz) =>
        [0, 1].map((i) => (
          <mesh key={`slat${bz}-${i}`} position={[-2, H - 1.5 - i * 0.34, bz]}>
            <boxGeometry args={[0.12, 0.3, 4.2]} />
            <meshStandardMaterial color="#20232e" metalness={0.7} roughness={0.4} />
          </mesh>
        ))
      )}

      {/* 2-POST CAR LIFT (far bay) with a raised car on the platform */}
      {[-1.1, 1.1].map((z) => (
        <mesh key={z} position={[cx + 0.5, 2.1, L / 3 + z]}>
          <boxGeometry args={[0.28, 4.2, 0.28]} />
          <meshStandardMaterial color="#c9d200" emissive="#3a3d00" emissiveIntensity={0.6} metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[cx + 0.5, 3.2, L / 3]}>
        <boxGeometry args={[3.2, 0.18, 2.4]} />
        <meshStandardMaterial color="#181a22" metalness={0.6} roughness={0.5} />
      </mesh>
      <CarSilhouette position={[cx + 0.5, 3.35, L / 3]} yaw={0} color="#141620" underglow={PURPLE} scale={0.82} />

      {/* a project car sitting in the near bay, hood popped */}
      <CarSilhouette position={[cx + 0.2, 0, -L / 3]} yaw={0} color="#1a1226" underglow={MAGENTA} poppedHood scale={0.9} />

      {/* neon JDM shop sign banner mounted on the facade above the openings */}
      <NeonSign position={[-2.2, H - 0.55, 0]} yaw={-Math.PI / 2} size={[6.2, 1.0]} color={MAGENTA} intensity={4.2} />
      <NeonSign position={[-2.2, H - 1.9, L / 2 - 1.4]} yaw={-Math.PI / 2} size={[1.4, 2.4]} color={CYAN} intensity={3.6} />

      {/* facade accent tubes framing the whole opening */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[-2, H / 2, s * (L / 2 - 0.15)]}>
          <boxGeometry args={[0.08, H - 0.4, 0.1]} />
          <meshStandardMaterial color={PURPLE} emissive={PURPLE} emissiveIntensity={3.5} toneMapped={false} />
        </mesh>
      ))}

      {/* wet-floor reflective glow puddle spilling out front — y=0.11 keeps it
          clear ABOVE the floor slab (box spans y 0→0.06) so the two emissive/lit
          ground planes don't z-fight where they overlap at the bay mouth. */}
      <mesh position={[-4.6, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, L - 1]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.95} transparent opacity={0.5} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function TunerRegion({ active }: { active: boolean }) {
  // garage pulled in so its lit open bay frames the stop (buildings now clear the corridor)
  const garage = useMemo(() => bandCenter('tuner', 10), [])

  // side 7.8 (±jitter → 7.1–8.5), minSide 7.5 floors it so the pools' inner edge
  // (~1.6 half-width) stays at ≥5.9 — clear of the guardrail (5.3) / asphalt (4.6).
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
      {/* real GLB city skyline behind the meet — 3 depth rows of Kenney City-Kit
          buildings, magenta window-glow, clamped well off the chase-cam corridor
          (farSide 30 / midSide 20 / nearSide 16) so nothing enters the corridor */}
      <CitySkyline band="tuner" windowColor={MAGENTA} farSide={30} midSide={20} nearSide={16} />

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
          intensity={3.2}
        />
      ))}
      {signsLeft.map((p, i) => (
        <NeonSign
          key={`nl${i}`}
          position={[p.position[0], 2.1, p.position[2]]}
          yaw={p.yaw - Math.PI / 2}
          size={[2.2, 0.5]}
          color={NEONS[(i + 1) % NEONS.length]}
          intensity={3.2}
        />
      ))}

      {/* glowing underglow pools on the wet asphalt beneath the parked rows */}
      {carsRight.map((p, i) => (
        <GlowPool key={`pr${i}`} position={[p.position[0], 0.015, p.position[2]]} color={pick(CAR_HUES, i + 2)} />
      ))}
      {carsLeft.map((p, i) => (
        <GlowPool key={`pl${i}`} position={[p.position[0], 0.015, p.position[2]]} color={pick(CAR_HUES, i + 30)} />
      ))}

      {/* parked GLB tuner cars lining both curbs — the street meet */}
      {carsRight.map((p, i) => (
        <KitModel key={`cr${i}`} url={CAR_KIT[i % CAR_KIT.length]} position={p.position} yaw={p.yaw} height={1.5} />
      ))}
      {carsLeft.map((p, i) => (
        <KitModel
          key={`cl${i}`}
          url={CAR_KIT[(i + 3) % CAR_KIT.length]}
          position={p.position}
          yaw={p.yaw + Math.PI}
          height={1.5}
        />
      ))}

      {/* Overhead elements spread to distinct points so they never pile up: overpass
          ≈f0.0, torii at the stop (f0.5), string-lights ≈f0.75/1.0. */}

      {/* single low neon underpass with graffiti tags (near-end of the band) */}
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

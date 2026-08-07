'use client'

import * as THREE from 'three'
import { useMemo } from 'react'
import { placeAlongBand, bandCenter, CitySkyline } from './kit'

/**
 * ③ San Francisco downhill chase — NIGHT (Fast & Furious SF, after dark).
 *
 * Iconic Golden Gate Bridge straddling & framing the road, LIT: twin
 * International-Orange towers glowing against the dark sky, a suspended deck,
 * sweeping catenary cables strung with a "necklace" of warm emissive lights,
 * vertical suspenders picked out in warm light, red aircraft-warning lights on
 * the tower tops, and anchorages. Behind it: a real Kenney City-Kit GLB skyline
 * (`CitySkyline`) — three depth rows of actual building models with warm-lit
 * night windows climbing the hillsides — plus dark night hills on the horizon,
 * a maroon cable car with lit windows under trolley wires, and low "Karl the
 * Fog" night haze. The Golden Gate + atmosphere are procedural, deterministic
 * meshes; the city is GLB clones. Lighting rig is owned by LevelLighting (SF
 * night); scenery only supplies emissive dressing.
 */

// ---- palette (night) -------------------------------------------------------
const ORANGE = '#ff5a34' // International Orange (towers) — pops under night rim light
const ORANGE_DK = '#c23f27' // cables / struts
const ORANGE_EMIS = '#ff7a3c' // warm emissive tint for the lit bridge glow
const CABLE_LIGHT = '#ffcf82' // warm sodium "necklace" lights along the cables
const WARN_RED = '#ff2b2b' // tower aircraft-warning beacons
const DECK = '#7c2f1e' // deck reads dark at night
const CONCRETE = '#2c2a26' // anchorages / piers — dark masonry at night
const WINDOW_WARM = '#ffce87' // lit cable-car windows
const HILL_NEAR = '#0c1220'
const HILL_FAR = '#111a2c'

// deterministic hash (no per-frame Math.random)
const hash01 = (n: number) => {
  const s = Math.sin(n * 91.317) * 47513.213
  return s - Math.floor(s)
}

const UP = new THREE.Vector3(0, 1, 0)

interface Seg {
  pos: [number, number, number]
  quat: [number, number, number, number]
  len: number
}

/** describe a cylinder segment spanning a -> b (used for cables + wires). */
function seg(a: THREE.Vector3, b: THREE.Vector3): Seg {
  const dir = new THREE.Vector3().subVectors(b, a)
  const len = dir.length()
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
  const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize())
  return { pos: [mid.x, mid.y, mid.z], quat: [q.x, q.y, q.z, q.w], len }
}

// bridge dimensions (local space of the straddle group) ----------------------
const TOWER_X = 9.5 // half-gap between towers (road halfWidth ~4.6 -> clears wide)
const TOWER_H = 46
const CABLE_TOP = 44
const CABLE_SAG = 33 // center of span dips to CABLE_TOP - SAG ≈ 11 (just above deck)
const DECK_Y = 9
const DECK_HALF = 13
const CABLE_Z = 1.9 // front/back cable planes (also tower upright offset)
const SPAN_SEGS = 14

function catenary(z: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= SPAN_SEGS; i++) {
    const t = i / SPAN_SEGS
    const x = -TOWER_X + 2 * TOWER_X * t
    const n = x / TOWER_X // -1..1
    const y = CABLE_TOP - CABLE_SAG * (1 - n * n)
    pts.push(new THREE.Vector3(x, y, z))
  }
  return pts
}

function GoldenGate() {
  const { cables, suspenders, anchorCables, cableLights, deckLights } = useMemo(() => {
    const cables: Seg[] = []
    const suspenders: Seg[] = []
    const anchorCables: Seg[] = []
    // warm "necklace" lights strung along the main cables, and the string of
    // deck-level lamps where each suspender meets the roadway
    const cableLights: [number, number, number][] = []
    const deckLights: [number, number, number][] = []
    for (const z of [-CABLE_Z, CABLE_Z]) {
      const pts = catenary(z)
      for (let i = 0; i < pts.length - 1; i++) cables.push(seg(pts[i], pts[i + 1]))
      // one warm bulb at every cable node — the classic lit-catenary look
      for (const p of pts) cableLights.push([p.x, p.y, p.z])
      // vertical suspender ropes from the main cable down to the deck
      for (let i = 1; i < pts.length - 1; i++) {
        const p = pts[i]
        if (p.y > DECK_Y + 0.5) {
          suspenders.push(seg(p, new THREE.Vector3(p.x, DECK_Y, z)))
          deckLights.push([p.x, DECK_Y + 0.9, z])
        }
      }
      // sweeping approach cables from each tower top down to the anchorages
      anchorCables.push(seg(new THREE.Vector3(-TOWER_X, CABLE_TOP, z), new THREE.Vector3(-DECK_HALF - 3, 0.6, z)))
      anchorCables.push(seg(new THREE.Vector3(TOWER_X, CABLE_TOP, z), new THREE.Vector3(DECK_HALF + 3, 0.6, z)))
    }
    return { cables, suspenders, anchorCables, cableLights, deckLights }
  }, [])

  const braceHeights = [7, 14, 21, 28, 34, 39, 43] // stacked cross-braces up each tower

  return (
    <group>
      {/* twin towers: two uprights joined by cross braces, both sides of the road */}
      {[-TOWER_X, TOWER_X].map((tx) => (
        <group key={tx} position={[tx, 0, 0]}>
          {/* base pier at the waterline */}
          <mesh position={[0, 1, 0]} castShadow>
            <boxGeometry args={[2.4, 2, CABLE_Z * 2 + 2.4]} />
            <meshStandardMaterial color={CONCRETE} roughness={0.9} metalness={0.02} />
          </mesh>
          {/* uprights (slightly tapered toward the top via two stacked boxes) —
              emissive-tinted so the International-Orange steel glows at night */}
          {[-CABLE_Z, CABLE_Z].map((tz) => (
            <group key={tz}>
              <mesh position={[0, TOWER_H * 0.32, tz]} castShadow>
                <boxGeometry args={[1.7, TOWER_H * 0.64, 1.7]} />
                <meshStandardMaterial
                  color={ORANGE}
                  emissive={ORANGE_EMIS}
                  emissiveIntensity={0.55}
                  metalness={0.25}
                  roughness={0.6}
                />
              </mesh>
              <mesh position={[0, TOWER_H * 0.82, tz]} castShadow>
                <boxGeometry args={[1.45, TOWER_H * 0.36, 1.45]} />
                <meshStandardMaterial
                  color={ORANGE}
                  emissive={ORANGE_EMIS}
                  emissiveIntensity={0.6}
                  metalness={0.25}
                  roughness={0.6}
                />
              </mesh>
            </group>
          ))}
          {/* portal cross braces linking the two uprights */}
          {braceHeights.map((h) => (
            <mesh key={h} position={[0, h, 0]}>
              <boxGeometry args={[1.7, h > 37 ? 1.7 : 1.0, CABLE_Z * 2 + 1.6]} />
              <meshStandardMaterial
                color={ORANGE}
                emissive={ORANGE_EMIS}
                emissiveIntensity={0.5}
                metalness={0.25}
                roughness={0.6}
              />
            </mesh>
          ))}
          {/* stepped tower cap */}
          <mesh position={[0, TOWER_H + 0.7, 0]}>
            <boxGeometry args={[1.9, 1.4, CABLE_Z * 2 + 2.0]} />
            <meshStandardMaterial color={ORANGE_DK} emissive={ORANGE_EMIS} emissiveIntensity={0.35} metalness={0.3} roughness={0.55} />
          </mesh>
          {/* red aircraft-warning beacon on each tower top */}
          <mesh position={[0, TOWER_H + 1.9, 0]}>
            <sphereGeometry args={[0.42, 8, 8]} />
            <meshStandardMaterial color={WARN_RED} emissive={WARN_RED} emissiveIntensity={4} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* roadway deck spanning over the road */}
      <mesh position={[0, DECK_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[DECK_HALF * 2, 0.55, CABLE_Z * 2 + 1.6]} />
        <meshStandardMaterial color={DECK} metalness={0.2} roughness={0.7} />
      </mesh>
      {/* deck side rails — faintly lit international orange */}
      {[-CABLE_Z - 0.7, CABLE_Z + 0.7].map((rz) => (
        <mesh key={rz} position={[0, DECK_Y + 0.55, rz]}>
          <boxGeometry args={[DECK_HALF * 2, 0.55, 0.14]} />
          <meshStandardMaterial color={ORANGE_DK} emissive={ORANGE_EMIS} emissiveIntensity={0.4} metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
      {/* concrete anchorages where the cables meet the ground at deck ends */}
      {[-DECK_HALF - 3, DECK_HALF + 3].map((ax) => (
        <mesh key={ax} position={[ax, 1.4, 0]} castShadow>
          <boxGeometry args={[2.6, 2.8, CABLE_Z * 2 + 2.6]} />
          <meshStandardMaterial color={CONCRETE} roughness={0.9} metalness={0.02} />
        </mesh>
      ))}

      {/* main catenary cables (thick) */}
      {cables.map((s, i) => (
        <mesh key={`c${i}`} position={s.pos} quaternion={s.quat}>
          <cylinderGeometry args={[0.2, 0.2, s.len, 6]} />
          <meshStandardMaterial color={ORANGE_DK} metalness={0.35} roughness={0.5} />
        </mesh>
      ))}
      {/* sweeping approach cables to the anchorages */}
      {anchorCables.map((s, i) => (
        <mesh key={`a${i}`} position={s.pos} quaternion={s.quat}>
          <cylinderGeometry args={[0.2, 0.2, s.len, 6]} />
          <meshStandardMaterial color={ORANGE_DK} metalness={0.35} roughness={0.5} />
        </mesh>
      ))}
      {/* vertical suspender ropes */}
      {suspenders.map((s, i) => (
        <mesh key={`s${i}`} position={s.pos} quaternion={s.quat}>
          <cylinderGeometry args={[0.06, 0.06, s.len, 5]} />
          <meshStandardMaterial color={ORANGE_DK} emissive={ORANGE_EMIS} emissiveIntensity={0.25} metalness={0.3} roughness={0.6} />
        </mesh>
      ))}

      {/* warm "necklace" lights strung along the main catenary cables — the
          signature nighttime read of the bridge glowing against the dark sky */}
      {cableLights.map((p, i) => (
        <mesh key={`cl${i}`} position={p}>
          <sphereGeometry args={[0.22, 6, 6]} />
          <meshStandardMaterial color={CABLE_LIGHT} emissive={CABLE_LIGHT} emissiveIntensity={3.2} toneMapped={false} />
        </mesh>
      ))}
      {/* deck-level roadway lamps where each suspender lands */}
      {deckLights.map((p, i) => (
        <mesh key={`dl${i}`} position={p}>
          <sphereGeometry args={[0.16, 6, 6]} />
          <meshStandardMaterial color={CABLE_LIGHT} emissive={CABLE_LIGHT} emissiveIntensity={2.6} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/** Rolling hazy SF hill silhouette (wide, low). */
function Hill({
  position,
  radius,
  height,
  color,
}: {
  position: [number, number, number]
  radius: number
  height: number
  color: string
}) {
  // Top hemisphere (dome): local geometry spans y=0 (flat base) .. y=1 (crown),
  // so scaling by `height` and seating the base ~at y0 reads as a solid hill on
  // the horizon instead of a half-buried / floating sphere.
  return (
    <mesh position={position} scale={[radius, height, radius]}>
      <sphereGeometry args={[1, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} roughness={1} metalness={0} />
    </mesh>
  )
}

/** Trolley / utility pole with a crossarm. */
function Pole({ position, yaw }: { position: [number, number, number]; yaw: number }) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.09, 0.12, 6, 6]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 5.4, 0]}>
        <boxGeometry args={[1.8, 0.14, 0.14]} />
        <meshStandardMaterial color="#4a3c2e" roughness={0.9} />
      </mesh>
    </group>
  )
}

/** Classic maroon SF cable car with cream window band + trolley pole to the wire. */
function CableCar({ position, yaw }: { position: [number, number, number]; yaw: number }) {
  const MAROON = '#7c3a2d'
  const CREAM = '#efe7d2'
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* lower body / skirt */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[2.0, 1.4, 4.4]} />
        <meshStandardMaterial color={MAROON} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* cream window band */}
      <mesh position={[0, 1.95, 0]}>
        <boxGeometry args={[2.05, 0.85, 4.0]} />
        <meshStandardMaterial color={CREAM} roughness={0.6} metalness={0.05} />
      </mesh>
      {/* window glazing — warmly lit interior at night */}
      {[-1.2, 0, 1.2].map((z) => (
        <mesh key={z} position={[0, 1.95, z]}>
          <boxGeometry args={[2.12, 0.6, 0.7]} />
          <meshStandardMaterial color={WINDOW_WARM} emissive={WINDOW_WARM} emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      ))}
      {/* rounded maroon roof */}
      <mesh position={[0, 2.55, 0]} castShadow>
        <boxGeometry args={[2.2, 0.35, 4.6]} />
        <meshStandardMaterial color={MAROON} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* running-board trim */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.3, 0.2, 4.5]} />
        <meshStandardMaterial color="#3a1f18" roughness={0.8} />
      </mesh>
      {/* trolley pole reaching up to the overhead wire */}
      <mesh position={[0, 4.0, 0.5]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3.0, 5]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.5} />
      </mesh>
    </group>
  )
}

export default function SFRegion({ active }: { active: boolean }) {
  // straddle transform for the Golden Gate (hero landmark, centered on the band)
  const gate = useMemo(() => bandCenter('sf', 0), [])

  // rolling hazy hill silhouettes far on the horizon
  const hillsR = useMemo(() => placeAlongBand('sf', 3, 70, { jitterAlong: 0.5 }), [])
  const hillsL = useMemo(() => placeAlongBand('sf', 3, -78, { jitterAlong: 0.5 }), [])

  // trolley poles hugging the road (opposite side from the Ladies)
  const poles = useMemo(() => placeAlongBand('sf', 9, -8, { jitterSide: 0.5 }), [])

  // overhead trolley wire — densely sampled ALONG the band (same −8 side as the
  // poles) and chained point-to-point so the wire follows the road's curve
  // instead of cutting straight chords across it.
  const wires = useMemo(() => {
    const path = placeAlongBand('sf', 40, -8)
    const out: Seg[] = []
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i].position
      const b = path[i + 1].position
      out.push(seg(new THREE.Vector3(a[0], 5.3, a[2]), new THREE.Vector3(b[0], 5.3, b[2])))
    }
    return out
  }, [])

  // a couple of cable cars running parallel to the road under the wires
  const cars = useMemo(() => placeAlongBand('sf', 2, -6.8, { jitterAlong: 0.35 }), [])

  // "Karl the Fog" — two wide haze banks set well beyond the hills so they read
  // as soft atmosphere, not billboards that pop/clip the city (see render below)
  const fog = useMemo(() => placeAlongBand('sf', 2, 96, { jitterAlong: 0.4 }), [])

  if (!active) return null

  return (
    <group>
      {/* hero landmark — Golden Gate framing the road */}
      <group position={[gate.position[0], 0, gate.position[2]]} rotation={[0, gate.yaw, 0]}>
        <GoldenGate />
      </group>

      {/* rolling hazy hills on the horizon (drawn first, farthest back) */}
      {hillsR.map((h, i) => (
        <Hill
          key={`hr${i}`}
          position={[h.position[0], -1, h.position[2]]}
          radius={30 + hash01(i + 5) * 16}
          height={16 + hash01(i + 8) * 10}
          color={i % 2 ? HILL_FAR : HILL_NEAR}
        />
      ))}
      {hillsL.map((h, i) => (
        <Hill
          key={`hl${i}`}
          position={[h.position[0], -1, h.position[2]]}
          radius={30 + hash01(i + 15) * 16}
          height={16 + hash01(i + 18) * 10}
          color={i % 2 ? HILL_NEAR : HILL_FAR}
        />
      ))}

      {/* the SF city itself — real Kenney City-Kit GLB buildings (three depth
          rows, auto-scaled + ground-seated + corridor-safe) with warm SF-night
          window glow, climbing the hillsides behind the bridge */}
      <CitySkyline band="sf" windowColor="#ff8a5a" />

      {/* cable cars running parallel to the road */}
      {cars.map((c, i) => (
        <CableCar key={`car${i}`} position={[c.position[0], 0, c.position[2]]} yaw={c.yaw} />
      ))}

      {/* trolley poles + overhead wires */}
      {poles.map((p, i) => (
        <Pole key={`p${i}`} position={[p.position[0], 0, p.position[2]]} yaw={p.yaw} />
      ))}
      {wires.map((s, i) => (
        <mesh key={`w${i}`} position={s.pos} quaternion={s.quat}>
          <cylinderGeometry args={[0.03, 0.03, s.len, 4]} />
          <meshStandardMaterial color="#20242a" roughness={0.9} />
        </mesh>
      ))}

      {/* Karl the Fog — a couple of wide, low, distant haze banks. At night these
          are DARK haze (a faint dark-blue veil that deepens the horizon), kept far
          out (beyond the hills) and faint so they read as soft atmosphere and can't
          clip the city or pop as flat billboards when the camera turns. */}
      {fog.map((f, i) => (
        <mesh key={`f${i}`} position={[f.position[0], 9 + i * 4, f.position[2]]} rotation={[0, f.yaw, 0]}>
          <planeGeometry args={[220, 30]} />
          <meshBasicMaterial
            color="#0a1120"
            transparent
            opacity={0.16}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

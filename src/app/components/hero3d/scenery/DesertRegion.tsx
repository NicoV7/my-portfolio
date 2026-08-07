'use client'

import * as THREE from 'three'
import { useMemo } from 'react'
import { placeAlongBand, bandCenter, NeonSign, KitModel, placeKit, preloadKits, CITY_LOW, type Placement } from './kit'
import { curve, progressToT, REGIONS } from '../curve'

// A handful of small CC0 City-Kit GLBs form a far-horizon town silhouette.
preloadKits(...CITY_LOW)

/**
 * ② Desert Route-66 heist run — DAYTIME.
 * A big retro 50s American diner (chrome + neon "DINER" pole sign) as the hero
 * landmark, with a small parking lot (parked-car silhouettes + gas pump), plus
 * Route-66 dressing: billboard, water tower, motel sign, dry roadside fence,
 * telephone poles with sagging catenary wires, and THREE depth layers of
 * mesa/butte silhouettes far back for real desert parallax. Denser saguaro
 * cacti, tumbleweeds, scrub, rocks and cracked-earth patches fill the shoulders.
 * Warm sun-baked palette; emissive reserved for the diner neon (it's daylight).
 * Fully deterministic (useMemo + kit jitter).
 */

// deterministic pseudo-random in [0,1)
const h01 = (n: number) => {
  const s = Math.sin(n * 127.1 + 11.7) * 43758.5453
  return s - Math.floor(s)
}

const SAND_DARK = '#a67f4d'
const SAND_CRACK = '#8a6a41'
const CACTUS = '#4f7a3a'
const CACTUS_DK = '#3d6130'
const SCRUB = '#7d8a4a'
const MESA_NEAR = '#b46a44'
const MESA_MID = '#c47c54'
const MESA_FAR = '#d69f78'
const WOOD = '#6b5236'
const WOOD_LT = '#8a6b45'
const CHROME = '#d7dde3'
const RUST = '#8f5a34'

/** A curved strand (telephone wire w/ sag, or straight fence rail). */
function Strand({
  a,
  b,
  radius = 0.03,
  sag = 0,
  color = '#1c1c1f',
  roughness = 0.85,
}: {
  a: [number, number, number]
  b: [number, number, number]
  radius?: number
  sag?: number
  color?: string
  roughness?: number
}) {
  const geom = useMemo(() => {
    const A = new THREE.Vector3(a[0], a[1], a[2])
    const B = new THREE.Vector3(b[0], b[1], b[2])
    const mid = A.clone().add(B).multiplyScalar(0.5)
    mid.y -= sag
    const c = new THREE.QuadraticBezierCurve3(A, mid, B)
    return new THREE.TubeGeometry(c, sag > 0 ? 10 : 1, radius, 5, false)
  }, [a, b, radius, sag])
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  )
}

/** A wire that follows a sampled polyline (so catenary spans bend WITH the road
 * on curves instead of cutting straight chords across the inside of bends). */
function WirePolyline({
  points,
  radius = 0.03,
  color = '#1c1c1f',
}: {
  points: [number, number, number][]
  radius?: number
  color?: string
}) {
  const geom = useMemo(() => {
    const c = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])))
    return new THREE.TubeGeometry(c, Math.max(8, points.length * 3), radius, 5, false)
  }, [points, radius])
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  )
}

/** A single saguaro cactus: trunk + up to two upturned arms. */
function Saguaro({ position, yaw, scale }: { position: [number, number, number]; yaw: number; scale: number }) {
  const H = 3.4 * scale
  const r = 0.32 * scale
  return (
    <group position={position} rotation={[0, yaw, 0]} scale={scale}>
      {/* trunk */}
      <mesh position={[0, H / 2 / scale, 0]} castShadow>
        <cylinderGeometry args={[r / scale, (r * 1.15) / scale, H / scale, 10]} />
        <meshStandardMaterial color={CACTUS} roughness={0.85} />
      </mesh>
      {/* rounded top cap */}
      <mesh position={[0, H / scale, 0]}>
        <sphereGeometry args={[r / scale, 10, 8]} />
        <meshStandardMaterial color={CACTUS} roughness={0.85} />
      </mesh>
      {/* left arm: horizontal elbow then vertical */}
      <group position={[-0.02, (H * 0.5) / scale, 0]}>
        <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.22, 1.0, 8]} />
          <meshStandardMaterial color={CACTUS_DK} roughness={0.85} />
        </mesh>
        <mesh position={[-1.02, 0.62, 0]}>
          <cylinderGeometry args={[0.19, 0.2, 1.3, 8]} />
          <meshStandardMaterial color={CACTUS_DK} roughness={0.85} />
        </mesh>
        <mesh position={[-1.02, 1.27, 0]}>
          <sphereGeometry args={[0.19, 8, 8]} />
          <meshStandardMaterial color={CACTUS_DK} roughness={0.85} />
        </mesh>
      </group>
      {/* right arm: shorter, higher */}
      <group position={[0.02, (H * 0.68) / scale, 0]}>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.17, 0.19, 0.85, 8]} />
          <meshStandardMaterial color={CACTUS_DK} roughness={0.85} />
        </mesh>
        <mesh position={[0.9, 0.5, 0]}>
          <cylinderGeometry args={[0.16, 0.17, 1.0, 8]} />
          <meshStandardMaterial color={CACTUS_DK} roughness={0.85} />
        </mesh>
        <mesh position={[0.9, 1.0, 0]}>
          <sphereGeometry args={[0.16, 8, 8]} />
          <meshStandardMaterial color={CACTUS_DK} roughness={0.85} />
        </mesh>
      </group>
    </group>
  )
}

/** Telephone pole: post + crossbar + insulator nubs. */
function TelephonePole({ position, yaw }: { position: [number, number, number]; yaw: number }) {
  const H = 7
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, H / 2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, H, 7]} />
        <meshStandardMaterial color={WOOD} roughness={0.95} />
      </mesh>
      {/* crossbar (perpendicular to road, i.e. along local X) */}
      <mesh position={[0, H - 0.6, 0]}>
        <boxGeometry args={[2.2, 0.16, 0.16]} />
        <meshStandardMaterial color={WOOD} roughness={0.95} />
      </mesh>
      <mesh position={[0, H - 1.1, 0]}>
        <boxGeometry args={[1.6, 0.14, 0.14]} />
        <meshStandardMaterial color={WOOD} roughness={0.95} />
      </mesh>
      {[-0.9, -0.3, 0.3, 0.9].map((x) => (
        <mesh key={x} position={[x, H - 0.45, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.22, 6]} />
          <meshStandardMaterial color="#2b2b30" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

/** Flat-topped mesa/butte silhouette (stacked tapered boxes). */
function Mesa({
  position,
  yaw,
  w,
  h,
  d,
  color,
}: {
  position: [number, number, number]
  yaw: number
  w: number
  h: number
  d: number
  color: string
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* main body */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      {/* wider talus base for the classic butte flare */}
      <mesh position={[0, h * 0.12, 0]}>
        <boxGeometry args={[w * 1.25, h * 0.24, d * 1.25]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      {/* a small stepped cap for a second silhouette read */}
      <mesh position={[w * 0.18, h + h * 0.14, 0]}>
        <boxGeometry args={[w * 0.4, h * 0.28, d * 0.6]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
    </group>
  )
}

/** Retro parked-car silhouette (muted classic color). */
function ParkedCar({
  position,
  yaw,
  color,
}: {
  position: [number, number, number]
  yaw: number
  color: string
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* lower body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[2.1, 0.7, 4.6]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.35} />
      </mesh>
      {/* cabin */}
      <mesh position={[0, 1.1, -0.25]} castShadow>
        <boxGeometry args={[1.85, 0.72, 2.2]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.35} />
      </mesh>
      {/* glass */}
      <mesh position={[0, 1.14, -0.25]}>
        <boxGeometry args={[1.88, 0.5, 1.95]} />
        <meshStandardMaterial color="#4a5a60" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* chrome bumpers */}
      {[2.25, -2.25].map((z) => (
        <mesh key={z} position={[0, 0.42, z]}>
          <boxGeometry args={[2.0, 0.18, 0.2]} />
          <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {/* wheels */}
      {(
        [
          [-1.0, 1.5],
          [1.0, 1.5],
          [-1.0, -1.5],
          [1.0, -1.5],
        ] as [number, number][]
      ).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.35, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.36, 0.36, 0.24, 12]} />
          <meshStandardMaterial color="#1b1b1e" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

/** Old roadside gas pump. */
function GasPump({ position, yaw }: { position: [number, number, number]; yaw: number }) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.3, 0.1, 1.0]} />
        <meshStandardMaterial color="#7c7266" roughness={1} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.9, 1.6, 0.6]} />
        <meshStandardMaterial color="#c0392b" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* display head */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[1.0, 0.55, 0.68]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.75, 0.35]}>
        <planeGeometry args={[0.75, 0.38]} />
        <meshStandardMaterial color="#f7d774" emissive="#f7d774" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      {/* topper light */}
      <mesh position={[0, 2.12, 0]}>
        <boxGeometry args={[0.6, 0.22, 0.4]} />
        <meshStandardMaterial color={CHROME} metalness={0.85} roughness={0.25} />
      </mesh>
      {/* hose */}
      <Strand a={[0.48, 1.3, 0.1]} b={[0.52, 0.5, 0.5]} radius={0.05} sag={0.35} color="#15151a" />
    </group>
  )
}

/** The hero: a long low 50s diner with chrome trim, glass front, neon pole sign,
 * plus a parking lot (parked cars + gas pump). */
function Diner({ base }: { base: Placement }) {
  const [bx, , bz] = base.position
  return (
    <group position={[bx, 0, bz]} rotation={[0, base.yaw, 0]}>
      {/* concrete parking apron — shifted OUT (local +x) and narrowed so it
          stays well clear of the road. Group now sits at band-center side +16.5,
          so this apron's inner edge (local x −7) lands at world side ≈9.5, and
          the nearest geometry — the main body's inner wall (local x −9) — sits at
          world side ≈7.5, clear of the guardrail (±5.3), asphalt (±4.6) and the
          band-center stop marker (side 6.4). */}
      <mesh position={[3, 0.02, 6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#9c8f7a" roughness={1} />
      </mesh>
      {/* faded lot line paint */}
      {[-4, -1.5, 1, 3.5].map((x) => (
        <mesh key={x} position={[x, 0.03, 8.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.14, 3.4]} />
          <meshStandardMaterial color="#cdbf9c" roughness={1} />
        </mesh>
      ))}

      {/* main body */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[18, 3.2, 7]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* red dado stripe */}
      <mesh position={[0, 0.5, 3.56]}>
        <boxGeometry args={[18.05, 0.7, 0.08]} />
        <meshStandardMaterial color="#c0392b" roughness={0.6} />
      </mesh>
      {/* second thin accent stripe */}
      <mesh position={[0, 2.75, 3.56]}>
        <boxGeometry args={[18.05, 0.22, 0.08]} />
        <meshStandardMaterial color="#c0392b" roughness={0.6} />
      </mesh>
      {/* chrome rounded roof-edge (long half-cylinder trims front and back) */}
      {[3.5, -3.5].map((z) => (
        <mesh key={z} position={[0, 3.2, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.55, 0.55, 18, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.18} />
        </mesh>
      ))}
      {/* flat roof slab */}
      <mesh position={[0, 3.35, 0]}>
        <boxGeometry args={[18, 0.3, 7]} />
        <meshStandardMaterial color="#d9cfbc" roughness={0.6} />
      </mesh>
      {/* roof vents / AC units for silhouette */}
      {[-5, 0, 5].map((x) => (
        <mesh key={x} position={[x, 3.7, -1]}>
          <boxGeometry args={[1.4, 0.6, 1.4]} />
          <meshStandardMaterial color="#b7ad98" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
      {/* window row (front) */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-7.2 + i * 2.4, 1.9, 3.55]}>
          <planeGeometry args={[1.9, 1.9]} />
          <meshStandardMaterial
            color="#bfe3ec"
            metalness={0.4}
            roughness={0.15}
            emissive="#8fc7d6"
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}
      {/* chrome mullions between windows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-8.4 + i * 2.4, 1.9, 3.58]}>
          <boxGeometry args={[0.14, 2.1, 0.1]} />
          <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {/* door */}
      <mesh position={[0, 1.2, 3.57]}>
        <boxGeometry args={[1.3, 2.4, 0.12]} />
        <meshStandardMaterial color="#8a1f16" roughness={0.5} />
      </mesh>
      {/* porch overhang posts */}
      {[-7, 7].map((x) => (
        <mesh key={x} position={[x, 1.2, 5.4]}>
          <cylinderGeometry args={[0.1, 0.1, 2.4, 8]} />
          <meshStandardMaterial color={CHROME} metalness={0.85} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 2.5, 4.9]}>
        <boxGeometry args={[16, 0.2, 2.4]} />
        <meshStandardMaterial color="#c0392b" roughness={0.6} />
      </mesh>

      {/* small subtle "OPEN" window sign (daytime, low glow) */}
      <NeonSign position={[5.6, 1.9, 3.62]} size={[1.1, 0.44]} color="#ff5a3c" intensity={1.2} />

      {/* ===== parking lot: parked cars + gas pump ===== */}
      <ParkedCar position={[-4.5, 0, 7.5]} yaw={0.06} color="#2f6f8f" />
      <ParkedCar position={[-1.2, 0, 7.6]} yaw={-0.05} color="#b5b0a4" />
      <ParkedCar position={[2.4, 0, 7.7]} yaw={0.09} color="#8a2f28" />
      <GasPump position={[9, 0, 8.5]} yaw={0} />
      {/* gas-pump island canopy post */}
      <mesh position={[9, 1.6, 8.5]}>
        <cylinderGeometry args={[0.09, 0.09, 3.2, 8]} />
        <meshStandardMaterial color={CHROME} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* ===== NEON pole sign, roadside end of the apron ===== */}
      <group position={[10.5, 0, 4]}>
        {/* pole */}
        <mesh position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 8, 10]} />
          <meshStandardMaterial color="#3a3a40" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* sign backing panel */}
        <mesh position={[0, 7.4, 0]}>
          <boxGeometry args={[3.4, 4.4, 0.3]} />
          <meshStandardMaterial color="#161018" metalness={0.4} roughness={0.6} />
        </mesh>
        {/* big vertical "DINER" emissive panel */}
        <mesh position={[0, 7.4, 0.22]}>
          <planeGeometry args={[2.6, 3.9]} />
          <meshStandardMaterial color="#ff2f9e" emissive="#ff2f9e" emissiveIntensity={3.2} toneMapped={false} />
        </mesh>
        {/* stacked letter bars (evokes vertical D-I-N-E-R lettering) */}
        {[1.4, 0.65, -0.1, -0.85, -1.6].map((y, i) => (
          <mesh key={i} position={[0, 7.4 + y, 0.3]}>
            <boxGeometry args={[1.5 - (i % 2) * 0.3, 0.42, 0.08]} />
            <meshStandardMaterial color="#fff2fb" emissive="#ffd6ef" emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        ))}
        {/* neon arcs framing the sign, aqua */}
        <mesh position={[0, 9.7, 0.25]}>
          <torusGeometry args={[1.5, 0.09, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#22e0ff" emissive="#22e0ff" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <mesh position={[0, 5.1, 0.25]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[1.5, 0.09, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#22e0ff" emissive="#22e0ff" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        {/* full neon ring accent */}
        <mesh position={[0, 7.4, 0.18]}>
          <torusGeometry args={[1.75, 0.06, 8, 40]} />
          <meshStandardMaterial color="#ff2f9e" emissive="#ff2f9e" emissiveIntensity={2.6} toneMapped={false} />
        </mesh>
        {/* topper star */}
        <mesh position={[0, 10.2, 0.25]} rotation={[0, 0, Math.PI / 5]}>
          <cylinderGeometry args={[0.55, 0.55, 0.12, 5]} />
          <meshStandardMaterial color="#ffd93b" emissive="#ffd93b" emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

/** Big Route-66 billboard on posts. */
function Billboard({ position, yaw }: { position: [number, number, number]; yaw: number }) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {[-3.4, 3.4].map((x) => (
        <mesh key={x} position={[x, 3.5, 0]} castShadow>
          <boxGeometry args={[0.3, 7, 0.3]} />
          <meshStandardMaterial color={WOOD} roughness={0.95} />
        </mesh>
      ))}
      {/* cross-brace */}
      <mesh position={[0, 3.5, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.18, 7.4, 0.18]} />
        <meshStandardMaterial color={WOOD} roughness={0.95} />
      </mesh>
      {/* panel */}
      <mesh position={[0, 7.6, 0.16]}>
        <boxGeometry args={[10.4, 4.6, 0.3]} />
        <meshStandardMaterial color="#efe6d6" roughness={0.75} />
      </mesh>
      {/* frame trim */}
      <mesh position={[0, 7.6, 0.33]}>
        <boxGeometry args={[10.8, 5.0, 0.12]} />
        <meshStandardMaterial color={RUST} roughness={0.8} />
      </mesh>
      {/* painted ad: warm sky band + route shield + text bars */}
      <mesh position={[0, 8.4, 0.35]}>
        <planeGeometry args={[9.8, 1.9]} />
        <meshStandardMaterial color="#e07a3c" roughness={0.8} />
      </mesh>
      <mesh position={[-3.2, 6.9, 0.35]}>
        <planeGeometry args={[2.4, 2.6]} />
        <meshStandardMaterial color="#2f5d8f" roughness={0.8} />
      </mesh>
      {[0.4, -0.3, -1.0].map((y, i) => (
        <mesh key={i} position={[1.6, 6.9 + y, 0.36]}>
          <planeGeometry args={[5.6 - i * 0.8, 0.32]} />
          <meshStandardMaterial color="#6b4a2f" roughness={0.8} />
        </mesh>
      ))}
      {/* catwalk light hood */}
      <mesh position={[0, 10.0, 0.6]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[9.5, 0.18, 0.7]} />
        <meshStandardMaterial color="#57534a" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  )
}

/** Route-66 water tower: tank on splayed legs. */
function WaterTower({ position, yaw }: { position: [number, number, number]; yaw: number }) {
  const legY = 4.2
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {(
        [
          [1, 1],
          [-1, 1],
          [1, -1],
          [-1, -1],
        ] as [number, number][]
      ).map(([sx, sz], i) => (
        <mesh key={i} position={[sx * 1.6, legY, sz * 1.6]} rotation={[sz * 0.12, 0, -sx * 0.12]}>
          <cylinderGeometry args={[0.12, 0.16, legY * 2, 7]} />
          <meshStandardMaterial color="#8a8072" metalness={0.4} roughness={0.7} />
        </mesh>
      ))}
      {/* cross bracing */}
      {[0, Math.PI / 2].map((r, i) => (
        <mesh key={i} position={[0, legY, 0]} rotation={[0, r, 0.5]}>
          <boxGeometry args={[0.1, 5.4, 0.1]} />
          <meshStandardMaterial color="#8a8072" metalness={0.4} roughness={0.7} />
        </mesh>
      ))}
      {/* tank */}
      <mesh position={[0, 9.4, 0]} castShadow>
        <cylinderGeometry args={[2.7, 2.7, 3.4, 16]} />
        <meshStandardMaterial color="#c9beac" metalness={0.25} roughness={0.7} />
      </mesh>
      {/* faded band */}
      <mesh position={[0, 9.4, 0]}>
        <cylinderGeometry args={[2.72, 2.72, 0.9, 16]} />
        <meshStandardMaterial color={RUST} roughness={0.8} />
      </mesh>
      {/* conical roof */}
      <mesh position={[0, 11.6, 0]}>
        <coneGeometry args={[2.9, 1.6, 16]} />
        <meshStandardMaterial color="#9c8f7a" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* finial */}
      <mesh position={[0, 12.6, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 6]} />
        <meshStandardMaterial color="#57534a" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  )
}

/** Lone roadside motel sign (painted, sun-bleached, subtle bulbs). */
function MotelSign({ position, yaw }: { position: [number, number, number]; yaw: number }) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 8, 8]} />
        <meshStandardMaterial color="#4a4640" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* main sign board */}
      <mesh position={[0, 7.6, 0]}>
        <boxGeometry args={[3.0, 4.6, 0.25]} />
        <meshStandardMaterial color="#d94f6b" roughness={0.65} />
      </mesh>
      {/* board frame */}
      <mesh position={[0, 7.6, 0.16]}>
        <boxGeometry args={[3.3, 4.9, 0.08]} />
        <meshStandardMaterial color={CHROME} metalness={0.7} roughness={0.35} />
      </mesh>
      {/* "MOTEL" letter bars */}
      {[1.5, 0.7, -0.1, -0.9].map((y, i) => (
        <mesh key={i} position={[0, 7.6 + y, 0.2]}>
          <boxGeometry args={[2.0, 0.4, 0.06]} />
          <meshStandardMaterial color="#f5efe0" roughness={0.6} />
        </mesh>
      ))}
      {/* diagonal arrow of light bulbs (subtle daytime glow) */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-1.9 + i * 0.6, 5.3 - Math.abs(i - 3) * 0.25, 0.22]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#ffe08a" emissive="#ffcf5a" emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
      ))}
      {/* small VACANCY tab */}
      <NeonSign position={[0, 5.1, 0.24]} size={[2.0, 0.5]} color="#3ad1c8" intensity={1.0} />
    </group>
  )
}

/** Small dry desert scrub bush. */
function Scrub({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      {(
        [
          [0, 0.25, 0, 0.5],
          [0.35, 0.2, 0.15, 0.36],
          [-0.3, 0.22, -0.1, 0.4],
        ] as [number, number, number, number][]
      ).map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <icosahedronGeometry args={[r, 0]} />
          <meshStandardMaterial color={i % 2 ? SCRUB : CACTUS_DK} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

export default function DesertRegion({ active }: { active: boolean }) {
  // ── hooks (all before the early return) ──
  const cacti = useMemo(
    () => [
      ...placeAlongBand('mojave', 10, 13, { jitterSide: 5, jitterAlong: 0.09 }),
      ...placeAlongBand('mojave', 9, -12, { jitterSide: 5, jitterAlong: 0.11 }),
      ...placeAlongBand('mojave', 6, 26, { jitterSide: 9, jitterAlong: 0.12 }),
    ],
    []
  )
  const poles = useMemo(() => placeAlongBand('mojave', 10, -10, { jitterSide: 0.4 }), [])
  // minSide clamps |offset| so jitter can never push a prop onto the carriageway
  // (guardrail ±5.3, asphalt ±4.6). Everything below stays at world |side| ≥ 6.5.
  const rocks = useMemo(() => placeAlongBand('mojave', 9, 11, { jitterSide: 6, jitterAlong: 0.14, minSide: 6.5 }), [])
  const scrub = useMemo(
    () => [
      ...placeAlongBand('mojave', 10, 7, { jitterSide: 4, jitterAlong: 0.13, minSide: 6.5 }),
      ...placeAlongBand('mojave', 8, -7, { jitterSide: 4, jitterAlong: 0.12, minSide: 6.5 }),
    ],
    []
  )
  const tumble = useMemo(() => placeAlongBand('mojave', 7, 6, { jitterSide: 5, jitterAlong: 0.2, minSide: 6.5 }), [])
  const patches = useMemo(() => placeAlongBand('mojave', 9, 9, { jitterSide: 6, jitterAlong: 0.16, minSide: 6.5 }), [])
  const fence = useMemo(() => placeAlongBand('mojave', 12, 8, { jitterSide: 0.22, jitterAlong: 0.015 }), [])

  // catenary wires between consecutive poles: sampled ALONG the road curve so the
  // spans bend with the road (poles sit at side −10, evenly spaced in t with no
  // along-jitter, so we can reconstruct each pole's t and walk the curve between
  // them). Two parallel lines straddling the pole line (±0.75), each dipping.
  const wires = useMemo(() => {
    const region = REGIONS.find((r) => r.key === 'mojave')!
    const tA = progressToT(region.pStart)
    const tB = progressToT(region.pEnd)
    const n = poles.length
    const p = new THREE.Vector3()
    const tan = new THREE.Vector3()
    const SUB = 4 // intermediate curve samples per span
    const BASE_SIDE = -10 // matches the poles' base side offset
    const Y_TOP = 6.35
    const SAG = 0.75
    const strands: [number, number, number][][] = []
    for (let i = 0; i < n - 1; i++) {
      const t0 = tA + (tB - tA) * (i / (n - 1))
      const t1 = tA + (tB - tA) * ((i + 1) / (n - 1))
      for (const off of [-0.75, 0.75]) {
        const pts: [number, number, number][] = []
        for (let k = 0; k <= SUB; k++) {
          const f = k / SUB
          const t = t0 + (t1 - t0) * f
          curve.getPointAt(t, p)
          curve.getTangentAt(t, tan).normalize()
          const rx = tan.z
          const rz = -tan.x
          const s = BASE_SIDE + off
          const dip = Math.sin(f * Math.PI) * SAG // catenary sag, 0 at poles
          pts.push([p.x + rx * s, Y_TOP - dip, p.z + rz * s])
        }
        strands.push(pts)
      }
    }
    return strands
  }, [poles])

  // fence rails between consecutive posts (two straight strands)
  const rails = useMemo(() => {
    const segs: { a: [number, number, number]; b: [number, number, number] }[] = []
    for (let i = 0; i < fence.length - 1; i++) {
      const A = fence[i].position
      const B = fence[i + 1].position
      for (const y of [1.0, 0.55]) {
        segs.push({ a: [A[0], y, A[2]], b: [B[0], y, B[2]] })
      }
    }
    return segs
  }, [fence])

  // three depth layers of mesas on both sides for real parallax
  const mesasNear = useMemo(() => placeAlongBand('mojave', 4, 44, { jitterSide: 6, jitterAlong: 0.1 }), [])
  const mesasMid = useMemo(() => placeAlongBand('mojave', 4, 62, { jitterSide: 8, jitterAlong: 0.12 }), [])
  const mesasFar = useMemo(() => placeAlongBand('mojave', 3, 88, { jitterSide: 12, jitterAlong: 0.14 }), [])
  const mesasLeftNear = useMemo(() => placeAlongBand('mojave', 3, -46, { jitterSide: 7, jitterAlong: 0.12 }), [])
  const mesasLeftFar = useMemo(() => placeAlongBand('mojave', 3, -78, { jitterSide: 10, jitterAlong: 0.13 }), [])

  // Distant desert "town": 5 low CC0 City-Kit GLBs nestled between the near (44)
  // and mid (62) mesa layers on the right, FAR off the carriageway. Short (5–9 m)
  // so they stay below the mesa skyline, warm sun-baked tint, no emissive (it's
  // daytime) — a subtle far-horizon silhouette that never crowds the road.
  const town = useMemo(
    () =>
      placeKit(CITY_LOW[0], 'mojave', 5, 52, {
        jitterSide: 8,
        jitterAlong: 0.4,
        tint: '#b39169',
      }).map((b, i) => ({
        ...b,
        url: CITY_LOW[i % CITY_LOW.length], // vary the building per slot
        height: 5 + h01(i * 9 + 2) * 4, // 5–9 m
      })),
    []
  )

  // Hero diner sits at the band-center station (same t as the stop marker at
  // side 6.4). Pushed to side 16.5 (was 14) so the 18-wide main body — centred
  // at local x 0, inner wall at local x −9 → world side 7.5 — clears the
  // guardrail (±5.3), the 6.5 prop corridor and the stop marker, leaving the
  // chase-cam room instead of embedding the sign inside the diner wall.
  const diner = useMemo(() => bandCenter('mojave', 16.5), [])
  const landmarks = useMemo(() => {
    const right = placeAlongBand('mojave', 6, 30, { jitterAlong: 0.05 })
    const left = placeAlongBand('mojave', 6, -17, { jitterAlong: 0.05 })
    return {
      billboard: left[1],
      motel: left[4],
      waterTower: right[4],
    }
  }, [])

  if (!active) return null

  return (
    <group>
      {/* ── Hero diner + parking lot + neon sign ── */}
      <Diner base={diner} />

      {/* ── Route-66 landmarks ── */}
      <Billboard position={landmarks.billboard.position} yaw={landmarks.billboard.yaw + 0.4} />
      <WaterTower position={landmarks.waterTower.position} yaw={landmarks.waterTower.yaw} />
      <MotelSign position={landmarks.motel.position} yaw={landmarks.motel.yaw - 0.3} />

      {/* ── Layered mesas / buttes: three depths, both sides, atmospheric fade ── */}
      {mesasFar.map((p, i) => (
        <Mesa
          key={`mf${i}`}
          position={p.position}
          yaw={p.yaw + (h01(i + 20) - 0.5)}
          w={26 + h01(i + 1) * 18}
          h={13 + h01(i + 2) * 10}
          d={20 + h01(i + 3) * 12}
          color={MESA_FAR}
        />
      ))}
      {mesasLeftFar.map((p, i) => (
        <Mesa
          key={`mlf${i}`}
          position={p.position}
          yaw={p.yaw + (h01(i + 70) - 0.5)}
          w={24 + h01(i + 11) * 16}
          h={12 + h01(i + 12) * 9}
          d={18 + h01(i + 13) * 12}
          color={MESA_FAR}
        />
      ))}
      {mesasMid.map((p, i) => (
        <Mesa
          key={`mm${i}`}
          position={p.position}
          yaw={p.yaw + (h01(i + 30) - 0.5)}
          w={19 + h01(i + 4) * 12}
          h={10 + h01(i + 5) * 7}
          d={15 + h01(i + 6) * 9}
          color={MESA_MID}
        />
      ))}
      {mesasNear.map((p, i) => (
        <Mesa
          key={`mn${i}`}
          position={p.position}
          yaw={p.yaw + (h01(i + 40) - 0.5)}
          w={16 + h01(i + 5) * 10}
          h={8 + h01(i + 6) * 6}
          d={12 + h01(i + 7) * 8}
          color={MESA_NEAR}
        />
      ))}
      {mesasLeftNear.map((p, i) => (
        <Mesa
          key={`mln${i}`}
          position={p.position}
          yaw={p.yaw + (h01(i + 60) - 0.5)}
          w={17 + h01(i + 8) * 11}
          h={9 + h01(i + 9) * 6}
          d={13 + h01(i + 10) * 8}
          color={MESA_MID}
        />
      ))}

      {/* ── Distant desert town: a few real CC0 City-Kit GLBs on the horizon ── */}
      {town.map((b, i) => (
        <KitModel
          key={`town${i}`}
          url={b.url}
          position={b.position}
          yaw={b.yaw}
          height={b.height}
          tint={b.kit.tint}
        />
      ))}

      {/* ── Cracked-earth ground patches (flat, just above y=0) ── */}
      {patches.map((p, i) => {
        const s = 3 + h01(i * 2.3) * 4
        return (
          <mesh
            key={`pa${i}`}
            position={[p.position[0], 0.015, p.position[2]]}
            rotation={[-Math.PI / 2, 0, h01(i) * Math.PI]}
          >
            <planeGeometry args={[s, s * (0.6 + h01(i + 1) * 0.5)]} />
            <meshStandardMaterial color={i % 2 ? SAND_CRACK : '#93724a'} roughness={1} />
          </mesh>
        )
      })}

      {/* ── Saguaro cacti scattered both shoulders ── */}
      {cacti.map((p, i) => (
        <Saguaro
          key={`c${i}`}
          position={p.position}
          yaw={p.yaw + (h01(i) - 0.5) * 2}
          scale={0.8 + h01(i * 3.7) * 0.7}
        />
      ))}

      {/* ── Scrub bushes ── */}
      {scrub.map((p, i) => (
        <Scrub key={`s${i}`} position={p.position} scale={0.7 + h01(i * 4.3) * 0.9} />
      ))}

      {/* ── Telephone poles + sagging catenary wires ── */}
      {poles.map((p, i) => (
        <TelephonePole key={`p${i}`} position={p.position} yaw={p.yaw} />
      ))}
      {wires.map((pts, i) => (
        <WirePolyline key={`w${i}`} points={pts} radius={0.03} color="#1c1c1f" />
      ))}

      {/* ── Dry roadside fence (posts + two rails) ── */}
      {fence.map((p, i) => (
        <mesh key={`fp${i}`} position={[p.position[0], 0.6, p.position[2]]} rotation={[0, p.yaw, 0]} castShadow>
          <boxGeometry args={[0.12, 1.2, 0.12]} />
          <meshStandardMaterial color={WOOD_LT} roughness={0.95} />
        </mesh>
      ))}
      {rails.map((r, i) => (
        <Strand key={`fr${i}`} a={r.a} b={r.b} radius={0.05} sag={0} color={WOOD} roughness={0.95} />
      ))}

      {/* ── Tumbleweeds ── */}
      {tumble.map((p, i) => {
        const s = 0.45 + h01(i * 6.7) * 0.5
        return (
          <mesh
            key={`t${i}`}
            position={[p.position[0], s * 0.7, p.position[2]]}
            rotation={[h01(i) * 3, h01(i + 1) * 6, h01(i + 2) * 3]}
          >
            <icosahedronGeometry args={[s, 1]} />
            <meshStandardMaterial color="#b79a63" roughness={1} flatShading wireframe />
          </mesh>
        )
      })}

      {/* ── Roadside rocks / tumble details ── */}
      {rocks.map((p, i) => {
        const s = 0.5 + h01(i * 5.1) * 1.1
        return (
          <mesh
            key={`r${i}`}
            position={[p.position[0], s * 0.4, p.position[2]]}
            rotation={[h01(i) * 3, h01(i + 1) * 6, h01(i + 2) * 3]}
            castShadow
          >
            <dodecahedronGeometry args={[s, 0]} />
            <meshStandardMaterial color={i % 2 ? SAND_DARK : '#8f6a45'} roughness={1} flatShading />
          </mesh>
        )
      })}
    </group>
  )
}

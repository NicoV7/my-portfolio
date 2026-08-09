'use client'

import * as THREE from 'three'
import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { curve, progressToT, REGIONS, type RegionKey } from '../curve'
import { makeRamp } from '../toonRamp'

/** CC0 GLB kits under public/models/kits/ (Kenney City Kit, etc. — see CREDITS). */
export const KIT = '/models/kits'

/**
 * Shared building blocks + placement helpers for the region scenery. Region
 * files import these to dress their progress band. Plain meshes only — drei
 * `<Instances>` crashes R3F here.
 */

export interface Placement {
  position: [number, number, number]
  yaw: number
}

const hash01 = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}

/**
 * Evenly-spaced placements along a region's band, offset `side` from the road.
 * `minSide` clamps the final |offset| so props can't spill onto the carriageway
 * (guardrail sits at ±5.3, asphalt edge at ±4.6). `t` is clamped to the band so
 * jitter can't push a prop into the adjacent region during the ±1 mount window.
 */
export function placeAlongBand(
  key: RegionKey,
  count: number,
  side: number,
  opts: { jitterSide?: number; jitterAlong?: number; minSide?: number } = {}
): Placement[] {
  const region = REGIONS.find((r) => r.key === key)!
  const tA = progressToT(region.pStart)
  const tB = progressToT(region.pEnd)
  const lo = Math.min(tA, tB)
  const hi = Math.max(tA, tB)
  const p = new THREE.Vector3()
  const tan = new THREE.Vector3()
  const out: Placement[] = []
  for (let i = 0; i < count; i++) {
    let f = count === 1 ? 0.5 : i / (count - 1)
    if (opts.jitterAlong) f += (hash01(i + 3) - 0.5) * opts.jitterAlong
    const t = THREE.MathUtils.clamp(tA + (tB - tA) * f, lo, hi)
    curve.getPointAt(t, p)
    curve.getTangentAt(t, tan).normalize()
    const rx = tan.z
    const rz = -tan.x
    let s = side + (opts.jitterSide ? (hash01(i + 7) * 2 - 1) * opts.jitterSide : 0)
    if (opts.minSide) s = (s < 0 ? -1 : 1) * Math.max(Math.abs(s), opts.minSide)
    out.push({ position: [p.x + rx * s, 0, p.z + rz * s], yaw: Math.atan2(tan.x, tan.z) })
  }
  return out
}

/** World-space center of a region band (for hero landmarks). */
export function bandCenter(key: RegionKey, side = 0): Placement {
  return placeAlongBand(key, 1, side)[0]
}

/** Canvas texture of a lit-window facade for skyscrapers. */
export function useWindowTexture(tint = '#8fb7ff'): THREE.CanvasTexture {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#05070d'
    ctx.fillRect(0, 0, 64, 64)
    ctx.fillStyle = tint
    for (let y = 4; y < 64; y += 8) {
      for (let x = 4; x < 64; x += 8) {
        if (Math.random() > 0.45) {
          ctx.globalAlpha = 0.5 + Math.random() * 0.5
          ctx.fillRect(x, y, 4, 5)
        }
      }
    }
    const tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    return tex
  }, [tint])
}

export function Building({
  position,
  size = [6, 20, 6],
  yaw = 0,
  windows,
}: {
  position: [number, number, number]
  size?: [number, number, number]
  yaw?: number
  windows?: THREE.Texture
}) {
  const repeat = useMemo(() => {
    if (!windows) return null
    const t = windows.clone()
    t.needsUpdate = true
    t.repeat.set(Math.max(1, Math.round(size[0] / 3)), Math.max(2, Math.round(size[1] / 4)))
    return t
  }, [windows, size])
  // Break up the "42 identical boxes" read: per-instance tint + a setback crown
  // on taller towers (deterministic from position, no API change for callers).
  const h = hash01(position[0] * 0.31 + position[2] * 0.73)
  const body = useMemo(() => new THREE.Color('#0a0d16').offsetHSL(0, 0, (h - 0.5) * 0.06), [h])
  const crown = size[1] > 24
  const cw = size[0] * (0.5 + h * 0.18)
  const cd = size[2] * (0.5 + h * 0.18)
  const ch = 1.4 + h * 2.6
  return (
    <group position={[position[0], 0, position[2]]} rotation={[0, yaw, 0]}>
      <mesh position={[0, size[1] / 2, 0]} castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={body}
          emissive="#7fa8ff"
          emissiveMap={repeat ?? undefined}
          emissiveIntensity={repeat ? 1.4 : 0}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      {crown && (
        <mesh position={[(h - 0.5) * size[0] * 0.3, size[1] + ch / 2, (h - 0.5) * size[2] * 0.3]} castShadow>
          <boxGeometry args={[cw, ch, cd]} />
          <meshStandardMaterial color={body} metalness={0.4} roughness={0.7} />
        </mesh>
      )}
    </group>
  )
}

export function NeonSign({
  position,
  yaw = 0,
  size = [2.6, 1.2],
  color = '#22e0ff',
  intensity = 3,
}: {
  position: [number, number, number]
  yaw?: number
  size?: [number, number]
  color?: string
  intensity?: number
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh>
        <planeGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[size[0] + 0.2, size[1] + 0.2, 0.1]} />
        <meshStandardMaterial color="#05060a" metalness={0.5} roughness={0.6} />
      </mesh>
    </group>
  )
}

export function Streetlight({
  position,
  yaw = 0,
  color = '#ffb54a',
  height = 6,
}: {
  position: [number, number, number]
  yaw?: number
  color?: string
  height?: number
}) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.11, height, 8]} />
        <meshStandardMaterial color="#2a2e35" metalness={0.7} roughness={0.5} />
      </mesh>
      {/* cobra-head arm cantilevers OVER the road (local −x = toward centre),
          not down the lane */}
      <mesh position={[-0.9, height - 0.1, 0]}>
        <boxGeometry args={[1.8, 0.1, 0.14]} />
        <meshStandardMaterial color="#2a2e35" metalness={0.7} roughness={0.5} />
      </mesh>
      <mesh position={[-1.7, height - 0.2, 0]}>
        <boxGeometry args={[0.6, 0.14, 0.34]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} toneMapped={false} />
      </mesh>
    </group>
  )
}

/**
 * Dark 3-sided tunnel shell over the road (used at region borders). A wave of
 * ceiling light bars pulses down its length so you feel like you *blast through*
 * it during the seam transition, not pass a static tube.
 */
export function Tunnel({
  position,
  yaw = 0,
  length = 30,
  halfWidth = 6.5,
  height = 6,
  strip = '#ff3d7f',
}: {
  position: [number, number, number]
  yaw?: number
  length?: number
  halfWidth?: number
  height?: number
  strip?: string
}) {
  const BARS = 14
  const barMats = useMemo(
    () =>
      Array.from(
        { length: BARS },
        () => new THREE.MeshStandardMaterial({ color: strip, emissive: strip, emissiveIntensity: 1, toneMapped: false })
      ),
    [strip]
  )
  const stripMats = useMemo(
    () =>
      [0, 1].map(
        () => new THREE.MeshStandardMaterial({ color: strip, emissive: strip, emissiveIntensity: 2.4, toneMapped: false })
      ),
    [strip]
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // gouache pass: soft pulse — the old 4x wash tinted whole nearby scenes
    for (let i = 0; i < BARS; i++) {
      const w = Math.sin(t * 6 - i * 0.9)
      barMats[i].emissiveIntensity = 0.3 + Math.max(0, w) * 1.2
    }
    const p = 1.1 + Math.sin(t * 4) * 0.35
    stripMats[0].emissiveIntensity = p
    stripMats[1].emissiveIntensity = p
  })

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * halfWidth, height / 2, 0]}>
          <boxGeometry args={[0.6, height, length]} />
          <meshStandardMaterial color="#0a0a0f" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[halfWidth * 2 + 0.6, 0.6, length]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.3} roughness={0.8} />
      </mesh>
      {[-1, 1].map((s, i) => (
        <mesh key={`st${s}`} position={[s * (halfWidth - 0.4), height - 0.5, 0]} material={stripMats[i]}>
          <boxGeometry args={[0.12, 0.12, length]} />
        </mesh>
      ))}
      {/* ceiling light bars — the rushing wave */}
      {barMats.map((m, i) => {
        const z = -length / 2 + (length / (BARS - 1)) * i
        return (
          <mesh key={`bar${i}`} position={[0, height - 0.35, z]} material={m}>
            <boxGeometry args={[halfWidth * 1.7, 0.12, 0.35]} />
          </mesh>
        )
      })}
    </group>
  )
}

// ── GLB kit models ─────────────────────────────────────────────────────────
// Real CC0 assets replacing the procedural boxes. Kits ship at arbitrary native
// scales, so KitModel auto-normalizes: it measures the loaded bbox, scales to a
// target world `height`, seats the base at y=0 and centres X/Z — so a caller only
// picks a height and never fights the kit's units. `clone(true)` shares geometry
// (and materials, unless a tint forces a per-instance clone) so many instances of
// one GLB stay cheap. No drei `<Instances>` (crashes here).

/**
 * Gouache restyle spec for a kit model. When present, every mesh material is
 * swapped for a matte `MeshToonMaterial` (no texture maps, no metalness) whose
 * `gradientMap` is a smooth multi-stop ramp (see toonRamp.ts — soft gouache
 * shading, not hard cel bands). Base colors come from mapping each part's
 * existing dominant material color onto the scene `palette` (nearest-of-palette
 * quantization), so kit assets pick up the reference frame's palette instead of
 * shipping their own colors.
 */
export interface GouacheSpec {
  /** sRGB stops for the toon lighting ramp, shadow → highlight */
  ramp: string[]
  /** scene palette; each part's material color snaps to the nearest entry */
  palette?: string[]
}

// Toon materials are shared across every kit instance that resolves to the same
// (color, ramp, emissive) triple — clones stay cheap even with gouache on.
const TOON_CACHE = new Map<string, THREE.MeshToonMaterial>()

function toonMat(
  color: THREE.Color,
  ramp: string[],
  emissive?: string,
  emissiveIntensity = 1
): THREE.MeshToonMaterial {
  const key = `${color.getHexString()}|${ramp.join(',')}|${emissive ?? ''}|${emissive ? emissiveIntensity : 0}`
  const hit = TOON_CACHE.get(key)
  if (hit) return hit
  const m = new THREE.MeshToonMaterial({ color: color.clone(), gradientMap: makeRamp(ramp) })
  if (emissive) {
    m.emissive.set(emissive)
    m.emissiveIntensity = emissiveIntensity
  }
  TOON_CACHE.set(key, m)
  return m
}

/** Nearest palette entry by RGB distance (both sides in linear working space). */
function nearestOf(palette: THREE.Color[], c: THREE.Color): THREE.Color {
  let best = palette[0]
  let bd = Infinity
  for (const p of palette) {
    const d = (p.r - c.r) ** 2 + (p.g - c.g) ** 2 + (p.b - c.b) ** 2
    if (d < bd) {
      bd = d
      best = p
    }
  }
  return best
}

export interface KitOpts {
  /** target world height (m); the model scales uniformly to hit it */
  height?: number
  /** per-instance solid recolour of every mesh */
  tint?: string
  /** per-instance emissive (e.g. lit night windows) */
  emissive?: string
  emissiveIntensity?: number
  /** matte toon restyle — see GouacheSpec (pass a module-const for stability) */
  gouache?: GouacheSpec
}

export function KitModel({
  url,
  position,
  yaw = 0,
  height,
  tint,
  emissive,
  emissiveIntensity = 1,
  gouache,
}: {
  url: string
  position: [number, number, number]
  yaw?: number
} & KitOpts) {
  const { scene } = useGLTF(url)
  const obj = useMemo(() => {
    const root = scene.clone(true)
    if (height) {
      const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3())
      root.scale.setScalar(height / Math.max(1e-3, size.y))
    }
    root.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(root)
    const c = box.getCenter(new THREE.Vector3())
    root.position.set(-c.x, -box.min.y, -c.z) // seat base on the ground, centre X/Z
    const palette = gouache?.palette?.map((h) => new THREE.Color(h))
    const recolour = tint || emissive
    root.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return
      o.castShadow = true
      o.receiveShadow = true
      const wasArray = Array.isArray(o.material)
      const mats = wasArray ? (o.material as THREE.Material[]) : [o.material as THREE.Material]
      if (gouache) {
        // Gouache mode: matte toon materials, flat base color per part, no
        // texture maps. Base color = the part's dominant material color (or the
        // explicit tint) snapped to the scene palette.
        const swapped = mats.map((m) => {
          const src = m as THREE.MeshStandardMaterial
          const base = tint ? new THREE.Color(tint) : src.color ? src.color.clone() : new THREE.Color('#888888')
          const col = palette ? nearestOf(palette, base) : base
          return toonMat(col, gouache.ramp, emissive, emissiveIntensity)
        })
        o.material = wasArray ? swapped : swapped[0]
        return
      }
      if (!recolour) return
      const cloned = mats.map((m) => {
        const c2 = (m as THREE.MeshStandardMaterial).clone()
        if (tint) c2.color.set(tint)
        if (emissive) {
          c2.emissive.set(emissive)
          c2.emissiveIntensity = emissiveIntensity
        }
        return c2
      })
      o.material = wasArray ? cloned : cloned[0]
    })
    return root
  }, [scene, height, tint, emissive, emissiveIntensity, gouache])
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <primitive object={obj} />
    </group>
  )
}

/** Place a GLB kit model along a region band (reuses placeAlongBand transforms). */
export function placeKit(
  url: string,
  key: RegionKey,
  count: number,
  side: number,
  opts: { jitterSide?: number; jitterAlong?: number; minSide?: number } & KitOpts = {}
): { position: [number, number, number]; yaw: number; url: string; kit: KitOpts }[] {
  const { jitterSide, jitterAlong, minSide, ...kit } = opts
  return placeAlongBand(key, count, side, { jitterSide, jitterAlong, minSide }).map((p) => ({
    ...p,
    url,
    kit,
  }))
}

/** Kick off fetch/parse for kit URLs mounted by the active level. */
export function preloadKits(...urls: string[]) {
  for (const u of urls) useGLTF.preload(u)
}

// City Kit (Kenney, CC0) building catalogs — a few distinct GLBs cloned many
// times keeps fetches low (each is ~10-60KB) while giving skyline variety.
const CITY = `${KIT}/city`
export const CITY_TALL = [
  'skyscraper',
  'skyscraper-bwexdoouso',
  'skyscraper-jirx0ahyor',
  'skyscraper-obyd8hwltz',
  'skyscraper-pspe0mzk0e',
  'skyscraper-xst1j6kysl',
].map((n) => `${CITY}/${n}.glb`)
export const CITY_MID = [
  'large-building',
  'large-building-1bt4yykmuk',
  'large-building-3ihryzp6tp',
  'large-building-h7jaq7bqmq',
  'large-building-jggljh2ixj',
  'large-building-sxxonomtct',
].map((n) => `${CITY}/${n}.glb`)
export const CITY_LOW = [
  'low-building',
  'low-building-4ropd9bksx',
  'low-building-9fekmptsai',
  'low-building-dyebydpfjr',
  'low-building-sobkc8mio2',
  'low-wide',
].map((n) => `${CITY}/${n}.glb`)

/**
 * A GLB skyline for a level band: three depth rows (tall / mid / low) of real
 * Kenney City-Kit buildings placed with `placeAlongBand`, auto-normalised to the
 * given heights, clamped off the camera corridor. `night` adds a faint window-tint
 * emissive so buildings read as lit-at-a-distance rather than black silhouettes
 * (neon signage is layered on separately by the region). Scale it via the side
 * offsets to fit a level's road framing.
 */
export function CitySkyline({
  band,
  night = 1,
  windowColor = '#9fc0ff',
  farSide = 34,
  midSide = 23,
  nearSide = 15,
  gouache,
}: {
  band: RegionKey
  night?: number
  windowColor?: string
  farSide?: number
  midSide?: number
  nearSide?: number
  gouache?: GouacheSpec
}) {
  const items = useMemo(() => {
    const out: { url: string; position: [number, number, number]; yaw: number; h: number }[] = []
    const row = (arr: string[], count: number, side: number, hMin: number, hMax: number, js: number) => {
      // jitter only OUTWARD (minSide = base |side|) so a wide tall building's face
      // never creeps into the chase-cam corridor.
      placeAlongBand(band, count, side, {
        jitterSide: js,
        jitterAlong: 0.55,
        minSide: Math.abs(side),
      }).forEach((p, i) => out.push({ url: arr[i % arr.length], position: p.position, yaw: p.yaw, h: hMin + hash01(i * 7 + side) * (hMax - hMin) }))
    }
    row(CITY_TALL, 6, farSide, 34, 62, 8)
    row(CITY_TALL, 6, -farSide, 34, 62, 8)
    row(CITY_MID, 6, midSide, 18, 32, 4)
    row(CITY_MID, 6, -midSide, 18, 32, 4)
    row(CITY_LOW, 5, nearSide, 8, 14, 2)
    row(CITY_LOW, 5, -nearSide, 8, 14, 2)
    return out
  }, [band, farSide, midSide, nearSide])

  return (
    <group>
      {items.map((it, i) => (
        <KitModel
          key={i}
          url={it.url}
          position={it.position}
          yaw={it.yaw}
          height={it.h}
          emissive={night ? windowColor : undefined}
          emissiveIntensity={night ? 0.05 : 0}
          gouache={gouache}
        />
      ))}
    </group>
  )
}

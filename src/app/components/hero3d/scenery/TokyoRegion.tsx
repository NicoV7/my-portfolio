'use client'

import * as THREE from 'three'
import { useMemo } from 'react'
import type { RegionKey } from '../curve'
import { placeAlongBand, NeonSign, CitySkyline } from './kit'

const NEON = ['#22e0ff', '#ff3d7f', '#ffd23d', '#3dff88'] as const
const hash01 = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}
const pick = (seed: number) => NEON[Math.floor(hash01(seed) * NEON.length)]

/**
 * Elevated Tokyo expressway deck on tall pillars with a lit guard barrier —
 * the classic overhead highway snaking beside the road. `deckY`/`length` tune
 * the deck for a low side-runner or a high overhead cross-deck.
 */
function Expressway({
  position,
  yaw,
  length,
  deckY = 9,
}: {
  position: [number, number, number]
  yaw: number
  length: number
  deckY?: number
}) {
  const pillars = Math.max(2, Math.round(length / 12))
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* main deck */}
      <mesh position={[0, deckY, 0]} castShadow>
        <boxGeometry args={[5.5, 0.9, length]} />
        <meshStandardMaterial color="#12141d" metalness={0.4} roughness={0.7} />
      </mesh>
      {/* underside ribbing hint */}
      <mesh position={[0, deckY - 0.7, 0]}>
        <boxGeometry args={[4.6, 0.5, length]} />
        <meshStandardMaterial color="#080a10" metalness={0.3} roughness={0.85} />
      </mesh>
      {/* guard barriers both edges with an emissive top strip */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 2.7, deckY + 0.75, 0]}>
            <boxGeometry args={[0.25, 1.1, length]} />
            <meshStandardMaterial color="#1a1d28" metalness={0.5} roughness={0.6} />
          </mesh>
          <mesh position={[s * 2.7, deckY + 1.3, 0]}>
            <boxGeometry args={[0.14, 0.12, length]} />
            <meshStandardMaterial color="#ff5a3d" emissive="#ff5a3d" emissiveIntensity={1.1} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* red/white tail-light river down the deck */}
      <mesh position={[1.2, deckY + 0.55, 0]}>
        <boxGeometry args={[0.5, 0.06, length]} />
        <meshStandardMaterial color="#ff2a2a" emissive="#ff2a2a" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh position={[-1.2, deckY + 0.55, 0]}>
        <boxGeometry args={[0.5, 0.06, length]} />
        <meshStandardMaterial color="#fff2d0" emissive="#fff2d0" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {/* support pillars */}
      {Array.from({ length: pillars }).map((_, i) => {
        const z = -length / 2 + (length / (pillars - 1)) * i
        return (
          <mesh key={i} position={[0, deckY / 2, z]} castShadow>
            <cylinderGeometry args={[0.55, 0.7, deckY, 10]} />
            <meshStandardMaterial color="#0d0f16" metalness={0.35} roughness={0.75} />
          </mesh>
        )
      })}
    </group>
  )
}

/** Vertical stack of Japanese-signage neon panels on a pole. */
function NeonStack({ position, yaw, seed }: { position: [number, number, number]; yaw: number; seed: number }) {
  const panels = 4 + Math.floor(hash01(seed) * 3) // 4..6
  const poleH = 3 + panels * 1.7
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* pole */}
      <mesh position={[0, poleH / 2, 0]}>
        <cylinderGeometry args={[0.12, 0.16, poleH, 8]} />
        <meshStandardMaterial color="#15171f" metalness={0.6} roughness={0.5} />
      </mesh>
      {Array.from({ length: panels }).map((_, i) => {
        const y = 3 + i * 1.7
        const color = pick(seed + i * 3.3)
        const w = 1.4 + hash01(seed + i) * 1.1
        const inten = 3 + hash01(seed + i * 1.7) * 1.6
        return (
          <group key={i} position={[0.4, y, 0]}>
            <mesh>
              <planeGeometry args={[w, 1.3]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={inten} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
            {/* backing frame */}
            <mesh position={[0, 0, -0.04]}>
              <boxGeometry args={[w + 0.15, 1.45, 0.08]} />
              <meshStandardMaterial color="#05060a" metalness={0.5} roughness={0.6} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/** Tall thin neon banner hanging vertically off a building face. */
function HangingBanner({ position, yaw, seed }: { position: [number, number, number]; yaw: number; seed: number }) {
  const h = 4 + hash01(seed) * 3
  const topY = 10 + hash01(seed + 2) * 3
  const color = pick(seed)
  return (
    <group position={[position[0], topY, position[2]]} rotation={[0, yaw, 0]}>
      {/* banner face */}
      <mesh position={[0, -h / 2, 0]}>
        <planeGeometry args={[1.1, h]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* dark backing */}
      <mesh position={[0, -h / 2, -0.05]}>
        <boxGeometry args={[1.25, h + 0.2, 0.1]} />
        <meshStandardMaterial color="#04050a" metalness={0.5} roughness={0.6} />
      </mesh>
    </group>
  )
}

/** Street-level shopfront: a glowing horizontal strip + a couple of small signs. */
function ShopFront({ position, yaw, seed }: { position: [number, number, number]; yaw: number; seed: number }) {
  const c1 = pick(seed)
  const c2 = pick(seed + 4.2)
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {/* under-awning glow strip */}
      <mesh position={[0, 2.6, 0]}>
        <boxGeometry args={[4.4, 0.18, 0.1]} />
        <meshStandardMaterial color={c1} emissive={c1} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* lit shop window */}
      <mesh position={[0, 1.3, 0.02]}>
        <planeGeometry args={[4, 2.2]} />
        <meshStandardMaterial color="#ffdca0" emissive="#ffdca0" emissiveIntensity={1.4} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* small horizontal sign above */}
      <mesh position={[-1, 3.4, 0.05]}>
        <planeGeometry args={[1.8, 0.7]} />
        <meshStandardMaterial color={c2} emissive={c2} emissiveIntensity={1.2} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/** Glowing vending-machine-sized box at street level. */
function VendingBox({ position, yaw, seed }: { position: [number, number, number]; yaw: number; seed: number }) {
  const color = pick(seed)
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.9, 1.8, 0.7]} />
        <meshStandardMaterial color="#0c0e14" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* glowing front panel */}
      <mesh position={[0, 1, 0.37]}>
        <planeGeometry args={[0.7, 1.4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/** Overhead gantry sign frame spanning near/over the road. */
function Gantry({ position, yaw }: { position: [number, number, number]; yaw: number }) {
  // span 14 → legs land at ±7: past the ±6 line the brief asks for, clear of the
  // guardrail (±5.3) and inside the road's own lamp poles (±7.7), so the frame
  // never drops a leg onto the carriageway or clips a road lamp.
  const span = 14
  const h = 7
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * span) / 2, h / 2, 0]}>
          <boxGeometry args={[0.35, h, 0.35]} />
          <meshStandardMaterial color="#14161d" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
      {/* top truss beam */}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[span, 0.4, 0.4]} />
        <meshStandardMaterial color="#14161d" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* sign boxes hanging off the beam */}
      {[-1, 0, 1].map((c, i) => (
        <group key={i} position={[c * 3, h - 1.1, 0.25]}>
          <mesh>
            <planeGeometry args={[2.4, 1.3]} />
            <meshStandardMaterial
              color={i === 1 ? '#3dff88' : '#22e0ff'}
              emissive={i === 1 ? '#3dff88' : '#22e0ff'}
              emissiveIntensity={1.1}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[2.6, 1.5, 0.1]} />
            <meshStandardMaterial color="#05060a" metalness={0.5} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** ① Tokyo Drift expressway — elevated highway, stacked neon, lit skyline, gantries. */
export default function TokyoRegion({
  active,
  band = 'tokyo',
}: {
  active: boolean
  band?: RegionKey
}) {
  const scene = useMemo(() => {
    // Buildings are the real GLB CitySkyline (rendered below); this region only
    // supplies the near-road neon character layered in front of it.

    // Elevated expressway side-runner: moved into the ONLY sparse lane — the road
    // corridor at side 9 (past the ±7.7 road lamps, its deck outer edge at 11.75
    // stops short of the near-tower inner faces at ~14.25). It rides at y9 over
    // the corridor so the shorter frontage props pass underneath.
    const deck = placeAlongBand(band, 2, 9, { jitterAlong: 0.15 })
    // A SINGLE high cross-deck at band centre; its pillars are pulled in to ±9
    // (see render length 18) — off the carriageway and short of the tower rows.
    const crossDeck = placeAlongBand(band, 1, 0)

    // Frontage neon lives in the clear band between the side-runner deck's outer
    // edge (11.75) and the near-tower faces (~14.25): stacks 13, billboards /
    // banners 13.5. All well past the ±8 near-road corridor.
    const stacks = placeAlongBand(band, 4, 13, { jitterSide: 0.5, jitterAlong: 0.5, minSide: 8 })
    const stacksL = placeAlongBand(band, 4, -13, { jitterSide: 0.5, jitterAlong: 0.5, minSide: 8 })

    // Big wall billboards on the near-tower frontage (side 13.5 — now IN FRONT of
    // the pushed-back near towers instead of buried inside them).
    const billboards = placeAlongBand(band, 4, 13.5, { jitterAlong: 0.5, minSide: 8 })
    const billboardsL = placeAlongBand(band, 4, -13.5, { jitterAlong: 0.5, minSide: 8 })

    // Tall hanging vertical banners on the near building faces (side ~13.5).
    const banners = placeAlongBand(band, 3, 13.5, { jitterAlong: 0.55, minSide: 8 })
    const bannersL = placeAlongBand(band, 3, -13.5, { jitterAlong: 0.55, minSide: 8 })

    // Street-level shopfronts — moved off the deck lane to side 12 (their 4.4-wide
    // face reaches 9.8–14.2, threading between the deck pillars and tower faces).
    const shops = placeAlongBand(band, 4, 12, { jitterSide: 0.5, jitterAlong: 0.5, minSide: 8 })
    const shopsL = placeAlongBand(band, 4, -12, { jitterSide: 0.5, jitterAlong: 0.5, minSide: 8 })

    // A couple of overhead gantries spanning the road (legs at ±7, see Gantry).
    const gantries = placeAlongBand(band, 2, 0, { jitterAlong: 0.1 })

    // Vending boxes — small ground props, moved to side 12.6 clear of the deck
    // pillars (streetlights + kerb barriers stay dropped: the road supplies its
    // own lamps + guardrail).
    const vending = placeAlongBand(band, 3, 12.6, { jitterSide: 0.5, jitterAlong: 0.5, minSide: 8 })
    const vendingL = placeAlongBand(band, 3, -12.6, { jitterSide: 0.5, jitterAlong: 0.5, minSide: 8 })

    return {
      deck,
      crossDeck,
      stacks,
      stacksL,
      billboards,
      billboardsL,
      banners,
      bannersL,
      shops,
      shopsL,
      gantries,
      vending,
      vendingL,
    }
  }, [band])

  if (!active) return null

  return (
    <group>
      {/* real GLB skyline (Kenney City Kit) — the buildings */}
      <CitySkyline band={band} windowColor="#22e0ff" />

      {/* ---- Elevated expressway on pillars (side-runner, corridor lane) ---- */}
      {/* length 24: the two decks sit at the band ends and stop ~12 short of the
          band centre, so neither reaches the cross-deck's centre pillars. */}
      {scene.deck.map((d, i) => (
        <Expressway key={`dk${i}`} position={d.position} yaw={d.yaw} length={24} />
      ))}
      {/* ---- Second deck crossing high overhead ---- */}
      {/* length 18: pillars land at ±9 — off the carriageway, clear of the ±7.7
          road lamps, and short of the near towers (17+) so the deck slices none. */}
      {scene.crossDeck.map((d, i) => (
        <Expressway key={`cd${i}`} position={d.position} yaw={d.yaw + Math.PI / 2} length={18} deckY={15} />
      ))}

      {/* ---- Stacked neon signage poles ---- */}
      {scene.stacks.map((s, i) => (
        <NeonStack key={`ns${i}`} position={s.position} yaw={s.yaw} seed={i * 5.1 + 2} />
      ))}
      {scene.stacksL.map((s, i) => (
        <NeonStack key={`nsl${i}`} position={s.position} yaw={s.yaw + Math.PI} seed={i * 7.3 + 11} />
      ))}

      {/* ---- Large wall billboards, varied neon, stacked vertically ---- */}
      {scene.billboards.map((b, i) => (
        <group key={`bb${i}`}>
          <NeonSign position={[b.position[0], 10, b.position[2]]} yaw={b.yaw} size={[6, 3.6]} color={NEON[i % NEON.length]} intensity={2.6} />
          <NeonSign position={[b.position[0], 6, b.position[2]]} yaw={b.yaw} size={[4, 2]} color={NEON[(i + 2) % NEON.length]} intensity={3.2} />
        </group>
      ))}
      {scene.billboardsL.map((b, i) => (
        <group key={`bbl${i}`}>
          <NeonSign position={[b.position[0], 10.5, b.position[2]]} yaw={b.yaw + Math.PI} size={[5.2, 3.2]} color={NEON[(i + 1) % NEON.length]} intensity={2.6} />
          <NeonSign position={[b.position[0], 6.2, b.position[2]]} yaw={b.yaw + Math.PI} size={[3.6, 1.8]} color={NEON[(i + 3) % NEON.length]} intensity={3.2} />
        </group>
      ))}

      {/* ---- Hanging vertical banners ---- */}
      {scene.banners.map((b, i) => (
        <HangingBanner key={`hb${i}`} position={b.position} yaw={b.yaw} seed={i * 3.7 + 4} />
      ))}
      {scene.bannersL.map((b, i) => (
        <HangingBanner key={`hbl${i}`} position={b.position} yaw={b.yaw + Math.PI} seed={i * 6.1 + 17} />
      ))}

      {/* ---- Street-level shopfronts ---- */}
      {scene.shops.map((s, i) => (
        <ShopFront key={`sf${i}`} position={s.position} yaw={s.yaw} seed={i * 2.9 + 6} />
      ))}
      {scene.shopsL.map((s, i) => (
        <ShopFront key={`sfl${i}`} position={s.position} yaw={s.yaw + Math.PI} seed={i * 4.4 + 13} />
      ))}

      {/* ---- Overhead gantry frames ---- */}
      {scene.gantries.map((g, i) => (
        <Gantry key={`gy${i}`} position={g.position} yaw={g.yaw} />
      ))}

      {/* ---- Ground detail: vending boxes (road supplies its own lamps + rail) ---- */}
      {scene.vending.map((v, i) => (
        <VendingBox key={`vm${i}`} position={v.position} yaw={v.yaw + Math.PI} seed={i * 3.1 + 5} />
      ))}
      {scene.vendingL.map((v, i) => (
        <VendingBox key={`vml${i}`} position={v.position} yaw={v.yaw} seed={i * 5.7 + 15} />
      ))}
    </group>
  )
}

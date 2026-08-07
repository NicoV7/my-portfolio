'use client'

import * as THREE from 'three'
import { useMemo } from 'react'
import type { RegionKey } from '../curve'
import { placeAlongBand, NeonSign, Streetlight, CitySkyline } from './kit'

/**
 * ⑥ Ambra — the NIGHT-skyline FINALE / destination (present day).
 *
 * Deliberately CALMER and far LESS dense than Tokyo: a clean modern-HQ district
 * at night, now built from REAL Kenney City-Kit GLB towers (via `CitySkyline`)
 * instead of procedural boxes. The skyline uses LARGE side offsets
 * (far 34 / mid 22 / near 16) so the road corridor stays open and airy and the
 * finish marker on the near shoulder (side 6.4) stands completely alone — no
 * building crowds the stop. A sparse handful of mint `NeonSign` accents and cool
 * streetlights (fewer than Tokyo) keep the signature Ambra mint glow. Plain lit
 * meshes + GLB clones only — no `<Instances>`.
 */

const ACCENT = '#46e3b0' // Ambra mint (matches levels.ts accent/rim)

export default function AmbraRegion({ active, band }: { active: boolean; band: RegionKey }) {
  const scene = useMemo(() => {
    // Sparse mint accent signage on the near frontage — kept well back (side ≥ 16)
    // so nothing sits over the open corridor / finish marker.
    const signs = placeAlongBand(band, 2, 16, { jitterAlong: 0.5, minSide: 16 })

    // A few calm cool streetlights, kept OUT of the clear corridor (side ≥ 14).
    // Fewer than Tokyo — this district is airy, not a lit canyon.
    const lightsR = placeAlongBand(band, 3, 14.5, { jitterAlong: 0.3, minSide: 14 })
    const lightsL = placeAlongBand(band, 3, -14.5, { jitterAlong: 0.3, minSide: 14 })

    // Far, faint mint horizon glow banks so the city reads as ambient light, airy.
    const glow = placeAlongBand(band, 2, 58, { jitterAlong: 0.4 })

    return { signs, lightsR, lightsL, glow }
  }, [band])

  if (!active) return null

  return (
    <group>
      {/* ---- far mint horizon glow (drawn first, farthest back) ---- */}
      {scene.glow.map((g, i) => (
        <mesh key={`gl${i}`} position={[g.position[0], 7 + i * 5, g.position[2]]} rotation={[0, g.yaw, 0]}>
          <planeGeometry args={[240, 34]} />
          <meshBasicMaterial
            color="#3fe6bf"
            transparent
            opacity={0.06}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* ---- real GLB skyline (Kenney City Kit) — set WELL BACK for an airy HQ ---- */}
      {/* Larger side offsets than the default keep the near-road corridor + finish
          marker (side 6.4) clear; mint window emissive carries the Ambra accent. */}
      <CitySkyline band={band} windowColor={ACCENT} farSide={34} midSide={22} nearSide={16} />

      {/* ---- sparse mint accent signage on the near frontage ---- */}
      {scene.signs.map((s, i) => (
        <NeonSign
          key={`sg${i}`}
          position={[s.position[0], 5 + (i % 2) * 3, s.position[2]]}
          yaw={s.yaw + (i % 2 ? Math.PI : 0)}
          size={[3.2, 1.3]}
          color={ACCENT}
          intensity={2.2}
        />
      ))}

      {/* ---- calm cool streetlights, kept clear of the corridor (arms toward road) ---- */}
      {scene.lightsR.map((l, i) => (
        <Streetlight key={`sr${i}`} position={[l.position[0], 0, l.position[2]]} yaw={l.yaw} color="#bfeee2" height={7} />
      ))}
      {scene.lightsL.map((l, i) => (
        <Streetlight
          key={`sl${i}`}
          position={[l.position[0], 0, l.position[2]]}
          yaw={l.yaw + Math.PI}
          color="#bfeee2"
          height={7}
        />
      ))}
    </group>
  )
}

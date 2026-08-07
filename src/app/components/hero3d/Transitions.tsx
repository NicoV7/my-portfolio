'use client'

import * as THREE from 'three'
import { useMemo } from 'react'
import { BORDERS, curve, progressToT } from './curve'
import { LEVELS } from './levels'
import { Tunnel } from './scenery/kit'

/** A tunnel straddling each region seam — the car passes through as the screen
 * fades to black and the world swaps. */
export default function Transitions() {
  const tunnels = useMemo(() => {
    const p = new THREE.Vector3()
    const tan = new THREE.Vector3()
    return BORDERS.map((bp, bi) => {
      const t = progressToT(bp)
      curve.getPointAt(t, p)
      curve.getTangentAt(t, tan).normalize()
      return {
        position: [p.x, 0, p.z] as [number, number, number],
        yaw: Math.atan2(tan.x, tan.z),
        // crossing border i drives INTO level i+1 — light the tunnel its accent
        strip: LEVELS[Math.min(bi + 1, LEVELS.length - 1)].accent,
      }
    })
  }, [])

  return (
    <>
      {tunnels.map((t, i) => (
        <Tunnel key={i} position={t.position} yaw={t.yaw} strip={t.strip} />
      ))}
    </>
  )
}

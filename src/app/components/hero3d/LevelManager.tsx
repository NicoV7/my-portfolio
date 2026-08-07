'use client'

import { Suspense, lazy, type ComponentType } from 'react'
import { LEVELS, LEVEL_COUNT } from './levels'
import type { RegionKey } from './curve'

/**
 * Stateful level streaming: mounts ONLY the active level (± its neighbours during
 * a seam, loop-aware) so far levels' geometry never builds and — because each
 * region is `lazy()`-imported — their JS only downloads once first reached. This
 * is the "separate stateful levels to reduce load" core; the Persona-5 seam hold
 * hides the mount/unmount swap. Each level renders with the unified
 * `{ active, band }` scenery contract.
 */
type RegionComponent = ComponentType<{ active: boolean; band: RegionKey }>

// lazy() → per-level code-split chunks (loaded on first approach, disposed on exit)
const SCENERY: Record<RegionKey, RegionComponent> = {
  berkeley: lazy(() => import('./scenery/BerkeleyRegion')),
  tokyo: lazy(() => import('./scenery/TokyoRegion')),
  sf: lazy(() => import('./scenery/SFRegion')),
  mojave: lazy(() => import('./scenery/DesertRegion')),
  tuner: lazy(() => import('./scenery/TunerRegion')),
  ambra: lazy(() => import('./scenery/AmbraRegion')),
}

/** active band ±1, wrapping first↔last so the loop stays seamless. */
function isNear(i: number, active: number): boolean {
  const d = Math.abs(i - active)
  return d <= 1 || d === LEVEL_COUNT - 1
}

export default function LevelManager({ activeIndex }: { activeIndex: number }) {
  const active = Math.min(Math.max(activeIndex, 0), LEVEL_COUNT - 1)
  return (
    <>
      {LEVELS.map((level, i) => {
        if (!isNear(i, active)) return null
        const Region = SCENERY[level.key]
        return (
          <Suspense key={level.key} fallback={null}>
            <Region active band={level.key} />
          </Suspense>
        )
      })}
    </>
  )
}

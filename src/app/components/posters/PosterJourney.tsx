'use client'

import PosterStop from './PosterStop'
import { POSTERS } from './posterRoute'

/**
 * The Poster Drive. Gate build: renders the stops in sequence (only the JDM
 * gate poster exists yet). Scroll spine + seam beats wire in after the gate
 * vote — plain flow keeps the gate demo honest.
 */
export default function PosterJourney() {
  return (
    <div>
      {POSTERS.map((p) => (
        <PosterStop key={p.key} data={p} />
      ))}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import PosterStop from './PosterStop'
import { POSTERS } from './posterRoute'

/**
 * The Poster Drive: all 7 stops in journey order, plain scroll flow.
 * Each poster's own entrance timeline gives it its arrival moment.
 * A slim fixed rail on the right edge tracks progress: 7 paper dots on a
 * hairline, click to drive straight to a stop.
 */
export default function PosterJourney() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const sections = POSTERS
      .map((p) => document.getElementById(`poster-${p.key}`))
      .filter((el): el is HTMLElement => el !== null)
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const i = sections.indexOf(entry.target as HTMLElement)
          if (i >= 0) setActive(i)
        }
      },
      { threshold: 0.5 }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  const goTo = (key: string) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(`poster-${key}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div>
      {POSTERS.map((p) => (
        <PosterStop key={p.key} data={p} />
      ))}

      <nav
        aria-label="Poster journey progress"
        className="pointer-events-auto fixed right-3 top-1/2 z-50 -translate-y-1/2"
      >
        <div className="relative flex flex-col items-center gap-3 py-2">
          {/* hairline spine behind the dots */}
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/25" aria-hidden="true" />
          {POSTERS.map((p, i) => (
            <button
              key={p.key}
              type="button"
              onClick={() => goTo(p.key)}
              aria-label={`Go to stop ${i + 1}: ${p.masthead}`}
              aria-current={i === active ? 'true' : undefined}
              className="relative h-2.5 w-2.5 rounded-full border transition-transform duration-300"
              style={{
                borderColor: '#f0e6d2',
                background: i === active ? '#f0e6d2' : 'rgba(240,230,210,0.15)',
                transform: i === active ? 'scale(1.35)' : 'scale(1)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
              }}
            />
          ))}
        </div>
      </nav>
    </div>
  )
}

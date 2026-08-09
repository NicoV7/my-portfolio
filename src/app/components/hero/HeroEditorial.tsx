'use client'

import { Cormorant_Garamond } from 'next/font/google'
import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import CanvasFrame from './CanvasFrame'
import MilestoneOverlay from './MilestoneOverlay'
import DriveTransition from './DriveTransition'
import StillStage from './StillStage'
import TextScramble from '../motion/TextScramble'
import { useDriveProgress } from '../../../hooks/useDriveProgress'
import { SCENES } from './heroScenes'
import { milestones } from '../../../data/milestones'
import { profile } from '../../../data/profile'

/* Renaissance display serif with true italics; exposed as --font-display so
   MilestoneOverlay + the headline can opt in without a global font swap. */
const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const STOP_COUNT = SCENES.length

/**
 * Full-editorial stills hero: same 800vh scroll shell + sticky viewport as the
 * old HeroDrive, but the picture plane is 6 art-directed composition plates
 * (StillStage) instead of a WebGL scene — no loader/support probe needed,
 * images always work.
 */
export default function HeroEditorial() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { progressRef, activeIndex } = useDriveProgress(wrapRef, STOP_COUNT)

  // Accessible static fallback for reduced motion
  if (reduced) {
    return <StaticHero />
  }

  return (
    <section ref={wrapRef} className={`relative ${displayFont.variable}`} style={{ height: '800vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <StillStage progressRef={progressRef} />

        {/* Editorial canvas frame + golden-ratio construction lines (z-10) */}
        <CanvasFrame />

        {/* Persona 5-style graphic seam beat (slash panels + zoom + location card) */}
        <DriveTransition progressRef={progressRef} />

        {/* Intro headline over the scene */}
        <div className="pointer-events-none absolute inset-x-0 top-24 z-20 px-6">
          <div className="mx-auto max-w-[var(--content)]">
            <TextScramble text="THE DRIVE SO FAR" className="eyebrow" />
            <h1 className="mt-3 max-w-xl text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.02] text-white-soft [font-family:var(--font-display,var(--font-serif))]">
              {profile.name}
            </h1>
            <p className="mt-2 font-mono text-sm tracking-[0.15em] text-accent">
              {profile.title.toUpperCase()} · {profile.tagline.toUpperCase()}
            </p>
          </div>
        </div>

        <MilestoneOverlay activeIndex={activeIndex} />
      </div>
    </section>
  )
}

/** Accessible static hero for reduced motion. */
function StaticHero() {
  return (
    <section
      className={`relative flex min-h-screen flex-col justify-center px-6 py-32 ${displayFont.variable}`}
    >
      <div className="mx-auto w-full max-w-[var(--content)]">
        <p className="eyebrow">THE DRIVE SO FAR</p>
        <h1 className="mt-4 text-[clamp(3rem,8vw,6rem)] font-medium leading-[1.02] text-white-soft [font-family:var(--font-display,var(--font-serif))]">
          {profile.name}
        </h1>
        <p className="mt-3 font-mono text-sm tracking-[0.15em] text-accent">
          {profile.title.toUpperCase()} · {profile.tagline.toUpperCase()}
        </p>
        <ol className="mt-14 space-y-6 border-l border-chrome-line pl-6">
          {milestones.map((m) => (
            <li key={m.id}>
              <div className="flex items-baseline gap-3">
                <span className="eyebrow">{m.label}</span>
                <span className="font-mono text-xs text-silver">{m.year}</span>
              </div>
              <p className="mt-1 font-serif text-xl text-platinum">
                {m.company} — {m.role}
              </p>
              <p className="mt-1 text-sm text-silver">{m.impact}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

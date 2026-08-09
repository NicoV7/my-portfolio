'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import HeroLoader from './HeroLoader'
import MilestoneOverlay from './MilestoneOverlay'
import DriveTransition from './DriveTransition'
import DriveControls from './DriveControls'
import TextScramble from '../motion/TextScramble'
import { useDriveProgress } from '../../../hooks/useDriveProgress'
import { useEngineAudio } from '../../../hooks/useEngineAudio'
import { makeCarState } from './carState'
import { STOP_COUNT, BORDERS } from './curve'
import { milestones } from '../../../data/milestones'
import { profile } from '../../../data/profile'

const DriveScene = dynamic(() => import('./DriveSceneClient'), {
  ssr: false,
  loading: () => <HeroLoader />,
})

export default function HeroDrive() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [supported, setSupported] = useState<boolean | null>(null)
  const [mobile, setMobile] = useState(false)
  const { progressRef, speedRef, slipRef, dirRef, activeIndex, playing, goTo, next, prev, togglePlay } =
    useDriveProgress(wrapRef, STOP_COUNT)
  const carStateRef = useRef(makeCarState())
  const timeLapseRef = useRef(0)
  const { soundOn, toggle: toggleSound } = useEngineAudio(speedRef, slipRef, dirRef, !reduced)

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      setSupported(!!(c.getContext('webgl2') || c.getContext('webgl')))
    } catch {
      setSupported(false)
    }
    setMobile(window.matchMedia('(max-width: 768px)').matches)
  }, [])

  // Time-lapse / warp cue near each region seam (drives the sun sweep in
  // BiomeDriver and the camera FOV-punch in Rig; the DriveTransition overlay
  // owns the visuals). Window matches DriveTransition's W so they stay in sync.
  useEffect(() => {
    let raf = 0
    const W = 0.07 // keep in sync with DriveTransition's W (the seam window)
    const tick = () => {
      const p = progressRef.current
      let d = 1
      for (const b of BORDERS) d = Math.min(d, Math.abs(p - b))
      timeLapseRef.current = Math.max(0, 1 - d / W)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progressRef])

  // R3F sometimes misses its initial container measurement (the canvas sticks at
  // the default 300×150 → a black scene), and the scene is a dynamic import so the
  // canvas mounts after this runs. Poll a resize nudge until the canvas measures up.
  useEffect(() => {
    if (!supported) return
    let n = 0
    const id = window.setInterval(() => {
      window.dispatchEvent(new Event('resize'))
      const c = document.querySelector('canvas')
      if ((c && c.width > 300) || ++n > 24) window.clearInterval(id)
    }, 150)
    return () => window.clearInterval(id)
  }, [supported])

  // Static, accessible fallback (no WebGL or reduced motion)
  if (supported === false || reduced) {
    return <StaticHero />
  }

  return (
    <section ref={wrapRef} className="relative" style={{ height: '800vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {supported === null ? (
          <HeroLoader />
        ) : (
          <DriveScene
            progressRef={progressRef}
            speedRef={speedRef}
            slipRef={slipRef}
            carStateRef={carStateRef}
            timeLapseRef={timeLapseRef}
            activeIndex={activeIndex}
            mobile={mobile}
          />
        )}

        {/* Persona 5-style graphic seam beat (slash panels + zoom + location card) */}
        <DriveTransition progressRef={progressRef} />

        {/* Intro headline over the white scene — dark ink so it reads on the canvas */}
        <div className="pointer-events-none absolute inset-x-0 top-24 z-20 px-6">
          <div className="mx-auto max-w-[var(--content)]">
            <TextScramble text="THE DRIVE SO FAR" className="font-mono text-xs tracking-[0.3em] text-[#6a6660]" />
            <h1 className="mt-3 max-w-xl font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] text-[#141318]">
              {profile.name}
            </h1>
            <p className="mt-2 font-mono text-sm tracking-[0.15em] text-[#8a5a2b]">
              {profile.title.toUpperCase()} · {profile.tagline.toUpperCase()}
            </p>
          </div>
        </div>

        <MilestoneOverlay activeIndex={activeIndex} />
        <DriveControls
          activeIndex={activeIndex}
          playing={playing}
          soundOn={soundOn}
          onPrev={prev}
          onNext={next}
          onGoTo={goTo}
          onTogglePlay={togglePlay}
          onToggleSound={toggleSound}
        />
      </div>
    </section>
  )
}

/** Accessible static hero for reduced-motion / no-WebGL. */
function StaticHero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center px-6 py-32">
      <div className="mx-auto w-full max-w-[var(--content)]">
        <p className="eyebrow">THE DRIVE SO FAR</p>
        <h1 className="mt-4 font-serif text-[clamp(3rem,8vw,6rem)] leading-[1.02] text-white-soft">
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

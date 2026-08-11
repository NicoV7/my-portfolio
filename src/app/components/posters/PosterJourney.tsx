'use client'

import { useCallback, useEffect, useState } from 'react'
import { GithubLogo, LinkedinLogo, EnvelopeSimple, FileArrowDown } from '@phosphor-icons/react'
import RouteMap from './RouteMap'
import AllSideProjects from './AllSideProjects'
import { POSTERS } from './posterRoute'

/**
 * The atlas page: a fixed identity masthead (this page's top bar in place of the
 * dark site nav) over the Route Map, plus a slim restyled progress rail. The map
 * itself owns the trail, nodes, framed prints, and the driving car badge.
 */

const CONTACTS = [
  { label: 'GitHub', hint: 'github.com/NicoV7', href: 'https://github.com/NicoV7', Icon: GithubLogo, external: true },
  { label: 'LinkedIn', hint: 'linkedin.com/in/nvegab99', href: 'https://linkedin.com/in/nvegab99', Icon: LinkedinLogo, external: true },
  { label: 'Email', hint: 'nvegab99@gmail.com', href: 'mailto:nvegab99@gmail.com', Icon: EnvelopeSimple, external: false },
  { label: 'Resume (PDF)', hint: 'Download resume.pdf', href: '/resume.pdf', Icon: FileArrowDown, external: false, download: true },
]

const CANVAS_INK = '#1d1611'

export default function PosterJourney() {
  const [active, setActive] = useState(0)
  const [showAll, setShowAll] = useState(false)
  // stable so the memo'd DriveFinale doesn't re-render (which would clobber its JS-owned opacity)
  const openAll = useCallback(() => setShowAll(true), [])
  const closeAll = useCallback(() => setShowAll(false), [])

  useEffect(() => {
    const sections = POSTERS.map((p) => document.getElementById(`frame-${p.key}`)).filter(
      (el): el is HTMLElement => el !== null
    )
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
    document
      .getElementById(`frame-${key}`)
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
  }

  return (
    <div className="relative">
      {/* fixed identity masthead: this page's top bar (dark site nav suppressed on '/') */}
      <header
        className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-sm"
        style={{ background: 'rgba(250,250,247,0.85)', borderColor: 'rgba(29,22,17,0.12)' }}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-xl tracking-tight md:text-2xl" style={{ color: CANVAS_INK }}>
              Nico Vega
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] opacity-60 sm:inline" style={{ color: CANVAS_INK }}>
              Full Stack Engineer and Applied AI
            </span>
          </div>
          <nav className="flex items-center gap-1" aria-label="Contact">
            {CONTACTS.map(({ label, hint, href, Icon, external, download }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={hint}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                download={download}
                className="rounded-full p-2 outline-offset-2 transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2"
                style={{ color: CANVAS_INK, outlineColor: CANVAS_INK }}
              >
                <Icon size={20} weight="regular" />
              </a>
            ))}
          </nav>
        </div>
      </header>

      <RouteMap onShowAll={openAll} blurred={showAll} />
      <AllSideProjects open={showAll} onClose={closeAll} />

      {/* slim progress rail: deep-scroll jump nav, restyled for the white canvas */}
      <nav
        aria-label="Route progress"
        className="pointer-events-auto fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 md:block"
      >
        <div className="relative flex flex-col items-center gap-3 py-2">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2" style={{ background: 'rgba(29,22,17,0.25)' }} aria-hidden="true" />
          {POSTERS.map((p, i) => (
            <button
              key={p.key}
              type="button"
              onClick={() => goTo(p.key)}
              aria-label={`Go to stop ${i + 1}: ${p.masthead}`}
              aria-current={i === active ? 'true' : undefined}
              className="relative h-2.5 w-2.5 rounded-full border transition-transform duration-300"
              style={{
                borderColor: CANVAS_INK,
                background: i === active ? p.theme.accent : 'transparent',
                transform: i === active ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </nav>
    </div>
  )
}

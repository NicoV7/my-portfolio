'use client'

import { memo, useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * The finale menu (id="finale-menu"). NO 3D canvas + NO background — the pale 3D
 * world (AtlasWorld3D, z-0) is the ground and the C63 orbits at viewport centre.
 * A transparent menu WRAPPING that car: floating ink text of the NOTABLE projects,
 * plus a SHOW ALL button that opens the full-list overlay. Opacity/visibility are
 * driven imperatively by RouteMap's finale scrub (a React re-render can't clobber
 * it); reduced motion has no scrub, so the initial style shows it statically.
 */

const INK = '#0b0b0f'

type FinaleProject = { title: string; subtitle: string; href: string }

// notable work, not the side-projects list (that lives in the SHOW ALL overlay)
const NOTABLE: FinaleProject[] = [
  { title: 'Yojimbo', subtitle: 'Autonomous investing', href: 'https://yojimbo.site' },
  { title: 'Personal Harness', subtitle: 'AI coding harness', href: 'https://github.com/NicoV7/Personal-Harness' },
  { title: 'Debate RPG', subtitle: 'Berkeley AI Hackathon', href: 'https://github.com/NicoV7/BerkeleyAIHackathon2026' },
  { title: 'Parlor', subtitle: 'Reddit Games Hackathon', href: 'https://github.com/NicoV7/RedditHackathon' },
  { title: 'LearnGraph', subtitle: '2nd Place, GStack x Gbrain Hackathon (YCombinator)', href: 'https://github.com/NicoV7/GStackHack' },
]

function ProjectLink({ p, align }: { p: FinaleProject; align: 'left' | 'right' }) {
  const right = align === 'right'
  return (
    <Link
      href={p.href}
      target="_blank"
      rel="noreferrer"
      className={`pointer-events-auto group flex flex-col transition-opacity hover:opacity-60 ${right ? 'items-end text-right' : 'items-start text-left'}`}
      style={{ color: INK }}
    >
      <span className={`inline-flex items-baseline gap-2 font-sans text-lg font-black uppercase leading-tight tracking-tight md:text-2xl lg:text-3xl ${right ? 'flex-row-reverse' : ''}`}>
        {p.title}
        <span aria-hidden="true" className="text-base opacity-40 transition-opacity group-hover:opacity-90">-&gt;</span>
      </span>
      <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] opacity-55 md:text-xs">{p.subtitle}</span>
    </Link>
  )
}

function DriveFinale({ onShowAll }: { onShowAll: () => void }) {
  const left = NOTABLE.slice(0, 3)
  const right = NOTABLE.slice(3)
  // reduced-motion has no scrub to drive the fade, so show the menu statically
  const [reduce, setReduce] = useState(false)
  useEffect(() => setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])

  return (
    <div
      id="finale-menu"
      className="pointer-events-none fixed inset-0 z-40"
      style={{ color: INK, opacity: reduce ? 1 : 0, visibility: reduce ? 'visible' : 'hidden' }}
    >
      <div className="absolute inset-x-0 top-[9%] text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] opacity-55">The Garage</p>
        <p className="mt-2 font-sans text-2xl font-black uppercase tracking-tight md:text-3xl">Notable Builds</p>
      </div>

      <div className="absolute left-[5vw] top-1/2 flex max-w-[38vw] -translate-y-1/2 flex-col gap-5 md:left-[6vw] md:max-w-[26vw]">
        {left.map((p) => (
          <ProjectLink key={p.title} p={p} align="left" />
        ))}
      </div>

      <div className="absolute right-[5vw] top-1/2 flex max-w-[38vw] -translate-y-1/2 flex-col items-end gap-5 md:right-[6vw] md:max-w-[26vw]">
        {right.map((p) => (
          <ProjectLink key={p.title} p={p} align="right" />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-[7%] flex justify-center">
        <button
          type="button"
          onClick={onShowAll}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white outline-offset-2 transition-transform hover:-translate-y-px focus-visible:outline focus-visible:outline-2"
          style={{ background: INK, outlineColor: INK }}
        >
          Show all projects <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  )
}

export default memo(DriveFinale)

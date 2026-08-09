'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { projects } from '../../../data/projects'

/**
 * The finale DOM overlay. It carries NO 3D canvas — the C63 that drives the
 * trail is the same element that zooms into this center gap (RouteMap animates
 * that shared wrapper on top of this overlay). Here we lay the pale Noomo
 * ground, the ghost headline, the notable-project links flanking the car, and
 * the link that scrolls to the in-page all-side-projects list.
 */

const GROUND = 'linear-gradient(160deg, #e4e8f5 0%, #d3daee 45%, #c6cfe8 100%)'
const INK = '#0b0b0f'

const FEATURED_SLUGS = [
  'smartcache',
  'shaders-project',
  'secure-file-sharing',
  'collaborative-drawing-board',
  'task-management-app',
]

type FinaleProject = { title: string; href: string; external: boolean }

function useFeatured(): FinaleProject[] {
  return useMemo(
    () =>
      FEATURED_SLUGS.map((slug) => {
        const p = projects.find((x) => x.slug === slug)
        const href = p?.links?.[0]?.url ?? '/projects'
        return { title: p?.title ?? slug, href, external: href.startsWith('http') }
      }),
    []
  )
}

function ProjectLink({ p, align }: { p: FinaleProject; align: 'left' | 'right' }) {
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <Link
        href={p.href}
        target={p.external ? '_blank' : undefined}
        rel={p.external ? 'noreferrer' : undefined}
        className="group inline-flex items-baseline gap-2 font-sans text-xl font-black uppercase leading-tight tracking-tight transition-opacity hover:opacity-60 md:text-2xl lg:text-3xl"
        style={{ color: INK }}
      >
        {p.title}
        <span aria-hidden="true" className="text-base opacity-40 transition-opacity group-hover:opacity-90">-&gt;</span>
      </Link>
    </div>
  )
}

export default function DriveFinale({ active }: { active: boolean }) {
  const featured = useFeatured()
  const left = featured.slice(0, 3)
  const right = featured.slice(3)

  return (
    <div className="absolute inset-0" style={{ background: GROUND, color: INK }}>
      {/* huge ghost headline the car sits in front of (Noomo) */}
      <h2
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[14%] text-center font-sans font-black uppercase leading-none tracking-tighter"
        style={{ fontSize: 'clamp(3rem, 15vw, 14rem)', color: INK, opacity: 0.06 }}
      >
        Side Projects
      </h2>

      {/* soft dark spotlight so the white C63 (floated on top from its shared
          wrapper) reads against the pale ground */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{ background: 'radial-gradient(circle, rgba(18,22,48,0.5) 0%, rgba(28,34,68,0.18) 40%, transparent 66%)' }}
      />

      <div
        className={`absolute inset-0 flex flex-col items-center px-6 pt-24 pb-16 transition-opacity duration-700 md:pt-28 ${
          active ? 'opacity-100' : 'opacity-0'
        } motion-reduce:opacity-100`}
      >
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] opacity-55">The Garage</p>
          <p className="mt-2 font-sans text-2xl font-black uppercase tracking-tight md:text-3xl">Selected Builds</p>
        </div>

        {/* left links | car gap | right links */}
        <div className="mt-6 grid w-full max-w-[1240px] flex-1 grid-cols-1 items-center gap-6 md:grid-cols-[1fr_minmax(440px,560px)_1fr]">
          <div className="order-2 flex flex-col gap-4 md:order-1 md:items-start">
            {left.map((p) => (
              <ProjectLink key={p.title} p={p} align="left" />
            ))}
          </div>
          <div className="order-1 md:order-2" aria-hidden="true" />
          <div className="order-3 flex flex-col gap-4 md:items-end">
            {right.map((p) => (
              <ProjectLink key={p.title} p={p} align="right" />
            ))}
          </div>
        </div>

        <a
          href="#all-side-projects"
          className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white outline-offset-2 transition-transform hover:-translate-y-px focus-visible:outline focus-visible:outline-2"
          style={{ background: INK, outlineColor: INK }}
        >
          View all side projects <span aria-hidden="true">v</span>
        </a>
      </div>
    </div>
  )
}

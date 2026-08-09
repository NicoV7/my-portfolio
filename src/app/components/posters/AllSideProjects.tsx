'use client'

import Link from 'next/link'
import { projects } from '../../../data/projects'

/**
 * The in-page "all side projects" list the finale scrolls to (id target).
 * Noomo black-on-pale: every side build as a full-width row link. Career-stop
 * companies (Wogo, YNLD) live on the trail, so they are excluded here.
 */

const GROUND = 'linear-gradient(180deg, #c6cfe8 0%, #d7ddee 30%, #e7eaf4 100%)'
const INK = '#0b0b0f'
const EXCLUDE = new Set(['wogo-social-platform', 'ynld-trust-youtube-summarizer'])

export default function AllSideProjects() {
  const list = projects.filter((p) => !EXCLUDE.has(p.slug))

  return (
    <section
      id="all-side-projects"
      aria-label="All side projects"
      className="relative px-6 py-24 md:py-32"
      style={{ background: GROUND, color: INK }}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-sans text-4xl font-black uppercase tracking-tight md:text-6xl">All Side Projects</h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-55">{list.length} builds</p>
        </div>

        <ul className="border-t" style={{ borderColor: 'rgba(11,11,15,0.14)' }}>
          {list.map((p) => {
            const href = p.links?.[0]?.url ?? '/projects'
            const external = href.startsWith('http')
            return (
              <li key={p.slug} className="border-b" style={{ borderColor: 'rgba(11,11,15,0.14)' }}>
                <Link
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  className="group flex flex-col gap-1 py-6 outline-offset-2 transition-colors focus-visible:outline focus-visible:outline-2 md:flex-row md:items-baseline md:justify-between md:gap-8"
                  style={{ outlineColor: INK }}
                >
                  <span className="font-sans text-2xl font-black uppercase leading-tight tracking-tight transition-opacity group-hover:opacity-60 md:text-4xl">
                    {p.title}
                  </span>
                  <span className="max-w-[46ch] font-mono text-xs leading-snug opacity-60 md:text-right">
                    {p.shortDescription}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

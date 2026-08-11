'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { projects } from '../../../data/projects'

/**
 * The full project list, shown ONLY as an overlay when the finale's SHOW ALL button
 * is hit (open). It renders OVER the car (which RouteMap blurs+fades behind it) so
 * the text reads clearly. Esc / scrim-click / Close dismiss. Wogo/YNLD are career
 * stops on the trail, excluded here.
 */

const INK = '#0b0b0f'
const HAIR = 'rgba(11,11,15,0.14)'
const EXCLUDE = new Set(['wogo-social-platform', 'ynld-trust-youtube-summarizer'])

export default function AllSideProjects({ open, onClose }: { open: boolean; onClose: () => void }) {
  const list = projects.filter((p) => !EXCLUDE.has(p.slug))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      id="all-side-projects"
      role="dialog"
      aria-modal="true"
      aria-label="All projects"
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      style={{ color: INK }}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(248,248,245,0.72)' }} onClick={onClose} aria-hidden="true" />

      <div className="relative mx-auto flex h-full w-full max-w-[1100px] flex-col px-6 py-10 md:py-14">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-3xl font-black uppercase tracking-tight md:text-5xl">All Projects</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:bg-black/5"
            style={{ borderColor: 'rgba(11,11,15,0.3)' }}
          >
            Close ×
          </button>
        </div>

        <ul className="mt-8 flex-1 overflow-y-auto border-t" style={{ borderColor: HAIR }}>
          {list.map((p) => {
            const href = p.links?.[0]?.url ?? '/projects'
            const external = href.startsWith('http')
            return (
              <li key={p.slug} className="border-b" style={{ borderColor: HAIR }}>
                <Link
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                  className="group flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:justify-between md:gap-8"
                >
                  <span className="font-sans text-2xl font-black uppercase leading-tight tracking-tight transition-opacity group-hover:opacity-60 md:text-4xl">
                    {p.title}
                  </span>
                  <span className="max-w-[46ch] font-mono text-xs leading-snug opacity-60 md:text-right">{p.shortDescription}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

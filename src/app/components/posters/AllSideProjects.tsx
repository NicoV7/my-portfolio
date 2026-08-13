'use client'

import { useEffect, useRef, useState } from 'react'
import { ALL_PROJECTS } from '../../../data/sideProjects'

/**
 * The full "All Projects" index, opened as an overlay from the finale's SHOW ALL
 * button (`open`). A near-white panel DROPS from the top over the car (RouteMap
 * still blurs the car behind it). Master-detail: the list holds every project;
 * clicking one collapses the list to a narrow left column and expands the
 * selected into a detail pane on the right (blurb, stack, link). Esc collapses
 * detail, then closes; Close × / scrim also close.
 */

const INK = '#0b0b0f'
const PAPER = '#f8f8f5'
const HAIR = 'rgba(11,11,15,0.12)'
const MUT = 'rgba(11,11,15,0.55)'
const ACCENT = '#c8352a'

export default function AllSideProjects({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sel, setSel] = useState<number | null>(null)
  const [reduce, setReduce] = useState(false)
  const selRef = useRef<number | null>(null)
  selRef.current = sel

  useEffect(() => setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])
  useEffect(() => {
    if (!open) setSel(null)
  }, [open])

  useEffect(() => {
    if (!open) return
    // Esc ladder: collapse an open detail first, otherwise close the overlay
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (selRef.current !== null) setSel(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const focused = sel !== null
  const active = sel !== null ? ALL_PROJECTS[sel] : null
  const ctaLabel = active?.href?.includes('github') ? 'Open repo' : 'Visit'

  return (
    <div
      id="all-side-projects"
      role="dialog"
      aria-modal="true"
      aria-label="All projects"
      className={`fixed inset-0 z-[60] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <div
        className="absolute inset-0 flex flex-col px-6 py-8 md:px-14 md:py-12"
        style={{
          background: PAPER,
          color: INK,
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          transition: reduce ? 'none' : 'transform .8s cubic-bezier(.16,1,.3,1)',
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: MUT }}>
              Index · {ALL_PROJECTS.length} builds
            </div>
            <h2 className="mt-2 font-sans text-3xl font-black uppercase leading-none tracking-tight md:text-5xl">
              All Projects
            </h2>
          </div>
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

        <div
          className="mt-6 grid min-h-0 flex-1 md:mt-9"
          style={{
            gridTemplateColumns: focused ? 'minmax(240px, 0.4fr) 0.6fr' : '1fr',
            columnGap: focused ? 'clamp(20px,3vw,48px)' : '0px',
            transition: reduce ? 'none' : 'grid-template-columns .5s cubic-bezier(.16,1,.3,1), column-gap .5s',
          }}
        >
          {/* list column */}
          <div className="overflow-auto border-t" style={{ borderColor: HAIR }}>
            {ALL_PROJECTS.map((p, i) => {
              const dim = focused && sel !== i
              const on = sel === i
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSel(on ? null : i)}
                  className="group flex w-full items-baseline gap-4 border-b py-4 text-left md:py-5"
                  style={{
                    borderColor: HAIR,
                    opacity: open ? (dim ? 0.4 : 1) : 0,
                    transform: open ? 'none' : 'translateY(14px)',
                    transition: reduce
                      ? 'none'
                      : `opacity .5s ${0.24 + i * 0.04}s, transform .5s ${0.24 + i * 0.04}s`,
                  }}
                >
                  <span className="w-9 flex-none font-mono text-xs" style={{ color: ACCENT }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`flex-1 font-sans font-black uppercase leading-tight tracking-tight transition-[font-size,color] group-hover:opacity-60 ${
                      focused ? 'text-base md:text-xl' : 'text-2xl md:text-4xl'
                    }`}
                    style={{ color: on ? ACCENT : INK }}
                  >
                    {p.title}
                  </span>
                  {!focused && (
                    <span
                      className="hidden max-w-[26ch] text-right font-mono text-[11px] uppercase tracking-[0.14em] md:block"
                      style={{ color: MUT }}
                    >
                      {p.stack.join(' · ')}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* detail column */}
          <div
            className="min-w-0 overflow-auto"
            aria-hidden={!focused}
            style={{
              opacity: focused ? 1 : 0,
              transform: focused ? 'none' : 'translateX(24px)',
              transition: reduce ? 'none' : 'opacity .5s .1s, transform .5s .1s',
            }}
          >
            {active && (
              <>
                <button
                  type="button"
                  onClick={() => setSel(null)}
                  className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
                  style={{ color: MUT }}
                >
                  ← All projects
                </button>
                <div className="font-mono text-xs uppercase tracking-[0.24em]" style={{ color: ACCENT }}>
                  {String((sel ?? 0) + 1).padStart(2, '0')} / {String(ALL_PROJECTS.length).padStart(2, '0')}
                </div>
                <h3 className="mb-4 mt-2 font-sans text-4xl font-black uppercase leading-[0.92] tracking-tight md:text-6xl">
                  {active.title}
                </h3>
                <p className="max-w-[46ch] text-base leading-relaxed md:text-lg" style={{ color: 'rgba(11,11,15,0.78)' }}>
                  {active.blurb}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {active.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em]"
                      style={{ borderColor: HAIR, color: MUT }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {active.href && (
                  <a
                    href={active.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-white transition-transform hover:-translate-y-px"
                    style={{ background: INK }}
                  >
                    {ctaLabel} <span aria-hidden="true">→</span>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { milestones } from '../../../data/milestones'

/** DOM (framer-motion) milestone card that swaps as the car arrives at each stop. */
export default function MilestoneOverlay({ activeIndex }: { activeIndex: number }) {
  const m = milestones[Math.min(milestones.length - 1, Math.max(0, activeIndex))]

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 px-6 md:bottom-16">
      <div className="mx-auto max-w-[var(--content)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="max-w-md rounded-[var(--radius-card)] border border-chrome-line bg-graphite/70 p-6 backdrop-blur-xl"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="font-mono text-xs tracking-[0.2em] text-accent">
                {String(m.order + 1).padStart(2, '0')}
              </span>
              <span className="eyebrow">{m.label}</span>
              <span className="ml-auto font-mono text-xs text-silver">{m.year}</span>
            </div>
            <h3 className="font-serif text-2xl text-white-soft">{m.company}</h3>
            <p className="mt-1 text-sm text-accent">{m.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-silver">{m.impact}</p>
            {m.metrics && (
              <div className="mt-4 flex flex-wrap gap-2">
                {m.metrics.map((met) => (
                  <span
                    key={met.label}
                    className="rounded-[var(--radius-pill)] border border-chrome-line px-3 py-1 font-mono text-xs text-platinum"
                  >
                    <span className="text-white-soft">{met.value}</span>{' '}
                    <span className="text-silver">{met.label}</span>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { milestones } from '../../../data/milestones'

/** DOM (framer-motion) milestone card that swaps as the car arrives at each stop.
 *  Styled as a museum catalog placard: warm-umber backdrop, bone hairline,
 *  plate number, display-serif title with an italic swash initial. */
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
            className="max-w-md border border-[#efe8d848] bg-[#16110bb3] p-7 backdrop-blur-xl md:p-8"
            style={{ boxShadow: '0 24px 60px -24px rgba(0,0,0,0.85)' }}
          >
            <div className="mb-3 flex items-baseline gap-3">
              <span className="font-mono text-[0.7rem] tracking-[0.25em] text-accent">
                No. {String(m.order + 1).padStart(2, '0')}
              </span>
              <span className="eyebrow">{m.label}</span>
              <span className="ml-auto font-mono text-xs text-silver">{m.year}</span>
            </div>
            <h3 className="text-[2rem] leading-tight text-white-soft [font-family:var(--font-display,var(--font-serif))]">
              {/* Italic swash initial — the "Ren-ai-ssance" gesture */}
              <span className="italic">{m.company.charAt(0)}</span>
              {m.company.slice(1)}
            </h3>
            <p className="mt-1 text-[0.95rem] italic text-silver [font-family:var(--font-display,var(--font-serif))]">
              {m.role}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-silver">{m.impact}</p>
            {m.metrics && (
              <div className="mt-5 flex flex-wrap gap-2">
                {m.metrics.map((met) => (
                  <span
                    key={met.label}
                    className="border border-[#efe8d833] px-3 py-1 font-mono text-xs text-platinum"
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

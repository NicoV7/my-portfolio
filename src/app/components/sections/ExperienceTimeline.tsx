'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Section from '../Section'
import { getExperience } from '../../../data/experience'

export default function ExperienceTimeline() {
  const reduced = useReducedMotion()
  const items = getExperience()

  return (
    <Section id="experience" eyebrow="02 — Experience" title={<span>Where I&apos;ve driven.</span>}>
      <div className="relative border-l border-chrome-line pl-8 md:pl-12">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
            className="relative pb-14 last:pb-0"
          >
            <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-void md:-left-[calc(3rem+5px)]" />
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-serif text-2xl text-white-soft">{item.company}</h3>
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
                {item.role}
              </span>
              <span className="ml-auto font-mono text-xs text-silver">{item.period}</span>
            </div>
            <p className="mt-2 max-w-[var(--prose)] text-silver">{item.summary}</p>

            {item.metrics && item.metrics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.metrics.map((m) => (
                  <span
                    key={m.label}
                    className="rounded-[var(--radius-pill)] border border-chrome-line px-3 py-1 font-mono text-xs"
                  >
                    <span className="text-white-soft">{m.value}</span>{' '}
                    <span className="text-silver">{m.label}</span>
                  </span>
                ))}
              </div>
            )}

            {item.tech && (
              <div className="mt-3 font-mono text-xs text-silver/70">
                {item.tech.join(' · ')}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

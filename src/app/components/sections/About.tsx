'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Section from '../Section'
import { profile } from '../../../data/profile'

export default function About() {
  const reduced = useReducedMotion()
  return (
    <Section id="about" eyebrow="01 — About" title={<span>The story behind the drive.</span>}>
      <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
        <div className="max-w-[var(--prose)] space-y-5">
          {profile.bio.map((p, i) => (
            <motion.p
              key={i}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-lg leading-relaxed text-silver"
            >
              {p}
            </motion.p>
          ))}
          <p className="pt-2 font-mono text-sm text-platinum">
            {profile.education[0].degree} · {profile.education[0].school}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {profile.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-[var(--radius-card)] border border-chrome-line bg-graphite/50 p-5"
            >
              <div className="chrome-text font-serif text-3xl">{s.value}</div>
              <div className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-silver">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

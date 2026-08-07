'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import Section from '../Section'
import { profile } from '../../../data/profile'
import { getProjectBySlug } from '../../../data/projects'

export default function SelectedWork() {
  const reduced = useReducedMotion()
  const projects = profile.featuredProjectSlugs
    .map((slug) => getProjectBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <Section id="work" eyebrow="03 — Selected Work" title={<span>Selected work.</span>}>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => {
          const live = p.links.find((l) => l.type === 'live' || l.type === 'demo')
          const gh = p.links.find((l) => l.type === 'github')
          return (
            <motion.article
              key={p.slug}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3) }}
              className="sheen group flex flex-col rounded-[var(--radius-card)] border border-chrome-line bg-graphite/50 p-7 transition-colors hover:border-accent/40"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="eyebrow">{p.category}</span>
                <span className="font-mono text-xs text-silver">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-white-soft">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-silver">
                {p.shortDescription}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.primaryTech.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="rounded-[var(--radius-pill)] border border-chrome-line px-2.5 py-1 font-mono text-[11px] text-silver"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex gap-5 font-mono text-xs uppercase tracking-[0.15em]">
                {live && (
                  <a href={live.url} target="_blank" rel="noreferrer" className="text-accent hover:text-accent-hot">
                    Live ↗
                  </a>
                )}
                {gh && (
                  <a href={gh.url} target="_blank" rel="noreferrer" className="text-silver hover:text-white-soft">
                    Code ↗
                  </a>
                )}
                <Link href={`/projects?project=${p.slug}`} className="ml-auto text-silver hover:text-white-soft">
                  Details →
                </Link>
              </div>
            </motion.article>
          )
        })}
      </div>

      {/* Highlights / wins */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {profile.highlights.map((h) => (
          <div
            key={h.title}
            className="rounded-[var(--radius-card)] border border-chrome-line/70 p-5"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-xs text-silver">{h.year}</span>
            </div>
            <p className="font-serif text-lg text-platinum">{h.title}</p>
            <p className="mt-1 text-sm text-silver">{h.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.18em] text-accent transition-colors hover:text-accent-hot"
        >
          View all work →
        </Link>
      </div>
    </Section>
  )
}

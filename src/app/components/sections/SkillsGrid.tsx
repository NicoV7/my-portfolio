'use client'

import Section from '../Section'
import { profile } from '../../../data/profile'

export default function SkillsGrid() {
  return (
    <Section id="skills" eyebrow="04 — Skills" title={<span>Under the hood.</span>}>
      <div className="grid gap-6 md:grid-cols-2">
        {profile.skillGroups.map((group) => (
          <div
            key={group.name}
            className="rounded-[var(--radius-card)] border border-chrome-line bg-graphite/40 p-6"
          >
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {group.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((s) => (
                <span
                  key={s}
                  className="sheen rounded-[var(--radius-pill)] border border-chrome-line px-3 py-1.5 text-sm text-platinum"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

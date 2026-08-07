'use client'

import Section from '../Section'
import MagneticButton from '../MagneticButton'
import { profile } from '../../../data/profile'

export default function Contact() {
  const email = profile.socials.find((s) => s.type === 'email')

  return (
    <Section id="contact" eyebrow="05 — Contact">
      <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-white-soft">
            Let&apos;s build something
            <br />
            worth the drive.
          </h2>
          <p className="mt-5 font-mono text-sm tracking-[0.12em] text-silver">
            {profile.title.toUpperCase()} @ AMBRA · {profile.location.toUpperCase()}
          </p>
        </div>

        {email && (
          <MagneticButton
            href={email.url}
            className="inline-flex items-center gap-3 rounded-[var(--radius-pill)] border border-accent/50 bg-accent/5 px-7 py-4 font-mono text-sm uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/15"
          >
            Get in touch ↗
          </MagneticButton>
        )}
      </div>

      <div className="mt-16 flex flex-wrap gap-x-10 gap-y-3 border-t border-chrome-line pt-8">
        {profile.socials.map((s) => (
          <a
            key={s.type}
            href={s.url}
            target={s.type === 'email' ? undefined : '_blank'}
            rel="noreferrer"
            className="group font-mono text-sm text-silver transition-colors hover:text-accent"
          >
            <span className="text-xs uppercase tracking-[0.15em] text-silver/60">
              {s.label}
            </span>{' '}
            <span className="ml-1 text-platinum group-hover:text-accent">
              {s.handle}
            </span>
          </a>
        ))}
      </div>
    </Section>
  )
}

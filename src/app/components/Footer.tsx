'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { profile } from '../../data/profile'

export default function Footer() {
  // the home route is the self-contained atlas (its finale is the terminal); no site footer
  if (usePathname() === '/') return null
  return (
    <footer className="relative z-10 border-t border-chrome-line">
      <div className="mx-auto grid max-w-[var(--content)] gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="font-mono text-sm tracking-[0.25em] text-platinum">
            NICO&nbsp;VEGA
          </p>
          <p className="mt-3 max-w-xs text-sm text-silver">
            {profile.title} · {profile.location}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="eyebrow mb-1">Navigate</span>
          {[
            { label: 'About', href: '/#about' },
            { label: 'Experience', href: '/#experience' },
            { label: 'Work', href: '/projects' },
            { label: 'Blog', href: '/blog' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="w-fit text-sm text-silver transition-colors hover:text-white-soft"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="eyebrow mb-1">Elsewhere</span>
          {profile.socials.map((s) => (
            <a
              key={s.type}
              href={s.url}
              target={s.type === 'email' ? undefined : '_blank'}
              rel="noreferrer"
              className="w-fit text-sm text-silver transition-colors hover:text-accent"
            >
              {s.label} — {s.handle}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[var(--content)] flex-col gap-2 border-t border-chrome-line/60 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <span className="font-mono text-xs tracking-[0.15em] text-silver/70">
          © {new Date().getFullYear()} · BUILT WITH NEXT.JS + THREE.JS
        </span>
        <span className="font-mono text-[10px] tracking-[0.1em] text-silver/50">
          3D C63 model by{' '}
          <a
            href="https://sketchfab.com/3d-models/2008-mercedes-benz-c63-amg-8f541d1d07b545799a20217c555a3948"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            Ddiaz Design
          </a>{' '}
          ·{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            CC BY-NC-SA
          </a>
        </span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-mono text-xs uppercase tracking-[0.18em] text-silver transition-colors hover:text-accent"
        >
          ↑ Back to top
        </button>
      </div>
    </footer>
  )
}

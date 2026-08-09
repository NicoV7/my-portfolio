'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

const LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Work', href: '/#work' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  // the atlas home page renders its own light identity masthead; the dark site
  // nav would collide with it (and its light links vanish on white paper)
  if (pathname === '/') return null

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-chrome-line bg-void/70 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[var(--content)] items-center justify-between px-6">
          <Link
            href="/"
            className="font-mono text-sm font-semibold tracking-[0.25em] text-platinum transition-colors hover:text-white-soft"
          >
            NICO&nbsp;VEGA
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-silver transition-colors hover:text-white-soft"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className="rounded-[var(--radius-pill)] border border-accent/40 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-all hover:bg-accent/10"
            >
              Contact
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="font-mono text-xs uppercase tracking-[0.18em] text-silver md:hidden"
            aria-label="Open menu"
          >
            Menu
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-void/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-6">
              <span className="font-mono text-sm tracking-[0.25em] text-platinum">
                NICO&nbsp;VEGA
              </span>
              <button
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-[0.18em] text-silver"
                aria-label="Close menu"
              >
                Close
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2 px-6">
              {[...LINKS, { label: 'Contact', href: '/#contact' }].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-serif text-4xl text-platinum"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import TextScramble from './motion/TextScramble'

interface SectionProps {
  id?: string
  eyebrow?: string
  title?: ReactNode
  children: ReactNode
  className?: string
}

/** Shared homepage section: eyebrow label, title, scroll-reveal, rhythm. */
export default function Section({
  id,
  eyebrow,
  title,
  children,
  className = '',
}: SectionProps) {
  const reduced = useReducedMotion()
  return (
    <section
      id={id}
      className={`relative z-10 mx-auto w-full max-w-[var(--content)] scroll-mt-24 px-6 py-[var(--space-section)] ${className}`}
    >
      {(eyebrow || title) && (
        <div className="mb-12 md:mb-16">
          {eyebrow && (
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" />
              <TextScramble text={eyebrow} className="eyebrow" />
            </div>
          )}
          {title && (
            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] text-white-soft"
            >
              {title}
            </motion.h2>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

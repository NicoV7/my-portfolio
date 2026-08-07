'use client'

import { createElement, useRef, type ElementType } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { useTextScramble } from '../../../hooks/useTextScramble'

interface TextScrambleProps {
  text: string
  as?: ElementType
  className?: string
  /** re-fire every time it enters view instead of once */
  repeat?: boolean
  speed?: number
}

/**
 * Signature decode motion. Renders the FINAL text to assistive tech
 * (aria-label) while the visible glyphs scramble in.
 */
export default function TextScramble({
  text,
  as = 'span',
  className,
  repeat = false,
  speed = 1,
}: TextScrambleProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: !repeat, margin: '-10% 0px' })
  const reduced = useReducedMotion() ?? false
  const output = useTextScramble(text, inView, { speed, reduced })

  return createElement(
    as,
    { ref, className, 'aria-label': text },
    <span aria-hidden="true">{output || (reduced ? text : ' ')}</span>
  )
}

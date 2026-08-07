'use client'

import { useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#'

/**
 * Resolves `text` from scrambled glyphs left-to-right once `active` becomes true.
 * The animation starts once and is only cancelled on unmount — a dependency
 * change must never cancel a run mid-flight (that froze it at partial glyphs).
 */
export function useTextScramble(
  text: string,
  active: boolean,
  { speed = 1, reduced = false }: { speed?: number; reduced?: boolean } = {}
): string {
  const [output, setOutput] = useState(reduced ? text : '')
  const started = useRef(false)
  const raf = useRef(0)

  useEffect(() => {
    if (reduced) {
      setOutput(text)
      return
    }
    if (!active || started.current) return
    started.current = true

    let frame = 0
    const chars = text.split('')
    const tick = () => {
      let done = 0
      const out = chars
        .map((ch, i) => {
          const start = i * 2
          const end = start + 12
          if (ch === ' ' || frame >= end) {
            done++
            return ch
          }
          if (frame < start) return ''
          return GLYPHS[(frame + i * 3) % GLYPHS.length]
        })
        .join('')
      setOutput(out)
      if (done >= chars.length) {
        setOutput(text)
        return
      }
      frame += speed
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }, [active, reduced, text, speed])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return output
}

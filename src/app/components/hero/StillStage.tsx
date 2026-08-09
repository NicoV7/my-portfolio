'use client'

import Image from 'next/image'
import { useEffect, useRef, type RefObject } from 'react'
import { SCENES, SCENE_COUNT } from './heroScenes'

// Seam crossfade half-window (scroll progress). Must match DriveTransition's W
// so the graphic beat and the image fade land on the same scroll span.
const W = 0.07

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const smoothstep = (x: number, a: number, b: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

/**
 * The editorial picture plane: all 6 stills stacked absolute, driven by a
 * single rAF that reads progressRef each frame and writes opacity/transform
 * straight to element style (no React state per frame — same pattern as
 * DriveTransition). Crossfades live only inside the seam windows; progress
 * within a scene's band scrubs its Ken Burns drift, so the motion is
 * deterministic and reversible under scroll.
 */
export default function StillStage({ progressRef }: { progressRef: RefObject<number> }) {
  const slides = useRef<(HTMLDivElement | null)[]>([])
  const movers = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const p = clamp(progressRef.current ?? 0, 0, 1)
      // fractional band position; band i spans [i/N, (i+1)/N)
      const active = clamp(Math.floor(p * SCENE_COUNT), 0, SCENE_COUNT - 1)

      for (let i = 0; i < SCENE_COUNT; i++) {
        const slide = slides.current[i]
        const mover = movers.current[i]
        if (!slide || !mover) continue

        // opacity: 1 inside own band, eased ramps across the entry/exit seams
        const entry = i === 0 ? 1 : smoothstep(p, i / SCENE_COUNT - W, i / SCENE_COUNT + W)
        const exit =
          i === SCENE_COUNT - 1
            ? 1
            : 1 - smoothstep(p, (i + 1) / SCENE_COUNT - W, (i + 1) / SCENE_COUNT + W)
        const o = entry * exit

        // paint-cost gate: only the active neighborhood stays visible
        const near = Math.abs(i - active) <= 1
        slide.style.visibility = near || o > 0.001 ? 'visible' : 'hidden'
        slide.style.opacity = o.toFixed(3)

        if (!near && o <= 0.001) continue

        // Ken Burns scrub: progress WITHIN band i drives scale + pan
        const t = clamp(p * SCENE_COUNT - i, 0, 1)
        const kb = SCENES[i].kenBurns
        const scale = kb.scaleFrom + (kb.scaleTo - kb.scaleFrom) * t
        mover.style.transform = `translate3d(${(kb.panX * t).toFixed(3)}%, ${(kb.panY * t).toFixed(3)}%, 0) scale(${scale.toFixed(4)})`
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progressRef])

  return (
    <div className="absolute inset-0 overflow-hidden bg-void">
      {SCENES.map((s, i) => (
        <div
          key={s.key}
          ref={(el) => {
            slides.current[i] = el
          }}
          className="absolute inset-0"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <div
            ref={(el) => {
              movers.current[i] = el
            }}
            className="absolute inset-0 will-change-transform"
            // scale zooms toward the plate's focal point, not dead center
            style={{ transformOrigin: s.focal, transform: `scale(${s.kenBurns.scaleFrom})` }}
          >
            {/* unoptimized: plates are pre-composed art exports swapped for
                webp repaints later — keep the src literal + avoid re-encoding */}
            <Image
              src={s.image}
              alt={s.alt}
              fill
              priority={i === 0}
              unoptimized
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: s.focal }}
            />
          </div>
        </div>
      ))}

      {/* bottom-third scrim so placard text always sits on dark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
        style={{
          background:
            'linear-gradient(to top, rgba(5,5,5,0.86) 0%, rgba(5,5,5,0.42) 52%, rgba(5,5,5,0) 100%)',
        }}
      />
    </div>
  )
}

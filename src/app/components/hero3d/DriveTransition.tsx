'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { BORDERS } from './curve'
import { LEVELS } from './levels'

/**
 * Region-seam overlay, styled as a *Persona 5* graphic beat: as the drive crosses
 * a border the screen slams into bold angular accent panels + halftone + motion
 * streaks, holds on a near-black accent field (which hides the region cull/swap),
 * then the panels slash off the other side to reveal the next region while its big
 * italic all-caps location title lingers.
 *
 * Purely a DOM overlay (animating postprocessing effect refs crashes R3F here),
 * driven by its own rAF. It reads a *time-damped* copy of `progressRef` so a fast
 * scroll flick can't snap the whole beat past in a couple of frames — that was the
 * "transitions are too fast" bug. Layers, back-to-front:
 *   field   — near-black accent wash, peaks at the swap to hide it
 *   panels  — three skewed accent/ink/light bands that slide through the seam
 *   tone    — halftone dot screen (P5 screentone)
 *   streaks — diagonal motion lines
 *   flash   — a soft accent pop at the peak
 *   card    — the incoming location's name + subtitle
 */
// half-window (scroll progress) around each seam. Must stay < half a level band
// (1/6 ÷ 2 ≈ 0.083) so the overlay fully clears at each stop interior.
const W = 0.07

type Loc = { name: string; sub: string; rgb: string }
const hexToRgb = (hex: string): string => {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}
// One card per level, derived from LEVELS (so the card always names the level you
// enter — fixes the Farmers stop reading "MOJAVE"). Indexed by level 0..N-1;
// crossing border i drives INTO level i+1.
const LOCS: Loc[] = LEVELS.map((l) => ({ name: l.card.name, sub: l.card.sub, rgb: hexToRgb(l.accent) }))

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const smoothstep = (x: number, a: number, b: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

export default function DriveTransition({ progressRef }: { progressRef: RefObject<number> }) {
  const root = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLDivElement>(null)
  const panelA = useRef<HTMLDivElement>(null)
  const panelB = useRef<HTMLDivElement>(null)
  const panelC = useRef<HTMLDivElement>(null)
  const tone = useRef<HTMLDivElement>(null)
  const streaks = useRef<HTMLDivElement>(null)
  const flash = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const nameEl = useRef<HTMLDivElement>(null)
  const subEl = useRef<HTMLDivElement>(null)
  const region = useRef(-1)
  const shown = useRef(-1) // time-damped progress

  useEffect(() => {
    let raf = 0
    let last = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const p = progressRef.current ?? 0
      // exponential smoothing → the beat eases through the seam instead of
      // snapping on a fast flick (frame-rate independent via the rAF timestamp).
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016
      last = now
      if (shown.current < 0) shown.current = p
      shown.current += (p - shown.current) * (1 - Math.exp(-dt / 0.2))
      const sp = shown.current

      // nearest border + signed distance
      let bi = -1
      let sd = 1
      for (let i = 0; i < BORDERS.length; i++) {
        const d = sp - BORDERS[i]
        if (Math.abs(d) < Math.abs(sd)) {
          sd = d
          bi = i
        }
      }
      // eased cover so the ramp has weight (long dramatic warp), not a linear snap
      const k = smoothstep(1 - clamp(Math.abs(sd) / W, 0, 1), 0, 1)

      const r = root.current
      if (!r) return
      if (k <= 0.001) {
        if (r.style.opacity !== '0') r.style.opacity = '0'
        return
      }
      r.style.opacity = '1'

      // rebuild accent-tinted gradients only when the incoming region changes
      const incoming = clamp(bi + 1, 0, LOCS.length - 1)
      if (region.current !== incoming) {
        region.current = incoming
        const L = LOCS[incoming]
        const c = L.rgb
        if (field.current)
          field.current.style.background = `radial-gradient(circle at 50% 44%, rgba(${c},0.42) 0%, rgba(244,243,239,0.97) 66%)`
        if (panelA.current)
          panelA.current.style.background = `linear-gradient(90deg, rgba(${c},0.96), rgba(${c},0.66))`
        if (panelC.current)
          panelC.current.style.background = `linear-gradient(90deg, #ffffff, rgba(${c},0.9))`
        if (tone.current)
          tone.current.style.background = `radial-gradient(rgba(${c},0.85) 1.3px, transparent 1.7px)`
        if (streaks.current)
          streaks.current.style.background = `repeating-linear-gradient(112deg, transparent 0 17px, rgba(${c},0.5) 17px 20px)`
        if (flash.current)
          flash.current.style.background = `radial-gradient(circle at 50% 50%, #ffffff 0%, rgba(${c},0.8) 45%, rgba(${c},0) 100%)`
        if (nameEl.current) nameEl.current.textContent = L.name
        if (subEl.current) {
          subEl.current.textContent = L.sub
          subEl.current.style.color = `rgb(${c})`
        }
      }

      // ph: -1 approaching seam .. 0 at seam .. +1 leaving. Panels slide with it
      // so the shards sweep in from one side and slash off the other.
      const ph = clamp(sd / W, -1, 1)
      if (field.current) field.current.style.opacity = String(smoothstep(k, 0.28, 0.82))
      const pk = clamp(k * 1.5, 0, 1)
      if (panelA.current) {
        panelA.current.style.opacity = String(pk)
        panelA.current.style.transform = `translateX(${-ph * 150}%) skewX(-11deg)`
      }
      if (panelB.current) {
        panelB.current.style.opacity = String(pk)
        panelB.current.style.transform = `translateX(${-ph * 128}%) skewX(-11deg)`
      }
      if (panelC.current) {
        panelC.current.style.opacity = String(pk * 0.9)
        panelC.current.style.transform = `translateX(${-ph * 172}%) skewX(-11deg)`
      }
      if (tone.current) tone.current.style.opacity = String(k * 0.5)
      if (streaks.current) {
        streaks.current.style.opacity = String(k * 0.4)
        streaks.current.style.transform = `translateX(${-ph * 30}%)`
      }
      if (flash.current) flash.current.style.opacity = String(Math.pow(k, 4) * 0.7)
      if (card.current) {
        card.current.style.opacity = String(smoothstep(k, 0.2, 0.52))
        // slam in with a slight italic skew + drift, lingering across the hold
        card.current.style.transform = `translateX(${ph * 5}vw) skewX(-6deg)`
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progressRef])

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {/* near-black accent field — peaks at the swap to hide the region cull */}
      <div ref={field} className="absolute inset-0" style={{ opacity: 0 }} />

      {/* angular slash panels (oversized so the skew never reveals an edge) */}
      <div
        ref={panelA}
        className="absolute"
        style={{ left: '-30%', right: '-30%', top: '-8%', height: '46%', opacity: 0 }}
      />
      <div
        ref={panelB}
        className="absolute"
        style={{ left: '-30%', right: '-30%', bottom: '-8%', height: '46%', background: 'rgba(20,19,24,0.92)', opacity: 0 }}
      />
      <div
        ref={panelC}
        className="absolute"
        style={{ left: '-30%', right: '-30%', top: '42%', height: '16%', opacity: 0 }}
      />

      {/* halftone screentone */}
      <div
        ref={tone}
        className="absolute inset-0 mix-blend-screen"
        style={{ backgroundSize: '7px 7px', opacity: 0 }}
      />

      {/* diagonal motion streaks */}
      <div ref={streaks} className="absolute inset-[-10%] mix-blend-screen" style={{ opacity: 0 }} />

      {/* soft accent pop at the peak */}
      <div ref={flash} className="absolute inset-0 mix-blend-screen" style={{ opacity: 0 }} />

      {/* location title card */}
      <div
        ref={card}
        className="absolute inset-x-0 top-[38%] flex flex-col items-center text-center"
        style={{ opacity: 0 }}
      >
        <div
          ref={nameEl}
          className="font-serif font-bold uppercase italic leading-none text-[#141318]"
          style={{
            fontSize: 'clamp(2.4rem,9vw,7rem)',
            letterSpacing: '-0.01em',
            textShadow: '0 3px 0 rgba(255,255,255,0.4), 0 2px 30px rgba(255,255,255,0.7)',
          }}
        />
        <div
          ref={subEl}
          className="mt-4 font-mono text-sm font-semibold uppercase tracking-[0.5em]"
        />
      </div>
    </div>
  )
}

'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import PosterStop from './PosterStop'
import StopDossier from './StopDossier'
import { POSTERS } from './posterRoute'

import DriveFinale from './DriveFinale'

// One client-only WebGL canvas renders BOTH the pale 3D ground AND the car (the
// car follows the DOM trail-tracker below), so there's a single context — a
// separate marker canvas blanked on some tabs.
const AtlasWorld3D = dynamic(() => import('./AtlasWorld3D'), { ssr: false })

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

/**
 * The Route Map atlas: one tall near-white canvas, a winding trail through 7
 * numbered station nodes, each poster rendered as a framed print pinned beside
 * its node. The white C63 sticker badge drives the trail. Path geometry is
 * MEASURED at runtime from the actual node DOM (never hardcoded viewBox coords)
 * so it survives font swaps, image reflow, and every breakpoint.
 */

const CANVAS_PAPER = '#fafaf7'
const CANVAS_INK = '#1d1611'

type Pt = { x: number; y: number }
type Geometry = {
  w: number
  h: number
  nodes: Pt[]
  full: string
  segments: string[]
}

/** Catmull-Rom through the node centers, converted to cubic beziers, with each
 *  control offset clamped to 40% of the segment length so far-apart alternating
 *  nodes can't produce loops or overshoot. Returns the joined path + per-segment
 *  paths (each wears its departure stop's accent). */
function buildGeometry(nodes: Pt[], w: number, h: number): Geometry {
  if (nodes.length < 2) return { w, h, nodes, full: '', segments: [] }
  const clampCtrl = (from: Pt, cx: number, cy: number, segLen: number): Pt => {
    const dx = cx - from.x
    const dy = cy - from.y
    const mag = Math.hypot(dx, dy)
    const max = segLen * 0.4
    if (mag <= max || mag === 0) return { x: cx, y: cy }
    const s = max / mag
    return { x: from.x + dx * s, y: from.y + dy * s }
  }
  const segments: string[] = []
  for (let i = 0; i < nodes.length - 1; i++) {
    const p0 = nodes[i - 1] ?? nodes[i]
    const p1 = nodes[i]
    const p2 = nodes[i + 1]
    const p3 = nodes[i + 2] ?? nodes[i + 1]
    const segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y)
    const c1 = clampCtrl(p1, p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6, segLen)
    const c2 = clampCtrl(p2, p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6, segLen)
    segments.push(
      `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`
    )
  }
  // the full path reuses the same anchors/controls so car + drawing stay aligned
  const full = segments
    .map((s, i) => (i === 0 ? s : s.replace(/^M [^C]+C/, 'C')))
    .join(' ')
  return { w, h, nodes, full, segments }
}

export default function RouteMap() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const routeRef = useRef<HTMLDivElement>(null)
  const finaleRef = useRef<HTMLElement>(null)
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([])
  const segRefs = useRef<(SVGPathElement | null)[]>([])
  const carRef = useRef<HTMLDivElement>(null)
  const carPathRef = useRef<SVGPathElement>(null)
  const carTweenRef = useRef<gsap.core.Tween | null>(null)
  const finaleFiredRef = useRef(false)
  const tweensRef = useRef<gsap.core.Tween[]>([])
  const triggersRef = useRef<ScrollTrigger[]>([])
  const [geo, setGeo] = useState<Geometry>({ w: 0, h: 0, nodes: [], full: '', segments: [] })
  const [active, setActive] = useState(0)
  const [finaleOn, setFinaleOn] = useState(false)

  // measure node centers relative to the inner positioning box
  const measure = () => {
    const inner = innerRef.current
    if (!inner) return
    const box = inner.getBoundingClientRect()
    const nodes: Pt[] = nodeRefs.current.map((n) => {
      if (!n) return { x: 0, y: 0 }
      const r = n.getBoundingClientRect()
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 }
    })
    setGeo(buildGeometry(nodes, inner.offsetWidth, inner.offsetHeight))
  }

  // gate the FIRST measure on fonts + stop-1 image so node centers are final
  useLayoutEffect(() => {
    let alive = true
    const first = () => alive && measure()
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (fonts?.ready) fonts.ready.then(first)
    else first()
    const t = setTimeout(first, 600) // decode/layout safety net
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [])

  // debounced re-measure on resize / content reflow
  useLayoutEffect(() => {
    const inner = innerRef.current
    if (!inner) return
    let raf = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(raf)
      raf = window.setTimeout(measure, 150) as unknown as number
    })
    ro.observe(inner)
    return () => {
      ro.disconnect()
      clearTimeout(raf)
    }
  }, [])

  // (re)build the draw + car-drive animations whenever geometry changes.
  // Kill everything first so a re-measure never leaves the car on a stale path.
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const route = routeRef.current
    if (!canvas || !route || !geo.full || geo.segments.length === 0) return
    tweensRef.current.forEach((t) => t.kill())
    triggersRef.current.forEach((t) => t.kill())
    tweensRef.current = []
    triggersRef.current = []

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // set each drawn segment hidden (dashoffset = length), ghost stays visible
    const segEls = segRefs.current.filter(Boolean) as SVGPathElement[]
    const lengths = segEls.map((el) => el.getTotalLength())
    segEls.forEach((el, i) => {
      gsap.set(el, { strokeDasharray: lengths[i], strokeDashoffset: reduce ? 0 : lengths[i] })
    })

    if (carRef.current) gsap.set(carRef.current, { xPercent: -50, yPercent: -50 })

    // finale car is pinned to the VIEWPORT centre (position:fixed via the
    // finaleOn className) so the tall, still-settling page height can't drift
    // it off; visibility is toggled by an IntersectionObserver on the finale zone.

    // once fired (or reduced-motion), the car LIVES fixed-centred (via the
    // finaleOn className); a re-measure must clear leftover path transforms,
    // draw the trail statically, and NOT rebuild the path tween
    if (reduce || finaleFiredRef.current) {
      if (carRef.current) {
        gsap.killTweensOf(carRef.current)
        gsap.set(carRef.current, { clearProps: 'all' })
      }
      setFinaleOn(true)
      segEls.forEach((el) => gsap.set(el, { strokeDashoffset: 0 }))
      return
    }

    const n = geo.segments.length
    segEls.forEach((el, i) => {
      const tw = gsap.to(el, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: route,
          start: () => `top+=${(i / n) * 100}% top`,
          end: () => `top+=${((i + 1) / n) * 100}% top`,
          scrub: 0.75,
        },
      })
      tweensRef.current.push(tw)
      if (tw.scrollTrigger) triggersRef.current.push(tw.scrollTrigger)
    })

    if (carRef.current && carPathRef.current && !finaleFiredRef.current) {
      const carTw = gsap.to(carRef.current, {
        ease: 'none',
        motionPath: {
          path: carPathRef.current,
          align: carPathRef.current,
          autoRotate: true,
          alignOrigin: [0.5, 0.5],
        },
        scrollTrigger: {
          trigger: route,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.75,
        },
      })
      carTweenRef.current = carTw
      tweensRef.current.push(carTw)
      if (carTw.scrollTrigger) triggersRef.current.push(carTw.scrollTrigger)
    }

    ScrollTrigger.refresh()
    return () => {
      tweensRef.current.forEach((t) => t.kill())
      triggersRef.current.forEach((t) => t.kill())
      tweensRef.current = []
      triggersRef.current = []
    }
  }, [geo])

  // auto-zoom on arrival + fixed-car visibility, driven by IntersectionObserver
  // (fires on ANY scroll incl. programmatic jumps, unlike ScrollTrigger onEnter).
  // On first real arrival the car detaches from the trail and the camera dollies
  // in; thereafter the fixed car only shows while the finale zone is on-screen.
  useLayoutEffect(() => {
    const fin = finaleRef.current
    if (!fin) return
    // FIRE when the finale reaches the centre band (rootMargin, not ratio — the
    // finale is taller than the viewport so ratio-thresholds never fire cleanly)
    const fire = new IntersectionObserver(
      ([e]) => {
        const car = carRef.current
        if (!e.isIntersecting || finaleFiredRef.current || !car) return
        finaleFiredRef.current = true
        carTweenRef.current?.scrollTrigger?.kill()
        carTweenRef.current?.kill()
        gsap.killTweensOf(car)
        gsap.set(car, { clearProps: 'all' })
        setFinaleOn(true)
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
    )
    // VISIBILITY: hide the fixed car once the all-projects list (right below the
    // finale) scrolls into view, so it never floats over the sections below;
    // also hide if the finale zone itself has fully left upward.
    const hideCar = (hide: boolean) => {
      if (finaleFiredRef.current && carRef.current) {
        gsap.to(carRef.current, { autoAlpha: hide ? 0 : 1, duration: 0.3 })
      }
    }
    const belowList = document.getElementById('all-side-projects')
    const vis = new IntersectionObserver(([e]) => hideCar(e.isIntersecting), { threshold: 0 })
    const finGone = new IntersectionObserver(([e]) => { if (!e.isIntersecting) hideCar(true) }, { threshold: 0 })
    fire.observe(fin)
    if (belowList) vis.observe(belowList)
    finGone.observe(fin)
    return () => {
      fire.disconnect()
      vis.disconnect()
      finGone.disconnect()
    }
  }, [])

  // active-stop tracking for the node highlight
  useLayoutEffect(() => {
    const els = POSTERS.map((p) => document.getElementById(`frame-${p.key}`)).filter(
      (el): el is HTMLElement => el !== null
    )
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const i = els.indexOf(e.target as HTMLElement)
          if (i >= 0) setActive(i)
        }
      },
      { threshold: 0.4 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const goTo = (key: string) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById(`frame-${key}`)
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
  }

  return (
    <div
      ref={canvasRef}
      className="relative w-full overflow-hidden"
      style={{ color: CANVAS_INK }}
    >
      {/* pale 3D ground + the car in one canvas; the car follows the tracker below.
          lightSide rakes the key from the active print's side (shifts L↔R per stop). */}
      <AtlasWorld3D
        trackerRef={carRef}
        finaleOn={finaleOn}
        lightSide={POSTERS[active]?.layout === 'right' ? 1 : -1}
      />
      <div ref={innerRef} className="relative mx-auto w-full max-w-[1200px] px-4">
        {/* header plate: title + metric stamps (marginalia intentionally cut) */}
        <header className="relative z-20 pb-8 pt-28 text-center md:pt-36">
          <h1
            className="font-serif leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.75rem, 8vw, 6rem)' }}
          >
            THE GRAND TOUR
          </h1>
          <p className="mt-4 font-mono text-[11px] tracking-[0.35em] opacity-70 md:text-xs">
            ROUTE MAP · SEVEN STOPS, 2022-2026
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {['$10M ATTRIBUTED', '$504K SAVED', '2ND OF 250'].map((m) => (
              <span
                key={m}
                className="rotate-[-1.5deg] border-2 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.18em] md:text-xs"
                style={{ borderColor: CANVAS_INK, color: CANVAS_INK }}
              >
                {m}
              </span>
            ))}
          </div>
        </header>

        {/* the measured trail, overlaid on the whole inner column */}
        <svg
          className="pointer-events-none absolute inset-0 z-0"
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w || 1} ${geo.h || 1}`}
          fill="none"
          aria-hidden="true"
        >
          {/* ghost route: the whole planned path, dashed and faint */}
          <path
            d={geo.full}
            stroke={CANVAS_INK}
            strokeOpacity={0.18}
            strokeWidth={3}
            strokeDasharray="3 12"
            strokeLinecap="round"
          />
          {/* drawn route: per-segment, each wearing its DEPARTURE stop's accent */}
          {geo.segments.map((d, i) => (
            <path
              key={i}
              ref={(el) => {
                segRefs.current[i] = el
              }}
              d={d}
              stroke={POSTERS[i].theme.accent}
              strokeWidth={4}
              strokeLinecap="round"
            />
          ))}
          {/* invisible full path the car follows (kept in sync with segments) */}
          <path ref={carPathRef} d={geo.full} stroke="none" />
        </svg>

        {/* invisible trail TRACKER: MotionPath moves + auto-rotates this wrapper
            exactly as before; AtlasWorld3D reads its screen position each frame and
            renders the real C63 there (unprojected onto the 3D ground). */}
        <div
          ref={carRef}
          className={
            finaleOn
              ? 'pointer-events-none fixed left-1/2 top-1/2 z-30 h-[70vw] w-[70vw] max-h-[440px] max-w-[440px] -translate-x-1/2 -translate-y-1/2'
              : 'pointer-events-none absolute left-0 top-0 z-30 h-24 w-24 md:h-28 md:w-28'
          }
          aria-hidden="true"
        />

        {/* one row per stop: framed print + node button, alternating sides */}
        <div ref={routeRef}>
        {POSTERS.map((p, i) => {
          const nodeSide = p.layout === 'right' ? 'left' : 'right'
          const printSide = p.layout === 'right' ? 'right' : 'left'
          return (
            <section
              key={p.key}
              className="relative z-10 grid min-h-[100dvh] grid-cols-1 items-center md:min-h-[110dvh]"
            >
              {/* framed print: aligned to its side at every breakpoint so the
                  winding trail + node always have a gutter (reduced-wind on mobile) */}
              <figure
                id={`frame-${p.key}`}
                className={`relative w-[80vw] max-w-[640px] bg-white p-2 shadow-[0_28px_70px_rgba(90,70,40,0.28)] md:w-[46vw] md:p-3 ${
                  printSide === 'right' ? 'justify-self-end' : 'justify-self-start'
                }`}
                style={{ rotate: printSide === 'right' ? '1.4deg' : '-1.4deg' }}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <PosterStop data={p} framed frameContent="headline-only" priority={i === 0} />
                </div>
              </figure>

              {/* dossier side-frame: body copy off the photo, slides in on active */}
              <StopDossier data={p} active={i === active} nodeSide={nodeSide} />

              {/* station node button */}
              <button
                type="button"
                ref={(el) => {
                  nodeRefs.current[i] = el
                }}
                onClick={() => goTo(p.key)}
                aria-label={`Stop ${i + 1}: ${p.masthead}`}
                aria-current={i === active ? 'true' : undefined}
                className={`absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full font-mono text-lg font-bold outline-offset-4 transition-transform duration-300 focus-visible:outline focus-visible:outline-2 ${
                  nodeSide === 'right' ? 'right-[4vw] md:right-[4%]' : 'left-[4vw] md:left-[4%]'
                }`}
                style={{
                  background: CANVAS_PAPER,
                  color: CANVAS_INK,
                  border: `4px solid ${p.theme.accent}`,
                  outlineColor: p.theme.accent,
                  transform: `translateY(-50%) scale(${i === active ? 1.15 : 1})`,
                  boxShadow: '0 4px 14px rgba(90,70,40,0.25)',
                }}
              >
                {i + 1}
              </button>
            </section>
          )
        })}
        </div>

        {/* finale zone: the SAME car glides here + zooms; DriveFinale is the
            DOM overlay (the car canvas floats on top from its shared wrapper) */}
        <section ref={finaleRef} id="drive-finale" className="relative min-h-[100dvh] overflow-hidden">
          <DriveFinale active={finaleOn} />
        </section>
      </div>
    </div>
  )
}

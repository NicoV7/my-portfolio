'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { PosterStopData } from './posterRoute'

gsap.registerPlugin(ScrollTrigger)

/**
 * One animated poster pit stop (epic-design depth system: 0 bg art, 2 props,
 * 3 car, 4 DOM type, 5 grain). GSAP owns this tree — framer-motion never
 * mounts inside it. Pinned scene: entrance plays on arrival, scrub adds
 * parallax depth while the visitor "reads" the cover.
 */
export default function PosterStop({ data }: { data: PosterStopData }) {
  const scene = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!scene.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce) return

    const ctx = gsap.context(() => {
      // entrance: stamps + lines punch in once the poster reaches the viewport
      const tl = gsap.timeline({
        scrollTrigger: { trigger: scene.current, start: 'top 70%', once: true },
      })
      tl.fromTo('.p-car', { yPercent: 24, rotate: 4, opacity: 0 }, { yPercent: 0, rotate: -2, opacity: 1, duration: 0.9, ease: 'power3.out' })
        .fromTo('.p-masthead', { yPercent: -120 }, { yPercent: 0, duration: 0.55, ease: 'power4.out' }, '-=0.55')
        .fromTo('.p-line', { scale: 1.35, opacity: 0, rotate: -6 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out(2.5)', stagger: 0.13 }, '-=0.25')
        .fromTo('.p-side', { xPercent: 120, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.4')
        .fromTo('.p-feature', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.08 }, '-=0.2')

      if (!coarse) {
        // scrub parallax: bg drifts slower than the car photo (depth illusion)
        gsap.to('.p-bg', {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: scene.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        gsap.to('.p-car', {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: scene.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        // idle float on the car photo so the hero never sits fully still
        gsap.to('.p-car', { y: '+=10', rotate: -1.4, duration: 5.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      }
    }, scene)
    return () => ctx.revert()
  }, [])

  const t = data.theme
  const lead = data.lines.find((l) => l.kind === 'lead')
  const rest = data.lines.filter((l) => l.kind === 'line')
  const chip = data.lines.find((l) => l.kind === 'chip')

  return (
    <section
      ref={scene}
      className="relative min-h-[100dvh] overflow-hidden"
      style={{ background: t.paper, color: t.ink }}
      aria-label={`${data.masthead}: ${lead?.text ?? ''}`}
    >
      {/* depth-0: generated cover art (bg IS content — kept per asset rules) */}
      <div className="p-bg absolute inset-0" aria-hidden="true">
        <Image src={data.art.bg} alt="" fill priority className="object-cover" sizes="100vw" />
      </div>

      {/* depth-3: the car cover photo, a tilted glossy print */}
      {data.art.car && (
        <div className="p-car absolute bottom-[-4%] left-[4%] w-[42vw] max-w-[520px] min-w-[260px] shadow-[0_30px_80px_rgba(0,0,0,0.45)]" style={{ rotate: '-2deg' }}>
          <Image src={data.art.car} alt="White Mercedes C63 AMG cover photo" width={880} height={1174} className="h-auto w-full border-[10px]" style={{ borderColor: t.paper }} />
        </div>
      )}

      {/* depth-4: live type — the cover lines are real content */}
      <div className="absolute inset-0 px-[6vw] pb-[4vh] pt-[10vh]">
        <div className="overflow-hidden">
          <h2 className="p-masthead font-serif leading-none tracking-tight" style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', color: t.ink }}>
            {data.masthead}
          </h2>
        </div>
        <p className="mt-1 font-mono text-xs tracking-[0.3em]" style={{ color: t.accent }}>{data.issue}</p>

        {lead && (
          <div className="p-line mt-[6vh] max-w-[46vw]">
            <p className="font-sans font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.8rem)', color: t.accent, textShadow: `0 2px 0 ${t.paper}, 0 0 18px ${t.paper}` }}>{lead.text}</p>
            {lead.sub && <p className="mt-2 font-mono text-sm" style={{ color: t.ink }}>{lead.sub}</p>}
          </div>
        )}

        <div className="mt-[4vh] flex max-w-[40vw] flex-col gap-3">
          {rest.map((l) => (
            <div key={l.text} className="p-line">
              <p className="font-sans text-xl font-bold md:text-2xl" style={{ textShadow: `0 1px 0 ${t.paper}, 0 0 12px ${t.paper}` }}>{l.text}</p>
              {l.sub && <p className="font-mono text-xs opacity-70">{l.sub}</p>}
            </div>
          ))}
        </div>

        {chip && (
          <div className="p-line absolute right-[5vw] top-[12vh] rotate-6 border-4 px-4 py-2 font-sans text-lg font-black" style={{ borderColor: t.accent, color: t.accent }}>
            {chip.text}
          </div>
        )}

        {data.side && (
          <p className="p-side absolute right-[2.5vw] top-[30vh] font-sans text-2xl font-black tracking-widest [writing-mode:vertical-rl]" style={{ color: t.ink }}>
            {data.side}
          </p>
        )}

        {data.features && (
          <ul className="absolute bottom-[3vh] right-[4vw] flex max-w-[44vw] flex-wrap justify-end gap-x-5 gap-y-1">
            {data.features.map((f) => (
              <li key={f} className="p-feature font-mono text-[11px] tracking-wide" style={{ color: t.paper, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{f}</li>
            ))}
          </ul>
        )}
      </div>

      {/* depth-5: print grain + paper vignette */}
      <div className="pointer-events-none absolute inset-0 mix-blend-multiply" aria-hidden="true"
        style={{ background: 'radial-gradient(120% 90% at 50% 40%, transparent 60%, rgba(60,40,20,0.28) 100%)' }} />
    </section>
  )
}

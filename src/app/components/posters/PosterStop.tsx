'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { PosterStopData, FeatureLink } from './posterRoute'

gsap.registerPlugin(ScrollTrigger)

/** deco speed-line geometry: thin skewed streaks sweeping the mid layer.
 *  widths are container units (cqw) so the poster is size-agnostic: identical
 *  proportions whether it fills the viewport or rides in a print frame. */
const SPEED_LINES = [
  { top: '14%', left: '-12%', width: '48cqw', skew: -9 },
  { top: '22%', left: '4%', width: '60cqw', skew: -9 },
  { top: '30%', left: '-6%', width: '42cqw', skew: -8 },
  { top: '46%', left: '30%', width: '54cqw', skew: -10 },
  { top: '56%', left: '-10%', width: '38cqw', skew: -8 },
  { top: '64%', left: '18%', width: '58cqw', skew: -9 },
  { top: '76%', left: '-4%', width: '46cqw', skew: -10 },
  { top: '84%', left: '26%', width: '50cqw', skew: -8 },
]

/** per-style vignette dressing; rally stays flat (no vignette at all) */
const VIGNETTES: Record<string, string | null> = {
  jdm: 'radial-gradient(120% 90% at 50% 40%, transparent 60%, rgba(60,40,20,0.28) 100%)',
  postcard: 'radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(122,63,12,0.32) 100%)',
  deco: 'radial-gradient(120% 90% at 50% 40%, transparent 50%, rgba(6,16,30,0.55) 100%)',
  fuji: 'radial-gradient(120% 90% at 50% 40%, transparent 70%, rgba(20,20,20,0.14) 100%)',
  closing: 'radial-gradient(120% 90% at 50% 40%, transparent 70%, rgba(10,40,30,0.16) 100%)',
  rally: null,
}

/**
 * One animated poster pit stop (epic-design depth system: 0 bg art, 1 sun,
 * 2 speed-lines, 3 car, 4 DOM type, 5 grain). GSAP owns this tree;
 * framer-motion never mounts inside it. Entrance plays on arrival, scrub
 * adds parallax depth while the visitor reads the cover.
 * The 'jdm' variant is the approved gate layout and renders unchanged.
 */
export default function PosterStop({
  data,
  framed = false,
  priority = false,
  frameContent = 'full',
}: {
  data: PosterStopData
  /** true = rendered inside a map print frame (size-driven by wrapper); false = full-viewport */
  framed?: boolean
  /** eager-load the bg image (only the first atlas stop should set this) */
  priority?: boolean
  /** 'headline-only' keeps just masthead + lead on the photo (rest moves to the dossier) */
  frameContent?: 'full' | 'headline-only'
}) {
  const scene = useRef<HTMLElement>(null)
  const style = data.style
  const flip = data.layout === 'right'
  const heavySans = style === 'fuji' || style === 'closing' || style === 'rally'
  const hasSun = style === 'fuji' || style === 'closing'
  const centered = style === 'rally'
  const headlineOnly = frameContent === 'headline-only'
  const [bgFailed, setBgFailed] = useState(false)
  const [carFailed, setCarFailed] = useState(false)

  useLayoutEffect(() => {
    if (!scene.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce) return
    const root = scene.current
    const mirrored = data.layout === 'right'
    const kind = data.style
    const sun = kind === 'fuji' || kind === 'closing'

    const ctx = gsap.context(() => {
      // entrance: stamps + lines punch in once the poster reaches the viewport
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      })
      tl.fromTo('.p-car', { yPercent: 24, rotate: mirrored ? -4 : 4, opacity: 0 }, { yPercent: 0, rotate: mirrored ? 2 : -2, opacity: 1, duration: 0.9, ease: 'power3.out' })
      if (kind === 'rally') {
        // split-converge: masthead words fly in from alternating sides
        tl.fromTo('.p-mast-word', { xPercent: (i: number) => (i % 2 ? 90 : -90), opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.55, ease: 'power4.out', stagger: 0.07 }, '-=0.55')
      } else {
        tl.fromTo('.p-masthead', { yPercent: -120 }, { yPercent: 0, duration: 0.55, ease: 'power4.out' }, '-=0.55')
      }
      if (sun) {
        tl.fromTo('.p-sun', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.7')
      }
      if (kind === 'deco') {
        tl.fromTo('.p-speedline', { xPercent: -130, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.07 }, '-=0.6')
      }
      tl.fromTo('.p-line', { scale: 1.35, opacity: 0, rotate: -6 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out(2.5)', stagger: 0.13 }, '-=0.25')
      if (root.querySelector('.p-side')) {
        tl.fromTo('.p-side', { xPercent: mirrored ? -120 : 120, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.4')
      }
      if (root.querySelector('.p-feature')) {
        tl.fromTo('.p-feature', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.08 }, '-=0.2')
      }
      if (root.querySelector('.p-media')) {
        tl.fromTo('.p-media', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, '-=0.2')
      }

      if (!coarse) {
        // scrub parallax: bg drifts slower than the car photo (depth illusion)
        gsap.to('.p-bg', {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        gsap.to('.p-car', {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        if (kind === 'closing') {
          // gentle rise loop on the car print: the closing poster suggests liftoff
          gsap.to('.p-car', { y: '-=8', duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
        } else {
          // idle float on the car photo so the hero never sits fully still
          gsap.to('.p-car', { y: '+=10', rotate: mirrored ? 1.4 : -1.4, duration: 5.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
        }
        if (sun) {
          // the sun breathes: barely-there scale loop
          gsap.to('.p-sun', { scale: 1.02, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
        }
        if (kind === 'deco') {
          // speed-line layer drifts laterally with the scroll
          gsap.to('.p-speedlines', {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        }
      }
    }, scene)
    return () => ctx.revert()
  }, [data])

  const t = data.theme
  const lead = data.lines.find((l) => l.kind === 'lead')
  const rest = data.lines.filter((l) => l.kind === 'line')
  const chip = data.lines.find((l) => l.kind === 'chip')
  const media = data.media?.slice(0, 3)
  const mediaTilt = ['1.5deg', '-2.5deg', '2deg']

  return (
    <section
      ref={scene}
      id={`poster-${data.key}`}
      className={`@container relative w-full overflow-hidden ${framed ? 'h-full' : 'min-h-[100dvh]'}`}
      style={{ background: t.paper, color: t.ink }}
      aria-label={`${data.masthead}: ${lead?.text ?? ''}`}
    >
      {/* depth-0: generated cover art (bg IS content, kept per asset rules).
          paper fill shows until decode; on error the paper + DOM type still read
          as an intentional typographic print rather than a broken image. */}
      <div className="p-bg absolute inset-0" aria-hidden="true" style={{ background: t.paper }}>
        {!bgFailed && (
          <Image
            src={data.art.bg}
            alt=""
            fill
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            onError={() => setBgFailed(true)}
            className="object-cover"
            sizes={framed ? '(max-width: 768px) 92vw, min(46vw, 640px)' : '100vw'}
          />
        )}
      </div>

      {/* depth-1: giant sun disc (fuji field + mint closing), breathes behind the car */}
      {hasSun && (
        <div
          className="p-sun absolute"
          aria-hidden="true"
          style={{
            width: '52cqw',
            height: '52cqw',
            borderRadius: '50%',
            top: '10%',
            left: '50%',
            marginLeft: '-26cqw',
            // closing's bg art already paints a sun: render a soft mint glow, not a second disc
            background:
              style === 'closing'
                ? `radial-gradient(circle, ${t.accent}b3 0%, ${t.accent}40 45%, transparent 70%)`
                : `radial-gradient(circle, ${t.accent} 0%, ${t.accent} 58%, transparent 61%)`,
          }}
        />
      )}

      {/* depth-2: deco speed-lines sweeping the coast */}
      {style === 'deco' && (
        <div className="p-speedlines absolute inset-0" aria-hidden="true">
          {SPEED_LINES.map((l, i) => (
            <div
              key={i}
              className="p-speedline absolute"
              style={{
                top: l.top,
                left: l.left,
                width: l.width,
                height: '2px',
                transform: `skewY(${l.skew}deg)`,
                background: `linear-gradient(90deg, transparent, ${i % 2 ? t.accent : t.ink}, transparent)`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      )}

      {/* depth-3: the car cover photo, a tilted glossy print */}
      {data.art.car && !carFailed && (
        <div
          className={`p-car absolute bottom-[-4%] w-[42cqw] max-w-[520px] ${flip ? 'right-[4%]' : 'left-[4%]'} ${style === 'rally' ? '' : 'shadow-[0_30px_80px_rgba(0,0,0,0.45)]'}`}
          style={{ rotate: flip ? '2deg' : '-2deg' }}
        >
          <Image
            src={data.art.car}
            alt="White Mercedes C63 AMG cover photo"
            width={880}
            height={1174}
            loading={priority ? undefined : 'lazy'}
            onError={() => setCarFailed(true)}
            className="h-auto w-full"
            style={{ border: `clamp(4px, 1cqw, 10px) solid ${t.paper}` }}
            sizes={framed ? '(max-width: 768px) 40vw, min(20vw, 280px)' : '42vw'}
          />
        </div>
      )}

      {/* depth-4: live type, the cover lines are real content.
          all sizing in container units (cqw) so the composition holds at any
          frame size; absolute children anchor to % of the section height. */}
      <div className="absolute inset-0 px-[6cqw] pb-[4cqw] pt-[8cqw]">
        {/* headline-only prints (atlas) get a paper scrim so the masthead + lead
            read cleanly over the art; body copy moves to the dossier side-frame */}
        {headlineOnly && (
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{ background: `linear-gradient(180deg, ${t.paper}f2 0%, ${t.paper}b3 26%, transparent 58%)` }}
          />
        )}
        <div className={`relative overflow-hidden ${centered ? 'text-center' : ''}`}>
          <h2 className={`p-masthead leading-none tracking-tight ${heavySans ? 'font-sans font-black' : 'font-serif'}`} style={{ fontSize: 'clamp(1.4rem, 9cqw, 8rem)', color: t.ink, textShadow: `0 2px 0 ${t.paper}, 0 4px 28px ${t.paper}` }}>
            {style === 'rally'
              ? data.masthead.split(' ').map((w, i) => (
                  <span key={`${w}-${i}`} className="p-mast-word inline-block" style={{ marginRight: '0.24em' }}>
                    {w}
                  </span>
                ))
              : data.masthead}
          </h2>
        </div>
        <p className={`relative mt-1 font-mono tracking-[0.3em] ${centered ? 'text-center' : ''}`} style={{ fontSize: 'clamp(0.5rem, 1.1cqw, 0.75rem)', color: t.accent, textShadow: `0 1px 0 ${t.paper}, 0 0 8px ${t.paper}` }}>{data.issue}</p>

        {lead && (
          <div className={`p-line relative mt-[6cqw] ${centered ? 'mx-auto max-w-[52cqw] text-center' : 'max-w-[46cqw]'}`}>
            <p className="font-sans font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(1.1rem, 5.5cqw, 4.8rem)', color: t.accent, textShadow: `0 2px 0 ${t.paper}, 0 0 18px ${t.paper}` }}>{lead.text}</p>
            {lead.sub && !headlineOnly && <p className="mt-2 font-mono font-bold" style={{ fontSize: 'clamp(0.55rem, 1.4cqw, 0.875rem)', color: t.ink, textShadow: `0 1px 0 ${t.paper}, 0 0 10px ${t.paper}` }}>{lead.sub}</p>}
          </div>
        )}

        {!headlineOnly && (
          <div className={`mt-[4cqw] flex flex-col gap-3 ${centered ? 'mx-auto max-w-[62cqw] items-center text-center' : 'max-w-[40cqw]'}`}>
            {rest.map((l) => (
              <div key={l.text} className="p-line">
                <p className="font-sans font-bold" style={{ fontSize: 'clamp(0.8rem, 2.6cqw, 1.5rem)', textShadow: `0 1px 0 ${t.paper}, 0 0 12px ${t.paper}` }}>{l.text}</p>
                {l.sub && <p className="font-mono" style={{ fontSize: 'clamp(0.5rem, 1.1cqw, 0.75rem)', color: t.ink, opacity: 0.9, textShadow: `0 1px 0 ${t.paper}, 0 0 8px ${t.paper}` }}>{l.sub}</p>}
              </div>
            ))}
          </div>
        )}

        {chip && !headlineOnly && (
          <div className={`p-line absolute top-[12%] rotate-6 border-4 px-4 py-2 font-sans font-black ${flip ? 'left-[5cqw]' : 'right-[5cqw]'}`} style={{ fontSize: 'clamp(0.7rem, 2.2cqw, 1.125rem)', borderColor: t.accent, color: t.accent }}>
            {chip.text}
          </div>
        )}

        {data.side && !headlineOnly && (
          <p className={`p-side absolute top-[30%] font-sans font-black tracking-widest [writing-mode:vertical-rl] ${flip ? 'left-[2.5cqw]' : 'right-[2.5cqw]'}`} style={{ fontSize: 'clamp(0.8rem, 2.4cqw, 1.5rem)', color: t.ink }}>
            {data.side}
          </p>
        )}

        {data.features && !headlineOnly && (
          <ul className={`absolute bottom-[3%] flex max-w-[44cqw] flex-wrap gap-x-5 gap-y-1 ${flip ? 'left-[4cqw] justify-start' : 'right-[4cqw] justify-end'}`}>
            {data.features.map((f) =>
              typeof f === 'string' ? (
                <li key={f} className="p-feature font-mono text-[11px] tracking-wide" style={{ color: t.paper, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>{f}</li>
              ) : (
                <FeatureAnchor key={f.label} link={f} paper={t.paper} ink={t.ink} />
              )
            )}
          </ul>
        )}
      </div>

      {/* depth-4.5: era-styled media inset prints (bottom-center, capped at 3) */}
      {media && media.length > 0 && !headlineOnly && (
        <div className="absolute bottom-[4%] left-1/2 z-10 flex -translate-x-1/2 items-end gap-4">
          {media.map((m, i) => (
            <figure
              key={m.src}
              className="p-media w-[13cqw] max-w-[190px] shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
              style={{ rotate: mediaTilt[i], background: t.paper, padding: '6px 6px 4px' }}
            >
              {m.type === 'image' ? (
                <Image src={m.src} alt={m.caption} width={320} height={240} className="h-auto w-full" />
              ) : (
                <video src={m.src} muted loop autoPlay playsInline className="h-auto w-full" aria-label={m.caption} />
              )}
              <figcaption className="pt-1 font-mono text-[9px] tracking-wide" style={{ color: t.ink }}>{m.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {/* depth-5: print grain + paper vignette (rally stays flat) */}
      {VIGNETTES[style] && (
        <div className="pointer-events-none absolute inset-0 mix-blend-multiply" aria-hidden="true" style={{ background: VIGNETTES[style] as string }} />
      )}

      {/* postcard dressing: thick cream inset frame around the whole card */}
      {style === 'postcard' && (
        <div className="pointer-events-none absolute inset-[14px]" aria-hidden="true" style={{ border: `8px double ${t.paper}` }} />
      )}
    </section>
  )
}

/** underlined ink-on-paper anchor for the Contact poster's features strip */
function FeatureAnchor({ link, paper, ink }: { link: FeatureLink; paper: string; ink: string }) {
  const external = link.href.startsWith('http')
  return (
    <li className="p-feature font-mono text-[13px] font-bold tracking-wide">
      <a
        href={link.href}
        download={link.download}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className="underline underline-offset-4"
        style={{ color: ink, textShadow: `0 1px 0 ${paper}, 0 0 8px ${paper}` }}
      >
        {link.label}
      </a>
    </li>
  )
}

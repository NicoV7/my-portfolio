'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { STOP_PROGRESS } from '../app/components/hero/heroScenes'

const nearestStop = (p: number) => {
  let best = 0
  let bd = Infinity
  for (let i = 0; i < STOP_PROGRESS.length; i++) {
    const d = Math.abs(p - STOP_PROGRESS[i])
    if (d < bd) {
      bd = d
      best = i
    }
  }
  return best
}

interface DriveApi {
  progressRef: RefObject<number>
  /** 0..1 "felt" drive speed (damped progress velocity) — camera/FX/audio read this. */
  speedRef: RefObject<number>
  /** 0..1 launch "slip" — spikes on hard acceleration (burnout), decays. */
  slipRef: RefObject<number>
  /** signed drive direction: +1 forward, -1 reverse, 0 idle (for the engine rev). */
  dirRef: RefObject<number>
  activeIndex: number
  playing: boolean
  goTo: (i: number) => void
  next: () => void
  prev: () => void
  togglePlay: () => void
}

// progress units/sec at which speedRef saturates to 1 (≈ one stop-to-stop dash).
const SPEED_SCALE = 2.4
// how strongly a positive speed jump reads as wheel slip, and its per-frame decay.
const SLIP_SCALE = 9
const SLIP_DECAY = 0.9

/**
 * Maps scroll position within a tall wrapper section to a 0..1 drive progress
 * (single source of truth). Derives the active stop and supports autoplay via
 * smooth-scroll to each stop. Autoplay pauses on manual interaction.
 */
export function useDriveProgress(
  wrapRef: RefObject<HTMLElement | null>,
  count: number
): DriveApi {
  const progressRef = useRef(0)
  const speedRef = useRef(0)
  const slipRef = useRef(0)
  const dirRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  // Starts true: with no controller bar the drive self-runs like a slideshow;
  // any wheel/touch hands control to the user (listeners below pause it).
  const [playing, setPlaying] = useState(true)
  const playingRef = useRef(false)
  playingRef.current = playing
  const tweenRef = useRef(0)

  const metrics = () => {
    const el = wrapRef.current
    if (!el) return null
    const top = el.getBoundingClientRect().top + window.scrollY
    const scrollable = el.offsetHeight - window.innerHeight
    return { top, scrollable: Math.max(1, scrollable) }
  }

  useEffect(() => {
    const onScroll = () => {
      const m = metrics()
      if (!m) return
      const p = Math.min(1, Math.max(0, (window.scrollY - m.top) / m.scrollable))
      progressRef.current = p
      const idx = nearestStop(p)
      activeIndexRef.current = idx
      setActiveIndex((prev) => (prev === idx ? prev : idx))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, wrapRef])

  // Derive "felt" speed by damping a shadow value toward progress and measuring
  // its velocity — this keeps moving after scroll stops (the eased approach), so
  // it matches what the camera/FX/engine actually feel.
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let shown = progressRef.current
    let lastSpeed = 0
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const prev = shown
      shown += (progressRef.current - shown) * (1 - Math.exp(-dt / 0.32))
      const signed = shown - prev
      if (Math.abs(signed) > 1e-4) dirRef.current = signed > 0 ? 1 : -1
      else dirRef.current = 0
      const vel = Math.abs(signed) / Math.max(dt, 1e-4)
      const speed = Math.min(1, vel * SPEED_SCALE)
      speedRef.current = speed
      const accel = Math.max(0, speed - lastSpeed)
      lastSpeed = speed
      slipRef.current = Math.max(slipRef.current * SLIP_DECAY, Math.min(1, accel * SLIP_SCALE))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const cancelTween = () => {
    if (tweenRef.current) cancelAnimationFrame(tweenRef.current)
    tweenRef.current = 0
  }

  const goTo = (i: number) => {
    const m = metrics()
    if (!m) return
    const clamped = Math.min(count - 1, Math.max(0, i))
    const to = m.top + STOP_PROGRESS[clamped] * m.scrollable
    const from = window.scrollY
    cancelTween()
    if (Math.abs(to - from) < 1) return
    // Long eased tween (vs native ~400ms) so progress crawls the seam and the warp reads as one push.
    // Slowed per feedback ("transitions too fast") — the seam beat now has room to breathe.
    const DURATION = 3000
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      window.scrollTo(0, from + (to - from) * eased)
      tweenRef.current = t < 1 ? requestAnimationFrame(step) : 0
    }
    tweenRef.current = requestAnimationFrame(step)
  }

  // wrap so the drive loops (last → first, first → last)
  const next = () => goTo((activeIndex + 1) % count)
  const prev = () => goTo((activeIndex - 1 + count) % count)

  // A real wheel/touch gesture hands control back to the user (scrollTo never fires these).
  useEffect(() => {
    const takeover = () => cancelTween()
    window.addEventListener('wheel', takeover, { passive: true })
    window.addEventListener('touchstart', takeover, { passive: true })
    return () => {
      window.removeEventListener('wheel', takeover)
      window.removeEventListener('touchstart', takeover)
      cancelTween()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // pause autoplay on any manual wheel/touch
  useEffect(() => {
    if (!playing) return
    const pause = () => setPlaying(false)
    window.addEventListener('wheel', pause, { passive: true })
    window.addEventListener('touchstart', pause, { passive: true })
    return () => {
      window.removeEventListener('wheel', pause)
      window.removeEventListener('touchstart', pause)
    }
  }, [playing])

  // autoplay: advance to next stop on a timer
  useEffect(() => {
    if (!playing) return
    // Skip ticks while the hero is off-screen — wheel/touch pause autoplay, but
    // scrollbar/keyboard scrolling doesn't fire those, and without the bar the
    // user has no way to stop the tween scroll-jacking the page below.
    const heroInView = () => {
      const el = wrapRef.current
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < window.innerHeight
    }
    const id = window.setInterval(() => {
      if (!playingRef.current || !heroInView()) return
      // No wrap: tweening back through the whole page replays every seam in
      // reverse and fights region streaming — the story simply ends at the
      // last stop (present day) and hands scroll back to the visitor.
      const cur = activeIndexRef.current
      if (cur >= count - 1) {
        setPlaying(false)
        return
      }
      goTo(cur + 1)
    }, 6200)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, count])

  const togglePlay = () => {
    if (!playing && activeIndex >= count - 1) goTo(0)
    setPlaying((p) => !p)
  }

  return { progressRef, speedRef, slipRef, dirRef, activeIndex, playing, goTo, next, prev, togglePlay }
}

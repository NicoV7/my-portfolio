'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

const IDLE = '/audio/engine.mp3'
const IGNITION = '/audio/ignition.mp3'
const GEARSHIFT = '/audio/gearshift.mp3'
const SCREECH = '/audio/tire-screech.mp3'

const GEAR_THRESHOLDS = [0.2, 0.45, 0.7]
const SCREECH_AT = 0.45
// forward-launch rev: fires when the drive lurches FORWARD (dir > 0) hard enough
const LAUNCH_AT = 0.32

/**
 * Layered engine sound design driven by drive speed + launch slip: ignition →
 * idle bed (pitch/volume ∝ speed) → gear-shift blips on rising speed thresholds
 * → tire screech on a slip spike. Gesture-gated (starts on the toggle), mute via
 * the same toggle, off under reduced-motion. Missing clips degrade gracefully;
 * the idle bed falls back to a Web-Audio synth.
 */
export function useEngineAudio(
  speedRef: RefObject<number>,
  slipRef: RefObject<number>,
  dirRef: RefObject<number>,
  enabled: boolean
): { soundOn: boolean; toggle: () => void } {
  const [soundOn, setSoundOn] = useState(false)
  const bus = useRef<Bus | null>(null)

  useEffect(() => {
    if (!enabled) return
    const b = createBus()
    bus.current = b
    return () => {
      b.stop()
      bus.current = null
    }
  }, [enabled])

  useEffect(() => {
    if (!soundOn) return
    let raf = 0
    const tick = () => {
      bus.current?.update(
        clamp01(speedRef.current ?? 0),
        clamp01(slipRef.current ?? 0),
        dirRef.current ?? 0
      )
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [soundOn, speedRef, slipRef, dirRef])

  const toggle = () => {
    const b = bus.current
    if (!b) return
    if (soundOn) {
      b.stop()
      setSoundOn(false)
    } else {
      b.start().then((ok) => setSoundOn(ok))
    }
  }

  return { soundOn, toggle }
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

interface Bus {
  start: () => Promise<boolean>
  stop: () => void
  update: (speed: number, slip: number, dir: number) => void
}

function createBus(): Bus {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') {
    return { start: async () => false, stop() {}, update() {} }
  }

  const idle = clip(IDLE, true)
  const ignition = clip(IGNITION, false)
  const gear = clip(GEARSHIFT, false)
  const screech = clip(SCREECH, false)
  let idleOk = false
  idle.addEventListener('canplaythrough', () => (idleOk = true), { once: true })

  let synth: Synth | null = null
  let gearIndex = 0
  let lastSlip = 0
  let lastLaunchSlip = 0
  let lastGearAt = 0
  let lastScreechAt = 0
  let lastRevAt = 0

  // shared Web-Audio context for the synth rev-up (no sample needed)
  let audioCtx: AudioContext | null = null
  const getCtx = (): AudioContext | null => {
    if (audioCtx) return audioCtx
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return null
    audioCtx = new Ctx()
    return audioCtx
  }

  /** A short synth "vroom": twin saws sweep RPM up then blip back down. */
  const rev = (power: number) => {
    const ctx = getCtx()
    if (!ctx) return
    void ctx.resume()
    const t = ctx.currentTime
    const g = ctx.createGain()
    g.gain.value = 0
    g.connect(ctx.destination)
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 1100 + power * 2800
    lp.connect(g)
    const f0 = 72
    const f1 = 72 + power * 300
    const oscs = [0, 9].map((detune) => {
      const o = ctx.createOscillator()
      o.type = 'sawtooth'
      o.detune.value = detune
      o.frequency.setValueAtTime(f0, t)
      o.frequency.exponentialRampToValueAtTime(f1, t + 0.22)
      o.frequency.exponentialRampToValueAtTime(f0 * 1.35, t + 0.62)
      o.connect(lp)
      return o
    })
    const vol = 0.12 + power * 0.2
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.05)
    g.gain.setTargetAtTime(0, t + 0.3, 0.16)
    oscs.forEach((o) => {
      o.start(t)
      o.stop(t + 0.72)
    })
  }

  const now = () => performance.now()
  const fire = (a: HTMLAudioElement | null, capMs?: number) => {
    if (!a) return
    try {
      a.currentTime = 0
      void a.play()
      if (capMs) window.setTimeout(() => a.pause(), capMs)
    } catch {
      /* not ready */
    }
  }

  return {
    async start() {
      fire(ignition)
      const beginIdle = () => {
        if (idleOk) {
          idle.volume = 0.22
          void idle.play().catch(() => startSynth())
        } else {
          startSynth()
        }
      }
      // let the starter crank breathe before the idle bed comes in
      window.setTimeout(beginIdle, ignition ? 900 : 0)
      return true
    },
    stop() {
      idle.pause()
      synth?.stop()
    },
    update(speed, slip, dir) {
      if (idleOk && !idle.paused) {
        idle.playbackRate = 0.72 + speed * 1.05
        idle.volume = 0.22 + speed * 0.4
      }
      synth?.update(speed)

      const gi = GEAR_THRESHOLDS.filter((t) => speed >= t).length
      if (gi > gearIndex && now() - lastGearAt > 260) {
        fire(gear, 650)
        lastGearAt = now()
      }
      gearIndex = gi

      // rev-up "take off" when the drive lurches FORWARD hard (rising edge, throttled)
      const launch = dir > 0 ? slip : 0
      if (launch >= LAUNCH_AT && lastLaunchSlip < LAUNCH_AT && now() - lastRevAt > 650) {
        rev(Math.min(1, speed + slip))
        lastRevAt = now()
      }
      lastLaunchSlip = launch

      if (slip >= SCREECH_AT && lastSlip < SCREECH_AT && now() - lastScreechAt > 500) {
        fire(screech)
        lastScreechAt = now()
      }
      lastSlip = slip
    },
  }

  function startSynth() {
    if (synth) return
    synth = createSynth()
    synth.start()
  }
}

function clip(src: string, loop: boolean): HTMLAudioElement {
  const a = new Audio(src)
  a.loop = loop
  a.preload = 'auto'
  a.volume = loop ? 0 : 0.7
  return a
}

interface Synth {
  start: () => boolean
  stop: () => void
  update: (speed: number) => void
}

/** Sawtooth + sub → a coarse V8-ish idle that revs with speed (idle fallback). */
function createSynth(): Synth {
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return { start: () => false, stop() {}, update() {} }
  const ctx = new Ctx()
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 900
  lp.connect(master)
  const oscs = [0, 6].map((detune) => {
    const o = ctx.createOscillator()
    o.type = 'sawtooth'
    o.frequency.value = 60
    o.detune.value = detune
    o.connect(lp)
    return o
  })

  return {
    start() {
      ctx.resume()
      oscs.forEach((o) => o.start())
      master.gain.setTargetAtTime(0.16, ctx.currentTime, 0.2)
      return true
    },
    stop() {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.15)
    },
    update(speed) {
      const base = 55 + speed * 120
      oscs.forEach((o) => (o.frequency.value = base))
      lp.frequency.value = 700 + speed * 2600
      master.gain.setTargetAtTime(0.14 + speed * 0.14, ctx.currentTime, 0.08)
    },
  }
}

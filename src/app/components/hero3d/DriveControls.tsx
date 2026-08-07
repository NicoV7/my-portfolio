'use client'

import { milestones } from '../../../data/milestones'

interface Props {
  activeIndex: number
  playing: boolean
  soundOn: boolean
  onPrev: () => void
  onNext: () => void
  onGoTo: (i: number) => void
  onTogglePlay: () => void
  onToggleSound: () => void
}

/** Prev / play-pause / next + progress dots + engine-sound toggle. */
export default function DriveControls({
  activeIndex,
  playing,
  soundOn,
  onPrev,
  onNext,
  onGoTo,
  onTogglePlay,
  onToggleSound,
}: Props) {
  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-6 z-30 flex items-center justify-center gap-5 px-6 md:bottom-8">
      <button
        onClick={onPrev}
        className="font-mono text-xs uppercase tracking-[0.18em] text-silver transition-colors hover:text-white-soft"
        aria-label="Previous stop"
      >
        ‹ Prev
      </button>

      <button
        onClick={onTogglePlay}
        className="rounded-[var(--radius-pill)] border border-accent/40 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-all hover:bg-accent/10"
      >
        {playing ? '❚❚ Pause' : '▶ Drive'}
      </button>

      <div className="hidden items-center gap-2 sm:flex">
        {milestones.map((m, i) => (
          <button
            key={m.id}
            onClick={() => onGoTo(i)}
            aria-label={`Go to ${m.company}`}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex
                ? 'w-6 bg-accent'
                : 'w-1.5 bg-chrome-line hover:bg-silver'
            }`}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        className="font-mono text-xs uppercase tracking-[0.18em] text-silver transition-colors hover:text-white-soft"
        aria-label="Next stop"
      >
        Next ›
      </button>

      <button
        onClick={onToggleSound}
        className={`font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
          soundOn ? 'text-accent' : 'text-silver hover:text-white-soft'
        }`}
        aria-label={soundOn ? 'Mute engine' : 'Enable engine sound'}
        title={soundOn ? 'Mute engine' : 'Engine sound'}
      >
        {soundOn ? '♪ On' : '♪ Sound'}
      </button>
    </div>
  )
}

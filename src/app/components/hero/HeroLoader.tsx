'use client'

/** Branded loader / poster: black void + chrome wordmark shimmer. */
export default function HeroLoader() {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-void">
      <div className="text-center">
        <div className="chrome-text font-mono text-lg tracking-[0.4em]">
          NICO&nbsp;VEGA
        </div>
        <div className="mx-auto mt-4 h-px w-40 overflow-hidden bg-chrome-line">
          <div className="shimmer h-full w-full" />
        </div>
        <p className="mt-4 font-mono text-xs tracking-[0.25em] text-silver">
          COMPOSING THE SCENE…
        </p>
      </div>
    </div>
  )
}

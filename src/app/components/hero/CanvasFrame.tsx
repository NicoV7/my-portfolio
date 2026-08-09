'use client'

import { motion } from 'framer-motion'

const BONE = '#efe8d8'

/**
 * Editorial "museum canvas" overlay: a hairline frame with crop marks plus
 * faint golden-ratio construction lines, like a da Vinci study sketch laid
 * over the painting. Static — sits above the WebGL canvas (z-10), below the
 * transition + text layers (z-20/30).
 */
export default function CanvasFrame() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease: 'easeOut', delay: 0.4 }}
    >
      {/* Golden-ratio construction lines + Fibonacci spiral hint */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <g stroke={BONE} strokeOpacity={0.06}>
          <line x1="38.2" y1="0" x2="38.2" y2="100" vectorEffect="non-scaling-stroke" />
          <line x1="61.8" y1="0" x2="61.8" y2="100" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="38.2" x2="100" y2="38.2" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="61.8" x2="100" y2="61.8" vectorEffect="non-scaling-stroke" />
          {/* Quarter-circle arcs of decreasing radius — golden spiral hint */}
          <path
            d="M 0 61.8 A 61.8 61.8 0 0 1 61.8 0"
            strokeOpacity={0.08}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 61.8 0 A 38.2 38.2 0 0 1 100 38.2"
            strokeOpacity={0.07}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 100 38.2 A 23.6 23.6 0 0 1 76.4 61.8"
            strokeOpacity={0.06}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      {/* Hairline canvas frame, centered over the car */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'clamp(16rem, 30vw, 34rem)',
          height: '55vh',
          border: `1px solid ${BONE}59`, // ~35% bone hairline
        }}
      >
        {/* Crop-mark ticks extending past each corner */}
        {(
          [
            ['top', 'left'],
            ['top', 'right'],
            ['bottom', 'left'],
            ['bottom', 'right'],
          ] as const
        ).map(([v, h]) => (
          <span key={`${v}-${h}`}>
            <span
              className="absolute"
              style={{
                [v]: '-1px',
                [h]: '-16px',
                width: '11px',
                height: '1px',
                background: `${BONE}66`,
              }}
            />
            <span
              className="absolute"
              style={{
                [h]: '-1px',
                [v]: '-16px',
                width: '1px',
                height: '11px',
                background: `${BONE}66`,
              }}
            />
          </span>
        ))}
      </div>
    </motion.div>
  )
}

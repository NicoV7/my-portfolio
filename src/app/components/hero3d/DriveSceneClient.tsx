'use client'

import { Suspense, useRef, type RefObject } from 'react'
import { Color } from 'three'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import Rig from './Rig'
import LevelLighting from './LevelLighting'
import LevelManager from './LevelManager'
import CarEnvironment from './StudioLighting'
import Transitions from './Transitions'
import Road from './Road'
import Destinations from './Destinations'
import Car from './Car'
import TireFX from './TireFX'
import Effects from './Effects'
import type { CarState } from './carState'

/** The WebGL scene. Mounted client-only (ssr:false) by HeroDrive. */
export default function DriveSceneClient({
  progressRef,
  speedRef,
  slipRef,
  carStateRef,
  timeLapseRef,
  activeIndex,
  mobile,
}: {
  progressRef: RefObject<number>
  speedRef: RefObject<number>
  slipRef: RefObject<number>
  carStateRef: RefObject<CarState>
  timeLapseRef: RefObject<number>
  activeIndex: number
  mobile: boolean
}) {
  const nightRef = useRef(0)
  const groundColorRef = useRef(new Color('#0a0d16'))

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, mobile ? 1.5 : 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <LevelLighting
          progressRef={progressRef}
          timeLapseRef={timeLapseRef}
          nightRef={nightRef}
          groundColorRef={groundColorRef}
        />
        <CarEnvironment />
        <Rig progressRef={progressRef} speedRef={speedRef} timeLapseRef={timeLapseRef} />
        <Road mobile={mobile} nightRef={nightRef} groundColorRef={groundColorRef} />
        <Transitions />
        {/* stateful level streaming: only the active (±1) level is mounted */}
        <LevelManager activeIndex={activeIndex} />
        <Destinations activeIndex={activeIndex} />
        <Car
          progressRef={progressRef}
          speedRef={speedRef}
          slipRef={slipRef}
          carStateRef={carStateRef}
          nightRef={nightRef}
        />
        <TireFX carStateRef={carStateRef} slipRef={slipRef} mobile={mobile} />
        <ContactShadows position={[5, 0.012, 0]} opacity={0.45} scale={90} blur={2.8} far={14} color="#000000" />
        {!mobile && <Effects />}
      </Suspense>
    </Canvas>
  )
}

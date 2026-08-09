'use client'

import * as THREE from 'three'
import { Suspense, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { curve, progressToT } from './curve'
import CarModel from './CarModel'
import type { CarState } from './carState'

/**
 * Drives the hero car along the road curve. The visible car is a real W204 C63
 * GLB (CarModel); follow logic sets position + heading from the shared curve.
 */
export default function Car({
  progressRef,
  speedRef,
  slipRef,
  carStateRef,
  nightRef,
}: {
  progressRef: RefObject<number>
  speedRef?: RefObject<number>
  slipRef?: RefObject<number>
  carStateRef?: RefObject<CarState>
  nightRef?: RefObject<number>
}) {
  const group = useRef<THREE.Group>(null)
  const shown = useRef({ v: 0 })
  const tmpPos = useRef(new THREE.Vector3())
  const tmpTan = useRef(new THREE.Vector3())

  useFrame((_, dt) => {
    if (!group.current) return
    easing.damp(shown.current, 'v', progressRef.current, 0.3, dt)
    const t = progressToT(shown.current.v)
    curve.getPointAt(t, tmpPos.current)
    curve.getTangentAt(t, tmpTan.current).normalize()
    group.current.position.copy(tmpPos.current)
    group.current.position.y = 0.02
    group.current.rotation.y = Math.atan2(tmpTan.current.x, tmpTan.current.z)

    if (carStateRef?.current) {
      const s = carStateRef.current
      s.x = tmpPos.current.x
      s.z = tmpPos.current.z
      s.tx = tmpTan.current.x
      s.tz = tmpTan.current.z
      s.speed = speedRef?.current ?? 0
    }
  })

  return (
    <group ref={group} dispose={null}>
      <Suspense fallback={null}>
        <CarModel progressRef={progressRef} speedRef={speedRef} slipRef={slipRef} nightRef={nightRef} />
      </Suspense>
    </group>
  )
}

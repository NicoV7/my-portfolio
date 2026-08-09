'use client'

import * as THREE from 'three'
import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { easing } from 'maath'
import { curve, progressToT } from './curve'

const UP = new THREE.Vector3(0, 1, 0)
const { lerp, clamp } = THREE.MathUtils

/**
 * Smooth chase-cam that trails the car with a damped offset + lookAt. Framing
 * blends by "felt" speed: at rest it lifts back to a hero 3/4 shot; at speed it
 * drops low and close, widens FOV, and looks further ahead down the road.
 */
export default function Rig({
  progressRef,
  speedRef,
  timeLapseRef,
}: {
  progressRef: RefObject<number>
  speedRef?: RefObject<number>
  timeLapseRef?: RefObject<number>
}) {
  const cam = useRef<THREE.PerspectiveCamera>(null)
  const shown = useRef({ v: 0 })
  const fov = useRef({ v: 38 })
  const lookAt = useRef(new THREE.Vector3())
  const carPos = useRef(new THREE.Vector3())
  const tan = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const offset = useRef(new THREE.Vector3())
  const aim = useRef(new THREE.Vector3())
  const zoom = useRef(new THREE.Vector3())

  useFrame((state, dt) => {
    if (!cam.current) return
    easing.damp(shown.current, 'v', progressRef.current, 0.35, dt)
    const t = progressToT(shown.current.v)
    curve.getPointAt(t, carPos.current)
    curve.getTangentAt(t, tan.current).normalize()

    const s = clamp(speedRef?.current ?? 0, 0, 1)
    const yaw = Math.atan2(tan.current.x, tan.current.z)

    const tl = timeLapseRef?.current ?? 0
    // eased warp envelope so the beat has weight (long dramatic push), not a spike
    const warp = tl * tl * (3 - 2 * tl)

    offset.current.set(lerp(-5.6, -4.2, s), lerp(3.3, 1.95, s), lerp(7.6, 6.1, s))
    desired.current.copy(offset.current).applyAxisAngle(UP, yaw).add(carPos.current)
    desired.current.y = lerp(3.3, 1.95, s)
    easing.damp3(cam.current.position, desired.current.toArray(), 0.42, dt)

    // Persona-5 "zoom into the car": at a seam, dolly the camera toward a point
    // just above the car so it fills frame under the slash panels, then settle.
    if (warp > 0.001) {
      zoom.current.copy(carPos.current)
      zoom.current.y += 0.9
      cam.current.position.lerp(zoom.current, warp * 0.32)
    }

    // look ahead down the road as speed rises
    aim.current
      .copy(tan.current)
      .multiplyScalar(lerp(0.5, 7, s))
      .add(carPos.current)
    aim.current.y = lerp(0.85, 0.55, s)
    easing.damp3(lookAt.current, aim.current.toArray(), 0.3, dt)
    cam.current.lookAt(lookAt.current)

    // warp: punch the FOV wider at a seam (held by the eased envelope), settling
    // as the beat falls off.
    easing.damp(fov.current, 'v', lerp(36, 46, s), 0.4, dt)
    const targetFov = fov.current.v + warp * 13
    if (Math.abs(cam.current.fov - targetFov) > 0.01) {
      cam.current.fov = targetFov
      cam.current.updateProjectionMatrix()
    }

    // ...and a small decaying positional shake — applied after lookAt/damp so it
    // reads as a lunge, not a smoothed drift. Softened so the long warp doesn't jitter.
    if (warp > 0.001) {
      const et = state.clock.elapsedTime
      const amp = warp * 0.1
      cam.current.position.x += Math.sin(et * 55) * amp
      cam.current.position.y += Math.cos(et * 49) * amp * 0.6
    }
  })

  return (
    <PerspectiveCamera ref={cam} makeDefault fov={38} position={[-12, 3, 9]} near={0.1} far={400} />
  )
}

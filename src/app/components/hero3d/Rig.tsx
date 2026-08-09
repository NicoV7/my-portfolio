'use client'

import * as THREE from 'three'
import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { easing } from 'maath'
import { curve, progressToT } from './curve'

const { lerp } = THREE.MathUtils

// straight-overhead map height — sets how much of the route is in view
const H = 20

/**
 * Straight-overhead top-down MAP camera: sits directly above the car looking
 * straight down, so the path reads as a ribbon on the white canvas and the car is
 * a marker driving it. Heading-up — the up-vector tracks the travel tangent so the
 * car points to the top of screen and the route flows downward. A straight-down
 * view gimbals without an explicit up-vector, hence `cam.up` is set every frame.
 */
export default function Rig({
  progressRef,
  timeLapseRef,
}: {
  progressRef: RefObject<number>
  speedRef?: RefObject<number>
  timeLapseRef?: RefObject<number>
}) {
  const cam = useRef<THREE.PerspectiveCamera>(null)
  const shown = useRef({ v: 0 })
  const carPos = useRef(new THREE.Vector3())
  const tan = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())
  const up = useRef(new THREE.Vector3(0, 0, -1))
  const upTarget = useRef(new THREE.Vector3(0, 0, -1))

  useFrame((_, dt) => {
    if (!cam.current) return
    easing.damp(shown.current, 'v', progressRef.current, 0.35, dt)
    const t = progressToT(shown.current.v)
    curve.getPointAt(t, carPos.current)
    curve.getTangentAt(t, tan.current).normalize()

    // light punch-in at a seam; the DOM DriveTransition beat carries the rest
    const tl = timeLapseRef?.current ?? 0
    const warp = tl * tl * (3 - 2 * tl)
    const h = lerp(H, H * 0.82, warp)

    desired.current.set(carPos.current.x, carPos.current.y + h, carPos.current.z)
    easing.damp3(cam.current.position, desired.current.toArray(), 0.4, dt)

    upTarget.current.set(tan.current.x, 0, tan.current.z).normalize()
    up.current.lerp(upTarget.current, 1 - Math.exp(-dt / 0.25)).normalize()
    cam.current.up.copy(up.current)
    cam.current.lookAt(carPos.current)
  })

  return <PerspectiveCamera ref={cam} makeDefault fov={40} position={[0, H, 0]} near={0.1} far={400} />
}

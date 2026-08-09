'use client'

import * as THREE from 'three'
import { useEffect, type RefObject } from 'react'
import { useThree } from '@react-three/fiber'
import { roadColorRef } from './Road'

const BG = '#f4f3ef'

/**
 * Single nearly-white studio environment (replaces the old 6-level day/night
 * blend). The path is the only real feature; distance fog dissolves it into the
 * white canvas. Night is pinned off — a white world has no night, so the car's
 * night-gated emissive/headlights stay dormant.
 */
export default function LevelLighting({
  nightRef,
  groundColorRef,
}: {
  progressRef?: RefObject<number>
  timeLapseRef?: RefObject<number>
  nightRef?: RefObject<number>
  groundColorRef?: RefObject<THREE.Color>
}) {
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)

  useEffect(() => {
    scene.background = new THREE.Color(BG)
    // fog to the same white → the path fades into an infinite white canvas
    scene.fog = new THREE.Fog(BG, 45, 240)
    gl.toneMappingExposure = 1.0
    if (nightRef) nightRef.current = 0
    groundColorRef?.current?.set('#efeee9')
    roadColorRef.current.set('#d9d6d1')
  }, [scene, gl, nightRef, groundColorRef])

  return (
    <>
      <hemisphereLight args={['#ffffff', '#e9e7df', 1.15]} />
      <ambientLight intensity={0.45} />
      {/* soft key for gentle form + a consistent shadow direction */}
      <directionalLight position={[9, 15, 7]} intensity={1.5} color="#fff6ea" />
      {/* cool fill from the far side so the shadowed flank isn't dead */}
      <directionalLight position={[-10, 8, -6]} intensity={0.5} color="#e6ecff" />
    </>
  )
}

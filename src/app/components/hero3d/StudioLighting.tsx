'use client'

import { Environment, Lightformer } from '@react-three/drei'

/**
 * Reflection-only environment for the car's clearcoat + glass. BiomeDriver owns
 * every scene light (hemisphere / key / rim / ambient / Sky), so this contributes
 * NO direct lighting — `background={false}` and it exists purely to give the white
 * paint and chrome something to reflect. Without it the clearcoat mirrors a flat
 * background colour and the car reads matte/dead, worst at night. Procedural
 * Lightformers only — no external HDRI, stays offline. Kept deliberately neutral
 * (warm key + cool fill + soft overhead) so the reflections read across both the
 * daytime and night regions.
 */
export default function CarEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      {/* warm key */}
      <Lightformer form="rect" intensity={2} position={[-12, 10, -8]} scale={[20, 7, 1]} color="#ffe6c2" />
      {/* cool fill */}
      <Lightformer form="rect" intensity={1.4} position={[12, 7, 8]} scale={[14, 8, 1]} color="#a9c8ff" />
      {/* soft overhead — catches a highlight along the roof/hood */}
      <Lightformer
        form="rect"
        intensity={1.1}
        position={[0, 13, 2]}
        scale={[18, 5, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#ffffff"
      />
      {/* dim underlight so the lower body/wheels aren't a black void */}
      <Lightformer form="rect" intensity={0.4} position={[0, -6, 4]} scale={[16, 4, 1]} color="#3a4a66" />
    </Environment>
  )
}

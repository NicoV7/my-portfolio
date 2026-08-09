'use client'

import { EffectComposer, Bloom, BrightnessContrast } from '@react-three/postprocessing'

/**
 * Minimal grade for the white world. The old night pass (heavy bloom + vignette +
 * F&F contrast + chromatic aberration) darkened the corners and blew out the pale
 * ground; here bloom only catches the brightest specular highlights and a hair of
 * contrast keeps the car from going milky. No vignette — white corners stay clean.
 */
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.3} luminanceThreshold={1.0} luminanceSmoothing={0.2} />
      <BrightnessContrast brightness={0} contrast={0.06} />
    </EffectComposer>
  )
}

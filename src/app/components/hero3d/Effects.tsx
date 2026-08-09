'use client'

import { Vector2 } from 'three'
import {
  EffectComposer,
  Bloom,
  Vignette,
  HueSaturation,
  BrightnessContrast,
  ChromaticAberration,
} from '@react-three/postprocessing'

// Static offset for the F&F-grade chromatic fringing (animating effect refs
// crashes R3F here, so this stays fixed).
const CA_OFFSET = new Vector2(0.0007, 0.0012)

/**
 * Postprocessing — heavier bloom so neon/chrome actually glow at night, a
 * cinematic F&F color grade (punchier contrast + saturation + subtle chromatic
 * aberration) + vignette. All static: animating effect refs crashes R3F here.
 * No <ToneMapping> effect: the renderer's own tone-mapping (exposure driven by
 * BiomeDriver) is the single tone-map — a second one here double-mapped and
 * washed the grade.
 */
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.8} luminanceThreshold={0.82} luminanceSmoothing={0.3} />
      <ChromaticAberration offset={CA_OFFSET} radialModulation={false} modulationOffset={0} />
      <HueSaturation saturation={0.16} />
      <BrightnessContrast brightness={-0.01} contrast={0.14} />
      <Vignette eskil={false} offset={0.28} darkness={0.5} />
    </EffectComposer>
  )
}

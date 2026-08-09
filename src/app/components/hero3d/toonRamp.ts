import * as THREE from 'three'

/**
 * Gouache toon ramps.
 *
 * WHY: `MeshToonMaterial` quantizes its diffuse lighting through a tiny
 * `gradientMap` texture — with the default 2–3 texel maps you get hard
 * cel-shading bands. Feeding it a *smooth multi-stop ramp* instead melts the
 * banding into soft gradient shading: the matte "gouache / Monument Valley"
 * look, where light rolls gently across a surface (and shadows pick up the
 * ramp's tint — mauve at dawn, indigo at night) without ever reading as
 * glossy PBR.
 *
 * Stops are treated as sRGB and interpolated in sRGB channel space (the
 * texture is tagged `SRGBColorSpace` so the shader decodes it correctly), so
 * the ramp you author is the ramp you see.
 */

const CACHE = new Map<string, THREE.DataTexture>()

const WIDTH = 64

/** Parse '#rrggbb' to raw sRGB byte channels (no color-management transform). */
function hexBytes(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/**
 * Build (and cache) a horizontal 64×1 gradient texture smoothly interpolating
 * the given sRGB color stops, for use as `MeshToonMaterial.gradientMap`.
 */
export function makeRamp(stops: string[]): THREE.DataTexture {
  const key = stops.join('|')
  const hit = CACHE.get(key)
  if (hit) return hit

  const cols = stops.map(hexBytes)
  const data = new Uint8Array(WIDTH * 4)
  for (let i = 0; i < WIDTH; i++) {
    const f = (i / (WIDTH - 1)) * (cols.length - 1)
    const i0 = Math.min(Math.floor(f), cols.length - 2)
    const t = f - i0
    const a = cols[i0]
    const b = cols[i0 + 1]
    data[i * 4] = Math.round(a[0] + (b[0] - a[0]) * t)
    data[i * 4 + 1] = Math.round(a[1] + (b[1] - a[1]) * t)
    data[i * 4 + 2] = Math.round(a[2] + (b[2] - a[2]) * t)
    data[i * 4 + 3] = 255
  }
  const tex = new THREE.DataTexture(data, WIDTH, 1, THREE.RGBAFormat)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearFilter
  tex.generateMipmaps = false
  tex.needsUpdate = true
  CACHE.set(key, tex)
  return tex
}

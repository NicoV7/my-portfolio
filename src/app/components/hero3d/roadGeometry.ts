import * as THREE from 'three'

/**
 * Geometry helpers that turn the shared `curve` (a flat CatmullRom on the y=0
 * plane) into a real highway: an asphalt ribbon, offset lane/edge lines, dashed
 * center markings, and guardrail paths. All strips are flat (normals = +Y) since
 * the road lives on y=0; the road heading uses the same +Z-forward convention as
 * the car (right vector = (t.z, 0, -t.x) for a unit tangent t).
 */

export interface Samples {
  points: THREE.Vector3[]
  tangents: THREE.Vector3[]
}

/** Even (arc-length) samples of a curve over t∈[0,1]. */
export function sampleCurve(curve: THREE.Curve<THREE.Vector3>, count: number): Samples {
  const points: THREE.Vector3[] = []
  const tangents: THREE.Vector3[] = []
  for (let i = 0; i <= count; i++) {
    const t = i / count
    points.push(curve.getPointAt(t))
    tangents.push(curve.getTangentAt(t).normalize())
  }
  return { points, tangents }
}

/** Horizontal right-hand normal of a unit tangent, in the XZ plane. */
function rightOf(t: THREE.Vector3): [number, number] {
  return [t.z, -t.x]
}

/** Flat triangle-strip ribbon of half-width `halfWidth` centered on `points`, at height y. */
export function buildStrip(
  { points, tangents }: Samples,
  halfWidth: number,
  y: number,
  uvTile = 6
): THREE.BufferGeometry {
  const n = points.length
  const pos = new Float32Array(n * 2 * 3)
  const uv = new Float32Array(n * 2 * 2)
  const nor = new Float32Array(n * 2 * 3)
  const idx: number[] = []
  let dist = 0

  for (let i = 0; i < n; i++) {
    const p = points[i]
    const [rx, rz] = rightOf(tangents[i])
    if (i > 0) dist += p.distanceTo(points[i - 1])

    const b = i * 6
    pos[b] = p.x - rx * halfWidth
    pos[b + 1] = y
    pos[b + 2] = p.z - rz * halfWidth
    pos[b + 3] = p.x + rx * halfWidth
    pos[b + 4] = y
    pos[b + 5] = p.z + rz * halfWidth

    nor[b + 1] = 1
    nor[b + 4] = 1

    const u = i * 4
    const v = dist / uvTile
    uv[u] = 0
    uv[u + 1] = v
    uv[u + 2] = 1
    uv[u + 3] = v

    if (i < n - 1) {
      const a = i * 2
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
  g.setIndex(idx)
  return g
}

/** Samples shifted `dist` along the right normal (negative = left), tangents kept. */
export function offsetSamples({ points, tangents }: Samples, dist: number): Samples {
  return {
    tangents,
    points: points.map((p, i) => {
      const [rx, rz] = rightOf(tangents[i])
      return new THREE.Vector3(p.x + rx * dist, p.y, p.z + rz * dist)
    }),
  }
}

/** Merged geometry of dashed center-line quads following the path. */
export function buildDashes(
  { points, tangents }: Samples,
  { halfWidth = 0.12, y = 0.02, dash = 2.2, gap = 3.2 } = {}
): THREE.BufferGeometry {
  const period = dash + gap
  const pos: number[] = []
  const nor: number[] = []
  const idx: number[] = []
  let dist = 0
  let v = 0

  const on = (d: number) => d % period < dash
  for (let i = 0; i < points.length - 1; i++) {
    if (i > 0) dist += points[i].distanceTo(points[i - 1])
    if (!on(dist)) continue
    const a = points[i]
    const b = points[i + 1]
    const [ax, az] = rightOf(tangents[i])
    const [bx, bz] = rightOf(tangents[i + 1])
    const base = v
    pos.push(
      a.x - ax * halfWidth, y, a.z - az * halfWidth,
      a.x + ax * halfWidth, y, a.z + az * halfWidth,
      b.x - bx * halfWidth, y, b.z - bz * halfWidth,
      b.x + bx * halfWidth, y, b.z + bz * halfWidth
    )
    for (let k = 0; k < 4; k++) nor.push(0, 1, 0)
    idx.push(base, base + 2, base + 1, base + 1, base + 2, base + 3)
    v += 4
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  g.setIndex(idx)
  return g
}

/** A CatmullRom through the given samples raised to height y — for guardrail tubes. */
export function railCurve({ points }: Samples, y: number): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(p.x, y, p.z)),
    false,
    'catmullrom',
    0.5
  )
}

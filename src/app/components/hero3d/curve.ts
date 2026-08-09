import * as THREE from 'three'
import { milestones } from '../../../data/milestones'
import { LEVELS, LEVEL_KEYS, LEVEL_COUNT } from './levels'

/**
 * Shared drive path for the road-trip. One long winding curve on the y=0 plane,
 * built by concatenating each LEVEL's control-point segment (so the car/camera
 * see a single continuous curve) and split into `LEVEL_COUNT` equal progress
 * bands — one themed level per band, one milestone per band. Single source of
 * truth for car, camera, road, scenery and markers.
 */
const controlPoints = LEVELS.flatMap((l) => l.controlPoints).map(
  ([x, z]) => new THREE.Vector3(x, 0, z)
)

export const curve = new THREE.CatmullRomCurve3(controlPoints, false, 'catmullrom', 0.5)

export const STOP_COUNT = milestones.length // 6

const T_MIN = 0.05
const T_MAX = 0.95

export function progressToT(p: number): number {
  const c = Math.min(1, Math.max(0, p))
  return T_MIN + (T_MAX - T_MIN) * c
}

/** Region keys / bands are the level keys, in order. */
export const REGION_KEYS = LEVEL_KEYS
export type RegionKey = (typeof LEVEL_KEYS)[number]

/** `LEVEL_COUNT` equal progress bands, in order, matching levels.ts. */
export const REGIONS = LEVEL_KEYS.map((key, i) => ({
  key,
  index: i,
  pStart: i / LEVEL_COUNT,
  pEnd: (i + 1) / LEVEL_COUNT,
  pMid: (i + 0.5) / LEVEL_COUNT,
}))

/** progress values of the seams between levels (fade-to-black + tunnel moments). */
export const BORDERS = REGIONS.slice(1).map((r) => r.pStart)

/**
 * progress at which each stop is centered — the interior of its own level band
 * (borders are the i/LEVEL_COUNT seams), so no stop parks in a fade-to-black.
 */
export const STOP_PROGRESS = REGIONS.map((r) => r.pMid).slice(0, STOP_COUNT)
export const STOP_TS = STOP_PROGRESS.map(progressToT)
export const STOP_POSITIONS = STOP_TS.map((t) => curve.getPointAt(t))

/** world position at a progress value (0..1). */
export function positionAtProgress(p: number, target = new THREE.Vector3()): THREE.Vector3 {
  return curve.getPointAt(progressToT(p), target)
}

/** Live car pose shared from Car (writer) to TireFX/camera (readers) via a ref. */
export interface CarState {
  x: number
  z: number
  tx: number // unit tangent x (heading)
  tz: number
  speed: number
}

export function makeCarState(): CarState {
  return { x: 0, z: 0, tx: 0, tz: 1, speed: 0 }
}

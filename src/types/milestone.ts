import type { Metric } from './experience'

/**
 * A stop on the 3D career drive. Display content only —
 * scene geometry (path + marker positions) lives in
 * src/app/components/hero3d/curve.ts, joined by array order.
 */
export interface Milestone {
  /** matches ExperienceItem.milestoneId where applicable */
  id: string
  /** drive order, 0 = first stop the car reaches */
  order: number
  /** short marquee label shown in-world / on the marker, e.g. "AMBRA" */
  label: string
  year: string
  company: string
  role: string
  /** one-line impact shown on arrival */
  impact: string
  metrics?: Metric[]
}

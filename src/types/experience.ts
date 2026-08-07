export interface Metric {
  value: string
  label: string
}

export interface ExperienceItem {
  id: string
  company: string
  role: string
  location?: string
  /** ISO-ish 'YYYY-MM' */
  startDate: string
  /** undefined = present */
  endDate?: string
  /** short display range, e.g. "Jul 2026 — Present" */
  period: string
  summary: string
  highlights: string[]
  metrics?: Metric[]
  tech?: string[]
  url?: string
  /** stable key shared with the 3D drive scene (see data/milestones.ts) */
  milestoneId?: string
  /** reverse-chron display order (0 = most recent) */
  order: number
}

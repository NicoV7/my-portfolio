export type SocialType = 'github' | 'linkedin' | 'email'

export interface Social {
  type: SocialType
  url: string
  handle: string
  label: string
}

export interface SkillGroup {
  name: string
  skills: string[]
}

export interface Highlight {
  title: string
  detail: string
  year: string
}

export interface Profile {
  name: string
  shortName: string
  pronouns: string
  title: string
  tagline: string
  location: string
  /** About-section paragraphs */
  bio: string[]
  education: { school: string; degree: string; note?: string }[]
  stats: { value: string; label: string }[]
  socials: Social[]
  skillGroups: SkillGroup[]
  highlights: Highlight[]
  /** slugs into src/data/projects.ts for the Selected Work section */
  featuredProjectSlugs: string[]
}

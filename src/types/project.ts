export type ProjectStatus = 'completed' | 'in-progress' | 'planned' | 'archived'

export type ProjectCategory = 'web-app' | 'mobile' | 'desktop' | 'library' | 'api' | 'tool' | 'game' | 'graphics' | 'security' | 'AI-ML' | 'other'

export type TechnologyStack = {
  frontend?: string[]
  backend?: string[]
  database?: string[]
  deployment?: string[]
  tools?: string[]
  mobile?: string[]
  other?: string[]
}

export type ProjectImage = {
  url: string
  alt: string
  caption?: string
  type: 'thumbnail' | 'gallery' | 'hero'
}

export type PreviewMedia = {
  url: string
  type: 'video' | 'gif' | 'image'
  fallbackImage?: string
}

export type ProjectLink = {
  type: 'github' | 'live' | 'demo' | 'video' | 'article' | 'figma' | 'other'
  url: string
  label: string
}

export type ProjectFeature = {
  title: string
  description: string
  implemented: boolean
}

export interface Project {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  status: ProjectStatus
  category: ProjectCategory
  featured: boolean
  
  // Dates
  startDate: string
  endDate?: string
  lastUpdated: string
  
  // Technology & Stack
  technologies: TechnologyStack
  primaryTech: string[] // Main technologies to display in cards
  
  // Visual Assets
  images: ProjectImage[]
  heroImage?: string // URL to hero/banner image
  previewMedia?: PreviewMedia // Video/GIF preview for cards
  
  // Links & External Resources
  links: ProjectLink[]
  
  // Project Details
  features: ProjectFeature[]
  challenges?: string[]
  learnings?: string[]
  
  // Metadata
  tags: string[]
  teamSize?: number
  myRole?: string
  clientType?: 'personal' | 'freelance' | 'company' | 'open-source' | 'UC Berkeley'
  
  // SEO & Display
  seoTitle?: string
  seoDescription?: string
  displayOrder: number
}

export type ProjectFilter = {
  category?: ProjectCategory[]
  status?: ProjectStatus[]
  technologies?: string[]
  featured?: boolean
  search?: string
}

export type ProjectSort = 'newest' | 'oldest' | 'alphabetical' | 'featured' | 'status'
export type BlogCategory = 'tutorial' | 'project-deep-dive' | 'tech-insights' | 'career' | 'tools' | 'other'

export type BlogStatus = 'published' | 'draft' | 'archived'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: BlogCategory
  status: BlogStatus
  featured: boolean
  
  // Dates
  publishedAt: string
  updatedAt: string
  
  // Metadata
  tags: string[]
  readingTime: number // in minutes
  author: string
  authorImage?: string
  
  // Visual Assets
  coverImage?: string
  
  // SEO
  seoTitle?: string
  seoDescription?: string
  
  // Engagement
  views?: number
  likes?: number
}

export type BlogFilter = {
  category?: BlogCategory[]
  tags?: string[]
  search?: string
  featured?: boolean
}

export type BlogSort = 'newest' | 'oldest' | 'popular' | 'reading-time'
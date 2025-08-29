import { useState, useMemo } from 'react'
import { projects as allProjects } from '../data/projects'
import { Project, ProjectFilter, ProjectSort } from '../types/project'

export function useProjects() {
  const [filters, setFilters] = useState<ProjectFilter>({})
  const [sort, setSort] = useState<ProjectSort>('featured')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = [...allProjects]

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(search) ||
        project.shortDescription.toLowerCase().includes(search) ||
        project.fullDescription.toLowerCase().includes(search) ||
        project.tags.some(tag => tag.toLowerCase().includes(search)) ||
        project.primaryTech.some(tech => tech.toLowerCase().includes(search)) ||
        Object.values(project.technologies).some(techArray =>
          Array.isArray(techArray) && techArray.some(t => t.toLowerCase().includes(search))
        )
      )
    }

    // Apply category filter
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(project => filters.category!.includes(project.category))
    }

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(project => filters.status!.includes(project.status))
    }

    // Apply technology filter
    if (filters.technologies && filters.technologies.length > 0) {
      filtered = filtered.filter(project =>
        filters.technologies!.some(tech =>
          project.primaryTech.some(pTech => pTech.toLowerCase().includes(tech.toLowerCase())) ||
          Object.values(project.technologies).some(techArray =>
            Array.isArray(techArray) && techArray.some(t => t.toLowerCase().includes(tech.toLowerCase()))
          )
        )
      )
    }

    // Apply featured filter
    if (filters.featured) {
      filtered = filtered.filter(project => project.featured)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case 'oldest':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        case 'featured':
          if (a.featured === b.featured) {
            return a.displayOrder - b.displayOrder
          }
          return b.featured ? 1 : -1
        case 'status':
          const statusOrder = { 'completed': 0, 'in-progress': 1, 'planned': 2, 'archived': 3 }
          return statusOrder[a.status] - statusOrder[b.status]
        default:
          return a.displayOrder - b.displayOrder
      }
    })

    return filtered
  }, [searchTerm, filters, sort])

  const featuredProjects = useMemo(() => {
    return allProjects.filter(project => project.featured)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  }, [])

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

  const hasActiveFilters = useMemo(() => {
    return searchTerm.length > 0 || Object.values(filters).some(value => 
      Array.isArray(value) ? value.length > 0 : value !== undefined
    )
  }, [searchTerm, filters])

  return {
    // State
    filters,
    sort,
    searchTerm,
    
    // Data
    projects: filteredAndSortedProjects,
    featuredProjects,
    allProjects,
    
    // Actions
    setFilters,
    setSort,
    setSearchTerm,
    clearFilters,
    
    // Computed
    hasActiveFilters,
    totalCount: allProjects.length,
    filteredCount: filteredAndSortedProjects.length
  }
}
/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useProjects } from '../../hooks/useProjects'
import { ProjectFilter, ProjectSort } from '../../types/project'

// Mock the projects data
jest.mock('../../data/projects', () => ({
  projects: [
    {
      id: '1',
      slug: 'test-project-1',
      title: 'Test React App',
      shortDescription: 'A React application for testing',
      fullDescription: 'This is a comprehensive React application built for testing purposes',
      status: 'completed',
      category: 'web-app',
      featured: true,
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      lastUpdated: '2024-08-01',
      technologies: {
        frontend: ['React', 'TypeScript'],
        backend: ['Node.js']
      },
      primaryTech: ['React', 'TypeScript'],
      images: [],
      thumbnailImage: '/test-thumb.jpg',
      links: [],
      features: [],
      tags: ['react', 'testing'],
      displayOrder: 1
    },
    {
      id: '2',
      slug: 'test-project-2',
      title: 'Vue Mobile App',
      shortDescription: 'A Vue.js mobile application',
      fullDescription: 'Mobile-first Vue.js application with TypeScript',
      status: 'in-progress',
      category: 'mobile',
      featured: false,
      startDate: '2024-02-01',
      lastUpdated: '2024-08-15',
      technologies: {
        frontend: ['Vue.js', 'TypeScript'],
        mobile: ['Ionic']
      },
      primaryTech: ['Vue.js', 'Ionic'],
      images: [],
      thumbnailImage: '/test-thumb-2.jpg',
      links: [],
      features: [],
      tags: ['vue', 'mobile'],
      displayOrder: 2
    },
    {
      id: '3',
      slug: 'test-project-3',
      title: 'Python Library',
      shortDescription: 'A Python utility library',
      fullDescription: 'Open source Python library for data processing',
      status: 'completed',
      category: 'library',
      featured: true,
      startDate: '2023-06-01',
      endDate: '2023-12-01',
      lastUpdated: '2024-07-01',
      technologies: {
        backend: ['Python'],
        tools: ['pytest']
      },
      primaryTech: ['Python'],
      images: [],
      thumbnailImage: '/test-thumb-3.jpg',
      links: [],
      features: [],
      tags: ['python', 'library', 'open-source'],
      displayOrder: 3
    }
  ]
}))

describe('useProjects hook', () => {
  describe('Initial State', () => {
    test('should return initial state correctly', () => {
      const { result } = renderHook(() => useProjects())

      expect(result.current.filters).toEqual({})
      expect(result.current.sort).toBe('featured')
      expect(result.current.searchTerm).toBe('')
      expect(result.current.hasActiveFilters).toBe(false)
      expect(result.current.totalCount).toBe(3)
      expect(result.current.filteredCount).toBe(3)
    })

    test('should return all projects initially', () => {
      const { result } = renderHook(() => useProjects())

      expect(result.current.projects).toHaveLength(3)
      expect(result.current.allProjects).toHaveLength(3)
    })

    test('should return featured projects', () => {
      const { result } = renderHook(() => useProjects())

      expect(result.current.featuredProjects).toHaveLength(2)
      expect(result.current.featuredProjects[0].featured).toBe(true)
      expect(result.current.featuredProjects[1].featured).toBe(true)
    })
  })

  describe('Search Functionality', () => {
    test('should filter projects by title', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSearchTerm('React')
      })

      expect(result.current.projects).toHaveLength(1)
      expect(result.current.projects[0].title).toBe('Test React App')
      expect(result.current.hasActiveFilters).toBe(true)
    })

    test('should filter projects by description', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSearchTerm('mobile')
      })

      expect(result.current.projects).toHaveLength(1)
      expect(result.current.projects[0].category).toBe('mobile')
    })

    test('should filter projects by technology', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSearchTerm('Python')
      })

      expect(result.current.projects).toHaveLength(1)
      expect(result.current.projects[0].primaryTech).toContain('Python')
    })

    test('should filter projects by tags', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSearchTerm('open-source')
      })

      expect(result.current.projects).toHaveLength(1)
      expect(result.current.projects[0].tags).toContain('open-source')
    })

    test('should be case insensitive', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSearchTerm('REACT')
      })

      expect(result.current.projects).toHaveLength(1)
      expect(result.current.projects[0].title).toBe('Test React App')
    })
  })

  describe('Category Filtering', () => {
    test('should filter by single category', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setFilters({ category: ['web-app'] })
      })

      expect(result.current.projects).toHaveLength(1)
      expect(result.current.projects[0].category).toBe('web-app')
    })

    test('should filter by multiple categories', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setFilters({ category: ['web-app', 'mobile'] })
      })

      expect(result.current.projects).toHaveLength(2)
    })
  })

  describe('Status Filtering', () => {
    test('should filter by completed status', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setFilters({ status: ['completed'] })
      })

      expect(result.current.projects).toHaveLength(2)
      expect(result.current.projects.every(p => p.status === 'completed')).toBe(true)
    })

    test('should filter by in-progress status', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setFilters({ status: ['in-progress'] })
      })

      expect(result.current.projects).toHaveLength(1)
      expect(result.current.projects[0].status).toBe('in-progress')
    })
  })

  describe('Technology Filtering', () => {
    test('should filter by primary technology', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setFilters({ technologies: ['React'] })
      })

      expect(result.current.projects).toHaveLength(1)
      expect(result.current.projects[0].primaryTech).toContain('React')
    })

    test('should filter by technology in stack', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setFilters({ technologies: ['Node.js'] })
      })

      expect(result.current.projects).toHaveLength(1)
      expect(result.current.projects[0].technologies.backend).toContain('Node.js')
    })
  })

  describe('Featured Filtering', () => {
    test('should filter featured projects only', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setFilters({ featured: true })
      })

      expect(result.current.projects).toHaveLength(2)
      expect(result.current.projects.every(p => p.featured)).toBe(true)
    })

    test('should show all projects when featured is false', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setFilters({ featured: false })
      })

      expect(result.current.projects).toHaveLength(3)
    })
  })

  describe('Sorting', () => {
    test('should sort by newest first', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSort('newest')
      })

      const dates = result.current.projects.map(p => new Date(p.startDate).getTime())
      const sortedDates = [...dates].sort((a, b) => b - a)
      expect(dates).toEqual(sortedDates)
    })

    test('should sort by oldest first', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSort('oldest')
      })

      const dates = result.current.projects.map(p => new Date(p.startDate).getTime())
      const sortedDates = [...dates].sort((a, b) => a - b)
      expect(dates).toEqual(sortedDates)
    })

    test('should sort alphabetically', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSort('alphabetical')
      })

      const titles = result.current.projects.map(p => p.title)
      const sortedTitles = [...titles].sort()
      expect(titles).toEqual(sortedTitles)
    })

    test('should sort by featured first', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSort('featured')
      })

      const featuredFirst = result.current.projects.slice(0, 2).every(p => p.featured)
      const nonFeaturedLast = !result.current.projects[2].featured
      expect(featuredFirst).toBe(true)
      expect(nonFeaturedLast).toBe(true)
    })

    test('should sort by status', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSort('status')
      })

      const statusOrder = { 'completed': 0, 'in-progress': 1, 'planned': 2, 'archived': 3 }
      const statuses = result.current.projects.map(p => statusOrder[p.status])
      const sortedStatuses = [...statuses].sort((a, b) => a - b)
      expect(statuses).toEqual(sortedStatuses)
    })
  })

  describe('Combined Filters', () => {
    test('should apply search and category filter together', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSearchTerm('TypeScript')
        result.current.setFilters({ category: ['web-app'] })
      })

      expect(result.current.projects).toHaveLength(1)
      expect(result.current.projects[0].category).toBe('web-app')
      expect(result.current.projects[0].technologies.frontend).toContain('TypeScript')
    })

    test('should apply multiple filters and return no results when none match', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSearchTerm('NonExistentTech')
        result.current.setFilters({ category: ['web-app'], status: ['completed'] })
      })

      expect(result.current.projects).toHaveLength(0)
    })
  })

  describe('Clear Filters', () => {
    test('should clear all filters and search term', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSearchTerm('React')
        result.current.setFilters({ category: ['web-app'], featured: true })
      })

      expect(result.current.hasActiveFilters).toBe(true)

      act(() => {
        result.current.clearFilters()
      })

      expect(result.current.searchTerm).toBe('')
      expect(result.current.filters).toEqual({})
      expect(result.current.hasActiveFilters).toBe(false)
      expect(result.current.projects).toHaveLength(3)
    })
  })

  describe('Active Filters Detection', () => {
    test('should detect active search term', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setSearchTerm('React')
      })

      expect(result.current.hasActiveFilters).toBe(true)
    })

    test('should detect active filters', () => {
      const { result } = renderHook(() => useProjects())

      act(() => {
        result.current.setFilters({ category: ['web-app'] })
      })

      expect(result.current.hasActiveFilters).toBe(true)
    })

    test('should return false when no filters are active', () => {
      const { result } = renderHook(() => useProjects())

      expect(result.current.hasActiveFilters).toBe(false)
    })
  })
})
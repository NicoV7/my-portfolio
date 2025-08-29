/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectFilters from '../../app/components/ProjectFilters'
import { ProjectFilter, ProjectSort } from '../../types/project'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock data functions
jest.mock('../../data/projects', () => ({
  getAllCategories: () => ['web-app', 'mobile', 'library', 'tool'],
  getAllTechnologies: () => ['React', 'TypeScript', 'Node.js', 'Python', 'Vue.js', 'Next.js']
}))

const mockProps = {
  filters: {} as ProjectFilter,
  sort: 'featured' as ProjectSort,
  onFiltersChange: jest.fn(),
  onSortChange: jest.fn(),
  onClear: jest.fn(),
  resultsCount: 5
}

describe('ProjectFilters Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('should render filter header correctly', () => {
      render(<ProjectFilters {...mockProps} />)
      
      expect(screen.getByText('Filters')).toBeInTheDocument()
      expect(screen.getByText('5 projects')).toBeInTheDocument()
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument()
    })

    test('should render sort dropdown with correct options', () => {
      render(<ProjectFilters {...mockProps} />)
      
      const sortSelect = screen.getByLabelText('Sort by:')
      expect(sortSelect).toHaveValue('featured')
      
      expect(screen.getByText('Newest First')).toBeInTheDocument()
      expect(screen.getByText('Oldest First')).toBeInTheDocument()
      expect(screen.getByText('Alphabetical')).toBeInTheDocument()
      expect(screen.getByText('Featured First')).toBeInTheDocument()
      expect(screen.getByText('By Status')).toBeInTheDocument()
    })

    test('should render featured filter button', () => {
      render(<ProjectFilters {...mockProps} />)
      
      expect(screen.getByText('⭐ Featured Only')).toBeInTheDocument()
    })

    test('should render advanced filters button', () => {
      render(<ProjectFilters {...mockProps} />)
      
      expect(screen.getByText('Advanced Filters')).toBeInTheDocument()
    })

    test('should show clear all button when filters are active', () => {
      const propsWithFilters = {
        ...mockProps,
        filters: { category: ['web-app'] } as ProjectFilter
      }
      
      render(<ProjectFilters {...propsWithFilters} />)
      
      expect(screen.getByText('Clear all')).toBeInTheDocument()
    })

    test('should not show clear all button when no filters are active', () => {
      render(<ProjectFilters {...mockProps} />)
      
      expect(screen.queryByText('Clear all')).not.toBeInTheDocument()
    })

    test('should handle singular/plural results count', () => {
      const singleResultProps = { ...mockProps, resultsCount: 1 }
      const { rerender } = render(<ProjectFilters {...singleResultProps} />)
      
      expect(screen.getByText('1 project')).toBeInTheDocument()
      
      rerender(<ProjectFilters {...mockProps} resultsCount={0} />)
      expect(screen.getByText('0 projects')).toBeInTheDocument()
    })
  })

  describe('Sort Functionality', () => {
    test('should call onSortChange when sort option is selected', async () => {
      const user = userEvent.setup()
      render(<ProjectFilters {...mockProps} />)
      
      const sortSelect = screen.getByLabelText('Sort by:')
      await user.selectOptions(sortSelect, 'newest')
      
      expect(mockProps.onSortChange).toHaveBeenCalledWith('newest')
    })

    test('should display current sort value', () => {
      const propsWithSort = { ...mockProps, sort: 'alphabetical' as ProjectSort }
      render(<ProjectFilters {...propsWithSort} />)
      
      const sortSelect = screen.getByLabelText('Sort by:')
      expect(sortSelect).toHaveValue('alphabetical')
    })
  })

  describe('Featured Filter', () => {
    test('should toggle featured filter when clicked', async () => {
      const user = userEvent.setup()
      render(<ProjectFilters {...mockProps} />)
      
      const featuredButton = screen.getByText('⭐ Featured Only')
      await user.click(featuredButton)
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith({
        featured: true
      })
    })

    test('should show active state when featured filter is applied', () => {
      const propsWithFeatured = {
        ...mockProps,
        filters: { featured: true } as ProjectFilter
      }
      
      render(<ProjectFilters {...propsWithFeatured} />)
      
      const featuredButton = screen.getByText('⭐ Featured Only')
      expect(featuredButton).toHaveClass('bg-yellow-100', 'text-yellow-800')
    })

    test('should show inactive state when featured filter is not applied', () => {
      render(<ProjectFilters {...mockProps} />)
      
      const featuredButton = screen.getByText('⭐ Featured Only')
      expect(featuredButton).toHaveClass('bg-gray-100', 'text-gray-600')
    })
  })

  describe('Advanced Filters Toggle', () => {
    test('should expand advanced filters when clicked', async () => {
      const user = userEvent.setup()
      render(<ProjectFilters {...mockProps} />)
      
      const advancedButton = screen.getByText('Advanced Filters')
      await user.click(advancedButton)
      
      await waitFor(() => {
        expect(screen.getByText('Categories')).toBeInTheDocument()
        expect(screen.getByText('Status')).toBeInTheDocument()
        expect(screen.getByText('Technologies')).toBeInTheDocument()
      })
    })

    test('should collapse advanced filters when clicked again', async () => {
      const user = userEvent.setup()
      render(<ProjectFilters {...mockProps} />)
      
      const advancedButton = screen.getByText('Advanced Filters')
      
      // Expand
      await user.click(advancedButton)
      await waitFor(() => {
        expect(screen.getByText('Categories')).toBeInTheDocument()
      })
      
      // Collapse
      await user.click(advancedButton)
      await waitFor(() => {
        expect(screen.queryByText('Categories')).not.toBeInTheDocument()
      })
    })
  })

  describe('Category Filters', () => {
    test('should render category checkboxes when advanced filters are open', async () => {
      const user = userEvent.setup()
      render(<ProjectFilters {...mockProps} />)
      
      await user.click(screen.getByText('Advanced Filters'))
      
      await waitFor(() => {
        expect(screen.getByLabelText('web app')).toBeInTheDocument()
        expect(screen.getByLabelText('mobile')).toBeInTheDocument()
        expect(screen.getByLabelText('library')).toBeInTheDocument()
        expect(screen.getByLabelText('tool')).toBeInTheDocument()
      })
    })

    test('should call onFiltersChange when category is selected', async () => {
      const user = userEvent.setup()
      render(<ProjectFilters {...mockProps} />)
      
      await user.click(screen.getByText('Advanced Filters'))
      
      await waitFor(async () => {
        const webAppCheckbox = screen.getByLabelText('web app')
        await user.click(webAppCheckbox)
      })
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith({
        category: ['web-app']
      })
    })

    test('should show checked state for active categories', async () => {
      const user = userEvent.setup()
      const propsWithCategory = {
        ...mockProps,
        filters: { category: ['web-app'] } as ProjectFilter
      }
      
      render(<ProjectFilters {...propsWithCategory} />)
      
      await user.click(screen.getByText('Advanced Filters'))
      
      await waitFor(() => {
        const webAppCheckbox = screen.getByLabelText('web app') as HTMLInputElement
        expect(webAppCheckbox.checked).toBe(true)
      })
    })
  })

  describe('Status Filters', () => {
    test('should render status checkboxes when advanced filters are open', async () => {
      const user = userEvent.setup()
      render(<ProjectFilters {...mockProps} />)
      
      await user.click(screen.getByText('Advanced Filters'))
      
      await waitFor(() => {
        expect(screen.getByLabelText('completed')).toBeInTheDocument()
        expect(screen.getByLabelText('in progress')).toBeInTheDocument()
        expect(screen.getByLabelText('planned')).toBeInTheDocument()
        expect(screen.getByLabelText('archived')).toBeInTheDocument()
      })
    })

    test('should call onFiltersChange when status is selected', async () => {
      const user = userEvent.setup()
      render(<ProjectFilters {...mockProps} />)
      
      await user.click(screen.getByText('Advanced Filters'))
      
      await waitFor(async () => {
        const completedCheckbox = screen.getByLabelText('completed')
        await user.click(completedCheckbox)
      })
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith({
        status: ['completed']
      })
    })
  })

  describe('Technology Filters', () => {
    test('should render technology checkboxes when advanced filters are open', async () => {
      const user = userEvent.setup()
      render(<ProjectFilters {...mockProps} />)
      
      await user.click(screen.getByText('Advanced Filters'))
      
      await waitFor(() => {
        expect(screen.getByLabelText('React')).toBeInTheDocument()
        expect(screen.getByLabelText('TypeScript')).toBeInTheDocument()
        expect(screen.getByLabelText('Node.js')).toBeInTheDocument()
      })
    })

    test('should call onFiltersChange when technology is selected', async () => {
      const user = userEvent.setup()
      render(<ProjectFilters {...mockProps} />)
      
      await user.click(screen.getByText('Advanced Filters'))
      
      await waitFor(async () => {
        const reactCheckbox = screen.getByLabelText('React')
        await user.click(reactCheckbox)
      })
      
      expect(mockProps.onFiltersChange).toHaveBeenCalledWith({
        technologies: ['React']
      })
    })
  })

  describe('Clear Filters', () => {
    test('should call onClear when clear all button is clicked', async () => {
      const user = userEvent.setup()
      const propsWithFilters = {
        ...mockProps,
        filters: { category: ['web-app'] } as ProjectFilter
      }
      
      render(<ProjectFilters {...propsWithFilters} />)
      
      const clearButton = screen.getByText('Clear all')
      await user.click(clearButton)
      
      expect(mockProps.onClear).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    test('should have proper labels for form elements', async () => {
      const user = userEvent.setup()
      render(<ProjectFilters {...mockProps} />)
      
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument()
      
      await user.click(screen.getByText('Advanced Filters'))
      
      await waitFor(() => {
        expect(screen.getByLabelText('web app')).toBeInTheDocument()
        expect(screen.getByLabelText('completed')).toBeInTheDocument()
        expect(screen.getByLabelText('React')).toBeInTheDocument()
      })
    })

    test('should be keyboard navigable', async () => {
      render(<ProjectFilters {...mockProps} />)
      
      const sortSelect = screen.getByLabelText('Sort by:')
      const featuredButton = screen.getByText('⭐ Featured Only')
      const advancedButton = screen.getByText('Advanced Filters')
      
      // Tab navigation should work
      sortSelect.focus()
      expect(document.activeElement).toBe(sortSelect)
      
      fireEvent.keyDown(sortSelect, { key: 'Tab' })
      // Note: Full keyboard navigation testing would require more setup
    })
  })

  describe('Error Handling', () => {
    test('should handle missing categories gracefully', () => {
      // Mock empty categories
      jest.doMock('../../data/projects', () => ({
        getAllCategories: () => [],
        getAllTechnologies: () => ['React', 'TypeScript']
      }))
      
      expect(() => {
        render(<ProjectFilters {...mockProps} />)
      }).not.toThrow()
    })

    test('should handle missing technologies gracefully', () => {
      // Mock empty technologies
      jest.doMock('../../data/projects', () => ({
        getAllCategories: () => ['web-app'],
        getAllTechnologies: () => []
      }))
      
      expect(() => {
        render(<ProjectFilters {...mockProps} />)
      }).not.toThrow()
    })
  })
})
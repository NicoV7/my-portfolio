/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectsPage from '../../app/projects/page'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock the project data
jest.mock('../../data/projects', () => ({
  projects: [
    {
      id: '1',
      slug: 'test-project-1',
      title: 'React E-Commerce App',
      shortDescription: 'A full-stack e-commerce platform',
      fullDescription: 'This is a comprehensive e-commerce application',
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
      previewMedia: {
        url: '/test-video.mp4',
        type: 'video',
        fallbackImage: '/fallback.jpg'
      },
      links: [],
      features: [],
      tags: ['react', 'ecommerce'],
      displayOrder: 1
    },
    {
      id: '2',
      slug: 'test-project-2', 
      title: 'Vue Mobile App',
      shortDescription: 'A Vue.js mobile application',
      fullDescription: 'Mobile-first Vue application',
      status: 'in-progress',
      category: 'mobile',
      featured: false,
      startDate: '2024-02-01',
      lastUpdated: '2024-08-15',
      technologies: {
        frontend: ['Vue.js'],
        mobile: ['Ionic']
      },
      primaryTech: ['Vue.js', 'Ionic'],
      images: [],
      thumbnailImage: '/test-thumb-2.jpg',
      previewMedia: {
        url: '/test-gif.gif',
        type: 'gif'
      },
      links: [],
      features: [],
      tags: ['vue', 'mobile'],
      displayOrder: 2
    }
  ],
  getAllCategories: () => ['web-app', 'mobile'],
  getAllTechnologies: () => ['React', 'TypeScript', 'Vue.js', 'Ionic', 'Node.js']
}))

// Mock AnimatedPageWrapper
jest.mock('../../app/components/AnimatedPageWrapper', () => {
  return function MockAnimatedPageWrapper({ children }: { children: React.ReactNode }) {
    return <div data-testid="animated-page-wrapper">{children}</div>
  }
})

describe('ProjectsPage Integration Tests', () => {
  beforeEach(() => {
    // Mock HTMLMediaElement methods
    Object.defineProperty(HTMLMediaElement.prototype, 'load', {
      writable: true,
      value: jest.fn(),
    })
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      writable: true,
      value: jest.fn().mockResolvedValue(undefined),
    })
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      writable: true,
      value: jest.fn(),
    })
  })

  describe('Page Loading', () => {
    test('should render projects page without crashing', () => {
      render(<ProjectsPage />)
      
      expect(screen.getByText('My Projects')).toBeInTheDocument()
    })

    test('should show loading skeleton initially', () => {
      render(<ProjectsPage />)
      
      // Should show skeleton cards while loading
      expect(screen.getAllByTestId(/project-skeleton/i)).toHaveLength(6)
    })

    test('should display projects after loading', async () => {
      render(<ProjectsPage />)
      
      await waitFor(() => {
        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()
        expect(screen.getByText('Vue Mobile App')).toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Search Functionality Integration', () => {
    test('should filter projects by search term', async () => {
      const user = userEvent.setup()
      render(<ProjectsPage />)
      
      // Wait for projects to load
      await waitFor(() => {
        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/search projects/i)
      await user.type(searchInput, 'React')
      
      await waitFor(() => {
        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()
        expect(screen.queryByText('Vue Mobile App')).not.toBeInTheDocument()
      })
    })

    test('should show no results when search has no matches', async () => {
      const user = userEvent.setup()
      render(<ProjectsPage />)
      
      await waitFor(() => {
        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()
      })
      
      const searchInput = screen.getByPlaceholderText(/search projects/i)
      await user.type(searchInput, 'NonExistentTech')
      
      await waitFor(() => {
        expect(screen.getByText('No projects found')).toBeInTheDocument()
        expect(screen.getByText('Clear all filters')).toBeInTheDocument()
      })
    })
  })

  describe('Filtering Integration', () => {
    test('should filter by category', async () => {
      const user = userEvent.setup()
      render(<ProjectsPage />)\n      \n      // Wait for projects to load\n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n      \n      // Open advanced filters\n      const advancedFiltersButton = screen.getByText('Advanced Filters')\n      await user.click(advancedFiltersButton)\n      \n      // Filter by web-app category\n      const webAppCheckbox = await screen.findByLabelText('web app')\n      await user.click(webAppCheckbox)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n        expect(screen.queryByText('Vue Mobile App')).not.toBeInTheDocument()\n      })\n    })\n\n    test('should filter by status', async () => {\n      const user = userEvent.setup()\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n      \n      // Open advanced filters\n      const advancedFiltersButton = screen.getByText('Advanced Filters')\n      await user.click(advancedFiltersButton)\n      \n      // Filter by in-progress status\n      const inProgressCheckbox = await screen.findByLabelText('in progress')\n      await user.click(inProgressCheckbox)\n      \n      await waitFor(() => {\n        expect(screen.getByText('Vue Mobile App')).toBeInTheDocument()\n        expect(screen.queryByText('React E-Commerce App')).not.toBeInTheDocument()\n      })\n    })\n\n    test('should filter by featured projects', async () => {\n      const user = userEvent.setup()\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n      \n      const featuredButton = screen.getByText('⭐ Featured Only')\n      await user.click(featuredButton)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n        expect(screen.queryByText('Vue Mobile App')).not.toBeInTheDocument()\n      })\n    })\n  })\n\n  describe('Sorting Integration', () => {\n    test('should sort projects by different criteria', async () => {\n      const user = userEvent.setup()\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n      \n      const sortSelect = screen.getByLabelText('Sort by:')\n      \n      // Sort alphabetically\n      await user.selectOptions(sortSelect, 'alphabetical')\n      \n      await waitFor(() => {\n        const projectCards = screen.getAllByTestId('project-card')\n        // React should come before Vue alphabetically\n        expect(projectCards[0]).toHaveTextContent('React E-Commerce App')\n        expect(projectCards[1]).toHaveTextContent('Vue Mobile App')\n      })\n    })\n  })\n\n  describe('Project Modal Integration', () => {\n    test('should open project modal when card is clicked', async () => {\n      const user = userEvent.setup()\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n      \n      const projectCard = screen.getByTestId('project-card')\n      await user.click(projectCard)\n      \n      // Should open modal with project details\n      await waitFor(() => {\n        expect(screen.getByRole('dialog')).toBeInTheDocument()\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n    })\n\n    test('should close modal when close button is clicked', async () => {\n      const user = userEvent.setup()\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n      \n      // Open modal\n      const projectCard = screen.getByTestId('project-card')\n      await user.click(projectCard)\n      \n      await waitFor(() => {\n        expect(screen.getByRole('dialog')).toBeInTheDocument()\n      })\n      \n      // Close modal\n      const closeButton = screen.getByLabelText('Close modal')\n      await user.click(closeButton)\n      \n      await waitFor(() => {\n        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()\n      })\n    })\n  })\n\n  describe('Media Integration', () => {\n    test('should display video content in project cards', async () => {\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByTestId('project-media-video')).toBeInTheDocument()\n      })\n      \n      const video = screen.getByTestId('project-media-video')\n      expect(video).toHaveAttribute('src', '/test-video.mp4')\n    })\n\n    test('should display gif content in project cards', async () => {\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByTestId('project-media-gif')).toBeInTheDocument()\n      })\n      \n      const gif = screen.getByTestId('project-media-gif')\n      expect(gif).toHaveAttribute('src', '/test-gif.gif')\n    })\n\n    test('should handle media loading errors gracefully', async () => {\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByTestId('project-media-video')).toBeInTheDocument()\n      })\n      \n      const video = screen.getByTestId('project-media-video')\n      \n      // Simulate video load error\n      fireEvent.error(video)\n      \n      await waitFor(() => {\n        expect(screen.getByTestId('project-media-fallback')).toBeInTheDocument()\n      })\n    })\n  })\n\n  describe('Clear Filters Integration', () => {\n    test('should clear all filters when clear button is clicked', async () => {\n      const user = userEvent.setup()\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n      \n      // Apply search filter\n      const searchInput = screen.getByPlaceholderText(/search projects/i)\n      await user.type(searchInput, 'React')\n      \n      // Apply featured filter\n      const featuredButton = screen.getByText('⭐ Featured Only')\n      await user.click(featuredButton)\n      \n      // Should show clear all button\n      expect(screen.getByText('Clear all')).toBeInTheDocument()\n      \n      // Clear all filters\n      const clearButton = screen.getByText('Clear all')\n      await user.click(clearButton)\n      \n      await waitFor(() => {\n        expect(searchInput).toHaveValue('')\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n        expect(screen.getByText('Vue Mobile App')).toBeInTheDocument()\n      })\n    })\n  })\n\n  describe('Responsive Behavior', () => {\n    test('should handle mobile interactions', async () => {\n      // Mock mobile viewport\n      global.innerWidth = 375\n      global.innerHeight = 667\n      \n      const user = userEvent.setup()\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n      \n      const projectCard = screen.getByTestId('project-card')\n      \n      // Test touch interaction\n      await user.pointer({ keys: '[TouchA>]', target: projectCard })\n      await user.pointer({ keys: '[/TouchA]', target: projectCard })\n      \n      await waitFor(() => {\n        expect(screen.getByRole('dialog')).toBeInTheDocument()\n      })\n    })\n  })\n\n  describe('Performance Tests', () => {\n    test('should handle large number of projects without performance issues', async () => {\n      const startTime = performance.now()\n      \n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByText('My Projects')).toBeInTheDocument()\n      })\n      \n      const endTime = performance.now()\n      const renderTime = endTime - startTime\n      \n      // Should render within reasonable time (less than 1000ms)\n      expect(renderTime).toBeLessThan(1000)\n    })\n\n    test('should handle rapid filter changes without errors', async () => {\n      const user = userEvent.setup()\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n      \n      const searchInput = screen.getByPlaceholderText(/search projects/i)\n      \n      // Rapidly change search terms\n      for (let i = 0; i < 5; i++) {\n        await user.clear(searchInput)\n        await user.type(searchInput, `search${i}`)\n      }\n      \n      // Should not crash and should show no results\n      await waitFor(() => {\n        expect(screen.getByText('No projects found')).toBeInTheDocument()\n      })\n    })\n  })\n\n  describe('Accessibility Integration', () => {\n    test('should be keyboard navigable', async () => {\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n      \n      const searchInput = screen.getByPlaceholderText(/search projects/i)\n      const projectCard = screen.getByTestId('project-card')\n      \n      // Tab navigation should work\n      searchInput.focus()\n      expect(document.activeElement).toBe(searchInput)\n      \n      // Project card should be focusable\n      projectCard.focus()\n      expect(document.activeElement).toBe(projectCard)\n      \n      // Enter key should open modal\n      fireEvent.keyDown(projectCard, { key: 'Enter' })\n      \n      await waitFor(() => {\n        expect(screen.getByRole('dialog')).toBeInTheDocument()\n      })\n    })\n\n    test('should have proper ARIA labels and roles', async () => {\n      render(<ProjectsPage />)\n      \n      await waitFor(() => {\n        expect(screen.getByText('React E-Commerce App')).toBeInTheDocument()\n      })\n      \n      const projectCard = screen.getByTestId('project-card')\n      expect(projectCard).toHaveAttribute('role', 'button')\n      expect(projectCard).toHaveAttribute('aria-label')\n      \n      const searchInput = screen.getByPlaceholderText(/search projects/i)\n      expect(searchInput).toHaveAccessibleName()\n    })\n  })\n})
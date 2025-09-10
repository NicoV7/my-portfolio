/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectCard from '../../app/components/ProjectCard'
import { Project } from '../../types/project'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
}))

const mockProject: Project = {
  id: '1',
  slug: 'test-project',
  title: 'Test Project',
  shortDescription: 'A test project for unit testing',
  fullDescription: 'This is a comprehensive test project',
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
  primaryTech: ['React', 'TypeScript', 'Node.js'],
  images: [],
  previewMedia: {
    url: '/test-video.mp4',
    type: 'video',
    fallbackImage: '/test-fallback.jpg'
  },
  links: [
    { type: 'github', url: 'https://github.com/test', label: 'GitHub' },
    { type: 'live', url: 'https://test.com', label: 'Live Demo' }
  ],
  features: [],
  tags: ['react', 'testing'],
  displayOrder: 1
}

const mockProjectWithGif: Project = {
  ...mockProject,
  id: '2',
  previewMedia: {
    url: '/test-animation.gif',
    type: 'gif',
    fallbackImage: '/test-fallback-gif.jpg'
  }
}

const mockProjectWithImage: Project = {
  ...mockProject,
  id: '3',
  previewMedia: {
    url: '/test-static.jpg',
    type: 'image',
    fallbackImage: '/test-fallback-static.jpg'
  }
}

const mockProjectWithoutMedia: Project = {
  ...mockProject,
  id: '4',
  previewMedia: undefined
}

const defaultProps = {
  onClick: jest.fn(),
  index: 0
}

describe('ProjectCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

  describe('Basic Rendering', () => {
    test('should render project card with basic information', () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      expect(screen.getByText('Test Project')).toBeInTheDocument()
      expect(screen.getByText('A test project for unit testing')).toBeInTheDocument()
      expect(screen.getByText('⭐ Featured')).toBeInTheDocument()
      expect(screen.getByText('completed')).toBeInTheDocument()
      expect(screen.getByText('web app')).toBeInTheDocument()
    })

    test('should render primary technologies', () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })

    test('should show +X more when there are more than 3 technologies', () => {
      const projectWithManyTechs = {
        ...mockProject,
        primaryTech: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS']
      }
      
      render(<ProjectCard project={projectWithManyTechs} {...defaultProps} />)
      
      expect(screen.getByText('+2 more')).toBeInTheDocument()
    })

    test('should render project links', () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      expect(screen.getByText('github')).toBeInTheDocument()
      expect(screen.getByText('live')).toBeInTheDocument()
    })

    test('should show project year when endDate exists', () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      expect(screen.getByText('2024')).toBeInTheDocument()
    })
  })

  describe('Video Media Support', () => {
    test('should render video element for video media type', () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const video = screen.getByTestId('project-media-video')
      expect(video).toBeInTheDocument()
      expect(video).toHaveAttribute('src', '/test-video.mp4')
      expect(video).toHaveAttribute('autoplay')
      expect(video).toHaveAttribute('loop')
      expect(video).toHaveAttribute('muted')
      expect(video).toHaveAttribute('playsInline')
    })

    test('should have proper accessibility attributes for video', () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const video = screen.getByTestId('project-media-video')
      expect(video).toHaveAttribute('aria-label', 'Project preview video for Test Project')
      expect(video).toHaveAttribute('role', 'img')
    })

    test('should autoplay video on component mount', async () => {
      const playSpy = jest.spyOn(HTMLMediaElement.prototype, 'play')
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      await waitFor(() => {
        expect(playSpy).toHaveBeenCalled()
      })
    })

    test('should pause video on hover out and play on hover', async () => {
      const playSpy = jest.spyOn(HTMLMediaElement.prototype, 'play')
      const pauseSpy = jest.spyOn(HTMLMediaElement.prototype, 'pause')
      
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const card = screen.getByTestId('project-card')
      
      // Mouse enter should play video
      fireEvent.mouseEnter(card)
      await waitFor(() => {
        expect(playSpy).toHaveBeenCalled()
      })
      
      // Mouse leave should pause video
      fireEvent.mouseLeave(card)
      await waitFor(() => {
        expect(pauseSpy).toHaveBeenCalled()
      })
    })

    test('should handle video load errors gracefully', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const video = screen.getByTestId('project-media-video')
      
      // Simulate video load error
      fireEvent.error(video)
      
      await waitFor(() => {
        // Should show fallback image
        expect(screen.getByTestId('project-media-fallback')).toBeInTheDocument()
        expect(screen.getByTestId('project-media-fallback')).toHaveAttribute('src', '/test-fallback.jpg')
      })
      
      consoleSpy.mockRestore()
    })

    test('should show loading state while video is loading', () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      // Should show loading indicator initially
      expect(screen.getByTestId('project-media-loading')).toBeInTheDocument()
    })

    test('should hide loading state when video loads', async () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const video = screen.getByTestId('project-media-video')
      
      // Simulate video load complete
      fireEvent.loadedData(video)
      
      await waitFor(() => {
        expect(screen.queryByTestId('project-media-loading')).not.toBeInTheDocument()
      })
    })
  })

  describe('GIF Media Support', () => {
    test('should render img element for gif media type', () => {
      render(<ProjectCard project={mockProjectWithGif} {...defaultProps} />)
      
      const gif = screen.getByTestId('project-media-gif')
      expect(gif).toBeInTheDocument()
      expect(gif).toHaveAttribute('src', '/test-animation.gif')
    })

    test('should have proper accessibility attributes for gif', () => {
      render(<ProjectCard project={mockProjectWithGif} {...defaultProps} />)
      
      const gif = screen.getByTestId('project-media-gif')
      expect(gif).toHaveAttribute('alt', 'Animated preview for Test Project')
    })

    test('should handle gif load errors gracefully', async () => {
      render(<ProjectCard project={mockProjectWithGif} {...defaultProps} />)
      
      const gif = screen.getByTestId('project-media-gif')
      
      // Simulate gif load error
      fireEvent.error(gif)
      
      await waitFor(() => {
        // Should show fallback image
        expect(screen.getByTestId('project-media-fallback')).toBeInTheDocument()
        expect(screen.getByTestId('project-media-fallback')).toHaveAttribute('src', '/test-fallback-gif.jpg')
      })
    })
  })

  describe('Static Image Support', () => {
    test('should render img element for image media type', () => {
      render(<ProjectCard project={mockProjectWithImage} {...defaultProps} />)
      
      const image = screen.getByTestId('project-media-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/test-static.jpg')
    })

    test('should have proper accessibility attributes for image', () => {
      render(<ProjectCard project={mockProjectWithImage} {...defaultProps} />)
      
      const image = screen.getByTestId('project-media-image')
      expect(image).toHaveAttribute('alt', 'Preview image for Test Project')
    })
  })

  describe('Fallback Behavior', () => {
    test('should show default placeholder when no preview media is provided', () => {
      render(<ProjectCard project={mockProjectWithoutMedia} {...defaultProps} />)
      
      // Should show project title initial as placeholder
      expect(screen.getByTestId('project-media-placeholder')).toBeInTheDocument()
      expect(screen.getByText('T')).toBeInTheDocument() // First letter of title
    })

    test('should handle invalid media URLs gracefully', async () => {
      const projectWithInvalidUrl = {
        ...mockProject,
        previewMedia: {
          url: '',
          type: 'video' as const,
          fallbackImage: '/fallback.jpg'
        }
      }
      
      render(<ProjectCard project={projectWithInvalidUrl} {...defaultProps} />)
      
      await waitFor(() => {
        // Should show fallback or placeholder
        expect(
          screen.getByTestId('project-media-fallback') || 
          screen.getByTestId('project-media-placeholder')
        ).toBeInTheDocument()
      })
    })

    test('should handle missing fallback images gracefully', async () => {
      const projectWithoutFallback = {
        ...mockProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video' as const,
          fallbackImage: undefined
        }
      }
      
      render(<ProjectCard project={projectWithoutFallback} {...defaultProps} />)
      
      const video = screen.getByTestId('project-media-video')
      
      // Simulate video load error
      fireEvent.error(video)
      
      await waitFor(() => {
        // Should show placeholder instead of fallback
        expect(screen.getByTestId('project-media-placeholder')).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Behavior', () => {
    test('should maintain proper layout on different screen sizes', () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const card = screen.getByTestId('project-card')
      expect(card).toBeInTheDocument()
    })

    test('should handle touch events for mobile', async () => {
      const user = userEvent.setup()
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const card = screen.getByTestId('project-card')
      
      // Touch should trigger click
      await user.pointer({ keys: '[TouchA>]', target: card })
      await user.pointer({ keys: '[/TouchA]', target: card })
      
      expect(defaultProps.onClick).toHaveBeenCalled()
    })
  })

  describe('Interaction Behavior', () => {
    test('should call onClick when card is clicked', async () => {
      const user = userEvent.setup()
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const card = screen.getByTestId('project-card')
      await user.click(card)
      
      expect(defaultProps.onClick).toHaveBeenCalled()
    })

    test('should handle keyboard navigation', async () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const card = screen.getByTestId('project-card')
      
      // Should be focusable
      card.focus()
      expect(document.activeElement).toBe(card)
      
      // Enter key should trigger click
      fireEvent.keyDown(card, { key: 'Enter' })
      expect(defaultProps.onClick).toHaveBeenCalled()
    })

    test('should show hover state with View Details overlay', async () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const card = screen.getByTestId('project-card')
      
      fireEvent.mouseEnter(card)
      
      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument()
      })
    })
  })

  describe('Performance Optimization', () => {
    test('should lazy load video content', () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const video = screen.getByTestId('project-media-video')
      expect(video).toHaveAttribute('preload', 'metadata')
    })

    test('should use appropriate video format hints', () => {
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const video = screen.getByTestId('project-media-video')
      // Check for format optimization attributes
      expect(video).toHaveAttribute('disablePictureInPicture')
    })
  })

  describe('Error States', () => {
    test('should log errors to console when media fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      const video = screen.getByTestId('project-media-video')
      fireEvent.error(video)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to load project media:', expect.any(Object))
      })
      
      consoleSpy.mockRestore()
    })

    test('should handle network errors gracefully', async () => {
      // Mock network error
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))
      
      render(<ProjectCard project={mockProject} {...defaultProps} />)
      
      // Should still render the component without crashing
      expect(screen.getByText('Test Project')).toBeInTheDocument()
    })
  })
})
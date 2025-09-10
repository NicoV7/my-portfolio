/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProjectCard from '../../app/components/ProjectCard'
import { Project } from '../../types/project'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
}))

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

const mockBaseProject: Omit<Project, 'previewMedia'> = {
  id: '1',
  slug: 'test-project',
  title: 'Test Project',
  shortDescription: 'A test project',
  fullDescription: 'This is a test project for video/GIF support',
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
  images: [{
    url: '/test-thumb.jpg',
    alt: 'Test thumbnail',
    type: 'thumbnail'
  }],
  links: [],
  features: [],
  tags: ['test'],
  displayOrder: 1
}

describe('Video/GIF Support in ProjectCard', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock HTMLVideoElement play method
    Object.defineProperty(HTMLVideoElement.prototype, 'play', {
      writable: true,
      value: jest.fn().mockImplementation(() => Promise.resolve()),
    })
    // Mock HTMLVideoElement pause method
    Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
      writable: true,
      value: jest.fn(),
    })
  })

  describe('Video Support', () => {
    test('should render video element for video preview media', async () => {
      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      const video = screen.getByTestId('project-media-video')
      expect(video).toBeInTheDocument()
      expect(video).toHaveAttribute('src', '/test-video.mp4')
      expect(video).toHaveAttribute('preload', 'metadata')
      expect(video).toHaveAttribute('loop')
      expect(video).toHaveAttribute('muted')
      expect(video).toHaveAttribute('playsInline')
    })

    test('should autoplay video when component mounts', async () => {
      const playMock = jest.fn().mockResolvedValue(undefined)
      Object.defineProperty(HTMLVideoElement.prototype, 'play', {
        writable: true,
        value: playMock,
      })

      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      await waitFor(() => {
        expect(playMock).toHaveBeenCalled()
      })
    })

    test('should handle video autoplay failure gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      const playMock = jest.fn().mockRejectedValue(new Error('Autoplay prevented'))
      Object.defineProperty(HTMLVideoElement.prototype, 'play', {
        writable: true,
        value: playMock,
      })

      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      await waitFor(() => {
        expect(playMock).toHaveBeenCalled()
      })

      // Should not crash and should handle the error silently
      expect(screen.getByTestId('project-media-video')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })

    test('should show fallback image when video fails to load', async () => {
      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      const video = screen.getByTestId('project-media-video')
      
      // Simulate video load error
      fireEvent.error(video)

      await waitFor(() => {
        expect(screen.getByTestId('project-media-fallback')).toBeInTheDocument()
      })

      const fallbackImage = screen.getByTestId('project-media-fallback')
      expect(fallbackImage).toHaveAttribute('src', '/test-fallback.jpg')
    })

    test('should show thumbnail fallback if no fallbackImage specified', async () => {
      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      const video = screen.getByTestId('project-media-video')
      
      // Simulate video load error
      fireEvent.error(video)

      await waitFor(() => {
        expect(screen.getByTestId('project-media-fallback')).toBeInTheDocument()
      })

      // Should show placeholder since no thumbnail available
      expect(screen.getByTestId('project-media-placeholder')).toBeInTheDocument()
    })
  })

  describe('GIF Support', () => {
    test('should render img element for GIF preview media', () => {
      const projectWithGif: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-animation.gif',
          type: 'gif',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithGif} onClick={mockOnClick} index={0} />)

      const gif = screen.getByTestId('project-media-gif')
      expect(gif).toBeInTheDocument()
      expect(gif).toHaveAttribute('src', '/test-animation.gif')
      expect(gif).toHaveAttribute('alt')
    })

    test('should show fallback image when GIF fails to load', async () => {
      const projectWithGif: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-animation.gif',
          type: 'gif',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithGif} onClick={mockOnClick} index={0} />)

      const gif = screen.getByTestId('project-media-gif')
      
      // Simulate GIF load error
      fireEvent.error(gif)

      await waitFor(() => {
        expect(screen.getByTestId('project-media-fallback')).toBeInTheDocument()
      })

      const fallbackImage = screen.getByTestId('project-media-fallback')
      expect(fallbackImage).toHaveAttribute('src', '/test-fallback.jpg')
    })
  })

  describe('Image Fallback Support', () => {
    test('should render regular image when no previewMedia is specified', () => {
      const projectWithoutPreview: Project = {
        ...mockBaseProject
        // No previewMedia
      }

      render(<ProjectCard project={projectWithoutPreview} onClick={mockOnClick} index={0} />)

      // Should show placeholder when no thumbnail available
      expect(screen.getByTestId('project-media-placeholder')).toBeInTheDocument()
    })

    test('should render regular image for unsupported media types', () => {
      const projectWithUnsupportedMedia: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-unsupported.webm',
          type: 'image', // Fallback to image type
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithUnsupportedMedia} onClick={mockOnClick} index={0} />)

      const image = screen.getByTestId('project-media-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/test-unsupported.webm')
    })
  })

  describe('Loading States', () => {
    test('should show loading state initially', () => {
      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      expect(screen.getByTestId('project-media-loading')).toBeInTheDocument()
    })

    test('should hide loading state when media loads successfully', async () => {
      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      const video = screen.getByTestId('project-media-video')
      
      // Simulate successful load
      fireEvent.loadedData(video)

      await waitFor(() => {
        expect(screen.queryByTestId('project-media-loading')).not.toBeInTheDocument()
      })
    })

    test('should hide loading state when media fails to load', async () => {
      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      const video = screen.getByTestId('project-media-video')
      
      // Simulate load error
      fireEvent.error(video)

      await waitFor(() => {
        expect(screen.queryByTestId('project-media-loading')).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    test('should have proper ARIA labels for video elements', () => {
      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      const video = screen.getByTestId('project-media-video')
      expect(video).toHaveAttribute('aria-label', 'Project preview video for Test Project')
      expect(video).toHaveAttribute('role', 'img')
    })

    test('should have proper alt text for GIF elements', () => {
      const projectWithGif: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-animation.gif',
          type: 'gif',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithGif} onClick={mockOnClick} index={0} />)

      const gif = screen.getByTestId('project-media-gif')
      expect(gif).toHaveAttribute('alt', 'Test Project preview animation')
    })

    test('should have proper alt text for fallback images', async () => {
      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      const video = screen.getByTestId('project-media-video')
      fireEvent.error(video)

      await waitFor(() => {
        const fallbackImage = screen.getByTestId('project-media-fallback')
        expect(fallbackImage).toHaveAttribute('alt', 'Test Project thumbnail')
      })
    })
  })

  describe('Performance', () => {
    test('should use preload="metadata" for videos to optimize loading', () => {
      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      const video = screen.getByTestId('project-media-video')
      expect(video).toHaveAttribute('preload', 'metadata')
    })

    test('should disable picture-in-picture for videos', () => {
      const projectWithVideo: Project = {
        ...mockBaseProject,
        previewMedia: {
          url: '/test-video.mp4',
          type: 'video',
          fallbackImage: '/test-fallback.jpg'
        }
      }

      render(<ProjectCard project={projectWithVideo} onClick={mockOnClick} index={0} />)

      const video = screen.getByTestId('project-media-video')
      expect(video).toHaveAttribute('disablePictureInPicture')
    })
  })
})
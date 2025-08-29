'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Project } from '../../types/project'

type ProjectCardProps = {
  project: Project
  onClick: () => void
  index: number
}

const statusColors = {
  'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'planned': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'archived': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const categoryColors = {
  'web-app': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'mobile': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  'desktop': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  'library': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'api': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'tool': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'game': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

export default function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  const [mediaError, setMediaError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current && project.previewMedia?.type === 'video') {
      videoRef.current.play().catch(() => {
        // Ignore autoplay errors (browser policy)
      })
    }
  }, [])

  const handleMediaError = (error: any) => {
    console.error('Failed to load project media:', error)
    setMediaError(true)
    setIsLoading(false)
  }

  const handleMediaLoad = () => {
    setIsLoading(false)
  }

  const handleMouseEnter = () => {
    if (videoRef.current && project.previewMedia?.type === 'video') {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current && project.previewMedia?.type === 'video') {
      videoRef.current.pause()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  const renderMedia = () => {
    // Show fallback or placeholder if there's an error or no media
    if (mediaError || !project.previewMedia) {
      if (project.previewMedia?.fallbackImage) {
        return (
          <img
            src={project.previewMedia.fallbackImage}
            alt={`Fallback preview for ${project.title}`}
            className="w-full h-full object-cover"
            data-testid="project-media-fallback"
          />
        )
      }
      
      return (
        <div 
          className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
          data-testid="project-media-placeholder"
        >
          <div className="text-white text-6xl font-bold opacity-50">
            {project.title.charAt(0)}
          </div>
        </div>
      )
    }

    // Render based on media type
    switch (project.previewMedia.type) {
      case 'video':
        return (
          <>
            <video
              ref={videoRef}
              src={project.previewMedia.url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
              onError={handleMediaError}
              onLoadedData={handleMediaLoad}
              aria-label={`Project preview video for ${project.title}`}
              role="img"
              data-testid="project-media-video"
            />
          </>
        )

      case 'gif':
        return (
          <img
            src={project.previewMedia.url}
            alt={`Animated preview for ${project.title}`}
            className="w-full h-full object-cover"
            onError={handleMediaError}
            onLoad={handleMediaLoad}
            data-testid="project-media-gif"
          />
        )

      case 'image':
      default:
        return (
          <img
            src={project.previewMedia.url}
            alt={`Preview image for ${project.title}`}
            className="w-full h-full object-cover"
            onError={handleMediaError}
            onLoad={handleMediaLoad}
            data-testid="project-media-image"
          />
        )
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${project.title}`}
      className="group cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      data-testid="project-card"
    >
      {/* Media Preview */}
      <div 
        className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
        data-testid="project-media-container"
      >
        {renderMedia()}
        
        {/* Loading Indicator */}
        {isLoading && !mediaError && project.previewMedia && (
          <div 
            className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
            data-testid="project-media-loading"
          >
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
              ⭐ Featured
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[project.status]}`}>
            {project.status.replace('-', ' ')}
          </span>
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                View Details
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        {/* Title and Category */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
            {project.title}
          </h3>
          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${categoryColors[project.category]}`}>
            {project.category.replace('-', ' ')}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 leading-relaxed">
          {project.shortDescription}
        </p>
        
        {/* Primary Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.primaryTech.slice(0, 3).map((tech) => (
            <span 
              key={tech}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
            >
              {tech}
            </span>
          ))}
          {project.primaryTech.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">
              +{project.primaryTech.length - 3} more
            </span>
          )}
        </div>
        
        {/* Links Preview */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {project.links.slice(0, 2).map((link) => (
              <div
                key={link.type}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
              >
                {link.type === 'github' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                )}
                {link.type === 'live' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
                {link.type === 'demo' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12l-2 5H9l-2-5z" />
                  </svg>
                )}
                <span className="capitalize">{link.type}</span>
              </div>
            ))}
          </div>
          
          {/* Date */}
          {project.endDate && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(project.endDate).getFullYear()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
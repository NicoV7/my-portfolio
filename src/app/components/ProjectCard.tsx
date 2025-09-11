'use client'

import { motion } from 'framer-motion'
import { Project } from '../../types/project'

type ProjectCardProps = {
  project: Project
  onClick: () => void
  index: number
}

const statusColors = {
  'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 night:bg-green-800 night:text-green-100',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 night:bg-blue-800 night:text-blue-100',
  'planned': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 night:bg-yellow-700 night:text-yellow-100',
  'archived': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 night:bg-gray-700 night:text-gray-100'
}

const categoryColors = {
  'web-app': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 night:bg-purple-800 night:text-purple-100',
  'mobile': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 night:bg-indigo-800 night:text-indigo-100',
  'desktop': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 night:bg-cyan-800 night:text-cyan-100',
  'library': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 night:bg-pink-800 night:text-pink-100',
  'api': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 night:bg-emerald-800 night:text-emerald-100',
  'tool': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 night:bg-orange-800 night:text-orange-100',
  'game': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 night:bg-red-800 night:text-red-100',
  'graphics': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 night:bg-teal-800 night:text-teal-100',
  'security': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 night:bg-amber-800 night:text-amber-100',
  'other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 night:bg-gray-700 night:text-gray-100'
}

export default function ProjectCard({ project, onClick, index }: ProjectCardProps) {

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${project.title}`}
      className="group cursor-pointer bg-white dark:bg-gray-800 night:bg-gray-900 border border-gray-200 dark:border-gray-700 night:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 night:hover:border-gray-600 transition-all duration-300 focus:ring-2 focus:ring-blue-500 night:focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 night:focus:ring-offset-black"
      data-testid="project-card"
    >
      <div className="relative px-6 pt-6">
        {/* Status Badge */}
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[project.status]}`}>
            {project.status.replace('-', ' ')}
          </span>
        </div>
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-6 right-6">
            <div className="bg-yellow-400 text-yellow-900 night:bg-orange-500 night:text-white px-2 py-1 rounded-full text-xs font-semibold">
              ⭐ Featured
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        {/* Title and Category */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white night:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 night:group-hover:text-orange-400 transition-colors duration-200 line-clamp-2">
            {project.title}
          </h3>
          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${categoryColors[project.category]}`}>
            {project.category.replace('-', ' ')}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 night:text-gray-200 text-sm line-clamp-2 mb-4 leading-relaxed">
          {project.shortDescription}
        </p>
        
        {/* Primary Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.primaryTech.slice(0, 3).map((tech) => (
            <span 
              key={tech}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 night:bg-gray-800 text-gray-700 dark:text-gray-300 night:text-gray-200 rounded text-xs font-medium"
            >
              {tech}
            </span>
          ))}
          {project.primaryTech.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 night:bg-gray-800 text-gray-500 dark:text-gray-400 night:text-gray-300 rounded text-xs">
              +{project.primaryTech.length - 3} more
            </span>
          )}
        </div>
        
        {/* Links Preview */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {project.links.slice(0, 2).map((link, index) => (
              <div
                key={`${link.type}-${index}`}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 night:text-gray-300"
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
            <span className="text-xs text-gray-400 dark:text-gray-500 night:text-gray-400">
              {new Date(project.endDate).getFullYear()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
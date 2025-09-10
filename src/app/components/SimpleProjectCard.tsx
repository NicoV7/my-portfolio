'use client'

import { Project } from '../../types/project'

type SimpleProjectCardProps = {
  project: Project
  onClick: () => void
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

export default function SimpleProjectCard({ project, onClick }: SimpleProjectCardProps) {

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
    >
      {/* Header */}
      <div className="relative px-4 pt-4">
        {/* Status Badge */}
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[project.status]}`}>
            {project.status.replace('-', ' ')}
          </span>
        </div>
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4">
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
              ⭐
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Category */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${categoryColors[project.category]}`}>
            {project.category.replace('-', ' ')}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
          {project.shortDescription}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-1 mb-3">
          {project.primaryTech.slice(0, 3).map((tech) => (
            <span 
              key={tech}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
            >
              {tech}
            </span>
          ))}
          {project.primaryTech.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">
              +{project.primaryTech.length - 3}
            </span>
          )}
        </div>
        
        {/* Links */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex gap-3">
            {project.links.slice(0, 2).map((link) => (
              <span key={link.type} className="flex items-center gap-1">
                {link.type === 'github' && <span>🔗</span>}
                {link.type === 'live' && <span>🌐</span>}
                {link.type === 'demo' && <span>▶️</span>}
                <span className="capitalize">{link.type}</span>
              </span>
            ))}
          </div>
          
          {project.endDate && (
            <span>{new Date(project.endDate).getFullYear()}</span>
          )}
        </div>
      </div>
    </div>
  )
}
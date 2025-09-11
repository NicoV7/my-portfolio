'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectFilter, ProjectSort, ProjectCategory, ProjectStatus } from '../../types/project'
import { getAllCategories, getAllTechnologies } from '../../data/projects'

type ProjectFiltersProps = {
  filters: ProjectFilter
  sort: ProjectSort
  onFiltersChange: (filters: ProjectFilter) => void
  onSortChange: (sort: ProjectSort) => void
  onClear: () => void
  resultsCount: number
}

export default function ProjectFilters({ 
  filters, 
  sort, 
  onFiltersChange, 
  onSortChange, 
  onClear, 
  resultsCount 
}: ProjectFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const categories = getAllCategories()
  const technologies = getAllTechnologies()

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.category || []
    const newCategories = currentCategories.includes(category as ProjectCategory)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category as ProjectCategory]
    
    onFiltersChange({ ...filters, category: newCategories.length > 0 ? newCategories : undefined })
  }

  const handleTechnologyToggle = (tech: string) => {
    const currentTech = filters.technologies || []
    const newTech = currentTech.includes(tech)
      ? currentTech.filter(t => t !== tech)
      : [...currentTech, tech]
    
    onFiltersChange({ ...filters, technologies: newTech.length > 0 ? newTech : undefined })
  }

  const handleStatusToggle = (status: string) => {
    const currentStatus = filters.status || []
    const newStatus = currentStatus.includes(status as ProjectStatus)
      ? currentStatus.filter(s => s !== status)
      : [...currentStatus, status as ProjectStatus]
    
    onFiltersChange({ ...filters, status: newStatus.length > 0 ? newStatus : undefined })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== undefined
  )

  return (
    <div className="bg-white dark:bg-gray-800 night:bg-gray-950 border border-gray-200 dark:border-gray-700 night:border-gray-800 rounded-xl p-4 mb-6">
      {/* Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white night:text-white">
            Filters
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 night:text-gray-300">
            {resultsCount} project{resultsCount !== 1 ? 's' : ''}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="text-sm text-blue-600 dark:text-blue-400 night:text-orange-400 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        
        {/* Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400 night:text-gray-300">
            Sort by:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ProjectSort)}
            className="px-3 py-1 bg-gray-50 dark:bg-gray-700 night:bg-gray-900 border border-gray-200 dark:border-gray-600 night:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white night:text-white focus:ring-2 focus:ring-blue-500 night:focus:ring-orange-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="featured">Featured First</option>
            <option value="status">By Status</option>
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => onFiltersChange({ ...filters, featured: !filters.featured })}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filters.featured
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 night:bg-orange-600 night:text-white'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 night:bg-gray-900 night:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 night:hover:bg-gray-800'
          }`}
        >
          ⭐ Featured Only
        </button>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 night:bg-orange-600 night:text-white rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 night:hover:bg-orange-700 transition-colors flex items-center gap-1"
        >
          Advanced Filters
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Categories */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.category?.includes(category as ProjectCategory) || false}
                        onChange={() => handleCategoryToggle(category)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {category.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Status</h4>
                <div className="space-y-2">
                  {['completed', 'in-progress', 'planned', 'archived'].map(status => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.status?.includes(status as ProjectStatus) || false}
                        onChange={() => handleStatusToggle(status)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {status.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Technologies</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {technologies.slice(0, 15).map(tech => (
                    <label key={tech} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.technologies?.includes(tech) || false}
                        onChange={() => handleTechnologyToggle(tech)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tech}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
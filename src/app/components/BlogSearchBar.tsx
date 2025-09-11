'use client'

import { motion } from 'framer-motion'

interface BlogSearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  searching: boolean
  resultsCount?: number
}

export default function BlogSearchBar({
  searchTerm,
  onSearchChange,
  searching,
  resultsCount
}: BlogSearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-8"
    >
      <div className="relative max-w-2xl mx-auto">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg 
            className={`h-5 w-5 ${searching ? 'animate-spin' : ''} text-gray-400`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {searching ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            )}
          </svg>
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search blog posts by title, content, or tags..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 night:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-gray-800 night:bg-black text-gray-900 dark:text-white night:text-white placeholder-gray-500 dark:placeholder-gray-400 night:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 night:focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
        />

        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 night:hover:text-gray-200 transition-colors duration-200"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search results info */}
      {searchTerm && !searching && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 night:text-gray-400">
            {resultsCount !== undefined ? (
              resultsCount === 0 ? (
                <>No results found for <span className="font-medium">"{searchTerm}"</span></>
              ) : (
                <>Found <span className="font-medium">{resultsCount}</span> {resultsCount === 1 ? 'post' : 'posts'} for <span className="font-medium">"{searchTerm}"</span></>
              )
            ) : null}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
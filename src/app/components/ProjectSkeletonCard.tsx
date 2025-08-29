'use client'

import { motion } from 'framer-motion'

type ProjectSkeletonCardProps = {
  index: number
}

export default function ProjectSkeletonCard({ index }: ProjectSkeletonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm"
    >
      {/* Skeleton Thumbnail */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 animate-pulse">
        <div className="absolute top-3 left-3 bg-gray-300 dark:bg-gray-600 rounded-full w-16 h-6"></div>
        <div className="absolute top-3 right-3 bg-gray-300 dark:bg-gray-600 rounded-full w-20 h-6"></div>
      </div>
      
      {/* Skeleton Content */}
      <div className="p-6">
        {/* Title skeleton */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-6 w-3/4 mb-2 animate-pulse"></div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-16 h-6 ml-3 animate-pulse"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-full animate-pulse"></div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-2/3 animate-pulse"></div>
        </div>
        
        {/* Tech tags skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="bg-gray-200 dark:bg-gray-700 rounded h-6 w-16 animate-pulse"></div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded h-6 w-20 animate-pulse"></div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded h-6 w-14 animate-pulse"></div>
        </div>
        
        {/* Links skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-12 animate-pulse"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-8 animate-pulse"></div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-12 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}
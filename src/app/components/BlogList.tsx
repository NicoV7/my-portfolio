'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import BlogCard from './BlogCard'
import { BlogPost } from '../../types/blog'

interface BlogListProps {
  posts: BlogPost[]
  loading: boolean
  error: string | null
  hasMore: boolean
  onLoadMore: () => void
  searchTerm?: string
}

export default function BlogList({ 
  posts, 
  loading, 
  error, 
  hasMore, 
  onLoadMore,
  searchTerm = ''
}: BlogListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loading && !searchTerm) {
          onLoadMore()
        }
      },
      { threshold: 1.0 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasMore, loading, onLoadMore, searchTerm])

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white night:text-white mb-2">
            Error loading blog posts
          </h3>
          <p className="text-gray-500 dark:text-gray-400 night:text-gray-400">
            {error}
          </p>
        </div>
      </motion.div>
    )
  }

  if (posts.length === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white night:text-white mb-2">
            {searchTerm ? 'No posts found' : 'No blog posts yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 night:text-gray-400">
            {searchTerm 
              ? `No posts match "${searchTerm}". Try different keywords.`
              : 'Check back soon for new content!'
            }
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Blog posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {posts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <BlogPostSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {/* Load more trigger (invisible) */}
      {hasMore && !searchTerm && (
        <div ref={loadMoreRef} className="h-4" />
      )}

      {/* End message */}
      {!hasMore && posts.length > 0 && !searchTerm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-gray-500 dark:text-gray-400 night:text-gray-400">
            You&apos;ve reached the end! Thanks for reading. 📚
          </p>
        </motion.div>
      )}
    </div>
  )
}

function BlogPostSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 night:bg-black border border-gray-200 dark:border-gray-700 night:border-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse">
      {/* Cover image skeleton */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 night:bg-gray-900" />
      
      {/* Content skeleton */}
      <div className="p-6">
        {/* Date and reading time */}
        <div className="flex items-center mb-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded w-20" />
          <div className="mx-2 w-1 h-1 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded w-16" />
        </div>
        
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded mb-3 w-3/4" />
        
        {/* Excerpt */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded w-2/3" />
        </div>
        
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded-full w-16" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded-full w-12" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded-full w-20" />
        </div>
        
        {/* Bottom section */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded w-20" />
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded-full" />
            <div className="ml-2 h-4 bg-gray-200 dark:bg-gray-700 night:bg-gray-800 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
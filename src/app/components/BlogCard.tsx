'use client'

import { motion } from 'framer-motion'
import { BlogPost } from '../../types/blog'

interface BlogCardProps {
  post: BlogPost
  index?: number
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'tutorial': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 night:bg-blue-900/20 night:text-blue-400',
      'project-deep-dive': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 night:bg-purple-900/20 night:text-purple-400',
      'tech-insights': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 night:bg-green-900/20 night:text-green-400',
      'career': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 night:bg-orange-900/20 night:text-orange-400',
      'tools': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 night:bg-gray-900/20 night:text-gray-400',
      'other': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 night:bg-gray-900/20 night:text-gray-400'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-800 night:bg-black border border-gray-200 dark:border-gray-700 night:border-gray-800 rounded-xl shadow-sm hover:shadow-lg dark:shadow-gray-900/20 night:shadow-orange-900/20 transition-all duration-300 overflow-hidden"
    >
      {/* Featured indicator */}
      {post.featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 night:bg-orange-900/30 night:text-orange-400">
            ⭐ Featured
          </span>
        </div>
      )}

      {/* Cover image placeholder */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 night:from-gray-900 night:to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 night:from-orange-500/10 night:to-red-500/10" />
        <div className="absolute bottom-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
            {post.category.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date and reading time */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 night:text-gray-400 mb-3">
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          <span className="mx-2">•</span>
          <span>{post.readingTime} min read</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white night:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 night:group-hover:text-orange-500 transition-colors duration-200">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 night:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 night:bg-gray-800 night:text-gray-300"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 night:bg-gray-800 night:text-gray-300">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Read more link */}
        <div className="flex items-center justify-between">
          <button className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 night:text-orange-500 night:hover:text-orange-400 font-medium text-sm transition-colors duration-200">
            Read more
            <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Author info */}
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 night:from-orange-500 night:to-red-500 flex items-center justify-center text-white text-xs font-semibold">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 night:text-gray-400">
              {post.author}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
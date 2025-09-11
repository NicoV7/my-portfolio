'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import AnimatedBackground from '../components/AnimatedBackground'
import AnimatedPageWrapper from '../components/AnimatedPageWrapper'
import BlogList from '../components/BlogList'
import BlogSearchBar from '../components/BlogSearchBar'
import { useBlogPosts } from '../../hooks/useBlogPosts'

export default function BlogPage() {
  const {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    searchTerm,
    setSearchTerm,
    searchResults,
    searching
  } = useBlogPosts()

  const displayPosts = searchTerm ? searchResults : posts
  const resultsCount = searchTerm ? searchResults.length : undefined

  return (
    <AnimatedPageWrapper>
      <main className="relative min-h-screen bg-gray-50 dark:bg-gray-900 night:bg-black transition-colors duration-300">
        <AnimatedBackground variant="particles" intensity="subtle" />
        
        <div className="relative z-20 container mx-auto px-4 py-8 max-w-7xl">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <nav className="flex items-center justify-center gap-6">
              <Link 
                href="/" 
                className="text-gray-600 dark:text-gray-300 night:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 night:hover:text-orange-500 transition-colors duration-200"
              >
                Home
              </Link>
              <span className="text-gray-400 dark:text-gray-600 night:text-gray-600">•</span>
              <Link 
                href="/projects" 
                className="text-gray-600 dark:text-gray-300 night:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 night:hover:text-orange-500 transition-colors duration-200"
              >
                Projects
              </Link>
              <span className="text-gray-400 dark:text-gray-600 night:text-gray-600">•</span>
              <span className="text-blue-600 dark:text-blue-400 night:text-orange-500 font-medium">
                Blog
              </span>
            </nav>
          </motion.div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white night:text-orange-500 mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 night:text-white max-w-3xl mx-auto leading-relaxed">
              Thoughts on software development, technology insights, and lessons learned from building things. 
              Join me on this journey of continuous learning and discovery.
            </p>
          </motion.div>

          {/* Search Bar */}
          <BlogSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searching={searching}
            resultsCount={resultsCount}
          />

          {/* Featured Posts Section - only show when not searching */}
          {!searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white night:text-orange-500 mb-8 text-center">
                ⭐ Featured Posts
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {posts
                  .filter(post => post.featured)
                  .slice(0, 2)
                  .map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      className="transform scale-105"
                    >
                      <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/5 dark:to-purple-400/5 night:from-orange-500/5 night:to-red-500/5 p-1 rounded-2xl">
                        <div className="bg-white dark:bg-gray-800 night:bg-black rounded-xl">
                          <div className="p-6">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 night:text-gray-400 mb-3">
                              <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </time>
                              <span className="mx-2">•</span>
                              <span>{post.readingTime} min read</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white night:text-white mb-3">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 night:text-gray-300 mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 night:bg-orange-900/30 night:text-orange-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <button className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 night:text-orange-500 night:hover:text-orange-400 font-medium transition-colors duration-200">
                              Read featured post
                              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* All Posts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {!searchTerm && (
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white night:text-orange-500">
                  All Posts
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400 night:text-gray-400">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </div>
              </div>
            )}

            <BlogList
              posts={displayPosts}
              loading={loading}
              error={error}
              hasMore={hasMore}
              onLoadMore={loadMore}
              searchTerm={searchTerm}
            />
          </motion.div>
        </div>
      </main>
    </AnimatedPageWrapper>
  )
}
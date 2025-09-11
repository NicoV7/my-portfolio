'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AnimatedBackground from '../../components/AnimatedBackground'
import AnimatedPageWrapper from '../../components/AnimatedPageWrapper'
import { blogPosts } from '../../../data/blogPosts'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params)
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  // Split content into paragraphs and handle formatting
  const formatContent = (content: string) => {
    const sections = content.split('\n\n')
    return sections.map((section, index) => {
      // Handle headers
      if (section.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white night:text-orange-500 mt-8 mb-4">
            {section.replace('## ', '')}
          </h2>
        )
      }
      
      if (section.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-gray-900 dark:text-white night:text-white mt-6 mb-3">
            {section.replace('### ', '')}
          </h3>
        )
      }

      // Handle code blocks (basic handling)
      if (section.includes('```')) {
        const codeContent = section.replace(/```[\w]*\n?/g, '').replace(/```/g, '')
        return (
          <pre key={index} className="bg-gray-100 dark:bg-gray-800 night:bg-gray-900 rounded-lg p-4 overflow-x-auto my-4">
            <code className="text-sm text-gray-800 dark:text-gray-200 night:text-gray-200">
              {codeContent}
            </code>
          </pre>
        )
      }

      // Handle bullet points
      if (section.includes('- ')) {
        const items = section.split('\n').filter(line => line.startsWith('- '))
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300 night:text-gray-300">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="ml-4">
                {item.replace('- ', '')}
              </li>
            ))}
          </ul>
        )
      }

      // Handle bold text
      if (section.includes('**')) {
        const parts = section.split('**')
        return (
          <p key={index} className="text-gray-700 dark:text-gray-300 night:text-gray-300 mb-4 leading-relaxed">
            {parts.map((part, partIndex) => 
              partIndex % 2 === 1 ? (
                <strong key={partIndex} className="font-semibold text-gray-900 dark:text-white night:text-white">
                  {part}
                </strong>
              ) : part
            )}
          </p>
        )
      }

      // Regular paragraphs
      return (
        <p key={index} className="text-gray-700 dark:text-gray-300 night:text-gray-300 mb-4 leading-relaxed">
          {section}
        </p>
      )
    })
  }

  return (
    <AnimatedPageWrapper>
      <main className="relative min-h-screen bg-gray-50 dark:bg-gray-900 night:bg-black transition-colors duration-300">
        <AnimatedBackground variant="particles" intensity="subtle" />
        
        <div className="relative z-20 container mx-auto px-4 py-8 max-w-4xl">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <nav className="flex items-center justify-center gap-6 mb-4">
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
              <Link 
                href="/blog" 
                className="text-gray-600 dark:text-gray-300 night:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 night:hover:text-orange-500 transition-colors duration-200"
              >
                Blog
              </Link>
            </nav>
            
            {/* Back to blog link */}
            <div className="flex justify-center">
              <Link 
                href="/blog"
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 night:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 night:hover:text-orange-500 transition-colors duration-200"
              >
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all posts
              </Link>
            </div>
          </motion.div>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Category and featured badge */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                {post.category.replace('-', ' ')}
              </span>
              {post.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 night:bg-orange-900/30 night:text-orange-400">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white night:text-orange-500 mb-6 text-center leading-tight">
              {post.title}
            </h1>

            {/* Meta information */}
            <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 night:text-gray-400 mb-8">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 night:from-orange-500 night:to-red-500 flex items-center justify-center text-white text-sm font-semibold mr-3">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300 night:text-gray-300">
                  {post.author}
                </span>
              </div>
              <span className="mx-3">•</span>
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
              <span className="mx-3">•</span>
              <span>{post.readingTime} min read</span>
            </div>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 dark:text-gray-300 night:text-gray-300 text-center max-w-3xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>
          </motion.header>

          {/* Decorative Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 night:from-orange-500/10 night:to-red-500/10 relative overflow-hidden rounded-2xl shadow-sm flex items-center justify-center">
              <div className="text-center">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getCategoryColor(post.category)}`}>
                  {post.category.replace('-', ' ')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose prose-lg dark:prose-invert night:prose-invert max-w-none"
          >
            <div className="bg-white dark:bg-gray-800 night:bg-black rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200 dark:border-gray-700 night:border-gray-800">
              {formatContent(post.content)}
            </div>
          </motion.article>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <div className="bg-white dark:bg-gray-800 night:bg-black rounded-2xl p-6 border border-gray-200 dark:border-gray-700 night:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white night:text-white mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 night:bg-gray-800 night:text-gray-300 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 night:hover:bg-orange-900/30 night:hover:text-orange-400 transition-colors duration-200 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Navigation to other posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <div className="flex justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 night:bg-orange-600 night:hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                View All Posts
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </AnimatedPageWrapper>
  )
}
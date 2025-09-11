'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import AnimatedBackground from '../../components/AnimatedBackground'
import AnimatedPageWrapper from '../../components/AnimatedPageWrapper'

export default function BlogPostNotFound() {
  return (
    <AnimatedPageWrapper>
      <main className="relative min-h-screen bg-gray-50 dark:bg-gray-900 night:bg-black transition-colors duration-300">
        <AnimatedBackground variant="particles" intensity="subtle" />
        
        <div className="relative z-20 container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-lg"
            >
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white night:text-orange-500 mb-4">
                404
              </h1>
              
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 night:text-white mb-4">
                Blog Post Not Found
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 night:text-gray-400 mb-8 leading-relaxed">
                The blog post you&apos;re looking for doesn&apos;t exist or may have been moved.
                Let&apos;s get you back to reading some great content.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 night:bg-orange-600 night:hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Blog
                </Link>
                
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 night:border-gray-700 bg-white dark:bg-gray-800 night:bg-black text-gray-700 dark:text-gray-300 night:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 night:hover:bg-gray-900 font-medium rounded-lg transition-colors duration-200"
                >
                  Go Home
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </AnimatedPageWrapper>
  )
}
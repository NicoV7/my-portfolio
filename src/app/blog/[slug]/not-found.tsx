'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import AnimatedPageWrapper from '../../components/AnimatedPageWrapper'

export default function BlogPostNotFound() {
 return (
 <AnimatedPageWrapper>
 <main className="relative min-h-screen bg-void transition-colors duration-300">
 
 <div className="relative z-20 container mx-auto px-4 pt-28 pb-8 max-w-4xl">
 <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="max-w-lg"
 >
 <h1 className="text-6xl font-bold text-platinum mb-4">
 404
 </h1>
 
 <h2 className="text-2xl font-semibold text-platinum mb-4">
 Blog Post Not Found
 </h2>
 
 <p className="text-silver mb-8 leading-relaxed">
 The blog post you&apos;re looking for doesn&apos;t exist or may have been moved.
 Let&apos;s get you back to reading some great content.
 </p>
 
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link
 href="/blog"
 className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-deep text-white font-medium rounded-lg transition-colors duration-200"
 >
 <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
 </svg>
 Back to Blog
 </Link>
 
 <Link
 href="/"
 className="inline-flex items-center px-6 py-3 border border-chrome-line bg-graphite text-silver hover:bg-void font-medium rounded-lg transition-colors duration-200"
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
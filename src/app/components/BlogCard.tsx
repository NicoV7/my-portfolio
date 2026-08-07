'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
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
 'tutorial': 'bg-blue-100 text-blue-800 ',
 'project-deep-dive': 'bg-purple-100 text-purple-800 ',
 'tech-insights': 'bg-green-100 text-green-800 ',
 'career': 'bg-orange-100 text-orange-800 ',
 'tools': 'bg-graphite text-platinum ',
 'other': 'bg-graphite text-platinum '
 }
 return colors[category as keyof typeof colors] || colors.other
 }

 return (
 <Link href={`/blog/${post.slug}`} className="block">
 <motion.article
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: index * 0.1 }}
 className="group relative bg-graphite border border-chrome-line rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:scale-[1.02]"
 >
 {/* Featured indicator */}
 {post.featured && (
 <div className="absolute top-4 right-4 z-10">
 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ">
 ⭐ Featured
 </span>
 </div>
 )}

 {/* Header with category */}
 <div className="h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 relative overflow-hidden flex items-center justify-center">
 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
 {post.category.replace('-', ' ')}
 </span>
 </div>

 {/* Content */}
 <div className="p-6">
 {/* Date and reading time */}
 <div className="flex items-center text-sm text-silver mb-3">
 <time dateTime={post.publishedAt}>
 {formatDate(post.publishedAt)}
 </time>
 <span className="mx-2">•</span>
 <span>{post.readingTime} min read</span>
 </div>

 {/* Title */}
 <h3 className="text-xl font-semibold text-platinum mb-3 group-hover:text-accent transition-colors duration-200">
 {post.title}
 </h3>

 {/* Excerpt */}
 <p className="text-silver mb-4 line-clamp-3">
 {post.excerpt}
 </p>

 {/* Tags */}
 <div className="flex flex-wrap gap-2 mb-4">
 {post.tags.slice(0, 3).map((tag) => (
 <span
 key={tag}
 className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-graphite text-silver "
 >
 {tag}
 </span>
 ))}
 {post.tags.length > 3 && (
 <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-graphite text-silver ">
 +{post.tags.length - 3} more
 </span>
 )}
 </div>

 {/* Read more link */}
 <div className="flex items-center justify-between">
 <span className="inline-flex items-center text-accent hover:text-accent-hot font-medium text-sm transition-colors duration-200">
 Read more
 <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 </span>

 {/* Author info */}
 <div className="flex items-center">
 <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
 {post.author.split(' ').map(n => n[0]).join('')}
 </div>
 <span className="ml-2 text-sm text-silver ">
 {post.author}
 </span>
 </div>
 </div>
 </div>
 </motion.article>
 </Link>
 )
}
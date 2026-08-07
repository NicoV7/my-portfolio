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
 className="bg-graphite border border-chrome-line rounded-xl overflow-hidden shadow-sm"
 >
 {/* Skeleton Thumbnail */}
 <div className="relative h-48 bg-slate-raised animate-pulse">
 <div className="absolute top-3 left-3 bg-slate-raised rounded-full w-16 h-6"></div>
 <div className="absolute top-3 right-3 bg-slate-raised rounded-full w-20 h-6"></div>
 </div>
 
 {/* Skeleton Content */}
 <div className="p-6">
 {/* Title skeleton */}
 <div className="flex items-start justify-between mb-3">
 <div className="flex-1">
 <div className="bg-slate-raised rounded h-6 w-3/4 mb-2 animate-pulse"></div>
 </div>
 <div className="bg-slate-raised rounded-full w-16 h-6 ml-3 animate-pulse"></div>
 </div>
 
 {/* Description skeleton */}
 <div className="space-y-2 mb-4">
 <div className="bg-slate-raised rounded h-4 w-full animate-pulse"></div>
 <div className="bg-slate-raised rounded h-4 w-2/3 animate-pulse"></div>
 </div>
 
 {/* Tech tags skeleton */}
 <div className="flex gap-2 mb-4">
 <div className="bg-slate-raised rounded h-6 w-16 animate-pulse"></div>
 <div className="bg-slate-raised rounded h-6 w-20 animate-pulse"></div>
 <div className="bg-slate-raised rounded h-6 w-14 animate-pulse"></div>
 </div>
 
 {/* Links skeleton */}
 <div className="flex items-center justify-between">
 <div className="flex gap-4">
 <div className="bg-slate-raised rounded h-4 w-12 animate-pulse"></div>
 <div className="bg-slate-raised rounded h-4 w-8 animate-pulse"></div>
 </div>
 <div className="bg-slate-raised rounded h-4 w-12 animate-pulse"></div>
 </div>
 </div>
 </motion.div>
 )
}
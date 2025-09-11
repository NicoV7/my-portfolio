'use client';

import { motion } from 'framer-motion'
import Link from 'next/link'
import AnimatedBackground from './components/AnimatedBackground'
import AnimatedPageWrapper from './components/AnimatedPageWrapper'

export default function Home() {
  return (
    <AnimatedPageWrapper>
      <main className="relative min-h-screen flex flex-col items-center justify-center px-8 bg-white text-black dark:bg-gray-900 dark:text-white night:bg-black night:text-white transition-colors duration-300">
      <AnimatedBackground variant="particles" intensity="medium" />
      <div className="relative z-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-blue-600 dark:text-blue-400 night:text-orange-500"
        >
          Nico Vega
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 text-xl text-gray-700 dark:text-gray-300 night:text-white"
        >
          Full Stack Developer | UC Berkeley Computer Science Alumni
        </motion.p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Link
              href="/projects"
              className="text-lg font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-300 night:bg-orange-600 night:hover:bg-orange-700 px-6 py-3 rounded-lg transition"
            >
              View My Projects
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Link
              href="/blog"
              className="text-lg font-medium text-blue-600 dark:text-blue-400 night:text-orange-500 hover:text-blue-700 dark:hover:text-blue-300 night:hover:text-orange-400 border-2 border-blue-600 dark:border-blue-400 night:border-orange-500 hover:border-blue-700 dark:hover:border-blue-300 night:hover:border-orange-400 px-6 py-3 rounded-lg transition"
            >
              Read My Blog
            </Link>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 text-xl text-gray-700 dark:text-gray-300 night:text-white"
        >
          AI, Databases, Graphics, Security, and End-to-End Solutions
        </motion.p>
      </div>
      </main>
    </AnimatedPageWrapper>
  )
}
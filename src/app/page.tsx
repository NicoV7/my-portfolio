'use client';

import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold text-blue-600 dark:text-blue-400"
      >
        Nico Vega
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-4 text-xl text-gray-700 dark:text-gray-300 text-center"
      >
        Full Stack Developer | UC Berkeley Alum
      </motion.p>

      <motion.a
        href="/projects"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 text-lg font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-300 px-4 py-2 rounded-lg transition"
      >
        View My Projects
      </motion.a>
    </main>
  )
}
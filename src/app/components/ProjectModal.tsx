'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Project } from '../../types/project'

type ProjectModalProps = {
  isOpen: boolean
  onClose: () => void
  project: Project | null
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on ESC key press
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  // Focus trap logic
  useEffect(() => {
    if (!isOpen) return
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusableElements || focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    // Focus first element when modal opens
    firstElement.focus()

    return () => {
      document.removeEventListener('keydown', handleTab)
    }
  }, [isOpen])

  if (!isOpen || !project) return null

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-80 modal-backdrop flex items-center justify-center z-50 p-4"
      >
        <motion.div
          key="modal"
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          tabIndex={-1}
          className="bg-white dark:bg-gray-900 night:bg-gray-950 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl outline-none"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full text-white transition-all duration-200"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Hero Image */}
          {project.heroImage && (
            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-xl bg-gradient-to-br from-blue-400 to-purple-500">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-8xl font-bold opacity-30">
                  {project.title.charAt(0)}
                </div>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 id="modal-title" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white night:text-white mb-2">
                    {project.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      project.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      project.status === 'planned' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 night:bg-gray-700 night:text-gray-100'
                    }`}>
                      {project.status.replace('-', ' ')}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm font-medium capitalize">
                      {project.category.replace('-', ' ')}
                    </span>
                    {project.featured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Project dates */}
              <div className="text-sm text-gray-500 dark:text-gray-400 night:text-gray-300 mb-4">
                {project.endDate ? (
                  <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                ) : (
                  <span>Started {new Date(project.startDate).toLocaleDateString()}</span>
                )}
                {project.teamSize && project.teamSize > 1 && (
                  <span className="ml-4">Team: {project.teamSize} members</span>
                )}
                {project.myRole && (
                  <span className="ml-4">Role: {project.myRole}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p id="modal-desc" className="text-gray-700 dark:text-gray-300 night:text-gray-200 leading-relaxed text-lg">
                {project.fullDescription}
              </p>
            </div>

            {/* Technology Stack */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white night:text-white mb-4">Technology Stack</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(project.technologies).map(([category, techs]) => (
                  techs && techs.length > 0 && (
                    <div key={category} className="">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 night:text-gray-200 capitalize mb-2">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      <div className="flex flex-wrap gap-2">
                        {techs.map((tech) => (
                          <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 night:bg-gray-900 text-gray-700 dark:text-gray-300 night:text-gray-300 rounded-md text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white night:text-white mb-4">Features</h3>
                <div className="space-y-3">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                        feature.implemented ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 night:bg-green-800 night:text-green-200' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 night:bg-gray-800 night:text-gray-400'
                      }`}>
                        {feature.implemented ? '✓' : '○'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white night:text-white">{feature.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 night:text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges & Learnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {project.challenges && project.challenges.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white night:text-white mb-4">Challenges</h3>
                  <ul className="space-y-2">
                    {project.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2"></span>
                        <span className="text-gray-600 dark:text-gray-400 night:text-gray-300 text-sm">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {project.learnings && project.learnings.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white night:text-white mb-4">Key Learnings</h3>
                  <ul className="space-y-2">
                    {project.learnings.map((learning, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></span>
                        <span className="text-gray-600 dark:text-gray-400 night:text-gray-300 text-sm">{learning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Links */}
            {project.links && project.links.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex flex-wrap gap-4">
                  {project.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                      {link.type === 'github' && (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {link.type === 'live' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                      {link.type === 'demo' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12l-2 5H9l-2-5z" />
                        </svg>
                      )}
                      {link.type === 'video' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12l-2 5H9l-2-5z" />
                        </svg>
                      )}
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
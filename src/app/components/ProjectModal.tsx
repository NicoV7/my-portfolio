'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'

type ProjectModalProps = {
  isOpen: boolean
  onClose: () => void
  project: {
    name: string
    description: string
    stack: string[]
    github: string
    live?: string
    details?: string
  } | null
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
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      >
        <motion.div
          key="modal"
          ref={modalRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          tabIndex={-1}
          className="bg-white dark:bg-gray-900 rounded-lg max-w-lg w-full p-6 shadow-lg outline-none"
        >
          <h2 id="modal-title" className="text-3xl font-bold mb-2 text-black dark:text-white">
            {project.name}
          </h2>
          <p id="modal-desc" className="mb-4 text-gray-700 dark:text-gray-300">
            {project.details || project.description}
          </p>
          <p className="mb-4 text-blue-600 dark:text-blue-400">
            Stack: {project.stack.join(', ')}
          </p>
          <div className="flex space-x-4">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500 dark:text-blue-300"
            >
              GitHub
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500 dark:text-blue-300"
              >
                Live Demo
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
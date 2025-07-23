'use client'

import { useState } from 'react'
import FadeInOnScroll from '../components/FadeInOnScroll'
import ProjectModal from '../components/ProjectModal'

const projects = [
  {
    name: 'Chat App',
    description: 'Real-time chat with Socket.io and MongoDB',
    stack: ['Next.js', 'Tailwind', 'Socket.io', 'MongoDB'],
    github: '#',
    live: '#',
    details:
      'This is a full-stack real-time chat application with user authentication, persistent rooms, and responsive design.',
  },
  {
    name: 'Job Tracker',
    description: 'Dashboard to manage applications',
    stack: ['Next.js', 'PostgreSQL', 'Prisma'],
    github: '#',
    details:
      'A sleek dashboard to track and analyze your job applications, built with Prisma ORM and PostgreSQL.',
  },
]

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)

  return (
    <main className="p-8 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-6">Projects</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, idx) => (
          <FadeInOnScroll key={project.name} delay={idx * 0.1}>
            <div
              onClick={() => setSelectedProject(project)}
              className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold">{project.name}</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{project.description}</p>
              <p className="text-sm text-blue-500 dark:text-blue-300 mt-2">
                {project.stack.join(', ')}
              </p>
            </div>
          </FadeInOnScroll>
        ))}
      </div>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject!}
      />
    </main>
  )
}
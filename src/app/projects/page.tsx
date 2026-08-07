'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Project } from '../../types/project'
import { useProjects } from '../../hooks/useProjects'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import ProjectFilters from '../components/ProjectFilters'
import ProjectSkeletonCard from '../components/ProjectSkeletonCard'

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const {
    projects: filteredProjects,
    featuredProjects,
    ucBerkeleyProjects,
    filters,
    sort,
    searchTerm,
    setFilters,
    setSort,
    setSearchTerm,
    clearFilters,
    hasActiveFilters,
    filteredCount,
  } = useProjects()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="relative z-10 min-h-screen bg-void">
      <div className="container mx-auto max-w-[var(--content)] px-6 pb-24 pt-32">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="eyebrow">All Work</p>
          <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-white-soft">
            The full garage.
          </h1>
          <p className="mt-4 max-w-[var(--prose)] text-lg text-silver">
            Everything I&apos;ve built — production platforms, AI systems, and
            research projects across social, fintech, insurance, healthcare, and
            graphics.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, technology, or description…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-[var(--radius-pill)] border border-chrome-line bg-graphite/60 py-3 pl-10 pr-3 text-platinum placeholder-silver/60 transition-all focus:border-accent/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <ProjectFilters
            filters={filters}
            sort={sort}
            onFiltersChange={setFilters}
            onSortChange={setSort}
            onClear={clearFilters}
            resultsCount={filteredCount}
          />
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectSkeletonCard key={index} index={index} />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <h3 className="mb-2 font-serif text-2xl text-white-soft">No projects found</h3>
            <p className="mb-4 text-silver">Try adjusting your search or filters.</p>
            <button
              onClick={clearFilters}
              className="rounded-[var(--radius-pill)] border border-accent/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-accent transition-colors hover:bg-accent/10"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Featured Projects Section */}
        {!hasActiveFilters && (
          <div className="mt-20">
            <p className="eyebrow mb-6">Featured</p>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {featuredProjects.slice(0, 4).map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* UC Berkeley Projects Section */}
        {!hasActiveFilters && ucBerkeleyProjects.length > 0 && (
          <div className="mt-20">
            <p className="eyebrow mb-6">UC Berkeley</p>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {ucBerkeleyProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </main>
  )
}

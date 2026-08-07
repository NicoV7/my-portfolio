'use client'

import { motion } from 'framer-motion'
import { Project } from '../../types/project'

type ProjectCardProps = {
  project: Project
  onClick: () => void
  index: number
}

const badge =
  'rounded-[var(--radius-pill)] border border-chrome-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em]'

export default function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3) }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${project.title}`}
      className="sheen group cursor-pointer overflow-hidden rounded-[var(--radius-card)] border border-chrome-line bg-graphite/50 transition-colors hover:border-accent/40"
      style={{ boxShadow: 'var(--shadow-card)' }}
      data-testid="project-card"
    >
      <div className="relative flex items-center justify-between px-6 pt-6">
        <span className={`${badge} text-silver`}>{project.status.replace('-', ' ')}</span>
        {project.featured && (
          <span className={`${badge} border-accent/40 text-accent`}>★ Featured</span>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 font-serif text-xl text-platinum transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          <span className={`${badge} shrink-0 text-silver`}>
            {project.category.replace('-', ' ')}
          </span>
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-silver">
          {project.shortDescription}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {project.primaryTech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-[var(--radius-pill)] border border-chrome-line px-2 py-1 font-mono text-[11px] text-silver"
            >
              {tech}
            </span>
          ))}
          {project.primaryTech.length > 3 && (
            <span className="rounded-[var(--radius-pill)] border border-chrome-line px-2 py-1 font-mono text-[11px] text-silver/60">
              +{project.primaryTech.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {project.links.slice(0, 2).map((link, i) => (
              <span
                key={`${link.type}-${i}`}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-silver/70"
              >
                {link.type}
              </span>
            ))}
          </div>
          {project.endDate && (
            <span className="font-mono text-xs text-silver/60">
              {new Date(project.endDate).getFullYear()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

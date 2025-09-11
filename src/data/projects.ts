import { Project } from '../types/project'

export const projects: Project[] = [
  {
    id: '1',
    slug: 'task-management-app',
    title: 'AI Task Manager',
    shortDescription: 'Productivity app with AI-enhanced project management',
    fullDescription: `A full-stack productivity app that integrates Django, PostgreSQL, and Docker with an AI assistant to help users organize, prioritize, and track tasks.
         Designed with a clean UI and RESTful API architecture to support seamless task creation, deadlines, and AI-driven recommendations.`,
    status: 'completed',
    category: 'web-app',
    featured: true,
    
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    lastUpdated: '2025-08-31',
    
    technologies: {
      frontend: ['React 18', 'JavaScript', 'React Query', 'Styled Components', 'HTML5/CSS', 'Lucide React', 'React Router'],
      backend: ['Django', 'Python', 'Redis'],
      database: ['PostgreSQL'],
      deployment: ['Docker', 'Render', 'Nginx'],
      tools: ['Claude API', 'Jest', 'Cypress', 'Docker']
    },
    primaryTech: ['React', 'JavaScript', 'Django', 'Docker', 'PostgreSQL', 'Python', 'HTML5/CSS'],
    
    images: [
      {
        url: '/projects/thumbnails/taskmanager-thumb.png',
        alt: 'Task manager dashboard',
        type: 'thumbnail'
      },
      {
        url: '/projects/screenshots/taskCreation.png',
        alt: 'Task Creation with AI breakdown of subtasks',
        type: 'gallery'
      }
    ],
    
    links: [
      { type: 'github', url: 'https://github.com/NicoV7/ai-task-manager', label: 'Source Code' },
      { type: 'demo', url: 'https://taskmanager-frontend-2nx3.onrender.com', label: 'Visit' }
    ],
    
    features: [
      { title: 'AI-Powered Task Creation', description: 'Generate tasks automatically from natural language input', implemented: true },
      { title: 'Smart Categorization', description: 'Automatically categorize tasks by type and priority', implemented: true },
      { title: 'AI Breakdown', description: 'Breaks down complex tasks into manageable subproblems', implemented: true },
      { title: 'Deadline Management', description: 'Set due dates with automated reminders', implemented: true },
      { title: 'Search & Filter', description: 'Quickly find tasks by keyword or status', implemented: true },
      { title: 'Persistent Storage', description: 'PostgreSQL database ensures reliable task saving', implemented: true },
      { title: 'Progress Tracking', description: 'View completion rates and pending workload', implemented: true },
      { title: 'Secure Authentication', description: 'User accounts protected with session-based auth', implemented: true },
      { title: 'Containerized Deployment', description: 'Dockerized for easy, portable deployment', implemented: true }
    ],
    
    challenges: [
      'Feature Creep – Managed scope by prioritizing core functionality',
      'System Design – Iterated on architecture for scalability and modularity',
      'Deployment Bugs – Fixed multiple issues when deploying on Render'
    ],
    
    learnings: [
      'Defined scope early to reduce feature creep and keep momentum',
      'Strengthened system architecture skills through designing a scalable backend',
      'Learned deployment debugging workflows for cloud hosting platforms',
      'First-time experience with Docker for containerization and environment consistency',
      'First-time using Django for backend development with ORM & authentication',
      'Built a full-stack application from scratch, integrating backend, frontend, and deployment'
    ],
    
    tags: ['AI', 'productivity', 'full-stack', 'Django', 'React'],
    teamSize: 1,
    myRole: 'Lead Developer',
    clientType: 'personal',
    displayOrder: 1
  },

  {
    id: '2',
    slug: 'shaders-project',
    title: 'Fractal Shaders Compilation',
    shortDescription: 'UC Berkeley CS 184 Final Project — compilation of fractal-based shaders using C++ and OpenGL.',
    fullDescription: `A collaborative final project for UC Berkeley’s Computer Graphics course (CS 184). 
  We built a suite of shaders inspired by the Mandelbrot set and fractal geometry, progressively extending 
  our base implementation with fog effects, phong lighting, and experimental fractal visuals. 
  Using OpenGL and Shadertoy for iteration, we explored visual complexity, GPU performance trade-offs, 
  and creative mathematical art.`,
    status: 'completed',
    category: 'graphics',
    featured: true,
    
    startDate: '2025-03-31',
    endDate: '2025-04-30',
    lastUpdated: '2025-04-30',
    
    technologies: {
      frontend: ['C++','OpenGL', 'GLSL'],
      backend: [],
      database: [],
      deployment: ['Shadertoy'],
      tools: ['Shadertoy','OpenGL']
    },
    primaryTech: ['C++','OpenGL', 'GLSL'],
    
    images: [],
    
    links: [
      { type: 'live', url: 'https://www.shadertoy.com/view/lccXDj', label: 'Death of Our Sun Mandelbrot' },
      { type: 'live', url: 'https://www.shadertoy.com/view/lccSW2', label: 'CALiflower' },
      {type: 'live', url: 'https://www.shadertoy.com/view/XfcSD2', label: 'Phong + Fog'}
    ],
    
    features: [
      { title: 'Mandelbrot Base Shader', description: 'Implemented Mandelbrot fractal rendering with zoom & coloring', implemented: true },
    { title: 'Fractal Variations', description: 'Explored visual complexity with CALiflower and other fractal variants', implemented: true },
    { title: 'Phong Shading + Fog', description: 'Combined classic lighting models with fog for depth & atmosphere', implemented: true },
    { title: 'Interactive Exploration', description: 'Enabled real-time tweaking of fractal parameters on Shadertoy', implemented: true }
    ],
    
    challenges: [
      'Optimizing shader performance to run smoothly on the GPU',
      'Balancing mathematical accuracy with visually appealing aesthetics',
      'Debugging GLSL shaders without standard debugging tools'
    ],
    
    learnings: [
      'Strengthened understanding of fractals and complex number mathematics',
      'Hands-on experience writing shaders in GLSL and debugging rendering issues',
      'Learned GPU performance profiling and optimization techniques',
      'Gained deeper appreciation for the intersection of math and art in graphics programming'
    ],
    
    tags: ['Computer Graphics', 'Shaders', 'Fractals', 'OpenGL', 'GLSL'],
    teamSize: 4,
    myRole: 'Developer / Product Manager',
    clientType: 'UC Berkeley',
    displayOrder: 2
  }
]

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(project => project.slug === slug)
}

export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured).sort((a, b) => a.displayOrder - b.displayOrder)
}

export const getProjectsByCategory = (category: string): Project[] => {
  return projects.filter(project => project.category === category).sort((a, b) => a.displayOrder - b.displayOrder)
}

export const getProjectsByStatus = (status: string): Project[] => {
  return projects.filter(project => project.status === status).sort((a, b) => a.displayOrder - b.displayOrder)
}

export const getAllTechnologies = (): string[] => {
  const techSet = new Set<string>()
  
  projects.forEach(project => {
    project.primaryTech.forEach(tech => techSet.add(tech))
    Object.values(project.technologies).forEach(techArray => {
      if (Array.isArray(techArray)) {
        techArray.forEach(tech => techSet.add(tech))
      }
    })
  })
  
  return Array.from(techSet).sort()
}

export const getAllCategories = (): string[] => {
  const categories = new Set(projects.map(project => project.category))
  return Array.from(categories).sort()
}
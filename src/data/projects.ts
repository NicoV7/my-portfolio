import { Project } from '../types/project'

export const projects: Project[] = [
  {
    id: '1',
    slug: 'ecommerce-platform',
    title: 'Modern E-Commerce Platform',
    shortDescription: 'Full-stack e-commerce solution with real-time inventory and payment processing',
    fullDescription: `A comprehensive e-commerce platform built with modern technologies, featuring real-time inventory management, 
    secure payment processing, advanced search and filtering, and a responsive admin dashboard. The platform supports 
    multiple vendors, complex product variations, and automated order fulfillment workflows.`,
    status: 'completed',
    category: 'web-app',
    featured: true,
    
    startDate: '2024-01-15',
    endDate: '2024-06-20',
    lastUpdated: '2024-08-15',
    
    technologies: {
      frontend: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Query'],
      backend: ['Node.js', 'Express', 'GraphQL', 'JWT Authentication'],
      database: ['PostgreSQL', 'Redis', 'Prisma ORM'],
      deployment: ['Vercel', 'AWS S3', 'Stripe', 'SendGrid'],
      tools: ['ESLint', 'Prettier', 'Husky', 'GitHub Actions']
    },
    primaryTech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    
    images: [
      {
        url: '/projects/ecommerce-hero.jpg',
        alt: 'E-commerce platform homepage',
        type: 'hero',
        caption: 'Modern, responsive homepage with product showcase'
      },
      {
        url: '/projects/ecommerce-thumb.jpg',
        alt: 'E-commerce platform thumbnail',
        type: 'thumbnail'
      },
      {
        url: '/projects/ecommerce-dashboard.jpg',
        alt: 'Admin dashboard',
        type: 'gallery',
        caption: 'Comprehensive admin dashboard with analytics'
      },
      {
        url: '/projects/ecommerce-mobile.jpg',
        alt: 'Mobile responsive design',
        type: 'gallery',
        caption: 'Fully responsive mobile experience'
      }
    ],
    thumbnailImage: '/projects/ecommerce-thumb.jpg',
    heroImage: '/projects/ecommerce-hero.jpg',
    previewMedia: {
      url: '/projects/ecommerce-demo.mp4',
      type: 'video',
      fallbackImage: '/projects/ecommerce-thumb.jpg'
    },
    
    links: [
      { type: 'github', url: 'https://github.com/username/ecommerce-platform', label: 'View Source Code' },
      { type: 'live', url: 'https://ecommerce-demo.vercel.app', label: 'Live Demo' },
      { type: 'video', url: 'https://youtube.com/watch?v=demo', label: 'Demo Video' }
    ],
    
    features: [
      { title: 'User Authentication & Profiles', description: 'Secure login with profile management', implemented: true },
      { title: 'Product Catalog & Search', description: 'Advanced filtering and search functionality', implemented: true },
      { title: 'Shopping Cart & Checkout', description: 'Seamless cart experience with Stripe integration', implemented: true },
      { title: 'Admin Dashboard', description: 'Comprehensive management interface', implemented: true },
      { title: 'Real-time Inventory', description: 'Live stock tracking and notifications', implemented: true },
      { title: 'Multi-vendor Support', description: 'Support for multiple sellers', implemented: false }
    ],
    
    challenges: [
      'Implementing real-time inventory synchronization across multiple sessions',
      'Optimizing database queries for complex product filtering',
      'Building a scalable image upload and optimization system'
    ],
    
    learnings: [
      'Advanced PostgreSQL query optimization and indexing strategies',
      'Implementing real-time features with WebSocket connections',
      'Building type-safe APIs with GraphQL and TypeScript'
    ],
    
    tags: ['full-stack', 'e-commerce', 'real-time', 'payments', 'responsive'],
    teamSize: 1,
    myRole: 'Full-Stack Developer',
    clientType: 'personal',
    displayOrder: 1
  },
  
  {
    id: '2',
    slug: 'task-management-app',
    title: 'AI Task Manager',
    shortDescription: 'Productivity app with AI-enhanced project management',
    fullDescription: `A full-stack productivity app that integrates Django, PostgreSQL, and Docker with an AI assistant to help users organize, prioritize, and track tasks.
         Designed with a clean UI and RESTful API architecture to support seamless task creation, deadlines, and AI-driven recommendations.`,
    status: 'completed',
    category: 'web-app',
    featured: true,
    
    startDate: 'AUG 2025',
    endDate: 'AUG 2025',
    lastUpdated: 'AUG 2025',
    
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
        url: '/projects/taskmanager-thumb.jpg',
        alt: 'Task manager dashboard',
        type: 'thumbnail'
      },
    ],
    thumbnailImage: '/projects/taskmanager-thumb.jpg',
    previewMedia: {
      url: '/projects/taskmanager-demo.gif',
      type: 'gif',
      fallbackImage: '/projects/taskmanager-thumb.jpg'
    },
    
    links: [
      { type: 'github', url: 'https://github.com/NicoV7/ai-task-manager', label: 'Source Code' },
      { type: 'demo', url: 'https://taskmanager-frontend-2nx3.onrender.com', label: 'Visit' },
      
    ],
    
    features: [
      { title: 'AI-Powered Task Creation', description: 'Live updates across all team members', implemented: true },
    
      { title: 'Smart Categorization', description: 'Generate tasks automatically from natural language input.', implemented: true },
      { title: 'AI Breakdown', description: 'Breaks down tasks into subproblems', implemented: true },
      { title: 'Deadline Management', description: 'Set due dates with automated reminders.', implemented: true },
      { title: 'Search & Filter', description: 'Quickly find tasks by keyword or status.', implemented: true },
      { title: 'Persistent Storage', description: 'PostgreSQL database ensures reliable task saving.', implemented: true },
      { title: 'Progress Tracking', description: 'View completion rates and pending workload', implemented: true },
      { title: 'Secure Authentication', description: 'User accounts protected with session-based auth.', implemented: true },
      { title: 'Containerized Deployment', description: 'Dockerized for easy, portable deployment.', implemented: true }
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
    
    tags: ['collaboration', 'productivity', 'real-time', 'team-management'],
    teamSize: 1,
    myRole: 'Lead Developer',
    clientType: 'personal',
    displayOrder: 2
  },
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
import { BlogPost } from '../types/blog'

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'building-ai-task-manager-django-react',
    title: 'Building an AI-Powered Task Manager with Django and React',
    excerpt: 'A deep dive into creating a full-stack productivity app that leverages AI to help users organize and prioritize their tasks effectively.',
    content: 'In this comprehensive guide, I\'ll walk you through the process of building a sophisticated AI-powered task management application using Django for the backend and React for the frontend.\n\n## The Challenge\n\nTask management apps are everywhere, but most lack the intelligence to truly help users prioritize and organize their work. I wanted to build something different - an app that could understand context, break down complex tasks, and provide intelligent recommendations.\n\n## Technical Architecture\n\nThe application follows a modern full-stack architecture:\n\n- **Frontend**: React 18 with TypeScript for type safety\n- **Backend**: Django REST API with Redis for caching\n- **Database**: PostgreSQL for data persistence\n- **AI Integration**: Claude API for intelligent task processing\n- **Deployment**: Docker containers deployed on Render\n\n## Key Features Implemented\n\n### 1. AI Task Breakdown\nThe most innovative feature is the ability to take a complex task description and automatically break it down into manageable subtasks. For example, "Plan a company retreat" becomes:\n- Research potential venues\n- Create budget proposal\n- Send surveys to team for preferences\n- Book accommodation and activities\n\n### 2. Smart Categorization\nTasks are automatically categorized based on their content and context, helping users organize their work without manual tagging.\n\n### 3. Intelligent Prioritization\nThe AI analyzes task urgency, complexity, and user patterns to suggest optimal task ordering.\n\n## Lessons Learned\n\nBuilding this project taught me valuable lessons about:\n- Integrating AI APIs effectively in production applications\n- Designing intuitive UIs for complex functionality\n- Optimizing database queries for real-time updates\n- Managing state in React applications with multiple data sources\n\nThe result is a productivity app that doesn\'t just store tasks - it actively helps users accomplish them more efficiently.',
    category: 'project-deep-dive',
    status: 'published',
    featured: true,
    publishedAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
    tags: ['Django', 'React', 'AI', 'PostgreSQL', 'Full-Stack'],
    readingTime: 8,
    author: 'Nico Vega'
  },
  {
    id: '2',
    slug: 'mastering-framer-motion-nextjs',
    title: 'Mastering Framer Motion in Next.js: Animation Best Practices',
    excerpt: 'Learn how to create smooth, performant animations in Next.js applications using Framer Motion with practical examples and optimization tips.',
    content: 'Animations can make or break a user experience. In this tutorial, I\'ll share everything I\'ve learned about implementing smooth, performant animations in Next.js using Framer Motion.\n\n## Why Framer Motion?\n\nFramer Motion stands out in the React animation ecosystem because of its:\n- Declarative API that\'s easy to reason about\n- Excellent performance with automatic GPU acceleration\n- Built-in support for complex animations like page transitions\n- TypeScript support out of the box\n\n## Essential Animation Patterns\n\n### 1. Page Transitions\nOne of the most impactful uses of Framer Motion is creating smooth page transitions. By defining variants for initial, animate, and exit states, you can create professional-looking transitions between pages.\n\n### 2. Scroll-Triggered Animations\nUsing the useInView hook for performance-optimized scroll animations allows you to trigger animations only when elements come into view, improving performance.\n\n### 3. Staggered Lists\nCreating smooth staggered animations for lists of items adds polish to your interface and guides user attention naturally.\n\n## Performance Optimization Tips\n\n1. **Use transform properties** - They\'re GPU-accelerated\n2. **Animate opacity and scale** rather than width/height\n3. **Use useCallback for animation functions**\n4. **Implement proper cleanup** for scroll listeners\n\n## Common Pitfalls\n\n- Overanimating - less is often more\n- Not considering reduced motion preferences\n- Forgetting to optimize for mobile performance\n- Ignoring accessibility considerations\n\nThe key to great animations is subtlety and purpose. Every animation should serve the user experience, not just look impressive.',
    category: 'tutorial',
    status: 'published',
    featured: true,
    publishedAt: '2024-12-10T14:30:00Z',
    updatedAt: '2024-12-10T14:30:00Z',
    tags: ['Next.js', 'Framer Motion', 'React', 'Animation', 'Performance'],
    readingTime: 6,
    author: 'Nico Vega'
  },
  {
    id: '3',
    slug: 'dark-mode-implementation-nextjs',
    title: 'Implementing a Robust Dark Mode in Next.js with Multiple Themes',
    excerpt: 'A comprehensive guide to building a theme system that supports light, dark, and custom themes with proper SSR handling and no flash of incorrect theme.',
    content: 'Theme switching is a crucial feature for modern web applications. In this post, I\'ll show you how to implement a robust theme system that supports multiple themes without the dreaded flash of unstyled content.\n\n## The Challenge with SSR\n\nNext.js server-side rendering creates a unique challenge for theme systems. The server doesn\'t know the user\'s theme preference, leading to hydration mismatches and theme flashing.\n\n## Solution Architecture\n\nOur approach uses:\n- CSS custom properties for theme variables\n- A theme initialization script in the HTML head\n- localStorage for theme persistence\n- System preference detection as fallback\n\n## Implementation Steps\n\n### 1. Theme Initialization Script\nPlace a script in your document head to run before page render. This script checks localStorage for saved preferences and applies the theme immediately.\n\n### 2. Theme Context Provider\nCreate a context to manage theme state across your application, allowing components to easily access and change themes.\n\n### 3. CSS Custom Properties\nDefine your theme variables in CSS using custom properties, making it easy to switch between different color schemes.\n\n## Advanced Features\n\n- **Smooth transitions** between themes using CSS transitions\n- **System preference detection** with media queries\n- **Theme persistence** across browser sessions\n- **Support for custom themes** with CSS custom properties\n\n## Testing Strategy\n\nAlways test your theme implementation:\n- In different browsers\n- With JavaScript disabled\n- With various system preferences\n- On slow network connections\n\nA well-implemented theme system enhances user experience significantly while maintaining technical robustness.',
    category: 'tutorial',
    status: 'published',
    featured: false,
    publishedAt: '2024-12-05T09:15:00Z',
    updatedAt: '2024-12-05T09:15:00Z',
    tags: ['Next.js', 'Dark Mode', 'CSS', 'SSR', 'UX'],
    readingTime: 7,
    author: 'Nico Vega',
  },
  {
    id: '4',
    slug: 'postgresql-optimization-tips',
    title: 'PostgreSQL Performance Optimization: From Slow to Lightning Fast',
    excerpt: 'Practical tips and techniques I learned while optimizing database queries that improved application performance by 300%.',
    content: 'Database performance can make or break your application. Here\'s how I transformed a slow, unresponsive app into a lightning-fast experience by optimizing PostgreSQL queries and database design.\n\n## The Performance Problem\n\nOur task management app was grinding to a halt with just 10,000 tasks. Simple queries were taking seconds, and the user experience was suffering. It was time for some serious database optimization.\n\n## Diagnostic Tools\n\nBefore optimizing, you need to identify bottlenecks:\n\n### 1. Query Analysis with EXPLAIN\nUsing PostgreSQL\'s EXPLAIN ANALYZE command to understand query execution plans and identify slow operations.\n\n### 2. Performance Monitoring\n- pg_stat_statements for query statistics\n- pg_stat_activity for active connections\n- Custom monitoring with application metrics\n\n## Optimization Strategies\n\n### 1. Index Optimization\nThe biggest performance gains came from proper indexing:\n\n**Composite indexes** for common query patterns significantly improved performance for multi-column WHERE clauses.\n\n**Partial indexes** for active tasks only reduced index size and improved query speed for frequently accessed data.\n\n### 2. Query Refactoring\nRewrote N+1 queries using JOINs and subqueries, eliminating multiple round trips to the database.\n\n### 3. Connection Pooling\nImplemented pgBouncer to manage database connections efficiently, reducing connection overhead.\n\n## Database Design Improvements\n\n### Normalization vs Denormalization\nSometimes denormalization helps performance. Added calculated fields to avoid expensive JOINs, updated with triggers to maintain data consistency.\n\n## Results\n\nThe optimizations delivered dramatic improvements:\n- Query time: 2-3 seconds → 50-100ms\n- Concurrent users: 10 → 100+\n- Database CPU usage: 80% → 20%\n\n## Key Takeaways\n\n1. **Measure first** - Don\'t optimize without data\n2. **Indexes are powerful** but use them wisely\n3. **Query patterns matter** more than individual query optimization\n4. **Connection pooling is essential** for production apps\n5. **Monitor continuously** - performance can degrade over time\n\nDatabase optimization is an ongoing process, but these techniques will give you a solid foundation for building performant applications.',
    category: 'tech-insights',
    status: 'published',
    featured: false,
    publishedAt: '2024-11-28T16:45:00Z',
    updatedAt: '2024-11-28T16:45:00Z',
    tags: ['PostgreSQL', 'Database', 'Performance', 'SQL', 'Optimization'],
    readingTime: 9,
    author: 'Nico Vega',
  },
  {
    id: '5',
    slug: 'typescript-advanced-patterns',
    title: 'Advanced TypeScript Patterns for React Applications',
    excerpt: 'Explore powerful TypeScript patterns that will make your React code more type-safe, maintainable, and developer-friendly.',
    content: 'TypeScript transforms JavaScript development, but many developers only scratch the surface of its capabilities. Let\'s explore advanced patterns that will elevate your React applications.\n\n## Utility Types for Component Props\n\n### Extracting Props from Components\nYou can extract props from existing components using React.ComponentProps, making it easy to extend or compose component interfaces.\n\n### Polymorphic Components\nCreate components that can render as different HTML elements while maintaining full type safety.\n\n## Advanced Hook Patterns\n\n### Generic Hooks\nCreate reusable hooks with generic type parameters that adapt to different data types while maintaining type safety.\n\n### Conditional Hook Types\nUse conditional types to make hook return types dependent on input parameters, providing better type inference.\n\n## Type Guards and Narrowing\n\n### Custom Type Guards\nCreate functions that help TypeScript narrow types, improving type safety and IntelliSense support.\n\n## Template Literal Types\n\n### Dynamic Route Types\nUse template literal types to create type-safe route definitions that catch invalid routes at compile time.\n\n### API Response Types\nCreate sophisticated API types that ensure request/response consistency across your application.\n\n## Branded Types\n\nCreate types that are structurally identical but nominally different, preventing accidental misuse of similar-looking values.\n\n## Key Benefits\n\nThese advanced patterns provide:\n- **Better type safety** with compile-time guarantees\n- **Improved developer experience** with better IntelliSense\n- **Self-documenting code** through expressive types\n- **Runtime error prevention** through compile-time checks\n\nMastering these patterns will make you a more effective TypeScript developer and help you build more robust React applications.',
    category: 'tutorial',
    status: 'published',
    featured: false,
    publishedAt: '2024-11-20T11:00:00Z',
    updatedAt: '2024-11-20T11:00:00Z',
    tags: ['TypeScript', 'React', 'Advanced', 'Patterns', 'Type Safety'],
    readingTime: 10,
    author: 'Nico Vega',
  },
  {
    id: '6',
    slug: 'career-advice-junior-developers',
    title: 'From UC Berkeley to Tech: Advice for New Computer Science Graduates',
    excerpt: 'Practical career advice based on my journey from UC Berkeley CS student to working full-stack developer.',
    content: 'Graduating with a Computer Science degree is just the beginning. Here\'s what I wish I knew when I was starting my career journey from UC Berkeley.\n\n## The Reality Check\n\nUniversity prepares you with theoretical knowledge, but the industry requires practical skills. The gap between academic CS and industry work is real, but bridgeable with the right approach.\n\n### What University Teaches vs. Industry Needs\n\n**University Focus:**\n- Algorithms and data structures (CS 61B, CS 170)\n- Systems programming (CS 61C, CS 162)\n- Theory and mathematics\n- Individual projects\n\n**Industry Reality:**\n- Working with legacy codebases\n- Collaborating in teams\n- Understanding business requirements\n- Debugging production issues\n- Continuous learning of new technologies\n\n## Building Practical Skills\n\n### 1. Master the Fundamentals\nDon\'t skip the basics your CS courses taught you:\n- **Data Structures & Algorithms**: Essential for interviews\n- **System Design**: Critical for senior roles\n- **Database Knowledge**: CS 186 concepts are daily necessities\n- **Networking**: CS 168 principles apply to web development\n\n### 2. Build Real Projects\nAcademic projects are great, but build something users actually use:\n- Deploy to production (Vercel, Netlify, AWS)\n- Handle real user feedback\n- Deal with scaling issues\n- Maintain code over time\n\n### 3. Learn Industry Tools\nUniversities often use educational tools. Learn industry standards:\n- **Version Control**: Git (beyond basic commits)\n- **Databases**: PostgreSQL, MongoDB\n- **Cloud Platforms**: AWS, Google Cloud, Azure\n- **Monitoring**: Logging, error tracking, analytics\n\n## The Job Search Strategy\n\n### Portfolio Over Perfection\nYour GitHub and deployed projects matter more than your GPA. Show:\n- Clean, readable code\n- Production deployments\n- Problem-solving approaches\n- Learning progression\n\n### Interview Preparation\n- **LeetCode**: Yes, it\'s necessary for many companies\n- **System Design**: Practice explaining your project architectures\n- **Behavioral Questions**: Prepare stories using STAR method\n- **Mock Interviews**: Practice with peers or platforms like Pramp\n\n### Networking Effectively\n- **UC Berkeley Alumni Network**: Leverage it early and often\n- **Tech Meetups**: Join local developer communities\n- **Online Communities**: Contribute to open source, join Discord servers\n- **Cold Outreach**: Respectful LinkedIn messages work\n\n## Continuous Learning\n\nTechnology evolves rapidly. Build habits for lifelong learning:\n\n### Stay Current\n- **Technical Blogs**: Follow industry leaders\n- **Newsletters**: JavaScript Weekly, Postgres Weekly, etc.\n- **Conferences**: Watch talks online, attend when possible\n- **Documentation**: Read official docs, not just tutorials\n\n### Contribute Back\n- **Open Source**: Start small with documentation or bug fixes\n- **Writing**: Blog about what you learn\n- **Mentoring**: Help newer students and developers\n- **Speaking**: Share experiences at meetups\n\n## The Long Game\n\nYour career is a marathon, not a sprint. Focus on:\n- Building strong fundamentals\n- Developing problem-solving skills\n- Creating meaningful relationships\n- Contributing to something larger than yourself\n\nRemember, every senior developer was once where you are now. The UC Berkeley CS program gives you an excellent foundation - now it\'s time to build on it.',
    category: 'career',
    status: 'published',
    featured: true,
    publishedAt: '2024-11-15T08:00:00Z',
    updatedAt: '2024-11-15T08:00:00Z',
    tags: ['Career', 'UC Berkeley', 'Computer Science', 'Job Search', 'Advice'],
    readingTime: 12,
    author: 'Nico Vega',
  },
  {
    id: '7',
    slug: 'docker-development-workflow',
    title: 'Streamlining Development with Docker: A Complete Workflow Guide',
    excerpt: 'How I use Docker to create consistent development environments and streamline deployment pipelines from local to production.',
    content: 'Docker has revolutionized how I approach development workflows. Here\'s how I use containerization to eliminate "works on my machine" problems and streamline deployments.\n\n## The Development Environment Problem\n\nBefore Docker, setting up development environments was painful:\n- Different OS requirements across team members\n- Version conflicts between projects\n- Complex setup documentation\n- Environment drift over time\n\n## Docker Development Setup\n\n### Multi-Stage Dockerfile\nUsing multi-stage builds to optimize for both development and production, keeping images lean while maintaining development convenience.\n\n### Docker Compose for Local Development\nDocker Compose orchestrates multiple services (app, database, cache) with a single command, making onboarding new developers effortless.\n\n## Development Workflow\n\n### 1. One Command Setup\nNew team members can get started instantly:\n```bash\ngit clone repo\ncd repo\ndocker-compose up\n```\n\n### 2. Consistent Environments\nEveryone runs the exact same:\n- Node.js version\n- Database version\n- Operating system (Alpine Linux)\n- Dependencies\n\n### 3. Easy Cleanup\nRemoving everything and starting fresh is simple with Docker commands.\n\n## Production Deployment\n\n### Build Pipeline\nAutomated CI/CD pipeline that builds, tests, and deploys Docker images ensures consistency from development to production.\n\n### Container Orchestration\nUsing Docker Compose or Kubernetes for production deployments provides scalability and reliability.\n\n## Benefits Realized\n\n**For Development:**\n- 90% reduction in setup time for new developers\n- Eliminated environment-related bugs\n- Consistent behavior across different machines\n- Easy testing of different dependency versions\n\n**For Production:**\n- Predictable deployments\n- Easy rollbacks with versioned images\n- Better resource utilization\n\n**For Team Collaboration:**\n- No more "works on my machine" issues\n- Simplified onboarding process\n- Reproducible bug reports\n\nDocker has transformed my development workflow from a time-consuming setup process to a one-command solution. The consistency between development and production environments has virtually eliminated deployment surprises.',
    category: 'tools',
    status: 'published',
    featured: false,
    publishedAt: '2024-11-10T13:20:00Z',
    updatedAt: '2024-11-10T13:20:00Z',
    tags: ['Docker', 'DevOps', 'Development', 'Deployment', 'Workflow'],
    readingTime: 11,
    author: 'Nico Vega',
  },
  {
    id: '8',
    slug: 'react-performance-optimization',
    title: 'React Performance Optimization: Beyond React.memo',
    excerpt: 'Advanced techniques for optimizing React application performance, including code splitting, virtualization, and bundle analysis.',
    content: 'React applications can become sluggish as they grow. Here are advanced optimization techniques I\'ve learned that go beyond the basic React.memo approach.\n\n## Performance Fundamentals\n\nBefore diving into optimizations, understand what causes performance issues:\n- **Unnecessary re-renders** due to reference changes\n- **Large bundle sizes** leading to slow initial loads\n- **Expensive calculations** blocking the main thread\n- **Memory leaks** from improper cleanup\n\n## Advanced Memoization Strategies\n\n### useMemo vs useCallback\n```tsx\n// ❌ Overusing useMemo for primitive values\nconst Component = ({ count }) => {\n  const doubledCount = useMemo(() => count * 2, [count]) // Unnecessary\n  \n  // ✅ Using useMemo for expensive calculations\n  const expensiveValue = useMemo(() => {\n    return heavyCalculation(data)\n  }, [data])\n  \n  return <ChildComponent />\n}\n```\n\n## Code Splitting Strategies\n\n### Route-Based Splitting\n```tsx\nimport { lazy, Suspense } from \'react\'\n\nconst HomePage = lazy(() => import(\'./pages/Home\'))\nconst AboutPage = lazy(() => import(\'./pages/About\'))\n\nfunction App() {\n  return (\n    <Router>\n      <Suspense fallback={<PageSkeleton />}>\n        <Routes>\n          <Route path="/" element={<HomePage />} />\n          <Route path="/about" element={<AboutPage />} />\n        </Routes>\n      </Suspense>\n    </Router>\n  )\n}\n```\n\n## Bundle Analysis and Optimization\n\n### Webpack Bundle Analyzer\n```bash\n# Analyze bundle size\nnpm install --save-dev webpack-bundle-analyzer\nnpx webpack-bundle-analyzer build/static/js/*.js\n```\n\n## Performance Monitoring\n\n### Custom Performance Hook\n```tsx\nfunction usePerformanceMonitor(componentName: string) {\n  useEffect(() => {\n    const startTime = performance.now()\n    \n    return () => {\n      const endTime = performance.now()\n      const renderTime = endTime - startTime\n      \n      if (renderTime > 16) {\n        console.warn(`${componentName} took ${renderTime}ms to render`)\n      }\n    }\n  })\n}\n```\n\n## Key Performance Metrics\n\nMonitor these metrics to track improvements:\n- **First Contentful Paint (FCP)** - When content first appears\n- **Largest Contentful Paint (LCP)** - When main content is visible\n- **Cumulative Layout Shift (CLS)** - Visual stability\n- **First Input Delay (FID)** - Interactivity responsiveness\n\n## Results from Optimization\n\nIn my projects, these techniques achieved:\n- **Bundle size reduction**: 40-60% smaller initial loads\n- **Render performance**: 3-5x faster component updates\n- **Memory usage**: 30% reduction in memory footprint\n- **User experience**: Significantly improved perceived performance\n\n## Common Mistakes\n\n1. **Over-optimization**: Don\'t optimize until you have performance problems\n2. **Premature memoization**: Profile first, then optimize\n3. **Ignoring bundle size**: Large bundles hurt more than slow renders\n4. **Not measuring**: Always measure before and after optimizations\n5. **Optimizing the wrong things**: Focus on user-facing performance\n\nRemember: The best optimization is not rendering at all. Think about your component architecture and data flow before reaching for performance tools.',
    category: 'tutorial',
    status: 'published',
    featured: false,
    publishedAt: '2024-11-01T15:30:00Z',
    updatedAt: '2024-11-01T15:30:00Z',
    tags: ['React', 'Performance', 'Optimization', 'JavaScript', 'Web Development'],
    readingTime: 13,
    author: 'Nico Vega',
  }
]

// Helper function to simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions
export const fetchBlogPosts = async (offset?: number, limit?: number): Promise<BlogPost[]> => {
  await delay(800) // Simulate network delay
  
  // If no pagination parameters provided, return all posts
  if (offset === undefined || limit === undefined) {
    return blogPosts
  }
  
  return blogPosts.slice(offset, offset + limit)
}

export const searchBlogPosts = async (query: string): Promise<BlogPost[]> => {
  await delay(500)
  
  if (!query) return blogPosts
  
  const lowercaseQuery = query.toLowerCase()
  return blogPosts.filter(post =>
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}
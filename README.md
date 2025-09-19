# Modern Portfolio Website

A responsive personal portfolio built with Next.js that showcases your projects and professional experience. This portfolio includes smooth animations, an interactive project gallery, and a clean design that works across all devices.

## Features

- **Modern Design** - Clean, professional interface with subtle animations that enhance user experience
- **Fully Responsive** - Optimized layout that looks great on desktop, tablet, and mobile devices
- **Dark/Light Mode** - Automatic theme switching with system preference detection and manual toggle
- **High Performance** - Built with Next.js 15 and optimized for fast loading and smooth interactions
- **Project Showcase** - Interactive gallery with detailed project modals and filtering capabilities
- **Smooth Animations** - Carefully crafted Framer Motion animations that feel natural and purposeful
- **Type Safety** - Full TypeScript implementation for better development experience and code reliability
- **Blog System** - Built-in blog functionality with categories, tags, and search capabilities

## Technology Stack

- **Framework:** Next.js 15.3.5 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.1.11
- **Animations:** Framer Motion 12.23.0
- **Runtime:** React 19
- **Build Tool:** Turbopack (Next.js bundler)
- **Deployment Ready:** Vercel optimized

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun
- Git for version control

### Quick Setup

1. **Clone and Setup**
```bash
git clone https://github.com/your-username/portfolio-website.git
cd portfolio-website
npm install
```

2. **Start Development**
```bash
npm run dev
```

3. **View Your Site**
Open [http://localhost:3000](http://localhost:3000) to see your portfolio running locally.

## Making It Your Own

This portfolio is designed to be easily customizable. Follow these steps to personalize it with your own content:

### 1. Basic Information Setup

**Update Personal Details** in `src/app/page.tsx`:
- Replace the name, title, and description
- Update contact information
- Modify the hero section content

**Update Site Metadata** in `src/app/layout.tsx`:
- Change the site title and description
- Update favicon and social media meta tags
- Modify any site-wide settings

### 2. Customize Your Projects

**Project Data Structure** is located in `src/data/projects.ts`. Each project includes:
- Basic information (title, description, dates)
- Technology stack details
- Images and media
- External links (GitHub, live demo, etc.)
- Feature lists and project details

**Adding a New Project:**
```typescript
{
  id: 'unique-id',
  slug: 'project-url-slug',
  title: 'Your Project Name',
  shortDescription: 'Brief description for cards',
  fullDescription: 'Detailed description for modal',
  status: 'completed', // 'completed' | 'in-progress' | 'planned' | 'archived'
  category: 'web-app', // See categories below
  featured: true, // Display prominently

  startDate: '2024-01-01',
  endDate: '2024-03-01',
  lastUpdated: '2024-03-01',

  technologies: {
    frontend: ['React', 'TypeScript'],
    backend: ['Node.js', 'Express'],
    database: ['MongoDB'],
    deployment: ['Vercel'],
    tools: ['Docker', 'Jest']
  },
  primaryTech: ['React', 'TypeScript', 'Node.js'], // Main techs to display

  images: [
    {
      url: '/projects/thumbnails/project-thumb.png',
      alt: 'Project screenshot',
      type: 'thumbnail' // 'thumbnail' | 'gallery' | 'hero'
    }
  ],

  links: [
    { type: 'github', url: 'https://github.com/...', label: 'Source Code' },
    { type: 'live', url: 'https://...', label: 'Live Demo' }
  ],

  features: [
    { title: 'Feature Name', description: 'What it does', implemented: true }
  ],

  tags: ['react', 'javascript'],
  displayOrder: 1 // Lower numbers appear first
}
```

### 3. Project Categories

**Available Categories** (defined in `src/types/project.ts`):
- `web-app` - Web applications
- `mobile` - Mobile applications
- `desktop` - Desktop applications
- `library` - Code libraries/packages
- `api` - APIs and backend services
- `tool` - Development tools
- `game` - Games and interactive experiences
- `graphics` - Design and graphics projects
- `security` - Security-related projects
- `AI-ML` - Artificial Intelligence/Machine Learning
- `other` - Other types of projects

**Adding Custom Categories:**
1. Update the `ProjectCategory` type in `src/types/project.ts`
2. Update the filter components in `src/app/components/ProjectFilters.tsx`
3. Add appropriate styling if needed

### 4. Blog Customization

**Blog Posts** are managed in `src/data/blogPosts.ts`. The blog system includes:

**Available Blog Categories:**
- `tutorial` - How-to guides and tutorials
- `project-deep-dive` - Detailed project explanations
- `tech-insights` - Technical insights and opinions
- `career` - Career-related content
- `tools` - Tool reviews and recommendations
- `other` - Other types of content

**Adding a Blog Post:**
```typescript
{
  id: 'unique-id',
  slug: 'blog-post-url-slug',
  title: 'Your Blog Post Title',
  excerpt: 'Brief summary for the blog listing page',
  content: 'Full blog content in markdown format...',
  category: 'tutorial',
  status: 'published', // 'published' | 'draft' | 'archived'
  featured: true,

  publishedAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-01T10:00:00Z',

  tags: ['React', 'JavaScript', 'Tutorial'],
  readingTime: 5, // estimated reading time in minutes
  author: 'Your Name'
}
```

### 5. Images and Media

**Project Images** should be placed in the `public/projects/` directory:
- `public/projects/thumbnails/` - Thumbnail images for project cards
- `public/projects/screenshots/` - Full-size images for project galleries
- `public/projects/logos/` - Project logos or icons

**Blog Images** can be placed in `public/blog/` directory and referenced in your blog content.

**Supported Formats:**
- Images: PNG, JPG, WebP, SVG
- Videos: MP4, WebM (for project previews)
- GIFs: For animated previews

### 6. Styling and Theming

**Color Schemes** are defined in `tailwind.config.ts`. You can customize:
- Primary and secondary colors
- Dark/light mode color variants
- Custom color schemes for different sections

**Component Styling** follows Tailwind CSS patterns. Key components to customize:
- `src/app/components/ProjectCard.tsx` - Project card appearance
- `src/app/components/BlogCard.tsx` - Blog post card styling
- `src/app/page.tsx` - Homepage layout and styling

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Contributing

This template welcomes contributions and improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing TypeScript and ESLint configuration
- Use Tailwind CSS for styling
- Implement responsive design principles
- Write clean, readable code with proper type annotations

## Deployment

This portfolio is designed to work seamlessly with modern deployment platforms:

### Vercel (Recommended)

1. **Connect Repository**
   - Push your customized portfolio to GitHub
   - Connect your GitHub account to Vercel
   - Import your repository

2. **Configure Settings**
   - Vercel will automatically detect Next.js and configure build settings
   - No additional configuration needed for basic deployment

3. **Deploy**
   - Every push to your main branch triggers automatic deployment
   - Preview deployments are created for pull requests

### Other Platforms

**Netlify:**
```bash
npm run build
# Deploy the .next folder
```

**Traditional Hosting:**
```bash
npm run build
npm start
# Or use PM2 for production process management
```

### Environment Variables

If you add features requiring environment variables:
1. Create a `.env.local` file for local development
2. Add variables to your deployment platform's environment settings
3. Never commit sensitive keys to your repository

## Customization Tips

### SEO Optimization
- Update meta tags in `src/app/layout.tsx`
- Add structured data for better search visibility
- Optimize images with Next.js Image component
- Use descriptive alt text for all images

### Performance
- Keep project images under 500KB when possible
- Use WebP format for better compression
- Implement lazy loading for large galleries
- Monitor Core Web Vitals in production

### Analytics
- Add Google Analytics or Plausible to track visitors
- Set up conversion tracking for contact form submissions
- Monitor which projects get the most engagement

### Content Strategy
- Keep project descriptions concise but informative
- Use high-quality screenshots that showcase key features
- Write blog posts about your development process
- Update your portfolio regularly with new projects

## Project Structure Reference

```
src/
├── app/
│   ├── components/         # Reusable UI components
│   ├── blog/              # Blog pages and functionality
│   ├── projects/          # Project showcase pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── data/
│   ├── projects.ts        # Project data - CUSTOMIZE THIS
│   └── blogPosts.ts       # Blog data - CUSTOMIZE THIS
├── types/
│   ├── project.ts         # Project type definitions
│   └── blog.ts            # Blog type definitions
└── hooks/                 # Custom React hooks
```

## License

This project is open source and available under the MIT License. Feel free to fork, modify, and use it for your own portfolio.

## Support

If you find this portfolio template helpful:
- Star the repository on GitHub
- Share it with other developers
- Consider contributing improvements

For questions about customization or issues with the template, please open an issue on GitHub.
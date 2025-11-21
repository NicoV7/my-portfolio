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
  },
  {
  id: '3',
  slug: 'secure-file-sharing',
  title: 'End-to-End Encrypted File Sharing System',
  shortDescription: 'Project 2 for UC Berkeley CS 161, Dropbox-like file sharing system built in Golang with end-to-end encryption and secure access controls.',
  fullDescription: `Developed a secure client-side file sharing system in Golang as part of a Computer Security course project. 
  The system applies cryptographic primitives to ensure confidentiality, integrity, and access control, such that the 
  server cannot view or tamper with user data. Users can authenticate, save files, load, overwrite, append, share, 
  and revoke file access securely. The design leverages a Keystore and Datastore backend, with cryptographic utilities 
  provided by a custom userlib library. This project emphasized secure design principles, iterative testing, and 
  building production-grade cryptographic workflows.`,
  status: 'completed',
  category: 'security',
  featured: true,

  startDate: '2025-02-01',
  endDate: '2025-03-15',
  lastUpdated: '2025-03-15',

  technologies: {
    frontend: [],
    backend: ['Golang'],
    database: ['Datastore (custom)', 'Keystore (custom)'],
    deployment: [],
    tools: ['userlib (crypto utilities)', 'Go testing framework']
  },
  primaryTech: ['Golang', 'Cryptography'],

  images: [],

  links: [
    { type: 'github', url: 'https://github.com/cs161-students/fa23-proj2-nico-esha', label: 'GitHub Repository' }
  ],

  features: [
    { title: 'User Authentication', description: 'Password-based login with cryptographically derived keys', implemented: true },
    { title: 'File Storage & Retrieval', description: 'Securely save and load files from the server using symmetric encryption', implemented: true },
    { title: 'File Overwrite & Append', description: 'Modify existing files or append securely without breaking confidentiality guarantees', implemented: true },
    { title: 'Secure File Sharing', description: 'Grant access to other users with encrypted key exchange via Keystore', implemented: true },
    { title: 'Access Revocation', description: 'Revoke access for shared users without exposing old file versions', implemented: true }
  ],

  challenges: [
    'Designing a secure data model that satisfied confidentiality, integrity, and revocation requirements',
    'Ensuring correctness of cryptographic key management between Keystore and Datastore',
    'Debugging hidden test cases in the autograder and avoiding panics in Go'
  ],

  learnings: [
    'Strengthened understanding of applied cryptography and key management',
    'Learned to design before implementing — careful planning avoided security flaws',
    'Gained practical experience writing secure Go code with crypto primitives',
    'Improved testing/debugging strategies for security-sensitive applications'
  ],

  tags: ['Golang', 'Cryptography', 'Computer Security', 'E2E Encryption', 'File Sharing'],
  teamSize: 2,
  myRole: 'Developer in Test| Secure Design & Cryptography',
  clientType: 'UC Berkeley',
  displayOrder: 3
}, 
{
  id: '4',
  slug: 'collaborative-drawing-board',
  title: 'Collaborative Drawing Platform',
  shortDescription: 'Enterprise-grade real-time visual collaboration with end-to-end encryption and advanced file management.',
  fullDescription: `A production-ready, scalable collaborative drawing application enabling secure, multi-user real-time drawing. 
  The platform uses end-to-end AES-256-GCM encryption, CRDT-based conflict resolution, and a zero-trust security model. 
  It supports template management, advanced file processing, and horizontal scalability for enterprise usage, with strict 
  TDD methodology ensuring high reliability.`,
  status: 'in-progress',
  category: 'web-app',
  featured: true,
  
  startDate: '2025-07-01',
  endDate: undefined,
  lastUpdated: '2025-08-25',
  
  technologies: {
    frontend: ['React', 'TypeScript', 'Konva.js'],
    backend: ['FastAPI', 'Python', 'Strawberry GraphQL'],
    database: ['PostgreSQL', 'Redis', 'MinIO'],
    deployment: ['Docker', 'Docker Compose', 'AWS ECS', 'Kubernetes'],
    tools: ['Jest', 'Pytest', 'Cypress', 'Playwright', 'k6', 'Prometheus', 'Grafana']
  },
  primaryTech: ['React', 'TypeScript', 'FastAPI', 'Python'],
  
  images: [
  ],
  
  links: [
    { type: 'github', url: 'https://github.com/NicoV7/collaborative-drawing-board', label: 'GitHub Repository' },
    { type: 'live', url: 'https://collab-drawing.example.com', label: 'Live Demo' }
  ],
  
  features: [
    { title: 'Real-Time Collaboration', description: 'Multi-user drawing with <16ms latency using CRDTs', implemented: true },
    { title: 'End-to-End Encryption', description: 'AES-256-GCM with client-side key management', implemented: true },
    { title: 'Template Library', description: 'Drag-and-drop uploads, auto-vectorization, and version control', implemented: true },
    { title: 'Enterprise Security', description: 'Zero-trust model, audit logging, SSO support, GDPR/HIPAA compliance', implemented: true },
    { title: 'High Performance & Scalability', description: 'Optimized rendering, caching, CDN integration, and horizontal scaling', implemented: true },
    { title: 'TDD & Test Coverage', description: '95%+ coverage across unit, integration, E2E, performance, and security tests', implemented: true }
  ],
  
  challenges: [
    'Ensuring ultra-low latency for large multi-user boards while maintaining encryption',
    'Integrating CRDT-based conflict-free collaboration with real-time rendering',
    'Designing secure key management and end-to-end encryption for enterprise users',
    'Maintaining test-driven development workflow across a complex full-stack architecture'
  ],
  
  learnings: [
    'Applied CRDT algorithms for conflict-free real-time collaboration',
    'Implemented client-side encryption and zero-trust architecture for web applications',
    'Optimized rendering pipelines for GPU performance and memory efficiency',
    'Built enterprise-ready features including audit logging, SSO integration, and horizontal scaling',
    'Designed a fully TDD-driven development workflow for a complex multi-layer system'
  ],
  
  tags: ['React', 'TypeScript', 'Python', 'FastAPI', 'GraphQL', 'CRDT', 'E2E Encryption', 'Enterprise Software'],
  teamSize: 1,
  myRole: 'Full-Stack Developer — Frontend & Security Implementation',
  clientType: 'personal',
  displayOrder: 4
},
{
  id: '5',
  slug: 'ccao-housing-predictor',
  title: 'Cook County Housing Price Predictor',
  shortDescription: 'Linear regression model predicting housing prices in Cook County with fairness analysis for property tax assessments.',
  fullDescription: `A comprehensive data science project that builds linear regression models to predict housing prices in Cook County, Illinois. 
  The project analyzes data from the Cook County Assessor's Office (CCAO) to understand property valuation and explores the critical 
  implications of statistical modeling in property taxation, particularly regarding racial discrimination and fairness in assessments. 
  Through systematic feature engineering and model evaluation, achieved training RMSE of ~159,702, meeting production-ready thresholds 
  while addressing ethical considerations in algorithmic decision-making for government applications.`,
  status: 'completed',
  category: 'AI-ML',
  featured: true,
  
  startDate: '2023-03-01',
  endDate: '2023-03-23',
  lastUpdated: '2023-03-23',
  
  technologies: {
    frontend: [],
    backend: ['Python'],
    database: [],
    deployment: [],
    tools: ['Jupyter Notebook', 'pandas', 'scikit-learn', 'matplotlib', 'seaborn', 'numpy']
  },
  primaryTech: ['Python', 'scikit-learn', 'pandas', 'Linear Regression'],
  
  images: [],
  
  links: [
    { type: 'github', url: 'https://github.com/NicoV7/AI-ML-CCAO-Housing-Price', label: 'GitHub Repository' }
  ],
  
  features: [
    { title: 'Linear Regression Modeling', description: 'Built multiple linear regression models with systematic feature selection', implemented: true },
    { title: 'Feature Engineering Pipeline', description: 'Implemented data preprocessing using pandas.pipe for scalable transformations', implemented: true },
    { title: 'Model Performance Optimization', description: 'Achieved training RMSE <200k through outlier removal and feature selection', implemented: true },
    { title: 'Fairness Analysis', description: 'Analyzed model bias and discrimination patterns in property assessments', implemented: true },
    { title: 'Train-Validation Split', description: 'Proper 80/20 data splitting with robust evaluation methodology', implemented: true },
    { title: 'Residual Analysis', description: 'Comprehensive error analysis and model diagnostic evaluation', implemented: true }
  ],
  
  challenges: [
    'Balancing model accuracy with fairness considerations in property tax assessments',
    'Feature selection from 62+ variables while avoiding overfitting',
    'Addressing ethical implications of algorithmic bias in government applications',
    'Meeting strict RMSE performance thresholds for real-world deployment'
  ],
  
  learnings: [
    'Applied linear regression to real-world government data with social justice implications',
    'Gained experience with feature engineering pipelines using pandas and scikit-learn',
    'Learned to evaluate model fairness beyond accuracy metrics in sensitive applications',
    'Developed understanding of property valuation and tax assessment methodologies',
    'Practiced systematic model validation and performance optimization techniques'
  ],
  
  tags: ['Data Science', 'Linear Regression', 'Property Valuation', 'Fairness in ML', 'Government Data'],
  teamSize: 1,
  myRole: 'Data Scientist',
  clientType: 'UC Berkeley',
  displayOrder: 5
},
{
  id: '6',
  slug: 'spam-email-classifier',
  title: 'Email Spam Classification System',
  shortDescription: 'Logistic regression classifier achieving 90.6% accuracy in spam detection through advanced feature engineering.',
  fullDescription: `A machine learning project implementing an email spam classifier using logistic regression with sophisticated feature 
  engineering techniques. The system analyzes email content to distinguish spam from legitimate emails, achieving 90.6% training 
  accuracy through careful selection of discriminative features. The project involved systematic analysis of word frequencies, 
  HTML content patterns, and punctuation usage to identify the most effective spam indicators. Built with a focus on understanding 
  the trade-offs between false positives (important emails filtered) and false negatives (spam reaching inbox) in real-world applications.`,
  status: 'completed',
  category: 'AI-ML',
  featured: true,
  
  startDate: '2023-04-01',
  endDate: '2023-04-30',
  lastUpdated: '2023-04-30',
  
  technologies: {
    frontend: [],
    backend: ['Python'],
    database: [],
    deployment: [],
    tools: ['Jupyter Notebook', 'pandas', 'scikit-learn', 'matplotlib', 'seaborn', 'numpy']
  },
  primaryTech: ['Python', 'scikit-learn', 'Logistic Regression', 'NLP'],
  
  images: [],
  
  links: [
    { type: 'github', url: 'https://github.com/NicoV7/AI-ML-Spam-And-Ham-Classifier', label: 'GitHub Repository' }
  ],
  
  features: [
    { title: 'Logistic Regression Classifier', description: 'Implemented binary classification with 90.6% accuracy on training data', implemented: true },
    { title: 'Advanced Feature Engineering', description: 'Created 60 discriminative features from text analysis and domain knowledge', implemented: true },
    { title: 'Text Processing Pipeline', description: 'Built words_in_texts() function for efficient binary feature extraction', implemented: true },
    { title: 'Frequency Analysis', description: 'Systematic analysis of word frequencies between spam and legitimate emails', implemented: true },
    { title: 'HTML Content Detection', description: 'Identified HTML tags and formatting as strong spam indicators', implemented: true },
    { title: 'ROC Curve Analysis', description: 'Comprehensive evaluation of classification performance across thresholds', implemented: true }
  ],
  
  challenges: [
    'Balancing false positive vs false negative rates for optimal user experience',
    'Feature selection from thousands of potential words to avoid overfitting',
    'Handling class imbalance and ensuring robust validation methodology',
    'Identifying discriminative features while avoiding dataset-specific biases'
  ],
  
  learnings: [
    'Applied logistic regression to text classification with systematic feature engineering',
    'Learned to evaluate classification models using multiple metrics beyond accuracy',
    'Gained experience with text preprocessing and natural language processing techniques',
    'Developed understanding of spam detection challenges and real-world trade-offs',
    'Practiced systematic approach to feature selection and model validation'
  ],
  
  tags: ['Machine Learning', 'Classification', 'NLP', 'Feature Engineering', 'Email Security'],
  teamSize: 1,
  myRole: 'Machine Learning Engineer',
  clientType: 'UC Berkeley',
  displayOrder: 6
},
{
  id: '7',
  slug: 'wogo-social-platform',
  title: 'WoGo Social Media Platform',
  shortDescription: 'Production-ready social media platform with Instagram-style feed, three-tier moment system, and AWS serverless backend.',
  fullDescription: `A production-grade social media platform built for Wogo Life Inc, featuring 60,000+ lines of code and 60+ React components.
  The platform combines Instagram-style vertical video feeds with a unique three-tier moment system (Bronze/Silver/Gold based on radius and visibility),
  modern Google Maps integration, and comprehensive social features. Built with React 18, TypeScript, and AWS serverless architecture (Lambda, DynamoDB,
  S3, Cognito) in a Turborepo monorepo. Features include live camera integration with 60-second recording limits, real-time social interactions
  (likes, comments, shares), direct messaging, activity feeds, and location-based discovery with GPS tracking and Haversine distance calculations.`,
  status: 'completed',
  category: 'web-app',
  featured: true,

  startDate: '2024-06-01',
  endDate: '2024-11-30',
  lastUpdated: '2025-11-20',

  technologies: {
    frontend: ['React 18', 'TypeScript', 'Vite', 'TailwindCSS', 'shadcn/ui', 'Capacitor', 'Google Maps API'],
    backend: ['AWS Lambda', 'AWS API Gateway', 'Serverless Framework', 'Node.js'],
    database: ['AWS DynamoDB', 'AWS S3', 'AWS Cognito'],
    deployment: ['AWS', 'Turborepo', 'Capacitor'],
    tools: ['TanStack React Query', 'React Context', 'Google Places API', 'ESLint', 'TypeScript']
  },
  primaryTech: ['React', 'TypeScript', 'AWS Lambda', 'DynamoDB', 'Vite', 'TailwindCSS'],

  images: [],

  links: [
    { type: 'live', url: 'https://www.thewogo.com', label: 'Live Demo' }
  ],

  features: [
    { title: 'Instagram-Style Feed', description: 'Full-screen vertical video feed with snap positioning and swipe navigation', implemented: true },
    { title: 'Three-Tier Moment System', description: 'Bronze (20mi radius), Silver (allies-only), Gold (global) content distribution', implemented: true },
    { title: 'Modern Google Maps Integration', description: 'Custom styling, marker clustering, React-based InfoWindows, custom SVG markers', implemented: true },
    { title: 'Live Camera Integration', description: 'Native video/photo capture with 60-second recording limit and real-time preview', implemented: true },
    { title: 'Real-Time Social Features', description: 'Likes, comments, shares, activity feed, direct messaging with instant updates', implemented: true },
    { title: 'Location Services', description: 'GPS tracking with Haversine distance calculation for proximity-based features', implemented: true },
    { title: 'AWS Serverless Backend', description: 'Lambda functions, DynamoDB tables, API Gateway, Cognito auth, S3 storage', implemented: true },
    { title: 'User Management System', description: 'Streak tracking (3-video daily goal), comprehensive profiles, allies system', implemented: true },
    { title: 'Monorepo Architecture', description: 'Turborepo workspace with shared packages and optimized build pipeline', implemented: true }
  ],

  challenges: [
    'Scaling to production-ready status with 60,000+ lines of code and 60+ components',
    'Implementing Instagram-style vertical feed with smooth snap positioning and performance optimization',
    'Modernizing Google Maps integration with React-based InfoWindows and custom marker clustering',
    'Building AWS serverless architecture with Lambda, DynamoDB, and S3 for scalable backend',
    'Integrating native camera functionality with Capacitor for mobile video capture',
    'Designing three-tier content distribution system with location-based filtering'
  ],

  learnings: [
    'Built production-scale React application with advanced state management and performance optimization',
    'Mastered AWS serverless architecture with Lambda, DynamoDB, API Gateway, and Cognito',
    'Gained expertise in Google Maps API with custom markers, clustering, and React integration',
    'Learned mobile app development with Capacitor for native camera and GPS features',
    'Developed skills in location-based services with Haversine distance calculations',
    'Practiced monorepo architecture with Turborepo for large-scale application management',
    'Enhanced understanding of social media platform features: feeds, messaging, activity tracking'
  ],

  tags: ['Social Media', 'AWS Serverless', 'TypeScript', 'React', 'Google Maps', 'Capacitor', 'Full-Stack'],
  teamSize: 1,
  myRole: 'Full-Stack Developer — Frontend, AWS Backend, & Mobile Integration',
  clientType: 'freelance',
  displayOrder: 7
},
{
  id: '8',
  slug: 'ynld-trust-youtube-summarizer',
  title: 'YNLD Trust - YouTube Summarizer',
  shortDescription: 'AI-powered Chrome extension that summarizes YouTube playlists using Gemini and OpenAI APIs with multi-format export.',
  fullDescription: `A Chrome extension built for YNLD Trust that leverages AI to automatically summarize YouTube playlists, helping users
  quickly understand video content without watching everything. The extension extracts transcripts from YouTube videos and uses Google's
  Gemini API (with OpenAI as fallback) to generate concise summaries. Users can batch process entire playlists and export summaries in
  multiple formats (Markdown, PDF, DOCX). Built with a cost-effective architecture where users provide their own API keys, eliminating
  hosting costs for the client while maintaining full functionality. Features a modern React-based UI with Tailwind CSS and Chrome Extension
  Manifest V3 for enhanced security and performance.`,
  status: 'completed',
  category: 'web-app',
  featured: true,

  startDate: '2024-09-01',
  endDate: '2024-10-31',
  lastUpdated: '2024-10-31',

  technologies: {
    frontend: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    backend: ['Chrome Extension Manifest V3'],
    database: [],
    deployment: ['Chrome Web Store'],
    tools: ['Gemini API', 'OpenAI API', 'jsPDF', 'docx', 'ESLint', 'Prettier']
  },
  primaryTech: ['React', 'TypeScript', 'Chrome Extension', 'Gemini API'],

  images: [],

  links: [],

  features: [
    { title: 'Automatic Transcript Extraction', description: 'Extract transcripts from YouTube videos automatically without manual input', implemented: true },
    { title: 'Dual AI Summarization', description: 'Primary Gemini API with OpenAI fallback for reliable AI-powered summarization', implemented: true },
    { title: 'Batch Playlist Processing', description: 'Process entire YouTube playlists with a single click for efficient workflow', implemented: true },
    { title: 'Multi-Format Export', description: 'Export summaries as Markdown (.md), PDF, or DOCX for flexible use cases', implemented: true },
    { title: 'User-Provided API Keys', description: 'Cost-effective architecture with zero hosting costs for the client', implemented: true },
    { title: 'Chrome Extension UI', description: 'Modern popup interface with Tailwind CSS and intuitive controls', implemented: true },
    { title: 'Manifest V3 Compliance', description: 'Built with latest Chrome Extension standards for enhanced security', implemented: true }
  ],

  challenges: [
    'Integrating YouTube transcript extraction with reliable fallback mechanisms',
    'Implementing dual AI provider system (Gemini + OpenAI) with seamless failover',
    'Designing user-friendly API key management within Chrome Extension constraints',
    'Building multi-format export functionality (PDF, DOCX, Markdown) in browser environment',
    'Ensuring Chrome Extension Manifest V3 compliance with modern security requirements'
  ],

  learnings: [
    'Mastered Chrome Extension development with Manifest V3 architecture and APIs',
    'Gained expertise integrating multiple AI APIs (Gemini and OpenAI) with fallback logic',
    'Learned browser-based document generation with jsPDF and docx libraries',
    'Developed skills in YouTube API integration and transcript extraction techniques',
    'Practiced cost-effective architecture design with client-side API key management',
    'Enhanced understanding of modern Chrome Extension security and permissions model'
  ],

  tags: ['Chrome Extension', 'AI', 'YouTube', 'Summarization', 'TypeScript', 'React'],
  teamSize: 1,
  myRole: 'Full-Stack Developer — Chrome Extension Development & AI Integration',
  clientType: 'freelance',
  displayOrder: 8
},
{
  id: '9',
  slug: 'smartcache',
  title: 'SmartCache',
  shortDescription: 'Production-grade two-tier caching system with Redis and PostgreSQL, featuring ETL pipeline and >90% cache hit rate.',
  fullDescription: `A high-performance, production-ready caching service demonstrating advanced Python development and data engineering skills.
  SmartCache implements a two-tier caching architecture with Redis (L1 for speed) and PostgreSQL (L2 for persistence), designed for marketing
  analytics data workflows. Features include schema-aware data validation with Pydantic, a complete ETL pipeline for CSV/JSON ingestion,
  an interactive web dashboard built with Alpine.js and Chart.js, and a beautiful CLI tool using Rich formatting. The system achieves >90%
  cache hit rates with <10ms L1 latency and <50ms L2 latency, handling 1000+ requests/second. Built with production-grade observability
  (structured logging, Prometheus metrics, health checks), full type safety (mypy strict mode), and comprehensive Docker deployment with
  multi-environment support. Demonstrates modern Python best practices including async/await patterns, SQLAlchemy 2.0 async, Alembic
  migrations, and resilience patterns like circuit breakers and exponential backoff.`,
  status: 'completed',
  category: 'api',
  featured: false,

  startDate: '2024-08-01',
  endDate: '2024-09-30',
  lastUpdated: '2024-09-30',

  technologies: {
    frontend: ['Alpine.js', 'Tailwind CSS', 'Chart.js'],
    backend: ['FastAPI', 'Python 3.12+', 'Uvicorn'],
    database: ['PostgreSQL 16', 'Redis 7', 'SQLAlchemy 2.0'],
    deployment: ['Docker', 'Docker Compose', 'Poetry'],
    tools: ['Alembic', 'pytest', 'Black', 'Ruff', 'mypy', 'Typer', 'Rich', 'Pandas', 'Pydantic']
  },
  primaryTech: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Alpine.js'],

  images: [],

  links: [],

  features: [
    { title: 'Two-Tier Caching Architecture', description: 'Redis L1 for speed (<10ms) + PostgreSQL L2 for persistence (<50ms)', implemented: true },
    { title: 'ETL Pipeline', description: 'CSV/JSON ingestion with Pydantic validation, transformation, and storage', implemented: true },
    { title: 'Interactive Web Dashboard', description: 'Real-time metrics, cache operations, namespace browser with Alpine.js + Chart.js', implemented: true },
    { title: 'Beautiful CLI Tool', description: 'Rich-formatted command-line interface with Typer for all cache operations', implemented: true },
    { title: 'Production Observability', description: 'Structured logging, Prometheus metrics, comprehensive health checks', implemented: true },
    { title: 'Schema-Aware Validation', description: 'Pydantic models with schema versioning for evolving data structures', implemented: true },
    { title: 'High Performance', description: '>90% cache hit rate, <10ms L1 latency, 1000+ requests/second throughput', implemented: true },
    { title: 'Type Safety', description: 'Full type hints with mypy strict mode for production reliability', implemented: true },
    { title: 'Resilience Patterns', description: 'Retry logic with exponential backoff, circuit breaker patterns', implemented: true }
  ],

  challenges: [
    'Designing optimal two-tier caching strategy for marketing analytics data workflows',
    'Implementing schema versioning system for evolving data structures without breaking changes',
    'Building resilient ETL pipeline with proper error handling and recovery mechanisms',
    'Optimizing PostgreSQL query performance with indexing strategies for cache operations',
    'Balancing cache eviction policies for optimal memory usage and hit rates',
    'Ensuring type safety across async operations with modern Python patterns'
  ],

  learnings: [
    'Mastered production PostgreSQL usage with async SQLAlchemy 2.0 and Alembic migrations',
    'Gained expertise in ETL pipeline engineering with Pydantic validation and error handling',
    'Learned modern Python best practices: async/await, type hints, structured logging',
    'Developed skills in API and SDK design with FastAPI and comprehensive documentation',
    'Practiced resilience patterns including circuit breakers and exponential backoff retry logic',
    'Enhanced understanding of caching strategies, eviction policies, and performance optimization',
    'Built production-grade observability with Prometheus metrics and structured logging'
  ],

  tags: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'ETL', 'Data Engineering', 'Caching', 'Docker'],
  teamSize: 1,
  myRole: 'Backend Developer — Data Engineering & Cache Architecture',
  clientType: 'personal',
  displayOrder: 9
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
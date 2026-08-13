/**
 * Single source for the "All Projects" index (the finale's SHOW ALL overlay).
 * The full catalog plus the notable finale builds, each with a GitHub-sourced
 * blurb. `href` is omitted where the repo is private or there is no public link,
 * so the detail pane renders no broken CTA. Blurbs scraped 2026-08-13 (public
 * repos via fetch; private repos fall back to the project's own copy).
 */

export interface SideProject {
  slug: string
  title: string
  blurb: string
  stack: string[]
  /** public repo or live URL; absent when the repo is private / has no public link */
  href?: string
}

export const ALL_PROJECTS: SideProject[] = [
  {
    slug: 'task-management-app',
    title: 'AI Task Manager',
    blurb:
      'Full-stack task manager with AI suggestions powered by Anthropic Claude, turning natural language into organized, prioritized tasks and auto-breaking big ones into subtasks. Django, React, PostgreSQL, and Docker.',
    stack: ['Django', 'React', 'Docker'],
    href: 'https://github.com/NicoV7/ai-task-manager',
  },
  {
    slug: 'shaders-project',
    title: 'Fractal Shaders',
    blurb:
      'A UC Berkeley CS 184 shader suite exploring the Mandelbrot set with fog and Phong lighting, written in C++ and GLSL and iterated live on Shadertoy.',
    stack: ['C++', 'OpenGL', 'GLSL'],
    href: 'https://www.shadertoy.com/view/lccXDj',
  },
  {
    slug: 'secure-file-sharing',
    title: 'E2E File Sharing',
    blurb:
      'A UC Berkeley CS 161 Dropbox-style file sharing client built in Go, with end-to-end encryption, integrity guarantees, and revocable secure sharing the server can never read.',
    stack: ['Golang', 'Cryptography'],
  },
  {
    slug: 'collaborative-drawing-board',
    title: 'Collaborative Drawing',
    blurb:
      'A real-time multi-user drawing platform with end-to-end encryption and CRDT conflict resolution, built on React, FastAPI, PostgreSQL, and WebSockets.',
    stack: ['React', 'FastAPI', 'CRDT'],
    href: 'https://github.com/NicoV7/collaborative-drawing-board',
  },
  {
    slug: 'ccao-housing-predictor',
    title: 'Housing Predictor',
    blurb:
      'A linear-regression model predicting Cook County housing prices, paired with a fairness analysis of racial bias in property tax assessments. Python and scikit-learn.',
    stack: ['Python', 'scikit-learn'],
  },
  {
    slug: 'spam-email-classifier',
    title: 'Spam Classifier',
    blurb:
      'A logistic-regression email spam classifier reaching 90.6% accuracy through 60 engineered text and HTML-content features, built in Python.',
    stack: ['Python', 'NLP'],
  },
  {
    slug: 'wogo-social-platform',
    title: 'WoGo',
    blurb:
      'A production social platform with an Instagram-style vertical video feed, a three-tier moment system, and an AWS serverless backend. 60k+ lines, solo-built in React and TypeScript.',
    stack: ['React', 'AWS', 'TypeScript'],
    href: 'https://www.thewogo.com',
  },
  {
    slug: 'ynld-trust-youtube-summarizer',
    title: 'YNLD Summarizer',
    blurb:
      'A Chrome extension that summarizes entire YouTube playlists using Gemini with an OpenAI fallback, exporting to Markdown, PDF, and DOCX. Manifest V3, user-provided keys, zero hosting cost.',
    stack: ['React', 'Gemini', 'MV3'],
  },
  {
    slug: 'smartcache',
    title: 'SmartCache',
    blurb:
      'A two-tier Redis and PostgreSQL caching service with a Pydantic-validated ETL pipeline, over 90% hit rate, and production observability. Python and FastAPI.',
    stack: ['Python', 'Redis', 'Postgres'],
  },
  {
    slug: 'yojimbo',
    title: 'Yojimbo',
    blurb:
      'An autonomous investing agent that gates trading decisions behind evals and governance.',
    stack: ['Agents', 'Finance'],
    href: 'https://yojimbo.site',
  },
  {
    slug: 'personal-harness',
    title: 'Personal Harness',
    blurb:
      'A Python MCP harness that injects your skills and rules into any coding agent’s context in real time, using hybrid RAG over Redis and hard consultation gates. First-class adapters for Claude Code and Codex.',
    stack: ['Python', 'MCP', 'RAG'],
    href: 'https://github.com/NicoV7/Personal-Harness',
  },
  {
    slug: 'debate-rpg',
    title: 'Debate RPG',
    blurb:
      'A local-first creature-collector RPG where you capture and train autonomous AI debate agents to battle through argument in turn-based encounters. React, Phaser, FastAPI, and local LLMs. Built at the Berkeley AI Hackathon.',
    stack: ['React', 'Phaser', 'FastAPI'],
    href: 'https://github.com/NicoV7/BerkeleyAIHackathon2026',
  },
  {
    slug: 'parlor',
    title: 'Parlor',
    blurb:
      'A daily AI murder-mystery game for Reddit: interrogate procedurally generated suspects and solve provably solvable cases on an interactive deduction board. Devvit, Phaser, React, and Gemini/OpenAI. Reddit Games Hackathon.',
    stack: ['Devvit', 'Phaser', 'LLM'],
    href: 'https://github.com/NicoV7/RedditHackathon',
  },
  {
    slug: 'learngraph',
    title: 'LearnGraph',
    blurb:
      'A security-deposit claims prediction system in Next.js and Python that took 2nd place at the GStack x Gbrain (YCombinator) hackathon.',
    stack: ['Next.js', 'Python', 'ML'],
    href: 'https://github.com/NicoV7/GStackHack',
  },
]

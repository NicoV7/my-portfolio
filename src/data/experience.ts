import type { ExperienceItem } from '../types/experience'

/**
 * Canonical work history (reverse-chronological).
 * `milestoneId` joins to src/data/milestones.ts for the 3D career drive.
 * Source of truth for the Experience timeline section.
 */
export const experience: ExperienceItem[] = [
  {
    id: 'ambra',
    milestoneId: 'ambra',
    order: 0,
    company: 'Ambra',
    role: 'Founding Engineer',
    location: 'San Francisco, CA · Hybrid',
    startDate: '2026-07',
    period: 'Jul 2026 — Present',
    summary: 'Building automation pipelines in healthcare as founding engineer.',
    highlights: [
      'Architecting health-automation infrastructure from the ground up as the founding engineer.',
      'Designing agentic pipelines that move clinical and operational data safely across systems.',
    ],
    metrics: [{ value: 'Founding', label: 'Engineer' }],
    tech: ['TypeScript', 'Python', 'Agentic workflows', 'Healthcare'],
  },
  {
    id: 'agentic-ide',
    milestoneId: 'agentic-ide',
    order: 1,
    company: 'Agentic IDE Inc.',
    role: 'Founder',
    location: 'San Francisco, CA',
    startDate: '2026-03',
    endDate: '2026-05',
    period: 'Mar 2026 — May 2026',
    summary:
      'Founded AIDE — agentic dev infrastructure with multi-model, parallel workflow orchestration.',
    highlights: [
      'Built agentic infrastructure: multi-model parallel orchestration with automatic skills + RAG memory search for frictionless architecture.',
      'Deployed the infra to run autonomous finance & capital-deployment agents (PageIndex, Hermes, recursive-learning agents ingesting news + documents).',
      'Local-first: MCP tools with SHA-256 encryption and PII key-signer endpoints; one-line install.',
    ],
    metrics: [
      { value: '22%', label: 'CAGR (finance agents)' },
      { value: '2.1', label: 'Sharpe ratio' },
    ],
    tech: ['TypeScript', 'RAG', 'MCP', 'LLM orchestration', 'Python'],
    url: 'https://www.aideapp.dev',
  },
  {
    id: 'corgi',
    milestoneId: 'corgi',
    order: 2,
    company: 'Corgi',
    role: 'Full Stack Engineer',
    location: 'San Francisco, CA · On-site',
    startDate: '2026-01',
    endDate: '2026-02',
    period: 'Jan 2026 — Feb 2026',
    summary:
      'Architected the B2C platform and shipped ML + AI-automation for insurance claims.',
    highlights: [
      'Architected and built the B2C infrastructure and platform, targeting $10M in revenue.',
      'Deployed ML classifiers + regression on claim data: 89% classification (RAG/embeddings), regression RMSE ~0.13.',
      'Built AI workflows to automate insurance intake with compliance-aware DB-connected agents; end-to-end Shopify + Bland integrations.',
    ],
    metrics: [
      { value: '200K+', label: 'LOC in a month' },
      { value: '$10M', label: 'infra target' },
      { value: '89%', label: 'ML classification' },
    ],
    tech: ['TypeScript', 'Python', 'ML', 'RAG', 'Shopify', 'Bland'],
  },
  {
    id: 'ynld',
    milestoneId: 'ynld',
    order: 3,
    company: 'YNLD Trust',
    role: 'Software Engineer',
    startDate: '2025-11',
    endDate: '2026-01',
    period: 'Nov 2025 — Jan 2026',
    summary:
      'Built a full-stack AI financial system orchestrating AI governance workflows.',
    highlights: [
      'Engineered an end-to-end platform advising users on stock trades with a BUY / HOLD / SELL action.',
      'Achieved ~10% year-over-year profitability using AI workflows.',
    ],
    metrics: [{ value: '~10%', label: 'YoY profitability' }],
    tech: ['React', 'TypeScript', 'AI workflows', 'FinTech'],
  },
  {
    id: 'wogo',
    milestoneId: 'wogo',
    order: 4,
    company: 'Wogo Life Inc.',
    role: 'Founding Software Engineer',
    startDate: '2025-09',
    endDate: '2026-01',
    period: 'Sep 2025 — Jan 2026',
    summary:
      'Solo-built a cross-platform social media app, shipped to the App Store & Play Store.',
    highlights: [
      'Co-founded and built as solo developer a cross-platform, end-to-end social media app — live on the App Store and Play Store.',
      'Implemented 40+ REST endpoints and rebuilt the app after fixing 40 bugs in the original version.',
      'Reduced video upload times by 300% via AWS optimizations.',
    ],
    metrics: [
      { value: '40+', label: 'REST endpoints' },
      { value: '300%', label: 'faster uploads' },
      { value: '2 stores', label: 'App + Play' },
    ],
    tech: ['React', 'TypeScript', 'AWS', 'Capacitor', 'Mobile'],
    url: 'https://www.thewogo.com',
  },
  {
    id: 'farmers',
    milestoneId: 'farmers',
    order: 5,
    company: 'Farmers Insurance',
    role: 'Software Engineer Intern',
    location: 'Remote',
    startDate: '2023-06',
    endDate: '2023-08',
    period: 'Jun 2023 — Aug 2023',
    summary: 'Built a full-stack live chat service that saved the company $504K/year.',
    highlights: [
      'Developed a full-stack live chat service that saved the company $504,000 a year.',
      'Found an exploit in Salesforce to bypass licensing; built our own API and data pipeline.',
      'Routed data and worked cross-functionally across multiple teams.',
    ],
    metrics: [{ value: '$504K', label: 'saved / year' }],
    tech: ['Java', 'Full Stack', 'Data pipeline', 'Salesforce'],
  },
  {
    id: 'ccsf-tutor',
    order: 6,
    company: 'City College of San Francisco',
    role: 'Computer Science Tutor',
    location: 'San Francisco, CA',
    startDate: '2021-08',
    endDate: '2021-12',
    period: 'Aug 2021 — Dec 2021',
    summary: 'Tutored CS students in software design and Java.',
    highlights: [
      'Tutored peers in software design, Java, and core data-structures coursework.',
    ],
    tech: ['Java', 'Software Design'],
  },
]

export function getExperience(): ExperienceItem[] {
  return [...experience].sort((a, b) => a.order - b.order)
}

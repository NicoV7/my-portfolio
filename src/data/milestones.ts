import type { Milestone } from '../types/milestone'

/**
 * The stops of the career drive, in narrative order.
 * The white C63 AMG drives origin to present, arriving at each.
 * Order here is authoritative; curve.ts places one marker per stop.
 */
export const milestones: Milestone[] = [
  {
    id: 'berkeley',
    order: 0,
    label: 'UC BERKELEY',
    year: '2025',
    company: 'UC Berkeley',
    role: "B.A. Computer Science '25",
    impact:
      'First-gen, community-college transfer to Berkeley CS, where the drive begins.',
    metrics: [
      { value: 'CS', label: "Class of '25" },
      { value: 'Transfer', label: 'first-gen' },
    ],
  },
  {
    id: 'farmers',
    order: 1,
    label: 'FARMERS',
    year: '2023',
    company: 'Farmers Insurance',
    role: 'Software Engineer Intern',
    impact: 'Built a live chat service that saved the company $504K per year.',
    metrics: [{ value: '$504K', label: 'saved / year' }],
  },
  {
    id: 'wogo',
    order: 2,
    label: 'WOGO',
    year: '2025',
    company: 'Wogo Life',
    role: 'Founding Software Engineer',
    impact:
      'Solo-built a cross-platform social app, shipped to the App Store & Play Store.',
    metrics: [
      { value: '40+', label: 'REST endpoints' },
      { value: '300%', label: 'faster uploads' },
    ],
  },
  {
    id: 'ynld',
    order: 3,
    label: 'YNLD TRUST',
    year: '2025-2026',
    company: 'YNLD Trust',
    role: 'AI Engineer (Contract)',
    impact:
      'Built a trading-decision workflow with eval gating: 10% average return.',
    metrics: [
      { value: '10%', label: 'avg return' },
      { value: 'Evals', label: 'gated decisions' },
    ],
  },
  {
    id: 'corgi',
    order: 4,
    label: 'CORGI',
    year: '2026',
    company: 'Corgi',
    role: 'Full Stack Engineer',
    impact: 'Architected a $10M B2C platform: 200K+ LOC in a single month.',
    metrics: [
      { value: '200K+', label: 'LOC / month' },
      { value: '$10M', label: 'infra target' },
    ],
  },
  {
    id: 'agentic-ide',
    order: 5,
    label: 'AGENTIC IDE',
    year: '2026',
    company: 'Agentic IDE',
    role: 'Founder',
    impact:
      'Founded AIDE, agentic dev infra powering autonomous finance agents (22% CAGR).',
    metrics: [
      { value: '22%', label: 'CAGR' },
      { value: '2.1', label: 'Sharpe' },
    ],
  },
  {
    id: 'ambra',
    order: 6,
    label: 'AMBRA',
    year: '2026',
    company: 'Ambra',
    role: 'Founding Engineer',
    impact: 'Building health-automation infrastructure as founding engineer. Now.',
    metrics: [{ value: 'Founding', label: 'Engineer' }],
  },
]

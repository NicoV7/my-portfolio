import type { Profile } from '../types/profile'

export const profile: Profile = {
  name: 'Nicolas Vega',
  shortName: 'Nico Vega',
  pronouns: 'He/Him',
  title: 'Full Stack Engineer and Applied AI',
  tagline: 'AI-native full-stack engineer',
  location: 'San Francisco, California',
  bio: [
    'I grew up first-generation and low-income, with a disability that kept me out of school for weeks at a time. No one expected me to make it. I started at community college, transferred to UC Berkeley, and graduated with a degree in Computer Science.',
    'Since then I have been deep in the AI startup world — shipping production systems across social, fintech, insurance, and healthcare, and founding my own company to fight the technical debt that AI-assisted code leaves behind.',
    'Most recently I was a founding engineer at Ambra, building health-automation infrastructure. I care about shipping fast without shipping slop: clean architecture, real tests, and systems that hold up under pressure.',
  ],
  education: [
    {
      school: 'University of California, Berkeley',
      degree: "B.A. Computer Science '25",
      note: 'Community-college transfer · first-generation',
    },
  ],
  stats: [
    { value: '47', label: 'GitHub repos' },
    { value: '200K', label: 'LOC in a month' },
    { value: '2nd / 250', label: 'YC hackathon' },
    { value: '$504K', label: 'saved at Farmers' },
  ],
  socials: [
    {
      type: 'github',
      url: 'https://github.com/NicoV7',
      handle: 'NicoV7',
      label: 'GitHub',
    },
    {
      type: 'linkedin',
      url: 'https://www.linkedin.com/in/nvegab99',
      handle: 'nvegab99',
      label: 'LinkedIn',
    },
    {
      type: 'email',
      url: 'mailto:nico@ambra911.com',
      handle: 'nico@ambra911.com',
      label: 'Email',
    },
  ],
  skillGroups: [
    {
      name: 'AI / ML',
      skills: [
        'LLM orchestration',
        'RAG & embeddings',
        'Agentic workflows',
        'MCP',
        'scikit-learn',
        'Claude / GPT / Gemini',
      ],
    },
    {
      name: 'Full-Stack',
      skills: ['React', 'Next.js', 'TypeScript', 'Node', 'FastAPI', 'Django', 'GraphQL'],
    },
    {
      name: 'Infra / Cloud',
      skills: ['AWS', 'Docker', 'PostgreSQL', 'Redis', 'DynamoDB', 'Serverless'],
    },
    {
      name: 'Systems / Graphics / Security',
      skills: ['Go', 'C++', 'OpenGL / GLSL', 'E2E encryption', 'Data pipelines'],
    },
  ],
  highlights: [
    {
      title: '2nd of 250 — YC Gbrain × Gstack Hackathon',
      detail: 'Built LearnGraph, an adaptive learning tool, in 8 hours (20K+ LOC).',
      year: '2026',
    },
    {
      title: 'Berkeley AI Hackathon',
      detail: 'Competed at the Berkeley AI Hackathon 2026.',
      year: '2026',
    },
    {
      title: 'Microsoft for Startups',
      detail: 'Agentic IDE accepted within two weeks of founding.',
      year: '2026',
    },
  ],
  featuredProjectSlugs: [
    'wogo-social-platform',
    'ynld-trust-youtube-summarizer',
    'shaders-project',
    'secure-file-sharing',
  ],
}

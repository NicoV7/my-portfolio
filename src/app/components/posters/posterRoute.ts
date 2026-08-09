/**
 * Route data for the Poster Drive: each pit stop is one animated vintage
 * poster (style anchored to Nico's reference set) carrying real resume
 * content. Type is ALWAYS live DOM, never baked into art layers.
 */

export interface CoverLine {
  text: string
  sub?: string
  /** visual weight: 'lead' = the big red line, 'line' = secondary, 'chip' = small badge */
  kind: 'lead' | 'line' | 'chip'
}

/** A features-strip entry that is a real link (Contact poster only). */
export interface FeatureLink {
  label: string
  href: string
  download?: boolean
}

export interface PosterMedia {
  type: 'image' | 'video'
  src: string
  caption: string
}

export interface PosterStopData {
  key: string
  /** reference style family driving layout + type treatment */
  style: 'postcard' | 'deco' | 'fuji' | 'jdm' | 'rally' | 'closing'
  masthead: string
  issue: string
  /** vertical side text (JDM) or eyebrow (others) */
  side?: string
  lines: CoverLine[]
  features?: (string | FeatureLink)[]
  /** era-styled inset prints of project media; empty-tolerant, max 3 rendered */
  media?: PosterMedia[]
  /** which side the car print sits on; consecutive posters alternate */
  layout?: 'left' | 'right'
  art: { bg: string; car?: string }
  theme: { paper: string; ink: string; accent: string }
}

/** The 7 stops of the journey, in drive order. Stop 5 (JDM) is the approved gate poster. */
export const POSTERS: PosterStopData[] = [
  {
    key: 'berkeley',
    style: 'postcard',
    masthead: 'GREETINGS FROM BERKELEY',
    issue: 'NO. 01 / 2022-2025',
    side: 'ORIGIN STORY',
    lines: [
      { text: 'FIRST-GEN TRANSFER', sub: 'CCSF (3.94, three degrees) to Berkeley CS', kind: 'lead' },
      { text: "B.A. COMPUTER SCIENCE '25", kind: 'line' },
      { text: 'THE DRIVE BEGINS', kind: 'line' },
    ],
    layout: 'left',
    art: { bg: '/posters/berkeley/bg.jpg', car: '/posters/berkeley/car.jpg' },
    theme: { paper: '#f1e6cf', ink: '#31261a', accent: '#1f4f86' },
  },
  {
    key: 'desert',
    style: 'postcard',
    masthead: 'FARMERS COUNTRY',
    issue: 'NO. 02 / 2023',
    side: 'SUMMER INTERNSHIP',
    lines: [
      { text: '$504K SAVED ANNUALLY', sub: 'the Salesforce live-chat gateway workaround', kind: 'lead' },
      { text: 'DEPLOYED NATIONALLY', kind: 'line' },
      { text: '10,000+ CONCURRENT USERS', kind: 'line' },
    ],
    layout: 'right',
    art: { bg: '/posters/desert/bg.jpg', car: '/posters/desert/car.jpg' },
    theme: { paper: '#f5dfc4', ink: '#43281a', accent: '#b0502b' },
  },
  {
    key: 'coast',
    style: 'deco',
    masthead: 'THE WOGO RUN',
    issue: 'NO. 03 / 2025',
    side: 'COASTAL SPRINT',
    lines: [
      { text: 'SOLO-SHIPPED IN 3 MONTHS', sub: 'web, iOS, Android; sole developer, 10% equity', kind: 'lead' },
      { text: '99.9% UPTIME UNDER $100/MO', kind: 'line' },
      { text: '40+ REST APIS, VIDEO PIPELINE', kind: 'line' },
    ],
    layout: 'left',
    art: { bg: '/posters/coast/bg.jpg', car: '/posters/coast/car.jpg' },
    theme: { paper: '#10304f', ink: '#f2e6cd', accent: '#e6a03c' },
  },
  {
    key: 'fuji',
    style: 'fuji',
    masthead: 'YNLD SESSION',
    issue: 'NO. 04 / 2025-2026',
    side: 'TRADING DESK',
    lines: [
      { text: '10% AVERAGE RETURN', sub: 'trading decisions gated by evals and governance', kind: 'lead' },
      { text: 'MARKET DATA TO JUDGMENT', kind: 'line' },
      { text: 'MV3 EXTENSION: 100+ PLAYLISTS', kind: 'line' },
    ],
    layout: 'right',
    art: { bg: '/posters/fuji/bg.jpg', car: '/posters/fuji/car.jpg' },
    theme: { paper: '#f6f3ec', ink: '#17171a', accent: '#d0312d' },
  },
  {
    key: 'jdm-corgi',
    style: 'jdm',
    masthead: 'NICO VEGA',
    issue: 'NO. 05 / 2026',
    side: 'FULL-STACK ENGINEER',
    lines: [
      { text: '$10M ATTRIBUTED', sub: 'the Shopify B2C pipeline, shipped in 2 days', kind: 'lead' },
      { text: '82% CLAIMS CLASSIFIER', sub: 'approve / partial / deny, XGBoost + ChromaDB', kind: 'line' },
      { text: 'BLAND AI INGESTION', sub: 'webhook to .NET across three stacks', kind: 'line' },
      { text: 'INSURTECH SPECIAL', kind: 'chip' },
    ],
    features: ['BetterAI: 108 commits, forked by employer', 'Yojimbo: autonomous investing', 'Debate RPG: Berkeley AI Hack', 'LearnGraph: 2nd place, YC-hosted'],
    art: { bg: '/posters/jdm/bg.jpg', car: '/posters/jdm/car.jpg' },
    theme: { paper: '#f0e6d2', ink: '#1d1611', accent: '#c8352a' },
  },
  {
    key: 'rally',
    style: 'rally',
    masthead: 'AGENTIC STAGE',
    issue: 'NO. 06 / 2026',
    side: 'FOUNDER STAGE',
    lines: [
      { text: '250+ CONCURRENT USERS', sub: 'shipped to production in 21 days, solo founder', kind: 'lead' },
      { text: 'MICROSOFT FOR STARTUPS, WEEK ONE', kind: 'line' },
      { text: 'ARENA AI PILOT ($1.7B)', kind: 'line' },
    ],
    features: ['Go / TypeScript / Python', 'Agents: MCP, RAG, tool design', 'GCP / AWS / Azure', 'Playwright / OWASP / SOC 2'],
    layout: 'right',
    art: { bg: '/posters/rally/bg.jpg', car: '/posters/rally/car.jpg' },
    theme: { paper: '#efe7d6', ink: '#4a4743', accent: '#c1272d' },
  },
  {
    key: 'closing',
    style: 'closing',
    masthead: 'PRESENT DAY',
    issue: 'NO. 07 / AMBRA911',
    lines: [
      { text: 'FOUNDING ENGINEER', sub: 'browser agents with tool-layer safety, EDI pipelines, voice agents', kind: 'lead' },
      { text: '65 PRS IN 4 WEEKS', kind: 'line' },
      { text: 'GET IN TOUCH', kind: 'line' },
    ],
    features: [
      { label: 'nvegab99@gmail.com', href: 'mailto:nvegab99@gmail.com' },
      { label: 'github.com/NicoV7', href: 'https://github.com/NicoV7' },
      { label: 'linkedin.com/in/nvegab99', href: 'https://linkedin.com/in/nvegab99' },
      { label: 'Resume (PDF)', href: '/resume.pdf', download: true },
    ],
    layout: 'left',
    art: { bg: '/posters/closing/bg.jpg', car: '/posters/closing/car.jpg' },
    theme: { paper: '#e3f1e8', ink: '#123528', accent: '#3f8f74' },
  },
]

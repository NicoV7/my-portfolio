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

export interface PosterStopData {
  key: string
  /** reference style family driving layout + type treatment */
  style: 'postcard' | 'deco' | 'fuji' | 'jdm' | 'rally' | 'closing'
  masthead: string
  issue: string
  /** vertical side text (JDM) or eyebrow (others) */
  side?: string
  lines: CoverLine[]
  features?: string[]
  art: { bg: string; car?: string }
  theme: { paper: string; ink: string; accent: string }
}

/** Stop 5 first — the gate poster. Remaining stops flesh out after the vote. */
export const POSTERS: PosterStopData[] = [
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
]

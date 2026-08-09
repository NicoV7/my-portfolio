/**
 * Single data source for the editorial stills hero. Replaces the 3D drive's
 * curve.ts + levels.ts pairing: same 6 equal progress bands (one per career
 * milestone, same order as data/milestones.ts), same band-midpoint stops and
 * seam borders, so scroll choreography (DriveTransition beat, milestone
 * placards) is unchanged — only the picture source moved from WebGL to stills.
 *
 * Swapping in the painterly repaints later = edit `image` paths here only.
 */

export const SCENE_COUNT = 6

/** progress at which each stop is centered — the interior of its own band. */
export const STOP_PROGRESS: number[] = Array.from(
  { length: SCENE_COUNT },
  (_, i) => (i + 0.5) / SCENE_COUNT
)

/** progress values of the seams between scenes (the transition beats). */
export const BORDERS: number[] = Array.from(
  { length: SCENE_COUNT - 1 },
  (_, i) => (i + 1) / SCENE_COUNT
)

export interface HeroScene {
  key: string
  /** pairs 1:1 with data/milestones.ts ids (same index order). */
  milestoneId: string
  image: string
  alt: string
  /** the scene's one saturated note — drives the seam-beat tint. */
  accent: string
  /** Persona-5 seam card — the "location" name shown when arriving. */
  card: { name: string; sub: string }
  /** deterministic scroll-driven drift across the scene's band. */
  kenBurns: { scaleFrom: number; scaleTo: number; panX: number; panY: number }
  /** object-position keeping the car in frame at any crop. */
  focal: string
}

/* kenBurns direction alternates push-in / pull-out with small counter-pans so
   consecutive scenes read as art-directed cuts, not a looped zoom. */
export const SCENES: HeroScene[] = [
  {
    key: 'berkeley',
    milestoneId: 'berkeley',
    image: '/hero/scene-01.jpg',
    alt: 'White C63 AMG on a winding campus road under a warm parchment dawn, Berkeley',
    accent: '#fdb515',
    card: { name: 'UC BERKELEY', sub: 'BERKELEY · CALIFORNIA' },
    kenBurns: { scaleFrom: 1.05, scaleTo: 1.11, panX: -1.6, panY: -0.9 },
    focal: '50% 58%',
  },
  {
    key: 'tokyo',
    milestoneId: 'farmers',
    image: '/hero/scene-02.jpg',
    alt: 'White C63 AMG on a foggy mountain expressway at night, Tokyo Shutoko',
    accent: '#ff3d8f',
    card: { name: 'TOKYO', sub: '首都高 · SHUTOKO' },
    kenBurns: { scaleFrom: 1.1, scaleTo: 1.04, panX: 1.6, panY: 0.6 },
    focal: '48% 55%',
  },
  {
    key: 'sf',
    milestoneId: 'wogo',
    image: '/hero/scene-03.jpg',
    alt: 'White C63 AMG in marine night fog by the Golden Gate, San Francisco',
    accent: '#f25c2a',
    card: { name: 'SAN FRANCISCO', sub: 'GOLDEN GATE · NIGHT' },
    kenBurns: { scaleFrom: 1.04, scaleTo: 1.09, panX: 1.8, panY: -0.7 },
    focal: '48% 55%',
  },
  {
    key: 'mojave',
    milestoneId: 'corgi',
    image: '/hero/scene-04.jpg',
    alt: 'White C63 AMG on Route 66 in burnt-sienna desert dusk, Mojave',
    accent: '#ff7a2e',
    card: { name: 'MOJAVE', sub: 'ROUTE 66 · NEVADA' },
    kenBurns: { scaleFrom: 1.09, scaleTo: 1.04, panX: -1.8, panY: 0.5 },
    focal: '50% 55%',
  },
  {
    key: 'tuner',
    milestoneId: 'agentic-ide',
    image: '/hero/scene-05.jpg',
    alt: 'White C63 AMG under pooled violet light at a midnight tuner meet',
    accent: '#a044ff',
    card: { name: 'THE MEET', sub: 'MIDNIGHT CLUB' },
    kenBurns: { scaleFrom: 1.05, scaleTo: 1.1, panX: 1.3, panY: -1.1 },
    focal: '48% 55%',
  },
  {
    key: 'ambra',
    milestoneId: 'ambra',
    image: '/hero/scene-06.jpg',
    alt: 'White C63 AMG resting in calm ink-green night light, present day',
    accent: '#46e3b0',
    card: { name: 'AMBRA', sub: 'PRESENT DAY' },
    // the exhale: a settle-back instead of another push
    kenBurns: { scaleFrom: 1.08, scaleTo: 1.04, panX: 0, panY: 0.9 },
    focal: '48% 56%',
  },
]

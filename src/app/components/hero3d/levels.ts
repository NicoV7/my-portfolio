/**
 * The drive is 6 discrete, stateful LEVELS — one per career milestone, in
 * narrative order. Each level owns its stretch of road (`controlPoints`, later
 * concatenated into the single global curve in curve.ts), a full lighting rig,
 * a Persona-5 location card, and a scenery key. `LevelManager` mounts only the
 * active (+ incoming during a seam) level to keep scene load low.
 *
 * This file is the single source of truth for per-region look; it replaces the
 * old `biomes.ts` (continuous cross-fade) and the hardcoded `LOCS` card list.
 */

export type LevelKey = 'berkeley' | 'tokyo' | 'sf' | 'mojave' | 'tuner' | 'ambra'

export interface LevelLightingConfig {
  night: number // 0 day .. 1 night — drives stars, exposure, headlights
  fog: { color: string; near: number; far: number }
  bg: string
  sun: [number, number, number]
  turbidity: number
  rayleigh: number
  ambient: number
  hemiSky: string
  hemiGround: string
  hemiIntensity: number
  keyColor: string
  keyIntensity: number
  keyPos: [number, number, number]
  rimColor: string
  rimIntensity: number
  ground: string
  roadColor: string
  accent: string
}

export interface LevelConfig extends LevelLightingConfig {
  key: LevelKey
  milestoneId: string
  /** This level's slice of road control points (x, z on the y=0 plane). */
  controlPoints: [number, number][]
  /** Persona-5 seam card — the "location" name shown when arriving. */
  card: { name: string; sub: string }
}

/**
 * Order is authoritative and pairs 1:1 with `milestones` (same index):
 * Berkeley (day campus) → Tokyo (night) → SF (night, Golden Gate lit) →
 * Mojave (day, Route 66) → The Meet (night tuner) → Ambra finale (night skyline).
 */
export const LEVELS: LevelConfig[] = [
  {
    key: 'berkeley',
    milestoneId: 'berkeley',
    controlPoints: [
      [-40, 10],
      [-28, 2],
      [-16, -6],
      [-4, 3],
    ],
    card: { name: 'UC BERKELEY', sub: 'BERKELEY · CALIFORNIA' },
    night: 0,
    // Gouache dawn (ref d1-campus): cream-blush horizon fog under a lavender
    // sky, a low warm dawn key, lavender fill so shadows tint mauve, and a
    // pale-pink ground with a mauve-grey road.
    fog: { color: '#f0dedd', near: 60, far: 300 },
    bg: '#cfcbf0',
    sun: [40, 5, 24], // low dawn sun → pink/peach horizon gradient from the Sky
    turbidity: 8,
    rayleigh: 2.4,
    ambient: 0.66,
    hemiSky: '#cfcbf0',
    hemiGround: '#d6aea1',
    hemiIntensity: 0.88,
    keyColor: '#ffe9d2',
    keyIntensity: 1.2,
    keyPos: [40, 28, 24],
    rimColor: '#cfcbf0',
    rimIntensity: 0.45,
    ground: '#ecd3d0',
    roadColor: '#b19ba7',
    accent: '#ffc72c', // California gold
  },
  {
    key: 'tokyo',
    milestoneId: 'farmers',
    controlPoints: [
      [8, -4],
      [22, 5],
      [36, -5],
      [50, 3],
    ],
    card: { name: 'TOKYO', sub: '首都高 · SHUTOKO' },
    night: 1,
    fog: { color: '#0a0f1e', near: 30, far: 150 },
    bg: '#070b16',
    sun: [-40, -6, -30],
    turbidity: 14,
    rayleigh: 1.2,
    ambient: 0.32,
    hemiSky: '#2a3a6a',
    hemiGround: '#0a0a12',
    hemiIntensity: 0.5,
    keyColor: '#5a7cff',
    keyIntensity: 0.5,
    keyPos: [-30, 20, -20],
    rimColor: '#ff3d7f',
    rimIntensity: 0.85,
    ground: '#0a0d16',
    roadColor: '#14161f',
    accent: '#22e0ff',
  },
  {
    key: 'sf',
    milestoneId: 'wogo',
    controlPoints: [
      [64, -3],
      [80, 7],
      [96, -6],
      [110, 6],
    ],
    card: { name: 'SAN FRANCISCO', sub: 'GOLDEN GATE · NIGHT' },
    night: 1,
    fog: { color: '#0b1424', near: 34, far: 190 },
    bg: '#070d18',
    sun: [-30, -8, 30],
    turbidity: 10,
    rayleigh: 1.4,
    ambient: 0.34,
    hemiSky: '#24406a',
    hemiGround: '#0a0c14',
    hemiIntensity: 0.52,
    keyColor: '#6a86ff',
    keyIntensity: 0.55,
    keyPos: [-30, 26, 30],
    rimColor: '#ff8a5a', // Golden-Gate international-orange rim
    rimIntensity: 0.9,
    ground: '#0b0e16',
    roadColor: '#181b22',
    accent: '#ff6a4d',
  },
  {
    key: 'mojave',
    milestoneId: 'corgi',
    controlPoints: [
      [124, -6],
      [140, 4],
      [156, -4],
      [172, 5],
    ],
    card: { name: 'MOJAVE', sub: 'ROUTE 66 · NEVADA' },
    night: 0,
    fog: { color: '#e8c9a0', near: 70, far: 340 },
    bg: '#f2d9af',
    sun: [60, 30, 20],
    turbidity: 3,
    rayleigh: 1.6,
    ambient: 0.68,
    hemiSky: '#bcd4ff',
    hemiGround: '#caa070',
    hemiIntensity: 0.8,
    keyColor: '#ffe4b0',
    keyIntensity: 1.7,
    keyPos: [60, 42, 20],
    rimColor: '#ff9a4a',
    rimIntensity: 0.5,
    ground: '#c19a63',
    roadColor: '#3a3630',
    accent: '#ff6a2b',
  },
  {
    key: 'tuner',
    milestoneId: 'agentic-ide',
    controlPoints: [
      [186, -6],
      [200, 6],
      [214, -6],
      [226, 6],
    ],
    card: { name: 'THE MEET', sub: 'MIDNIGHT CLUB' },
    night: 1,
    // Gouache night (ref d2-tuner): near-black indigo everywhere, slate-blue
    // moon key, violet-periwinkle rim, and LOW ambient so the magenta/cyan
    // neon pools are the only things that read hot.
    fog: { color: '#0a1029', near: 26, far: 130 },
    bg: '#050819',
    sun: [-40, -8, -20],
    turbidity: 12,
    rayleigh: 1,
    ambient: 0.22,
    hemiSky: '#201b3e',
    hemiGround: '#050819',
    hemiIntensity: 0.42,
    keyColor: '#374b77',
    keyIntensity: 0.45,
    keyPos: [-20, 18, -10],
    rimColor: '#7483ab',
    rimIntensity: 0.75,
    ground: '#0a1029',
    roadColor: '#121632',
    accent: '#ff2fd0',
  },
  {
    key: 'ambra',
    milestoneId: 'ambra',
    controlPoints: [
      [240, -4],
      [254, 5],
      [268, -2],
    ],
    card: { name: 'AMBRA', sub: 'PRESENT DAY' },
    night: 1,
    fog: { color: '#081218', near: 34, far: 200 },
    bg: '#050c12',
    sun: [-20, -6, -30],
    turbidity: 11,
    rayleigh: 1.3,
    ambient: 0.34,
    hemiSky: '#1e4a52',
    hemiGround: '#08110e',
    hemiIntensity: 0.55,
    keyColor: '#5ad9c0',
    keyIntensity: 0.6,
    keyPos: [-24, 22, -14],
    rimColor: '#46e3b0',
    rimIntensity: 0.85,
    ground: '#08110f',
    roadColor: '#121a19',
    accent: '#46e3b0', // Ambra mint/amber-glass
  },
]

export const LEVEL_KEYS = LEVELS.map((l) => l.key)
export const LEVEL_COUNT = LEVELS.length

'use client'

import * as THREE from 'three'
import { useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { LEVELS, LEVEL_COUNT, type LevelLightingConfig } from './levels'

const { lerp, clamp, smoothstep } = THREE.MathUtils
const N = LEVEL_COUNT

/**
 * Per-level lighting. Blends the two nearest levels (by band center) and mutates
 * scene fog/background, the three lights + an ambient floor, the Sky uniforms,
 * a starfield, exposure, and writes `nightRef`/`groundColorRef`. Levels are
 * discrete but we still cross-fade the pair straddling a border so the day↔night
 * swing is smooth under the Persona-5 seam hold. Replaces the old BiomeDriver.
 */
export default function LevelLighting({
  progressRef,
  timeLapseRef,
  nightRef,
  groundColorRef,
}: {
  progressRef: RefObject<number>
  timeLapseRef?: RefObject<number>
  nightRef?: RefObject<number>
  groundColorRef?: RefObject<THREE.Color>
}) {
  const scene = useThree((s) => s.scene)
  const gl = useThree((s) => s.gl)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const amb = useRef<THREE.AmbientLight>(null)
  const key = useRef<THREE.DirectionalLight>(null)
  const rim = useRef<THREE.DirectionalLight>(null)
  const sky = useRef<{ material: THREE.ShaderMaterial }>(null)

  const stars = useMemo(makeStars, [])
  const scratch = useRef(makeBlend())
  const c0 = useRef(new THREE.Color())
  const c1 = useRef(new THREE.Color())
  const sun = useRef(new THREE.Vector3())

  useFrame((_, dt) => {
    const p = clamp(progressRef.current ?? 0, 0, 1)
    const fi = p * N - 0.5
    const i0 = clamp(Math.floor(fi), 0, N - 1)
    const i1 = clamp(i0 + 1, 0, N - 1)
    const f = smoothstep(clamp(fi - i0, 0, 1), 0, 1)
    const bl = scratch.current
    blend(LEVELS[i0], LEVELS[i1], f, bl, c0.current, c1.current, sun.current)

    if (!scene.fog) scene.fog = new THREE.Fog(0x000000, 30, 150)
    const fog = scene.fog as THREE.Fog
    fog.color.copy(bl.fog)
    fog.near = bl.fogNear
    fog.far = bl.fogFar
    if (!(scene.background instanceof THREE.Color)) scene.background = new THREE.Color()
    ;(scene.background as THREE.Color).copy(bl.bg)

    if (hemi.current) {
      hemi.current.color.copy(bl.hemiSky)
      hemi.current.groundColor.copy(bl.hemiGround)
      hemi.current.intensity = bl.hemiIntensity + bl.ambient
    }
    if (amb.current) {
      amb.current.color.copy(bl.hemiSky)
      amb.current.intensity = lerp(0.08, 0.2, bl.night)
    }
    if (key.current) {
      key.current.color.copy(bl.keyColor)
      key.current.intensity = bl.keyIntensity
      key.current.position.copy(bl.keyPos)
    }
    if (rim.current) {
      rim.current.color.copy(bl.rimColor)
      rim.current.intensity = bl.rimIntensity
    }
    if (sky.current) {
      const u = sky.current.material.uniforms
      const tl = timeLapseRef?.current ?? 0
      sun.current.x += Math.sin(tl * Math.PI) * 40
      u.sunPosition.value.copy(sun.current)
      u.turbidity.value = bl.turbidity
      u.rayleigh.value = bl.rayleigh
    }
    const sm = stars.material as THREE.PointsMaterial
    sm.opacity = lerp(sm.opacity, bl.night, 1 - Math.exp(-dt / 0.4))
    stars.visible = sm.opacity > 0.02

    if (nightRef) nightRef.current = bl.night
    if (groundColorRef?.current) groundColorRef.current.copy(bl.ground)
    // bright day (bloom threshold 0.82 now prevents the pale-surface blowout); night ~unchanged
    gl.toneMappingExposure = lerp(1.02, 0.95, bl.night)
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={['#446', '#111', 0.6]} />
      <ambientLight ref={amb} intensity={0.1} />
      <directionalLight ref={key} position={[-30, 24, -20]} />
      <directionalLight ref={rim} position={[24, 10, 18]} />
      <Sky ref={sky as never} distance={450000} sunPosition={[-40, 6, -30]} />
      <primitive object={stars} />
    </>
  )
}

interface Blend {
  fog: THREE.Color
  fogNear: number
  fogFar: number
  bg: THREE.Color
  hemiSky: THREE.Color
  hemiGround: THREE.Color
  hemiIntensity: number
  ambient: number
  keyColor: THREE.Color
  keyIntensity: number
  keyPos: THREE.Vector3
  rimColor: THREE.Color
  rimIntensity: number
  turbidity: number
  rayleigh: number
  night: number
  ground: THREE.Color
}

function makeBlend(): Blend {
  return {
    fog: new THREE.Color(),
    fogNear: 0,
    fogFar: 0,
    bg: new THREE.Color(),
    hemiSky: new THREE.Color(),
    hemiGround: new THREE.Color(),
    hemiIntensity: 0,
    ambient: 0,
    keyColor: new THREE.Color(),
    keyIntensity: 0,
    keyPos: new THREE.Vector3(),
    rimColor: new THREE.Color(),
    rimIntensity: 0,
    turbidity: 0,
    rayleigh: 0,
    night: 0,
    ground: new THREE.Color(),
  }
}

function blend(
  a: LevelLightingConfig,
  b: LevelLightingConfig,
  f: number,
  out: Blend,
  ca: THREE.Color,
  cb: THREE.Color,
  sun: THREE.Vector3
) {
  out.fog.copy(ca.set(a.fog.color)).lerp(cb.set(b.fog.color), f)
  out.fogNear = lerp(a.fog.near, b.fog.near, f)
  out.fogFar = lerp(a.fog.far, b.fog.far, f)
  out.bg.copy(ca.set(a.bg)).lerp(cb.set(b.bg), f)
  out.hemiSky.copy(ca.set(a.hemiSky)).lerp(cb.set(b.hemiSky), f)
  out.hemiGround.copy(ca.set(a.hemiGround)).lerp(cb.set(b.hemiGround), f)
  out.hemiIntensity = lerp(a.hemiIntensity, b.hemiIntensity, f)
  out.ambient = lerp(a.ambient, b.ambient, f)
  out.keyColor.copy(ca.set(a.keyColor)).lerp(cb.set(b.keyColor), f)
  out.keyIntensity = lerp(a.keyIntensity, b.keyIntensity, f)
  out.keyPos.set(
    lerp(a.keyPos[0], b.keyPos[0], f),
    lerp(a.keyPos[1], b.keyPos[1], f),
    lerp(a.keyPos[2], b.keyPos[2], f)
  )
  out.rimColor.copy(ca.set(a.rimColor)).lerp(cb.set(b.rimColor), f)
  out.rimIntensity = lerp(a.rimIntensity, b.rimIntensity, f)
  out.turbidity = lerp(a.turbidity, b.turbidity, f)
  out.rayleigh = lerp(a.rayleigh, b.rayleigh, f)
  out.night = lerp(a.night, b.night, f)
  out.ground.copy(ca.set(a.ground)).lerp(cb.set(b.ground), f)
  sun.set(lerp(a.sun[0], b.sun[0], f), lerp(a.sun[1], b.sun[1], f), lerp(a.sun[2], b.sun[2], f))
}

function makeStars(): THREE.Points {
  const n = 900
  const pos = new Float32Array(n * 3)
  const v = new THREE.Vector3()
  for (let i = 0; i < n; i++) {
    v.set(Math.random() * 2 - 1, Math.random() * 0.8 + 0.05, Math.random() * 2 - 1)
      .normalize()
      .multiplyScalar(320)
    pos.set([v.x, v.y, v.z], i * 3)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const m = new THREE.PointsMaterial({
    color: '#ffffff',
    size: 1.4,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  })
  const pts = new THREE.Points(g, m)
  pts.frustumCulled = false
  return pts
}

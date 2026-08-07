'use client'

import * as THREE from 'three'
import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { CarState } from './carState'

/**
 * Burnout FX at the rear tires: GPU-animated smoke puffs (Points) + fading skid
 * decals (InstancedMesh), emitted while `slipRef` is high. Raw three objects
 * (not drei helpers) — pooled ring buffers so they never grow unbounded.
 * Desktop-only; disabled on mobile / reduced-motion (gated by the caller).
 */
const SMOKE_POOL = 160
const SKID_POOL = 220
const SMOKE_LIFE = 1.5
const SKID_LIFE = 4
const REAR_AXLE = 1.35 // behind car center
const TRACK = 0.85 // half track width
const SLIP_ON = 0.22

export default function TireFX({
  carStateRef,
  slipRef,
  mobile,
}: {
  carStateRef: RefObject<CarState>
  slipRef: RefObject<number>
  mobile?: boolean
}) {
  const smoke = useMemo(makeSmoke, [])
  const skid = useMemo(makeSkid, [])
  const si = useRef(0) // smoke ring index
  const ki = useRef(0) // skid ring index
  const lastContact = useRef<[THREE.Vector3, THREE.Vector3]>([
    new THREE.Vector3(),
    new THREE.Vector3(),
  ])
  const tmpM = useRef(new THREE.Matrix4())
  const tmpQ = useRef(new THREE.Quaternion())
  const tmpS = useRef(new THREE.Vector3(1, 1, 1))

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    ;(smoke.material as THREE.ShaderMaterial).uniforms.uTime.value = time
    ;(skid.material as THREE.ShaderMaterial).uniforms.uTime.value = time
    if (mobile) return

    const cs = carStateRef.current
    const slip = slipRef.current ?? 0
    if (!cs || slip < SLIP_ON) return

    // rear-tire contact points from the shared car pose
    const rx = cs.tz
    const rz = -cs.tx
    const rearX = cs.x - cs.tx * REAR_AXLE
    const rearZ = cs.z - cs.tz * REAR_AXLE
    const contacts = lastContact.current
    contacts[0].set(rearX + rx * TRACK, 0, rearZ + rz * TRACK)
    contacts[1].set(rearX - rx * TRACK, 0, rearZ - rz * TRACK)

    const yaw = Math.atan2(cs.tx, cs.tz)
    const puffs = 1 + Math.floor(slip * 3)
    const sPos = smoke.geometry.getAttribute('position') as THREE.BufferAttribute
    const sVel = smoke.geometry.getAttribute('aVel') as THREE.BufferAttribute
    const sBirth = smoke.geometry.getAttribute('aBirth') as THREE.BufferAttribute

    for (const contact of contacts) {
      for (let n = 0; n < puffs; n++) {
        const i = si.current
        si.current = (i + 1) % SMOKE_POOL
        sPos.setXYZ(i, contact.x + rand(0.3), 0.18 + Math.random() * 0.15, contact.z + rand(0.3))
        sVel.setXYZ(i, rand(0.5) - cs.tx * 0.6, 0.5 + Math.random() * 0.5, rand(0.5) - cs.tz * 0.6)
        sBirth.setX(i, time)
      }
      // one skid decal per rear wheel this frame
      const k = ki.current
      ki.current = (k + 1) % SKID_POOL
      tmpQ.current.setFromAxisAngle(UP, yaw)
      tmpS.current.set(0.42, 1, 1.1)
      tmpM.current.compose(contact.setY(0.02), tmpQ.current, tmpS.current)
      skid.setMatrixAt(k, tmpM.current)
      ;(skid.geometry.getAttribute('aBirth') as THREE.InstancedBufferAttribute).setX(k, time)
    }

    sPos.needsUpdate = true
    sVel.needsUpdate = true
    sBirth.needsUpdate = true
    skid.instanceMatrix.needsUpdate = true
    ;(skid.geometry.getAttribute('aBirth') as THREE.InstancedBufferAttribute).needsUpdate = true
    void delta
  })

  return (
    <>
      <primitive object={smoke} />
      <primitive object={skid} />
    </>
  )
}

const UP = new THREE.Vector3(0, 1, 0)
const rand = (a: number) => (Math.random() * 2 - 1) * a

function makeSmoke(): THREE.Points {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SMOKE_POOL * 3), 3))
  g.setAttribute('aVel', new THREE.BufferAttribute(new Float32Array(SMOKE_POOL * 3), 3))
  g.setAttribute('aBirth', new THREE.BufferAttribute(new Float32Array(SMOKE_POOL).fill(-1e9), 1))

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uLife: { value: SMOKE_LIFE },
      uTex: { value: puffTexture() },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aVel; attribute float aBirth;
      uniform float uTime, uLife; varying float vAlpha;
      void main() {
        float age = uTime - aBirth;
        vAlpha = (age < 0.0 || age > uLife) ? 0.0 : (1.0 - age / uLife);
        vec3 p = position + aVel * max(age, 0.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float grow = 1.0 + max(age, 0.0) * 2.2;
        gl_PointSize = 46.0 * grow * (1.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTex; varying float vAlpha;
      void main() {
        if (vAlpha <= 0.0) discard;
        float a = texture2D(uTex, gl_PointCoord).a;
        gl_FragColor = vec4(vec3(0.74), a * vAlpha * 0.55);
      }
    `,
  })

  const pts = new THREE.Points(g, mat)
  pts.frustumCulled = false
  return pts
}

function makeSkid(): THREE.InstancedMesh {
  const geo = new THREE.PlaneGeometry(1, 1)
  geo.rotateX(-Math.PI / 2)
  geo.setAttribute(
    'aBirth',
    new THREE.InstancedBufferAttribute(new Float32Array(SKID_POOL).fill(-1e9), 1)
  )

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    uniforms: { uTime: { value: 0 }, uLife: { value: SKID_LIFE } },
    vertexShader: /* glsl */ `
      attribute float aBirth; uniform float uTime, uLife; varying float vAlpha; varying vec2 vUv;
      void main() {
        float age = uTime - aBirth;
        vAlpha = (age < 0.0 || age > uLife) ? 0.0 : (1.0 - age / uLife);
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vAlpha; varying vec2 vUv;
      void main() {
        if (vAlpha <= 0.0) discard;
        float edge = smoothstep(0.5, 0.15, abs(vUv.x - 0.5));
        gl_FragColor = vec4(vec3(0.02), vAlpha * 0.5 * edge);
      }
    `,
  })

  const mesh = new THREE.InstancedMesh(geo, mat, SKID_POOL)
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.frustumCulled = false
  // park all instances off-screen until used
  const m = new THREE.Matrix4().makeTranslation(0, -100, 0)
  for (let i = 0; i < SKID_POOL; i++) mesh.setMatrixAt(i, m)
  return mesh
}

/** Soft radial puff for smoke points. */
function puffTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.5)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

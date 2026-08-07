import { ImageResponse } from 'next/og'

export const alt = 'Nico Vega — Founding Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#050505',
          padding: '72px',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', color: '#4ea1ff', fontSize: 26, letterSpacing: 6 }}>
          NICO VEGA
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 96, color: '#e8eaed', fontWeight: 700, lineHeight: 1 }}>
            Founding Engineer
          </div>
          <div style={{ marginTop: 24, fontSize: 32, color: '#b8bcc4' }}>
            AI-native full-stack engineer · UC Berkeley CS &rsquo;25
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32, color: '#b8bcc4', fontSize: 24 }}>
          <span>github.com/NicoV7</span>
          <span style={{ color: '#4ea1ff' }}>—</span>
          <span>Ambra · San Francisco</span>
        </div>
      </div>
    ),
    size
  )
}

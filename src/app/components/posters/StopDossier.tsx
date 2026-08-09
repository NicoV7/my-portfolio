'use client'

import type { PosterStopData, FeatureLink } from './posterRoute'

/**
 * The dossier side-frame: the body copy that used to sit over the photo, moved
 * to a soft frosted panel on the node side. It slides in when its stop is the
 * active one (car above the node) and rests transparent-on-pale (Noomo). On
 * mobile it stacks under the print; reduced-motion keeps it always visible.
 */

const INK = '#0b0b0f'
const PANEL = 'rgba(250, 250, 247, 0.74)'
const HAIRLINE = 'rgba(11, 11, 15, 0.12)'

export default function StopDossier({
  data,
  active,
  nodeSide,
}: {
  data: PosterStopData
  active: boolean
  nodeSide: 'left' | 'right'
}) {
  const lead = data.lines.find((l) => l.kind === 'lead')
  const rest = data.lines.filter((l) => l.kind === 'line')
  const chips = data.features?.filter((f): f is string => typeof f === 'string') ?? []
  const links = data.features?.filter((f): f is FeatureLink => typeof f !== 'string') ?? []
  const hiddenX = nodeSide === 'left' ? '-1.5rem' : '1.5rem'

  return (
    <aside
      aria-hidden={!active}
      className={`pointer-events-none z-20 mx-auto mt-8 w-[80vw] max-w-[380px] transition-[opacity,transform] duration-500 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 md:absolute md:top-1/2 md:mt-0 md:w-[36vw] md:max-w-[380px] md:-translate-y-1/2 ${
        active ? 'pointer-events-auto opacity-100' : 'opacity-0'
      } ${nodeSide === 'left' ? 'md:left-[9%]' : 'md:right-[9%]'}`}
      style={{
        transform: active ? 'translateX(0)' : `translateX(${hiddenX})`,
        background: PANEL,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: '20px',
        boxShadow: '0 24px 60px rgba(20, 16, 40, 0.14)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: INK,
      }}
    >
      <div className="p-6 md:p-7">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-sans text-lg font-black uppercase tracking-tight md:text-xl">{data.masthead}</span>
          {data.year && <span className="font-mono text-[11px] tracking-[0.18em] opacity-55">{data.year}</span>}
        </div>
        {data.role && <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">{data.role}</p>}

        <div className="mt-5 flex flex-col gap-3">
          {lead && (
            <div>
              <p className="font-sans text-2xl font-extrabold leading-[1.05]" style={{ color: data.theme.accent }}>{lead.text}</p>
              {lead.sub && <p className="mt-1 font-mono text-xs leading-snug opacity-75">{lead.sub}</p>}
            </div>
          )}
          {rest.map((l) => (
            <div key={l.text}>
              <p className="font-sans text-sm font-bold leading-tight">{l.text}</p>
              {l.sub && <p className="font-mono text-[11px] leading-snug opacity-70">{l.sub}</p>}
            </div>
          ))}
        </div>

        {chips.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {chips.map((c) => (
              <li key={c} className="rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wide" style={{ borderColor: HAIRLINE }}>
                {c}
              </li>
            ))}
          </ul>
        )}

        {(data.link || links.length > 0) && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {data.link && (
              <a
                href={data.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white outline-offset-2 transition-transform hover:-translate-y-px focus-visible:outline focus-visible:outline-2"
                style={{ background: INK, outlineColor: INK }}
              >
                Visit <span aria-hidden="true">-&gt;</span>
              </a>
            )}
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                download={l.download}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                className="font-mono text-[11px] underline underline-offset-4 opacity-80 transition-opacity hover:opacity-100"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

'use client'

import type { PosterStopData, FeatureLink } from './posterRoute'

/**
 * The dossier: the stop's body copy as transparent FLOATING TEXT (no card) in the
 * finale-menu idiom — big uppercase ink type on the pale 3D ground. It slides in
 * from the node side (OPPOSITE the photo) when its stop is active; reduced-motion
 * keeps it static.
 */

const INK = '#0b0b0f'

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
  const links = data.features?.filter((f): f is FeatureLink => typeof f !== 'string') ?? []
  const hiddenX = nodeSide === 'left' ? '-2rem' : '2rem'
  const alignRight = nodeSide === 'right'

  return (
    <aside
      aria-hidden={!active}
      className={`pointer-events-none z-20 mx-auto mt-8 w-[82vw] max-w-[420px] transition-[opacity,transform] duration-500 ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-100 md:absolute md:top-1/2 md:mt-0 md:w-[34vw] md:max-w-[420px] md:-translate-y-1/2 ${
        active ? 'pointer-events-auto opacity-100' : 'opacity-0'
      } ${nodeSide === 'left' ? 'md:left-[7%]' : 'md:right-[7%]'} ${alignRight ? 'md:text-right' : ''}`}
      style={{ transform: active ? 'translateX(0)' : `translateX(${hiddenX})`, color: INK }}
    >
      <div className={`flex items-baseline gap-3 ${alignRight ? 'md:justify-end' : ''}`}>
        <span className="font-sans text-3xl font-black uppercase leading-none tracking-tight md:text-4xl">{data.masthead}</span>
        {data.year && <span className="font-mono text-[11px] tracking-[0.18em] opacity-55">{data.year}</span>}
      </div>
      {data.role && <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] opacity-70">{data.role}</p>}

      <div className="mt-5 flex flex-col gap-3">
        {lead && (
          <div>
            <p className="font-sans text-2xl font-black uppercase leading-[1.05] tracking-tight" style={{ color: data.theme.accent }}>
              {lead.text}
            </p>
            {lead.sub && <p className="mt-1 font-mono text-xs leading-snug opacity-70">{lead.sub}</p>}
          </div>
        )}
        {rest.map((l) => (
          <div key={l.text}>
            <p className="font-sans text-base font-black uppercase leading-tight tracking-tight">{l.text}</p>
            {l.sub && <p className="font-mono text-[11px] leading-snug opacity-65">{l.sub}</p>}
          </div>
        ))}
      </div>

      {(data.link || links.length > 0) && (
        <div className={`mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2 ${alignRight ? 'md:justify-end' : ''}`}>
          {data.link && (
            <a
              href={data.link}
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto group inline-flex items-baseline gap-2 font-sans text-lg font-black uppercase tracking-tight transition-opacity hover:opacity-60"
            >
              Visit <span aria-hidden="true" className="text-base opacity-40 transition-opacity group-hover:opacity-90">-&gt;</span>
            </a>
          )}
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              download={l.download}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
              className="pointer-events-auto font-mono text-[11px] underline underline-offset-4 opacity-75 transition-opacity hover:opacity-100"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </aside>
  )
}

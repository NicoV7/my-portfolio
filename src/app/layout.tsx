import './globals.css'
import type { Metadata } from 'next'
import { Manrope, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const siteUrl = 'https://nicovega.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nico Vega — Full Stack Engineer and Applied AI',
    template: '%s — Nico Vega',
  },
  description:
    "Full Stack Engineer and Applied AI. UC Berkeley CS '25. Building agentic and health-automation systems in San Francisco.",
  authors: [{ name: 'Nicolas Vega' }],
  keywords: [
    'Nico Vega',
    'Nicolas Vega',
    'Full Stack Engineer',
    'Applied AI',
    'AI engineer',
    'full-stack engineer',
    'UC Berkeley',
    'San Francisco',
  ],
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Nico Vega',
    title: 'Nico Vega — Full Stack Engineer and Applied AI',
    description:
      "Full Stack Engineer and Applied AI. UC Berkeley CS '25.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nico Vega — Full Stack Engineer and Applied AI',
    description:
      "Full Stack Engineer and Applied AI. UC Berkeley CS '25.",
  },
}

export const viewport = {
  themeColor: '#050505',
  colorScheme: 'dark' as const,
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Nicolas Vega',
  alternateName: 'Nico Vega',
  jobTitle: 'Full Stack Engineer and Applied AI',
  url: siteUrl,
  address: { '@type': 'PostalAddress', addressLocality: 'San Francisco', addressRegion: 'CA' },
  alumniOf: 'University of California, Berkeley',
  sameAs: ['https://github.com/NicoV7', 'https://www.linkedin.com/in/nvegab99'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-void text-platinum antialiased"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <div className="grain-overlay" aria-hidden="true" />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}

import './globals.css'
import { Inter } from 'next/font/google'
import ThemeToggle from './components/ThemeToggle'
import AnimatedPageWrapper from './components/AnimatedPageWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nico Vega | Portfolio',
  description: 'Full Stack Developer Portfolio',
}

// ✅ Define the script component
function ThemeInitScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          (function () {
            try {
              const theme = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const html = document.documentElement;
              
              // Remove any existing theme classes
              html.classList.remove('dark', 'night');
              
              // Apply the appropriate theme
              if (theme === 'dark') {
                html.classList.add('dark');
              } else if (theme === 'night') {
                html.classList.add('night');
              } else if (!theme && prefersDark) {
                html.classList.add('dark');
              }
              // If theme is 'light' or no preference, use default (no classes)
            } catch (_) {}
          })();
        `,
      }}
    />
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-black dark:bg-slate-800 dark:text-white night:bg-black night:text-white transition-colors duration-300`} suppressHydrationWarning>
        <ThemeInitScript />
        <ThemeToggle />
        <AnimatedPageWrapper>{children}</AnimatedPageWrapper>
      </body>
    </html>
  )
}
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
              if (theme === 'dark' || (!theme && prefersDark)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
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
      <body className={`${inter.className} bg-white text-black dark:bg-gray-900 dark:text-white`} suppressHydrationWarning>
        <ThemeInitScript />
        <ThemeToggle />
        <AnimatedPageWrapper>{children}</AnimatedPageWrapper>
      </body>
    </html>
  )
}
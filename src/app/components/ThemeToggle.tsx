'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'night'

export default function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light')

  // Load theme on first render
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    let theme: Theme = 'light'
    
    if (stored && ['light', 'dark', 'night'].includes(stored)) {
      theme = stored
    } else if (prefersDark) {
      theme = 'dark'
    }
    
    applyTheme(theme)
    setCurrentTheme(theme)
  }, [])

  // Apply theme to document
  const applyTheme = (theme: Theme) => {
    const html = document.documentElement
    
    // Remove all theme classes
    html.classList.remove('dark', 'night')
    
    // Add appropriate theme class
    if (theme === 'dark') {
      html.classList.add('dark')
    } else if (theme === 'night') {
      html.classList.add('night')
    }
    
    // Store in localStorage
    localStorage.setItem('theme', theme)
  }

  // Handle theme change
  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as Theme
    applyTheme(newTheme)
    setCurrentTheme(newTheme)
  }

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'light': return '☀️'
      case 'dark': return '🌙'
      case 'night': return '🌚'
      default: return '☀️'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 sm:top-20 sm:right-2 md:top-4 md:right-4">
      <select
        value={currentTheme}
        onChange={handleThemeChange}
        className="
          bg-white dark:bg-slate-700 night:bg-black
          text-gray-900 dark:text-white night:text-white
          border border-gray-300 dark:border-slate-600 night:border-gray-600
          rounded-lg px-2 py-1 pr-6 sm:px-3 sm:py-2 sm:pr-8
          text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-blue-500 night:focus:ring-orange-500
          transition-all duration-200
          cursor-pointer
          appearance-none
          bg-no-repeat
          bg-right
          bg-[length:12px] sm:bg-[length:16px]
          bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')]
        "
      >
        <option value="light">{getThemeIcon('light')} Light Mode</option>
        <option value="dark">{getThemeIcon('dark')} Dark Mode</option>
        <option value="night">{getThemeIcon('night')} Night Mode</option>
      </select>
    </div>
  )
}
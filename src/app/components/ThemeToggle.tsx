'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  // Load theme on first render
  useEffect(() => {
  const stored = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.classList.add('dark')
    setIsDark(true)
  } else {
    document.documentElement.classList.remove('dark')
    setIsDark(false)
  }
}, [])

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded transition"
    >
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  )
}
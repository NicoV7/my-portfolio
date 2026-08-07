import { createElement, type ElementType, type ReactNode } from 'react'

interface ChromeTextProps {
  children: ReactNode
  as?: ElementType
  className?: string
}

/** Chrome-gradient headline treatment. */
export default function ChromeText({
  children,
  as = 'span',
  className = '',
}: ChromeTextProps) {
  return createElement(as, { className: `chrome-text ${className}` }, children)
}

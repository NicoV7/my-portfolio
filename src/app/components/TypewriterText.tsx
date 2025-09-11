'use client';

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: string;
  className?: string;
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  speed = 100,
  delay = 500,
  cursor = '|',
  className = '',
  onComplete,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      const startTimer = setTimeout(() => {
        setHasStarted(true);
        setIsTyping(true);
      }, delay);
      return () => clearTimeout(startTimer);
    }
  }, [delay, hasStarted]);

  useEffect(() => {
    if (!hasStarted || !isTyping) return;

    if (currentIndex < text.length) {
      const typingTimer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(typingTimer);
    } else {
      setIsTyping(false);
      onComplete?.();
    }
  }, [currentIndex, text, speed, isTyping, hasStarted, onComplete]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    if (!isTyping && currentIndex >= text.length) {
      setTimeout(() => {
        clearInterval(cursorTimer);
        setShowCursor(false);
      }, 2000);
    }

    return () => clearInterval(cursorTimer);
  }, [isTyping, currentIndex, text.length]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span className="animate-pulse">{cursor}</span>
      )}
    </span>
  );
}
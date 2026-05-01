import { useState, useEffect, useCallback } from 'react'
import type { SlideConfig } from '../types'

type SlideNavigation = {
  currentIndex: number
  slide: SlideConfig
  total: number
  goNext: () => void
  goPrev: () => void
  goTo: (index: number) => void
}

export function useSlideNavigation(slides: SlideConfig[]): SlideNavigation {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, slides.length - 1))
  }, [slides.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }, [])

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, slides.length - 1)))
    },
    [slides.length],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  return {
    currentIndex,
    slide: slides[currentIndex],
    total: slides.length,
    goNext,
    goPrev,
    goTo,
  }
}

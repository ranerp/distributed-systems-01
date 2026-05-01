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

function readIndexFromUrl(slides: SlideConfig[]): number {
  const id = new URLSearchParams(window.location.search).get('slide')
  if (!id) return 0
  const idx = slides.findIndex((s) => s.id === id)
  return idx === -1 ? 0 : idx
}

function writeIndexToUrl(slides: SlideConfig[], index: number) {
  const params = new URLSearchParams(window.location.search)
  params.set('slide', slides[index].id)
  history.replaceState(null, '', `?${params.toString()}`)
}

export function useSlideNavigation(slides: SlideConfig[]): SlideNavigation {
  const [currentIndex, setCurrentIndex] = useState(() => readIndexFromUrl(slides))

  const navigate = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, slides.length - 1))
      setCurrentIndex(clamped)
      writeIndexToUrl(slides, clamped)
    },
    [slides],
  )

  const goNext = useCallback(() => {
    setCurrentIndex((i) => {
      const next = Math.min(i + 1, slides.length - 1)
      writeIndexToUrl(slides, next)
      return next
    })
  }, [slides])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => {
      const prev = Math.max(i - 1, 0)
      writeIndexToUrl(slides, prev)
      return prev
    })
  }, [slides])

  const goTo = useCallback((index: number) => navigate(index), [navigate])

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

import { useState, useEffect, useRef } from 'react'
import type { SlideConfig } from '../../types'

type Props = {
  slides: SlideConfig[]
  currentIndex: number
  goTo: (index: number) => void
}

type Chapter = {
  name: string
  slides: { index: number; slide: SlideConfig }[]
}

function groupByChapter(slides: SlideConfig[]): Chapter[] {
  return slides.reduce<Chapter[]>((acc, slide, index) => {
    const last = acc[acc.length - 1]
    if (!last || last.name !== slide.chapter) {
      acc.push({ name: slide.chapter, slides: [{ index, slide }] })
    } else {
      last.slides.push({ index, slide })
    }
    return acc
  }, [])
}

function formatId(id: string): string {
  return id.replace(/-/g, ' ')
}

export function SlidePicker({ slides, currentIndex, goTo }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const chapters = groupByChapter(slides)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'g' || e.key === 'G') {
        if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) return
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-64 bg-surface-1 border border-surface-2 rounded-lg overflow-hidden shadow-2xl">
          <div className="max-h-[70vh] overflow-y-auto p-2">
            {chapters.map((chapter) => (
              <div key={chapter.name} className="mb-3 last:mb-0">
                <div className="text-[10px] font-mono text-surface-3 uppercase tracking-widest px-2 py-1">
                  {chapter.name}
                </div>
                {chapter.slides.map(({ index, slide }) => (
                  <button
                    key={slide.id}
                    onClick={() => {
                      goTo(index)
                      setOpen(false)
                    }}
                    className={`w-full text-left flex items-baseline gap-2 px-2 py-1 rounded text-xs font-mono transition-colors hover:bg-surface-2 ${
                      index === currentIndex ? 'text-accent-blue' : 'text-text-dim hover:text-text'
                    }`}
                  >
                    <span className="text-surface-3 shrink-0 w-5 text-right">{index + 1}</span>
                    <span>{formatId(slide.id)}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        title="Slide overview (G)"
        className={`w-7 h-7 rounded border flex items-center justify-center font-mono text-[11px] transition-colors ${
          open
            ? 'bg-surface-2 border-surface-3 text-text'
            : 'bg-surface-1 border-surface-2 text-surface-3 hover:border-surface-3 hover:text-text'
        }`}
      >
        ⊞
      </button>
    </div>
  )
}

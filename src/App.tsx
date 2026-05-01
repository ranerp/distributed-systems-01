import { Component, Suspense, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSlideNavigation } from './hooks/useSlideNavigation'
import { SlideLayout } from './components/layout/SlideLayout'
import { SlidePicker } from './components/nav/SlidePicker'
import { SLIDES } from './data/slides'

type SlideProps = { slideIndex: number; totalSlides: number }

class SlideErrorBoundary extends Component<
  { slideIndex: number; chapter: string; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(prev: { slideIndex: number }) {
    if (prev.slideIndex !== this.props.slideIndex && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col h-full items-center justify-center gap-4 font-mono text-center">
          <div className="text-accent-red text-sm">slide failed to render</div>
          <div className="text-surface-3 text-xs">
            {this.props.chapter} · {this.props.slideIndex + 1}
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-xs text-surface-3 hover:text-text border border-surface-2 hover:border-surface-3 rounded px-3 py-1.5 transition-colors"
          >
            retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function SlideShell({ slideIndex, totalSlides }: SlideProps) {
  const slide = SLIDES[slideIndex]
  const Component = slide.component as React.ComponentType<SlideProps>

  if (slide.isInteractive) {
    return <Component slideIndex={slideIndex} totalSlides={totalSlides} />
  }

  return (
    <SlideLayout chapter={slide.chapter} slideIndex={slideIndex} totalSlides={totalSlides}>
      <Component slideIndex={slideIndex} totalSlides={totalSlides} />
    </SlideLayout>
  )
}

export function App() {
  const { currentIndex, total, goNext, goPrev, goTo } = useSlideNavigation(SLIDES)
  const isInteractive = SLIDES[currentIndex].isInteractive

  return (
    <div className="w-full h-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-surface-3 font-mono text-sm">
                loading...
              </div>
            }
          >
            <SlideErrorBoundary slideIndex={currentIndex} chapter={SLIDES[currentIndex].chapter}>
              <SlideShell slideIndex={currentIndex} totalSlides={total} />
            </SlideErrorBoundary>
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {/* Narrowed on interactive slides so canvas edges aren't intercepted */}
      <div
        className={`absolute inset-y-0 left-0 cursor-w-resize z-10 ${isInteractive ? 'w-4' : 'w-16'}`}
        onClick={goPrev}
      />
      <div
        className={`absolute inset-y-0 right-0 cursor-e-resize z-10 ${isInteractive ? 'w-4' : 'w-16'}`}
        onClick={goNext}
      />

      <SlidePicker slides={SLIDES} currentIndex={currentIndex} goTo={goTo} />
    </div>
  )
}

export default App

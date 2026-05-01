import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSlideNavigation } from './hooks/useSlideNavigation'
import { SlideLayout } from './components/layout/SlideLayout'
import { SLIDES } from './data/slides'

type SlideProps = { slideIndex: number; totalSlides: number }

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
  const { currentIndex, total, goNext, goPrev } = useSlideNavigation(SLIDES)

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
            <SlideShell slideIndex={currentIndex} totalSlides={total} />
          </Suspense>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-y-0 left-0 w-16 cursor-w-resize z-10" onClick={goPrev} />
      <div className="absolute inset-y-0 right-0 w-16 cursor-e-resize z-10" onClick={goNext} />
    </div>
  )
}

export default App

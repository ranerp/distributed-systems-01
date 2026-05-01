import type { ReactNode } from 'react'
import { ChapterLabel } from './ChapterLabel'
import { FullscreenButton } from './FullscreenButton'
import { StepControls } from './StepControls'
import type { StepState } from '../../types'

type Props = {
  chapter: string
  slideIndex: number
  totalSlides: number
  stepState?: StepState & { onNext: () => void; onReset: () => void }
  children: ReactNode
}

export function SlideLayout({ chapter, slideIndex, totalSlides, stepState, children }: Props) {
  return (
    <div className="relative w-full h-full flex flex-col bg-surface-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 pt-6 pb-2 shrink-0">
        <ChapterLabel chapter={chapter} />
        <FullscreenButton />
      </div>

      {/* Slide content */}
      <div className="flex-1 min-h-0 px-8 pb-4">{children}</div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-8 pb-6 pt-2 shrink-0">
        <span className="text-xs font-mono text-surface-3">
          {slideIndex + 1} / {totalSlides}
        </span>
        {stepState && (
          <StepControls
            currentStep={stepState.currentStep}
            totalSteps={stepState.totalSteps}
            isLast={stepState.isLast}
            onNext={stepState.onNext}
            onReset={stepState.onReset}
          />
        )}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-surface-2">
        <div
          className="h-full bg-accent-blue transition-all duration-300"
          style={{ width: `${((slideIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>
    </div>
  )
}

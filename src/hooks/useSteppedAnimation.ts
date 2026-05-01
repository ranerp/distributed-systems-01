import { useState, useCallback, useEffect } from 'react'
import type { StepState } from '../types'

type SteppedAnimation = StepState & {
  next: () => void
  reset: () => void
}

export function useSteppedAnimation(totalSteps: number): SteppedAnimation {
  const [currentStep, setCurrentStep] = useState(0)

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const reset = useCallback(() => {
    setCurrentStep(0)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'n' || e.key === ' ') {
        e.preventDefault()
        next()
      }
      if (e.key === 'r') reset()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, reset])

  return {
    currentStep,
    totalSteps,
    isLast: currentStep === totalSteps - 1,
    next,
    reset,
  }
}

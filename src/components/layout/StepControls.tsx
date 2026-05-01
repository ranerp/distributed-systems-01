type Props = {
  currentStep: number
  totalSteps: number
  isLast: boolean
  onNext: () => void
  onReset: () => void
}

export function StepControls({ currentStep, totalSteps, isLast, onNext, onReset }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-surface-3 font-mono">
        step {currentStep + 1} / {totalSteps}
      </span>
      {isLast ? (
        <button
          onClick={onReset}
          className="px-4 py-1.5 text-sm rounded border border-surface-3 text-surface-3 hover:border-accent-blue hover:text-accent-blue transition-colors"
        >
          ↺ reset
        </button>
      ) : (
        <button
          onClick={onNext}
          className="px-4 py-1.5 text-sm rounded border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-surface-0 transition-colors"
        >
          next step →
        </button>
      )}
    </div>
  )
}

import { useCircuitBreaker } from '../../hooks/useCircuitBreaker'
import type { CBState } from '../../hooks/useCircuitBreaker'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

type Props = { slideIndex: number; totalSlides: number }

const STATE_CLS: Record<CBState, string> = {
  closed: 'border-accent-green text-accent-green bg-accent-green/10',
  open: 'border-accent-red text-accent-red bg-accent-red/10',
  'half-open': 'border-accent-orange text-accent-orange bg-accent-orange/10',
}

const STATE_DIM = 'border-surface-2 bg-surface-1 text-surface-3'

export function CircuitBreakerSlide({ slideIndex, totalSlides }: Props) {
  const { step, currentStep, totalSteps, isLast, next, reset } = useCircuitBreaker()

  return (
    <SlideLayout
      chapter="Chapter 2 — Failure & Ordering"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="Circuit Breaker — Fail Fast, Recover Gracefully"
        annotation={step.annotation}
        caption="Pattern: wrap every external call in a circuit breaker · combine with exponential backoff for retries before tripping"
      >
        <div className="flex flex-col gap-6 w-full max-w-2xl">
          <div className="flex items-center justify-center gap-3 font-mono text-sm">
            <div
              className={`rounded-lg border-2 px-5 py-3 font-bold transition-colors duration-300 ${step.state === 'closed' ? STATE_CLS.closed : STATE_DIM}`}
            >
              CLOSED
            </div>
            <div className="text-surface-3 text-xs flex flex-col items-center gap-0.5">
              <span>failures ≥ 3</span>
              <span>→</span>
            </div>
            <div
              className={`rounded-lg border-2 px-5 py-3 font-bold transition-colors duration-300 ${step.state === 'open' ? STATE_CLS.open : STATE_DIM}`}
            >
              OPEN
            </div>
            <div className="text-surface-3 text-xs flex flex-col items-center gap-0.5">
              <span>timeout</span>
              <span>→</span>
            </div>
            <div
              className={`rounded-lg border-2 px-5 py-3 font-bold transition-colors duration-300 ${step.state === 'half-open' ? STATE_CLS['half-open'] : STATE_DIM}`}
            >
              HALF-OPEN
            </div>
          </div>

          <div className="rounded-xl border-2 border-surface-2 bg-surface-1 p-5 font-mono">
            <div className="text-surface-3 text-xs mb-4">Request flow</div>
            <div className="flex items-center justify-between gap-4">
              <div className="rounded-lg border border-surface-2 bg-surface-0 px-5 py-3 text-sm text-white font-semibold text-center min-w-[120px]">
                Your Service
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="flex gap-1.5">
                  {Array.from({ length: step.failureThreshold }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full border transition-colors duration-300 ${
                        i < step.failureCount
                          ? 'bg-accent-red border-accent-red'
                          : 'bg-surface-0 border-surface-3'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-surface-3">
                  {step.failureCount}/{step.failureThreshold} failures
                </div>
                {step.requestBlocked ? (
                  <div className="px-3 py-1 rounded border border-accent-red text-accent-red text-xs font-bold bg-accent-red/10">
                    BLOCKED
                  </div>
                ) : (
                  <div
                    className={`px-3 py-1 rounded border text-xs font-bold transition-colors duration-300 ${
                      step.probeResult === 'success'
                        ? 'border-accent-green text-accent-green bg-accent-green/10'
                        : 'border-accent-green/40 text-accent-green/60 bg-accent-green/5'
                    }`}
                  >
                    {step.probeResult === 'success' ? 'PROBE OK' : 'PASSING'}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-surface-2 bg-surface-0 px-5 py-3 text-sm text-white font-semibold text-center min-w-[120px]">
                Downstream
              </div>
            </div>
          </div>
        </div>
      </SlideContent>
    </SlideLayout>
  )
}

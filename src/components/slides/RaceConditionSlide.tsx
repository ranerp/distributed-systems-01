import { useRaceCondition } from '../../hooks/useRaceCondition'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

type Props = { slideIndex: number; totalSlides: number }

function ServiceBox({
  label,
  reading,
  value,
  writing,
  lost,
}: {
  label: string
  reading: boolean
  value: string | null
  writing: boolean
  lost: boolean
}) {
  const borderClass = lost
    ? 'border-accent-red'
    : reading || writing
      ? 'border-accent-blue'
      : 'border-surface-3'

  return (
    <div
      className={`flex flex-col gap-4 rounded-xl border-2 p-8 font-mono transition-colors duration-300 min-w-52 ${borderClass} bg-surface-1`}
    >
      <div className="text-white font-semibold text-lg">{label}</div>
      {reading && <div className="text-accent-blue text-base animate-pulse">← reading...</div>}
      {value && <div className="text-accent-orange text-base">local: {value}</div>}
      {writing && <div className="text-accent-purple text-base animate-pulse">→ writing...</div>}
    </div>
  )
}

export function RaceConditionSlide({ slideIndex, totalSlides }: Props) {
  const { step, currentStep, totalSteps, isLast, next, reset } = useRaceCondition()

  return (
    <SlideLayout
      chapter="Chapter 2 — Failure & Ordering"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="Race Condition — Lost Update"
        annotation={step.annotation}
        caption="Fix: optimistic concurrency (version field) · pessimistic locking · compare-and-swap"
      >
        <div className="flex gap-8 items-center justify-center">
          <ServiceBox
            label="Service A"
            reading={step.serviceA.reading}
            value={step.serviceA.value}
            writing={step.serviceA.writing}
            lost={step.lostUpdate}
          />

          <div
            className={`rounded-xl border-2 p-8 font-mono text-center transition-colors duration-300 min-w-52 ${step.lostUpdate ? 'border-accent-red bg-accent-red/10' : 'border-surface-3 bg-surface-1'}`}
          >
            <div className="text-sm text-surface-3 mb-2">Database</div>
            <div
              className={`text-3xl font-bold ${step.lostUpdate ? 'text-accent-red' : 'text-white'}`}
            >
              {step.sharedValue}
            </div>
            {step.lostUpdate && (
              <div className="text-accent-red text-base mt-3">⚠ lost update!</div>
            )}
          </div>

          <ServiceBox
            label="Service B"
            reading={step.serviceB.reading}
            value={step.serviceB.value}
            writing={step.serviceB.writing}
            lost={step.lostUpdate}
          />
        </div>
      </SlideContent>
    </SlideLayout>
  )
}

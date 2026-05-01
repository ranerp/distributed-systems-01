import { usePatchVsSnapshot } from '../../hooks/usePatchVsSnapshot'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

type Props = { slideIndex: number; totalSlides: number }

function StateTable({
  title,
  state,
  drifted,
}: {
  title: string
  state: Record<string, string>
  drifted: boolean
}) {
  return (
    <div
      className={`rounded-xl border-2 p-8 font-mono transition-colors duration-300 ${drifted ? 'border-accent-red bg-accent-red/5' : 'border-surface-2 bg-surface-1'}`}
    >
      <div className={`text-lg font-semibold mb-5 ${drifted ? 'text-accent-red' : 'text-white'}`}>
        {title}
      </div>
      <div className="space-y-3">
        {Object.entries(state).map(([k, v]) => (
          <div key={k} className="flex gap-4 text-base">
            <span className="text-surface-3 w-20">{k}:</span>
            <span className="text-white">{v}</span>
          </div>
        ))}
      </div>
      {drifted && (
        <div className="text-accent-red text-sm mt-5">⚠ silently drifted from source</div>
      )}
    </div>
  )
}

export function PatchVsSnapshotSlide({ slideIndex, totalSlides }: Props) {
  const { step, currentStep, totalSteps, isLast, next, reset } = usePatchVsSnapshot()

  const caption =
    'Fix: send full snapshots periodically · use sequence numbers to detect gaps · event sourcing'

  const body = (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <div className="grid grid-cols-2 gap-8">
        <StateTable title="Source of Truth" state={step.sourceState} drifted={false} />
        <StateTable title="Mirror Service" state={step.mirrorState} drifted={step.drifted} />
      </div>

      {step.event && (
        <div
          className={`rounded-lg border px-6 py-3 font-mono text-base ${step.event.includes('dropped') ? 'border-accent-red text-accent-red bg-accent-red/10' : 'border-accent-blue text-accent-blue'}`}
        >
          Event: {step.event}
        </div>
      )}
    </div>
  )

  return (
    <SlideLayout
      chapter="Chapter 4 — Architecture"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="Patch vs Snapshot — Mirror State Drift"
        annotation={step.annotation}
        caption={caption}
      >
        {body}
      </SlideContent>
    </SlideLayout>
  )
}

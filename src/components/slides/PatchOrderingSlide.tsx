import { usePatchOrdering, CANVAS_W, CANVAS_H } from '../../hooks/usePatchOrdering'
import { AnimatedFlowCanvas } from '../viz/AnimatedFlowCanvas'
import { FitCanvas } from '../viz/FitCanvas'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

type Props = { slideIndex: number; totalSlides: number }

export function PatchOrderingSlide({ slideIndex, totalSlides }: Props) {
  const { nodes, edges, step, currentStep, totalSteps, isLast, next, reset } = usePatchOrdering()

  return (
    <SlideLayout
      chapter="Chapter 4 — Architecture"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="Patch Ordering — DLQ Replay Corruption"
        annotation={step.annotation}
        caption="Patches require per-field updatedAt to resolve ordering safely · for large documents: send full snapshot + seq number instead"
      >
        <div className="flex flex-col gap-4 w-full items-center">
          <FitCanvas naturalWidth={CANVAS_W} naturalHeight={CANVAS_H}>
            <AnimatedFlowCanvas
              nodes={nodes}
              edges={edges}
              messages={step.messages}
              width={CANVAS_W}
              height={CANVAS_H}
            />
          </FitCanvas>

          <div
            className={`rounded-xl border-2 p-4 font-mono w-full max-w-lg transition-colors duration-300 ${
              step.mirrorDrifted
                ? 'border-accent-red bg-accent-red/5'
                : 'border-surface-2 bg-surface-1'
            }`}
          >
            <div
              className={`text-sm font-semibold mb-3 flex items-center justify-between ${step.mirrorDrifted ? 'text-accent-red' : 'text-white'}`}
            >
              Mirror State
              {step.mirrorDrifted && (
                <span className="text-xs px-2 py-0.5 rounded bg-accent-red/20 text-accent-red">
                  corruption
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {Object.entries(step.mirrorState).map(([k, v]) => (
                <div key={k} className="flex gap-4 text-sm">
                  <span className="text-surface-3 w-12">{k}:</span>
                  <span
                    className={
                      step.mirrorDrifted && k === 'email' ? 'text-accent-red' : 'text-white'
                    }
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SlideContent>
    </SlideLayout>
  )
}

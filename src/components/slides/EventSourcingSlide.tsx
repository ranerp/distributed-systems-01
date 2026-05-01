import { useEventSourcing } from '../../hooks/useEventSourcing'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

type Props = { slideIndex: number; totalSlides: number }

export function EventSourcingSlide({ slideIndex, totalSlides }: Props) {
  const { step, currentStep, totalSteps, isLast, next, reset } = useEventSourcing()

  const projectionLabel =
    step.replayUpTo !== null ? `State at event ${step.replayUpTo}` : 'Projected State'

  return (
    <SlideLayout
      chapter="Chapter 3 — Patterns"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="Event Sourcing — The Log Is the Source of Truth"
        annotation={step.annotation}
        caption="One log, many projections · replay for auditing, debugging, new read models · append-only means no UPDATE or DELETE ever rewrites history"
      >
        <div className="grid grid-cols-2 gap-5 w-full max-w-3xl font-mono text-sm">
          <div className="flex flex-col gap-2">
            <div className="text-surface-3 text-xs mb-1">Event Log</div>
            {step.events.length === 0 && (
              <div className="text-surface-3 text-xs italic px-3 py-2">empty log</div>
            )}
            {step.events.map((ev) => (
              <div
                key={ev.seq}
                className={`rounded-lg border px-3 py-2 transition-colors duration-300 ${
                  ev.highlighted
                    ? 'border-accent-blue bg-accent-blue/10'
                    : 'border-surface-2 bg-surface-1'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-xs w-5 shrink-0 ${ev.highlighted ? 'text-accent-blue' : 'text-surface-3'}`}
                  >
                    {ev.seq}
                  </span>
                  <span
                    className={`font-bold text-xs ${ev.highlighted ? 'text-accent-blue' : 'text-white'}`}
                  >
                    {ev.type}
                  </span>
                </div>
                <div className="text-surface-3 text-[11px] mt-0.5 pl-7">{ev.payload}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-surface-3 text-xs mb-1">
              {projectionLabel}
              {step.replayUpTo !== null && (
                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-accent-blue/20 text-accent-blue">
                  replay
                </span>
              )}
            </div>
            {step.projection == null ? (
              <div className="rounded-lg border border-surface-2 bg-surface-1 px-3 py-4 text-surface-3 text-xs italic text-center">
                —
              </div>
            ) : (
              <div className="rounded-lg border border-surface-2 bg-surface-1 px-4 py-3 flex flex-col gap-2">
                <div className="flex gap-3">
                  <span className="text-surface-3 w-14 shrink-0 text-xs">items</span>
                  <div className="flex flex-col gap-0.5">
                    {step.projection.items.map((item) => (
                      <span key={item} className="text-white text-xs">
                        {item}
                      </span>
                    ))}
                    {step.projection.items.length === 0 && (
                      <span className="text-surface-3 text-xs italic">none</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-surface-3 w-14 shrink-0 text-xs">total</span>
                  <span className="text-accent-green text-xs font-bold">
                    {step.projection.total}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-surface-3 w-14 shrink-0 text-xs">status</span>
                  <span
                    className={`text-xs font-bold ${step.projection.status === 'paid' ? 'text-accent-green' : 'text-accent-blue'}`}
                  >
                    {step.projection.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </SlideContent>
    </SlideLayout>
  )
}

import { useOutboxPattern } from '../../hooks/useOutboxPattern'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

type StatusDot = 'idle' | 'ok' | 'error' | 'active'
const DOT: Record<StatusDot, string> = {
  idle: 'bg-surface-3',
  ok: 'bg-accent-green',
  error: 'bg-accent-red',
  active: 'bg-accent-blue animate-pulse',
}

function Row({ label, status }: { label: string; status: StatusDot }) {
  return (
    <div className="flex items-center gap-4 text-base font-mono">
      <span className={`w-3 h-3 rounded-full shrink-0 ${DOT[status]}`} />
      <span
        className={
          status === 'error'
            ? 'text-accent-red line-through'
            : status === 'ok'
              ? 'text-accent-green'
              : status === 'active'
                ? 'text-accent-blue'
                : 'text-surface-3'
        }
      >
        {label}
      </span>
    </div>
  )
}

type Props = { slideIndex: number; totalSlides: number }

export function OutboxPatternSlide({ slideIndex, totalSlides }: Props) {
  const { step, currentStep, totalSteps, isLast, next, reset } = useOutboxPattern()

  return (
    <SlideLayout
      chapter="Chapter 3 — Patterns"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent title="Outbox Pattern" annotation={step.annotation}>
        <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
          <div
            className={`rounded-xl border-2 p-8 transition-colors duration-300 ${step.left.inconsistent ? 'border-accent-red bg-accent-red/5' : 'border-surface-2 bg-surface-1'}`}
          >
            <div
              className={`font-mono text-lg font-semibold mb-6 ${step.left.inconsistent ? 'text-accent-red' : 'text-white'}`}
            >
              {step.left.label}
            </div>
            <div className="flex flex-col gap-4">
              <Row label="1. Write to DB" status={step.left.dbWrite} />
              <Row label="2. Publish to broker" status={step.left.brokerPublish as StatusDot} />
              {step.left.inconsistent && <Row label="⚠ State is now inconsistent" status="error" />}
            </div>
          </div>

          <div className="rounded-xl border-2 p-8 transition-colors duration-300 border-surface-2 bg-surface-1">
            <div className="font-mono text-lg font-semibold mb-6 text-white">
              {step.right.label}
            </div>
            <div className="flex flex-col gap-4">
              <Row label="1. Write to DB + outbox (1 txn)" status={step.right.dbWrite} />
              <Row label="2. Outbox row saved" status={step.right.outboxWrite} />
              <Row label="3. Relay reads outbox" status={step.right.relay as StatusDot} />
              <Row label="4. Relay publishes to broker" status={step.right.brokerPublish} />
            </div>
          </div>
        </div>
      </SlideContent>
    </SlideLayout>
  )
}

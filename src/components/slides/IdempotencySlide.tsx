import { useIdempotency } from '../../hooks/useIdempotency'
import type { MessageStatus } from '../../hooks/useIdempotency'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

type Props = { slideIndex: number; totalSlides: number }

const STATUS_CLS: Record<MessageStatus, string> = {
  pending: 'text-surface-3',
  arriving: 'text-accent-blue',
  processing: 'text-accent-orange animate-pulse',
  processed: 'text-accent-green',
  skipped: 'text-surface-3 line-through',
}

const STATUS_LABEL: Record<MessageStatus, string> = {
  pending: 'pending',
  arriving: 'arriving',
  processing: 'processing',
  processed: '✓ processed',
  skipped: 'skipped',
}

export function IdempotencySlide({ slideIndex, totalSlides }: Props) {
  const { step, currentStep, totalSteps, isLast, next, reset } = useIdempotency()

  return (
    <SlideLayout
      chapter="Chapter 3 — Patterns"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="Idempotency Keys — Exactly-Once Semantics"
        annotation={step.annotation}
        caption="Store key + result atomically in the same transaction · use UUID v4 or hash(payload) as key · TTL keys after retention window"
      >
        <div className="grid grid-cols-3 gap-4 w-full max-w-3xl font-mono text-sm">
          <div className="flex flex-col gap-2">
            <div className="text-surface-3 text-xs mb-1">Incoming Messages</div>
            {step.messages.length === 0 && (
              <div className="text-surface-3 text-xs italic">no messages yet</div>
            )}
            {step.messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg border border-surface-2 bg-surface-1 px-3 py-2 transition-colors duration-300 ${msg.status === 'arriving' ? 'border-accent-blue/40 bg-accent-blue/5' : ''}`}
              >
                <div className={`font-bold text-xs ${STATUS_CLS[msg.status]}`}>
                  {STATUS_LABEL[msg.status]}
                  {msg.status === 'skipped' && (
                    <span className="ml-2 not-line-through px-1 rounded text-[9px] bg-accent-red/20 text-accent-red">
                      skipped
                    </span>
                  )}
                </div>
                <div className="text-surface-3 text-[11px] mt-0.5">
                  key: <span className="text-white">{msg.key}</span>
                </div>
                <div className="text-surface-3 text-[11px]">attempt: {msg.attempt}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <div
              className={`rounded-xl border-2 px-4 py-4 text-center transition-colors duration-300 w-full ${
                step.consumerAction === 'idle'
                  ? 'border-surface-2 bg-surface-1 text-surface-3'
                  : step.consumerAction === 'processing'
                    ? 'border-accent-orange/40 bg-accent-orange/10 text-accent-orange'
                    : step.consumerAction === 'skipping'
                      ? 'border-accent-red/40 bg-accent-red/10 text-accent-red'
                      : 'border-accent-blue/40 bg-accent-blue/10 text-accent-blue'
              }`}
            >
              <div className="font-bold text-sm">Consumer</div>
              <div className="text-xs mt-1 capitalize">{step.consumerAction}</div>
              {step.activeKey && (
                <div className="text-[10px] mt-1 opacity-70 truncate">{step.activeKey}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-surface-3 text-xs mb-1">Dedup Store</div>
            {step.store.length === 0 && <div className="text-surface-3 text-xs italic">empty</div>}
            {step.store.map((entry) => (
              <div
                key={entry.key}
                className="rounded-lg border border-accent-green/30 bg-accent-green/5 px-3 py-2"
              >
                <div className="text-accent-green text-[11px] font-bold">seq: {entry.seq}</div>
                <div className="text-surface-3 text-[11px] mt-0.5 truncate">{entry.key}</div>
              </div>
            ))}
          </div>
        </div>
      </SlideContent>
    </SlideLayout>
  )
}

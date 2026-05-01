import { motion } from 'framer-motion'
import { useSagaPattern } from '../../hooks/useSagaPattern'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

const STATUS_STYLE = {
  idle: 'border-surface-3 text-surface-3 bg-surface-1',
  ok: 'border-accent-green text-accent-green bg-accent-green/10',
  error: 'border-accent-red text-accent-red bg-accent-red/10',
  compensating: 'border-accent-orange text-accent-orange bg-accent-orange/10',
}

type Props = { slideIndex: number; totalSlides: number }

export function SagaPatternSlide({ slideIndex, totalSlides }: Props) {
  const { step, currentStep, totalSteps, isLast, next, reset } = useSagaPattern()

  return (
    <SlideLayout
      chapter="Chapter 3 — Patterns"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="Saga Pattern — Distributed Transactions Without 2PC"
        annotation={step.annotation}
      >
        <div className="flex flex-col gap-4 w-full max-w-3xl">
          {step.steps.map((s, i) => (
            <motion.div
              key={i}
              layout
              className={`flex items-center gap-5 rounded-xl border-2 px-7 py-4 font-mono text-base transition-colors duration-300 ${STATUS_STYLE[s.status]}`}
            >
              <span className="text-sm opacity-60 w-6 shrink-0">{i + 1}.</span>
              <span className="flex-1">{s.label}</span>
              {s.status === 'compensating' && (
                <span className="text-sm animate-pulse">↩ compensating</span>
              )}
              {s.status === 'ok' && <span className="text-sm">✓</span>}
              {s.status === 'error' && <span className="text-sm">✗</span>}
            </motion.div>
          ))}
        </div>
      </SlideContent>
    </SlideLayout>
  )
}

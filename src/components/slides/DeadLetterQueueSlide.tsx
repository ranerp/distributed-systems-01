import { useDeadLetterQueue, CANVAS_W, CANVAS_H } from '../../hooks/useDeadLetterQueue'
import { AnimatedFlowCanvas } from '../viz/AnimatedFlowCanvas'
import { FitCanvas } from '../viz/FitCanvas'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

type Props = { slideIndex: number; totalSlides: number }

export function DeadLetterQueueSlide({ slideIndex, totalSlides }: Props) {
  const { nodes, edges, messages, annotation, currentStep, totalSteps, isLast, next, reset } =
    useDeadLetterQueue()

  return (
    <SlideLayout
      chapter="Chapter 2 — Failure & Ordering"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="Dead Letter Queue — Retry Exhaustion"
        annotation={annotation}
        caption="DLQ captures unprocessable messages · inspect, fix the consumer, then replay · prevents queue blockage"
      >
        <FitCanvas naturalWidth={CANVAS_W} naturalHeight={CANVAS_H}>
          <AnimatedFlowCanvas
            nodes={nodes}
            edges={edges}
            messages={messages}
            width={CANVAS_W}
            height={CANVAS_H}
          />
        </FitCanvas>
      </SlideContent>
    </SlideLayout>
  )
}

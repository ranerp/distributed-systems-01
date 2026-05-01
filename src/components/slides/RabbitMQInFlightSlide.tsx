import { useRabbitMQInFlight, CANVAS_W, CANVAS_H } from '../../hooks/useRabbitMQInFlight'
import { AnimatedFlowCanvas } from '../viz/AnimatedFlowCanvas'
import { FitCanvas } from '../viz/FitCanvas'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

type Props = { slideIndex: number; totalSlides: number }

export function RabbitMQInFlightSlide({ slideIndex, totalSlides }: Props) {
  const { nodes, edges, messages, annotation, currentStep, totalSteps, isLast, next, reset } =
    useRabbitMQInFlight()

  return (
    <SlideLayout
      chapter="Chapter 2 — Failure & Ordering"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="In-Flight Messages — RabbitMQ"
        annotation={annotation}
        caption="basic.qos(prefetch_count=N) · crash → instant requeue (no timer) · prefetch=1 for strict ordering"
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

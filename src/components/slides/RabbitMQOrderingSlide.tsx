import { useRabbitMQOrdering, CANVAS_W, CANVAS_H } from '../../hooks/useRabbitMQOrdering'
import { AnimatedFlowCanvas } from '../viz/AnimatedFlowCanvas'
import { FitCanvas } from '../viz/FitCanvas'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

type Props = { slideIndex: number; totalSlides: number }

export function RabbitMQOrderingSlide({ slideIndex, totalSlides }: Props) {
  const { nodes, edges, messages, annotation, currentStep, totalSteps, isLast, next, reset } =
    useRabbitMQOrdering()

  return (
    <SlideLayout
      chapter="Chapter 2 — Failure & Ordering"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="RabbitMQ — When Order Breaks"
        annotation={annotation}
        caption="prefetch=1 for strict order · no async handlers when order matters · partition queue by key for ordered competing consumers"
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

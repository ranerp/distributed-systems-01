import { useCompetingConsumers, CANVAS_W, CANVAS_H } from '../../hooks/useCompetingConsumers'
import { AnimatedFlowCanvas } from '../viz/AnimatedFlowCanvas'
import { FitCanvas } from '../viz/FitCanvas'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'

type Props = { slideIndex: number; totalSlides: number }

export function CompetingConsumersSlide({ slideIndex, totalSlides }: Props) {
  const { nodes, edges, messages, annotation, currentStep, totalSteps, isLast, next, reset } =
    useCompetingConsumers()

  return (
    <SlideLayout
      chapter="Chapter 1 — Message Brokers"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="Competing Consumers"
        annotation={annotation}
        caption="One queue · multiple consumers · each message delivered to exactly one consumer"
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

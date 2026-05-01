import { useMemo } from 'react'
import { useSteppedAnimation } from '../../hooks/useSteppedAnimation'
import { AnimatedFlowCanvas } from '../viz/AnimatedFlowCanvas'
import { FitCanvas } from '../viz/FitCanvas'
import { SlideContent } from '../layout/SlideContent'
import { SlideLayout } from '../layout/SlideLayout'
import type { CanvasNode, CanvasEdge, FlyingMsg } from '../viz/canvasUtils'

type Props = { slideIndex: number; totalSlides: number }

const CANVAS_W = 700
const CANVAS_H = 150

const BASE_NODES: CanvasNode[] = [
  { id: 'nodeA', x: 40, y: 48, label: 'Node A', kind: 'service' },
  { id: 'nodeB', x: 520, y: 48, label: 'Node B', kind: 'service' },
]

const EDGES: CanvasEdge[] = [
  { id: 'a-b', from: 'nodeA', to: 'nodeB', color: '#56a8f5' },
  { id: 'b-a', from: 'nodeB', to: 'nodeA', color: '#56a8f5' },
]

const nodeACenterX = 40 + 55
const nodeACenterY = 48 + 27
const nodeBCenterX = 520 + 55
const nodeBCenterY = 48 + 27

type StepDef = {
  clockA: number
  clockB: number
  msgAtoB: { label: string; pos: number } | null
  msgBtoA: { label: string; pos: number } | null
  annotation: string
}

const STEPS: StepDef[] = [
  {
    clockA: 0,
    clockB: 0,
    msgAtoB: null,
    msgBtoA: null,
    annotation:
      'Lamport clock: each node starts at 0. Every send or receive increments the counter.',
  },
  {
    clockA: 1,
    clockB: 0,
    msgAtoB: { label: 't=1', pos: 0.25 },
    msgBtoA: null,
    annotation: 'A sends: increment own clock → t=1, attach to message',
  },
  {
    clockA: 1,
    clockB: 2,
    msgAtoB: null,
    msgBtoA: null,
    annotation: 'B receives t=1: max(local=0, received=1) + 1 = 2',
  },
  {
    clockA: 1,
    clockB: 3,
    msgAtoB: null,
    msgBtoA: { label: 't=3', pos: 0.25 },
    annotation: 'B sends: increment → t=3, attach to message',
  },
  {
    clockA: 4,
    clockB: 3,
    msgAtoB: null,
    msgBtoA: null,
    annotation: 'A receives t=3: max(local=1, received=3) + 1 = 4',
  },
  {
    clockA: 4,
    clockB: 3,
    msgAtoB: null,
    msgBtoA: null,
    annotation:
      "Causal chain: t=1 → t=2 (local at B) → t=3 → t=4. Limitation: can't detect concurrent events — vector clocks track that.",
  },
]

export function LogicalClocksSlide({ slideIndex, totalSlides }: Props) {
  const { currentStep, totalSteps, isLast, next, reset } = useSteppedAnimation(STEPS.length)
  const step = STEPS[currentStep]

  const nodes: CanvasNode[] = useMemo(() => BASE_NODES, [])

  const edges: CanvasEdge[] = useMemo(
    () =>
      EDGES.map((e) => ({
        ...e,
        active:
          (e.id === 'a-b' && step.msgAtoB !== null) || (e.id === 'b-a' && step.msgBtoA !== null),
      })),
    [step],
  )

  const messages: FlyingMsg[] = useMemo(() => {
    const msgs: FlyingMsg[] = []
    if (step.msgAtoB) {
      const { pos, label } = step.msgAtoB
      msgs.push({
        id: 'msg-ab',
        x: nodeACenterX + pos * (nodeBCenterX - nodeACenterX),
        y: nodeACenterY,
        color: '#56a8f5',
        label,
        visible: true,
      })
    }
    if (step.msgBtoA) {
      const { pos, label } = step.msgBtoA
      msgs.push({
        id: 'msg-ba',
        x: nodeBCenterX - pos * (nodeBCenterX - nodeACenterX),
        y: nodeBCenterY + 4,
        color: '#56a8f5',
        label,
        visible: true,
      })
    }
    return msgs
  }, [step])

  return (
    <SlideLayout
      chapter="Chapter 3 — Patterns"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={{ currentStep, totalSteps, isLast, onNext: next, onReset: reset }}
    >
      <SlideContent
        title="Logical Clocks — Why Wall Time Fails"
        annotation={step.annotation}
        caption="Wall clocks drift — NTP cannot fix sub-millisecond skew. Lamport gives causal ordering. Vector clocks also detect concurrent events."
      >
        <div className="flex flex-col gap-5 items-center w-full">
          <FitCanvas naturalWidth={CANVAS_W} naturalHeight={CANVAS_H}>
            <AnimatedFlowCanvas
              nodes={nodes}
              edges={edges}
              messages={messages}
              width={CANVAS_W}
              height={CANVAS_H}
            />
          </FitCanvas>

          <div className="flex gap-12 justify-center font-mono text-sm">
            <div className="flex items-center gap-3 rounded border border-surface-2 bg-surface-1 px-5 py-2">
              <span className="text-surface-3">Node A</span>
              <span className="text-accent-blue font-bold">t = {step.clockA}</span>
            </div>
            <div className="flex items-center gap-3 rounded border border-surface-2 bg-surface-1 px-5 py-2">
              <span className="text-surface-3">Node B</span>
              <span className="text-accent-blue font-bold">t = {step.clockB}</span>
            </div>
          </div>
        </div>
      </SlideContent>
    </SlideLayout>
  )
}

import { useMemo } from 'react'
import { useSteppedAnimation } from './useSteppedAnimation'
import type {
  CanvasNode,
  CanvasEdge,
  FlyingMsg,
  Highlight,
  DockedMsg,
} from '../components/viz/canvasUtils'
import type { NodeKind } from '../types'

export const CANVAS_W = 760
export const CANVAS_H = 290

const BLUE = '#56a8f5'
const RED = '#f85149'
const ORANGE = '#cf8e6d'

const BASE_NODES: Array<{ id: string; x: number; y: number; label: string; kind: NodeKind }> = [
  { id: 'broker', x: 220, y: 73, label: 'Broker', kind: 'queue' },
  { id: 'consumer', x: 520, y: 73, label: 'Consumer', kind: 'consumer' },
  { id: 'dlq', x: 220, y: 180, label: 'Dead Letter Queue', kind: 'dlq' },
]

const BASE_EDGES: CanvasEdge[] = [
  { id: 'b-c', from: 'broker', to: 'consumer', color: BLUE },
  { id: 'b-dlq', from: 'broker', to: 'dlq', color: RED },
]

type Step = {
  highlights: Record<string, Highlight>
  activeEdges: string[]
  msgs: FlyingMsg[]
  dockedMsgs: Record<string, DockedMsg[]>
  annotation: string
}

const STEPS: Step[] = [
  {
    highlights: { broker: 'warning', consumer: 'idle', dlq: 'idle' },
    activeEdges: ['b-c'],
    msgs: [],
    dockedMsgs: { broker: [{ label: 'M', color: BLUE }] },
    annotation: 'Message M buffered in broker, waiting for consumer',
  },
  {
    highlights: { broker: 'idle', consumer: 'error', dlq: 'idle' },
    activeEdges: ['b-c'],
    msgs: [],
    dockedMsgs: { consumer: [{ label: 'M', color: RED }] },
    annotation: 'Consumer picks up M but fails — DB timeout, unhandled exception...',
  },
  {
    highlights: { broker: 'warning', consumer: 'idle', dlq: 'idle' },
    activeEdges: ['b-c'],
    msgs: [],
    dockedMsgs: { broker: [{ label: 'M', color: ORANGE }] },
    annotation: 'Broker requeues M. Retry 1/3.',
  },
  {
    highlights: { broker: 'idle', consumer: 'error', dlq: 'idle' },
    activeEdges: ['b-c'],
    msgs: [],
    dockedMsgs: { consumer: [{ label: 'M', color: RED }] },
    annotation: 'Retry 2/3 — same failure. Persistent bug.',
  },
  {
    highlights: { broker: 'idle', consumer: 'error', dlq: 'idle' },
    activeEdges: [],
    msgs: [],
    dockedMsgs: { consumer: [{ label: 'M', color: RED }] },
    annotation: 'Retry 3/3 — limit reached. Routing to Dead Letter Queue.',
  },
  {
    highlights: { broker: 'idle', consumer: 'idle', dlq: 'error' },
    activeEdges: ['b-dlq'],
    msgs: [],
    dockedMsgs: { dlq: [{ label: 'M', color: RED }] },
    annotation: 'M is in DLQ. Consumer unblocked. Inspect, fix the bug, then replay.',
  },
]

type Result = {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  messages: FlyingMsg[]
  annotation: string
  currentStep: number
  totalSteps: number
  isLast: boolean
  next: () => void
  reset: () => void
}

export function useDeadLetterQueue(): Result {
  const { currentStep, totalSteps, isLast, next, reset } = useSteppedAnimation(STEPS.length)
  const step = STEPS[currentStep]

  const nodes: CanvasNode[] = useMemo(
    () =>
      BASE_NODES.map((n) => ({
        ...n,
        highlight: (step.highlights[n.id] ?? 'idle') as Highlight,
        dockedMsgs: step.dockedMsgs[n.id],
      })),
    [step],
  )

  const edges: CanvasEdge[] = useMemo(
    () => BASE_EDGES.map((e) => ({ ...e, active: step.activeEdges.includes(e.id) })),
    [step],
  )

  return {
    nodes,
    edges,
    messages: step.msgs,
    annotation: step.annotation,
    currentStep,
    totalSteps,
    isLast,
    next,
    reset,
  }
}

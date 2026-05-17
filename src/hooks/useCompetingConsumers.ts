import { useMemo } from 'react'
import { useSteppedAnimation } from './useSteppedAnimation'
import type { CanvasNode, CanvasEdge, FlyingMsg, DockedMsg } from '../components/viz/canvasUtils'
import type { NodeKind } from '../types'

export const CANVAS_W = 940
export const CANVAS_H = 480

type Highlight = 'success' | 'error' | 'warning' | 'idle'

const BLUE = '#56a8f5'
const GREEN = '#6aab73'

const BASE = [
  { id: 'producer', x: 30, y: 203, label: 'Producer', kind: 'producer' as NodeKind },
  { id: 'queue', x: 290, y: 203, label: 'Queue', kind: 'queue' as NodeKind },
  { id: 'a', x: 680, y: 30, label: 'Consumer A', kind: 'consumer' as NodeKind },
  { id: 'b', x: 680, y: 203, label: 'Consumer B', kind: 'consumer' as NodeKind },
  { id: 'c', x: 680, y: 376, label: 'Consumer C', kind: 'consumer' as NodeKind },
]

const EDGES: CanvasEdge[] = [
  { id: 'p-q', from: 'producer', to: 'queue' },
  { id: 'q-a', from: 'queue', to: 'a' },
  { id: 'q-b', from: 'queue', to: 'b' },
  { id: 'q-c', from: 'queue', to: 'c' },
]

type Step = {
  annotation: string
  highlights: Record<string, Highlight>
  activeEdges: string[]
  msgs: FlyingMsg[]
  dockedMsgs: Record<string, DockedMsg[]>
}

const STEPS: Step[] = [
  {
    annotation: '3 messages arrive in the queue — producer publishes, queue buffers',
    highlights: { producer: 'success', queue: 'warning', a: 'idle', b: 'idle', c: 'idle' },
    activeEdges: ['p-q'],
    msgs: [],
    dockedMsgs: {
      queue: [
        { label: 'M1', color: BLUE },
        { label: 'M2', color: BLUE },
        { label: 'M3', color: BLUE },
      ],
    },
  },
  {
    annotation: 'Consumer A picks up M1 — locked to it, invisible to other consumers',
    highlights: { producer: 'idle', queue: 'warning', a: 'warning', b: 'idle', c: 'idle' },
    activeEdges: ['q-a'],
    msgs: [],
    dockedMsgs: {
      queue: [
        { label: 'M2', color: BLUE },
        { label: 'M3', color: BLUE },
      ],
      a: [{ label: 'M1', color: BLUE }],
    },
  },
  {
    annotation: 'Consumer B picks up M2 simultaneously — no coordination needed',
    highlights: { producer: 'idle', queue: 'warning', a: 'success', b: 'warning', c: 'idle' },
    activeEdges: ['q-a', 'q-b'],
    msgs: [],
    dockedMsgs: {
      queue: [{ label: 'M3', color: BLUE }],
      a: [{ label: 'M1', color: GREEN }],
      b: [{ label: 'M2', color: BLUE }],
    },
  },
  {
    annotation: 'Consumer A sends ACK → message deleted from queue',
    highlights: { producer: 'idle', queue: 'warning', a: 'idle', b: 'success', c: 'idle' },
    activeEdges: ['q-b'],
    msgs: [],
    dockedMsgs: {
      queue: [{ label: 'M3', color: BLUE }],
      b: [{ label: 'M2', color: GREEN }],
    },
  },
  {
    annotation: 'Consumer C picks up M3 — work distributed across all three',
    highlights: { producer: 'idle', queue: 'idle', a: 'idle', b: 'success', c: 'warning' },
    activeEdges: ['q-c'],
    msgs: [],
    dockedMsgs: {
      b: [{ label: 'M2', color: GREEN }],
      c: [{ label: 'M3', color: BLUE }],
    },
  },
  {
    annotation:
      'Each message delivered to exactly one consumer — competing consumers scale horizontally',
    highlights: { producer: 'idle', queue: 'idle', a: 'idle', b: 'success', c: 'success' },
    activeEdges: [],
    msgs: [],
    dockedMsgs: {
      b: [{ label: 'M2', color: GREEN }],
      c: [{ label: 'M3', color: GREEN }],
    },
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

export function useCompetingConsumers(): Result {
  const { currentStep, totalSteps, isLast, next, reset } = useSteppedAnimation(STEPS.length)
  const step = STEPS[currentStep]

  const nodes: CanvasNode[] = useMemo(
    () =>
      BASE.map((n) => ({
        ...n,
        highlight: (step.highlights[n.id] ?? 'idle') as Highlight,
        dockedMsgs: step.dockedMsgs[n.id],
      })),
    [step],
  )

  const edges: CanvasEdge[] = useMemo(
    () => EDGES.map((e) => ({ ...e, active: step.activeEdges.includes(e.id) })),
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

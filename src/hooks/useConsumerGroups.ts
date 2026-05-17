import { useMemo } from 'react'
import { useSteppedAnimation } from './useSteppedAnimation'
import type { CanvasNode, CanvasEdge, FlyingMsg, DockedMsg } from '../components/viz/canvasUtils'
import type { NodeKind } from '../types'

export const CANVAS_W = 1000
export const CANVAS_H = 580

type Highlight = 'success' | 'error' | 'warning' | 'idle'

const BLUE = '#56a8f5'
const GREEN = '#6aab73'
const PURPLE = '#c77dbb'

const BASE = [
  { id: 'producer', x: 30, y: 253, label: 'Producer', kind: 'producer' as NodeKind },
  { id: 'topic', x: 310, y: 253, label: 'Topic', kind: 'queue' as NodeKind },
  { id: 'ga1', x: 740, y: 30, label: 'Group A · C1', kind: 'consumer' as NodeKind },
  { id: 'ga2', x: 740, y: 150, label: 'Group A · C2', kind: 'consumer' as NodeKind },
  { id: 'gb1', x: 740, y: 330, label: 'Group B · C1', kind: 'consumer' as NodeKind },
  { id: 'gb2', x: 740, y: 450, label: 'Group B · C2', kind: 'consumer' as NodeKind },
]

const EDGES: CanvasEdge[] = [
  { id: 'p-t', from: 'producer', to: 'topic', color: BLUE },
  { id: 't-ga1', from: 'topic', to: 'ga1', color: GREEN },
  { id: 't-ga2', from: 'topic', to: 'ga2', color: GREEN },
  { id: 't-gb1', from: 'topic', to: 'gb1', color: PURPLE },
  { id: 't-gb2', from: 'topic', to: 'gb2', color: PURPLE },
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
    annotation: 'Producer publishes one message to the Kafka topic (3 partitions)',
    highlights: {
      producer: 'success',
      topic: 'idle',
      ga1: 'idle',
      ga2: 'idle',
      gb1: 'idle',
      gb2: 'idle',
    },
    activeEdges: ['p-t'],
    msgs: [],
    dockedMsgs: { producer: [{ label: 'M', color: BLUE }] },
  },
  {
    annotation: 'Message lands in the topic',
    highlights: {
      producer: 'idle',
      topic: 'warning',
      ga1: 'idle',
      ga2: 'idle',
      gb1: 'idle',
      gb2: 'idle',
    },
    activeEdges: ['p-t'],
    msgs: [],
    dockedMsgs: { topic: [{ label: 'M', color: BLUE }] },
  },
  {
    annotation: 'Group A reads the message — one consumer per partition gets it',
    highlights: {
      producer: 'idle',
      topic: 'warning',
      ga1: 'warning',
      ga2: 'warning',
      gb1: 'idle',
      gb2: 'idle',
    },
    activeEdges: ['t-ga1', 't-ga2'],
    msgs: [],
    dockedMsgs: {
      topic: [{ label: 'M', color: BLUE }],
      ga1: [{ label: 'M', color: GREEN }],
      ga2: [{ label: 'M', color: GREEN }],
    },
  },
  {
    annotation: 'Group B also gets the same message — completely independent offset',
    highlights: {
      producer: 'idle',
      topic: 'warning',
      ga1: 'success',
      ga2: 'success',
      gb1: 'warning',
      gb2: 'warning',
    },
    activeEdges: ['t-gb1', 't-gb2'],
    msgs: [],
    dockedMsgs: {
      topic: [{ label: 'M', color: BLUE }],
      ga1: [{ label: 'M', color: GREEN }],
      ga2: [{ label: 'M', color: GREEN }],
      gb1: [{ label: 'M', color: PURPLE }],
      gb2: [{ label: 'M', color: PURPLE }],
    },
  },
  {
    annotation:
      'Groups read at their own pace — no competition between groups, only within a group',
    highlights: {
      producer: 'idle',
      topic: 'idle',
      ga1: 'success',
      ga2: 'success',
      gb1: 'success',
      gb2: 'success',
    },
    activeEdges: [],
    msgs: [],
    dockedMsgs: {
      ga1: [{ label: 'M', color: GREEN }],
      ga2: [{ label: 'M', color: GREEN }],
      gb1: [{ label: 'M', color: PURPLE }],
      gb2: [{ label: 'M', color: PURPLE }],
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

export function useConsumerGroups(): Result {
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

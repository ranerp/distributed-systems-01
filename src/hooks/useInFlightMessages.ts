import { useMemo } from 'react'
import { useSteppedAnimation } from './useSteppedAnimation'
import { nodeCenter, NODE_W, NODE_H } from '../components/viz/canvasUtils'
import type { CanvasNode, CanvasEdge, FlyingMsg, DockedMsg } from '../components/viz/canvasUtils'
import type { NodeKind } from '../types'

void NODE_W
void NODE_H

export const CANVAS_W = 920
export const CANVAS_H = 220

const BLUE = '#56a8f5'
const GREEN = '#6aab73'
const ORANGE = '#cf8e6d'
const RED = '#f85149'

void RED

const BASE = [
  { id: 'producer', x: 20, y: 73, label: 'Producer', kind: 'producer' as NodeKind },
  { id: 'broker', x: 320, y: 73, label: 'Broker', kind: 'queue' as NodeKind },
  { id: 'consumer', x: 640, y: 73, label: 'Consumer', kind: 'consumer' as NodeKind },
]

const EDGES: CanvasEdge[] = [
  { id: 'p-b', from: 'producer', to: 'broker', color: BLUE },
  { id: 'b-c', from: 'broker', to: 'consumer', color: BLUE },
]

const brokerC = nodeCenter(320, 73)
const consumerC = nodeCenter(640, 73)

function along(t: number, dy = 0) {
  return {
    x: brokerC.x + t * (consumerC.x - brokerC.x),
    y: brokerC.y + t * (consumerC.y - brokerC.y) + dy,
  }
}

type Highlight = 'success' | 'error' | 'warning' | 'idle'

type Step = {
  annotation: string
  highlights: Record<string, Highlight>
  activeEdges: string[]
  msgs: FlyingMsg[]
  dockedMsgs: Record<string, DockedMsg[]>
}

const STEPS: Step[] = [
  {
    annotation: '3 messages buffered in broker — producer is done, broker holds them',
    highlights: { producer: 'success', broker: 'warning', consumer: 'idle' },
    activeEdges: ['p-b'],
    msgs: [],
    dockedMsgs: {
      broker: [
        { label: 'M1', color: BLUE },
        { label: 'M2', color: BLUE },
        { label: 'M3', color: BLUE },
      ],
    },
  },
  {
    annotation:
      'Broker dispatches all three simultaneously — MQTT QoS 1 allows multiple in-flight at once',
    highlights: { producer: 'idle', broker: 'warning', consumer: 'idle' },
    activeEdges: ['b-c'],
    msgs: [
      { id: 'm1', ...along(0.25, -14), color: BLUE, label: 'M1', visible: true },
      { id: 'm2', ...along(0.5, 0), color: BLUE, label: 'M2', visible: true },
      { id: 'm3', ...along(0.25, +14), color: BLUE, label: 'M3', visible: true },
    ],
    dockedMsgs: {},
  },
  {
    annotation: 'M2 takes a faster route — arrives before M1 and M3 (out-of-order delivery)',
    highlights: { producer: 'idle', broker: 'warning', consumer: 'warning' },
    activeEdges: ['b-c'],
    msgs: [
      { id: 'm1', ...along(0.55, -14), color: BLUE, label: 'M1', visible: true },
      { id: 'm3', ...along(0.4, +14), color: BLUE, label: 'M3', visible: true },
    ],
    dockedMsgs: {
      consumer: [{ label: 'M2', color: GREEN }],
    },
  },
  {
    annotation:
      'M1 is dropped — network loss, broker never receives ACK and marks it unacknowledged',
    highlights: { producer: 'idle', broker: 'warning', consumer: 'warning' },
    activeEdges: ['b-c'],
    msgs: [],
    dockedMsgs: {
      consumer: [
        { label: 'M2', color: GREEN },
        { label: 'M3', color: GREEN },
      ],
    },
  },
  {
    annotation: 'ACK timeout expires — broker redelivers M1 (may already have M2 and M3)',
    highlights: { producer: 'idle', broker: 'warning', consumer: 'warning' },
    activeEdges: ['b-c'],
    msgs: [{ id: 'm1-retry', ...along(0.4, 0), color: ORANGE, label: 'M1↩', visible: true }],
    dockedMsgs: {
      consumer: [
        { label: 'M2', color: GREEN },
        { label: 'M3', color: GREEN },
      ],
    },
  },
  {
    annotation:
      'Consumer receives M1 out of order — saw M2 → M3 → M1. Processing must be idempotent!',
    highlights: { producer: 'idle', broker: 'idle', consumer: 'success' },
    activeEdges: [],
    msgs: [],
    dockedMsgs: {
      consumer: [
        { label: 'M2', color: GREEN },
        { label: 'M3', color: GREEN },
        { label: 'M1↩', color: ORANGE },
      ],
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

export function useInFlightMessages(): Result {
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

import { useMemo } from 'react'
import { useSteppedAnimation } from './useSteppedAnimation'
import { nodeCenter, NODE_W, NODE_H } from '../components/viz/canvasUtils'
import type { CanvasNode, CanvasEdge, FlyingMsg } from '../components/viz/canvasUtils'
import type { NodeKind } from '../types'

void NODE_W
void NODE_H

export const CANVAS_W = 880
export const CANVAS_H = 380

const BLUE = '#56a8f5'
const GREEN = '#6aab73'

const BASE = [
  { id: 'queue', x: 20, y: 163, label: 'Queue', kind: 'queue' as NodeKind },
  { id: 'consumerA', x: 380, y: 60, label: 'Consumer A', kind: 'consumer' as NodeKind },
  { id: 'consumerB', x: 380, y: 266, label: 'Consumer B', kind: 'consumer' as NodeKind },
  { id: 'db', x: 680, y: 163, label: 'Downstream DB', kind: 'database' as NodeKind },
]

const EDGES: CanvasEdge[] = [
  { id: 'q-a', from: 'queue', to: 'consumerA', color: BLUE },
  { id: 'q-b', from: 'queue', to: 'consumerB', color: BLUE },
  { id: 'a-db', from: 'consumerA', to: 'db', color: GREEN },
  { id: 'b-db', from: 'consumerB', to: 'db', color: GREEN },
]

function ctr(id: string, dx = 0, dy = 0) {
  const n = BASE.find((b) => b.id === id)!
  const c = nodeCenter(n.x, n.y)
  return { x: c.x + dx, y: c.y + dy }
}

type Highlight = 'success' | 'error' | 'warning' | 'idle'

type Step = {
  annotation: string
  highlights: Record<string, Highlight>
  badges: Record<string, string[]>
  activeEdges: string[]
  msgs: FlyingMsg[]
}

const STEPS: Step[] = [
  {
    annotation:
      'prefetch=1 — broker waits for ACK before sending M2. One message at a time, strict order guaranteed.',
    highlights: { queue: 'warning', consumerA: 'warning', consumerB: 'idle', db: 'idle' },
    badges: { queue: ['M2', 'M3'], consumerA: ['prefetch=1'] },
    activeEdges: ['q-a'],
    msgs: [{ id: 'm1', ...ctr('consumerA'), color: BLUE, label: 'M1', visible: true }],
  },
  {
    annotation:
      'prefetch=3 + async handler — broker delivers M1, M2, M3 simultaneously to the same consumer',
    highlights: { queue: 'idle', consumerA: 'warning', consumerB: 'idle', db: 'idle' },
    badges: { queue: [], consumerA: ['prefetch=3', 'async'] },
    activeEdges: ['q-a'],
    msgs: [
      { id: 'm1', ...ctr('consumerA', -10, -10), color: BLUE, label: 'M1', visible: true },
      { id: 'm2', ...ctr('consumerA', 0, 0), color: BLUE, label: 'M2', visible: true },
      { id: 'm3', ...ctr('consumerA', 10, 10), color: BLUE, label: 'M3', visible: true },
    ],
  },
  {
    annotation:
      "M2's handler finishes first and ACKs — DB receives M2 before M1. Delivery was ordered, processing was not.",
    highlights: { queue: 'idle', consumerA: 'warning', consumerB: 'idle', db: 'warning' },
    badges: { consumerA: ['prefetch=3', 'async'] },
    activeEdges: ['a-db'],
    msgs: [
      { id: 'm1', ...ctr('consumerA', -8, -8), color: BLUE, label: 'M1', visible: true },
      { id: 'm3', ...ctr('consumerA', 8, 8), color: BLUE, label: 'M3', visible: true },
      { id: 'm2', ...ctr('db'), color: GREEN, label: 'M2', visible: true },
    ],
  },
  {
    annotation:
      'Multiple consumers — broker distributes M1 to A, M2 to B with no coordination between them',
    highlights: { queue: 'warning', consumerA: 'warning', consumerB: 'warning', db: 'idle' },
    badges: { queue: ['M3', 'M4'], consumerA: ['prefetch=1'], consumerB: ['prefetch=1'] },
    activeEdges: ['q-a', 'q-b'],
    msgs: [
      { id: 'm1', ...ctr('consumerA'), color: BLUE, label: 'M1', visible: true },
      { id: 'm2', ...ctr('consumerB'), color: BLUE, label: 'M2', visible: true },
    ],
  },
  {
    annotation:
      'Consumer B finishes M2 first — DB receives M2 before M1. Global ordering is gone regardless of prefetch.',
    highlights: { queue: 'warning', consumerA: 'warning', consumerB: 'success', db: 'warning' },
    badges: { queue: ['M3', 'M4'] },
    activeEdges: ['b-db'],
    msgs: [
      { id: 'm1', ...ctr('consumerA'), color: BLUE, label: 'M1', visible: true },
      { id: 'm2', ...ctr('db'), color: GREEN, label: 'M2', visible: true },
    ],
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

export function useRabbitMQOrdering(): Result {
  const { currentStep, totalSteps, isLast, next, reset } = useSteppedAnimation(STEPS.length)
  const step = STEPS[currentStep]

  const nodes: CanvasNode[] = useMemo(
    () =>
      BASE.map((n) => ({
        ...n,
        highlight: (step.highlights[n.id] ?? 'idle') as Highlight,
        badge: step.badges[n.id],
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

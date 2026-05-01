import { useMemo } from 'react'
import { useSteppedAnimation } from './useSteppedAnimation'
import { nodeCenter, NODE_W, NODE_H } from '../components/viz/canvasUtils'
import type { CanvasNode, CanvasEdge, FlyingMsg } from '../components/viz/canvasUtils'
import type { NodeKind } from '../types'

void NODE_W
void NODE_H

export const CANVAS_W = 820
export const CANVAS_H = 180

const BLUE = '#56a8f5'
const GREEN = '#6aab73'
const ORANGE = '#cf8e6d'

const BASE = [
  { id: 'queue', x: 80, y: 63, label: 'Queue', kind: 'queue' as NodeKind },
  { id: 'consumer', x: 610, y: 63, label: 'Consumer', kind: 'consumer' as NodeKind },
]

const EDGES: CanvasEdge[] = [{ id: 'q-c', from: 'queue', to: 'consumer', color: BLUE }]

function ctr(id: string, dx = 0, dy = 0) {
  const n = BASE.find((b) => b.id === id)!
  const c = nodeCenter(n.x, n.y)
  return { x: c.x + dx, y: c.y + dy }
}

const qC = ctr('queue')
const cC = ctr('consumer')
function along(t: number, dy = 0) {
  return { x: qC.x + t * (cC.x - qC.x), y: qC.y + t * (cC.y - qC.y) + dy }
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
      'Without prefetch_count, broker floods consumer with all messages at once — set it!',
    highlights: { queue: 'warning', consumer: 'idle' },
    badges: { queue: ['M1', 'M2', 'M3', 'M4', 'M5'], consumer: ['prefetch=3'] },
    activeEdges: [],
    msgs: [],
  },
  {
    annotation: 'Broker pushes M1, M2, M3 — window full, M4 and M5 held back until an ACK arrives',
    highlights: { queue: 'warning', consumer: 'warning' },
    badges: { queue: ['M4', 'M5'], consumer: ['prefetch=3', '3/3 slots'] },
    activeEdges: ['q-c'],
    msgs: [
      { id: 'm1', ...ctr('consumer', -12, -10), color: BLUE, label: 'M1', visible: true },
      { id: 'm2', ...ctr('consumer', 0, 0), color: BLUE, label: 'M2', visible: true },
      { id: 'm3', ...ctr('consumer', 12, 10), color: BLUE, label: 'M3', visible: true },
    ],
  },
  {
    annotation:
      'Consumer ACKs M2 — one slot freed, broker immediately dispatches M4 (window slides forward)',
    highlights: { queue: 'warning', consumer: 'warning' },
    badges: { queue: ['M5'], consumer: ['prefetch=3', '3/3 slots'] },
    activeEdges: ['q-c'],
    msgs: [
      { id: 'm1', ...ctr('consumer', -12, -10), color: BLUE, label: 'M1', visible: true },
      { id: 'm3', ...ctr('consumer', 12, 10), color: BLUE, label: 'M3', visible: true },
      { id: 'm4', ...along(0.5), color: BLUE, label: 'M4', visible: true },
    ],
  },
  {
    annotation: 'Consumer crashes — M1, M3, M4 instantly requeued to queue head, no timeout needed',
    highlights: { queue: 'warning', consumer: 'error' },
    badges: { queue: ['M1', 'M3', 'M4', 'M5'], consumer: [] },
    activeEdges: [],
    msgs: [
      { id: 'm1', ...ctr('queue', -10, -8), color: ORANGE, label: 'M1', visible: true },
      { id: 'm3', ...ctr('queue', 0, 0), color: ORANGE, label: 'M3', visible: true },
      { id: 'm4', ...ctr('queue', 10, 8), color: ORANGE, label: 'M4', visible: true },
    ],
  },
  {
    annotation:
      'New consumer connects with prefetch=3 — picks up from queue head, at-least-once delivery',
    highlights: { queue: 'idle', consumer: 'success' },
    badges: { queue: [], consumer: ['prefetch=3'] },
    activeEdges: ['q-c'],
    msgs: [
      { id: 'm1', ...ctr('consumer', -12, -10), color: GREEN, label: 'M1', visible: true },
      { id: 'm3', ...ctr('consumer', 0, 0), color: GREEN, label: 'M3', visible: true },
      { id: 'm4', ...ctr('consumer', 12, 10), color: GREEN, label: 'M4', visible: true },
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

export function useRabbitMQInFlight(): Result {
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

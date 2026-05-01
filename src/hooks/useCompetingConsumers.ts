import { useMemo } from 'react'
import { useSteppedAnimation } from './useSteppedAnimation'
import { nodeCenter, NODE_W, NODE_H } from '../components/viz/canvasUtils'
import type { CanvasNode, CanvasEdge, FlyingMsg } from '../components/viz/canvasUtils'
import type { NodeKind } from '../types'

export const CANVAS_W = 940
export const CANVAS_H = 460

type Highlight = 'success' | 'error' | 'warning' | 'idle'

const BLUE = '#56a8f5'
const GREEN = '#6aab73'
const TEAL = '#2aacb8'

const BASE = [
  { id: 'producer', x: 30, y: 203, label: 'Producer', kind: 'producer' as NodeKind },
  { id: 'queue', x: 290, y: 203, label: 'Queue', kind: 'queue' as NodeKind },
  { id: 'a', x: 680, y: 30, label: 'Consumer A', kind: 'consumer' as NodeKind },
  { id: 'b', x: 680, y: 203, label: 'Consumer B', kind: 'consumer' as NodeKind },
  { id: 'c', x: 680, y: 376, label: 'Consumer C', kind: 'consumer' as NodeKind },
]

function ctr(id: string, dx = 0, dy = 0) {
  const n = BASE.find((b) => b.id === id)!
  const c = nodeCenter(n.x, n.y)
  return { x: c.x + dx, y: c.y + dy }
}

// Suppress unused import — NODE_W/NODE_H used via nodeCenter internally
void NODE_W
void NODE_H

type Step = {
  annotation: string
  highlights: Record<string, Highlight>
  badges: Record<string, string[]>
  activeEdges: string[]
  msgs: FlyingMsg[]
}

const STEPS: Step[] = [
  {
    annotation: '3 messages arrive in the queue — producer publishes, queue buffers',
    highlights: { producer: 'success', queue: 'warning', a: 'idle', b: 'idle', c: 'idle' },
    badges: { queue: ['M1', 'M2', 'M3'] },
    activeEdges: ['p-q'],
    msgs: [
      { id: 'm1', ...ctr('queue', -12, -10), color: BLUE, label: 'M1', visible: true },
      { id: 'm2', ...ctr('queue'), color: BLUE, label: 'M2', visible: true },
      { id: 'm3', ...ctr('queue', 12, 10), color: BLUE, label: 'M3', visible: true },
    ],
  },
  {
    annotation: 'Consumer A picks up M1 — locked to it, invisible to other consumers',
    highlights: { producer: 'idle', queue: 'warning', a: 'warning', b: 'idle', c: 'idle' },
    badges: { queue: ['M2', 'M3'] },
    activeEdges: ['q-a'],
    msgs: [
      { id: 'm1', ...ctr('a'), color: BLUE, label: 'M1', visible: true },
      { id: 'm2', ...ctr('queue', -6, -6), color: BLUE, label: 'M2', visible: true },
      { id: 'm3', ...ctr('queue', 6, 6), color: BLUE, label: 'M3', visible: true },
    ],
  },
  {
    annotation: 'Consumer B picks up M2 simultaneously — no coordination needed',
    highlights: { producer: 'idle', queue: 'warning', a: 'success', b: 'warning', c: 'idle' },
    badges: { queue: ['M3'] },
    activeEdges: ['q-a', 'q-b'],
    msgs: [
      { id: 'm1', ...ctr('a'), color: GREEN, label: 'M1', visible: true },
      { id: 'm2', ...ctr('b'), color: BLUE, label: 'M2', visible: true },
      { id: 'm3', ...ctr('queue'), color: BLUE, label: 'M3', visible: true },
    ],
  },
  {
    annotation: 'Consumer A sends ACK → message deleted from queue',
    highlights: { producer: 'idle', queue: 'warning', a: 'idle', b: 'success', c: 'idle' },
    badges: { queue: ['M3'] },
    activeEdges: ['q-b'],
    msgs: [
      { id: 'm2', ...ctr('b'), color: GREEN, label: 'M2', visible: true },
      { id: 'm3', ...ctr('queue'), color: BLUE, label: 'M3', visible: true },
      { id: 'ack', ...ctr('queue'), color: TEAL, label: '✓', visible: true },
    ],
  },
  {
    annotation: 'Consumer C picks up M3 — work distributed across all three',
    highlights: { producer: 'idle', queue: 'idle', a: 'idle', b: 'success', c: 'warning' },
    badges: {},
    activeEdges: ['q-c'],
    msgs: [
      { id: 'm2', ...ctr('b'), color: GREEN, label: 'M2', visible: true },
      { id: 'm3', ...ctr('c'), color: BLUE, label: 'M3', visible: true },
    ],
  },
  {
    annotation:
      'Each message delivered to exactly one consumer — competing consumers scale horizontally',
    highlights: { producer: 'idle', queue: 'idle', a: 'idle', b: 'success', c: 'success' },
    badges: {},
    activeEdges: [],
    msgs: [
      { id: 'm2', ...ctr('b'), color: GREEN, label: 'M2', visible: true },
      { id: 'm3', ...ctr('c'), color: GREEN, label: 'M3', visible: true },
    ],
  },
]

const EDGES: CanvasEdge[] = [
  { id: 'p-q', from: 'producer', to: 'queue' },
  { id: 'q-a', from: 'queue', to: 'a' },
  { id: 'q-b', from: 'queue', to: 'b' },
  { id: 'q-c', from: 'queue', to: 'c' },
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

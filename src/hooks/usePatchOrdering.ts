import { useMemo } from 'react'
import { useSteppedAnimation } from './useSteppedAnimation'
import { nodeCenter } from '../components/viz/canvasUtils'
import type {
  CanvasNode,
  CanvasEdge,
  FlyingMsg,
  Highlight,
  DockedMsg,
} from '../components/viz/canvasUtils'
import type { NodeKind } from '../types'

export const CANVAS_W = 840
export const CANVAS_H = 290

const BLUE = '#56a8f5'
const RED = '#f85149'
const ORANGE = '#cf8e6d'

const BASE_NODES: Array<{ id: string; x: number; y: number; label: string; kind: NodeKind }> = [
  { id: 'source', x: 20, y: 73, label: 'Source', kind: 'service' },
  { id: 'broker', x: 280, y: 73, label: 'Broker', kind: 'queue' },
  { id: 'mirror', x: 560, y: 73, label: 'Mirror', kind: 'database' },
  { id: 'dlq', x: 280, y: 180, label: 'DLQ', kind: 'dlq' },
]

const BASE_EDGES: CanvasEdge[] = [
  { id: 's-b', from: 'source', to: 'broker', color: BLUE },
  { id: 'b-m', from: 'broker', to: 'mirror', color: BLUE },
  { id: 'b-dlq', from: 'broker', to: 'dlq', color: RED },
  { id: 'dlq-m', from: 'dlq', to: 'mirror', color: ORANGE },
]

const dlqC = nodeCenter(280, 180)
const mirrorC = nodeCenter(560, 73)

export type PatchOrderingStep = {
  highlights: Record<string, 'success' | 'error' | 'warning' | 'idle'>
  activeEdges: string[]
  messages: FlyingMsg[]
  dockedMsgs: Record<string, DockedMsg[]>
  mirrorState: Record<string, string>
  mirrorDrifted: boolean
  annotation: string
}

const STEPS: PatchOrderingStep[] = [
  {
    highlights: { source: 'idle', broker: 'idle', mirror: 'idle', dlq: 'idle' },
    activeEdges: [],
    messages: [],
    dockedMsgs: {},
    mirrorState: { email: 'alice@co.com', role: 'user', plan: 'pro' },
    mirrorDrifted: false,
    annotation:
      'Source and Mirror in sync. Patches sent for each change — small payloads, efficient.',
  },
  {
    highlights: { source: 'success', broker: 'idle', mirror: 'idle', dlq: 'idle' },
    activeEdges: ['s-b'],
    messages: [],
    dockedMsgs: { source: [{ label: 'M1', color: BLUE }] },
    mirrorState: { email: 'alice@co.com', role: 'user', plan: 'pro' },
    mirrorDrifted: false,
    annotation: "Source updates email → sends M1: PATCH {email: 'alice@new.com'}",
  },
  {
    highlights: { source: 'idle', broker: 'warning', mirror: 'idle', dlq: 'error' },
    activeEdges: ['b-dlq'],
    messages: [],
    dockedMsgs: { dlq: [{ label: 'M1', color: RED }] },
    mirrorState: { email: 'alice@co.com', role: 'user', plan: 'pro' },
    mirrorDrifted: false,
    annotation: 'M1 reaches broker but Mirror consumer crashes. M1 routed to Dead Letter Queue.',
  },
  {
    highlights: { source: 'idle', broker: 'warning', mirror: 'success', dlq: 'idle' },
    activeEdges: ['b-m'],
    messages: [],
    dockedMsgs: { dlq: [{ label: 'M1', color: RED }], mirror: [{ label: 'M2', color: BLUE }] },
    mirrorState: { email: 'alice@other.com', role: 'admin', plan: 'pro' },
    mirrorDrifted: false,
    annotation:
      "Meanwhile: Source updates again. M2: PATCH {email: 'alice@other.com', role: 'admin'} arrives at Mirror and applies.",
  },
  {
    highlights: { source: 'idle', broker: 'idle', mirror: 'success', dlq: 'idle' },
    activeEdges: ['b-m'],
    messages: [],
    dockedMsgs: { dlq: [{ label: 'M1', color: RED }], mirror: [{ label: 'M3', color: BLUE }] },
    mirrorState: { email: 'alice@other.com', role: 'admin', plan: 'enterprise' },
    mirrorDrifted: false,
    annotation: "M3: PATCH {plan: 'enterprise'} arrives and applies. Mirror has processed M2 + M3.",
  },
  {
    highlights: { source: 'idle', broker: 'idle', mirror: 'idle', dlq: 'warning' },
    activeEdges: ['dlq-m'],
    messages: [
      {
        id: 'M1',
        x: Math.round((dlqC.x + mirrorC.x) / 2),
        y: Math.round((dlqC.y + mirrorC.y) / 2),
        color: ORANGE,
        label: 'M1',
        visible: true,
      },
    ],
    dockedMsgs: {},
    mirrorState: { email: 'alice@other.com', role: 'admin', plan: 'enterprise' },
    mirrorDrifted: false,
    annotation: 'M1 exits DLQ and replays toward Mirror. M1 was generated from state before M2/M3.',
  },
  {
    highlights: { source: 'idle', broker: 'idle', mirror: 'error', dlq: 'idle' },
    activeEdges: [],
    messages: [],
    dockedMsgs: { mirror: [{ label: 'M1', color: ORANGE }] },
    mirrorState: { email: 'alice@new.com', role: 'admin', plan: 'enterprise' },
    mirrorDrifted: true,
    annotation:
      "M1 patches email='alice@new.com' — overwriting alice@other.com set by M2. Corruption.",
  },
  {
    highlights: { source: 'idle', broker: 'idle', mirror: 'idle', dlq: 'idle' },
    activeEdges: [],
    messages: [],
    dockedMsgs: {},
    mirrorState: { email: 'alice@new.com', role: 'admin', plan: 'enterprise' },
    mirrorDrifted: true,
    annotation:
      "To apply M1 safely you'd need per-field updatedAt. For a 1MB JSON with 200 fields: snapshots + sequence numbers are the only practical answer.",
  },
]

type Result = {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  step: PatchOrderingStep
  currentStep: number
  totalSteps: number
  isLast: boolean
  next: () => void
  reset: () => void
}

export function usePatchOrdering(): Result {
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

  return { nodes, edges, step, currentStep, totalSteps, isLast, next, reset }
}

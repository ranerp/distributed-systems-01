import { useEffect, useMemo } from 'react'
import { useSteppedAnimation } from './useSteppedAnimation'
import { nodeCenter } from '../components/viz/canvasUtils'
import type { CanvasNode, CanvasEdge, FlyingMsg } from '../components/viz/canvasUtils'

export type CAPMode = 'CP' | 'AP' | 'CA'

export const CANVAS_W_CAP = 450
export const CANVAS_H_CAP = 280
export const PARTITION_Y = 140
export const PARTITION_X1 = 185

const POS = {
  client: { x: 20, y: 113 },
  leader: { x: 215, y: 38 },
  replica: { x: 215, y: 188 },
  caClient: { x: 25, y: 113 },
  caNode: { x: 275, y: 113 },
} as const

function c(p: { x: number; y: number }) {
  return nodeCenter(p.x, p.y)
}

const BLUE = '#56a8f5'
const GREEN = '#6aab73'
const RED = '#f28b82'
const ORANGE = '#e8a87c'
const YELLOW = '#e5c07b'

type Highlight = 'success' | 'error' | 'warning' | 'idle'

type Frame = {
  highlights: Record<string, Highlight>
  activeEdges: string[]
  messages: FlyingMsg[]
  annotation: string
  partition: boolean
}

const CP_FRAMES: Frame[] = [
  {
    highlights: { client: 'success', leader: 'success', replica: 'success' },
    activeEdges: ['c-l', 'l-r'],
    messages: [
      { id: 'w', ...c(POS.leader), color: BLUE, label: 'W', visible: true },
      { id: 'rep', ...c(POS.replica), color: GREEN, label: '✓', visible: true },
    ],
    annotation: 'Healthy — writes to leader, replica in sync',
    partition: false,
  },
  {
    highlights: { client: 'idle', leader: 'warning', replica: 'warning' },
    activeEdges: [],
    messages: [],
    annotation: 'Network partition — leader cannot reach replica',
    partition: true,
  },
  {
    highlights: { client: 'error', leader: 'warning', replica: 'error' },
    activeEdges: [],
    messages: [{ id: 'err', ...c(POS.client), color: RED, label: '✗', visible: true }],
    annotation: 'CP: write rejected — no quorum. Consistency preserved, availability sacrificed',
    partition: true,
  },
  {
    highlights: { client: 'idle', leader: 'success', replica: 'success' },
    activeEdges: ['c-l', 'l-r'],
    messages: [{ id: 'sync', ...c(POS.replica), color: BLUE, label: '↺', visible: true }],
    annotation: 'Partition heals — replica syncs, system returns to normal',
    partition: false,
  },
]

const AP_FRAMES: Frame[] = [
  {
    highlights: { client: 'success', leader: 'success', replica: 'success' },
    activeEdges: ['c-l', 'l-r'],
    messages: [
      { id: 'w', ...c(POS.leader), color: BLUE, label: 'W', visible: true },
      { id: 'rep', ...c(POS.replica), color: GREEN, label: '✓', visible: true },
    ],
    annotation: 'Healthy — writes to leader, replica in sync',
    partition: false,
  },
  {
    highlights: { client: 'idle', leader: 'warning', replica: 'warning' },
    activeEdges: [],
    messages: [],
    annotation: 'Network partition — nodes diverge',
    partition: true,
  },
  {
    highlights: { client: 'success', leader: 'success', replica: 'warning' },
    activeEdges: ['c-l'],
    messages: [
      { id: 'w2', ...c(POS.leader), color: GREEN, label: 'W', visible: true },
      { id: 'stale', ...c(POS.replica), color: ORANGE, label: 'stale', visible: true },
    ],
    annotation: 'AP: write accepted — replica serves stale data. Available, not consistent',
    partition: true,
  },
  {
    highlights: { client: 'idle', leader: 'success', replica: 'success' },
    activeEdges: ['c-l', 'l-r'],
    messages: [{ id: 'sync', ...c(POS.replica), color: YELLOW, label: '⟳', visible: true }],
    annotation: 'Partition heals — eventual consistency, replica catches up',
    partition: false,
  },
]

const CA_FRAMES: Frame[] = [
  {
    highlights: { client: 'success', node: 'success' },
    activeEdges: ['c-n'],
    messages: [{ id: 'w', ...c(POS.caNode), color: BLUE, label: 'W', visible: true }],
    annotation: 'Single-node: write succeeds, always consistent',
    partition: false,
  },
  {
    highlights: { client: 'success', node: 'success' },
    activeEdges: ['c-n'],
    messages: [{ id: 'r', ...c(POS.caClient), color: GREEN, label: '✓', visible: true }],
    annotation: 'Every read returns the latest write — single source of truth',
    partition: false,
  },
  {
    highlights: { client: 'idle', node: 'warning' },
    activeEdges: [],
    messages: [],
    annotation: 'Add a replica → partitions become possible → must choose: CP or AP',
    partition: false,
  },
]

const MODE_FRAMES: Record<CAPMode, Frame[]> = { CP: CP_FRAMES, AP: AP_FRAMES, CA: CA_FRAMES }

export type CAPAnimState = {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  messages: FlyingMsg[]
  annotation: string
  partition: boolean
  currentStep: number
  totalSteps: number
  isLast: boolean
  next: () => void
  reset: () => void
}

function buildState(
  mode: CAPMode,
  frame: Frame,
  systemName?: string,
): Omit<CAPAnimState, 'currentStep' | 'totalSteps' | 'isLast' | 'next' | 'reset'> {
  if (mode === 'CA') {
    return {
      nodes: [
        {
          id: 'client',
          ...POS.caClient,
          label: 'Client',
          kind: 'producer',
          highlight: frame.highlights['client'],
        },
        {
          id: 'node',
          ...POS.caNode,
          label: 'PostgreSQL',
          kind: 'database',
          highlight: frame.highlights['node'],
        },
      ],
      edges: [{ id: 'c-n', from: 'client', to: 'node', active: frame.activeEdges.includes('c-n') }],
      messages: frame.messages,
      annotation: frame.annotation,
      partition: false,
    }
  }

  const leaderLabel = systemName ?? (mode === 'CP' ? 'CP Node' : 'AP Node')
  const replicaLabel = mode === 'CP' ? 'Follower' : 'Replica'

  return {
    nodes: [
      {
        id: 'client',
        ...POS.client,
        label: 'Client',
        kind: 'producer',
        highlight: frame.highlights['client'],
      },
      {
        id: 'leader',
        ...POS.leader,
        label: leaderLabel,
        kind: 'service',
        highlight: frame.highlights['leader'],
      },
      {
        id: 'replica',
        ...POS.replica,
        label: replicaLabel,
        kind: 'database',
        highlight: frame.highlights['replica'],
      },
    ],
    edges: [
      { id: 'c-l', from: 'client', to: 'leader', active: frame.activeEdges.includes('c-l') },
      {
        id: 'l-r',
        from: 'leader',
        to: 'replica',
        active: frame.activeEdges.includes('l-r'),
        color: frame.partition ? RED : undefined,
      },
    ],
    messages: frame.messages,
    annotation: frame.annotation,
    partition: frame.partition,
  }
}

export function useCAPAnimation(mode: CAPMode | null, systemName?: string): CAPAnimState {
  const totalSteps = mode ? MODE_FRAMES[mode].length : 1
  const { currentStep, totalSteps: ts, isLast, next, reset } = useSteppedAnimation(totalSteps)

  useEffect(() => {
    reset()
    // reset when the selected system changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, systemName])

  const visual = useMemo(() => {
    if (!mode) {
      return { nodes: [], edges: [], messages: [], annotation: '', partition: false }
    }
    const frame = MODE_FRAMES[mode][currentStep] ?? MODE_FRAMES[mode][0]
    return buildState(mode, frame, systemName)
  }, [mode, currentStep, systemName])

  return { ...visual, currentStep, totalSteps: ts, isLast, next, reset }
}

import { useState, useEffect } from 'react'
import { AnimatedFlowCanvas } from '../viz/AnimatedFlowCanvas'
import { nodeCenter, NODE_W, NODE_H } from '../viz/canvasUtils'
import { FitCanvas } from '../viz/FitCanvas'
import { SlideContent } from '../layout/SlideContent'
import type { CanvasNode, CanvasEdge, FlyingMsg } from '../viz/canvasUtils'
import type { NodeKind } from '../../types'

void NODE_W
void NODE_H

const CANVAS_W = 940
const CANVAS_H = 240

const BASE_NODES: CanvasNode[] = [
  { id: 'p', x: 60, y: 93, label: 'Producer', kind: 'producer' as NodeKind },
  { id: 'q', x: 360, y: 93, label: 'Queue', kind: 'queue' as NodeKind },
  { id: 'c', x: 660, y: 93, label: 'Consumer', kind: 'consumer' as NodeKind },
]

const EDGES: CanvasEdge[] = [
  { id: 'p-q', from: 'p', to: 'q', color: '#56a8f5' },
  { id: 'q-c', from: 'q', to: 'c', color: '#6aab73' },
]

function ctr(id: string) {
  const n = BASE_NODES.find((b) => b.id === id)!
  return nodeCenter(n.x, n.y)
}

export function BasicFlowSlide() {
  const [phase, setPhase] = useState(0)
  const [msgKey, setMsgKey] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500)
    const t2 = setTimeout(() => setPhase(2), 1200)
    const t3 = setTimeout(() => setPhase(3), 1900)
    const t4 = setTimeout(() => {
      setPhase(0)
      setMsgKey((k) => k + 1)
    }, 2300)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [msgKey])

  const pos = phase === 0 ? ctr('p') : phase === 1 ? ctr('q') : ctr('c')

  const nodes: CanvasNode[] = BASE_NODES.map((n) => ({
    ...n,
    highlight:
      n.id === 'p' && phase === 0
        ? 'success'
        : n.id === 'q' && phase === 1
          ? 'warning'
          : n.id === 'c' && phase >= 2
            ? 'success'
            : 'idle',
  }))

  const edges: CanvasEdge[] = [
    { ...EDGES[0], active: phase >= 1 },
    { ...EDGES[1], active: phase >= 2 },
  ]

  const messages: FlyingMsg[] =
    phase < 3 ? [{ id: `msg-${msgKey}`, ...pos, color: '#56a8f5', label: 'M', visible: true }] : []

  return (
    <SlideContent
      title="Producer → Queue → Consumer"
      caption="Producer publishes without knowing who consumes · Consumer reads without knowing who produced"
    >
      <FitCanvas naturalWidth={CANVAS_W} naturalHeight={CANVAS_H}>
        <AnimatedFlowCanvas
          nodes={nodes}
          edges={edges}
          messages={messages}
          width={CANVAS_W}
          height={CANVAS_H}
        />
      </FitCanvas>
    </SlideContent>
  )
}

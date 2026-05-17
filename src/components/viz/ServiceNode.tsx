import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { FlowNodeData, NodeKind } from '../../types'

const ICONS: Record<NodeKind, string> = {
  producer: '📤',
  queue: '📬',
  consumer: '📥',
  database: '🗄️',
  service: '⚙️',
  relay: '🔄',
  dlq: '☠️',
}

const HIGHLIGHT_CLASSES: Record<NonNullable<FlowNodeData['highlight']>, string> = {
  success: 'border-accent-green text-accent-green',
  error: 'border-accent-red text-accent-red',
  warning: 'border-accent-orange text-accent-orange',
  idle: 'border-surface-3 text-surface-3',
}

export function ServiceNode({ data }: NodeProps) {
  const nodeData = data as FlowNodeData
  const highlight = nodeData.highlight ?? 'idle'
  const borderClass = HIGHLIGHT_CLASSES[highlight]

  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 bg-surface-1 font-mono text-sm min-w-[100px] text-center transition-colors duration-300 ${borderClass}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-surface-3" />
      <div className="text-lg mb-1">{ICONS[nodeData.kind]}</div>
      <div className="text-xs">{nodeData.label}</div>
      <Handle type="source" position={Position.Right} className="!bg-surface-3" />
    </div>
  )
}

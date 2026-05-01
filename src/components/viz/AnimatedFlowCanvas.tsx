import { motion, AnimatePresence } from 'framer-motion'
import { NODE_W, NODE_H, nodeCenter } from './canvasUtils'
import type { Highlight, CanvasNode, CanvasEdge, FlyingMsg } from './canvasUtils'
import type { NodeKind } from '../../types'

const ICONS: Record<NodeKind, string> = {
  producer: '📤',
  queue: '📬',
  consumer: '📥',
  database: '🗄️',
  service: '⚙️',
  relay: '🔄',
  dlq: '☠️',
}

const HIGHLIGHT_CLS: Record<Highlight, string> = {
  success: 'border-accent-green text-accent-green',
  error: 'border-accent-red text-accent-red',
  warning: 'border-accent-orange text-accent-orange',
  idle: 'border-surface-3 text-surface-3',
}

type Props = {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  messages: FlyingMsg[]
  width: number
  height: number
}

export function AnimatedFlowCanvas({ nodes, edges, messages, width, height }: Props) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  return (
    <div
      className="relative rounded-lg border border-surface-2 overflow-hidden flex-shrink-0"
      style={{ width, height, background: '#181818' }}
    >
      {/* SVG layer — edges */}
      <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#444" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const from = nodeMap.get(edge.from)
          const to = nodeMap.get(edge.to)
          if (!from || !to) return null
          const fc = nodeCenter(from.x, from.y)
          const tc = nodeCenter(to.x, to.y)
          const color = edge.active ? (edge.color ?? '#56a8f5') : '#2a2a2a'
          return (
            <line
              key={edge.id}
              x1={fc.x}
              y1={fc.y}
              x2={tc.x}
              y2={tc.y}
              stroke={color}
              strokeWidth={2}
              strokeDasharray={edge.active ? undefined : '5 4'}
              markerEnd="url(#arrowhead)"
              opacity={edge.active ? 0.75 : 0.25}
              style={{ transition: 'stroke 0.35s, opacity 0.35s' }}
            />
          )
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const hl = node.highlight ?? 'idle'
        return (
          <div
            key={node.id}
            className={`absolute flex flex-col items-center justify-center gap-0.5 rounded-lg border-2 font-mono text-center ${HIGHLIGHT_CLS[hl]}`}
            style={{
              left: node.x,
              top: node.y,
              width: NODE_W,
              height: NODE_H,
              background: '#1e1e1e',
              transition: 'border-color 0.35s, color 0.35s',
            }}
          >
            <span className="text-base leading-none">{ICONS[node.kind]}</span>
            <span className="text-[11px] leading-tight px-1 truncate w-full text-center">
              {node.label}
            </span>
            {node.badge && node.badge.length > 0 && (
              <div className="flex gap-0.5 flex-wrap justify-center px-1">
                {node.badge.map((b) => (
                  <span
                    key={b}
                    className="text-[9px] px-1 rounded font-bold"
                    style={{ background: '#56a8f520', color: '#56a8f5' }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Flying message tokens */}
      <AnimatePresence>
        {messages
          .filter((m) => m.visible)
          .map((msg) => (
            <motion.div
              key={msg.id}
              className="absolute flex items-center justify-center rounded-full font-mono font-bold pointer-events-none z-10"
              style={{
                width: 34,
                height: 34,
                backgroundColor: msg.color,
                color: '#101010',
                fontSize: 10,
                left: -17,
                top: -17,
                boxShadow: `0 0 14px ${msg.color}90`,
              }}
              initial={{ x: msg.x, y: msg.y, scale: 0, opacity: 0 }}
              animate={{ x: msg.x, y: msg.y, scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {msg.label}
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  )
}

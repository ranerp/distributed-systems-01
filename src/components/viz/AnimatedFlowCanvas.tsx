import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NODE_W, NODE_H, nodeCenter } from './canvasUtils'
import type { Highlight, CanvasNode, CanvasEdge, FlyingMsg } from './canvasUtils'
import type { NodeKind } from '../../types'

const ICONS: Record<NodeKind, ReactNode> = {
  producer: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 12V5" />
      <path d="M5 8l3-3 3 3" />
      <path d="M3 13h10" />
    </svg>
  ),
  queue: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M2 4h12" />
      <path d="M2 8h12" />
      <path d="M2 12h7" />
    </svg>
  ),
  consumer: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 4v7" />
      <path d="M5 8l3 3 3-3" />
      <path d="M3 13h10" />
    </svg>
  ),
  database: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <ellipse cx="8" cy="4.5" rx="5" ry="2" />
      <path d="M3 4.5v7c0 1.1 2.24 2 5 2s5-.9 5-2v-7" />
      <path d="M13 8c0 1.1-2.24 2-5 2s-5-.9-5-2" />
    </svg>
  ),
  service: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="8,2 13.2,5 13.2,11 8,14 2.8,11 2.8,5" />
    </svg>
  ),
  relay: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h10M10 3l3 3-3 3" />
      <path d="M13 10H3M6 7l-3 3 3 3" />
    </svg>
  ),
  dlq: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" />
    </svg>
  ),
}

const HIGHLIGHT_CLS: Record<Highlight, string> = {
  success: 'border-accent-green text-accent-green',
  error: 'border-accent-red text-accent-red',
  warning: 'border-accent-orange text-accent-orange',
  idle: 'border-surface-2 text-surface-3',
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
            <path d="M0,0 L0,6 L6,3 z" fill="#3a3a3a" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="#56a8f5" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const from = nodeMap.get(edge.from)
          const to = nodeMap.get(edge.to)
          if (!from || !to) return null
          const fc = nodeCenter(from.x, from.y)
          const tc = nodeCenter(to.x, to.y)
          const color = edge.active ? (edge.color ?? '#56a8f5') : '#2e2e2e'
          return (
            <line
              key={edge.id}
              x1={fc.x}
              y1={fc.y}
              x2={tc.x}
              y2={tc.y}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray={edge.active ? undefined : '5 4'}
              markerEnd={edge.active ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
              opacity={edge.active ? 0.7 : 0.2}
              style={{ transition: 'stroke 0.35s, opacity 0.35s' }}
            />
          )
        })}
      </svg>

      {/* Messages rendered first — slide under nodes on arrival */}
      <AnimatePresence>
        {messages
          .filter((m) => m.visible)
          .map((msg) => (
            <motion.div
              key={msg.id}
              className="absolute font-mono pointer-events-none flex items-center justify-center"
              style={{
                width: 38,
                height: 16,
                left: -19,
                top: -8,
                borderRadius: 3,
                border: `1px solid ${msg.color}cc`,
                backgroundColor: `${msg.color}26`,
                color: msg.color,
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: '0.06em',
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

      {/* Nodes — rendered after messages, sit on top */}
      {nodes.map((node) => {
        const hl = node.highlight ?? 'idle'
        return (
          <div
            key={node.id}
            className={`absolute flex flex-col items-center justify-center gap-1 rounded border font-mono text-center ${HIGHLIGHT_CLS[hl]}`}
            style={{
              left: node.x,
              top: node.y,
              width: NODE_W,
              height: NODE_H,
              background: '#1c1c1c',
              transition: 'border-color 0.35s, color 0.35s',
            }}
          >
            <span className="leading-none opacity-80">{ICONS[node.kind]}</span>
            <span className="text-[10px] leading-tight px-1 truncate w-full text-center tracking-wide">
              {node.label}
            </span>
            {node.badge && node.badge.length > 0 && (
              <div className="flex gap-0.5 flex-wrap justify-center px-1">
                {node.badge.map((b) => (
                  <span
                    key={b}
                    className="text-[9px] px-1 rounded"
                    style={{ background: '#56a8f514', color: '#56a8f5' }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Docked message pills — ordered arrival strip below each node */}
      {nodes.map((node) => {
        if (!node.dockedMsgs?.length) return null
        return (
          <div
            key={`docked-${node.id}`}
            className="absolute flex gap-1 justify-center flex-wrap pointer-events-none"
            style={{ left: node.x, top: node.y + NODE_H + 5, width: NODE_W }}
          >
            <AnimatePresence>
              {node.dockedMsgs.map((msg) => (
                <motion.span
                  key={msg.label}
                  className="font-mono"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    border: `1px solid ${msg.color}cc`,
                    backgroundColor: `${msg.color}26`,
                    color: msg.color,
                    fontSize: 8,
                    padding: '2px 4px',
                    borderRadius: 3,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                  }}
                >
                  {msg.label}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

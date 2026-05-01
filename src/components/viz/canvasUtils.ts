import type { NodeKind } from '../../types'

export const NODE_W = 110
export const NODE_H = 54

export type Highlight = 'success' | 'error' | 'warning' | 'idle'

export type CanvasNode = {
  id: string
  x: number
  y: number
  label: string
  kind: NodeKind
  highlight?: Highlight
  badge?: string[]
}

export type CanvasEdge = {
  id: string
  from: string
  to: string
  color?: string
  active?: boolean
}

export type FlyingMsg = {
  id: string
  x: number
  y: number
  color: string
  label: string
  visible: boolean
}

export function nodeCenter(x: number, y: number) {
  return { x: x + NODE_W / 2, y: y + NODE_H / 2 }
}

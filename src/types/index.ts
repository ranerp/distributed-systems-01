import type { ComponentType } from 'react'

export type SlideConfig = {
  id: string
  chapter: string
  component: ComponentType
  isInteractive: boolean
}

export type StepState = {
  currentStep: number
  totalSteps: number
  isLast: boolean
}

export type NodeKind = 'producer' | 'queue' | 'consumer' | 'database' | 'service' | 'relay'

export type FlowNodeData = {
  label: string
  kind: NodeKind
  highlight?: 'success' | 'error' | 'warning' | 'idle'
}

export type MessageState = 'idle' | 'inflight' | 'acked' | 'failed' | 'duplicate'

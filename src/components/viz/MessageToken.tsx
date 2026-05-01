import { motion } from 'framer-motion'
import type { MessageState } from '../../types'

type Props = {
  label?: string
  state: MessageState
  color?: string
}

const STATE_COLORS: Record<MessageState, string> = {
  idle: '#222222',
  inflight: '#56a8f5',
  acked: '#6aab73',
  failed: '#f85149',
  duplicate: '#cf8e6d',
}

export function MessageToken({ label, state, color }: Props) {
  const bg = color ?? STATE_COLORS[state]

  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="inline-flex items-center justify-center rounded-full font-mono text-xs font-bold text-surface-0 shadow-lg"
      style={{ backgroundColor: bg, width: 36, height: 36 }}
      title={state}
    >
      {label ?? 'M'}
    </motion.div>
  )
}

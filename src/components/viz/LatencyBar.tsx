import { motion } from 'framer-motion'

type Props = {
  label: string
  sublabel: string
  color: string
  durationMs: number
  active: boolean
}

export function LatencyBar({ label, sublabel, color, durationMs, active }: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between text-sm font-mono">
        <span className="text-white">{label}</span>
        <span style={{ color }}>{sublabel}</span>
      </div>
      <div className="h-8 rounded bg-surface-2 overflow-hidden">
        <motion.div
          className="h-full rounded"
          style={{ backgroundColor: color }}
          initial={{ width: '0%' }}
          animate={{ width: active ? '100%' : '0%' }}
          transition={{ duration: durationMs / 1000, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

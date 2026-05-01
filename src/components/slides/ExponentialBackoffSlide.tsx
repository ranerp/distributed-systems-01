import { motion } from 'framer-motion'

const ATTEMPTS = [
  { attempt: 1, delayMs: 500, label: '500ms' },
  { attempt: 2, delayMs: 1000, label: '1s' },
  { attempt: 3, delayMs: 2000, label: '2s' },
  { attempt: 4, delayMs: 4000, label: '4s' },
  { attempt: 5, delayMs: 8000, label: '8s' },
]

const MAX_DELAY = 8000

export function ExponentialBackoffSlide() {
  return (
    <div className="flex flex-col h-full gap-6 justify-center">
      <h2 className="text-2xl font-bold text-white">Exponential Backoff</h2>
      <p className="text-surface-3 text-sm font-mono">
        Linear retries hammer a degraded service. Exponential backoff gives it time to recover.
      </p>

      <div className="flex flex-col gap-3">
        {ATTEMPTS.map((a, i) => (
          <div key={a.attempt} className="flex items-center gap-4">
            <span className="text-xs text-surface-3 font-mono w-20 shrink-0">
              Attempt {a.attempt}
            </span>
            <div className="flex-1 h-7 bg-surface-2 rounded overflow-hidden">
              <motion.div
                className="h-full rounded bg-accent-blue"
                initial={{ width: 0 }}
                animate={{ width: `${(a.delayMs / MAX_DELAY) * 100}%` }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs text-accent-blue font-mono w-12 shrink-0">{a.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="rounded-lg border border-accent-red/40 bg-accent-red/10 p-4 font-mono text-xs">
          <div className="text-accent-red font-semibold mb-2">Without backoff</div>
          <div className="text-surface-3">
            500ms × 5 retries = 2.5s constant hammering
            <br />
            Thundering herd amplifies the outage
          </div>
        </div>
        <div className="rounded-lg border border-accent-green/40 bg-accent-green/10 p-4 font-mono text-xs">
          <div className="text-accent-green font-semibold mb-2">With backoff + jitter</div>
          <div className="text-surface-3">
            Clients spread load over time
            <br />
            Degraded service gets breathing room
          </div>
        </div>
      </div>
    </div>
  )
}

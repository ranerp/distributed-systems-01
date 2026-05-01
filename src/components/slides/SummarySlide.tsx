const TAKEAWAYS = [
  {
    emoji: '📬',
    text: 'Competing consumers = work distributed. Consumer groups = message broadcast to each group.',
  },
  {
    emoji: '⚠️',
    text: 'FIFO is not free. You get it only within a single partition/queue with a single consumer.',
  },
  {
    emoji: '💀',
    text: 'In-flight messages will be redelivered on crash. Design consumers to be idempotent.',
  },
  {
    emoji: '🔄',
    text: 'Race conditions are silent. Use optimistic concurrency or locks, not hope.',
  },
  {
    emoji: '📤',
    text: 'Dual-write is broken. Use the outbox pattern for at-least-once delivery guarantees.',
  },
  {
    emoji: '🔁',
    text: 'Saga replaces distributed transactions with local transactions + compensations.',
  },
  {
    emoji: '🕐',
    text: 'Wall clocks lie. Use Lamport timestamps or vector clocks for causal ordering.',
  },
  {
    emoji: '📸',
    text: 'Patches drift. Periodic snapshots + sequence numbers keep mirrors honest.',
  },
  {
    emoji: '⚡',
    text: 'In-process calls are 1000× faster than network calls. Respect that budget.',
  },
  {
    emoji: '🔌',
    text: 'Circuit breaker prevents cascading failures: open fast, probe slowly, reset on success.',
  },
  {
    emoji: '☠️',
    text: 'DLQ captures unprocessable messages after retry exhaustion — inspect and replay, never silently drop.',
  },
  {
    emoji: '🔑',
    text: 'Idempotency key = process each unique request exactly once, even under redelivery.',
  },
  {
    emoji: '📜',
    text: 'Event sourcing: the log never lies. Replay it for any past state or new projection.',
  },
  {
    emoji: '🗺️',
    text: 'CAP theorem: P is mandatory. Your real choice is C vs A during a network partition.',
  },
  {
    emoji: '🔀',
    text: 'Patches from DLQ corrupt state without per-field timestamps. Snapshots + seq numbers are the safe default.',
  },
]

export function SummarySlide() {
  return (
    <div className="flex flex-col h-full gap-6 justify-center">
      <h2 className="text-2xl font-bold text-white">Key Takeaways</h2>

      <div className="grid grid-cols-1 gap-2.5">
        {TAKEAWAYS.map((t) => (
          <div
            key={t.emoji}
            className="flex items-start gap-4 rounded border border-surface-2 px-4 py-3 bg-surface-1 font-mono text-sm"
          >
            <span className="text-lg shrink-0">{t.emoji}</span>
            <span className="text-surface-3">{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

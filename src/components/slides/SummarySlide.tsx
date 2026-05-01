type Highlight = { label: string; accent: string; text: string }

const HIGHLIGHTS: Highlight[] = [
  {
    label: 'delivery',
    accent: 'text-accent-blue',
    text: 'FIFO is not free. Ordering holds only within a single partition with a single consumer.',
  },
  {
    label: 'failure',
    accent: 'text-accent-orange',
    text: 'In-flight messages will be redelivered on crash. Design every consumer to be idempotent.',
  },
  {
    label: 'concurrency',
    accent: 'text-accent-red',
    text: 'Race conditions are silent. Use optimistic concurrency or locks — not hope.',
  },
  {
    label: 'time',
    accent: 'text-accent-teal',
    text: 'Wall clocks lie. Use Lamport timestamps or vector clocks for causal ordering.',
  },
  {
    label: 'architecture',
    accent: 'text-accent-gold',
    text: 'In-process calls are 1000× faster than network calls. Respect that budget.',
  },
]

export function SummarySlide() {
  return (
    <div className="flex flex-col h-full justify-center gap-8">
      <div className="text-[10px] font-mono text-surface-3 uppercase tracking-widest">
        five things to carry out
      </div>
      <div className="flex flex-col gap-5">
        {HIGHLIGHTS.map((h) => (
          <div key={h.label} className="flex flex-col gap-1">
            <span className={`text-[10px] font-mono uppercase tracking-widest ${h.accent}`}>
              {h.label}
            </span>
            <p className="font-mono text-xl text-text leading-snug">{h.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

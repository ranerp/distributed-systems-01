type Signal = { signal: string; recommendation: string; good: boolean }

const SIGNALS: Signal[] = [
  { signal: 'Single team, < 10 engineers', recommendation: 'Modular monolith', good: false },
  {
    signal: 'Independent scaling of one component',
    recommendation: 'Extract that one service',
    good: true,
  },
  { signal: 'Different deployment cadences per team', recommendation: 'Microservices', good: true },
  {
    signal: '"We want to be like Netflix"',
    recommendation: 'Modular monolith until you have the problems Netflix has',
    good: false,
  },
  {
    signal: 'Regulatory/compliance isolation',
    recommendation: 'Separate service with strict boundaries',
    good: true,
  },
  {
    signal: 'Distributed transaction required',
    recommendation: 'Rethink the boundaries — or use saga',
    good: false,
  },
  {
    signal: 'Network latency is killing you',
    recommendation: 'Collapse services, consider in-process calls',
    good: false,
  },
]

export function WhenMicroservicesSlide() {
  return (
    <div className="flex flex-col h-full gap-5 justify-center">
      <h2 className="text-2xl font-bold text-white">When do Microservices Actually Make Sense?</h2>

      <div className="flex flex-col gap-2">
        {SIGNALS.map((s) => (
          <div
            key={s.signal}
            className="flex items-start gap-4 rounded border border-surface-2 px-4 py-3 bg-surface-1 font-mono text-sm"
          >
            <span className="text-surface-3 flex-1">{s.signal}</span>
            <span
              className={`shrink-0 text-xs ${s.good ? 'text-accent-green' : 'text-accent-orange'}`}
            >
              → {s.recommendation}
            </span>
          </div>
        ))}
      </div>

      <div className="text-xs text-surface-3 font-mono">
        Conway's Law: your architecture mirrors your org chart. Fix the org chart first.
      </div>
    </div>
  )
}

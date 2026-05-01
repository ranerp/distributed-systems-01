import { useState } from 'react'
import { LatencyBar } from '../viz/LatencyBar'
import { useAutoPlay } from '../../hooks/useAutoPlay'

export function LatencyComparisonSlide() {
  const [active, setActive] = useState(false)

  useAutoPlay([{ delayMs: 400, action: () => setActive(true) }], true)

  return (
    <div className="flex flex-col h-full gap-8 justify-center">
      <h2 className="text-2xl font-bold text-white">
        Modular Monolith vs Microservices — The Latency Reality
      </h2>

      <div className="flex flex-col gap-6">
        <LatencyBar
          label="In-process call (modular monolith)"
          sublabel="~0.001ms"
          color="#6aab73"
          durationMs={150}
          active={active}
        />
        <LatencyBar
          label="Loopback HTTP (same machine)"
          sublabel="~0.5ms"
          color="#d5b778"
          durationMs={600}
          active={active}
        />
        <LatencyBar
          label="Internal network API call"
          sublabel="~2–10ms"
          color="#f85149"
          durationMs={2000}
          active={active}
        />
        <LatencyBar
          label="Cross-region API call"
          sublabel="~80–200ms"
          color="#f85149"
          durationMs={4000}
          active={active}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
        <div className="rounded border border-accent-green/40 bg-accent-green/5 p-4">
          <div className="text-accent-green font-semibold mb-2">Modular Monolith wins when</div>
          <div className="text-surface-3 space-y-1">
            <div>• Modules are highly cohesive</div>
            <div>• Team is small, deploys together</div>
            <div>• Latency budget is tight</div>
          </div>
        </div>
        <div className="rounded border border-accent-blue/40 bg-accent-blue/5 p-4">
          <div className="text-accent-blue font-semibold mb-2">Microservices win when</div>
          <div className="text-surface-3 space-y-1">
            <div>• Independent scaling required</div>
            <div>• Teams own separate deploy cadences</div>
            <div>• Technology diversity needed</div>
          </div>
        </div>
      </div>
    </div>
  )
}

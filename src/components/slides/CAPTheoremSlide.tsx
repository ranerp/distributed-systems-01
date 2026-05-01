type SystemRow = { system: string; trades: string; behavior: string }

const SYSTEMS: SystemRow[] = [
  {
    system: 'ZooKeeper',
    trades: 'CP',
    behavior: 'Rejects requests without quorum — stays consistent',
  },
  {
    system: 'etcd',
    trades: 'CP',
    behavior: 'Leader election; writes unavailable if majority lost',
  },
  {
    system: 'Cassandra',
    trades: 'AP',
    behavior: 'Always responds; eventual consistency by default',
  },
  {
    system: 'DynamoDB',
    trades: 'AP',
    behavior: 'Available by default; strong reads optional (+latency)',
  },
  {
    system: 'MongoDB',
    trades: 'CP',
    behavior: 'Primary required for writes; replica reads may be stale',
  },
  { system: 'PostgreSQL', trades: 'CA*', behavior: 'Single node — no partition to tolerate' },
]

export function CAPTheoremSlide() {
  return (
    <div className="flex flex-col h-full gap-5 justify-center">
      <h2 className="text-2xl font-bold text-white">CAP Theorem — P Is Not Optional</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-surface-2 bg-surface-1 p-4 font-mono">
          <div className="text-accent-blue font-semibold text-sm mb-1">C — Consistency</div>
          <div className="text-surface-3 text-xs">
            Every read receives the most recent write or an error.
          </div>
        </div>
        <div className="rounded-lg border border-surface-2 bg-surface-1 p-4 font-mono">
          <div className="text-accent-green font-semibold text-sm mb-1">A — Availability</div>
          <div className="text-surface-3 text-xs">
            Every request receives a non-error response (may not be latest data).
          </div>
        </div>
        <div className="rounded-lg border-2 border-accent-orange/40 bg-accent-orange/10 p-4 font-mono">
          <div className="text-accent-orange font-semibold text-sm mb-1 flex items-center justify-between">
            P — Partition Tolerance
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-orange/20 text-accent-orange">
              mandatory
            </span>
          </div>
          <div className="text-accent-orange/70 text-xs">
            System continues operating despite network partition.
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-surface-2 bg-surface-1 px-5 py-3 font-mono text-sm text-surface-3">
        In any multi-node system, network partitions will happen. P is not a choice. The real
        tradeoff: <span className="text-accent-blue font-semibold">C vs A</span> during a partition.
      </div>

      <div className="overflow-x-auto rounded-lg border border-surface-2">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-surface-2 bg-surface-1">
              <th className="text-left px-4 py-3 text-accent-gold font-semibold">System</th>
              <th className="text-left px-4 py-3 text-accent-gold font-semibold">Trades Away</th>
              <th className="text-left px-4 py-3 text-accent-gold font-semibold">Behavior</th>
            </tr>
          </thead>
          <tbody>
            {SYSTEMS.map((row, i) => (
              <tr
                key={row.system}
                className={`border-b border-surface-2 ${i % 2 === 0 ? 'bg-surface-0' : 'bg-surface-1'}`}
              >
                <td className="px-4 py-3 text-text font-semibold">{row.system}</td>
                <td
                  className={`px-4 py-3 font-semibold ${row.trades.startsWith('CP') ? 'text-accent-blue' : row.trades.startsWith('AP') ? 'text-accent-green' : 'text-surface-3'}`}
                >
                  {row.trades}
                </td>
                <td className="px-4 py-3 text-surface-3">{row.behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-surface-3 font-mono">
        * CA is only achievable on a single node. Multi-node PostgreSQL (Patroni, etc.) is CP.
      </p>
    </div>
  )
}

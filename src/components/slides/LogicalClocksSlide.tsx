export function LogicalClocksSlide() {
  return (
    <div className="flex flex-col h-full gap-6 justify-center">
      <h2 className="text-2xl font-bold text-white">Logical Clocks — Why Wall Time Fails</h2>

      <div className="rounded-lg border border-accent-red/40 bg-accent-red/5 p-5 font-mono text-sm">
        <div className="text-accent-red font-semibold mb-2">The problem with wall clocks</div>
        <div className="text-surface-3 space-y-1">
          <div>Node A at 12:00:00.000 sends event E1</div>
          <div>Node B clock drifts → says 11:59:59.999 when it receives E1</div>
          <div className="text-accent-red">
            B thinks E1 arrived before it was sent. NTP can't fix sub-millisecond drift.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-lg border border-surface-2 p-5 bg-surface-1 font-mono text-sm">
          <div className="text-accent-blue font-semibold mb-3">Lamport Timestamp</div>
          <div className="text-surface-3 space-y-1.5">
            <div>• Each node has a counter, starts at 0</div>
            <div>• On send: increment counter, attach to message</div>
            <div>
              • On receive: <code className="text-white">max(local, received) + 1</code>
            </div>
            <div className="text-accent-green mt-2">→ Causally consistent ordering</div>
            <div className="text-accent-red">✗ Can't tell if two events are concurrent</div>
          </div>
        </div>

        <div className="rounded-lg border border-surface-2 p-5 bg-surface-1 font-mono text-sm">
          <div className="text-accent-purple font-semibold mb-3">Vector Clock</div>
          <div className="text-surface-3 space-y-1.5">
            <div>
              • Vector of counters, one per node:{' '}
              <code className="text-white">[A:0, B:0, C:0]</code>
            </div>
            <div>• On send: increment own slot</div>
            <div>• On receive: element-wise max, then increment</div>
            <div className="text-accent-green mt-2">→ Detects concurrent events</div>
            <div className="text-accent-red">✗ Size grows with cluster size</div>
          </div>
        </div>
      </div>

      <div className="text-xs text-surface-3 font-mono">
        Used in: DynamoDB (vector clocks for conflict detection) · Cassandra (LWW with Lamport) ·
        Riak · CRDTs
      </div>
    </div>
  )
}

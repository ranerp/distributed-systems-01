export function OutOfOrderSlide() {
  return (
    <div className="flex flex-col h-full gap-6 justify-center">
      <h2 className="text-2xl font-bold text-white">Out-of-Order Delivery</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-lg border border-surface-2 p-5 bg-surface-1">
          <h3 className="text-accent-red font-semibold mb-3 font-mono">Why it happens</h3>
          <ul className="space-y-2 text-sm text-surface-3 font-mono">
            <li>• Multiple partitions, unequal processing speed</li>
            <li>• Message retry puts M1 behind M3</li>
            <li>• Network paths with different latencies</li>
            <li>• Consumer crash requeues inflight messages</li>
          </ul>
        </div>

        <div className="rounded-lg border border-surface-2 p-5 bg-surface-1">
          <h3 className="text-accent-green font-semibold mb-3 font-mono">How to handle it</h3>
          <ul className="space-y-2 text-sm text-surface-3 font-mono">
            <li>• Include sequence numbers in events</li>
            <li>• Design consumers to be idempotent</li>
            <li>• Use Kafka partitioning by entity key</li>
            <li>• Last-write-wins with timestamps (+ Lamport clocks)</li>
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-accent-orange/40 bg-accent-orange/10 p-5 font-mono text-sm">
        <div className="text-accent-orange font-semibold mb-2">Example: User profile updates</div>
        <div className="space-y-1 text-surface-3">
          <div>Sent: M1(name=Alice) → M2(email=a@b.com) → M3(name=Bob)</div>
          <div>Received: M3(name=Bob) → M1(name=Alice) → M2(email=a@b.com)</div>
          <div className="text-accent-red mt-2">
            Result: name ends up as "Alice" — M3 was silently undone
          </div>
        </div>
      </div>
    </div>
  )
}

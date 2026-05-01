type Row = { scenario: string; fifo: string; why: string }

const ROWS: Row[] = [
  {
    scenario: 'Single queue, single consumer',
    fifo: '✓ Yes',
    why: 'No parallelism to break order',
  },
  {
    scenario: 'Single queue, competing consumers',
    fifo: '✗ No',
    why: 'Consumers process at different speeds',
  },
  {
    scenario: 'Kafka, one partition, one consumer',
    fifo: '✓ Yes',
    why: 'Partition is ordered log',
  },
  {
    scenario: 'Kafka, multiple partitions',
    fifo: '✗ Per partition only',
    why: 'No ordering guarantee across partitions',
  },
  {
    scenario: 'RabbitMQ with priorities',
    fifo: '✗ No',
    why: 'High-priority messages jump the queue',
  },
  {
    scenario: 'Service Bus with sessions',
    fifo: '✓ Per session',
    why: 'Session key routes to same consumer',
  },
]

export function FifoSlide() {
  return (
    <div className="flex flex-col h-full gap-6 justify-center">
      <h2 className="text-2xl font-bold text-text">FIFO — When do you actually get it?</h2>
      <div className="rounded-lg border border-surface-2 overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="bg-surface-1 border-b border-surface-2">
              <th className="text-left px-4 py-3 text-accent-gold">Scenario</th>
              <th className="text-left px-4 py-3 text-accent-gold">FIFO?</th>
              <th className="text-left px-4 py-3 text-accent-gold">Why</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.scenario}
                className={`border-b border-surface-2 ${i % 2 === 0 ? 'bg-surface-0' : 'bg-surface-1'}`}
              >
                <td className="px-4 py-3 text-text">{row.scenario}</td>
                <td
                  className={`px-4 py-3 font-semibold ${row.fifo.startsWith('✓') ? 'text-accent-green' : 'text-accent-red'}`}
                >
                  {row.fifo}
                </td>
                <td className="px-4 py-3 text-surface-3">{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-surface-3">
        Rule of thumb: if you need strict FIFO across multiple consumers, you need partitioning or
        sessions — not just a queue.
      </p>
    </div>
  )
}

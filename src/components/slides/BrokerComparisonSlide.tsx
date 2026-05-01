type Row = {
  broker: string
  model: string
  ordering: string
  delivery: string
  replayable: string
  bestFor: string
}

const BROKERS: Row[] = [
  {
    broker: 'RabbitMQ',
    model: 'Push',
    ordering: 'Per queue',
    delivery: 'At-least-once',
    replayable: '✗',
    bestFor: 'Task queues, RPC',
  },
  {
    broker: 'Azure Service Bus',
    model: 'Push',
    ordering: 'Sessions',
    delivery: 'At-least-once',
    replayable: '✗',
    bestFor: 'Enterprise workflows',
  },
  {
    broker: 'Kafka',
    model: 'Pull',
    ordering: 'Per partition',
    delivery: 'At-least-once*',
    replayable: '✓',
    bestFor: 'Event streaming, audit log',
  },
  {
    broker: 'In-process EventBus',
    model: 'Sync',
    ordering: 'Guaranteed',
    delivery: 'Exactly-once',
    replayable: '✗',
    bestFor: 'Modular monolith',
  },
]

const COLS: Array<keyof Row> = ['broker', 'model', 'ordering', 'delivery', 'replayable', 'bestFor']
const HEADERS: Record<keyof Row, string> = {
  broker: 'Broker',
  model: 'Model',
  ordering: 'Ordering',
  delivery: 'Delivery',
  replayable: 'Replayable',
  bestFor: 'Best for',
}

export function BrokerComparisonSlide() {
  return (
    <div className="flex flex-col h-full gap-6 justify-center">
      <h2 className="text-2xl font-bold text-white">
        Message Brokers — What are we choosing between?
      </h2>
      <div className="overflow-x-auto rounded-lg border border-surface-2">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-surface-2 bg-surface-1">
              {COLS.map((col) => (
                <th key={col} className="text-left px-4 py-3 text-accent-blue font-semibold">
                  {HEADERS[col]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BROKERS.map((row, i) => (
              <tr
                key={row.broker}
                className={`border-b border-surface-2 ${i % 2 === 0 ? 'bg-surface-0' : 'bg-surface-1'}`}
              >
                {COLS.map((col) => (
                  <td
                    key={col}
                    className={`px-4 py-3 ${col === 'broker' ? 'text-white font-semibold' : 'text-surface-3'}`}
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-surface-3">
        * Kafka is at-least-once by default; exactly-once requires idempotent producers +
        transactions
      </p>
    </div>
  )
}

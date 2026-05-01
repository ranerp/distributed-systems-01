import { lazy } from 'react'
import type { SlideConfig } from '../types'

const TitleSlide = lazy(() =>
  import('../components/slides/TitleSlide').then((m) => ({ default: m.TitleSlide })),
)
const BrokerComparisonSlide = lazy(() =>
  import('../components/slides/BrokerComparisonSlide').then((m) => ({
    default: m.BrokerComparisonSlide,
  })),
)
const BasicFlowSlide = lazy(() =>
  import('../components/slides/BasicFlowSlide').then((m) => ({ default: m.BasicFlowSlide })),
)
const CompetingConsumersSlide = lazy(() =>
  import('../components/slides/CompetingConsumersSlide').then((m) => ({
    default: m.CompetingConsumersSlide,
  })),
)
const ConsumerGroupsSlide = lazy(() =>
  import('../components/slides/ConsumerGroupsSlide').then((m) => ({
    default: m.ConsumerGroupsSlide,
  })),
)
const FifoSlide = lazy(() =>
  import('../components/slides/FifoSlide').then((m) => ({ default: m.FifoSlide })),
)
const InFlightSlide = lazy(() =>
  import('../components/slides/InFlightSlide').then((m) => ({ default: m.InFlightSlide })),
)
const RabbitMQInFlightSlide = lazy(() =>
  import('../components/slides/RabbitMQInFlightSlide').then((m) => ({
    default: m.RabbitMQInFlightSlide,
  })),
)
const RabbitMQOrderingSlide = lazy(() =>
  import('../components/slides/RabbitMQOrderingSlide').then((m) => ({
    default: m.RabbitMQOrderingSlide,
  })),
)
const OutOfOrderSlide = lazy(() =>
  import('../components/slides/OutOfOrderSlide').then((m) => ({ default: m.OutOfOrderSlide })),
)
const RaceConditionSlide = lazy(() =>
  import('../components/slides/RaceConditionSlide').then((m) => ({
    default: m.RaceConditionSlide,
  })),
)
const ExponentialBackoffSlide = lazy(() =>
  import('../components/slides/ExponentialBackoffSlide').then((m) => ({
    default: m.ExponentialBackoffSlide,
  })),
)
const DeadLetterQueueSlide = lazy(() =>
  import('../components/slides/DeadLetterQueueSlide').then((m) => ({
    default: m.DeadLetterQueueSlide,
  })),
)
const CircuitBreakerSlide = lazy(() =>
  import('../components/slides/CircuitBreakerSlide').then((m) => ({
    default: m.CircuitBreakerSlide,
  })),
)
const OutboxPatternSlide = lazy(() =>
  import('../components/slides/OutboxPatternSlide').then((m) => ({
    default: m.OutboxPatternSlide,
  })),
)
const SagaPatternSlide = lazy(() =>
  import('../components/slides/SagaPatternSlide').then((m) => ({ default: m.SagaPatternSlide })),
)
const LogicalClocksSlide = lazy(() =>
  import('../components/slides/LogicalClocksSlide').then((m) => ({
    default: m.LogicalClocksSlide,
  })),
)
const IdempotencySlide = lazy(() =>
  import('../components/slides/IdempotencySlide').then((m) => ({
    default: m.IdempotencySlide,
  })),
)
const EventSourcingSlide = lazy(() =>
  import('../components/slides/EventSourcingSlide').then((m) => ({
    default: m.EventSourcingSlide,
  })),
)
const PatchVsSnapshotSlide = lazy(() =>
  import('../components/slides/PatchVsSnapshotSlide').then((m) => ({
    default: m.PatchVsSnapshotSlide,
  })),
)
const PatchOrderingSlide = lazy(() =>
  import('../components/slides/PatchOrderingSlide').then((m) => ({
    default: m.PatchOrderingSlide,
  })),
)
const CAPTheoremSlide = lazy(() =>
  import('../components/slides/CAPTheoremSlide').then((m) => ({
    default: m.CAPTheoremSlide,
  })),
)
const CAPInteractiveSlide = lazy(() =>
  import('../components/slides/CAPInteractiveSlide').then((m) => ({
    default: m.CAPInteractiveSlide,
  })),
)
const LatencyComparisonSlide = lazy(() =>
  import('../components/slides/LatencyComparisonSlide').then((m) => ({
    default: m.LatencyComparisonSlide,
  })),
)
const WhenMicroservicesSlide = lazy(() =>
  import('../components/slides/WhenMicroservicesSlide').then((m) => ({
    default: m.WhenMicroservicesSlide,
  })),
)
const SummarySlide = lazy(() =>
  import('../components/slides/SummarySlide').then((m) => ({ default: m.SummarySlide })),
)

export const SLIDES: SlideConfig[] = [
  { id: 'title', chapter: 'Intro', component: TitleSlide, isInteractive: false },
  {
    id: 'broker-comparison',
    chapter: 'Chapter 1 — Message Brokers',
    component: BrokerComparisonSlide,
    isInteractive: false,
  },
  {
    id: 'basic-flow',
    chapter: 'Chapter 1 — Message Brokers',
    component: BasicFlowSlide,
    isInteractive: false,
  },
  {
    id: 'competing-consumers',
    chapter: 'Chapter 1 — Message Brokers',
    component: CompetingConsumersSlide,
    isInteractive: true,
  },
  {
    id: 'consumer-groups',
    chapter: 'Chapter 1 — Message Brokers',
    component: ConsumerGroupsSlide,
    isInteractive: true,
  },
  {
    id: 'fifo',
    chapter: 'Chapter 1 — Message Brokers',
    component: FifoSlide,
    isInteractive: false,
  },
  {
    id: 'inflight-mqtt',
    chapter: 'Chapter 2 — Failure & Ordering',
    component: InFlightSlide,
    isInteractive: true,
  },
  {
    id: 'inflight-rabbitmq',
    chapter: 'Chapter 2 — Failure & Ordering',
    component: RabbitMQInFlightSlide,
    isInteractive: true,
  },
  {
    id: 'rabbitmq-ordering',
    chapter: 'Chapter 2 — Failure & Ordering',
    component: RabbitMQOrderingSlide,
    isInteractive: true,
  },
  {
    id: 'out-of-order',
    chapter: 'Chapter 2 — Failure & Ordering',
    component: OutOfOrderSlide,
    isInteractive: false,
  },
  {
    id: 'race-condition',
    chapter: 'Chapter 2 — Failure & Ordering',
    component: RaceConditionSlide,
    isInteractive: true,
  },
  {
    id: 'exponential-backoff',
    chapter: 'Chapter 2 — Failure & Ordering',
    component: ExponentialBackoffSlide,
    isInteractive: false,
  },
  {
    id: 'dead-letter-queue',
    chapter: 'Chapter 2 — Failure & Ordering',
    component: DeadLetterQueueSlide,
    isInteractive: true,
  },
  {
    id: 'circuit-breaker',
    chapter: 'Chapter 2 — Failure & Ordering',
    component: CircuitBreakerSlide,
    isInteractive: true,
  },
  {
    id: 'outbox-pattern',
    chapter: 'Chapter 3 — Patterns',
    component: OutboxPatternSlide,
    isInteractive: true,
  },
  {
    id: 'saga-pattern',
    chapter: 'Chapter 3 — Patterns',
    component: SagaPatternSlide,
    isInteractive: true,
  },
  {
    id: 'logical-clocks',
    chapter: 'Chapter 3 — Patterns',
    component: LogicalClocksSlide,
    isInteractive: true,
  },
  {
    id: 'idempotency',
    chapter: 'Chapter 3 — Patterns',
    component: IdempotencySlide,
    isInteractive: true,
  },
  {
    id: 'event-sourcing',
    chapter: 'Chapter 3 — Patterns',
    component: EventSourcingSlide,
    isInteractive: true,
  },
  {
    id: 'patch-vs-snapshot',
    chapter: 'Chapter 4 — Architecture',
    component: PatchVsSnapshotSlide,
    isInteractive: true,
  },
  {
    id: 'patch-ordering',
    chapter: 'Chapter 4 — Architecture',
    component: PatchOrderingSlide,
    isInteractive: true,
  },
  {
    id: 'cap-theorem',
    chapter: 'Chapter 4 — Architecture',
    component: CAPTheoremSlide,
    isInteractive: false,
  },
  {
    id: 'cap-interactive',
    chapter: 'Chapter 4 — Architecture',
    component: CAPInteractiveSlide,
    isInteractive: true,
  },
  {
    id: 'latency-comparison',
    chapter: 'Chapter 4 — Architecture',
    component: LatencyComparisonSlide,
    isInteractive: false,
  },
  {
    id: 'when-microservices',
    chapter: 'Chapter 4 — Architecture',
    component: WhenMicroservicesSlide,
    isInteractive: false,
  },
  { id: 'summary', chapter: 'Outro', component: SummarySlide, isInteractive: false },
]

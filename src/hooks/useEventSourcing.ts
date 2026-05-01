import { useSteppedAnimation } from './useSteppedAnimation'

export type ESEvent = { seq: number; type: string; payload: string; highlighted: boolean }
export type Projection = { items: string[]; total: string; status: string }

export type EventSourcingStep = {
  events: ESEvent[]
  projection: Projection | null
  replayUpTo: number | null
  annotation: string
}

const STEPS: EventSourcingStep[] = [
  {
    events: [],
    projection: null,
    replayUpTo: null,
    annotation:
      'Event sourcing: the log is the source of truth. State is derived by replaying events — never stored as mutable rows.',
  },
  {
    events: [
      { seq: 1, type: 'OrderCreated', payload: 'item: Book ×2, price: $20.00', highlighted: false },
    ],
    projection: { items: ['Book ×2'], total: '$20.00', status: 'open' },
    replayUpTo: null,
    annotation: 'Append OrderCreated. Projection rebuilds: 1 item, $20.',
  },
  {
    events: [
      { seq: 1, type: 'OrderCreated', payload: 'item: Book ×2, price: $20.00', highlighted: false },
      { seq: 2, type: 'ItemAdded', payload: 'item: Pen ×1, price: $1.00', highlighted: false },
    ],
    projection: { items: ['Book ×2', 'Pen ×1'], total: '$21.00', status: 'open' },
    replayUpTo: null,
    annotation: 'Append ItemAdded. Projection applies delta: +Pen, +$1.',
  },
  {
    events: [
      { seq: 1, type: 'OrderCreated', payload: 'item: Book ×2, price: $20.00', highlighted: false },
      { seq: 2, type: 'ItemAdded', payload: 'item: Pen ×1, price: $1.00', highlighted: false },
      { seq: 3, type: 'PaymentProcessed', payload: 'amount: $21.00', highlighted: false },
    ],
    projection: { items: ['Book ×2', 'Pen ×1'], total: '$21.00', status: 'paid' },
    replayUpTo: null,
    annotation: 'Payment event recorded. Projection reflects paid status.',
  },
  {
    events: [
      { seq: 1, type: 'OrderCreated', payload: 'item: Book ×2, price: $20.00', highlighted: false },
      { seq: 2, type: 'ItemAdded', payload: 'item: Pen ×1, price: $1.00', highlighted: false },
      { seq: 3, type: 'PaymentProcessed', payload: 'amount: $21.00', highlighted: false },
      { seq: 4, type: 'ItemRefunded', payload: 'item: Pen ×1, $1.00 refunded', highlighted: false },
    ],
    projection: { items: ['Book ×2'], total: '$20.00', status: 'paid' },
    replayUpTo: null,
    annotation: 'Refund recorded as a new event — never editing past events.',
  },
  {
    events: [
      { seq: 1, type: 'OrderCreated', payload: 'item: Book ×2, price: $20.00', highlighted: true },
      { seq: 2, type: 'ItemAdded', payload: 'item: Pen ×1, price: $1.00', highlighted: true },
      { seq: 3, type: 'PaymentProcessed', payload: 'amount: $21.00', highlighted: false },
      { seq: 4, type: 'ItemRefunded', payload: 'item: Pen ×1, $1.00 refunded', highlighted: false },
    ],
    projection: { items: ['Book ×2', 'Pen ×1'], total: '$21.00', status: 'open' },
    replayUpTo: 2,
    annotation:
      'Replay up to event 2: exact state at that moment. Full audit trail, time travel, multiple projections from same log.',
  },
]

type Result = {
  step: EventSourcingStep
  currentStep: number
  totalSteps: number
  isLast: boolean
  next: () => void
  reset: () => void
}

export function useEventSourcing(): Result {
  const { currentStep, totalSteps, isLast, next, reset } = useSteppedAnimation(STEPS.length)
  return { step: STEPS[currentStep], currentStep, totalSteps, isLast, next, reset }
}

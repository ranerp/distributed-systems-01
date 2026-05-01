import { useSteppedAnimation } from './useSteppedAnimation'

const TOTAL_STEPS = 6

export type SagaStep = {
  steps: Array<{
    label: string
    status: 'idle' | 'ok' | 'error' | 'compensating'
  }>
  annotation: string
  mode: 'choreography' | 'orchestration'
  showCompensation: boolean
}

const STEPS: SagaStep[] = [
  {
    mode: 'choreography',
    showCompensation: false,
    steps: [
      { label: 'Order Service: create order', status: 'idle' },
      { label: 'Payment Service: charge card', status: 'idle' },
      { label: 'Inventory Service: reserve stock', status: 'idle' },
      { label: 'Shipping Service: schedule delivery', status: 'idle' },
    ],
    annotation:
      'Saga: a sequence of local transactions. Each step publishes an event for the next.',
  },
  {
    mode: 'choreography',
    showCompensation: false,
    steps: [
      { label: 'Order Service: create order', status: 'ok' },
      { label: 'Payment Service: charge card', status: 'idle' },
      { label: 'Inventory Service: reserve stock', status: 'idle' },
      { label: 'Shipping Service: schedule delivery', status: 'idle' },
    ],
    annotation: 'Step 1: Order created → publishes OrderCreated event',
  },
  {
    mode: 'choreography',
    showCompensation: false,
    steps: [
      { label: 'Order Service: create order', status: 'ok' },
      { label: 'Payment Service: charge card', status: 'ok' },
      { label: 'Inventory Service: reserve stock', status: 'idle' },
      { label: 'Shipping Service: schedule delivery', status: 'idle' },
    ],
    annotation: 'Step 2: Payment charged → publishes PaymentCharged event',
  },
  {
    mode: 'choreography',
    showCompensation: false,
    steps: [
      { label: 'Order Service: create order', status: 'ok' },
      { label: 'Payment Service: charge card', status: 'ok' },
      { label: 'Inventory Service: reserve stock', status: 'error' },
      { label: 'Shipping Service: schedule delivery', status: 'idle' },
    ],
    annotation: 'Step 3: Inventory reservation FAILS — out of stock!',
  },
  {
    mode: 'choreography',
    showCompensation: true,
    steps: [
      { label: 'Order Service: cancel order', status: 'compensating' },
      { label: 'Payment Service: refund card', status: 'compensating' },
      { label: 'Inventory Service: reserve stock', status: 'error' },
      { label: 'Shipping Service: schedule delivery', status: 'idle' },
    ],
    annotation: 'Compensating transactions run in reverse — refund payment, cancel order',
  },
  {
    mode: 'choreography',
    showCompensation: true,
    steps: [
      { label: 'Order Service: cancelled ✓', status: 'ok' },
      { label: 'Payment Service: refunded ✓', status: 'ok' },
      { label: 'Inventory Service: failed', status: 'error' },
      { label: 'Shipping Service: never started', status: 'idle' },
    ],
    annotation: 'System is back to consistent state. No distributed locks, no 2PC needed.',
  },
]

type Result = {
  step: SagaStep
  currentStep: number
  totalSteps: number
  isLast: boolean
  next: () => void
  reset: () => void
}

export function useSagaPattern(): Result {
  const { currentStep, totalSteps, isLast, next, reset } = useSteppedAnimation(TOTAL_STEPS)
  return {
    step: STEPS[currentStep],
    currentStep,
    totalSteps,
    isLast,
    next,
    reset,
  }
}

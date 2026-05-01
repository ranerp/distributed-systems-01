import { useSteppedAnimation } from './useSteppedAnimation'

const TOTAL_STEPS = 6

export type OutboxStep = {
  left: {
    dbWrite: 'idle' | 'ok' | 'error'
    brokerPublish: 'idle' | 'ok' | 'error'
    inconsistent: boolean
    label: string
  }
  right: {
    dbWrite: 'idle' | 'ok'
    outboxWrite: 'idle' | 'ok'
    relay: 'idle' | 'active' | 'ok'
    brokerPublish: 'idle' | 'ok'
    label: string
  }
  annotation: string
}

const STEPS: OutboxStep[] = [
  {
    left: {
      dbWrite: 'idle',
      brokerPublish: 'idle',
      inconsistent: false,
      label: '❌ Dual-write (broken)',
    },
    right: {
      dbWrite: 'idle',
      outboxWrite: 'idle',
      relay: 'idle',
      brokerPublish: 'idle',
      label: '✅ Outbox pattern (fixed)',
    },
    annotation:
      'Left: naive dual-write. Right: outbox pattern. Step through to see the difference.',
  },
  {
    left: {
      dbWrite: 'ok',
      brokerPublish: 'idle',
      inconsistent: false,
      label: '❌ Dual-write (broken)',
    },
    right: {
      dbWrite: 'ok',
      outboxWrite: 'idle',
      relay: 'idle',
      brokerPublish: 'idle',
      label: '✅ Outbox pattern (fixed)',
    },
    annotation: 'Both: DB write succeeds ✓',
  },
  {
    left: {
      dbWrite: 'ok',
      brokerPublish: 'error',
      inconsistent: false,
      label: '❌ Dual-write (broken)',
    },
    right: {
      dbWrite: 'ok',
      outboxWrite: 'ok',
      relay: 'idle',
      brokerPublish: 'idle',
      label: '✅ Outbox pattern (fixed)',
    },
    annotation: 'Left: broker publish fails ✗ — Right: outbox row written in same DB transaction ✓',
  },
  {
    left: {
      dbWrite: 'ok',
      brokerPublish: 'error',
      inconsistent: true,
      label: '❌ Dual-write (broken)',
    },
    right: {
      dbWrite: 'ok',
      outboxWrite: 'ok',
      relay: 'active',
      brokerPublish: 'idle',
      label: '✅ Outbox pattern (fixed)',
    },
    annotation: 'Left: DB and broker are now inconsistent! — Right: relay polls outbox table',
  },
  {
    left: {
      dbWrite: 'ok',
      brokerPublish: 'error',
      inconsistent: true,
      label: '❌ Dual-write (broken)',
    },
    right: {
      dbWrite: 'ok',
      outboxWrite: 'ok',
      relay: 'ok',
      brokerPublish: 'ok',
      label: '✅ Outbox pattern (fixed)',
    },
    annotation: 'Right: relay publishes to broker, marks outbox row as processed ✓',
  },
  {
    left: {
      dbWrite: 'ok',
      brokerPublish: 'error',
      inconsistent: true,
      label: '❌ Dual-write: inconsistent state',
    },
    right: {
      dbWrite: 'ok',
      outboxWrite: 'ok',
      relay: 'ok',
      brokerPublish: 'ok',
      label: '✅ Outbox: always consistent',
    },
    annotation: 'The outbox guarantees at-least-once delivery without distributed transactions',
  },
]

type Result = {
  step: OutboxStep
  currentStep: number
  totalSteps: number
  isLast: boolean
  next: () => void
  reset: () => void
}

export function useOutboxPattern(): Result {
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

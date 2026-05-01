import { useSteppedAnimation } from './useSteppedAnimation'

export type CBState = 'closed' | 'open' | 'half-open'

export type CircuitBreakerStep = {
  state: CBState
  failureCount: number
  failureThreshold: 3
  requestBlocked: boolean
  probeResult: null | 'success' | 'failure'
  annotation: string
}

const STEPS: CircuitBreakerStep[] = [
  {
    state: 'closed',
    failureCount: 0,
    failureThreshold: 3,
    requestBlocked: false,
    probeResult: null,
    annotation: 'CLOSED: all requests pass through to the downstream service',
  },
  {
    state: 'closed',
    failureCount: 1,
    failureThreshold: 3,
    requestBlocked: false,
    probeResult: null,
    annotation: 'Failure 1/3 — downstream returned an error',
  },
  {
    state: 'closed',
    failureCount: 2,
    failureThreshold: 3,
    requestBlocked: false,
    probeResult: null,
    annotation: 'Failure 2/3',
  },
  {
    state: 'closed',
    failureCount: 3,
    failureThreshold: 3,
    requestBlocked: false,
    probeResult: null,
    annotation: 'Failure 3/3 — threshold reached, tripping the circuit',
  },
  {
    state: 'open',
    failureCount: 3,
    failureThreshold: 3,
    requestBlocked: true,
    probeResult: null,
    annotation:
      'OPEN: requests fail immediately without touching downstream. Gives downstream time to recover.',
  },
  {
    state: 'half-open',
    failureCount: 3,
    failureThreshold: 3,
    requestBlocked: false,
    probeResult: null,
    annotation: 'HALF-OPEN: reset timeout elapsed — one probe request allowed through',
  },
  {
    state: 'half-open',
    failureCount: 3,
    failureThreshold: 3,
    requestBlocked: false,
    probeResult: 'success',
    annotation: 'Probe succeeded — downstream is healthy again',
  },
  {
    state: 'closed',
    failureCount: 0,
    failureThreshold: 3,
    requestBlocked: false,
    probeResult: null,
    annotation: 'CLOSED: circuit restored. Failure counter reset.',
  },
]

type Result = {
  step: CircuitBreakerStep
  currentStep: number
  totalSteps: number
  isLast: boolean
  next: () => void
  reset: () => void
}

export function useCircuitBreaker(): Result {
  const { currentStep, totalSteps, isLast, next, reset } = useSteppedAnimation(STEPS.length)
  return { step: STEPS[currentStep], currentStep, totalSteps, isLast, next, reset }
}

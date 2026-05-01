import { useSteppedAnimation } from './useSteppedAnimation'

const TOTAL_STEPS = 6

export type RaceStep = {
  serviceA: { reading: boolean; value: string | null; writing: boolean }
  serviceB: { reading: boolean; value: string | null; writing: boolean }
  sharedValue: string
  lostUpdate: boolean
  annotation: string
}

const STEPS: RaceStep[] = [
  {
    serviceA: { reading: false, value: null, writing: false },
    serviceB: { reading: false, value: null, writing: false },
    sharedValue: 'X = 1',
    lostUpdate: false,
    annotation: 'Initial state: X = 1 in the database',
  },
  {
    serviceA: { reading: true, value: null, writing: false },
    serviceB: { reading: true, value: null, writing: false },
    sharedValue: 'X = 1',
    lostUpdate: false,
    annotation: 'Both services read X = 1 at the same time',
  },
  {
    serviceA: { reading: false, value: 'X+1 = 2', writing: false },
    serviceB: { reading: false, value: 'X+1 = 2', writing: false },
    sharedValue: 'X = 1',
    lostUpdate: false,
    annotation: 'Both compute X + 1 = 2 independently in memory',
  },
  {
    serviceA: { reading: false, value: 'X+1 = 2', writing: true },
    serviceB: { reading: false, value: 'X+1 = 2', writing: false },
    sharedValue: 'X = 1',
    lostUpdate: false,
    annotation: 'Service A writes X = 2 first',
  },
  {
    serviceA: { reading: false, value: 'X+1 = 2', writing: false },
    serviceB: { reading: false, value: 'X+1 = 2', writing: true },
    sharedValue: 'X = 2',
    lostUpdate: false,
    annotation: "Service B writes X = 2 — same value, clobbers A's write",
  },
  {
    serviceA: { reading: false, value: null, writing: false },
    serviceB: { reading: false, value: null, writing: false },
    sharedValue: 'X = 2',
    lostUpdate: true,
    annotation: 'Result: X = 2 instead of X = 3 — one increment was silently lost!',
  },
]

type Result = {
  step: RaceStep
  currentStep: number
  totalSteps: number
  isLast: boolean
  next: () => void
  reset: () => void
}

export function useRaceCondition(): Result {
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

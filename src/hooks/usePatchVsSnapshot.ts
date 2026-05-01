import { useSteppedAnimation } from './useSteppedAnimation'

const TOTAL_STEPS = 5

export type PatchSnapshotStep = {
  sourceState: Record<string, string>
  mirrorState: Record<string, string>
  event: string | null
  drifted: boolean
  annotation: string
}

const STEPS: PatchSnapshotStep[] = [
  {
    sourceState: { name: 'Alice', email: 'alice@co.com', plan: 'pro' },
    mirrorState: { name: 'Alice', email: 'alice@co.com', plan: 'pro' },
    event: null,
    drifted: false,
    annotation: 'Source and mirror are in sync',
  },
  {
    sourceState: { name: 'Alice', email: 'alice@new.com', plan: 'pro' },
    mirrorState: { name: 'Alice', email: 'alice@co.com', plan: 'pro' },
    event: 'PATCH { email: "alice@new.com" }',
    drifted: false,
    annotation: 'Source updates email, sends a PATCH event to mirror',
  },
  {
    sourceState: { name: 'Alice', email: 'alice@new.com', plan: 'pro' },
    mirrorState: { name: 'Alice', email: 'alice@new.com', plan: 'pro' },
    event: null,
    drifted: false,
    annotation: 'Mirror applies patch — still in sync',
  },
  {
    sourceState: { name: 'Alice', email: 'alice@new.com', plan: 'enterprise' },
    mirrorState: { name: 'Alice', email: 'alice@new.com', plan: 'pro' },
    event: 'PATCH { plan: "enterprise" } ← dropped!',
    drifted: false,
    annotation:
      'Source updates plan — but the patch event is dropped (network blip, consumer crash...)',
  },
  {
    sourceState: { name: 'Alice', email: 'alice@new.com', plan: 'enterprise' },
    mirrorState: { name: 'Alice', email: 'alice@new.com', plan: 'pro' },
    event: null,
    drifted: true,
    annotation:
      'Mirror is silently wrong: plan = "pro" when it should be "enterprise". No way to detect without a full reconciliation.',
  },
]

type Result = {
  step: PatchSnapshotStep
  currentStep: number
  totalSteps: number
  isLast: boolean
  next: () => void
  reset: () => void
}

export function usePatchVsSnapshot(): Result {
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

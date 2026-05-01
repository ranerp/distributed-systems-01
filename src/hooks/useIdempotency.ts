import { useSteppedAnimation } from './useSteppedAnimation'

export type MessageStatus = 'pending' | 'arriving' | 'processing' | 'processed' | 'skipped'
export type StoreEntry = { key: string; seq: number }
export type MsgEntry = { id: string; key: string; attempt: number; status: MessageStatus }

export type IdempotencyStep = {
  messages: MsgEntry[]
  store: StoreEntry[]
  consumerAction: 'idle' | 'checking' | 'processing' | 'skipping'
  activeKey: string | null
  annotation: string
}

const STEPS: IdempotencyStep[] = [
  {
    messages: [],
    store: [],
    consumerAction: 'idle',
    activeKey: null,
    annotation:
      'Idempotency key: a client-supplied token that uniquely identifies a request. Process each key exactly once.',
  },
  {
    messages: [{ id: 'm1', key: 'txn-abc-123', attempt: 1, status: 'arriving' }],
    store: [],
    consumerAction: 'checking',
    activeKey: 'txn-abc-123',
    annotation: "M1 arrives with key 'txn-abc-123'. Consumer checks dedup store — not found.",
  },
  {
    messages: [{ id: 'm1', key: 'txn-abc-123', attempt: 1, status: 'processing' }],
    store: [{ key: 'txn-abc-123', seq: 1 }],
    consumerAction: 'processing',
    activeKey: 'txn-abc-123',
    annotation: 'Processing M1. Saving key to dedup store atomically with the result.',
  },
  {
    messages: [
      { id: 'm1', key: 'txn-abc-123', attempt: 1, status: 'processed' },
      { id: 'm1b', key: 'txn-abc-123', attempt: 2, status: 'arriving' },
    ],
    store: [{ key: 'txn-abc-123', seq: 1 }],
    consumerAction: 'checking',
    activeKey: 'txn-abc-123',
    annotation:
      'M1 redelivered (same key). Consumer checks store — found! Skip without processing.',
  },
  {
    messages: [
      { id: 'm1', key: 'txn-abc-123', attempt: 1, status: 'processed' },
      { id: 'm1b', key: 'txn-abc-123', attempt: 2, status: 'skipped' },
    ],
    store: [{ key: 'txn-abc-123', seq: 1 }],
    consumerAction: 'idle',
    activeKey: null,
    annotation: 'ACK without side effects. Dedup store prevents double charge / double dispatch.',
  },
  {
    messages: [
      { id: 'm1', key: 'txn-abc-123', attempt: 1, status: 'processed' },
      { id: 'm1b', key: 'txn-abc-123', attempt: 2, status: 'skipped' },
      { id: 'm2', key: 'txn-def-456', attempt: 1, status: 'processed' },
    ],
    store: [
      { key: 'txn-abc-123', seq: 1 },
      { key: 'txn-def-456', seq: 2 },
    ],
    consumerAction: 'idle',
    activeKey: null,
    annotation:
      "M2 with new key 'txn-def-456' — not in store, processed normally. Two operations, each exactly once.",
  },
]

type Result = {
  step: IdempotencyStep
  currentStep: number
  totalSteps: number
  isLast: boolean
  next: () => void
  reset: () => void
}

export function useIdempotency(): Result {
  const { currentStep, totalSteps, isLast, next, reset } = useSteppedAnimation(STEPS.length)
  return { step: STEPS[currentStep], currentStep, totalSteps, isLast, next, reset }
}

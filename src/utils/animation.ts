export const EASE_OUT = [0.16, 1, 0.3, 1] as const

export const STEP_DURATION = 0.4

export const TOKEN_COLORS: Record<string, string> = {
  blue: '#56a8f5',
  green: '#6aab73',
  red: '#f85149',
  orange: '#cf8e6d',
  purple: '#c77dbb',
  teal: '#2aacb8',
  gold: '#d5b778',
  cyan: '#42c3d4',
}

export function exponentialDelay(attempt: number, baseMs = 500): number {
  return baseMs * Math.pow(2, attempt)
}

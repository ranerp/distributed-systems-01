import { useEffect, useRef } from 'react'

type Step = {
  delayMs: number
  action: () => void
}

export function useAutoPlay(steps: Step[], active: boolean): void {
  const stepsRef = useRef(steps)

  useEffect(() => {
    stepsRef.current = steps
  })

  useEffect(() => {
    if (!active) return

    const timers: ReturnType<typeof setTimeout>[] = []
    let elapsed = 0

    for (const step of stepsRef.current) {
      elapsed += step.delayMs
      timers.push(setTimeout(step.action, elapsed))
    }

    return () => timers.forEach(clearTimeout)
  }, [active])
}

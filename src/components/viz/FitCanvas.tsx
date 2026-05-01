import { useRef, useState, useEffect, type ReactNode } from 'react'

type Props = {
  naturalWidth: number
  naturalHeight: number
  children: ReactNode
}

// Scales children to fill available width while respecting a height budget derived
// from the viewport. Uses a positioned wrapper so the scaled element occupies the
// correct layout space (CSS transform alone leaves layout dimensions unchanged).
export function FitCanvas({ naturalWidth, naturalHeight, children }: Props) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const compute = () => {
      const availW = el.clientWidth
      const availH = window.innerHeight * 0.62
      setScale(Math.min(availW / naturalWidth, availH / naturalHeight))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [naturalWidth, naturalHeight])

  return (
    <div ref={outerRef} className="w-full flex justify-center">
      {/* Wrapper occupies the correct scaled layout space */}
      <div
        style={{
          position: 'relative',
          width: naturalWidth * scale,
          height: naturalHeight * scale,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: naturalWidth,
            height: naturalHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useCAPAnimation,
  CANVAS_W_CAP,
  CANVAS_H_CAP,
  PARTITION_Y,
  PARTITION_X1,
} from '../../hooks/useCAPAnimation'
import type { CAPMode } from '../../hooks/useCAPAnimation'
import { AnimatedFlowCanvas } from '../viz/AnimatedFlowCanvas'
import { FitCanvas } from '../viz/FitCanvas'
import { SlideLayout } from '../layout/SlideLayout'

// Triangle geometry — SVG viewport 380 × 270
const C = { x: 60, y: 28 }
const A = { x: 320, y: 28 }
const P = { x: 190, y: 248 }
const centroid = { x: (C.x + A.x + P.x) / 3, y: (C.y + A.y + P.y) / 3 }

const ZONE_SNAP: Record<CAPMode, { x: number; y: number }> = {
  CP: { x: (C.x + P.x) / 2 + 8, y: (C.y + P.y) / 2 },
  AP: { x: (A.x + P.x) / 2 - 8, y: (A.y + P.y) / 2 },
  CA: { x: (C.x + A.x) / 2, y: C.y + 16 },
}

type System = { name: string; mode: CAPMode }

const SYSTEMS: System[] = [
  { name: 'ZooKeeper', mode: 'CP' },
  { name: 'etcd', mode: 'CP' },
  { name: 'MongoDB', mode: 'CP' },
  { name: 'Cassandra', mode: 'AP' },
  { name: 'DynamoDB', mode: 'AP' },
  { name: 'PostgreSQL', mode: 'CA' },
]

const MODE_COLOR: Record<CAPMode, string> = {
  CP: '#56a8f5',
  AP: '#6aab73',
  CA: '#888888',
}

const MODE_LABEL: Record<CAPMode, string> = {
  CP: 'CP — consistent + partition tolerant',
  AP: 'AP — available + partition tolerant',
  CA: 'CA* — consistent + available (single node only)',
}

type Props = { slideIndex: number; totalSlides: number }

export function CAPInteractiveSlide({ slideIndex, totalSlides }: Props) {
  const [active, setActive] = useState<System | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)

  const { currentStep, totalSteps, isLast, next, reset: resetSteps, ...anim } = useCAPAnimation(
    active?.mode ?? null,
    active?.name,
  )

  const handleDragStart = useCallback((e: React.DragEvent, sys: System) => {
    e.dataTransfer.setData('application/json', JSON.stringify(sys))
    setDragging(sys.name)
  }, [])

  const handleDragEnd = useCallback(() => setDragging(null), [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    setActive(JSON.parse(raw) as System)
    setDragging(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), [])

  const reset = useCallback(() => {
    setActive(null)
    resetSteps()
  }, [resetSteps])

  const mode = active?.mode ?? null

  return (
    <SlideLayout
      chapter="Chapter 4 — Architecture"
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      stepState={mode ? { currentStep, totalSteps, isLast, onNext: next, onReset: reset } : undefined}
    >
      <div className="flex flex-col h-full gap-3">
        <h2 className="text-2xl font-bold text-white shrink-0">
          CAP Theorem — Interactive Partition Demo
        </h2>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Left: triangle + chip tray */}
          <div className="flex flex-col gap-3 shrink-0 w-[380px]">
            <div
              className="relative rounded-lg border border-surface-2 bg-surface-1 cursor-crosshair"
              style={{ width: 380, height: 270 }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <svg
                width={380}
                height={270}
                className="absolute inset-0"
                style={{ pointerEvents: 'none' }}
              >
                {/* Zone fills */}
                <polygon
                  points={`${centroid.x},${centroid.y} ${C.x},${C.y} ${P.x},${P.y}`}
                  fill={mode === 'CP' ? '#56a8f518' : '#56a8f508'}
                  stroke="#56a8f530"
                  strokeWidth={1}
                  style={{ transition: 'fill 0.4s' }}
                />
                <polygon
                  points={`${centroid.x},${centroid.y} ${A.x},${A.y} ${P.x},${P.y}`}
                  fill={mode === 'AP' ? '#6aab7318' : '#6aab7308'}
                  stroke="#6aab7330"
                  strokeWidth={1}
                  style={{ transition: 'fill 0.4s' }}
                />
                <polygon
                  points={`${centroid.x},${centroid.y} ${C.x},${C.y} ${A.x},${A.y}`}
                  fill={mode === 'CA' ? '#88888818' : '#88888808'}
                  stroke="#88888830"
                  strokeWidth={1}
                  style={{ transition: 'fill 0.4s' }}
                />
                {/* Outer border */}
                <polygon
                  points={`${C.x},${C.y} ${A.x},${A.y} ${P.x},${P.y}`}
                  fill="none"
                  stroke="#444"
                  strokeWidth={1.5}
                />
                {/* Corner labels */}
                <text
                  x={C.x - 6}
                  y={C.y - 10}
                  fill="#56a8f5"
                  fontSize={13}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  C
                </text>
                <text
                  x={A.x - 4}
                  y={A.y - 10}
                  fill="#6aab73"
                  fontSize={13}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  A
                </text>
                <text
                  x={P.x - 4}
                  y={P.y + 18}
                  fill="#e8a87c"
                  fontSize={13}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  P
                </text>
                {/* Zone labels */}
                <text
                  x={(centroid.x + C.x + P.x) / 3 - 8}
                  y={(centroid.y + C.y + P.y) / 3}
                  fill="#56a8f560"
                  fontSize={10}
                  fontFamily="monospace"
                >
                  CP
                </text>
                <text
                  x={(centroid.x + A.x + P.x) / 3 - 8}
                  y={(centroid.y + A.y + P.y) / 3}
                  fill="#6aab7360"
                  fontSize={10}
                  fontFamily="monospace"
                >
                  AP
                </text>
                <text
                  x={(centroid.x + C.x + A.x) / 3 - 10}
                  y={(centroid.y + C.y + A.y) / 3 + 4}
                  fill="#88888860"
                  fontSize={10}
                  fontFamily="monospace"
                >
                  CA*
                </text>
              </svg>

              {/* Placed chip */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    key={active.name}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute font-mono text-xs px-2 py-1 rounded border font-semibold pointer-events-none"
                    style={{
                      left: ZONE_SNAP[active.mode].x,
                      top: ZONE_SNAP[active.mode].y,
                      transform: 'translate(-50%, -50%)',
                      borderColor: MODE_COLOR[active.mode],
                      color: MODE_COLOR[active.mode],
                      background: `${MODE_COLOR[active.mode]}22`,
                    }}
                  >
                    {active.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chip tray */}
            <div className="flex flex-wrap gap-2">
              {SYSTEMS.filter((s) => s.name !== active?.name).map((sys) => (
                <div
                  key={sys.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, sys)}
                  onDragEnd={handleDragEnd}
                  className="font-mono text-xs px-2.5 py-1.5 rounded border cursor-grab active:cursor-grabbing select-none transition-opacity"
                  style={{
                    borderColor: `${MODE_COLOR[sys.mode]}55`,
                    color: MODE_COLOR[sys.mode],
                    background: `${MODE_COLOR[sys.mode]}10`,
                    opacity: dragging === sys.name ? 0.35 : 1,
                  }}
                >
                  {sys.name}
                </div>
              ))}
              {active && (
                <button
                  onClick={reset}
                  className="font-mono text-xs px-2.5 py-1.5 rounded border border-surface-2 text-surface-3 hover:text-white hover:border-surface-3 transition-colors"
                >
                  reset
                </button>
              )}
            </div>

            {/* Mode label */}
            <AnimatePresence mode="wait">
              {mode && (
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="font-mono text-xs px-3 py-2 rounded border"
                  style={{
                    borderColor: `${MODE_COLOR[mode]}40`,
                    color: MODE_COLOR[mode],
                    background: `${MODE_COLOR[mode]}0e`,
                  }}
                >
                  {MODE_LABEL[mode]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: canvas + annotation as one centered unit (mirrors SlideContent layout) */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 min-w-0 min-h-0">
            {mode ? (
              <>
                <FitCanvas naturalWidth={CANVAS_W_CAP} naturalHeight={CANVAS_H_CAP}>
                  <div className="relative" style={{ width: CANVAS_W_CAP, height: CANVAS_H_CAP }}>
                    <AnimatedFlowCanvas
                      nodes={anim.nodes}
                      edges={anim.edges}
                      messages={anim.messages}
                      width={CANVAS_W_CAP}
                      height={CANVAS_H_CAP}
                    />
                    {/* Partition overlay */}
                    <AnimatePresence>
                      {anim.partition && (
                        <motion.svg
                          key="partition"
                          className="absolute inset-0 pointer-events-none"
                          width={CANVAS_W_CAP}
                          height={CANVAS_H_CAP}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <line
                            x1={PARTITION_X1}
                            y1={PARTITION_Y}
                            x2={CANVAS_W_CAP - 8}
                            y2={PARTITION_Y}
                            stroke="#f28b82"
                            strokeWidth={2}
                            strokeDasharray="8 4"
                          />
                          <text
                            x={PARTITION_X1 + 4}
                            y={PARTITION_Y - 6}
                            fill="#f28b82"
                            fontSize={9}
                            fontFamily="monospace"
                          >
                            ⚡ network partition
                          </text>
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </div>
                </FitCanvas>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={anim.annotation}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="font-mono text-base text-center max-w-lg shrink-0"
                    style={{ color: MODE_COLOR[mode] }}
                  >
                    {anim.annotation}
                  </motion.p>
                </AnimatePresence>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-lg border border-dashed border-surface-2">
                <p className="text-surface-3 font-mono text-sm">
                  drag a system chip onto the triangle
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}

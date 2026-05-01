import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  title: string
  annotation?: string
  caption?: ReactNode
  children: ReactNode
}

export function SlideContent({ title, annotation, caption, children }: Props) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-white text-center shrink-0 pb-4">{title}</h2>

      {/* Canvas + annotation centered together as one visual unit */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full overflow-hidden gap-4">
        {children}
        {annotation !== undefined && (
          <AnimatePresence mode="wait">
            <motion.p
              key={annotation}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-accent-blue text-base font-mono max-w-3xl text-center shrink-0"
            >
              {annotation}
            </motion.p>
          </AnimatePresence>
        )}
      </div>

      {/* Static caption pinned at bottom */}
      {caption != null && (
        <div className="shrink-0 text-center pt-2">
          {typeof caption === 'string' ? (
            <p className="text-sm text-surface-3 font-mono">{caption}</p>
          ) : (
            caption
          )}
        </div>
      )}
    </div>
  )
}

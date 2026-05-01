import { useFullscreen } from '../../hooks/useFullscreen'

export function FullscreenButton() {
  const { isFullscreen, toggle } = useFullscreen()

  return (
    <button
      onClick={toggle}
      className="text-xs text-surface-3 hover:text-text transition-colors px-2 py-1 rounded border border-surface-2 hover:border-surface-3 font-mono"
      title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
    >
      {isFullscreen ? '⊡' : '⛶'}
    </button>
  )
}

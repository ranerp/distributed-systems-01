import { useFullscreen } from '../../hooks/useFullscreen'

export function FullscreenButton() {
  const { isFullscreen, toggle } = useFullscreen()

  return (
    <button
      onClick={toggle}
      className="text-xs text-surface-3 hover:text-white transition-colors px-2 py-1 rounded border border-surface-3 hover:border-white"
      title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
    >
      {isFullscreen ? '⛶' : '⛶'}
    </button>
  )
}

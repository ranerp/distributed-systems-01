export function TitleSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
      <div className="text-accent-blue text-sm font-mono tracking-widest uppercase opacity-70">
        distributed systems
      </div>
      <h1 className="text-5xl font-bold text-white leading-tight">
        Messages, Clocks &<br />
        <span className="text-accent-blue">Distributed Chaos</span>
      </h1>
      <p className="text-surface-3 text-lg max-w-xl">
        Queues, patterns, race conditions, and why your patch events will eventually lie to you.
      </p>
      <div className="mt-8 text-xs text-surface-3 font-mono">
        ← → to navigate &nbsp;·&nbsp; F for fullscreen &nbsp;·&nbsp; step buttons for interactive
        slides
      </div>
    </div>
  )
}

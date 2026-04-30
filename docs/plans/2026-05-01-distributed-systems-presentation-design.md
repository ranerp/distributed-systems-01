# Distributed Systems Presentation — Design Document

**Date:** 2026-05-01  
**Author:** Senior Software Architect  
**Audience:** Engineers  
**Delivery:** Live presentation (presenter-controlled)

---

## Goal

An interactive React/TypeScript presentation on distributed systems concepts, with animated and step-by-step visualizations that make abstract ideas (race conditions, message routing, outbox pattern, etc.) visually concrete.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Build | Vite + TypeScript (strict) |
| UI framework | React |
| Diagrams | React Flow |
| Animation | Framer Motion |
| Styling | Tailwind CSS + shadcn/ui |
| Deployment | Static (GitHub Pages or CDN) |

---

## Coding Conventions

- Guard statements (early returns) over nested conditionals
- 150–350 lines per file
- No business logic in components — logic in hooks or utils
- One component does one thing
- Strict TypeScript throughout — no `any`
- Named exports

---

## Project Structure

```
src/
├── components/
│   ├── slides/           # One component per slide (render only)
│   ├── viz/              # Reusable visualization primitives
│   │   ├── ServiceNode.tsx
│   │   ├── MessageToken.tsx
│   │   ├── LatencyBar.tsx
│   │   └── StepControls.tsx
│   └── layout/
│       ├── SlideLayout.tsx
│       ├── ChapterLabel.tsx
│       └── FullscreenButton.tsx
├── hooks/
│   ├── useSlideNavigation.ts
│   ├── useSteppedAnimation.ts   # Generic step state machine
│   ├── useAutoPlay.ts
│   └── useFullscreen.ts
├── data/
│   └── slides.ts                # Ordered slide registry (type-safe)
├── types/
│   └── index.ts
├── utils/
│   └── animation.ts
└── main.tsx
```

---

## Slide Registry Type

```ts
type SlideConfig = {
  id: string
  chapter: string
  component: React.ComponentType
  isInteractive: boolean
}
```

Slides are lazy-loaded via `React.lazy`. `SlideLayout` wraps every slide and renders chapter label, slide counter, step controls (when `isInteractive`), and fullscreen button.

---

## Slide Content Outline

### Chapter 1 — Message Brokers
1. Title slide
2. What is a message broker? RabbitMQ vs Kafka vs Azure Service Bus — comparison table
3. **[Auto-play]** Basic producer → queue → consumer flow
4. **[Step-by-step]** Competing consumers — one queue, multiple consumers, watch work distribution
5. **[Step-by-step]** Consumer groups (Kafka) — same message fans out to all groups, one consumer per partition within group
6. FIFO guarantees — when you get them, when you don't

### Chapter 2 — Failure & Ordering Problems
7. **[Step-by-step]** In-flight messages — what happens on crash before ack
8. **[Step-by-step]** Out-of-order delivery — why it happens, consequences
9. **[Step-by-step]** Race condition — two services, one shared resource, dirty write
10. Exponential backoff — why linear retry hammers a degraded system (animated graph)

### Chapter 3 — Patterns That Fix Things
11. **[Step-by-step]** Outbox pattern — dual-write problem shown, then the fix side-by-side
12. **[Step-by-step]** Saga pattern — choreography vs orchestration, compensating transactions
13. Logical clocks — why wall time fails, Lamport timestamps

### Chapter 4 — Architecture
14. **[Auto-play]** Patch vs snapshot — mirror service receives partial update, state drift
15. **[Auto-play]** Modular monolith — in-memory (nanoseconds) vs service API calls (milliseconds), animated latency bars
16. When microservices make sense (and when they don't)
17. Summary / key takeaways

---

## Key Visualizations

### React Flow Topology
Used by: competing consumers, consumer groups, outbox, saga.  
- `<FlowDiagram>` takes nodes/edges as props (defined in hook, not component)
- Edges animate via React Flow `animated` prop toggled per step
- Custom `ServiceNode`: label + icon (producer, queue, consumer, database)
- Message tokens (colored circles) travel edges via Framer Motion tied to current step

### Race Condition (step-by-step, 6 steps)
`useRaceConditionSteps` — two services both read `X=1`, both compute `X+1`, both write `X=2`. Second write silently clobbers first. Final step highlights lost update in red. Positioned divs + Framer Motion (no React Flow needed).

### Outbox Pattern (step-by-step)
Two flows side by side: broken dual-write (DB succeeds, broker fails → inconsistency) vs fixed (single DB transaction writes data + outbox row, relay publishes). Steps advance both flows in parallel for contrast.

### Latency Bars (auto-play)
Two bars fill on slide entry — in-memory fills in ~100ms (nanoseconds label), network API takes 2s to fill (milliseconds label). Framer Motion width animation.

### Exponential Backoff (auto-play)
Timeline of retry attempts with exponentially growing gaps. Framer Motion `staggerChildren`.

---

## Navigation & Slide Engine

`useSlideNavigation` owns all state: current index, next, prev, go-to.  
Keyboard: `ArrowLeft`, `ArrowRight`, `f` (fullscreen) — registered in one `useEffect` with cleanup.  
Transitions: Framer Motion `AnimatePresence` — fade + slide-up on enter, fade on exit.

### Generic Step Hook

```ts
// useSteppedAnimation.ts
// Returns step state machine — all interactive slides use this
function useSteppedAnimation(totalSteps: number): {
  currentStep: number
  next: () => void
  reset: () => void
  isLast: boolean
}
```

---

## No Backend

Pure static app. No server, no database. Deploy to GitHub Pages or any CDN.

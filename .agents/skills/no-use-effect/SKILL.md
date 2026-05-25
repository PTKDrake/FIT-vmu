---
name: no-use-effect
description: |
  Enforce the no-useEffect rule when writing or reviewing React code.
  Activate when creating React components, refactoring existing useEffect calls,
  reviewing code that introduces useEffect, or wiring browser-only synchronization.
---

# No useEffect

Never call `useEffect` directly in this repository. Use derived values, event handlers, data-fetching primitives, or `useMountEffect` instead.

## Workflow

1. Identify what the effect is doing.
2. Replace it with the matching pattern from `references/patterns.md`.
3. Use `useMountEffect` only for true mount-only external synchronization.
4. Verify with `pnpm lint`, targeted oxlint, and any focused test covering the component.

## Escape Hatch

`web/hooks/use-mount-effect.ts` is the only allowed place that uses direct `useEffect` semantics. Reach for it only when the lifecycle is genuinely mount/unmount driven.

# Frontend Overview

Frontend code lives in `web/` and is rendered through Inertia.

## Stack

- React 19
- Inertia v3
- Tailwind CSS v4
- shadcn/ui components
- Wayfinder-generated route helpers

## Rules

- Keep the app Inertia-based. Do not introduce a separate SPA router.
- Use `pnpm` for frontend dependency and script execution.
- Use shadcn/ui and local UI primitives as the default component system.
- Keep Tailwind as the styling authority through semantic tokens and shared CSS variables.
- Do not use direct `useEffect` in project code.
- Use Wayfinder helpers from `@/actions/...` or `@/routes/...` instead of hardcoded URLs.

## Source Layout

- `web/pages/` for Inertia page components
- `web/components/` for reusable UI
- `web/layouts/` for shared page layouts
- `web/hooks/` for shared hooks
- `web/routes/` and `web/actions/` for generated Wayfinder bindings

## Frontend Verification

- `pnpm lint`
- `pnpm typecheck`
- `pnpm typecheck:tsc` when needed
- `pnpm build`
- `pnpm check` before handoff when the environment allows it

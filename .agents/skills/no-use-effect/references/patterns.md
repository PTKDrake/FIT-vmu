# No useEffect Patterns

## Rule 1: Derive state, do not sync it

If state can be computed from props or other state, compute it inline instead of `useEffect(() => setState(...))`.

## Rule 2: Use data-fetching primitives

Do not fetch in effects just to push the result into state. Use the project's request/data layer or Inertia-driven props.

## Rule 3: Use event handlers for user actions

If the work starts from a click, submit, or keyboard action, do it in the handler instead of toggling state so an effect can react later.

## Rule 4: Use `useMountEffect` for mount-only external sync

Valid cases: DOM integration, subscriptions, browser APIs, or third-party widgets that naturally attach on mount and clean up on unmount.

## Rule 5: Reset with `key`, not dependency choreography

If a component should behave like a fresh instance when an identifier changes, remount it with a `key` instead of using an effect to manually reset local state.

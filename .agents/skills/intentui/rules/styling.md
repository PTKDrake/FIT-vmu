# Styling Rules

Intent UI uses a semantic color-token system built on top of Tailwind v4. Always use semantic tokens — never raw Tailwind colors. Compose class names with the right utility depending on the element type.

## NEVER use raw Tailwind colors

Never use raw Tailwind color utilities. This includes ANY color from: `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `slate`, `gray`, `zinc`, `neutral`, `stone`.

### Forbidden patterns

```
❌ text-blue-500, text-red-600, text-gray-400, text-green-500
❌ bg-blue-500, bg-red-100, bg-gray-50, bg-slate-200
❌ border-blue-500, border-gray-300, border-red-200
❌ ring-blue-500, ring-red-500
❌ from-blue-500, to-red-500, via-green-500
❌ divide-gray-200, placeholder-gray-400
❌ shadow-blue-500/50
```

Raw colors break the theme system, are not dark-mode aware, and defeat accessibility tokens. Replace every occurrence with a semantic token.

## Semantic color tokens

### Text colors

| For | Use |
|---|---|
| Default text | `text-fg` |
| Muted / secondary text | `text-muted-fg` |
| Primary colored text | `text-primary` |
| Primary subtle text | `text-primary-subtle-fg` |
| Success text | `text-success` or `text-success-subtle-fg` |
| Danger / error text | `text-danger` or `text-danger-subtle-fg` |
| Warning text | `text-warning` or `text-warning-subtle-fg` |
| Info text | `text-info` or `text-info-subtle-fg` |
| Foreground on primary bg | `text-primary-fg` |
| Foreground on secondary bg | `text-secondary-fg` |
| Foreground on overlay bg | `text-overlay-fg` |
| Foreground on accent bg | `text-accent-fg` |
| Foreground on navbar bg | `text-navbar-fg` |
| Foreground on sidebar bg | `text-sidebar-fg` |

### Background colors

| For | Use |
|---|---|
| Page background | `bg-bg` |
| Primary background | `bg-primary` |
| Secondary background | `bg-secondary` |
| Muted background | `bg-muted` |
| Accent background | `bg-accent` |
| Overlay / modal background | `bg-overlay` |
| Success background | `bg-success` or `bg-success-subtle` |
| Danger background | `bg-danger` or `bg-danger-subtle` |
| Warning background | `bg-warning` or `bg-warning-subtle` |
| Info background | `bg-info` or `bg-info-subtle` |

### Border & ring colors

| For | Use |
|---|---|
| Default border | `border-border` |
| Input border | `border-input` |
| Focus ring | `ring-ring` |

### Full list of semantic tokens

The following tokens are defined in the theme. Each is usable as `text-*`, `bg-*`, `border-*`, `ring-*`, or in CSS via `var(--color-<token>)`:

- `primary`, `primary-fg`, `primary-subtle`, `primary-subtle-fg`
- `secondary`, `secondary-fg`
- `accent`, `accent-fg`
- `success`, `success-fg`, `success-subtle`, `success-subtle-fg`
- `danger`, `danger-fg`, `danger-subtle`, `danger-subtle-fg`
- `warning`, `warning-fg`, `warning-subtle`, `warning-subtle-fg`
- `info`, `info-fg`, `info-subtle`, `info-subtle-fg`
- `muted`, `muted-fg`
- `overlay`, `overlay-fg`
- `navbar`, `navbar-fg`
- `sidebar`, `sidebar-fg`, `sidebar-primary`, `sidebar-primary-fg`, `sidebar-accent`, `sidebar-accent-fg`, `sidebar-border`, `sidebar-ring`
- `bg`, `fg`, `border`, `input`, `ring`
- `chart-1`, `chart-2`, `chart-3`, `chart-4`, `chart-5`

## CSS variable access

You can access any semantic token directly in custom CSS or arbitrary values via `var(--color-<token>)`:

```tsx
<div style={{ color: "var(--color-primary)" }} />
<div className="bg-[var(--color-success-subtle)]" />
```

For color-mix or overlays, combine with `color-mix()`:

```tsx
<div className="bg-[color-mix(in_oklab,var(--color-primary)_10%,var(--color-bg)_90%)]" />
```

## Tailwind shorthand utilities

When `width` and `height` have the same value, always use the `size-*` shorthand instead of writing both `w-*` and `h-*`.

```tsx
// ✅ Correct
<div className="size-5" />
<Avatar className="size-10" />
<span className="size-8 rounded-full" />

// ❌ Wrong — use size-* when width and height are equal
<div className="w-5 h-5" />
<Avatar className="w-10 h-10" />
<span className="h-8 w-8 rounded-full" />
```

This also applies to arbitrary values:

```tsx
// ✅ size-[32px]
// ❌ w-[32px] h-[32px]
```

## Class name utilities — `cx`, `twMerge`, `twJoin`

Use the right utility depending on the element:

- **`cx`** from `@/lib/primitive` — for `react-aria-components` that need `composeRenderProps`. Use on any Intent UI primitive (`Button`, `TextField`, `Select`, etc.) and any wrapper you pass to `composeRenderProps`.
- **`twMerge`** from `tailwind-merge` — for regular HTML elements (`div`, `p`, `span`, `strong`, `code`, etc.) where you want conflict resolution.
- **`twJoin`** from `tailwind-merge` — when you just need to join classes without conflict resolution (conditional classes).

```tsx
// ✅ cx — for react-aria components
import { cx } from "@/lib/primitive"
import { Button as ButtonPrimitive } from "react-aria-components"

<ButtonPrimitive className={cx("base-classes", className)} />

// ✅ twMerge — for regular HTML elements
import { twMerge } from "tailwind-merge"

<p className={twMerge("text-base/6 text-muted-fg sm:text-sm/6", className)} />
<strong className={twMerge("font-medium", className)} />
<code className={twMerge("rounded-sm border bg-muted px-0.5", className)} />

// ✅ twJoin — when no class conflicts, just joining
import { twJoin } from "tailwind-merge"

<div className={twJoin("flex items-center", isActive && "bg-accent")} />

// ❌ Wrong — never use these
import { cn } from "@/lib/utils"
import clsx from "clsx"
import classNames from "classnames"
```

When in doubt: prefer `cx` inside Intent UI components, `twMerge` on plain HTML in your pages, and `twJoin` for conditional class lists that don't conflict.

## Variant naming — use `intent`

Use `intent` for color variant props, never `variant` or `color`.

```tsx
// ✅ Correct
<Button intent="primary">Save</Button>
<Badge intent="danger">Error</Badge>
<Note intent="warning">Careful</Note>

// ❌ Wrong
<Button variant="primary">Save</Button>
<Badge color="danger">Error</Badge>
```

Available `intent` values on most components: `primary`, `secondary`, `warning`, `danger`, `success`, `outline`, `plain`. Some components (e.g. `Badge`, `Note`) also support `info`.

## Component styling with tailwind-variants

When building or extending Intent UI components, use `tv` from `tailwind-variants` for variant styles:

```tsx
import { tv } from "tailwind-variants"

const styles = tv({
  base: "...",
  variants: {
    intent: {
      primary: "...",
      danger: "...",
    },
    size: {
      sm: "...",
      md: "...",
      lg: "...",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
})

export function MyComponent({ intent, size, className, ...props }) {
  return <div className={cx(styles({ intent, size }), className)} {...props} />
}
```

Use array-form base styles for readability, and keep CSS-variable tokens consistent with the semantic token list above.

## Dark mode

Intent UI tokens resolve differently in light and dark mode automatically. Do **not** add `dark:bg-gray-900` or similar raw color overrides. The semantic tokens already switch. If a component needs a different behavior in dark mode, prefer:

```tsx
// ✅ Token already adapts to dark mode
<div className="bg-primary text-primary-fg" />

// ✅ For forced schemes, use Tailwind v4's scheme-* utilities
<div className="dark:scheme-dark" />
```

## Key patterns

1. **Never use raw Tailwind color classes** — always use semantic tokens (`text-fg`, `bg-primary`, `border-border`, `ring-ring`).
2. **Use `size-*` shorthand** when width equals height.
3. **Use `cx` for react-aria components, `twMerge` for plain HTML, `twJoin` for conditional lists.** Never use `cn`, `clsx`, or `classNames`.
4. **Use `intent` for color variants**, not `variant` or `color`.
5. **Use `tv` from `tailwind-variants`** when building or extending Intent UI components.
6. **Rely on tokens for dark mode** — do not add raw `dark:*` color overrides.
7. **Access tokens in CSS** via `var(--color-<token>)` when you need arbitrary values.

# Icons Rules

Intent UI uses [Heroicons](https://heroicons.com/) (`@heroicons/react`) as its icon library. Icons integrate with Intent UI components in a very specific way — the component's internal CSS handles sizing and color automatically. Follow these rules to avoid broken layouts or doubled sizing.

## Heroicons import

Always import from one of the Heroicons sub-paths:

```tsx
// Outline (default) — 24×24 stroke icons
import { Cog6ToothIcon } from "@heroicons/react/24/outline"

// Solid — 24×24 filled icons
import { CheckCircleIcon } from "@heroicons/react/24/solid"

// Mini — 20×20 solid icons
import { PlusIcon } from "@heroicons/react/20/solid"

// Micro — 16×16 solid icons
import { ChevronDownIcon } from "@heroicons/react/16/solid"
```

Prefer `24/outline` for most UI chrome. Use `20/solid` (mini) for small controls like buttons at `size="xs"` or inside dense tables. Use `16/solid` (micro) only when the icon must fit inside tight inline text.

## Never set size classes on icons inside Intent UI components

Intent UI components (`Button`, `Link`, `Badge`, `Avatar`, `Note`, `MenuItem`, `DropdownItem`, etc.) use internal selectors like `*:[svg]:size-5` and `*:[svg]:text-(--btn-icon)` to size and color icons automatically. Do **not** add your own `size-*`, `w-*`, `h-*`, or color classes to the icon element.

```tsx
import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Note } from "@/components/ui/note"

// ✅ Correct — icon inherits size and color from Button
<Button intent="danger">
  <Cog6ToothIcon /> Settings
</Button>

// ✅ Correct — icon sized automatically by Badge
<Badge intent="success">
  <CheckCircleIcon /> Verified
</Badge>

// ✅ Correct — Note controls the icon size
<Note intent="warning">
  <ExclamationTriangleIcon /> Careful with this action.
</Note>

// ❌ Wrong — manual size class conflicts with component styling
<Button>
  <Cog6ToothIcon className="size-5" /> Settings
</Button>

// ❌ Wrong — manual color overrides component intent color
<Button intent="danger">
  <Cog6ToothIcon className="text-red-500" /> Settings
</Button>
```

## Components that control icon sizing

These Intent UI components apply their own size/color to child SVGs — do not override:

`Button`, `ButtonGroup`, `Toggle`, `ToggleGroup`, `Badge`, `Note`, `Avatar`, `Link`, `MenuItem`, `DropdownItem`, `DropdownMenu`, `ContextMenu`, `SelectItem`, `ComboBoxItem`, `ListBoxItem`, `SidebarItem`, `NavbarItem`, `Breadcrumbs`, `Pagination`, `Tabs`, `Snackbar` / `Toast`, `CommandMenu`, `ChoiceBox`, `Checkbox` (check indicator), `Radio` (dot indicator), `ProgressCircle`, `Snippet`.

## Icons inside InputGroup — use `data-slot="icon"`

The **one exception** is `InputGroup` from `@/components/ui/input`. When you place a leading or trailing icon inside an `InputGroup`, the icon must carry `data-slot="icon"` so `InputGroup`'s CSS can position it absolutely and add gutter padding to the input.

Heroicons components forward `data-*` attributes, but they do **not** add `data-slot="icon"` by default. You must add it yourself, or wrap the icon in a `<span data-slot="icon">`.

```tsx
import { EnvelopeIcon } from "@heroicons/react/24/outline"
import { Input, InputGroup } from "@/components/ui/input"

// ✅ Correct — data-slot="icon" positions the icon and adjusts input padding
<InputGroup>
  <EnvelopeIcon data-slot="icon" />
  <Input type="email" />
</InputGroup>

// ✅ Also correct — wrapping span carries the slot
<InputGroup>
  <span data-slot="icon">
    <EnvelopeIcon />
  </span>
  <Input type="email" />
</InputGroup>

// ❌ Wrong — without data-slot="icon" the icon overlaps the input text
<InputGroup>
  <EnvelopeIcon />
  <Input type="email" />
</InputGroup>
```

## Standalone icons (outside Intent UI components)

When you render an icon by itself (for example, inside a custom wrapper or inline with text), you **must** set size and color yourself:

```tsx
import { SparklesIcon } from "@heroicons/react/24/outline"

// ✅ Standalone — size and color set explicitly
<SparklesIcon className="size-5 text-muted-fg" />

// ✅ Inside plain text
<Text>
  Press <SparklesIcon className="inline size-4" /> to generate.
</Text>
```

## No `data-slot="icon"` outside InputGroup

Do **not** add `data-slot="icon"` to icons placed inside `Button`, `Badge`, `MenuItem`, `Sidebar`, or any other Intent UI component. Those components target `*:[svg]` directly. Adding `data-slot="icon"` there has no benefit and may conflict with future component styles.

```tsx
// ❌ Wrong — Button does not need data-slot="icon"
<Button>
  <Cog6ToothIcon data-slot="icon" /> Settings
</Button>

// ✅ Correct
<Button>
  <Cog6ToothIcon /> Settings
</Button>
```

## Custom SVG icons

If you need an icon that Heroicons does not provide, create it as a small component that forwards `className`. This lets it be sized by parent components the same way Heroicons are.

```tsx
// src/components/icons/brand-x-icon.tsx
import type { SVGProps } from "react"

export function BrandXIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="..." />
    </svg>
  )
}
```

Then use it like any other icon:

```tsx
import { BrandXIcon } from "@/components/icons/brand-x-icon"
import { Button } from "@/components/ui/button"

<Button size="sq-md">
  <BrandXIcon />
</Button>
```

## Key patterns

1. Use **Heroicons** (`@heroicons/react`) as the default icon library.
2. Inside Intent UI components: **do not set `size-*`, `w-*`, `h-*`, or color classes** on the icon.
3. Inside `InputGroup`: add `data-slot="icon"` to leading/trailing icons (or wrap them in a `<span data-slot="icon">`).
4. Outside Intent UI components: set `className="size-N text-..."` explicitly.
5. Do **not** add `data-slot="icon"` to icons placed inside `Button`, `Badge`, `MenuItem`, etc.
6. Custom SVG icons should forward `className` and `aria-hidden="true"` so parent components can size them.

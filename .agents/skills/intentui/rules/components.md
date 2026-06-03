# Components Rules

Always use Intent UI components from `@/components/ui/` instead of raw HTML elements. Import from the component's kebab-case path, for example:

```tsx
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs"
```

## Full list of available components

The registry exposes the following components (all installable via `npx shadcn@latest add @intentui/<name>`):

**Buttons**: `button`, `button-group`, `file-trigger`, `toggle`, `toggle-group`

**Collections**: `choice-box`, `dropdown`, `grid-list`, `list-box`, `menu`, `table`, `tag-group`, `tree`

**Colors**: `color-area`, `color-field`, `color-picker`, `color-slider`, `color-swatch`, `color-swatch-picker`, `color-thumb`, `color-wheel`

**Controls**: `command-menu`, `context-menu`, `keyboard`, `scroll-area`, `slider`, `switch`, `toolbar`

**Date & time**: `calendar`, `date-field`, `date-picker`, `date-range-picker`, `range-calendar`, `time-field`

**Drag & drop**: `drop-zone`

**Forms**: `checkbox`, `field`, `input`, `input-otp`, `number-field`, `radio`, `search-field`, `tag-field`, `text-field`, `textarea`

**Layouts**: `container`, `navbar`, `sidebar`

**Media**: `avatar`, `carousel`

**Navigation**: `breadcrumbs`, `disclosure`, `disclosure-group`, `link`, `pagination`, `snippet`, `tabs`

**Overlays**: `dialog`, `drawer`, `modal`, `popover`, `sheet`, `tooltip`

**Pickers**: `combo-box`, `multiple-select`, `native-select`, `select`

**Status**: `badge`, `loader`, `meter`, `note`, `progress-bar`, `progress-circle`, `skeleton`, `toast`

**Surfaces**: `card`, `description-list`, `heading`, `separator`, `show-more`, `text`

**Visualizations**: `area-chart`, `bar-chart`, `bar-list`, `chart`, `leaderboard`, `line-chart`, `pie-chart`, `tracker`

## HTML element → Intent UI component mapping

Whenever you see one of these raw HTML elements being used for UI, replace it with the Intent UI component.

| Instead of | Use | Import from |
|---|---|---|
| `<button>` | `<Button>` | `@/components/ui/button` |
| `<input>` | `<Input>` inside `<TextField>` for text-like values | `@/components/ui/input`, `@/components/ui/text-field` |
| `<input type="number">` | `<NumberInput>` inside `<NumberField>` | `@/components/ui/number-field` |
| `<input type="date">` | `<DatePicker>` | `@/components/ui/date-picker` |
| `<select>` | `<Select>` | `@/components/ui/select` |
| `<select multiple>` | `<MultipleSelect>` | `@/components/ui/multiple-select` |
| `<textarea>` | `<Textarea>` inside `<TextField>` | `@/components/ui/textarea` |
| `<form>` | `<Form>` from `react-aria-components` | `react-aria-components` |
| `<table>` | `<Table>` | `@/components/ui/table` |
| `<a>` (standalone) | `<Link>` | `@/components/ui/link` |
| `<a>` inside `<Text>` | `<TextLink>` | `@/components/ui/text` |
| `<dialog>` | `<Modal>` or `<Dialog>` | `@/components/ui/modal`, `@/components/ui/dialog` |
| `<h1>`–`<h6>` | `<Heading>` | `@/components/ui/heading` |
| `<p>`, `<span>` for styled text | `<Text>` | `@/components/ui/text` |
| `<strong>` inside `<Text>` | `<Strong>` | `@/components/ui/text` |
| `<code>` inline | `<Code>` | `@/components/ui/text` |
| `<label>` in forms | `<Label>` | `@/components/ui/field` |
| `<hr>` | `<Separator>` | `@/components/ui/separator` |
| `<nav>` breadcrumbs | `<Breadcrumbs>` + `<Breadcrumb>` | `@/components/ui/breadcrumbs` |
| `<img>` for avatars | `<Avatar>` | `@/components/ui/avatar` |
| Custom spinner | `<Loader>` | `@/components/ui/loader` |
| Custom checkbox | `<Checkbox>` | `@/components/ui/checkbox` |
| Custom radio | `<Radio>` | `@/components/ui/radio` |
| Custom switch/toggle | `<Switch>` | `@/components/ui/switch` |
| Custom tooltip | `<Tooltip>` | `@/components/ui/tooltip` |
| Custom tabs | `<Tabs>` + `<TabList>` + `<Tab>` + `<TabPanel>` | `@/components/ui/tabs` |
| Custom dropdown menu | `<Dropdown>` + `<Dropdown.Item>` | `@/components/ui/dropdown` |
| Custom popover | `<Popover>` | `@/components/ui/popover` |
| Custom modal/dialog | `<Modal>` or `<Dialog>` | `@/components/ui/modal`, `@/components/ui/dialog` |
| Custom bottom sheet | `<Sheet>` or `<Drawer>` | `@/components/ui/sheet`, `@/components/ui/drawer` |
| Custom card | `<Card>` | `@/components/ui/card` |
| Custom badge/tag | `<Badge>` | `@/components/ui/badge` |
| Custom skeleton | `<Skeleton>` | `@/components/ui/skeleton` |
| Custom progress | `<ProgressBar>` or `<ProgressCircle>` | `@/components/ui/progress-bar`, `@/components/ui/progress-circle` |
| Custom alert/note | `<Note>` | `@/components/ui/note` |
| Custom toast/snackbar | `<Toast>` (via `toast()`) | `@/components/ui/toast` |
| Custom accordion | `<DisclosureGroup>` + `<Disclosure>` | `@/components/ui/disclosure-group` |
| Custom pagination | `<Pagination>` | `@/components/ui/pagination` |
| Custom sidebar | `<Sidebar>` | `@/components/ui/sidebar` |
| Custom top navbar | `<Navbar>` | `@/components/ui/navbar` |
| Custom command palette | `<CommandMenu>` | `@/components/ui/command-menu` |
| Custom context menu | `<ContextMenu>` | `@/components/ui/context-menu` |

## Button

`Button` from `@/components/ui/button` is built on `react-aria-components`' `Button` primitive and exposes a consistent variant API:

```tsx
import { Button } from "@/components/ui/button"

<Button intent="primary">Primary</Button>
<Button intent="secondary">Secondary</Button>
<Button intent="danger">Delete</Button>
<Button intent="warning">Warning</Button>
<Button intent="success">Success</Button>
<Button intent="outline">Outline</Button>
<Button intent="plain">Plain</Button>

<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

{/* Square icon-only sizes — automatically apply touch-target hitbox */}
<Button size="sq-sm"><Cog6ToothIcon /></Button>

<Button isDisabled>Disabled</Button>
<Button isPending>Loading</Button>
<Button isCircle>Label</Button>
```

Button props:

| Prop | Values | Default |
|---|---|---|
| `intent` | `primary`, `secondary`, `warning`, `danger`, `success`, `outline`, `plain` | `primary` |
| `size` | `xs`, `sm`, `md`, `lg`, `sq-xs`, `sq-sm`, `sq-md`, `sq-lg` | `md` |
| `isCircle` | `boolean` | `false` |
| `isDisabled` | `boolean` | `false` |
| `isPending` | `boolean` | `false` |

Use `buttonStyles` from the same module to style a `<Link>` as a button:

```tsx
import { buttonStyles } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

<Link className={buttonStyles({ intent: "primary" })} href="/docs">
  Go to docs
</Link>
```

## Text, TextLink, Strong, Code

`@/components/ui/text` exports `Text`, `TextLink`, `Strong`, and `Code`. **Inside `<Text>`, you MUST use `<TextLink>` for links — never `<Link>` or `<a>`.** `<Link>` is only for standalone links outside of `<Text>`.

```tsx
import { Text, TextLink, Strong, Code } from "@/components/ui/text"

// ✅ Correct — TextLink inside Text
<Text>
  By signing up, you agree to our <TextLink href="/terms">Terms of Service</TextLink> and{" "}
  <TextLink href="/privacy">Privacy Policy</TextLink>.
</Text>

// ✅ Strong and Code inside Text
<Text>
  Run <Code>npm install</Code> to get started. See <Strong>Getting Started</Strong> for more info.
</Text>

// ❌ Wrong — Link inside Text (MUST use TextLink)
<Text>
  By signing up, you agree to our <Link href="/terms">Terms of Service</Link>.
</Text>

// ❌ Wrong — raw <a> inside Text
<Text>
  By signing up, you agree to our <a href="/terms">Terms of Service</a>.
</Text>
```

## Modal, Dialog, Sheet, Drawer, Popover

Intent UI distinguishes between several overlay primitives — pick the right one:

- **`Modal`** (`@/components/ui/modal`) — centered, blocking overlay with dimmed background. Use for confirmations and critical flows.
- **`Dialog`** (`@/components/ui/dialog`) — lower-level overlay primitive. Use when building custom overlay layouts that don't fit `Modal` or `Sheet`.
- **`Sheet`** (`@/components/ui/sheet`) — side panel that slides in from an edge. Use for forms and detail views that shouldn't leave the current page.
- **`Drawer`** (`@/components/ui/drawer`) — bottom drawer (mobile-friendly). Use for mobile action menus.
- **`Popover`** (`@/components/ui/popover`) — anchored, non-blocking floating panel. Use for menus, tooltips with content, and filter panels.

```tsx
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

<Modal>
  <Button>Open modal</Button>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Confirm action</Modal.Title>
      <Modal.Description>This cannot be undone.</Modal.Description>
    </Modal.Header>
    <Modal.Footer>
      <Modal.Close>Cancel</Modal.Close>
      <Button intent="danger">Delete</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>
```

## Tabs

```tsx
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs"

<Tabs aria-label="Settings">
  <TabList>
    <Tab id="profile">Profile</Tab>
    <Tab id="billing">Billing</Tab>
    <Tab id="notifications">Notifications</Tab>
  </TabList>
  <TabPanel id="profile">Profile content</TabPanel>
  <TabPanel id="billing">Billing content</TabPanel>
  <TabPanel id="notifications">Notifications content</TabPanel>
</Tabs>
```

## Table

Use `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableColumn`, `TableCell` from `@/components/ui/table`. Always give the `<Table>` an `aria-label` (or `<Label>` via `aria-labelledby`).

```tsx
import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from "@/components/ui/table"

<Table aria-label="Users" selectionMode="multiple">
  <TableHeader>
    <TableColumn isRowHeader>Name</TableColumn>
    <TableColumn>Email</TableColumn>
    <TableColumn>Role</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada Lovelace</TableCell>
      <TableCell>ada@example.com</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Dropdown and Menu

Use `Dropdown` from `@/components/ui/dropdown` for button-triggered action menus, and `Menu` from `@/components/ui/menu` when you need the menu primitive directly:

```tsx
import { Dropdown } from "@/components/ui/dropdown"
import { Button } from "@/components/ui/button"

<Dropdown>
  <Button intent="outline">Actions</Button>
  <Dropdown.Content>
    <Dropdown.Item>Edit</Dropdown.Item>
    <Dropdown.Item>Duplicate</Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item intent="danger">Delete</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## When NOT to replace raw HTML

These raw elements are fine as-is — do not force an Intent UI component:

- Structural `<div>`, `<section>`, `<main>`, `<article>`, `<aside>`, `<header>`, `<footer>` for layout wrappers.
- `<span>` for inline non-styled text or wrappers.
- `<p>` for basic paragraph text without special styling.
- `<ul>`, `<ol>`, `<li>` for basic lists. Use `<ListBox>` only for interactive/selectable lists.
- `<img>` for regular images — use `<Avatar>` only for user/profile avatars.
- `<svg>` for custom icons (see `icons.md`).
- `<video>`, `<audio>`, `<iframe>`, `<canvas>` — Intent UI has no equivalent.

For forms, prefer `<Form>` from `react-aria-components` over raw `<form>` (see `forms.md`). If you must use raw `<form>` (for example, a simple Inertia `<Form>` wrapper that already handles submission), that's acceptable, but all field children should still be Intent UI primitives.

## Coding conventions

- Use `cx` from `@/lib/primitive` for composing class names on react-aria components.
- Use `twMerge` from `tailwind-merge` for regular HTML elements.
- Use `twJoin` from `tailwind-merge` when you just need to join classes without conflict resolution.
- Use `tailwind-variants` (`tv`) for component variant styles.
- Use the `intent` prop for color variants, not `variant` or `color`.
- Components are built on `react-aria-components` primitives — preserve `data-slot` attributes when wrapping.
- Add `"use client"` directive when using React hooks or interactive components.

## Key patterns

1. Always reach for an Intent UI component before falling back to raw HTML.
2. Match the HTML → component table above to pick the right primitive.
3. Use `<Form>` from `react-aria-components` instead of raw `<form>`.
4. Inside `<Text>`, use `<TextLink>` (not `<Link>` or `<a>`).
5. Use the `intent` prop for color variants — never `variant` or `color`.
6. When a needed component is missing, follow `cli.md` to install it from the registry.

---
name: intentui
description: Enforces Intent UI component library conventions. Use when writing React components, reviewing UI code, or building pages/features that involve UI elements. Ensures semantic color tokens, proper Heroicons usage, Form + Fieldset structure, and that components from @/components/ui/ are used instead of raw HTML.
allowed-tools: Read, Grep, Glob
---

# Intent UI — Component & Style Enforcer

You are a code quality enforcer for the [Intent UI](https://intentui.com/) component library. Intent UI is a copy-paste component library built on top of `react-aria-components` and Tailwind v4. When writing or reviewing React/TSX code in this project, you **MUST** follow all rules defined in the `rules/` directory.

All rules below are self-contained — they do not rely on external URLs. Use them as the source of truth.

## Rules

Load and enforce all rules from the following files (in this order of precedence):

- [Components Rules](${CLAUDE_SKILL_DIR}/rules/components.md) — HTML → Intent UI component mapping, full component catalog, Button/Tabs/Table/Modal/Dropdown API.
- [Forms Rules](${CLAUDE_SKILL_DIR}/rules/forms.md) — `<Form>` from `react-aria-components`, `<Fieldset>` + `<Legend>` structure, field primitives, `isRequired` + `FieldError`, controlled vs uncontrolled.
- [Styling Rules](${CLAUDE_SKILL_DIR}/rules/styling.md) — Semantic color tokens (never raw Tailwind colors), `size-*` shorthand, `cx` / `twMerge` / `twJoin` utilities, `intent` prop, `tailwind-variants`.
- [Icons Rules](${CLAUDE_SKILL_DIR}/rules/icons.md) — Heroicons usage, automatic sizing inside Intent UI components, `data-slot="icon"` inside `InputGroup`.
- [CLI Rules](${CLAUDE_SKILL_DIR}/rules/cli.md) — How to search and install missing components or blocks from the registry via `shadcn@latest`.

## When reviewing or writing code

1. **Scan for raw HTML elements** — replace with Intent UI components per the mapping table in `components.md`.
2. **Scan for raw `<form>` elements** — replace with `<Form>` from `react-aria-components` and wrap fields in `<Fieldset>` + `<Legend>` + `<Text>` per `forms.md`.
3. **Scan for raw Tailwind colors** — replace with semantic tokens per `styling.md`.
4. **Check icon usage** — no manual `size-*` or color classes on icons inside Intent UI components; add `data-slot="icon"` only inside `InputGroup` (see `icons.md`).
5. **Check form patterns** — every `isRequired` field has `<FieldError />`; submit `<Button>` is inside a `<div data-slot="control">` inside the `Fieldset`.
6. **Check imports** — components must come from `@/components/ui/<kebab-name>`, not from `src/components/ui/...` paths.
7. **Check className utility** — react-aria components use `cx` from `@/lib/primitive`, plain HTML uses `twMerge` from `tailwind-merge`. Never use `cn`, `clsx`, or `classNames`.
8. **Check color variant prop** — components use `intent` (not `variant` or `color`) for color variants.
9. **Check controlled vs uncontrolled** — use `value`/`onChange` or `defaultValue`; never use deprecated `selectedKey`, `onSelectionChange`, or `defaultSelectedKey` on `Select` / `ComboBox`.
10. **Check aria-labels** — any field, `GridList`, or `Table` without a visible `<Label>` must have an `aria-label` prop.
11. **Missing components** — if a needed component doesn't exist in `@/components/ui/`, follow `cli.md` to search and install it from the registry.

If you find violations, fix them and explain what was changed and why.

## Quick reference — canonical form anatomy

```tsx
import { Form } from "react-aria-components"
import { Button } from "@/components/ui/button"
import { Description, FieldError, Fieldset, Label, Legend } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { TextField } from "@/components/ui/text-field"

<Form>
  <Fieldset>
    <Legend />
    <Text />

    <TextField isRequired name="name">
      <Label />
      <Input />
      <FieldError />
      <Description />
    </TextField>

    <div data-slot="control">
      <Button type="submit">Register</Button>
    </div>
  </Fieldset>
</Form>
```

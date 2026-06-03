# Forms Rules

Intent UI form components are built on top of `react-aria-components`. Every form should use the Intent UI primitives instead of raw HTML `<form>`, `<input>`, `<select>`, `<textarea>`, `<label>`, etc. They provide accessible labeling, validation, descriptions, errors, and consistent spacing out of the box.

## Form anatomy

The canonical structure for any Intent UI form is:

1. Wrap everything in `<Form>` from `react-aria-components` (not a raw `<form>` element).
2. Group fields inside a `<Fieldset>` (from `@/components/ui/field`).
3. Give the fieldset a `<Legend>` and optional `<Text>` description.
4. Use the correct field primitive for each value (`TextField`, `NumberField`, `SearchField`, `DatePicker`, `Select`, `ComboBox`, `Checkbox`, `RadioGroup`, etc.).
5. Every field gets a `<Label>`. Add `<Description>` for helper text and `<FieldError />` when the field is `isRequired` or `isInvalid`.
6. Place the submit `<Button>` inside a `<div data-slot="control">` so it receives the fieldset's `mt-6` spacing.

```tsx
import { Form } from "react-aria-components"
import { Button } from "@/components/ui/button"
import { Description, FieldError, Fieldset, Label, Legend } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { TextField } from "@/components/ui/text-field"

export function RegisterForm() {
  return (
    <Form>
      <Fieldset>
        <Legend>Create an account</Legend>
        <Text>Enter your details below to create your account.</Text>

        <TextField isRequired name="name">
          <Label>Name</Label>
          <Input />
          <FieldError />
          <Description>This will be your public display name.</Description>
        </TextField>

        <TextField isRequired name="email" type="email">
          <Label>Email</Label>
          <Input />
          <FieldError />
          <Description>We'll never share your email with anyone else.</Description>
        </TextField>

        <TextField isRequired name="password" type="password">
          <Label>Password</Label>
          <Input />
          <FieldError />
        </TextField>

        <div data-slot="control">
          <Button type="submit">Register</Button>
        </div>
      </Fieldset>
    </Form>
  )
}
```

### Why `<Form>` and not `<form>`?

`<Form>` from `react-aria-components` renders a native `<form>` under the hood, but also:

- Integrates with React Aria field validation (server + client).
- Propagates `isInvalid` / `isRequired` state down to child fields.
- Ensures accessible announcements for submission and validation errors.

A raw `<form>` will still submit, but you lose these integrations and the spacing hooks that Intent UI's `Fieldset` relies on.

### Why `<Fieldset>` + `<Legend>` + `<Text>`?

- **`<Fieldset>`** — groups related fields and applies automatic spacing:
  - `[&>*+[data-slot=control]]:mt-6` adds `mt-6` between fields and before the submit button.
  - `*:data-[slot=text]:mt-1` tucks the `<Text>` description tight under the `<Legend>`.
- **`<Legend>`** — the correct heading for a fieldset. Do **not** use `<h1>`, `<h2>`, or `<Heading>` here.
- **`<Text>`** — renders with `data-slot="text"` so it picks up the tight spacing automatically.
- **`<FieldGroup>`** — wraps a nested group of fields with `space-y-6` when you need a sub-stack inside a Fieldset.

## `data-slot="control"` for custom rows inside Fieldset

Any direct child of `<Fieldset>` that should sit in the vertical stack (for example, a checkbox row next to a link, or the submit button wrapper) must carry `data-slot="control"` to receive the `mt-6` spacing.

Built-in field components (`TextField`, `NumberField`, `Checkbox`, `RadioGroup`, `Select`, `DatePicker`, etc.) already render with `data-slot="control"`. For custom wrappers, add the attribute yourself.

```tsx
<Form>
  <Fieldset>
    <Legend>Log in</Legend>
    <Text>Welcome back! Enter your credentials to access your account.</Text>

    <TextField isRequired name="email" type="email">
      <Label>Email</Label>
      <Input placeholder="you@example.com" />
      <FieldError />
    </TextField>

    <TextField isRequired name="password" type="password">
      <Label>Password</Label>
      <Input placeholder="Enter your password" />
      <FieldError />
    </TextField>

    <div data-slot="control" className="flex items-center justify-between">
      <Checkbox name="remember">Remember me</Checkbox>
      <Link href="/forgot-password" className="text-sm">
        Forgot password?
      </Link>
    </div>

    <div data-slot="control">
      <Button type="submit">Log in</Button>
    </div>
  </Fieldset>
</Form>
```

Without `data-slot="control"` the row will not receive the standard `mt-6` spacing and will look misaligned.

## Field primitives from `@/components/ui/field`

All of the following are exported from `@/components/ui/field`. Use them instead of hand-rolled `<label>`, `<p>`, `<small>`, or `<span>`:

- **`Label`** — field label. Automatically renders a red `*` indicator when the parent field has `isRequired`.
- **`Description`** — helper text below a field. Renders with `slot="description"` so the parent field applies tight spacing.
- **`FieldError`** — validation error text. Only renders when the parent field is invalid. Always include it when the field has `isRequired` or `isInvalid`.
- **`Fieldset`** — groups related form fields and handles vertical spacing.
- **`FieldGroup`** — wraps multiple fields with `space-y-6`. Use it when you need a nested sub-stack inside a `Fieldset`.
- **`Legend`** — heading for a `Fieldset`. Use instead of `<h1>` / `<Heading>` inside a fieldset.

## The `isRequired` rule

Whenever a field component has `isRequired`, you **must** include `<FieldError />` as a child so validation errors are visible:

```tsx
// ✅ Correct
<TextField isRequired name="email" type="email">
  <Label>Email</Label>
  <Input />
  <FieldError />
</TextField>

// ❌ Wrong — isRequired without FieldError
<TextField isRequired name="email" type="email">
  <Label>Email</Label>
  <Input />
</TextField>
```

## Forbidden input types

Never use `type="number"` or `type="date"` on `<Input />`. These native types have inconsistent browser behavior and poor accessibility. Use the dedicated Intent UI components:

| Forbidden | Use instead |
|---|---|
| `<Input type="number" />` | `<NumberField>` + `<NumberInput />` from `@/components/ui/number-field` |
| `<Input type="date" />` | `<DatePicker>` from `@/components/ui/date-picker` |

## TextField

Use `TextField` (from `@/components/ui/text-field`) for text-like values only: `text`, `email`, `password`, `search`, `tel`, `url`. Use `NumberField` for numeric values and `DatePicker` for dates.

```tsx
import { TextField } from "@/components/ui/text-field"
import { Input } from "@/components/ui/input"
import { Description, FieldError, Label } from "@/components/ui/field"

// ✅ Basic
<TextField>
  <Label>Name</Label>
  <Input placeholder="Enter your name" />
</TextField>

// ✅ With description
<TextField>
  <Label>Email</Label>
  <Input type="email" />
  <Description>We'll never share your email.</Description>
</TextField>

// ✅ Required — always include FieldError when isRequired is set
<TextField isRequired name="email" type="email">
  <Label>Email</Label>
  <Input />
  <FieldError />
</TextField>

// ✅ Required + description — both work together
<TextField isRequired name="email" type="email">
  <Label>Email</Label>
  <Input />
  <FieldError />
  <Description>Example description for the email field.</Description>
</TextField>

// ❌ Wrong — raw label + input
<label>Name</label>
<input type="text" placeholder="Enter your name" />
```

### InputGroup for leading/trailing adornments

Use `InputGroup` from `@/components/ui/input` to attach icons, text, buttons, or loaders to an input. Icons are auto-positioned; for `<Text>` adornments, set `--input-gutter-start` / `--input-gutter-end` CSS variables to match the adornment width.

```tsx
import { EnvelopeIcon } from "@heroicons/react/24/outline"
import { Input, InputGroup } from "@/components/ui/input"
import { Text } from "@/components/ui/text"

<InputGroup>
  <EnvelopeIcon />
  <Input type="email" />
</InputGroup>

<InputGroup className="[--input-gutter-start:--spacing(16)] [--input-gutter-end:--spacing(12)]">
  <Text>https://</Text>
  <Input />
  <Text>.com</Text>
</InputGroup>
```

## Select

Use `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` from `@/components/ui/select`.

```tsx
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/field"

// ✅ Uncontrolled
<Select defaultValue="us">
  <Label>Country</Label>
  <SelectTrigger />
  <SelectContent>
    <SelectItem id="us">United States</SelectItem>
    <SelectItem id="uk">United Kingdom</SelectItem>
  </SelectContent>
</Select>

// ✅ Controlled — use value/onChange
<Select value={country} onChange={setCountry}>
  <Label>Country</Label>
  <SelectTrigger />
  <SelectContent>
    <SelectItem id="us">United States</SelectItem>
    <SelectItem id="uk">United Kingdom</SelectItem>
  </SelectContent>
</Select>

// ❌ Wrong — selectedKey / onSelectionChange are deprecated
<Select selectedKey={country} onSelectionChange={setCountry}>...</Select>

// ❌ Wrong — never use defaultSelectedKey
<Select defaultSelectedKey="us">...</Select>

// ❌ Wrong — raw <select>
<select>
  <option value="us">United States</option>
</select>
```

## ComboBox

Use `ComboBox`, `ComboBoxInput`, `ComboBoxContent`, `ComboBoxItem` from `@/components/ui/combo-box`. Same `value` / `onChange` / `defaultValue` rules as Select — never use `selectedKey`, `onSelectionChange`, or `defaultSelectedKey`.

```tsx
import { ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem } from "@/components/ui/combo-box"
import { Label } from "@/components/ui/field"

<ComboBox defaultValue="react">
  <Label>Framework</Label>
  <ComboBoxInput />
  <ComboBoxContent>
    <ComboBoxItem id="react">React</ComboBoxItem>
    <ComboBoxItem id="vue">Vue</ComboBoxItem>
  </ComboBoxContent>
</ComboBox>
```

## Checkbox

Use `Checkbox` and `CheckboxGroup` from `@/components/ui/checkbox`. For a checkbox with a label + description, use the `CheckboxLabel` subcomponent:

```tsx
import { Checkbox, CheckboxLabel } from "@/components/ui/checkbox"
import { Description } from "@/components/ui/field"

// ✅ Single checkbox
<Checkbox name="notifications">Enable notifications</Checkbox>

// ✅ With label + description
<Checkbox value="read" name="read">
  <CheckboxLabel>Remember me</CheckboxLabel>
  <Description>Keep me logged in on this device.</Description>
</Checkbox>

// ✅ Checkbox group
<CheckboxGroup name="interests">
  <Label>Interests</Label>
  <Checkbox value="music">Music</Checkbox>
  <Checkbox value="sports">Sports</Checkbox>
</CheckboxGroup>

// ✅ Indeterminate
<Checkbox value="read" isIndeterminate>Read</Checkbox>
```

## Radio

Use `Radio`, `RadioGroup`, and `RadioLabel` from `@/components/ui/radio`. Pair with `Label` / `Description` from `@/components/ui/field`:

```tsx
import { Description, Label } from "@/components/ui/field"
import { Radio, RadioGroup, RadioLabel } from "@/components/ui/radio"

<RadioGroup name="billing" defaultValue="monthly">
  <Label>Billing Cycle</Label>
  <Description>Select how often you'd like to be billed.</Description>

  <Radio value="monthly">
    <RadioLabel>Monthly</RadioLabel>
    <Description>Billed every month.</Description>
  </Radio>
  <Radio value="yearly">
    <RadioLabel>Yearly</RadioLabel>
    <Description>Billed once per year with a discount.</Description>
  </Radio>
</RadioGroup>
```

## Textarea

Use `Textarea` from `@/components/ui/textarea` inside a `TextField`. Never use a raw `<textarea>`.

```tsx
import { Textarea } from "@/components/ui/textarea"
import { TextField } from "@/components/ui/text-field"
import { Label } from "@/components/ui/field"

<TextField name="bio">
  <Label>Bio</Label>
  <Textarea />
</TextField>
```

## NumberField

Use `NumberField` + `NumberInput` from `@/components/ui/number-field`. Never use `TextField` + `<Input type="number">`.

```tsx
import { NumberField, NumberInput } from "@/components/ui/number-field"
import { FieldError, Label } from "@/components/ui/field"

<NumberField isRequired name="price">
  <Label>Price</Label>
  <NumberInput />
  <FieldError />
</NumberField>
```

## SearchField

Use `SearchField` from `@/components/ui/search-field`.

```tsx
import { SearchField } from "@/components/ui/search-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/field"

<SearchField>
  <Label>Search</Label>
  <Input />
</SearchField>
```

## Switch

Use `Switch` from `@/components/ui/switch`.

```tsx
import { Switch } from "@/components/ui/switch"

<Switch>Enable notifications</Switch>
```

## Date & time

Use `DatePicker`, `DateRangePicker`, `TimeField` from their respective packages. Never use `<Input type="date">`.

```tsx
import { DatePicker } from "@/components/ui/date-picker"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { TimeField } from "@/components/ui/time-field"
import { FieldError, Label } from "@/components/ui/field"

<DatePicker isRequired name="startDate">
  <Label>Start date</Label>
  <FieldError />
</DatePicker>

<DateRangePicker name="range">
  <Label>Event range</Label>
</DateRangePicker>

<TimeField name="time">
  <Label>Alarm time</Label>
</TimeField>
```

## Accessibility: `aria-label` when no visible `<Label>`

Every form field, `GridList`, and `Table` **must** have a label. If you cannot render a visible `<Label>`, you **must** pass `aria-label` to the field:

```tsx
// ✅ Visible label
<TextField>
  <Label>Email</Label>
  <Input type="email" />
</TextField>

// ✅ No visible label — aria-label required
<TextField aria-label="Email">
  <Input type="email" />
</TextField>

// ✅ SearchField without visible label
<SearchField aria-label="Search products">
  <Input />
</SearchField>

// ✅ Select without visible label
<Select aria-label="Sort by">
  <SelectTrigger />
  <SelectContent>
    <SelectItem id="newest">Newest</SelectItem>
    <SelectItem id="oldest">Oldest</SelectItem>
  </SelectContent>
</Select>

// ✅ GridList / Table must have aria-label
<GridList aria-label="Shopping cart items">...</GridList>
<Table aria-label="Users">...</Table>

// ❌ Wrong — no label and no aria-label
<TextField>
  <Input type="email" />
</TextField>
```

This rule applies to **all** form components: `TextField`, `NumberField`, `SearchField`, `Select`, `DatePicker`, `DateRangePicker`, `TimeField`, `CheckboxGroup`, `RadioGroup`, `ComboBox`, `TagField`, `GridList`, `Table`.

## Controlled vs. uncontrolled

- **Controlled**: use `value` / `onChange` (or `isSelected` / `onChange` for Checkbox).
- **Uncontrolled**: use `defaultValue` (or `defaultSelected` for Checkbox).
- **Deprecated props — never use**: `selectedKey`, `onSelectionChange`, `defaultSelectedKey`.

| Deprecated | Use instead |
|---|---|
| `selectedKey` | `value` |
| `onSelectionChange` | `onChange` |
| `defaultSelectedKey` | `defaultValue` |

## Validation, disabled, and readonly

- Use the component props `isRequired`, `isInvalid`, and `validate` instead of building custom validation wrappers.
- Use `isDisabled` and `isReadOnly` (camelCase) instead of the HTML attributes `disabled` / `readonly`.
- Always pair `isRequired` / `isInvalid` with a `<FieldError />` child.

## Key patterns

1. **`<Form>` + `<Fieldset>` + `<Legend>`** for form wrappers — use `<Form>` from `react-aria-components`, not a raw `<form>` element.
2. **`<Fieldset>` + `<Legend>`** for grouping related fields — not `<div>` + `<h1>`.
3. **`<Text>`** for form descriptions — not `<p>`.
4. **`Label` and `Description`** come from `@/components/ui/field` — they work with every form component.
5. **Use the correct field primitive**: `TextField` for text-like values, `NumberField` for numeric values, `DatePicker` for calendar dates.
6. **Controlled vs uncontrolled**: use `value` / `onChange` for controlled, `defaultValue` for uncontrolled. Never use the deprecated `selectedKey` / `onSelectionChange` / `defaultSelectedKey`.
7. **Validation**: use `isRequired`, `isInvalid`, `validate` props — not custom validation wrappers. Always include `<FieldError />` when `isRequired` is set.
8. **Disabled / readonly**: use `isDisabled`, `isReadOnly` props (camelCase, not HTML attributes).
9. **`data-slot="control"`** on custom divs inside `Fieldset` — ensures they receive the same `mt-6` spacing as fields, including the submit button.
10. **`"use client"` directive** — required when using form components with state or hooks.

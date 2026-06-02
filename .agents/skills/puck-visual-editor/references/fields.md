# Fields

## Field Selection

Choose the smallest field that matches the real data shape.

- `text`: short scalar strings
- `textarea`: longer plain text
- `number`: numeric values
- `radio`: small fixed mutually exclusive options
- `select`: larger fixed option sets
- `object`: grouped nested props
- `array`: repeatable item lists
- `slot`: nested drag-and-drop content
- `richtext`: formatted content
- `external`: async record selection
- `custom`: bespoke editor UI

## Base Field Rules

All fields share common metadata such as:

- label
- label icon
- metadata
- visibility

Use these to make the editor readable before reaching for custom UI.

## Textual Fields

Use these when the data is fundamentally simple:

- `text`
- `textarea`
- `number`
- `radio`
- `select`

Rules:

- Prefer explicit options for enums rather than freeform text.
- Use `number` only for actual numbers, not dimension strings with units, unless the component genuinely needs numeric editing.

## Object Fields

Use `object` when several props belong together conceptually.

Good fits:

- CTA objects
- image metadata
- nested configuration groups

Rules:

- Use `objectFields` to keep the structure explicit.
- Prefer object fields over manually encoding JSON inside a string prop.

## Array Fields

Use `array` when authors repeat a structured item shape.

Good fits:

- button lists
- badges
- features
- stats
- FAQs

Rules:

- Keep each item schema focused.
- Avoid deeply nested arrays unless the content model truly requires it.
- Use array fields rather than a series of numbered sibling props.

## Slot Fields

Slots define nested component regions.

Important behavior:

- they store an array of nested component data
- they are transformed before being handed to the renderer
- they do not render a standard form control in the fields panel

Good fits:

- container children
- multi-column regions
- section internals

Rules:

- Use slots for layout structure, not for arbitrary data blobs.
- Restrict allowed blocks where editor safety matters.

## Richtext Fields

Richtext is the built-in formatted content field.

It supports:

- optional inline editing
- configurable initial height
- configurable menu rendering
- configurable inline menu rendering
- configurable Tiptap extensions and selectors

Rules:

- Prefer richtext over custom fields for editorial formatting.
- Use custom fields only when built-in menus and extension points still do not fit the requirement.

## External Fields

External fields let the editor select data from an async source.

Typical use cases:

- choosing a post
- choosing a document
- choosing a staff profile
- selecting content from a third-party API

Rules:

- Treat them as selection UIs.
- Avoid hiding your whole data fetching architecture inside the field itself.
- Persist only what the renderer truly needs when possible.

## Custom Fields

Use `custom` only when built-in fields cannot express the desired UX.

Good fits:

- media pickers
- specialized design token pickers
- bespoke structured editors

Rules:

- Keep the custom field API narrow.
- Reuse shared repo UI around the field when possible without editing protected base UI files.
- Prefer plain, robust data contracts over overly magical field state.

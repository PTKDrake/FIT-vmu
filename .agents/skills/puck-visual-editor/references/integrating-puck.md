# Integrating Puck

## Mental Model

- `<Puck />` is the interactive editor
- `<Render />` renders saved Puck content
- `config` defines available components, root behavior, categories, fields, and optional resolvers
- `data` is the persisted payload with `root` props and `content`
- `slot` fields create nested drag-and-drop regions
- `resolveData` derives or hydrates props after edits
- `resolveFields` changes field configuration based on current props
- `resolveAllData()` runs all data resolvers before rendering
- `migrate()` upgrades legacy payloads

## Getting Started Shape

The minimal flow is:

1. Install and import Puck core CSS.
2. Create a config with at least one component and its `render` function.
3. Render `<Puck config={config} data={initialData} onPublish={save} />`.
4. Render saved content with `<Render config={config} data={data} />`.

## Component Configuration

Each component definition should answer four questions:

- Is this component available in the editor?
- Which props does the editor expose for it?
- How does it render?
- Which category should it appear in?

Rules:

- Every component needs a stable type key and `render` function.
- Keep field definitions close to the renderer.
- Prefer descriptive component names that match authoring intent.
- Treat type-key changes as migration work, not refactors with no consequences.

## Root Configuration

The root is the top-level wrapper around all content.

Use root config for:

- page wrapper markup
- page-level metadata fields
- page-level derived props

Rules:

- Use `root.render` for the outer shell around content.
- Keep root props narrow.
- Use root fields only when a value truly applies to the full page rather than a block.
- Root can also use `resolveData`.

## Multi-Column and Nested Layouts

Slots are the modern nesting mechanism.

Use `slot` when:

- a block needs child content
- a layout needs fixed regions such as left and right columns
- a section acts as a reusable container

Rules:

- Prefer `slot` over DropZone-style patterns.
- Use one named slot for simple child content.
- Use multiple named slots for fixed layout regions.
- Constrain valid nested blocks with allow/disallow rules where necessary.
- Keep layout primitives structural and reusable.

## Categories

Categories group components in the sidebar.

Use categories to:

- reduce editor noise
- group blocks by purpose
- hide or collapse low-priority groups

Rules:

- Keep the palette curated.
- Reuse the repo's category structure before inventing a new taxonomy.
- Per-page palettes should come from filtered config and categories, not just from saved JSON.

## Rich Text Editing

Use the `richtext` field for formatted editorial content.

Capabilities:

- normal rich text field editing
- optional inline editing through `contentEditable`
- configurable menus
- configurable inline menus
- configurable Tiptap extensions

Rules:

- Prefer `richtext` before inventing a custom rich editor field.
- Only enable inline editing when it improves the authoring flow enough to justify the extra complexity.
- Treat rendered rich text as public HTML content.

## Dynamic Props

Use `resolveData` when a block's stored or derived props should change after edits.

Typical use cases:

- copying one prop into another derived prop
- hydrating related data
- marking resolved fields as read-only
- calling async lookups only when a relevant prop changed

Rules:

- Guard expensive work with the `changed` parameter.
- Keep `resolveData` deterministic and side-effect free.
- Use read-only flags for derived values that authors should not hand-edit.
- Remember that insertions with async resolve work can update editor history more than once.

## Dynamic Fields

Use `resolveFields` when field configuration should depend on the current props.

Typical use cases:

- show or hide fields conditionally
- change labels or options dynamically
- adjust field configuration based on selected modes

Rules:

- Use this for field metadata changes, not for persisted business data changes.
- Keep the logic easy to reason about; overly dynamic forms are hard to author.

## External Data Sources

There are several ways to involve external data:

- fetch at runtime inside the rendered block
- fetch on the server during rendering
- let the editor pick a record with an `external` field

Prefer storing a stable selector such as an ID or slug when full external data does not need to be persisted in the Puck payload.

## React Server Components

Server-safe Puck work is mainly about `<Render />` and `resolveAllData()`.

Rules:

- Any config used on the server must avoid accidental client-only imports.
- Split client components behind `"use client"` when browser APIs are required.
- Keep editor-only code out of server render paths.

## Data Migration

Migration matters in two situations:

- Puck changes its own data model between major versions
- your repo changes component types or prop semantics

Rules:

- Use `migrate()` for framework-level payload upgrades.
- Add repo-level normalization for custom semantic changes.
- Never rename or repurpose type keys without a transition plan.

## Viewports

Puck preview runs in a same-origin iframe with resizable viewport presets.

Default viewport sizes:

- small
- medium
- large
- full width

Use viewports to verify layout primitives, dense sections, and responsive blocks.

## Feature Toggling

Puck permissions can disable actions such as:

- deletion
- dragging
- duplication
- editing

Use permissions when the editor needs mode-based restrictions or partial read-only behavior.

## Overlay Portals

Overlay portals make specific preview elements interactive even while the editor overlay is active.

Use them when:

- a button inside the preview must stay clickable
- a custom control would otherwise be blocked by the overlay

Rules:

- Register only the elements that truly need it.
- Keep portal usage local and deliberate.

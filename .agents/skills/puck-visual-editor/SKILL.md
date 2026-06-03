---
name: puck-visual-editor
description: Build, extend, and persist Puck visual editors for this repository's `web/` frontend. Use when the task mentions Puck, `@puckeditor/core`, page builders, `puck_json`, drag-and-drop CMS blocks, slots, rich text, plugin rail, dynamic props or fields, external data sources, data migration, viewports, Render vs Puck, or custom editor UI.
---

# Puck Visual Editor

Puck (`@puckeditor/core`) is a modular open-source visual editor for React. It provides a drag-and-drop editor (`<Puck>`) and a readonly renderer (`<Render>`), both driven by a shared `config` and `data` model.

## When to Apply

Activate this skill when work involves any of the following:

- Adding or changing a Puck editor in `web/`
- Rendering stored Puck content in readonly or preview mode
- Editing `web/lib/puck/` config, block registry, block components, or page-builder data helpers
- Working with `puck_json`, `content_format`, Puck root props, or nested slot content
- Building CMS pages with drag-and-drop blocks, categories, rich text, or external data pickers
- Extending the editor with composition, plugins, overrides, custom fields, field transforms, or internal Puck hooks
- Migrating legacy Puck payloads or renaming component types
- Working with Puck permissions, actions, viewports, overlay portals, or data resolvers

Use this skill together with:

- `inertia-react-development` for Inertia page flow in `web/pages/`
- `intentui` when composing UI around the editor without touching `web/components/ui`
- `tailwindcss-development` when changing block styling
- `wayfinder-development` when frontend code needs backend routes
- `no-use-effect` for normal React work

Exception: Puck sometimes needs DOM lifecycle hooks for iframe sync, overlay portals, or editor internals. Use that pattern only when the editor integration genuinely requires it.

## Core Architecture

### Editor vs Renderer

- `<Puck config={config} data={data} />` — interactive editor with sidebar, fields panel, outline, preview iframe
- `<Render config={config} data={data} />` — readonly rendering of persisted Puck data
- Both share the same `config` and `data` contracts

### Config

The `config` object describes everything Puck needs to know:

```tsx
const config = {
  components: {
    HeadingBlock: {
      fields: { title: { type: "text" } },
      defaultProps: { title: "Hello" },
      render: ({ title }) => <h1>{title}</h1>,
    },
  },
  root: {
    fields: { title: { type: "text" } },
    render: ({ children, title }) => <div><h1>{title}</h1>{children}</div>,
  },
  categories: {
    typography: { components: ["HeadingBlock"] },
  },
};
```

### Data

The `data` payload is what gets persisted:

```json
{
  "content": [
    { "type": "HeadingBlock", "props": { "id": "abc-123", "title": "Hello" } }
  ],
  "root": { "props": { "title": "My Page" } },
  "zones": {}
}
```

- `content` — top-level array of `ComponentData` items
- `root` — root-level props and optional render
- `zones` — named slot content (when using slot fields)

### ComponentConfig

Each component in `config.components` supports:

| Param | Purpose |
|-------|---------|
| `render(props)` | **Required.** Render function receiving field props + `puck` helpers |
| `fields` | Object of field definitions (text, number, select, slot, etc.) |
| `defaultProps` | Default values for new instances |
| `label` | Display name in editor (defaults to key) |
| `inline` | Remove wrapper element; requires `puck.dragRef` |
| `metadata` | Extra values passed to render and resolveData |
| `permissions` | Per-component permission overrides |
| `resolveData()` | Derive/transform props dynamically (async supported) |
| `resolveFields()` | Change field configuration dynamically |
| `resolvePermissions()` | Change permissions dynamically |

### Render Props

Every `render` function receives:

| Arg | Type | Description |
|-----|------|-------------|
| `id` | String | Unique component identifier |
| `puck.dragRef` | Function | Ref for draggable element (required with `inline`) |
| `puck.isEditing` | Boolean | True when inside `<Puck>` editor |
| `puck.metadata` | Object | Merged global + component metadata |
| `puck.renderDropZone` | Function | Render nested drop zones (for RSC) |
| `...props` | Object | User-defined field values |

### Field Types

- **text** — short string input, optional `contentEditable` and `placeholder`
- **textarea** — multi-line text, optional `contentEditable` and `placeholder`
- **number** — numeric input with optional `min`, `max`, `step`, `placeholder`
- **radio** — mutually exclusive options via `{ label, value }[]`
- **select** — dropdown options via `{ label, value }[]`
- **object** — grouped sub-fields via `objectFields`
- **array** — repeatable item list via `arrayFields`, with `min`/`max`/`defaultItemProps`/`getItemSummary`
- **slot** — nested component region (replaces DropZone), with `allow`/`disallow`/`style`/`className`
- **richtext** — Tiptap-based rich text with configurable menus and extensions
- **external** — async data selection with `fetchList`, `mapProp`, `mapRow`, caching
- **custom** — bespoke field UI via `render({ name, onChange, value, field })`

All fields share base params: `label`, `labelIcon`, `metadata`, `visible`.

### Slots (Nesting)

Slots are the modern nesting mechanism, replacing the deprecated `<DropZone>` component:

```tsx
fields: {
  content: { type: "slot" },
  sidebar: { type: "slot" },
},
render: ({ content: Content, sidebar: Sidebar }) => (
  <div>
    <Content />
    <Sidebar style={{ display: "grid", gap: 16 }} />
  </div>
)
```

Slot params: `allow`, `disallow`, `style`, `className`, `collisionAxis`, `as`, `ref`, `minEmptyHeight`.

Slot values are `ComponentData[]` in data, transformed to render functions at render time.

### Dynamic Props (`resolveData`)

```tsx
resolveData: async ({ props }, { changed, metadata, parent, root, trigger }) => {
  if (!changed.title) return { props };
  return {
    props: { resolvedTitle: props.title.toUpperCase() },
    readOnly: { resolvedTitle: true },
  };
}
```

Triggers: `insert`, `replace`, `move`, `load`, `force`.

### Dynamic Fields (`resolveFields`)

```tsx
resolveFields: (data, { changed, fields, lastData, lastFields, appState, metadata, parent }) => {
  if (data.props.mode === "advanced") {
    return { ...fields, advancedOption: { type: "text" } };
  }
  return fields;
}
```

### Permissions

Global or per-component control over: `delete`, `drag`, `duplicate`, `edit`, `insert`.

```tsx
permissions: { delete: false, drag: true }
```

Dynamic via `resolvePermissions(data, params)`.

### Data Migration

- `migrate(data, migrations)` — framework-level payload upgrades
- `transformProps(data, { type, prop })` — rename or transform props across all instances
- `walkTree(data, fn)` — recursive tree transform

### Actions

Dispatch editor state changes via `PuckApi`:

- `setData` — replace editor data
- `setUi` — update UI state (sidebar visibility, etc.)
- `set` — generic state set

### Internal API

- `usePuck()` / `createUsePuck(selector)` — access editor state in custom components
- `useGetPuck()` — get current Puck context
- `PuckApi.dispatch(action)` — dispatch actions
- `PuckApi.history` — undo/redo
- `PuckApi.getPermissions(itemSelector)` — check permissions
- `PuckApi.resolveDataById(id)` — resolve specific component data

### Plugins

Reusable editor extensions with: `name`, `label`, `icon`, `render`, `fieldTransforms`, `overrides`, `mobilePanelHeight`.

Official plugins: `blocksPlugin`, `fieldsPlugin`, `outlinePlugin`, `legacySideBarPlugin`.

### UI Overrides

Override default Puck surfaces: `actionBar`, `componentOverlay`, `drawer`, `drawerItem`, `fieldLabel`, `fields`, `fieldTypes`, `header`, `headerActions`, `iframe`, `outline`, `preview`, `puck`.

### Viewports

Default: 360px (smartphone), 768px (tablet), 1280px (monitor), 100% (full width).

Customizable via `viewports` prop on `<Puck>`. Disable via `iframe: { enabled: false }`.

### Composition

Build custom editor UIs using `<Puck>` children:

```tsx
<Puck config={config} data={data}>
  <Puck.Preview />
  <Puck.Fields />
  <Puck.Outline />
  <Puck.Components />
</Puck>
```

### Field Transforms

Modify props before editor rendering (not in `<Render>`):

```tsx
fieldTransforms={{
  text: ({ value }) => <div>{value}</div>,
}}
```

### Overlay Portals

Register interactive elements in preview that bypass the editor overlay:

```tsx
registerOverlayPortal({ element, onMount, onUnmount })
```

## Project Defaults

- Frontend code lives in `web/`, not `resources/js/`
- Stored format string is `puck_json`
- Reuse the existing Puck stack under `web/lib/puck/` and `web/components/page-builder/`
- Parse persisted values through shared helpers, not inline `JSON.parse`
- Prefer block modules under `web/lib/puck/blocks/`
- Keep readonly rendering on top of `<Render />`
- Prefer `slot` fields over legacy DropZone-style designs

Read [references/project-integration.md](references/project-integration.md) before changing repo-specific Puck code.

## Working Method

1. Identify whether the task is about editor UI, persisted data, readonly rendering, schema evolution, or editor extension.
2. Read the smallest reference file that matches the work:
    - `references/integrating-puck.md` for config, root, slots, rich text, dynamic props or fields, external data, RSC, migration, viewport, permissions, overlays
    - `references/fields.md` for field selection and field-level rules with complete API params
    - `references/extending-puck.md` for composition, plugins, overrides, custom fields, field transforms, and internal API usage
    - `references/api-reference.md` for components, data model, PuckApi, actions, functions, overrides, plugins
    - `references/project-integration.md` for repo conventions and concrete file locations
3. Reuse the current config, data helpers, and editor wrappers before creating new abstractions.
4. Keep config, block rendering, persistence, and page wiring separate.
5. If stored payload semantics change, update normalization or migration handling instead of breaking old data.
6. Add or update the smallest relevant test for the affected create, edit, builder, content-update, or render path.

## Extension Strategy

Reach for extension points in this order:

1. ordinary component config (fields, defaultProps, render)
2. built-in fields (text, number, select, slot, etc.)
3. root config (wrapper, metadata)
4. slots (nesting, multi-column)
5. `resolveData` or `resolveFields` (dynamic behavior)
6. composition (custom editor layout)
7. small local overrides (header, actionBar)
8. plugins (editor-wide extensions)
9. custom fields (bespoke input UI)
10. internal API (usePuck, dispatch)

If you are reaching for a later step too early, re-check whether a simpler built-in mechanism already solves the problem.

## Non-Negotiables

- Do not create a second ad hoc Puck implementation elsewhere in the repo unless the user explicitly asks for a separate editor product.
- Do not store lossy HTML snapshots as the canonical page-builder payload.
- Do not rename component type keys without migration handling.
- Do not put large blocks of Puck reference material directly into this file; keep it in `references/`.
- Do not edit `web/components/ui` unless the user explicitly asks or no composition-based solution is possible.
- Do not use `<DropZone>` for new code; use `slot` fields instead.
- Do not bypass `resolveAllData()` when rendering server-side; unresolved data will show stale props.

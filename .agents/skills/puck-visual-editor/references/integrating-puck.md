# Integrating Puck

## Mental Model

- `<Puck />` is the interactive editor — sidebar, fields panel, outline, preview iframe
- `<Render />` renders saved Puck content in readonly mode
- `config` defines available components, root behavior, categories, fields, and resolvers
- `data` is the persisted payload: `content` (array), `root` (props), `zones` (named slots)
- `slot` fields create nested drag-and-drop regions (replaces deprecated `<DropZone>`)
- `resolveData()` derives or hydrates props after edits
- `resolveFields()` changes field configuration based on current props
- `resolvePermissions()` changes permissions dynamically
- `resolveAllData()` runs all data resolvers before rendering (use before server render)
- `migrate()` upgrades legacy payloads for framework changes

## Getting Started

### Installation

```bash
npm install @puckeditor/core
```

Import the CSS:

```tsx
import "@puckeditor/core/dist/puck.css";
// Or without external fonts:
import "@puckeditor/core/dist/puck-no-external.css";
```

### Minimal Editor

```tsx
import { Puck } from "@puckeditor/core";

const config = {
  components: {
    HeadingBlock: {
      fields: { title: { type: "text" } },
      render: ({ title }) => <h1>{title}</h1>,
    },
  },
};

const initialData = { content: [], root: {} };

export function Editor() {
  return (
    <Puck
      config={config}
      data={initialData}
      onPublish={async (data) => {
        await fetch("/api/pages", {
          method: "post",
          body: JSON.stringify({ data }),
        });
      }}
    />
  );
}
```

### Readonly Renderer

```tsx
import { Render } from "@puckeditor/core";

export function Page({ data }) {
  return <Render config={config} data={data} />;
}
```

### TypeScript Setup

```tsx
import type { Config } from "@puckeditor/core";

type Components = {
  HeadingBlock: { title: string };
};

type RootProps = { description: string };

const config: Config<Components, RootProps> = {
  components: { /* ... */ },
  root: { /* ... */ },
};
```

## Component Configuration

Each component in `config.components` is a `ComponentConfig`:

### Required: `render(props)`

```tsx
const config = {
  components: {
    HeadingBlock: {
      render: ({ title, id, puck }) => {
        // id: unique identifier
        // puck.isEditing: boolean
        // puck.metadata: merged metadata
        // puck.dragRef: ref for inline mode
        // puck.renderDropZone: for RSC nesting
        return <h1>{title}</h1>;
      },
    },
  },
};
```

### Optional: `fields`

```tsx
fields: {
  title: { type: "text" },
  count: { type: "number", min: 0, max: 10 },
  align: { type: "radio", options: [
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
  ]},
}
```

### Optional: `defaultProps`

```tsx
defaultProps: { title: "Hello, world", count: 5 }
```

Stored in the data payload (unlike JS default parameters).

### Optional: `label`

Display name in editor sidebar. Defaults to the component key.

```tsx
label: "Heading Block"
```

### Optional: `inline`

Remove Puck's wrapper `div`. Requires `puck.dragRef`:

```tsx
{
  inline: true,
  render: ({ puck }) => <h1 ref={puck.dragRef}>Hello</h1>,
}
```

Use for CSS layouts that need direct children (flex-grow, grid-column, grid-row).

### Optional: `metadata`

Extra values passed to `render` and `resolveData` via `puck.metadata`. Merged with global metadata from `<Puck metadata={...} />`.

```tsx
metadata: { analyticsKey: "hero-section" }
```

### Optional: `permissions`

Per-component permission overrides (see Permissions section below).

### Optional: `resolveData(data, params)`

Derive or transform props dynamically. Supports async.

**Args:**

| Prop | Type | Description |
|------|------|-------------|
| `data.props` | Object | Current component props |
| `data.readOnly` | Object | Fields currently read-only |
| `params.changed` | Object | Which props changed since last call |
| `params.lastData` | Object | Previous resolveData return |
| `params.metadata` | Object | Merged metadata |
| `params.parent` | Object | Parent component data |
| `params.root` | Object | Root data for current document |
| `params.trigger` | String | `insert`, `replace`, `move`, `load`, `force` |

**Returns:**

```tsx
resolveData: async ({ props }, { changed, root }) => {
  if (!changed.title) return { props };
  return {
    props: { resolvedTitle: `${root.props?.siteName} — ${props.title}` },
    readOnly: { resolvedTitle: true },
  };
}
```

Triggered on: Puck render, field change, component move, `resolveAllData()`.

### Optional: `resolveFields(data, params)`

Dynamically change field configuration.

**Args:**

| Prop | Type | Description |
|------|------|-------------|
| `data.props` | Object | Current component props |
| `data.readOnly` | Object | Fields currently read-only |
| `params.appState` | Object | Current AppState |
| `params.changed` | Object | Which props changed since last call |
| `params.fields` | Object | Static field definitions |
| `params.lastData` | Object | Previous data |
| `params.lastFields` | Object | Previous fields from this function |
| `params.metadata` | Object | Merged metadata |
| `params.parent` | Object | Parent data if inside a slot |

**Example — conditional fields:**

```tsx
resolveFields: (data) => {
  const fields = {
    drink: { type: "radio", options: [
      { label: "Water", value: "water" },
      { label: "Juice", value: "juice" },
    ]},
  };
  if (data.props.drink === "water") {
    return { ...fields, waterType: { type: "radio", options: [
      { label: "Still", value: "still" },
      { label: "Sparkling", value: "sparkling" },
    ]}};
  }
  return fields;
}
```

### Optional: `resolvePermissions(data, params)`

Same args as `resolveData`. Returns a permissions object. Inherits from component-level and global permissions.

```tsx
resolvePermissions: (data) => {
  return { delete: data.props.locked !== true };
}
```

## Root Configuration

The root wraps all content. Configure via `config.root`:

```tsx
root: {
  fields: {
    title: { type: "text" },
    description: { type: "textarea" },
  },
  defaultProps: {
    title: "My Page",
    description: "Lorem ipsum",
  },
  render: ({ children, title, description }) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}
```

Root supports all ComponentConfig params: `fields`, `defaultProps`, `render`, `resolveData`, `resolveFields`, `resolvePermissions`, `metadata`, `permissions`.

**Important:** if root `render` does not render `children`, components won't show unless another `slot` field is defined.

TypeScript:

```tsx
const config: Config<{}, RootProps> = { /* ... */ };
```

## Multi-Column and Nested Layouts

### Slots (replaces DropZone)

Use `slot` fields for nested component regions:

```tsx
const config = {
  components: {
    Container: {
      fields: { content: { type: "slot" } },
      render: ({ content: Content }) => <div><Content /></div>,
    },
    Card: {
      render: () => <div>Hello</div>,
    },
  },
};
```

Data payload for slots:

```json
{
  "type": "Container",
  "props": {
    "id": "Container-1",
    "content": [{ "type": "Card", "props": { "id": "Card-1" } }]
  }
}
```

### Multiple Named Slots (Fixed Layouts)

```tsx
fields: {
  leftColumn: { type: "slot" },
  rightColumn: { type: "slot" },
},
render: ({ leftColumn: Left, rightColumn: Right }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
    <Left />
    <Right />
  </div>
),
```

### Fluid Layouts (CSS Grid/Flex)

Pass `style` or `className` to slot content:

```tsx
render: ({ content: Content }) => (
  <Content style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }} />
),
```

### Slot Params

| Param | Type | Description |
|-------|------|-------------|
| `allow` | string[] | Only allow these component types |
| `disallow` | string[] | Block these component types |
| `style` | CSSProperties | CSS for the slot container |
| `className` | string | CSS class for the slot container |
| `collisionAxis` | "x" \| "y" | Drag collision detection axis |
| `as` | string | HTML element type (default: "div") |
| `ref` | Ref | React ref for the slot element |
| `minEmptyHeight` | number | Minimum height when empty |

### Inline Components in Grids

When using CSS grid/flex layouts with slots, child components may need `inline: true` so `flex-grow`, `grid-column`, `grid-row` work:

```tsx
{
  inline: true,
  render: ({ puck, spanCol }) => (
    <div ref={puck.dragRef} style={{ gridColumn: `span ${spanCol}` }}>
      Content
    </div>
  ),
}
```

## Categories

Group components in the editor sidebar:

```tsx
const config = {
  components: { /* ... */ },
  categories: {
    layout: {
      label: "Layout",
      components: ["Grid", "Flex"],
      defaultExpanded: false,
    },
    content: {
      label: "Content",
      components: ["HeadingBlock", "TextBlock", "ImageBlock"],
    },
    other: {
      label: "Other",
      visible: false, // hide uncategorized
    },
  },
};
```

### Category Params

| Param | Type | Description |
|-------|------|-------------|
| `label` | string | Display label |
| `components` | string[] | Component keys in this category |
| `defaultExpanded` | boolean | Expanded on load (default: true) |
| `visible` | boolean | Show/hide the category (default: true) |

The special `"other"` category catches components not explicitly assigned.

## Rich Text Editing

The `richtext` field provides Tiptap-based rich text:

```tsx
fields: {
  body: {
    type: "richtext",
    options: {
      disableExtensions: ["heading"],
      configureExtensions: {
        link: { openOnClick: false },
      },
    },
  },
}
```

### Richtext Params

| Param | Type | Description |
|-------|------|-------------|
| `type` | "richtext" | Required |
| `contentEditable` | boolean | Inline editing in preview |
| `placeholder` | string | Placeholder text |
| `options.disableExtensions` | string[] | Disable specific Tiptap extensions |
| `options.configureExtensions` | Object | Configure Tiptap extensions |
| `renderMenu` | Function | Custom menu rendering |
| `renderInlineMenu` | Function | Custom inline menu rendering |
| `tiptap.extensions` | Extension[] | Additional Tiptap extensions |
| `tiptap.selector` | string | CSS selector for inline editing container |

### Custom Menus

```tsx
fields: {
  body: {
    type: "richtext",
    renderMenu: ({ children }) => (
      <RichTextMenu>
        <RichTextMenu.Group>
          {children}
        </RichTextMenu.Group>
        <RichTextMenu.Group>
          <RichTextMenu.Control name="custom-action">
            <MyButton />
          </RichTextMenu.Control>
        </RichTextMenu.Group>
      </RichTextMenu>
    ),
  },
}
```

### contentEditable Warning

When `contentEditable: true`, string props become ReactNode objects inside `<Puck>`. Use `string | ReactNode` in TypeScript types.

## Dynamic Props (`resolveData`)

Use when a block's props should be derived or hydrated after edits.

```tsx
resolveData: async ({ props }, { changed, metadata, root, trigger }) => {
  // Guard expensive work
  if (!changed.sourceUrl) return { props };

  const response = await fetch(`/api/preview?url=${props.sourceUrl}`);
  const meta = await response.json();

  return {
    props: { previewTitle: meta.title, previewImage: meta.image },
    readOnly: { previewTitle: true, previewImage: true },
  };
}
```

### Triggers

- `insert` — component was inserted
- `replace` — field value changed
- `move` — component moved between parents
- `load` — editor loaded
- `force` — triggered via `resolveAllData()`

### resolveAllData

Run all resolvers before rendering (critical for server-side rendering):

```tsx
import { resolveAllData } from "@puckeditor/core";

const resolvedData = await resolveAllData(data, config);
// Now safe to pass to <Render />
```

### Bottom-up Resolution

Resolvers execute bottom-up: child components resolve before parents. Parent data in `params.parent` may be unresolved on initial render.

## Dynamic Fields (`resolveFields`)

Use when field configuration depends on current prop values.

```tsx
resolveFields: (data, { changed, fields, lastFields }) => {
  if (!changed.fieldType) return lastFields;
  return {
    title: { type: data.props.fieldType },
  };
}
```

**Limitation:** cannot dynamically add or remove `slot` fields.

## External Data Sources

### External Field

Let editors pick records from async sources:

```tsx
fields: {
  post: {
    type: "external",
    fetchList: async ({ query, filters }) => {
      const res = await fetch(`/api/posts?q=${query}&type=${filters.type}`);
      return res.json();
    },
    mapProp: (item) => ({ postId: item.id, postTitle: item.title }),
    mapRow: (item) => ({ title: item.title, subtitle: item.date }),
    getItemSummary: (item) => item.title,
    showSearch: true,
    filterFields: {
      type: { type: "select", options: [
        { label: "Blog", value: "blog" },
        { label: "News", value: "news" },
      ]},
    },
    renderFooter: ({ items, selectedItems }) => (
      <span>{selectedItems.length} of {items.length} selected</span>
    ),
  },
}
```

### External Field Params

| Param | Type | Description |
|-------|------|-------------|
| `fetchList` | Function | **Required.** Async fetch with `{ query, filters }` args |
| `mapProp` | Function | Transform item to component prop value |
| `mapRow` | Function | Transform item to table row display |
| `getItemSummary` | Function | Summary text for selected items |
| `showSearch` | boolean | Enable search input |
| `filterFields` | Object | Additional filter fields |
| `cache` | boolean | Cache results (default: true) |
| `renderFooter` | Function | Custom footer in selection modal |

### Server-Side Data Fetching

For runtime data in rendered blocks, fetch in the render function or use `resolveData` with metadata:

```tsx
render: async ({ puck, postId }) => {
  const post = await fetchPost(postId);
  return <div>{post.title}</div>;
}
```

Prefer storing stable selectors (IDs/slugs) rather than full data in the Puck payload.

## React Server Components

### Server-Safe Rendering

```tsx
import { Render, resolveAllData } from "@puckeditor/core";

export default async function Page({ data }) {
  const resolvedData = await resolveAllData(data, config);
  return <Render config={config} data={resolvedData} />;
}
```

### Rules

- Config used server-side must avoid client-only imports
- Use `"use client"` for browser-dependent components
- Use `puck.renderDropZone({ zone })` instead of `<DropZone>` in RSC configs
- Keep editor-only code out of server render paths
- Separate configs approach: server config (no `"use client"`) and full config (extends server)

## Data Migration

### Framework Migration (`migrate`)

For Puck's own data model changes between major versions:

```tsx
import { migrate } from "@puckeditor/core";

const migrated = migrate(data, {
  "0.15.0": (data) => {
    // transform for v0.15 breaking changes
    return data;
  },
});
```

### Prop Renaming (`transformProps`)

```tsx
import { transformProps } from "@puckeditor/core";

const migrated = transformProps(data, {
  type: "HeadingBlock",
  prop: "title",
  transform: (props) => ({
    ...props,
    heading: props.title,
    title: undefined,
  }),
});
```

### Recursive Walk (`walkTree`)

```tsx
import { walkTree } from "@puckeditor/core";

const migrated = walkTree(data, (node) => {
  if (node.type === "OldBlock") {
    return { ...node, type: "NewBlock" };
  }
  return node;
});
```

## Viewports

Default viewports: 360px, 768px, 1280px, 100%.

Custom viewports:

```tsx
<Puck
  viewports={[
    { width: 375, label: "iPhone SE", icon: "Smartphone" },
    { width: 768, label: "iPad", icon: "Tablet" },
    { width: 1440, label: "Desktop", icon: "Monitor" },
    { width: "100%", label: "Full" },
  ]}
  // ...
/>
```

### Viewport Params

| Param | Type | Description |
|-------|------|-------------|
| `width` | number \| "100%" | **Required.** Viewport width |
| `height` | number \| "auto" | Optional height (default: auto) |
| `label` | string | Tooltip label |
| `icon` | "Smartphone" \| "Tablet" \| "Monitor" \| ReactNode | Icon in switcher |

Disable iframe (and viewports): `iframe: { enabled: false }`.

## Feature Toggling (Permissions)

### Global Permissions

```tsx
<Puck
  permissions={{ delete: false, drag: false }}
  // ...
/>
```

### Component-Level Permissions

```tsx
components: {
  LockedSection: {
    permissions: { delete: false, drag: false },
    render: () => <div>Locked</div>,
  },
}
```

### Dynamic Permissions

```tsx
resolvePermissions: (data) => ({
  delete: data.props.locked !== true,
  edit: data.props.locked !== true,
})
```

### Supported Permissions

| Permission | Description |
|------------|-------------|
| `delete` | Allow deletion |
| `drag` | Allow drag-and-drop |
| `duplicate` | Allow duplication |
| `edit` | Allow field editing |
| `insert` | Allow insertion |

Check at runtime: `PuckApi.getPermissions(itemSelector)`.

## Overlay Portals

Register interactive elements in preview that bypass the editor overlay:

```tsx
import { registerOverlayPortal } from "@puckeditor/core";

registerOverlayPortal({
  element: document.getElementById("my-button"),
  onMount: () => {},
  onUnmount: () => {},
});
```

Use when a preview element needs direct user interaction (clickable buttons, custom controls).

## Styling

### CSS Bundles

- `puck.css` — full styles including external font loading (Inter)
- `puck-no-external.css` — styles without external font requests

### Iframe Isolation

Preview runs in a same-origin iframe. Configure:

```tsx
<Puck
  iframe={{
    enabled: true,         // default: true
    waitForStyles: true,   // default: true
    syncHostStyles: true,  // default: true
  }}
/>
```

Set `syncHostStyles: false` to fully isolate from host styles.

### CSS Custom Properties

```css
:root {
  --puck-font-family: "Inter", sans-serif;
  --puck-color-heading: #1a1a1a;
  --puck-color-body: #333;
  --puck-color-link: #0066cc;
}
```

## Puck Props Reference

| Prop | Type | Description |
|------|------|-------------|
| `config` | Config | **Required.** Component definitions |
| `data` | Data | **Required.** Initial data (cannot change after mount) |
| `onPublish(data)` | Function | Publish button callback |
| `onChange(data)` | Function | Any data change callback |
| `onAction(action, appState, prevAppState)` | Function | Action dispatched callback |
| `overrides` | Object | UI override definitions |
| `permissions` | Object | Global permissions |
| `plugins` | Plugin[] | Plugin array |
| `viewports` | Viewport[] | Custom viewport definitions |
| `iframe` | IframeConfig | Iframe behavior |
| `ui` | Object | Initial UI state (sidebar visibility, etc.) |
| `height` | string \| number | Editor height (default: 100dvh) |
| `headerTitle` | string | Header title |
| `headerPath` | string | Path shown after title |
| `metadata` | Object | Global metadata for components |
| `fieldTransforms` | Object | Field transform definitions |
| `initialHistory` | Object | Initial undo/redo state |
| `children` | ReactNode | Custom compositional UI |
| `dnd` | Object | Drag-and-drop config |
| `_experimentalFullScreenCanvas` | boolean | Full-screen preview canvas |

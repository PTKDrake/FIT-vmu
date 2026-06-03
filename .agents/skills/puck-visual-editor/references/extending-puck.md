# Extending Puck

## Composition

Build custom editor layouts by passing children to `<Puck>`:

```tsx
<Puck config={config} data={data}>
  <div style={{ display: "grid", gridTemplateColumns: "250px 1fr 300px" }}>
    <Puck.Components />
    <Puck.Preview />
    <Puck.Fields />
  </div>
</Puck>
```

### Compositional Components

| Component | Description |
|-----------|-------------|
| `<Puck.Preview />` | Drag-and-drop preview area |
| `<Puck.Fields />` | Fields panel for selected component |
| `<Puck.Components />` | Draggable component list (drawer) |
| `<Puck.Outline />` | Interactive outline/tree view |
| `<Puck.Layout />` | Standard Puck layout (sidebar + preview + fields) |

### Example: Custom Layout

```tsx
<Puck config={config} data={data}>
  <div className="my-editor">
    <header>
      <h1>My Editor</h1>
      {/* Custom header controls */}
    </header>
    <div className="my-editor-body">
      <aside>
        <Puck.Components />
        <Puck.Outline />
      </aside>
      <main>
        <Puck.Preview />
      </main>
      <aside>
        <Puck.Fields />
      </aside>
    </div>
  </div>
</Puck>
```

### Example: Drawer with Custom Items

```tsx
import { Drawer } from "@puckeditor/core";

<Puck config={config} data={data}>
  <Drawer>
    <Drawer.Item name="HeadingBlock" />
    <Drawer.Item name="TextBlock" />
    {/* Custom non-Puck items between */}
    <div className="my-divider" />
    <Drawer.Item name="ImageBlock" />
  </Drawer>
  <Puck.Preview />
  <Puck.Fields />
</Puck>
```

## Helper Components

### Drawer

A draggable list of components:

```tsx
import { Drawer } from "@puckeditor/core";

<Drawer>
  <Drawer.Item name="HeadingBlock" />
  <Drawer.Item name="TextBlock" />
</Drawer>
```

### FieldLabel

Styled label for custom fields:

```tsx
import { FieldLabel } from "@puckeditor/core";

<FieldLabel label="Color" icon={<PaletteIcon />} />
```

### AutoField

Renders the appropriate field UI for a field definition:

```tsx
import { AutoField } from "@puckeditor/core";

<AutoField
  field={{ type: "text", label: "Title" }}
  name="title"
  value="Hello"
  onChange={(value) => console.log(value)}
/>
```

### ActionBar

Action bar for custom component actions (used in overrides):

```tsx
import { ActionBar } from "@puckeditor/core";

<ActionBar>
  <ActionBar.Group>
    <ActionBar.Label>My Component</ActionBar.Label>
    <ActionBar.Action onClick={handleEdit}>Edit</ActionBar.Action>
    <ActionBar.Separator />
    <ActionBar.Action onClick={handleDelete}>Delete</ActionBar.Action>
  </ActionBar.Group>
</ActionBar>
```

## Plugins

Plugins are reusable editor extensions with dedicated UI space in the plugin rail.

### Plugin Structure

```tsx
const myPlugin = {
  name: "my-plugin",
  label: "My Plugin",
  icon: <PluginIcon />,
  render: () => <MyPluginUI />,
  fieldTransforms: {
    text: ({ value }) => <span>{value}</span>,
  },
  overrides: {
    header: ({ children }) => <div>{children}</div>,
  },
  mobilePanelHeight: 300,
};
```

### Plugin Params

| Param | Type | Description |
|-------|------|-------------|
| `name` | string | **Required.** Unique plugin identifier |
| `label` | string | Display label in plugin rail |
| `icon` | ReactNode | Icon in plugin rail |
| `render` | Function | Plugin UI component |
| `fieldTransforms` | Object | Field transform definitions |
| `overrides` | Object | UI overrides |
| `mobilePanelHeight` | number | Panel height on mobile |

### Usage

```tsx
<Puck
  plugins={[myPlugin, anotherPlugin]}
  config={config}
  data={data}
/>
```

### Official Plugins

| Plugin | Import | Description |
|--------|--------|-------------|
| `blocksPlugin` | `@puckeditor/plugin-blocks` | Block management utilities |
| `fieldsPlugin` | `@puckeditor/plugin-fields` | Enhanced field capabilities |
| `outlinePlugin` | `@puckeditor/plugin-outline` | Interactive outline view |
| `legacySideBarPlugin` | `@puckeditor/core` | Legacy sidebar compatibility |

## UI Overrides

Overrides alter default Puck interface surfaces. Marked as experimental.

### Available Overrides

| Override | Description |
|----------|-------------|
| `actionBar` | Component action bar |
| `componentOverlay` | Overlay on component selection |
| `drawer` | Component drawer |
| `drawerItem` | Individual drawer items |
| `fieldLabel` | Field labels |
| `fields` | Fields panel wrapper |
| `fieldTypes` | Per-field-type rendering |
| `header` | Editor header |
| `headerActions` | Header action buttons |
| `iframe` | Preview iframe wrapper |
| `outline` | Outline panel |
| `preview` | Preview area wrapper |
| `puck` | Entire Puck wrapper |

### Usage via Puck prop

```tsx
<Puck
  overrides={{
    header: () => (
      <div style={{ background: "navy", color: "white", padding: 16 }}>
        Custom Header
      </div>
    ),
    headerActions: ({ children }) => (
      <div>
        {children}
        <button onClick={handleExport}>Export</button>
      </div>
    ),
    actionBar: ({ children, itemSelector }) => (
      <ActionBar>
        <ActionBar.Group>
          {children}
          <ActionBar.Action onClick={() => customAction(itemSelector)}>
            Custom
          </ActionBar.Action>
        </ActionBar.Group>
      </ActionBar>
    ),
  }}
  config={config}
  data={data}
/>
```

### Override Function Signature

Overrides receive the default rendering as a function and can wrap or replace it:

```tsx
overrides: {
  header: ({ children, dispatch, appState }) => {
    // children: default header content
    // dispatch: PuckApi.dispatch for actions
    // appState: current AppState
    return <MyCustomHeader />;
  },
}
```

### Rules

- Overrides are experimental and may change between versions
- Prefer small, local overrides over broad replacements
- If the override surface becomes broad, consider composition instead
- Overrides can also be provided via plugins

## Custom Fields

When built-in fields cannot express the desired UX. See [fields.md](fields.md) for the complete custom field API.

### Strategy

1. Check if a built-in field can be configured to meet the need
2. Check if `resolveFields` can conditionally adjust existing fields
3. Only then implement a custom field

### Example: Color Picker

```tsx
fields: {
  backgroundColor: {
    type: "custom",
    render: ({ value, onChange, field }) => (
      <div>
        <FieldLabel label={field.label || "Background Color"} />
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>{value || "#ffffff"}</span>
      </div>
    ),
  },
}
```

## Field Transforms

Modify field prop values before editor rendering. Apply only in `<Puck>`, not `<Render>`.

### Basic Usage

```tsx
<Puck
  fieldTransforms={{
    text: ({ value, field, name }) => {
      // Transform all text field values
      return <span style={{ color: "blue" }}>{value}</span>;
    },
  }}
  config={config}
  data={data}
/>
```

### Transform Signature

```tsx
type FieldTransform = ({
  value,     // Current field value
  field,     // Field definition
  name,      // Field name/key
}) => ReactNode
```

### Combining with Overlay Portals

Field transforms can render interactive elements that work with overlay portals:

```tsx
fieldTransforms={{
  text: ({ value }) => (
    <span
      onClick={() => { /* inline edit */ }}
      style={{ cursor: "text" }}
    >
      {value}
    </span>
  ),
}}
```

### Distribution via Plugins

Field transforms can be distributed through plugins for reuse:

```tsx
const myPlugin = {
  name: "inline-editing",
  fieldTransforms: {
    text: ({ value }) => <EditableText value={value} />,
  },
};
```

## Internal Puck API

### usePuck

Access editor state inside custom components or overrides:

```tsx
import { usePuck } from "@puckeditor/core";

function MyCustomPanel() {
  const { appState, dispatch, history } = usePuck();
  const { data, ui } = appState;

  return (
    <div>
      <p>Components: {data.content.length}</p>
      <button onClick={() => history.back()}>Undo</button>
    </div>
  );
}
```

### createUsePuck (Selector)

Create a selector-based hook for optimized re-renders:

```tsx
import { createUsePuck } from "@puckeditor/core";

const useContentLength = createUsePuck(
  (state) => state.appState.data.content.length
);

function MyBadge() {
  const count = useContentLength();
  return <span>{count} blocks</span>;
}
```

### useGetPuck

Get the current Puck context (useful for nested components):

```tsx
import { useGetPuck } from "@puckeditor/core";

function MyNestedComponent() {
  const puck = useGetPuck();
  return <div>{puck.appState.data.content.length} items</div>;
}
```

### PuckApi Methods

| Method | Description |
|--------|-------------|
| `dispatch(action)` | Dispatch an editor action |
| `history.back()` | Undo |
| `history.forward()` | Redo |
| `history.set(histories, index)` | Set history state |
| `getPermissions(itemSelector)` | Get permissions for a component |
| `resolveDataById(id)` | Resolve data for a specific component |

### Actions

Dispatch editor state changes:

```tsx
// Replace all data
dispatch({ type: "setData", data: newData });

// Update UI state
dispatch({ type: "setUi", ui: { leftSideBarVisible: false } });

// Generic set (partial data update)
dispatch({ type: "set", state: { data: { root: { props: { title: "New" } } } } });
```

### ItemSelector

Reference a specific component in the tree:

```tsx
const selector = {
  index: 0,                    // Position in parent's content array
  zone: "default-zone",        // Zone name (slot name or "default-zone")
};
```

## Theming

### CSS Custom Properties

```css
:root {
  --puck-font-family: "Inter", sans-serif;
  --puck-color-heading: #1a1a1a;
  --puck-color-body: #333333;
  --puck-color-link: #0066cc;
}
```

### CSS Bundles

| Bundle | Description |
|--------|-------------|
| `@puckeditor/core/dist/puck.css` | Full styles with external font loading |
| `@puckeditor/core/dist/puck-no-external.css` | Styles without external font requests |

### Font Loading

Puck defaults to externally loaded Inter. To self-host:

1. Use the `puck-no-external.css` bundle
2. Provide your own font loading
3. Set `--puck-font-family` to your font stack

### Iframe Style Sync

The preview iframe syncs host styles by default. Configure:

```tsx
<Puck
  iframe={{
    syncHostStyles: true,   // Mirror host styles (default: true)
    waitForStyles: true,    // Wait for styles before preview (default: true)
  }}
/>
```

Set `syncHostStyles: false` to fully isolate the iframe from host styles and `html`/`body` attributes.

## Overlay Portals

Make specific preview elements interactive while the editor overlay is active.

```tsx
import { registerOverlayPortal } from "@puckeditor/core";
import { useEffect, useRef } from "react";

function InteractiveButton() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const cleanup = registerOverlayPortal({
      element: ref.current,
      onMount: () => {},
      onUnmount: () => {},
    });
    return cleanup;
  }, []);

  return <button ref={ref} onClick={handleClick}>Click me</button>;
}
```

### When to Use

- A button inside preview must stay clickable
- Custom controls would otherwise be blocked by the editor overlay
- Interactive widgets need direct user interaction

### Rules

- Register only elements that truly need it
- Keep portal usage local and deliberate
- Clean up on unmount

## Extension Strategy

Reach for extension points in this order:

1. **Component config** — fields, defaultProps, render
2. **Built-in fields** — text, number, select, slot, etc.
3. **Root config** — wrapper, metadata, page-level fields
4. **Slots** — nesting, multi-column, fluid layouts
5. **resolveData / resolveFields** — dynamic behavior
6. **Composition** — custom editor layout
7. **Small overrides** — header, actionBar modifications
8. **Plugins** — editor-wide extensions with rail UI
9. **Custom fields** — bespoke input UIs
10. **Internal API** — usePuck, dispatch, direct state access

If you are reaching for a later step too early, re-check whether a simpler built-in mechanism already solves the problem.

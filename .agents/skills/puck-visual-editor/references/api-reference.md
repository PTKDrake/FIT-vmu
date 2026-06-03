# API Reference

Complete Puck API reference for components, data model, functions, PuckApi, actions, and plugins.

## Core Components

### `<Puck>`

The interactive editor component.

```tsx
import { Puck } from "@puckeditor/core";

<Puck
  config={config}
  data={initialData}
  onPublish={async (data) => { /* save */ }}
/>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | Config | Yes | Component definitions, root, categories |
| `data` | Data | Yes | Initial data (immutable after mount) |
| `onPublish` | `(data: Data) => void` | No | Publish button callback |
| `onChange` | `(data: Data) => void` | No | Any data change callback |
| `onAction` | `(action, appState, prevAppState) => void` | No | Action dispatched callback |
| `overrides` | Object | No | UI overrides (experimental) |
| `permissions` | Permissions | No | Global permissions |
| `plugins` | Plugin[] | No | Plugin array (experimental) |
| `viewports` | Viewport[] | No | Custom viewport definitions |
| `iframe` | IframeConfig | No | Iframe behavior config |
| `ui` | Object | No | Initial UI state |
| `height` | string \| number | No | Editor height (default: 100dvh) |
| `headerTitle` | string | No | Header title text |
| `headerPath` | string | No | Path shown after title |
| `metadata` | Object | No | Global metadata for components |
| `fieldTransforms` | Object | No | Field transform definitions |
| `initialHistory` | Object | No | Initial undo/redo state |
| `children` | ReactNode | No | Compositional UI children |
| `dnd` | DndConfig | No | Drag-and-drop config |
| `_experimentalFullScreenCanvas` | boolean | No | Full-screen preview (experimental) |

#### IframeConfig

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | true | Render preview in iframe |
| `waitForStyles` | boolean | true | Wait for styles before preview |
| `syncHostStyles` | boolean | true | Mirror host styles into iframe |

#### DndConfig

| Param | Type | Description |
|-------|------|-------------|
| `disableAutoScroll` | boolean | Disable auto-scroll on drag near edge |

#### InitialHistory

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `histories` | History[] | Yes | Array of history states |
| `index` | number | Yes | Current history index |
| `appendData` | boolean | No | Append data prop to histories (default: true) |

### `<Render>`

Readonly renderer for saved Puck data.

```tsx
import { Render } from "@puckeditor/core";

<Render config={config} data={savedData} />
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | Config | Yes | Same config used in editor |
| `data` | Data | Yes | Saved Puck data to render |
| `metadata` | Object | No | Global metadata for components |

### `<DropZone>` (Deprecated)

**Use `slot` fields instead.** See the DropZone-to-slots migration guide.

```tsx
// Legacy — do not use for new code
import { DropZone } from "@puckeditor/core";

<DropZone zone="my-zone" allow={["Card"]} disallow={["Hero"]} />
```

| Param | Type | Description |
|-------|------|-------------|
| `zone` | string | Zone identifier |
| `allow` | string[] | Allowed component types |
| `disallow` | string[] | Blocked component types |
| `style` | CSSProperties | CSS for the zone container |
| `className` | string | CSS class |

## Compositional Components

Used as children of `<Puck>` for custom editor layouts.

### `<Puck.Preview>`

The drag-and-drop preview area.

### `<Puck.Fields>`

Fields panel for the currently selected component.

### `<Puck.Components>`

Draggable component list (drawer).

### `<Puck.Outline>`

Interactive outline/tree view.

### `<Puck.Layout>`

Standard Puck layout wrapper (sidebar + preview + fields).

## Helper Components

### `<Drawer>` / `<Drawer.Item>`

```tsx
import { Drawer } from "@puckeditor/core";

<Drawer>
  <Drawer.Item name="HeadingBlock" />
  <Drawer.Item name="TextBlock" />
</Drawer>
```

### `<ActionBar>` / `<ActionBar.Action>` / `<ActionBar.Group>` / `<ActionBar.Label>` / `<ActionBar.Separator>`

```tsx
import { ActionBar } from "@puckeditor/core";

<ActionBar>
  <ActionBar.Group>
    <ActionBar.Label>Component Name</ActionBar.Label>
    <ActionBar.Action onClick={fn}>Action</ActionBar.Action>
    <ActionBar.Separator />
    <ActionBar.Action onClick={fn}>Another</ActionBar.Action>
  </ActionBar.Group>
</ActionBar>
```

### `<FieldLabel>`

```tsx
import { FieldLabel } from "@puckeditor/core";

<FieldLabel label="My Field" icon={<Icon />} />
```

### `<AutoField>`

```tsx
import { AutoField } from "@puckeditor/core";

<AutoField
  field={{ type: "text", label: "Title" }}
  name="title"
  value="Hello"
  onChange={(value) => {}}
/>
```

### `<RichTextMenu>` / `<RichTextMenu.Control>` / `<RichTextMenu.Group>`

```tsx
import { RichTextMenu } from "@puckeditor/core";

<RichTextMenu>
  <RichTextMenu.Group>
    <RichTextMenu.Control name="bold" />
    <RichTextMenu.Control name="italic" />
  </RichTextMenu.Group>
  <RichTextMenu.Group>
    <RichTextMenu.Control name="custom">
      <CustomButton />
    </RichTextMenu.Control>
  </RichTextMenu.Group>
</RichTextMenu>
```

## Data Model

### Data

The top-level persisted payload.

```tsx
type Data = {
  content: ComponentData[];  // Top-level component list
  root: RootData;            // Root-level props and config
  zones?: Record<string, ComponentData[]>;  // Named slot content
};
```

### ComponentData

A single component instance in the tree.

```tsx
type ComponentData = {
  type: string;              // Component type key (must match config)
  props: Record<string, any> & { id: string };  // Field values + unique ID
  readOnly?: Record<string, boolean>;  // Read-only field flags
};
```

### RootData

Root-level data.

```tsx
type RootData = {
  props?: Record<string, any>;  // Root field values
};
```

### AppState

The full editor state.

```tsx
type AppState = {
  data: Data;
  ui: {
    leftSideBarVisible: boolean;
    rightSideBarVisible: boolean;
    itemSelector: ItemSelector | null;
    componentListVisible: boolean;
    viewports: {
      current: { width: number | string; height?: number | string };
      controlsVisible: boolean;
      options: Viewport[];
    };
    isDragging: boolean;
  };
};
```

### ItemSelector

Reference a specific component in the tree.

```tsx
type ItemSelector = {
  index: number;        // Position in parent's content array
  zone?: string;        // Zone name (slot name or "default-zone")
};
```

## Config

### Config Type

```tsx
type Config<
  Components extends Record<string, any> = Record<string, any>,
  RootProps extends Record<string, any> = Record<string, any>
> = {
  components: {
    [K in keyof Components]: ComponentConfig<Components[K]>;
  };
  root?: RootConfig<RootProps>;
  categories?: Record<string, Category>;
};
```

### Category

```tsx
type Category = {
  label?: string;
  components?: string[];
  defaultExpanded?: boolean;  // default: true
  visible?: boolean;          // default: true
};
```

### ComponentConfig

```tsx
type ComponentConfig<Props = Record<string, any>> = {
  render: (props: Props & RenderProps) => ReactNode;
  fields?: Record<string, FieldDefinition>;
  defaultProps?: Partial<Props>;
  label?: string;
  inline?: boolean;
  metadata?: Record<string, any>;
  permissions?: Partial<Permissions>;
  resolveData?: (data: ResolveDataInput, params: ResolveDataParams) => ResolveDataOutput | Promise<ResolveDataOutput>;
  resolveFields?: (data: ResolveFieldsInput, params: ResolveFieldsParams) => FieldDefinitions | Promise<FieldDefinitions>;
  resolvePermissions?: (data: ResolveDataInput, params: ResolvePermissionsParams) => Partial<Permissions> | Promise<Partial<Permissions>>;
};
```

## Functions

### `migrate(data, migrations)`

Upgrade Puck payloads for framework-level data model changes.

```tsx
import { migrate } from "@puckeditor/core";

const migrated = migrate(data, {
  "0.15.0": (data) => { /* transform */ return data; },
});
```

### `transformProps(data, options)`

Rename or transform props across all instances of a component type.

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

### `walkTree(data, transform)`

Recursively walk and transform the component tree.

```tsx
import { walkTree } from "@puckeditor/core";

const migrated = walkTree(data, (node) => {
  if (node.type === "OldName") {
    return { ...node, type: "NewName" };
  }
  return node;
});
```

### `resolveAllData(data, config)`

Run all `resolveData` functions before rendering. **Critical for server-side rendering.**

```tsx
import { resolveAllData } from "@puckeditor/core";

const resolved = await resolveAllData(data, config);
// Safe to pass to <Render />
```

### `registerOverlayPortal(options)`

Register interactive elements in preview that bypass the editor overlay.

```tsx
import { registerOverlayPortal } from "@puckeditor/core";

const cleanup = registerOverlayPortal({
  element: document.getElementById("my-button"),
  onMount: () => {},
  onUnmount: () => {},
});
```

### `setDeep(object, path, value)`

Deeply set a value in a nested object using a dot-notation path.

```tsx
import { setDeep } from "@puckeditor/core";

const result = setDeep(obj, "data.root.props.title", "New Title");
```

## PuckApi

Access via `usePuck()` hook inside custom components or overrides.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `appState` | AppState | Current editor state |
| `dispatch` | `(action) => void` | Dispatch an editor action |
| `history` | HistoryApi | Undo/redo control |
| `getPermissions` | `(selector?) => Permissions` | Check permissions |
| `resolveDataById` | `(id: string) => ComponentData` | Resolve specific component |

### History API

| Method | Description |
|--------|-------------|
| `history.back()` | Undo |
| `history.forward()` | Redo |
| `history.set(histories, index)` | Set history state |

### usePuck

```tsx
import { usePuck } from "@puckeditor/core";

function MyPanel() {
  const { appState, dispatch, history } = usePuck();
  return <div>{appState.data.content.length} blocks</div>;
}
```

### createUsePuck (Selector-based)

```tsx
import { createUsePuck } from "@puckeditor/core";

const useContentCount = createUsePuck(
  (state) => state.appState.data.content.length
);

function Badge() {
  const count = useContentCount();
  return <span>{count}</span>;
}
```

### useGetPuck

```tsx
import { useGetPuck } from "@puckeditor/core";

function NestedComponent() {
  const puck = useGetPuck();
  // Access full puck context
}
```

## Actions

Editor actions dispatched via `PuckApi.dispatch()`.

### `setData`

Replace the entire editor data.

```tsx
dispatch({ type: "setData", data: newData });
```

### `setUi`

Update UI state.

```tsx
dispatch({
  type: "setUi",
  ui: { leftSideBarVisible: false },
});
```

### `set`

Generic partial state update.

```tsx
dispatch({
  type: "set",
  state: {
    data: {
      root: { props: { title: "Updated" } },
    },
  },
});
```

## Permissions

### Supported Permissions

| Permission | Type | Description |
|------------|------|-------------|
| `delete` | boolean | Allow component deletion |
| `drag` | boolean | Allow drag-and-drop |
| `duplicate` | boolean | Allow duplication |
| `edit` | boolean | Allow field editing |
| `insert` | boolean | Allow insertion |

### Levels

1. **Global** — set via `<Puck permissions={...} />`
2. **Component-level** — set in ComponentConfig `permissions`
3. **Dynamic** — set via `resolvePermissions()`

Lower levels inherit from higher levels. More specific settings override general ones.

```tsx
// Global
<Puck permissions={{ delete: false }} />

// Component-level
components: {
  LockedBlock: {
    permissions: { delete: false, drag: false },
    render: () => <div>Locked</div>,
  },
}

// Dynamic
resolvePermissions: (data) => ({
  delete: data.props.locked !== true,
})
```

### Checking at Runtime

```tsx
const perms = PuckApi.getPermissions({ index: 0, zone: "default-zone" });
if (perms.delete) { /* ... */ }
```

## Overrides

All available override surfaces and their signatures.

| Override | Receives | Description |
|----------|----------|-------------|
| `actionBar` | `{ children, itemSelector }` | Component action bar |
| `componentOverlay` | `{ children, itemSelector, isEditing, isSelected }` | Selection overlay |
| `drawer` | `{ children }` | Component drawer |
| `drawerItem` | `{ children, name }` | Individual drawer items |
| `fieldLabel` | `{ children, label, icon, el }` | Field labels |
| `fields` | `{ children }` | Fields panel wrapper |
| `fieldTypes` | Object per field type | Per-field-type rendering |
| `header` | `{ children, dispatch, appState }` | Editor header |
| `headerActions` | `{ children, dispatch, appState }` | Header action buttons |
| `iframe` | `{ children, document }` | Preview iframe wrapper |
| `outline` | `{ children }` | Outline panel |
| `preview` | `{ children }` | Preview area wrapper |
| `puck` | `{ children, dispatch, appState }` | Entire Puck wrapper |

### Example

```tsx
overrides: {
  header: ({ children }) => (
    <div className="custom-header">
      {children}
      <button>Export</button>
    </div>
  ),
  headerActions: ({ children }) => (
    <>
      {children}
      <button>Custom Action</button>
    </>
  ),
}
```

## Plugins

### Plugin Type

```tsx
type Plugin = {
  name: string;
  label?: string;
  icon?: ReactNode;
  render?: () => ReactNode;
  fieldTransforms?: FieldTransforms;
  overrides?: Overrides;
  mobilePanelHeight?: number;
};
```

### Official Plugins

#### blocksPlugin

Block management utilities.

```tsx
import { blocksPlugin } from "@puckeditor/plugin-blocks";
```

#### fieldsPlugin

Enhanced field capabilities.

```tsx
import { fieldsPlugin } from "@puckeditor/plugin-fields";
```

#### outlinePlugin

Interactive outline view.

```tsx
import { outlinePlugin } from "@puckeditor/plugin-outline";
```

#### legacySideBarPlugin

Legacy sidebar compatibility.

```tsx
import { legacySideBarPlugin } from "@puckeditor/core";
```

## Field Transforms

Modify field values before editor rendering (not in `<Render>`).

```tsx
type FieldTransforms = {
  [fieldType: string]: (params: {
    value: any;
    field: FieldDefinition;
    name: string;
  }) => ReactNode;
};
```

```tsx
fieldTransforms={{
  text: ({ value }) => <span className="custom-text">{value}</span>,
  number: ({ value }) => <span className="custom-number">{value}</span>,
}}
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
| `@puckeditor/core/dist/puck.css` | Full styles with Inter font loading |
| `@puckeditor/core/dist/puck-no-external.css` | Styles without external font requests |

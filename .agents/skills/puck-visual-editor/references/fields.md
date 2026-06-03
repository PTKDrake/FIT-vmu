# Fields

Complete field type reference with all API parameters.

## Field Selection Guide

| Need | Field Type |
|------|------------|
| Short scalar string | `text` |
| Multi-line plain text | `textarea` |
| Numeric value | `number` |
| Small fixed exclusive options | `radio` |
| Larger option set | `select` |
| Grouped nested props | `object` |
| Repeatable structured items | `array` |
| Nested drag-and-drop content | `slot` |
| Formatted rich content | `richtext` |
| Async record selection | `external` |
| Bespoke editor UI | `custom` |

## Base Field Params (all fields)

All field types share these optional parameters:

| Param | Type | Description |
|-------|------|-------------|
| `label` | string | Display label (defaults to field key) |
| `labelIcon` | ReactNode | Icon next to label |
| `metadata` | Object | Additional data for the field |
| `visible` | boolean | Show/hide the field (default: true) |

```tsx
fields: {
  title: {
    type: "text",
    label: "Page Title",
    labelIcon: <TitleIcon />,
    metadata: { helpText: "Used in SEO" },
    visible: true,
  },
}
```

## Text Field

Single-line text input.

```tsx
fields: {
  title: {
    type: "text",
    placeholder: "Enter title...",
    contentEditable: false,
  },
}
```

| Param | Type | Description |
|-------|------|-------------|
| `type` | "text" | **Required** |
| `contentEditable` | boolean | Inline editing in preview (default: false) |
| `placeholder` | string | Placeholder text |

**contentEditable warning:** When `true`, string props become ReactNode objects inside `<Puck>`. Use `string | ReactNode` in TypeScript.

## Textarea Field

Multi-line text input.

```tsx
fields: {
  description: {
    type: "textarea",
    placeholder: "Enter description...",
    contentEditable: false,
  },
}
```

| Param | Type | Description |
|-------|------|-------------|
| `type` | "textarea" | **Required** |
| `contentEditable` | boolean | Inline editing in preview (default: false) |
| `placeholder` | string | Placeholder text |

Same contentEditable warning as text field applies.

## Number Field

Numeric input.

```tsx
fields: {
  count: {
    type: "number",
    min: 0,
    max: 100,
    step: 1,
    placeholder: "0",
  },
}
```

| Param | Type | Description |
|-------|------|-------------|
| `type` | "number" | **Required** |
| `min` | number | Minimum value |
| `max` | number | Maximum value |
| `step` | number | Stepping interval |
| `placeholder` | string | Placeholder text |

## Radio Field

Mutually exclusive options.

```tsx
fields: {
  textAlign: {
    type: "radio",
    options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
    ],
  },
}
```

| Param | Type | Description |
|-------|------|-------------|
| `type` | "radio" | **Required** |
| `options` | `{ label: string, value: string \| number \| boolean }[]` | **Required.** Option list |

## Select Field

Dropdown option list.

```tsx
fields: {
  size: {
    type: "select",
    options: [
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
    ],
  },
}
```

| Param | Type | Description |
|-------|------|-------------|
| `type` | "select" | **Required** |
| `options` | `{ label: string, value: string \| number \| boolean }[]` | **Required.** Option list |

## Object Field

Grouped sub-fields. Useful for CTA objects, image metadata, nested config groups.

```tsx
fields: {
  cta: {
    type: "object",
    objectFields: {
      label: { type: "text" },
      href: { type: "text" },
      variant: {
        type: "select",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
        ],
      },
    },
  },
}
```

| Param | Type | Description |
|-------|------|-------------|
| `type` | "object" | **Required** |
| `objectFields` | Object | **Required.** Sub-field definitions |

### Data shape

```json
{
  "cta": {
    "label": "Learn more",
    "href": "/about",
    "variant": "primary"
  }
}
```

### Render access

```tsx
render: ({ cta }) => (
  <a href={cta.href}>{cta.label}</a>
)
```

## Array Field

Repeatable structured items. Good for button lists, badges, features, stats, FAQs.

```tsx
fields: {
  items: {
    type: "array",
    arrayFields: {
      label: { type: "text" },
      href: { type: "text" },
    },
    defaultItemProps: {
      label: "New Item",
      href: "#",
    },
    min: 1,
    max: 10,
    getItemSummary: (item, index) => item.label || `Item ${index + 1}`,
  },
}
```

| Param | Type | Description |
|-------|------|-------------|
| `type` | "array" | **Required** |
| `arrayFields` | Object | **Required.** Item field definitions |
| `defaultItemProps` | Object | Default props for new items |
| `min` | number | Minimum item count |
| `max` | number | Maximum item count |
| `getItemSummary` | `(item, index) => string` | Display label for each item |

### Data shape

```json
{
  "items": [
    { "label": "First", "href": "/first" },
    { "label": "Second", "href": "/second" }
  ]
}
```

### Render access

```tsx
render: ({ items }) => (
  <ul>
    {items.map((item, i) => (
      <li key={i}><a href={item.href}>{item.label}</a></li>
    ))}
  </ul>
)
```

## Slot Field

Nested component region. Replaces the deprecated `<DropZone>`.

```tsx
fields: {
  content: {
    type: "slot",
    allow: ["Card", "TextBlock"],
    disallow: ["HeroBanner"],
  },
}
```

| Param | Type | Description |
|-------|------|-------------|
| `type` | "slot" | **Required** |
| `allow` | string[] | Only allow these component types |
| `disallow` | string[] | Block these component types |
| `style` | CSSProperties | CSS for the slot container |
| `className` | string | CSS class for the slot container |
| `collisionAxis` | "x" \| "y" | Drag collision detection axis |
| `as` | string | HTML element type (default: "div") |
| `ref` | Ref | React ref for the slot element |
| `minEmptyHeight` | number | Minimum height when slot is empty |

### Data shape

Slot values are `ComponentData[]` in the stored payload:

```json
{
  "content": [
    { "type": "Card", "props": { "id": "Card-1" } },
    { "type": "TextBlock", "props": { "id": "TextBlock-1" } }
  ]
}
```

### Render access

Slots are transformed from arrays to render functions at render time:

```tsx
render: ({ content: Content }) => (
  <div style={{ padding: 32 }}>
    <Content />
  </div>
)
```

With style/className:

```tsx
render: ({ content: Content }) => (
  <Content
    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
    className="my-slot"
  />
)
```

### No form control

Slots do not render a standard form control in the fields panel. Content is edited via drag-and-drop in the preview.

### Rules

- Use slots for layout structure, not for arbitrary data blobs
- Restrict allowed blocks where editor safety matters via `allow`/`disallow`
- Use `inline: true` on child components that need CSS grid/flex direct-child behavior
- Prefer slots over the deprecated `<DropZone>` component

## Richtext Field

Tiptap-based rich text editor.

```tsx
fields: {
  body: {
    type: "richtext",
    placeholder: "Write something...",
    contentEditable: false,
    options: {
      disableExtensions: ["heading"],
      configureExtensions: {
        link: { openOnClick: false },
        image: { allowBase64: true },
      },
    },
    renderMenu: ({ children }) => (
      <RichTextMenu>
        <RichTextMenu.Group>{children}</RichTextMenu.Group>
      </RichTextMenu>
    ),
    renderInlineMenu: ({ children }) => (
      <RichTextMenu>{children}</RichTextMenu>
    ),
    tiptap: {
      extensions: [MyCustomExtension],
      selector: ".my-editor",
    },
  },
}
```

| Param | Type | Description |
|-------|------|-------------|
| `type` | "richtext" | **Required** |
| `contentEditable` | boolean | Inline editing in preview |
| `placeholder` | string | Placeholder text |
| `options.disableExtensions` | string[] | Disable Tiptap extensions |
| `options.configureExtensions` | Object | Configure Tiptap extension options |
| `renderMenu` | Function | Custom toolbar menu |
| `renderInlineMenu` | Function | Custom inline (selection) menu |
| `tiptap.extensions` | Extension[] | Additional Tiptap extensions |
| `tiptap.selector` | string | CSS selector for inline editing container |

### RichTextMenu Components

```tsx
import { RichTextMenu } from "@puckeditor/core";

<RichTextMenu>
  <RichTextMenu.Group>
    <RichTextMenu.Control name="bold" />
    <RichTextMenu.Control name="italic" />
  </RichTextMenu.Group>
  <RichTextMenu.Group>
    <RichTextMenu.Control name="custom-action">
      <MyCustomButton />
    </RichTextMenu.Control>
  </RichTextMenu.Group>
</RichTextMenu>
```

### contentEditable

When `true`, the richtext is editable directly in the preview canvas. String props become ReactNode inside `<Puck>`.

## External Field

Async record selection from external data sources.

```tsx
fields: {
  product: {
    type: "external",
    fetchList: async ({ query, filters }) => {
      const params = new URLSearchParams({ q: query, type: filters.type });
      const res = await fetch(`/api/products?${params}`);
      return res.json();
    },
    mapProp: (item) => ({
      productId: item.id,
      productTitle: item.title,
      productImage: item.image,
    }),
    mapRow: (item) => ({
      title: item.title,
      subtitle: `$${item.price}`,
    }),
    getItemSummary: (item) => item.title,
    showSearch: true,
    filterFields: {
      type: {
        type: "select",
        options: [
          { label: "All", value: "" },
          { label: "Electronics", value: "electronics" },
        ],
      },
    },
    cache: true,
    renderFooter: ({ items, selectedItems }) => (
      <div>{selectedItems.length} selected of {items.length}</div>
    ),
  },
}
```

| Param | Type | Description |
|-------|------|-------------|
| `fetchList` | `({ query, filters }) => Promise<Item[]>` | **Required.** Async fetch |
| `mapProp` | `(item) => Object` | Transform item to component prop |
| `mapRow` | `(item) => Object` | Transform item to table row display |
| `getItemSummary` | `(item) => string` | Summary text for selected items |
| `showSearch` | boolean | Enable search input |
| `filterFields` | Object | Additional filter field definitions |
| `cache` | boolean | Cache results (default: true) |
| `renderFooter` | `({ items, selectedItems }) => ReactNode` | Custom modal footer |

### Data flow

1. `fetchList` returns raw items from the API
2. `mapRow` transforms items for display in the selection table
3. `mapProp` transforms the selected item into the component's prop value
4. `getItemSummary` provides text for the selected item badge

### Best practices

- Store only stable selectors (IDs/slugs), not full data, in the Puck payload
- Use `resolveData` to hydrate full data at render time if needed
- Keep the external field focused on selection, not on the entire data fetching architecture

## Custom Field

Bespoke field UI when built-in fields are insufficient.

```tsx
fields: {
  color: {
    type: "custom",
    render: ({ name, value, onChange, field }) => (
      <div>
        <FieldLabel label={field.label || name} />
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    ),
  },
}
```

| Param | Type | Description |
|-------|------|-------------|
| `type` | "custom" | **Required** |
| `render` | `({ name, value, onChange, field }) => ReactNode` | **Required.** Custom render |
| `contentEditable` | boolean | Inline editing in preview |

### Render args

| Arg | Type | Description |
|-----|------|-------------|
| `name` | string | Field name/key |
| `value` | any | Current field value |
| `onChange` | `(value, ui?) => void` | Update value; optional `ui` param for editor state |
| `field` | Object | The full field definition |

### onChange with UI state

```tsx
onChange(newValue, { itemSelector: { index: 0, zone: "default-zone" } })
```

### Key prop for remounting

Use a `key` prop derived from relevant state to force remount when the field needs to reset:

```tsx
render: ({ value, onChange }) => (
  <MyEditor key={value.version} initialValue={value} onSave={onChange} />
)
```

### FieldLabel helper

Use `<FieldLabel>` from Puck for consistent label styling:

```tsx
import { FieldLabel } from "@puckeditor/core";

<FieldLabel label="My Field" icon={<Icon />} />
```

### Best practices

- Keep the custom field value contract predictable (plain objects, not complex class instances)
- Reuse shared repo UI around the field without editing protected base UI files
- Prefer built-in fields before reaching for custom
- Custom fields are appropriate for: media pickers, design token pickers, specialized editors

## AutoField Component

Render the appropriate field UI for any field definition. Useful in custom fields or custom editor UIs:

```tsx
import { AutoField } from "@puckeditor/core";

<AutoField
  field={{ type: "text", label: "Title" }}
  name="title"
  value="Hello"
  onChange={(value) => console.log(value)}
/>
```

## Field Visibility

Control field visibility dynamically:

```tsx
fields: {
  advancedMode: { type: "radio", options: [
    { label: "Off", value: false },
    { label: "On", value: true },
  ]},
  advancedOption: {
    type: "text",
    visible: false, // controlled by resolveFields
  },
}
```

Then use `resolveFields` to toggle:

```tsx
resolveFields: (data) => ({
  advancedMode: { /* ... */ },
  advancedOption: {
    type: "text",
    visible: data.props.advancedMode === true,
  },
})
```

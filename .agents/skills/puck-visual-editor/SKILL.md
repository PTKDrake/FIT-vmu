---
name: puck-visual-editor
description: Build, extend, and persist Puck visual editors for this repository's `web/` frontend. Use when the task mentions Puck, `@puckeditor/core`, page builders, `puck_json`, drag-and-drop CMS blocks, slots, rich text, plugin rail, dynamic props or fields, external data sources, data migration, viewports, Render vs Puck, or custom editor UI.
---

# Puck visual editor

## When to Apply

Activate this skill when work involves any of the following:

- Adding or changing a Puck editor in `web/`
- Rendering stored Puck content in readonly or preview mode
- Editing `web/lib/puck/` config, block registry, block components, or page-builder data helpers
- Working with `puck_json`, `content_format`, Puck root props, or nested slot content
- Building CMS pages with drag-and-drop blocks, categories, rich text, or external data pickers
- Extending the editor with composition, plugins, overrides, custom fields, field transforms, or internal Puck hooks
- Migrating legacy Puck payloads or renaming component types

Use this skill together with:

- `inertia-react-development` for Inertia page flow in `web/pages/`
- `intentui` when composing UI around the editor without touching `web/components/ui`
- `tailwindcss-development` when changing block styling
- `wayfinder-development` when frontend code needs backend routes
- `no-use-effect` for normal React work

Exception:
Puck sometimes needs DOM lifecycle hooks for iframe sync, overlay portals, or editor internals. Use that pattern only when the editor integration genuinely requires it.

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
    - `references/fields.md` for field selection and field-level rules
    - `references/extending-puck.md` for composition, plugins, overrides, custom fields, field transforms, and internal API usage
    - `references/project-integration.md` for repo conventions and concrete file locations
3. Reuse the current config, data helpers, and editor wrappers before creating new abstractions.
4. Keep config, block rendering, persistence, and page wiring separate.
5. If stored payload semantics change, update normalization or migration handling instead of breaking old data.
6. Add or update the smallest relevant test for the affected create, edit, builder, content-update, or render path.

## Non-Negotiables

- Do not create a second ad hoc Puck implementation elsewhere in the repo unless the user explicitly asks for a separate editor product.
- Do not store lossy HTML snapshots as the canonical page-builder payload.
- Do not rename component type keys without migration handling.
- Do not put large blocks of Puck reference material directly into this file; keep it in `references/`.
- Do not edit `web/components/ui` unless the user explicitly asks or no composition-based solution is possible.

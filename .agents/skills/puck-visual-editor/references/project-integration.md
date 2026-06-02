# Project Integration

## Repo Locations

- `web/lib/puck/page-builder-config.tsx`: canonical Puck config registry
- `web/lib/puck/page-builder-data.ts`: types, defaults, parser, serializer, normalization
- `web/lib/puck/blocks/`: block definitions and shared block helpers
- `web/components/page-builder/puck-page-builder.tsx`: interactive editor wrapper
- `web/components/page-builder/puck-page-render.tsx`: readonly renderer
- `tests/Feature/CmsPagesCrudTest.php`: existing feature coverage for page CRUD and builder flow

## Current Repo Conventions

- Frontend lives under `web/`
- Canonical persisted format is `puck_json`
- Pages are built on shared data helpers rather than raw JSON handling in page components
- Config currently groups blocks into four categories:
    - layout blocks
    - content blocks
    - section blocks
    - dynamic blocks
- Root rendering already wraps content in a project-styled article shell
- Editor wrapper already customizes header actions and syncs iframe theme/font behavior

## Data Rules

- Use shared parsing helpers for any inbound value from the database, form state, or seed data
- Safe defaults should come from helper functions, not handwritten inline objects spread across multiple files
- Serialization should happen in one shared place
- If you change the structure of stored Puck data, update normalization logic in the shared data helper

## Block Organization

Prefer this separation:

- `page-builder-data.ts`: Puck data model for this repo
- `page-builder-config.tsx`: categories, root config, registry assembly
- `blocks/*.tsx`: per-block renderers and field definitions
- `blocks/shared.tsx`: shared rendering helpers only
- `puck-page-builder.tsx`: editor wrapper, overrides, save flow, header actions
- `puck-page-render.tsx`: readonly rendering only

## Editing Strategy

When adding a new block:

1. Add or update the type in the shared Puck data definition.
2. Implement the block config and renderer in the nearest existing block file or a new focused block file under `web/lib/puck/blocks/`.
3. Register the component in `page-builder-config.tsx`.
4. Put it in the correct category.
5. Verify parse, serialize, editor, and readonly render behavior.

When changing persistence:

1. Update shared parsing and normalization first.
2. Keep backwards compatibility where possible.
3. Adjust tests that assert `content_format`, redirects, or saved content behavior.

## Testing Expectations

Prefer the smallest affected test surface:

- Page create/edit/builder/show flow
- Content update persistence
- Any parser or serializer helper behavior that now changes

If a task changes only this skill's Markdown and not executable app code, there may be no meaningful product test to run. In that case, at minimum verify the skill file structure and formatting programmatically.

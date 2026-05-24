---
name: blocknotejs
description: Build and maintain BlockNote-based rich text editing for this repository's `web/` frontend and Laravel backend. Use when adding or refactoring CMS editors, readonly rich-content renderers, BlockNote JSON parsing/serialization, file uploads inside the editor, or guarded AI-assisted editor features for posts, staff profiles, units, and documents.
allowed-tools: Read, Grep, Glob
---

# BlockNote.js for VMUFit

## When to Apply

Activate this skill when work involves any of the following:

- Adding or changing a BlockNote editor in `web/`
- Rendering stored BlockNote content in readonly mode
- Parsing, validating, serializing, or submitting BlockNote JSON
- Uploading files from BlockNote to Laravel
- Wiring editor-backed fields for `posts.content`, `staff_profiles.bio`, `units.description`, or `documents.description`
- Considering AI features inside the editor

Use this skill together with:

- `inertia-react-development` for Inertia page and form flow
- `intentui` for visual component conventions under `web/components/ui`
- `tailwindcss-development` when changing editor styling or theme tokens
- `wayfinder-development` when frontend code calls backend routes

## Project Defaults

- Use `@blocknote/core`, `@blocknote/react`, and `@blocknote/shadcn`
- Do not use `@blocknote/mantine` in this repository
- Store BlockNote JSON as the source of truth
- Do not store HTML as canonical CMS content
- Frontend lives in `web/`, not `resources/js/`
- Content fields in the database should remain `LONGTEXT` plus a format field such as `content_format` or `bio_format`
- Default format string is `blocknote_json`

## Implementation Rules

1. Keep editor code modular. Do not build one giant editor component with parsing, upload, rendering, AI, and page-specific logic mixed together.
2. Prefer a shared editor module under `web/components/editor/` or the nearest existing editor directory used by the feature.
3. Keep form state as parsed BlockNote blocks in the browser. Serialize to JSON only when submitting or persisting.
4. Treat malformed or empty persisted content defensively. Parse failures must fall back to a safe empty document.
5. Readonly rendering must use the same content source as the editor. Do not maintain a separate handcrafted HTML representation as the primary payload.
6. Any AI feature must go through a backend-controlled integration. Do not call external AI providers directly from the public browser client.
7. AI editor features are opt-in. Do not add them unless the task explicitly asks for AI behavior.

## Recommended File Shape

Use small focused files when the feature is non-trivial:

```text
web/components/editor/
├── blocknote-editor.tsx
├── blocknote-readonly.tsx
├── blocknote-parse.ts
├── blocknote-types.ts
├── blocknote-upload.ts
└── blocknote-ai.tsx
```

Typical responsibilities:

- `blocknote-types.ts`: shared types and constants
- `blocknote-parse.ts`: parse, serialize, empty-content helpers
- `blocknote-upload.ts`: upload adapter from BlockNote to Laravel
- `blocknote-editor.tsx`: editable wrapper
- `blocknote-readonly.tsx`: readonly renderer
- `blocknote-ai.tsx`: AI-specific extension layer only when needed

## Data Conventions

Use a narrow type surface:

```ts
import type { Block, PartialBlock } from "@blocknote/core";

export type BlockNoteContent = Block[];
export type BlockNoteInitialContent = PartialBlock[];
export type BlockNoteFormat = "blocknote_json";
```

Safe empty content should be minimal:

```ts
export const EMPTY_BLOCKNOTE_CONTENT = [
  {
    type: "paragraph",
    content: "",
  },
];
```

Parsing rules:

- Accept `Block[]`, JSON string, `null`, or `undefined`
- Return a safe empty document on invalid data
- Never throw parsing errors into the UI for normal record display

## Editor Rules

- Initialize BlockNote once per editor instance
- Do not recreate the editor on each keystroke
- Do not derive editor state from props on every render
- Pass a stable `uploadFile` handler when uploads are enabled
- Keep editable and readonly wrappers separate unless the existing codebase already uses a single shared mode-switching abstraction

## Styling Rules

- Import `@blocknote/core/fonts/inter.css` and `@blocknote/shadcn/style.css` once at the frontend entry layer or the existing shared style boundary
- Add `@source "../node_modules/@blocknote/shadcn";` to the main Tailwind v4 CSS entry when required
- Prefer mapping BlockNote/ShadCN variables onto the app's existing theme tokens instead of inventing a parallel theme
- Follow Intent UI tokens and component conventions when wrapping the editor UI

## Upload Rules

BlockNote file upload must use a Laravel-controlled endpoint.

Requirements:

- Use authenticated requests
- Validate MIME type, extension, and size on the backend
- Return a JSON payload with a resolvable file URL
- Authorize uploads with a permission or policy-backed route
- Keep the upload adapter separate from page components

If the frontend needs a route helper, use `wayfinder-development` and generated route/controller helpers rather than hardcoded URLs.

## AI Rules

Only add BlockNote AI features when the user explicitly asks for them.

Before enabling AI, verify all of the following:

- There is a backend proxy or server-side integration point
- Permissions are defined for who may use AI features
- Request limits or rate limiting exist
- License implications of `@blocknote/xl-ai` are acceptable for the project

Do not expose provider secrets or direct provider access in browser code.

## Validation Checklist

Before finishing BlockNote work, check:

- Persisted content is still stored as BlockNote JSON
- Empty or broken JSON does not crash the page
- Editor works in create and edit flows
- Readonly renderer displays stored content correctly
- Upload flow returns usable URLs and handles failures cleanly
- Styling is consistent with the repo's `web/` design system
- Tests cover the parsing/storage boundary when backend or serialization behavior changes

## References

Use these only when you need exact library behavior or API details:

- BlockNote ShadCN setup: `https://www.blocknotejs.org/docs/getting-started/shadcn`
- React overview: `https://www.blocknotejs.org/docs/react/overview`
- Editor setup: `https://www.blocknotejs.org/docs/getting-started/editor-setup`
- Import/export: `https://www.blocknotejs.org/docs/features/import`
- AI overview: `https://www.blocknotejs.org/docs/features/ai`

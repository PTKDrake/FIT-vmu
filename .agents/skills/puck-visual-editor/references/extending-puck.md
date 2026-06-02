# Extending Puck

## Composition

Composition is the main way to build a custom editor shell.

Puck exposes compositional building blocks such as:

- preview
- component drawer
- fields panel
- outline

Use composition when:

- the default editor chrome is the wrong shape
- the project needs a custom layout around standard editor parts
- the feature needs a custom workspace without rewriting editor internals

Prefer composition over editing protected shared UI files.

## Helper Components

Puck also exposes lower-level helpers for deeper editor customization.

Use them only when compositional primitives are not enough.

## Plugins

Plugins are for reusable editor extensions with dedicated UI space.

Typical plugin responsibilities:

- tool UIs in the plugin rail
- shared editor utilities
- extra override registration
- field transform registration

Use a plugin when the feature is editor-wide and persistent, not when it is just one local button.

## UI Overrides

Overrides alter the default Puck interface.

Use overrides when:

- one default surface needs a custom presentation
- header actions need repo-specific controls
- drawer or field rendering needs small but important changes

Rules:

- Overrides are experimental and more fragile than ordinary component work.
- Prefer small, local overrides.
- If the override surface becomes broad, move to composition instead.

## Custom Fields

Custom fields are appropriate when the input UX is unique enough that built-in fields are a poor fit.

Rules:

- Keep their value contract predictable.
- Avoid coupling a custom field to too many unrelated app concerns.

## Field Transforms

Field transforms modify props before editor rendering.

Use them for editor-only behavior such as:

- inline editing behavior
- field-type-specific render adaptation

Rules:

- Field transforms apply in `<Puck>`, not `<Render>`.
- Do not rely on them for persisted frontend runtime behavior.

## Internal Puck API

Internal hooks expose current editor state and operations.

Use them when:

- custom header actions need current data
- compositional or custom editor pieces need direct editor access
- an extension cannot be expressed with normal props and callbacks

Rules:

- Keep internal API usage small and contained.
- Treat it as tighter coupling to editor internals than normal config-based work.

## Theming

Puck theming is intentionally limited.

Supported theming work is mainly about:

- fonts
- limited theme-level adjustments

Prefer composition and overrides for larger interface changes.

## Fonts

Puck defaults to an externally loaded Inter setup.

If the project must self-host or avoid external font loading:

- switch from the primary CSS bundle to the no-external bundle

In this repo, editor iframe font synchronization already exists. Reuse the existing approach before inventing another one.

## Extension Strategy

Reach for extension points in this order:

1. ordinary component config
2. built-in fields
3. root config
4. slots
5. `resolveData` or `resolveFields`
6. composition
7. small local overrides
8. plugins
9. custom fields
10. internal API

If you are reaching for a later step too early, re-check whether a simpler built-in mechanism already solves the problem.

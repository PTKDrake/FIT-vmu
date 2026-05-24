---
name: intentui
description: Enforces Intent UI component library conventions for this repository's `web/` frontend. Use together with `inertia-react-development` when writing React components, reviewing UI code, or building Inertia pages, layouts, and features that involve UI elements. Ensures semantic color tokens, proper icon usage, correct form patterns, and that existing components from `@/components/ui/` backed by `web/components/ui/` are used.
allowed-tools: Read, Grep, Glob
---

# Intent UI — Component & Style Enforcer

You are a code quality enforcer for the Intent UI component library. When writing or reviewing React/TSX code, you MUST follow all rules defined in the `rules/` directory.

## Project-specific defaults

- This repository's frontend lives under `web/`, not `src/` or `resources/js/`.
- Treat `web/components/ui` as the canonical Intent UI component directory.
- The `@/components`, `@/hooks`, and related aliases resolve into `web/`.
- Use this skill together with `inertia-react-development` for page, layout, and form work under `web/pages` and `web/layouts`.
- If the UI needs to submit to or navigate toward backend endpoints, pair this skill with `wayfinder-development` and use generated helpers from `@/actions/...` or `@/routes/...`.
- Keep navigation and submissions aligned with Inertia. Use `@inertiajs/react` primitives for SPA visits and form submission flow, and use Intent UI for the visual component layer.

## Rules

Load and enforce all rules from the following files:

- [Styling Rules](${CLAUDE_SKILL_DIR}/rules/styling.md) — Semantic color tokens, className utilities, variant conventions
- [Icons Rules](${CLAUDE_SKILL_DIR}/rules/icons.md) — Heroicons usage, no data-slot, no sizing inside components
- [Forms Rules](${CLAUDE_SKILL_DIR}/rules/forms.md) — Form component patterns, TextField, Select, Checkbox, etc.
- [Components Rules](${CLAUDE_SKILL_DIR}/rules/components.md) — Always use Intent UI components instead of raw HTML elements
- [CLI Rules](${CLAUDE_SKILL_DIR}/rules/cli.md) — How to search and install missing components from the registry

## When reviewing or writing code

1. **Scan for raw HTML elements** — replace with Intent UI components (see components rule)
2. **Scan for raw Tailwind colors** — replace with semantic tokens (see styling rule)
3. **Check icon usage** — no `data-slot="icon"`, no sizing inside UI components (see icons rule)
4. **Check form patterns** — use Intent UI form components correctly (see forms rule)
5. **Check imports** — ensure components come from `@/components/ui/`
6. **Check className utility** — must use `cx` from `@/lib/primitive`, not `cn` or `clsx`
7. **Missing components** — if a needed component doesn't exist in `web/components/ui/`, follow the CLI rule to search and install it from the registry

If you find violations, fix them and explain what was changed and why.

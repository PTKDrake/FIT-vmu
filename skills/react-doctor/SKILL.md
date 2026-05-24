---
name: react-doctor
description: Use when finishing a frontend feature, auditing React health, or before merging React changes. Runs the repository's local react-doctor baseline and keeps diagnostics from regressing.
version: "1.0.0"
---

# React Doctor

This repository uses `react-doctor` through the local `pnpm doctor` scripts and `react-doctor.config.json`.

## Commands

Run the baseline scan:

```bash
pnpm doctor
```

Run the stricter warning-gated scan:

```bash
pnpm doctor:strict
```

## Expectations

- Run `pnpm doctor` after meaningful React changes.
- Fix `error` findings before finalizing work.
- Use config overrides only for generated files, framework artifacts, and intentional escape hatches such as `web/hooks/use-mount-effect.ts`.

## Related Files

- `react-doctor.config.json`
- `.oxlintrc.json`
- `skills/no-use-effect/SKILL.md`

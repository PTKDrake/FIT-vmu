# Project Docs

This project keeps documentation in domain folders, following the same shape used in `~/Project/voc`.

Use this structure for all future documentation:

- `docs/laravel/` for backend architecture, request flow, actions, jobs, policies, and framework conventions
- `docs/frontend/` for Inertia, React, shadcn/ui, Tailwind, and browser-side patterns
- `docs/testing/` for Pest, architecture tests, verification commands, and quality gates
- `docs/research/` for temporary implementation research, design notes, and handoff context when needed

Current source-of-truth documents:

- [Laravel Architecture](./laravel/architecture.md)
- [Deploy Ubuntu VPS với PostgreSQL](./laravel/deploy-ubuntu-postgresql.md)
- [Actions Base](./laravel/actions-base.md)
- [Frontend Overview](./frontend/overview.md)
- [Testing Overview](./testing/overview.md)

When adding a new document, place it under the closest domain folder instead of creating more flat files in `docs/`.

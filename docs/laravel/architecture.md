# Laravel Architecture

This project is built on the Laravel 13 React starter kit and stays server-driven through Laravel + Inertia.

## Core Rules

- Keep the existing Laravel starter kit flow for auth, dashboard, settings, and page rendering.
- Treat Laravel as the source of truth for routing, authorization, validation, persistence, and page composition.
- Keep controllers thin. Controllers coordinate HTTP concerns only and delegate domain work immediately.
- Put domain logic in `app/Actions/<Domain>/<VerbNoun>Action.php`.
- Prefer invokable controllers and invokable actions.
- Use named routes and Wayfinder-generated functions for frontend route usage.
- Keep app structure additive. Do not introduce new top-level architecture folders without a clear need.

## Backend Boundaries

- Controllers own HTTP-only concerns: request validation, authorization entrypoints, response formatting, redirects, and Inertia page rendering.
- Actions own business workflows, database writes, orchestration, and reusable domain decisions.
- Models own relationships, casts, scopes, and persistence-adjacent model behavior.
- Form requests own validation and authorization for write endpoints.
- Query-only read models or page payload builders should stay separate from mutating actions when the read path grows beyond trivial data assembly.

## Directory Guidance

- `app/Actions/` contains business operations grouped by domain.
- `app/Http/Controllers/` contains thin HTTP endpoints.
- `app/Http/Requests/` contains endpoint-specific request contracts.
- `web/pages/` contains Inertia pages.
- `web/components/` contains reusable React UI.
- `web/actions/` and `web/routes/` are generated Wayfinder outputs and should remain aligned with Laravel routes/controllers.

## Preferred Workflow

1. Add or update the request contract if input changes.
2. Add or update the action that performs the domain operation.
3. Keep the controller as a thin adapter into the action.
4. Render or submit through Inertia using Wayfinder helpers.
5. Add or update Pest tests for the behavior change.

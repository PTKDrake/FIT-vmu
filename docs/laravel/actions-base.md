# Actions Base

This file is the source of truth for action-oriented backend development in this project.

It follows the conventions from `.agents/skills/laravel-actions/SKILL.md` and should be used whenever backend behavior changes.

## Purpose

Every business operation lives in an action.

Controllers, jobs, listeners, and providers should not contain domain logic. They delegate to actions.

## Action Conventions

- Path: `app/Actions/<Domain>/<VerbNoun>Action.php`
- Naming: `{Verb}{Entity}Action`
- Public API: one `__invoke()` method
- Design: single responsibility, composable, stateless, type-safe
- Return types: always explicit
- Parameters: always explicit and typed

Examples:

- `CreateNewUserAction`
- `GetDashboardPanelsAction`
- `UpdateUserProfileAction`
- `ResetUserPasswordAction`

## What Belongs In An Action

- Database writes
- Multi-step workflows
- Business guards and domain decisions
- Reusable orchestration shared by multiple entrypoints
- Payload assembly that is part of a business use case
- Transactional write flows

## What Does Not Belong In An Action

- Raw HTTP request handling
- Redirect decisions that are purely transport-level
- Inertia page rendering
- View-only formatting details
- Generic catch-all service classes

## Composition Rules

- Prefer one focused action over a large service object.
- Compose actions through constructor injection when a workflow spans multiple operations.
- Use private helper methods to break down complex internals.
- Wrap multi-write flows in `DB::transaction()`.
- Guard business invariants before performing writes.

## Controller Pattern

Controllers should read like transport adapters:

1. Accept a typed request or route-bound models.
2. Authorize at the HTTP boundary when needed.
3. Call one action.
4. Return an Inertia response, redirect, JSON response, or file response.

A controller should not contain inline domain branching, direct write payload construction, or multi-step persistence logic.

## Request And Action Relationship

- Use app-specific request classes for endpoints that accept input.
- Normalize and validate input in the request.
- Pass validated and typed data into the action.
- Do not call `input()` or `get()` inside actions.

## Project-Level Expectations

- New business behavior should default to a new or updated action.
- Simple CRUD still belongs in actions if it mutates the domain.
- Avoid introducing `app/Services` for domain logic that fits the action pattern.
- If a flow grows complex, split it into smaller composed actions instead of growing one class indefinitely.

## Recommended Review Questions

- Does the controller do anything besides HTTP concerns?
- Is the domain write logic isolated in an action?
- Is the action named after a single business operation?
- Are multi-write operations wrapped in a transaction?
- Can another entrypoint reuse this action without pulling in HTTP concerns?

# Testing Overview

Testing is required for every behavior change.

## Primary Tools

- Pest for feature and unit tests
- Laravel HTTP tests for request and auth flows
- Architecture tests for project conventions
- PHPStan and Pint through Composer checks
- Oxlint and TypeScript checks for frontend verification

## Backend Checks

- `composer check`
- `php artisan test --compact <path>` for targeted runs while iterating
- `composer analyse`
- `composer format:test`

## Frontend Checks

- `pnpm check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm typecheck:tsc`
- `pnpm build`

## Expectations

- Add or update tests for every meaningful backend behavior change.
- Prefer targeted test runs during implementation, then finish with broader project checks when possible.
- Keep Pest as the default testing style.
- If you change architecture conventions, update the related architecture tests too.

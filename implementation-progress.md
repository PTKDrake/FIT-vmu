# Page Builder + Site Layout Builder Progress

## 2026-06-02

- Read project AGENTS instructions and activated the relevant skills: Puck visual editor, Laravel best practices, Inertia React, Wayfinder, Pest, and modern web guidance.
- Queried Laravel Boost docs for the current Laravel/Inertia/Pest versions before changing code.
- Inspected the existing Puck stack, CMS page controllers, requests, models, route definitions, CMS navigation, and page create/edit UI.
- Confirmed repository PHP wrappers exist and used `./phpw` for Artisan commands.
- Scaffolded `App\Models\SiteLayout` and `database/factories/SiteLayoutFactory.php`.
- Scaffolded migration `2026_06_02_081848_create_site_layouts_table.php`.
- Added `site_layouts` schema with 4 nullable Puck slot columns, status, and default marker.
- Added nullable `pages.site_layout_id` foreign key.
- Implemented `SiteLayout` model/factory/data/policy.
- Implemented layout create/update/delete/status/default actions.
- Added CMS layout controllers and `cms.layouts.*` routes.
- Wired `site_layout_id` into Page create/update metadata flow and CMS page form props.
- Added empty-slot Puck parser/serializer helper so layout slots do not fall back to the page template.
- Split Puck configs into page, header, footer, and side configs while keeping `vmuFitPageBuilderConfig` as an alias.
- Added `AuthStatus` Puck block for login/register/profile menu rendering from Inertia shared auth props.
- Added generic layout slot builder, layout CMS form tabs, and CMS `Layouts` index/create/edit pages.
- Added `SiteLayoutShell` and public `/{page:slug}` renderer with explicit layout/default layout fallback.
- Added `site_layout_id` selector to CMS Page create/edit forms.
- Regenerated Wayfinder routes/actions into `web/`.
- Added feature tests for layout CRUD/default guards and public layout fallback.
- Ran Prettier on touched web files and Pint on dirty PHP files.
- Verification passed: `pnpm typecheck`, `pnpm build`, `node --test web/tests/puck-layout-blocks-config.test.mjs`, and `./phpw artisan test --compact tests/Feature/CmsSiteLayoutsTest.php tests/Feature/CmsPagesCrudTest.php`.
- PHPStan command currently exits with code 44 but prints no diagnostics in this environment, including direct `./phpw vendor/bin/phpstan analyse --memory-limit=2G --no-progress -vvv`.

## Remaining From Original Plan

- Rich visual picker UI inside Puck fields can be improved later. MVP source endpoints exist and blocks accept selector IDs.
- PHPStan command still exits with code 44 but prints no diagnostics in this environment.

## Current Focus

- Final verification and summary.
- Follow-up request: replace four separate Header/Left/Right/Footer layout editor tabs with one shared Puck builder canvas.
- Added internal `SiteLayoutFrame` Puck component with four slot fields: header, left, right, and footer.
- Added `layoutBuilderConfig` so the root palette only creates the site layout frame while each slot constrains allowed blocks by region.
- Added `site-layout-builder-data` helpers to compose four persisted slot JSON payloads into one editor payload and split them again before saving.
- Updated CMS `SiteLayoutForm` to show General metadata plus one `PuckLayoutBuilder`; backend payload remains unchanged with separate `header_data`, `left_data`, `right_data`, and `footer_data`.
- Updated node source checks for the shared layout builder frame and split/compose helpers.
- Verification passed for the shared builder change: `pnpm typecheck`, `pnpm build`, `node --test web/tests/puck-layout-blocks-config.test.mjs`, and `./phpw artisan test --compact tests/Feature/CmsSiteLayoutsTest.php tests/Feature/CmsPagesCrudTest.php`.

## Dynamic Data Completion

- Added `BuildPuckDynamicDataAction` to hydrate active/published navigation menus, posts, categories, staff, units, and pages.
- Public page rendering and CMS page preview now receive `dynamicData` Inertia props.
- Added CMS source endpoint `GET /cms/layout-builder/sources/{source}` for `navigation-menus`, `posts`, `categories`, `staff`, `units`, and `pages`.
- Replaced dynamic block mock usage with live `dynamicData` reads and graceful empty states.
- Added dynamic blocks: `NavigationMenu`, `Categories`, `PageLinks`, `LinkList`, and `ContactInfo`.
- Updated page/header/footer/side Puck palettes to expose the right dynamic blocks per region.
- Added tests for source endpoints and public dynamic data hydration.
- Verification passed after dynamic work: `pnpm typecheck`, `pnpm build`, `node --test web/tests/puck-layout-blocks-config.test.mjs`, and `./phpw artisan test --compact tests/Feature/CmsSiteLayoutsTest.php tests/Feature/CmsPagesCrudTest.php`.

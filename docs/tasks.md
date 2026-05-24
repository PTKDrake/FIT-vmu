# VMUFit Task Tracking

> Repository note: git đã được khởi tạo với branch mặc định `master` theo chỉ định hiện tại, dù guideline gốc dùng `main`.

## Status convention

- `todo`: chưa làm
- `doing`: đang làm
- `review`: đã mở PR hoặc chờ review
- `blocked`: đang bị chặn
- `done`: đã hoàn tất

## Phase snapshot

| Phase | Mục tiêu | Status | Notes |
| --- | --- | --- | --- |
| 0 | Setup, package nền, tracking, quality gate | done | Dependency backend/frontend đã có sẵn; tracking đã tạo; Inertia testing config đã được chỉnh cho cấu trúc `web/pages` |
| 1 | Auth, role, permission | done | Task 1.1, 1.2, 1.3 đã xong |
| 2 | Database domain MVP | todo | Chưa bắt đầu |
| 3 | Backend actions, data objects, policy | todo | Chưa bắt đầu |
| 4 | Frontend CMS foundation | todo | Chưa bắt đầu |
| 5 | Module nội dung chính | todo | Chưa bắt đầu |
| 6 | Public website MVP | todo | Chưa bắt đầu |
| 7 | Testing, hardening, release MVP | todo | Chưa bắt đầu |

## Task board

| ID | Phase | Task | Status | Branch | PR | Files touched | Test commands | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0.1 | Setup | Backend packages | done | `chore/phase-0-setup` |  | `composer.json`, `composer.lock`, `config/permission.php`, `config/inertia.php`, `database/migrations/2026_05_24_114350_create_permission_tables.php`, `phpunit.xml` | `./phpw artisan test --compact tests/Feature/ExampleTest.php tests/Feature/DashboardTest.php` | Package đã có sẵn; đã sửa Inertia test page path sang `web/pages` và tắt SSR trong test |
| 0.2 | Setup | Frontend packages | done | `chore/phase-0-setup` |  | `package.json`, `pnpm-lock.yaml` | `pnpm lint`, `pnpm typecheck` | BlockNote, `react-hook-form`, `zod`, `@tanstack/react-table`, `nuqs`, `react-dropzone`, `date-fns` đã có sẵn trong baseline |
| 0.3 | Setup | Task tracking document | done | `chore/phase-0-setup` |  | `docs/tasks.md` | `./phpw artisan test --compact tests/Feature/ExampleTest.php tests/Feature/DashboardTest.php`, `pnpm lint`, `pnpm typecheck` | Tạo file tracking dùng chung cho các phase tiếp theo |
| 0.4 | Setup | GitHub Actions test workflow | done | `chore/github-actions-tests` |  | `.github/workflows/tests.yml`, `AGENTS.md`, `composer.json`, `phpstan.neon.dist`, `app/PHPStan/*`, `tests/Architecture/*`, `docs/tasks.md` | `python3 -c "import pathlib, yaml; yaml.safe_load(pathlib.Path('.github/workflows/tests.yml').read_text())"`, `./composerw analyse`, `./phpw artisan test --compact tests/Architecture`, `pnpm doctor:strict`, `pnpm check` | Tạo CI workflow cho PHP 8.5, SQLite, Pint, Larastan, Pest và frontend checks ở root; đồng bộ custom PHPStan rules và architecture tests; xác nhận React Doctor đã setup nhưng chưa đủ sạch để làm CI gate bắt buộc |
| 1.1 | Auth | Configure Spatie permission for User | done | `feature/auth-spatie-config` |  | `app/Models/User.php`, `tests/Feature/Auth/PermissionConfigurationTest.php` | `./phpw artisan migrate --no-interaction`, `./phpw artisan test --compact tests/Feature/Auth/PermissionConfigurationTest.php` | Đã thêm `HasRoles` cho `User`, dùng guard `web`, xác nhận không thêm `users.role` hoặc `is_admin`; migration permission tables chạy thành công |
| 1.2 | Auth | Seeder roles and permissions | done | `feature/auth-permission-seeder` |  | `database/seeders/RoleAndPermissionSeeder.php`, `database/seeders/DatabaseSeeder.php`, `tests/Feature/RoleAndPermissionSeederTest.php` | `vendor/bin/pint --dirty --format agent`, `./phpw artisan test --compact tests/Feature/RoleAndPermissionSeederTest.php` | Đã seed 5 role MVP, 35 permission theo guideline, sync mapping idempotent và flush permission cache trước/sau khi seed |
| 1.3 | Auth | `Gate::before` for super-admin | done | `feature/auth-super-admin-gate` |  | `app/Providers/AppServiceProvider.php`, `tests/Feature/SuperAdminGateTest.php` | `vendor/bin/pint --dirty --format agent`, `./phpw artisan test --compact tests/Feature/SuperAdminGateTest.php` | Đã thêm `Gate::before` trả `true` cho `super-admin`, trả `null` cho user khác, và test chứng minh bypass không làm sai permission check thường |
| 2.1 | Domain DB | Students and staff profiles | todo | `feature/db-students-staff-profiles` |  | `database/migrations/*`, `app/Models/*` | `./phpw artisan test --compact` |  |
| 2.2 | Domain DB | Units, positions, staff appointments | todo | `feature/db-units-positions-appointments` |  | `database/migrations/*`, `app/Models/*` | `./phpw artisan test --compact` |  |
| 2.3 | Domain DB | Posts, documents, document rows, media | todo | `feature/db-content-tables` |  | `database/migrations/*`, `app/Models/*` | `./phpw artisan test --compact` |  |
| 3.1 | Backend | Foundation data objects | todo | `feature/backend-data-objects` |  | `app/Data/*` | `./phpw artisan test --compact` |  |
| 3.2 | Backend | Posts policy and form requests | todo | `feature/posts-policy-validation` |  | `app/Policies/*`, `app/Http/Requests/*` | `./phpw artisan test --compact` |  |
| 3.3 | Backend | Documents policy and form requests | todo | `feature/documents-policy-validation` |  | `app/Policies/*`, `app/Http/Requests/*` | `./phpw artisan test --compact` |  |
| 3.4 | Backend | Query builder for CMS lists | todo | `feature/cms-query-builders` |  | `app/*QueryBuilder*`, `app/Http/Controllers/*` | `./phpw artisan test --compact` |  |
| 4.1 | Frontend Foundation | Admin layout and permission-aware navigation | todo | `feature/admin-layout-navigation` |  | `web/layouts/*`, `web/components/*` | `pnpm lint`, `pnpm typecheck` |  |
| 4.2 | Frontend Foundation | BlockNote editor wrapper | todo | `feature/blocknote-wrapper` |  | `web/components/*` | `pnpm lint`, `pnpm typecheck` |  |
| 4.3 | Frontend Foundation | Table foundation with TanStack Table and nuqs | todo | `feature/table-foundation` |  | `web/components/*` | `pnpm lint`, `pnpm typecheck` |  |
| 4.4 | Frontend Foundation | Upload foundation with react-dropzone | todo | `feature/upload-foundation` |  | `web/components/*` | `pnpm lint`, `pnpm typecheck` |  |
| 5.1 | CMS | Media module | todo | `feature/media-module` |  | `app/*`, `web/*` | `./phpw artisan test --compact`, `pnpm lint`, `pnpm typecheck` |  |
| 5.2 | CMS | Units and positions module | todo | `feature/units-positions-module` |  | `app/*`, `web/*` | `./phpw artisan test --compact`, `pnpm lint`, `pnpm typecheck` |  |
| 5.3 | CMS | Staff profiles module | todo | `feature/staff-profiles-module` |  | `app/*`, `web/*` | `./phpw artisan test --compact`, `pnpm lint`, `pnpm typecheck` |  |
| 5.4 | CMS | Posts module | todo | `feature/posts-module` |  | `app/*`, `web/*` | `./phpw artisan test --compact`, `pnpm lint`, `pnpm typecheck` |  |
| 5.5 | CMS | Standard documents module | todo | `feature/documents-module` |  | `app/*`, `web/*` | `./phpw artisan test --compact`, `pnpm lint`, `pnpm typecheck` |  |
| 5.6 | CMS | Personalized Excel by `student_code` | todo | `feature/personalized-excel-documents` |  | `app/*`, `web/*` | `./phpw artisan test --compact`, `pnpm lint`, `pnpm typecheck` |  |
| 6.1 | Public | Public pages MVP | todo | `feature/public-pages-mvp` |  | `app/*`, `web/*` | `./phpw artisan test --compact`, `pnpm lint`, `pnpm typecheck` | Gồm home, posts, staff, units, documents, login, khu vực sinh viên |
| 7.1 | Release | Testing, hardening, release MVP | todo | `feature/release-hardening` |  | `tests/*`, `app/*`, `web/*` | `./phpw artisan test --compact`, `./composerw analyse`, `pnpm check` |  |

## Definition of Ready

- [ ] Mục tiêu task rõ ràng.
- [ ] Phạm vi file hoặc directory dự kiến đã xác định.
- [ ] Không trùng người thực hiện với task đang sửa cùng file nhạy cảm.
- [ ] Có branch name.
- [ ] Có lệnh kiểm tra tối thiểu.
- [ ] Có tiêu chí hoàn thành.

## Definition of Done

- [ ] Code chạy được ở local.
- [ ] Migration chạy được nếu có thay đổi database.
- [ ] Seeder chạy được nếu có thay đổi seed.
- [ ] Không thêm field hoặc schema ngoài guideline nếu chưa thống nhất.
- [ ] Authorization backend đã được kiểm tra nếu task có route hoặc action bảo vệ.
- [ ] Frontend không hardcode role.
- [ ] Có test tối thiểu hoặc nêu rõ lý do chưa test được.
- [ ] Đã chạy format, lint, typecheck phù hợp.
- [ ] Đã cập nhật `docs/tasks.md`.
- [ ] PR mô tả rõ file đã sửa và cách kiểm tra.

## Tracking rules

- Khi bắt đầu task: chuyển `todo` sang `doing`, điền `Branch`.
- Khi mở PR: chuyển `doing` sang `review`, điền `PR`.
- Khi bị chặn: chuyển `blocked`, ghi rõ lý do trong `Notes`.
- Khi merge hoặc hoàn tất: chuyển `done`.
- Các file dễ conflict như `composer.json`, `composer.lock`, `package.json`, `pnpm-lock.yaml`, `app/Models/User.php`, `routes/web.php`, `web/layouts/*`, `web/components/ui/*`, `docs/tasks.md` cần được điều phối trước khi nhận task.

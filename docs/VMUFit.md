# VMUFit

## 1. Mục đích tài liệu

Tài liệu này mô tả trạng thái hiện tại của dự án `FIT-vmu`, không phải bản định hướng MVP cũ.

Mục tiêu:

- phản ánh đúng kiến trúc đang có trong repo
- ghi rõ module nào đã chạy thật, module nào mới dừng ở domain hoặc UI placeholder
- thống nhất cách hiểu về auth, permission, CMS và content model
- tách rõ site shell, template và content cho public render
- giúp người mới vào dự án đọc một lần là nắm được phạm vi hiện tại

Thời điểm cập nhật: `2026-06-04`

---

## 2. Tổng quan hệ thống

VMUFit hiện là một ứng dụng Laravel + Inertia React phục vụ hai lớp chức năng:

- website public
- CMS quản trị nội dung và dữ liệu nội bộ

Repo hiện đã có nền tảng khá đầy đủ cho CMS, authorization, content domain và public rendering cơ bản. Public-facing content đã dùng dữ liệu thật cho page, category và post, kèm site layout và visibility rules.

Các nhóm tính năng chính đang tồn tại trong codebase:

- xác thực tài khoản nội bộ, email verification và Google OAuth
- dashboard CMS
- quản lý bài viết và danh mục bài viết
- quản lý page bằng editor/builder
- quản lý site layout dùng chung bằng Puck
- quản lý media
- quản lý hồ sơ cán bộ, đơn vị, chức vụ và bổ nhiệm
- nền tảng phân quyền bằng role/permission
- quản lý navigation menu
- quản lý user, role và permission

---

## 3. Tech stack hiện tại

### Backend

- PHP `8.5`
- Laravel `13.11`
- Inertia Laravel `3.1`
- Laravel Reverb
- Laravel Sanctum
- Laravel Socialite
- Laravel Wayfinder
- Laravel AI
- Spatie Laravel Data
- Spatie Laravel Permission
- Spatie Laravel Query Builder
- Laravel Excel `4.x-dev`

### Frontend

- React `19`
- TypeScript
- Vite `8`
- Inertia React `3.3`
- Laravel Echo
- `pusher-js` cho Reverb protocol
- Tailwind CSS `4`
- React Aria Components
- Intent UI

### Editor / content tooling

- BlockNote cho rich text dạng JSON
- Puck Editor cho page builder
- `@ai-sdk/react` + OpenRouter provider cho AI assistance trong BlockNote

### Realtime

- broadcasting driver mặc định hiện tại là `reverb`
- backend dùng private broadcast channel qua `routes/channels.php`
- frontend khởi tạo Echo trong `web/lib/echo.ts`
- Echo auth dùng route `/broadcasting/auth`

### Quality / DX

- Pest `4`
- PHPUnit `12`
- Larastan
- Pint
- Oxlint
- ESLint
- Prettier
- React Doctor

---

## 4. Quy ước runtime và lệnh cơ bản

Dự án đã có wrapper:

- `./phpw`
- `./composerw`

Ưu tiên dùng các wrapper này khi chạy lệnh PHP hoặc Composer.

Lệnh cơ bản:

```bash
./composerw install
pnpm install
cp .env.example .env
./phpw artisan key:generate
touch database/database.sqlite
./phpw artisan migrate
```

Chạy môi trường dev:

```bash
./composerw run dev
```

Lệnh này sẽ chạy đồng thời:

- `./phpw artisan serve`
- `./phpw artisan reverb:start`
- `./phpw artisan queue:listen`
- `./phpw artisan pail`
- `pnpm run dev`

Kiểm tra chất lượng:

```bash
./phpw artisan test --compact
pnpm check
./composerw check
```

---

## 5. Kiến trúc ứng dụng hiện tại

### 5.1. Backend

Code backend chủ yếu nằm ở:

- `app/Http/Controllers`
- `app/Actions`
- `app/Http/Requests`
- `app/Policies`
- `app/Data`
- `app/Models`
- `app/QueryBuilders`

Phong cách hiện tại:

- controller mỏng, chủ yếu điều phối request/response
- logic nghiệp vụ đặt trong action
- request class chịu trách nhiệm authorize + validate
- policy là lớp kiểm soát truy cập chính
- DTO dùng `spatie/laravel-data`
- màn danh sách CMS dùng query builder riêng

### 5.2. Frontend

Code frontend nằm trong thư mục `web/`:

- `web/pages`: Inertia pages
- `web/layouts`: layout dùng chung
- `web/components`: component ứng dụng
- `web/components/ui`: shared UI layer
- `web/lib`: helper, authorization, config page builder
- `web/routes`: route helper sinh từ Wayfinder

`web/components/ui` là shared layer dùng chung. Khi phát triển tính năng mới nên ưu tiên compose từ đó thay vì chỉnh trực tiếp.

### 5.3. Inertia shared props

Middleware `HandleInertiaRequests` đang share sẵn:

- `auth.user`
- `auth.permissions`
- `auth.social.googleEnabled`
- `features.blocknoteAiEnabled`
- `flash`
- `sidebarOpen`

Điểm quan trọng:

- frontend không tự suy đoán quyền từ role
- frontend nhận danh sách permission thực tế từ backend để build navigation và bật/tắt hành vi UI

---

## 6. Auth và authorization

### 6.1. Nguồn sự thật cho auth

`users` là bảng auth trung tâm cho toàn hệ thống.

User model dùng `Spatie\Permission\Traits\HasRoles`.

Không dùng `users.role`, `is_admin` hoặc các cột permission ad-hoc.

### 6.2. Role hiện có

Seeder hiện tại tạo các role:

- `super-admin`
- `admin`
- `editor`
- `staff`
- `student`

### 6.3. Permission hiện có

`RoleAndPermissionSeeder` hiện tạo `48` permission, bao phủ các nhóm:

- dashboard
- posts
- post categories
- pages
- navigation
- media
- staff profiles
- units / positions / appointments
- users / roles / permissions
- own profile

### 6.4. Nguyên tắc phân quyền đang dùng trong code

- kiểm tra quyền qua policy hoặc `$user->can(...)`
- route CMS dùng `->can(...)` rất nhiều
- request class cũng tự authorize theo policy/permission
- `super-admin` có bypass toàn cục trong `AppServiceProvider`

Điều này đã được áp dụng nhất quán cho phần lớn module CMS hiện tại.

---

## 7. Route và phạm vi truy cập hiện tại

### 7.1. Public routes

Các route public thực tế hiện có:

- `/` trang chủ
- `/{slug}` cho page hoặc post category public
- `/{categorySlug}/{postSlug}` cho post detail public
- auth mặc định của Laravel Breeze/Inertia style: login, register, forgot password, reset password
- Google OAuth redirect/callback

Lưu ý quan trọng:

- public slug hiện đi qua `PublicSlugController`
- `PublicSlugController` ưu tiên resolve `PostCategory` đang active, nếu không có mới resolve `Page`
- route slug có regex để tránh đè namespace như `cms`, `settings`, `login`, `register`, `auth`, `password`, `verify-email`
- page chỉ render khi `status = published`
- category chỉ render khi `is_active = true`
- post detail chỉ render khi `status = published` và URL category thực sự khớp với category của post
- `Page` hiện có `visibility`: `public`, `authenticated`, `students`, `student_groups`
- `Post` cũng dùng cùng nhóm visibility này cho public site
- guest truy cập content bị giới hạn sẽ bị chuyển sang login; user đã đăng nhập nhưng không đủ quyền sẽ nhận `403`
- page/category/post đều trả thêm `layout` và `dynamicData` cho public renderer
- `/` không còn hardcode `home/page`; route này resolve qua key `site_settings.homepage_page`, nếu chưa cấu hình mới fallback về `inertia('home/page')`
- 404 có thể render qua key `site_settings.not_found_page` nếu page tương ứng đã publish và user hiện tại có quyền xem
- post/category/page có thể fallback sang default layout tương ứng từ `site_settings`
- hiện chưa có public route riêng cho document; nếu cần public surface cho unit thì hướng hiện tại là render qua `Page`, không mở route unit riêng; không có kế hoạch route public riêng cho staff profile

### 7.2. Protected routes

Khu vực CMS nằm dưới:

- `/cms`

Yêu cầu:

- `auth`
- `verified`

Ngoài dashboard và các module CRUD CMS, hiện còn có route nội bộ để test realtime:

- `POST /cms/realtime/ping`

Route này:

- chỉ dành cho user đã đăng nhập và verify
- yêu cầu permission `view admin dashboard`
- dùng để bắn một broadcast test về private channel của chính user hiện tại

Các route settings nằm dưới:

- `/settings/profile`
- `/settings/password`
- `/settings/appearance`
- `/settings/delete-account`

---

## 8. Mô hình dữ liệu hiện tại

Schema SQLite hiện có các bảng nghiệp vụ chính:

- `users`
- `students`
- `staff_profiles`
- `units`
- `positions`
- `staff_appointments`
- `media`
- `posts`
- `post_categories`
- `post_post_category`
- `pages`
- `site_layouts`
- `navigation_menus`
- `navigation_items`
- `site_settings`
- `student_groups`
- `student_group_members`
- `content_student_group_access`
- bảng role/permission của Spatie

### 8.1. User và profile nghiệp vụ

- `users`: tài khoản đăng nhập
- `students`: thông tin sinh viên gắn với `user_id`
- `staff_profiles`: hồ sơ cán bộ/giảng viên gắn với `user_id`

Thiết kế này tách auth khỏi dữ liệu nghiệp vụ.

### 8.2. Content model

- `posts`: nội dung bài viết
- `post_categories`: danh mục bài viết có hỗ trợ parent
- `pages`: trang CMS, lưu body content bằng `puck_json`, có thể gắn `site_layout_id`
- `site_layouts`: layout dùng chung cho public page, hiện lưu các slot `header_data`, `footer_data`, `left_data`, `right_data`
- `navigation_menus` và `navigation_items`: menu điều hướng

### 8.3. Tổ chức nhân sự

- `units`: đơn vị, có `parent_id` để làm cây phân cấp
- `positions`: chức vụ
- `staff_appointments`: quan hệ cán bộ - đơn vị - chức vụ theo thời gian

### 8.4. System pages và site settings

- `site_settings` hiện là bảng key/value tối giản với các cột `key`, `value`
- runtime hiện dùng các key:
  - `homepage_page`
  - `not_found_page`
  - `student_home_page`
  - `default_page_layout`
  - `default_category_layout`
  - `default_post_layout`
- model `SiteSetting` cung cấp helper typed read/write cho các key này
- homepage, 404 và layout fallback của public page/category/post đều đang đọc từ đây

### 8.6. Student groups cho phân quyền xem nội dung

- `student_groups`: nhóm sinh viên, có `name`, `code`, `owner_id`
- `student_group_members`: danh sách `student_code` thuộc từng group
- `content_student_group_access`: bảng morph để gắn group vào `Page` hoặc `Post`

Rule đang dùng trong code:

- `Page` và `Post` có `visibility`: `public`, `authenticated`, `students`, `student_groups`
- không còn gắn list `student_code` trực tiếp vào `page` hoặc `post`
- nếu `visibility = student_groups`, quyền xem được quyết định qua group đã gắn vào content
- `student_code` trong group hiện được normalize theo hướng chỉ chấp nhận chữ số, và không yêu cầu phải có tài khoản tương ứng trong DB

---

## 9. Chuẩn lưu nội dung

Đây là phần đã triển khai thực sự trong model:

- `posts.content_format` mặc định là `blocknote_json`
- `staff_profiles.bio_format` mặc định là `blocknote_json`
- `units.description_format` mặc định là `blocknote_json`
- `pages.content_format` mặc định là `puck_json`

Hiểu ngắn gọn:

- rich text dạng bài viết/mô tả dùng BlockNote JSON
- layout page linh hoạt dùng Puck JSON
- public page hiện render theo hướng `site layout + page body`, trong đó `pages.content` là body và `site_layouts` chứa các slot dùng chung
- chiến lược mở rộng cho shell/template/content tiếp tục được mô tả ở `docs/content-layout-strategy.md`

Project hiện không đi theo hướng lưu HTML thuần làm nguồn dữ liệu chính cho các module này.

---

## 10. Trạng thái các module

### 10.1. Đã triển khai tương đối đầy đủ

#### CMS dashboard

- route: `/cms`
- có controller riêng
- frontend dashboard đã tồn tại
- permission chính: `view admin dashboard`
- đã có widget demo realtime ngay trong dashboard
- widget này subscribe private channel `cms-user.{userId}`
- nút `Test realtime` gọi `POST /cms/realtime/ping`
- event hiện dùng để kiểm tra flow là `App\Events\CmsRealtimePinged`

#### Posts

- index, create, edit, update, publish, delete
- có policy, request validation, action, query builder, test
- hỗ trợ category, thumbnail, author, status, published_at

#### Post categories

- index, create, update, delete
- có policy, request, test
- hỗ trợ cấu trúc cha/con

#### Pages

- index, create, edit metadata, update content, clone, delete
- có builder route và show route trong CMS
- content format mặc định là `puck_json`
- page có thể chọn `site_layout_id`
- có test cho CRUD, policy và navigation relationship

#### Site layouts

- index, create, edit, update, publish, chuyển draft, set default, delete
- có policy, request validation, action, factory và feature test
- dùng Puck để quản lý các slot layout dùng chung
- hiện hỗ trợ các vùng `header`, `footer`, `left`, `right`
- có endpoint nguồn dữ liệu động cho builder tại `/cms/layout-builder/sources/{source}`

#### Media

- index, upload, rename, duplicate, delete
- có policy, request, action, test
- dùng như nguồn file/ảnh cho posts, pages và staff profiles

#### Staff profiles

- index, create, show, edit, update, delete
- policy đã phân biệt quyền quản trị và quyền hồ sơ cá nhân
- liên kết với `staff_appointments`

#### Units và positions

- units: index, create, show, edit, update, reorder, delete
- positions: index, create, update, delete
- staff appointments đã có ở domain/schema

### 10.2. Đã có nhưng phạm vi public chưa phủ hết toàn domain

#### Navigation

Hiện trạng:

- đã có `navigation_menus`, `navigation_items`, model, policy, request, query builder, data object và test schema/policy
- route `/cms/navigation` và `/cms/navigation/{id}` đã tồn tại
- controller đã đọc dữ liệu menu thật từ DB và trả resource catalog từ page/post/category đã publish
- UI quản lý cây menu đã thao tác trên dữ liệu thật
- public renderer đã nhận `dynamicData.navigationMenus` để block `NavigationMenu` trong site layout/page layout render menu từ DB
- phần chưa có là public surface cho các domain khác ngoài page/category/post; với unit thì hướng hiện tại là trỏ qua `Page`, còn staff profile không có kế hoạch route public riêng

#### Student groups

Hiện trạng:

- đã có schema `student_groups`, `student_group_members`, `content_student_group_access`
- đã có policy, request, action, factory, seeder và test
- đã có CMS route `/cms/student-groups`
- đã có màn quản lý group trong CMS
- đã có reusable picker để gắn group vào form `Page` và `Post`
- form tạo nhanh chấp nhận paste danh sách `student_code` theo nhiều định dạng như khoảng trắng, dấu phẩy, chấm phẩy và xuống dòng
- `student_code` chỉ chấp nhận chuỗi số, không cần map sẵn với tài khoản `users`

#### Users / Roles / Permissions

Hiện trạng:

- hệ thống role/permission backend đã dùng thật
- route CMS đã có:
  - `/cms/users`
  - `/cms/roles-permissions`
- đã có flow create/update cho user và role trong CMS
- màn roles/permissions đang đọc trực tiếp role + permission thật từ DB
- guard cho role nhạy cảm như `super-admin` đã có ở backend và test

### 10.3. Public website MVP đã chạy trên dữ liệu thật

Public-facing website hiện đã có:

- trang chủ `/`
- public page theo slug cho `Page` đã publish
- public category page theo slug cho `PostCategory` đang active
- public post detail theo pattern `/{categorySlug}/{postSlug}`
- resolve system page qua `site_settings` cho homepage và 404
- fallback default layout cho page/category/post qua `site_settings`
- enforce visibility cho page và post theo user hiện tại, bao gồm `student_groups`
- `dynamicData` cho Puck/public renderer, trong đó có navigation menus từ DB
- breadcrumbs, related posts và category listing cho luồng public content

Chưa có:

- public route/document viewer riêng cho media hoặc tài liệu
- coverage public đầy đủ cho mọi domain CMS hiện có
- public surface riêng cho unit nếu không đi qua `Page`

---

## 11. AI và editor

### 11.1. BlockNote

Project đã có:

- editor BlockNote
- readonly renderer
- BlockNote AI component

Route AI hiện có:

- `POST /cms/ai/blocknote`

Permission yêu cầu:

- `view admin dashboard`

Tính năng AI chỉ bật khi cấu hình env tương ứng tồn tại. Frontend nhận cờ `features.blocknoteAiEnabled` từ middleware.

### 11.2. Puck page builder và site layout builder

Project đã có:

- config block builder trong `web/lib/puck`
- component builder và renderer
- route CMS builder cho pages
- route CMS quản lý site layouts
- builder source endpoint cho block động
- public page renderer trả thêm `dynamicData` cho block lấy dữ liệu runtime

Puck đang là hướng chính cho page layout linh hoạt trong CMS.

Lưu ý:

- `pages.content` chịu trách nhiệm body/content riêng của từng page
- `site_layouts` chịu trách nhiệm các vùng dùng chung của public shell
- implementation hiện tại đang dùng các slot `header/footer/left/right`, chưa phải full registry theo toàn bộ plan mở rộng
- chi tiết định hướng mở rộng nằm ở `docs/content-layout-strategy.md` và `docs/puck-layout-page-builder-implementation-plan.md`

---

## 12. Seed dữ liệu hiện tại

`DatabaseSeeder` hiện chạy các seed chính:

- `RoleAndPermissionSeeder`
- `SuperAdminUserSeeder`
- `UnitsAndPositionsSeeder`
- `StaffProfileSeeder`
- `MediaSeeder`
- `PostCategorySeeder`
- `PostSeeder`

Ngoài ra seeder còn tạo:

- `10` user ngẫu nhiên
- user `admin@example.com` với role `admin`

Seeder phục vụ tốt cho local development và test dữ liệu nền.

---

## 13. Test coverage hiện có

Repo đã có feature test cho các mảng chính:

- auth và Google auth
- dashboard
- CMS realtime ping + channel authorization
- role/permission và super-admin gate
- posts
- post categories
- pages
- public homepage, page visibility, post category và post detail
- site settings và site layouts
- media
- staff profiles
- units
- student groups
- schema/content domain

Điều này cho thấy trọng tâm hiện tại của repo là:

- ổn định domain model
- khóa chặt authorization
- đảm bảo các module CMS cốt lõi hoạt động đúng

---

## 14. Kết luận ngắn

VMUFit hiện không còn là một bản thiết kế MVP thuần ý tưởng. Repo đã có nền Laravel CMS rõ ràng với authorization, schema và nhiều module CRUD hoạt động thực tế.

Tuy vậy, cần hiểu đúng trạng thái hiện tại:

- phần CMS cho `posts`, `pages`, `media`, `staff profiles`, `units`, `positions`, `navigation`, `users` và `roles-permissions` đã có flow dùng được
- `student groups` và `site settings` đã là một phần runtime thực tế của public site
- public website đã nối page, category và post với layout, navigation data và visibility rules
- phần còn lại chủ yếu nằm ở các public surface chuyên biệt ngoài `page/category/post`; riêng `unit` nếu cần public sẽ đi qua `Page`, còn `staff profile` không có kế hoạch route public riêng

Khi cập nhật tiếp tài liệu này, ưu tiên mô tả theo những gì đang có trong code và route, không ghi theo kế hoạch dự kiến nếu chưa được triển khai.

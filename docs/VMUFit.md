# VMUFit

## 1. Mục đích tài liệu

Tài liệu này mô tả trạng thái hiện tại của dự án `FIT-vmu`, không phải bản định hướng MVP cũ.

Mục tiêu:

- phản ánh đúng kiến trúc đang có trong repo
- ghi rõ module nào đã chạy thật, module nào mới dừng ở domain hoặc UI placeholder
- thống nhất cách hiểu về auth, permission, CMS và content model
- giúp người mới vào dự án đọc một lần là nắm được phạm vi hiện tại

Thời điểm cập nhật: `2026-05-30`

---

## 2. Tổng quan hệ thống

VMUFit hiện là một ứng dụng Laravel + Inertia React phục vụ hai lớp chức năng:

- website public
- CMS quản trị nội dung và dữ liệu nội bộ

Repo hiện đã có nền tảng khá đầy đủ cho CMS, authorization và content domain. Tuy nhiên phần public-facing content chưa được mở rộng nhiều: route public hiện tại mới có trang chủ `/`.

Các nhóm tính năng chính đang tồn tại trong codebase:

- xác thực tài khoản nội bộ, email verification và Google OAuth
- dashboard CMS
- quản lý bài viết và danh mục bài viết
- quản lý page bằng editor/builder
- quản lý media
- quản lý hồ sơ cán bộ, đơn vị, chức vụ và bổ nhiệm
- nền tảng phân quyền bằng role/permission
- domain cho documents, navigation, users/roles nhưng một số màn vẫn đang ở mức placeholder

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
- documents
- staff profiles
- units / positions / appointments
- users / roles / permissions
- own profile / own documents / student-scoped access

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
- auth mặc định của Laravel Breeze/Inertia style: login, register, forgot password, reset password
- Google OAuth redirect/callback

Lưu ý quan trọng:

- hiện chưa có public route riêng cho post, page, unit, staff profile hoặc document
- `HomeController` hiện trả về `inertia('home/page')`

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
- `navigation_menus`
- `navigation_items`
- `documents`
- `document_rows`
- bảng role/permission của Spatie

### 8.1. User và profile nghiệp vụ

- `users`: tài khoản đăng nhập
- `students`: thông tin sinh viên gắn với `user_id`
- `staff_profiles`: hồ sơ cán bộ/giảng viên gắn với `user_id`

Thiết kế này tách auth khỏi dữ liệu nghiệp vụ.

### 8.2. Content model

- `posts`: nội dung bài viết
- `post_categories`: danh mục bài viết có hỗ trợ parent
- `pages`: trang CMS
- `navigation_menus` và `navigation_items`: menu điều hướng

### 8.3. Tổ chức nhân sự

- `units`: đơn vị, có `parent_id` để làm cây phân cấp
- `positions`: chức vụ
- `staff_appointments`: quan hệ cán bộ - đơn vị - chức vụ theo thời gian

### 8.4. Tài liệu

- `documents`: metadata tài liệu
- `document_rows`: dữ liệu theo dòng cho mode cá nhân hóa theo `student_code`

`DocumentRequestOptions` hiện định nghĩa:

- `document_type`: `lecture`, `exercise`, `exam`, `form`, `score`, `announcement`, `other`
- `visibility`: `public`, `login_required`, `students`, `staff`, `private`, `student_code`
- `document_mode`: `file`, `preview`, `student_table`

---

## 9. Chuẩn lưu nội dung

Đây là phần đã triển khai thực sự trong model:

- `posts.content_format` mặc định là `blocknote_json`
- `staff_profiles.bio_format` mặc định là `blocknote_json`
- `units.description_format` mặc định là `blocknote_json`
- `documents.description_format` mặc định là `blocknote_json`
- `pages.content_format` mặc định là `puck_json`

Hiểu ngắn gọn:

- rich text dạng bài viết/mô tả dùng BlockNote JSON
- layout page linh hoạt dùng Puck JSON

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
- có test cho CRUD, policy và navigation relationship

#### Media

- index, upload, rename, duplicate, delete
- có policy, request, action, test
- dùng như nguồn file/ảnh cho posts, pages, staff profiles, documents

#### Staff profiles

- index, create, show, edit, update, delete
- policy đã phân biệt quyền quản trị và quyền hồ sơ cá nhân
- liên kết với `staff_appointments`

#### Units và positions

- units: index, create, show, edit, update, reorder, delete
- positions: index, create, update, delete
- staff appointments đã có ở domain/schema

### 10.2. Đã có domain và quyền nhưng UI/backend còn dở dang

#### Documents

Hiện trạng:

- đã có model, migration, data object, policy, request class, test policy/schema
- đã có route CMS `/cms/documents`
- trang frontend hiện vẫn là placeholder
- chưa có controller CRUD đầy đủ nối route CMS với domain documents

Nói cách khác: documents đã có nền dữ liệu và authorization, nhưng chưa hoàn tất flow quản trị trong CMS.

#### Navigation

Hiện trạng:

- đã có `navigation_menus`, `navigation_items`, model, policy, request, query builder, data object và test schema/policy
- route `/cms/navigation` và `/cms/navigation/{id}` đã tồn tại
- màn index hiện đang dùng mock data ở frontend
- chưa có controller/backend hoàn chỉnh để quản lý menu thật từ DB

#### Users / Roles / Permissions

Hiện trạng:

- hệ thống role/permission backend đã dùng thật
- route CMS đã có:
  - `/cms/users`
  - `/cms/roles-permissions`
- cả hai page hiện vẫn là placeholder
- chưa có module quản trị user/role hoàn chỉnh ở giao diện CMS

### 10.3. Public website còn rất sớm

Public-facing website hiện mới ở mức:

- trang chủ `/`
- một số shared component UI

Chưa có lớp public render hoàn chỉnh cho:

- post listing/detail
- page theo slug
- hồ sơ cán bộ public
- đơn vị public
- tài liệu public
- navigation public lấy từ DB

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

### 11.2. Puck page builder

Project đã có:

- config block builder trong `web/lib/puck`
- component builder và renderer
- route CMS builder cho pages

Puck đang là hướng chính cho page layout linh hoạt trong CMS.

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
- media
- staff profiles
- units
- document policy/request
- schema/content domain

Điều này cho thấy trọng tâm hiện tại của repo là:

- ổn định domain model
- khóa chặt authorization
- đảm bảo các module CMS cốt lõi hoạt động đúng

---

## 14. Kết luận ngắn

VMUFit hiện không còn là một bản thiết kế MVP thuần ý tưởng. Repo đã có nền Laravel CMS rõ ràng với authorization, schema và nhiều module CRUD hoạt động thực tế.

Tuy vậy, cần hiểu đúng trạng thái hiện tại:

- phần CMS cho `posts`, `pages`, `media`, `staff profiles`, `units`, `positions` đã đi khá xa
- `documents`, `navigation`, `users`, `roles-permissions` mới hoàn thiện một phần
- public website vẫn còn ở giai đoạn đầu, chưa nối đầy đủ với content trong DB

Khi cập nhật tiếp tài liệu này, ưu tiên mô tả theo những gì đang có trong code và route, không ghi theo kế hoạch dự kiến nếu chưa được triển khai.

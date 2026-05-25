# Guideline dự án VMUFit

## 1. Mục tiêu tài liệu

Tài liệu này là guideline chính thức cho thiết kế MVP của VMUFit.

Mục tiêu:

- Thống nhất kiến trúc backend, frontend, CMS và authorization.
- Thay thế cách nghĩ cũ dựa trên `users.role`.
- Chuẩn hóa role và permission theo `spatie/laravel-permission`.
- Chuẩn hóa content architecture cho bài viết, page, navigation, category và tài liệu.
- Bổ sung page builder bằng Puck cho nhóm nội dung cần layout linh hoạt.
- Giữ phạm vi MVP đủ nhỏ để triển khai nhanh nhưng vẫn mở rộng được.

---

## 2. Mục tiêu hệ thống

VMUFit là website/CMS cho Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam.

Hệ thống gồm:

- Website public cho khách truy cập.
- CMS quản trị nội dung.
- Quản lý bài viết, danh mục bài viết, page và navigation.
- Khu vực quản lý tài liệu cho cán bộ/giảng viên.
- Khu vực xem tài liệu cho sinh viên.
- Quản lý hồ sơ cán bộ/giảng viên.
- Quản lý tài liệu thường và tài liệu Excel cá nhân hóa theo mã sinh viên.

Mục tiêu MVP:

- Dùng một backend Laravel duy nhất.
- Dùng một bảng `users` duy nhất cho toàn bộ tài khoản đăng nhập.
- Tách dữ liệu nghiệp vụ ra các bảng chuyên biệt như `students`, `staff_profiles`, `posts`, `pages`, `documents`.
- Dùng role/permission theo package chuẩn thay vì cột `role` trong `users`.
- Ưu tiên thiết kế đơn giản, dễ seed, dễ mở rộng, dễ kiểm thử.

---

## 3. Tech stack hiện tại

### Backend

- Laravel 13
- PHP 8.5
- Inertia Laravel v3
- Sanctum cho auth
- Wayfinder cho typed route/controller helpers
- Action-based flow
- Pest + PHPUnit cho test
- Larastan + Pint cho quality/format

Package backend khởi tạo cho MVP:

```bash
composer require spatie/laravel-permission
composer require spatie/laravel-data
composer require spatie/laravel-query-builder
composer require maatwebsite/excel:"4.x-dev"
```

Vai trò chính của từng package:

- `spatie/laravel-permission`: chuẩn hóa role/permission, thay thế hoàn toàn cách dùng `users.role`.
- `spatie/laravel-data`: tạo DTO/Data object cho request, action, Inertia props và response.
- `spatie/laravel-query-builder`: chuẩn hóa filter, sort, include và search cho các màn danh sách trong CMS.
- `maatwebsite/excel:"4.x-dev"`: import/export Excel, đặc biệt cho tài liệu cá nhân hóa theo `student_code`.

Ghi chú về `maatwebsite/excel:"4.x-dev"`:

- Dùng bản `4.x-dev` vì project chạy PHP 8.5.
- Đây là dependency cần theo dõi kỹ khi deploy production vì không phải stable release.
- Khi Laravel Excel có bản stable hỗ trợ tốt PHP 8.5, ưu tiên chuyển constraint từ `4.x-dev` sang version stable tương ứng.
- Không tắt Composer audit và không ignore security advisory nếu chưa có lý do rõ ràng.

### Frontend

- React 19
- TypeScript
- Inertia React v3
- Vite
- Frontend nằm ở `./web`
- `web/pages` cho Inertia pages
- `web/layouts` cho layout dùng chung
- `web/components/ui` cho shared UI layer

Package frontend khởi tạo cho MVP:

```bash
pnpm add @blocknote/core @blocknote/react @blocknote/shadcn
pnpm add @measured/puck
pnpm add react-hook-form zod @hookform/resolvers
pnpm add @tanstack/react-table
pnpm add nuqs
pnpm add react-dropzone
pnpm add date-fns
```

Vai trò chính của từng package:

- `@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`: editor block chính cho nội dung dạng bài viết/mô tả/tiểu sử.
- `@measured/puck`: page builder cho các page cần layout linh hoạt bằng component kéo-thả.
- `react-hook-form`: quản lý form ở frontend.
- `zod`: validate dữ liệu phía frontend và định nghĩa schema dùng chung cho form.
- `@hookform/resolvers`: kết nối `zod` với `react-hook-form`.
- `@tanstack/react-table`: xây dựng bảng quản trị cho posts, pages, categories, navigation, documents, users, staff, students, media.
- `nuqs`: đồng bộ filter, search, sort, pagination với query string.
- `react-dropzone`: upload file bằng kéo-thả cho ảnh, tài liệu, Excel và preview.
- `date-fns`: xử lý format ngày giờ, ngày xuất bản, ngày bắt đầu/kết thúc chức vụ.

### UI / Styling

- Tailwind CSS v4
- Intent UI
- React Aria Components
- Heroicons
- Motion
- Recharts
- Sonner

### Authorization

- `spatie/laravel-permission`
- Bảng chuẩn của package:
    - `roles`
    - `permissions`
    - `model_has_roles`
    - `model_has_permissions`
    - `role_has_permissions`
- `teams = false` ở giai đoạn hiện tại

### Tooling

- pnpm
- ESLint 9
- Prettier 3
- Oxlint
- React Doctor
- TypeScript checking qua `tsgo` và `tsc`

---

## 4. Nguyên tắc kiến trúc

### 4.1. Một nguồn sự thật cho auth và quyền

- `users` chỉ chịu trách nhiệm định danh, đăng nhập, session, notification.
- Role và permission không lưu trực tiếp trên `users`.
- Mọi quyết định truy cập phải đi qua permission check.

### 4.2. Phân tách auth với hồ sơ nghiệp vụ

- Sinh viên là `users` có liên kết `students`.
- Cán bộ/giảng viên là `users` có liên kết `staff_profiles`.
- Một người có thể vừa là cán bộ, vừa là admin hoặc editor.

### 4.3. Kiểm tra bằng permission, không kiểm tra bằng role

Quy ước bắt buộc:

- Dùng `$user->can('permission-name')`.
- Dùng policy hoặc middleware `can`.
- Chỉ dùng role để gom permission hoặc cho mục đích seed/quản trị.
- Không rải logic kiểu `if ($user->role === 'admin')` trong code.

### 4.4. Content là dữ liệu có cấu trúc

- Content CMS không coi là HTML thô.
- Editor/page builder phải sinh dữ liệu có cấu trúc để dễ render và mở rộng.
- Với MVP:
    - Bài viết, mô tả, tiểu sử dùng BlockNote JSON.
    - Page layout dùng Puck JSON.

### 4.5. CMS module độc lập nhưng liên kết được với nhau

- `posts` dùng để quản lý bài viết/tin tức/thông báo.
- `post_categories` dùng để phân loại bài viết.
- `pages` dùng để quản lý trang tĩnh hoặc landing page.
- `navigation_menus` và `navigation_items` dùng để cấu hình menu public.
- Navigation item có thể trỏ tới post category, page, post hoặc custom URL.

---

## 5. Các nhóm người dùng

Về mặt nghiệp vụ, hệ thống có các nhóm người dùng sau:

- Quản trị hệ thống
- Biên tập nội dung
- Cán bộ/giảng viên
- Sinh viên
- Khách chưa đăng nhập

Lưu ý:

- Đây là nhóm nghiệp vụ, không phải cột `users.role`.
- Một `user` có thể mang nhiều vai trò hệ thống nếu cần.
- Phân quyền cuối cùng phải dựa trên permission.

---

## 6. Mô hình authorization chuẩn

### 6.1. Package sử dụng

Dự án dùng `spatie/laravel-permission` làm chuẩn cho role/permission.

Điều này có nghĩa:

- User gắn role qua `model_has_roles`.
- Role gắn permission qua `role_has_permissions`.
- Có thể gắn permission trực tiếp cho user, nhưng guideline không khuyến khích.

### 6.2. Quy tắc bắt buộc

- User có roles.
- Roles có permissions.
- Ứng dụng check permissions.
- Không dùng `users.role`.
- Không thêm cột `role`, `roles`, `permission`, `is_admin` vào `users`.
- Không lưu logic quyền trong JSON config ad-hoc.

### 6.3. Chính sách gán quyền

Quy ước của dự án:

- Permission là đơn vị kiểm soát truy cập nhỏ nhất.
- Role là nhóm permission để dễ gán cho user.
- Ưu tiên gán permission cho role.
- Hạn chế tối đa việc gán permission trực tiếp cho user.

Chỉ cân nhắc direct permission nếu:

- Đây là ngoại lệ rất hiếm.
- Có nhu cầu override tạm thời.
- Đã có lý do nghiệp vụ rõ ràng.

### 6.4. Tên role đề xuất cho MVP

Role đề xuất:

```text
super-admin
admin
editor
staff
student
```

Ý nghĩa:

- `super-admin`: toàn quyền, chủ yếu cho vận hành hệ thống.
- `admin`: quản trị ứng dụng, người dùng, nội dung, tài liệu.
- `editor`: biên tập và xuất bản nội dung theo phạm vi được giao.
- `staff`: cán bộ/giảng viên có quyền quản lý hồ sơ và tài liệu của mình.
- `student`: sinh viên đã đăng nhập, dùng cho tài liệu hạn chế và nội dung cá nhân hóa.

### 6.5. Tên permission đề xuất cho MVP

Permission nên đặt theo động từ + tài nguyên.

```text
manage users
manage roles
manage permissions

view admin dashboard

view posts
create posts
update posts
delete posts
publish posts
review posts

view post categories
manage post categories

view pages
create pages
update pages
delete pages
publish pages

view navigation
manage navigation

view documents
create documents
update documents
delete documents
publish documents
review documents
download restricted documents
view student scoped documents

view staff profiles
create staff profiles
update staff profiles
delete staff profiles
publish staff profiles

view units
manage units
manage positions
manage staff appointments

view own profile
update own profile

view own documents
create own documents
update own documents
delete own documents

view student profile
view own personalized documents
```

Không bắt buộc giữ đúng toàn bộ danh sách trên, nhưng phải giữ nguyên nguyên tắc đặt tên:

- Rõ tài nguyên.
- Rõ hành động.
- Không viết tắt khó hiểu.
- Không encode logic UI vào tên permission.

### 6.6. Mapping role -> permission ở mức guideline

#### `super-admin`

- Toàn bộ permission.
- Được xử lý qua `Gate::before`.

#### `admin`

- Quản lý users, roles, permissions.
- Quản lý toàn bộ posts, post categories, pages, navigation, documents, units, positions, appointments.
- Có thể xuất bản và duyệt.

#### `editor`

- Quản lý content và document theo phạm vi CMS.
- Tạo, sửa, duyệt, xuất bản bài viết/page.
- Quản lý post categories và navigation nếu được giao.
- Có thể quản lý hồ sơ public nếu nghiệp vụ cho phép.
- Không mặc định quản lý users, roles, permissions.

#### `staff`

- Xem và cập nhật hồ sơ của chính mình.
- Tạo, sửa, quản lý tài liệu của chính mình.
- Có thể xem một số tài liệu nội bộ yêu cầu đăng nhập hoặc staff-only.

#### `student`

- Xem nội dung yêu cầu đăng nhập.
- Xem tài liệu dành cho sinh viên.
- Xem dữ liệu tài liệu cá nhân hóa theo `student_code`.

### 6.7. Cách check quyền trong code

Chuẩn bắt buộc:

```php
$user->can('publish posts');
$request->user()->can('update own profile');
```

Trong policy:

```php
return $user->can('update posts');
```

Không dùng làm chuẩn chính:

```php
$user->hasRole('admin');
$user->hasPermissionTo('publish posts');
```

Lý do:

- `$user->can()` đi qua Gate.
- Hỗ trợ `Gate::before` cho `super-admin`.
- Thống nhất với policy, middleware `can`, Blade/Inertia authorization.

### 6.8. Super admin

Quy ước:

- Dùng `Gate::before`.
- Nếu user có role `super-admin`, trả về `true`.
- Nếu không, trả về `null` để tiếp tục check như bình thường.

```php
Gate::before(function (User $user, string $ability): ?bool {
    return $user->hasRole('super-admin') ? true : null;
});
```

Không return `false` trong nhánh còn lại.

### 6.9. Middleware và route authorization

Ưu tiên:

- `can:permission-name`
- Policy authorization

Có thể dùng middleware của Spatie khi thực sự cần:

- `role:...`
- `permission:...`
- `role_or_permission:...`

Nhưng guideline dự án ưu tiên:

- Route/controller/policy check bằng permission.
- Role middleware chỉ dùng ở các entry-point đặc biệt của khu vực quản trị nếu thật sự hợp lý.

### 6.10. Frontend authorization

Frontend chỉ dùng authorization để:

- Ẩn/hiện action.
- Ẩn/hiện menu.
- Tối ưu trải nghiệm.

Frontend không phải lớp bảo mật cuối cùng.

Bắt buộc:

- Backend vẫn phải authorize ở controller/action/policy/request.
- Không dựa vào việc ẩn nút ở frontend để bảo vệ tài nguyên.

Nên share permission cần thiết qua Inertia props, ví dụ:

```text
auth.permissions.posts.create
auth.permissions.posts.publish
auth.permissions.pages.publish
auth.permissions.navigation.manage
auth.permissions.documents.review
```

Chỉ share các permission mà UI thật sự cần.

### 6.11. Seed role và permission

Guideline seed:

- Seed roles và permissions bằng code idempotent.
- Dùng `findOrCreate`.
- Flush permission cache trước khi seed.

Quy ước:

- Có seeder riêng cho roles/permissions.
- Có thể có file map role -> permission rõ ràng.
- Tránh hardcode nhiều nơi.

### 6.12. Teams

Hiện tại:

```text
teams = false
```

Kết luận:

- MVP không dùng team-based permission của Spatie.
- Đơn vị như khoa/bộ môn là nghiệp vụ domain, không map trực tiếp sang `teams` của package ở giai đoạn này.
- Nếu sau này có multi-tenant thực sự, đánh giá lại riêng.

---

## 7. Kiến trúc người dùng

```text
users
├── students
└── staff_profiles
```

Ví dụ:

```text
User A
- roles: super-admin, staff
- có staff_profile
=> vừa vận hành hệ thống, vừa xuất hiện ở danh sách cán bộ

User B
- roles: student
- có student record
=> là sinh viên, có mã sinh viên để xem tài liệu cá nhân hóa
```

Guideline:

- `users` là gốc của auth.
- `students` và `staff_profiles` là profile nghiệp vụ.
- Không dùng role để suy ra một cách cứng nhắc là user có hay không có profile nghiệp vụ.

---

## 8. Editor, page builder và content architecture

### 8.1. Kết luận cho MVP

MVP dùng 2 công cụ cho 2 nhu cầu khác nhau:

```text
BlockNote = viết nội dung dạng bài/mô tả/tiểu sử
Puck      = dựng page có layout linh hoạt bằng component
```

Không dùng Puck để thay thế toàn bộ BlockNote.
Không dùng BlockNote để dựng layout landing page phức tạp.

### 8.2. BlockNote dùng khi nào

BlockNote phù hợp cho:

- Tin tức
- Thông báo
- Nội dung bài viết
- Tiểu sử giảng viên/cán bộ
- Mô tả đơn vị
- Mô tả tài liệu

Người dùng có thể:

- Gõ nội dung.
- Thêm block bằng Enter.
- Dùng slash command.
- Chèn heading, ảnh, bảng, file, link.
- Kéo-thả block.

### 8.3. Puck dùng khi nào

Puck dùng cho bảng `pages`, đặc biệt các trang cần layout riêng.

Use cases:

- Trang chủ
- Trang giới thiệu khoa
- Landing page tuyển sinh
- Landing page sự kiện
- Trang liên hệ
- Trang cơ cấu tổ chức có section/card/grid
- Trang cần component kéo-thả thay vì chỉ soạn văn bản

### 8.4. Phân vai giữa BlockNote và Puck

| Nhu cầu                 | Công cụ   | Giai đoạn |
| ----------------------- | --------- | --------- |
| Viết bài tin tức        | BlockNote | MVP       |
| Viết thông báo          | BlockNote | MVP       |
| Viết tiểu sử giảng viên | BlockNote | MVP       |
| Viết mô tả đơn vị       | BlockNote | MVP       |
| Viết mô tả tài liệu     | BlockNote | MVP       |
| Dựng trang chủ          | Puck      | MVP       |
| Dựng page giới thiệu    | Puck      | MVP       |
| Dựng landing page       | Puck      | MVP       |
| Dựng layout phức tạp    | Puck      | MVP/Sau MVP |

### 8.5. Quy ước component cho Puck

Puck chỉ nên expose các component đã được kiểm soát.

Component MVP đề xuất:

```text
HeroSection
RichTextSection
FeatureGrid
NewsListSection
StaffListSection
DepartmentSection
DocumentListSection
CTASection
ImageGallery
ContactSection
```

Không cho người dùng nhập React code tự do.
Không render component chưa được khai báo trong config.
Không dùng Puck JSON làm nơi lưu business logic phức tạp.

---

## 9. Quy ước lưu content

### 9.1. Source of truth

Nội dung dạng block phải lưu **BlockNote JSON** làm source of truth.

Phương án chuẩn:

```text
content = BlockNote JSON
content_format = blocknote_json
```

Nội dung page builder phải lưu **Puck JSON** làm source of truth.

Phương án chuẩn:

```text
content = Puck JSON
content_format = puck_json
```

Không dùng HTML làm dữ liệu chính.
Không dùng Markdown làm dữ liệu chính cho CMS block editor/page builder.

### 9.2. Vì sao lưu JSON

Lợi ích:

- Giữ đúng cấu trúc block/component.
- Render lại dễ trong React.
- Dễ thêm custom block/component sau này.
- Dễ kiểm soát nội dung được phép render.
- Dễ migrate renderer/editor khác.
- Giảm phụ thuộc vào HTML thô.

Ví dụ block/component có thể mở rộng sau này:

- Alert block
- File attachment block
- Related documents block
- Staff card block
- Department info block
- Important notice block
- Hero section
- News list section
- Staff list section

### 9.3. Kiểu cột database

Với MVP, ưu tiên:

```text
LONGTEXT để lưu JSON string
```

Ví dụ:

```text
content LONGTEXT
content_format VARCHAR(50)
```

Lý do:

- Dễ triển khai.
- Dễ debug.
- Ít phụ thuộc database engine.
- Chưa cần query sâu theo JSON trong MVP.

Chỉ cân nhắc JSON column nếu sau này cần:

- Query theo cấu trúc block/component.
- Index các key trong JSON.
- Database-level validation.

### 9.4. Các format được chấp nhận

Nên dùng field `*_format` để biết nội dung đang lưu theo định dạng nào.

Giá trị đề xuất:

```text
blocknote_json
plain_text
html
puck_json
```

Trong MVP:

```text
posts.content                  = blocknote_json
staff_profiles.bio             = blocknote_json
units.description              = blocknote_json
documents.description          = blocknote_json
pages.content                  = puck_json
```

---

## 10. Database MVP

### 10.1. Bảng `users`

Dùng cho đăng nhập, auth, session và thông tin định danh cơ bản.

```text
users
- id
- name
- email
- password
- email_verified_at
- remember_token
- created_at
- updated_at
```

Không thêm:

```text
role
roles
permission
is_admin
```

Nếu cần trạng thái tài khoản, có thể cân nhắc `status`, nhưng đây là concern riêng với authorization.

### 10.2. Bảng permission-related

Do `spatie/laravel-permission` quản lý:

```text
roles
- id
- name
- guard_name
- created_at
- updated_at

permissions
- id
- name
- guard_name
- created_at
- updated_at

model_has_roles
- role_id
- model_type
- model_id

model_has_permissions
- permission_id
- model_type
- model_id

role_has_permissions
- permission_id
- role_id
```

Guideline:

- Không tạo bảng custom khác để thay thế các bảng này trong MVP.
- Nếu cần metadata cho role/permission, chỉ mở rộng khi có use case rõ ràng.

### 10.3. Bảng `students`

Lưu thông tin riêng của sinh viên.

```text
students
- id
- user_id
- student_code
- class_name
- major
- created_at
- updated_at
```

Ghi chú:

- `student_code` là field quan trọng nhất.
- Field này dùng để map dữ liệu Excel cá nhân hóa.
- Không đặt `student_code` trực tiếp trong `users` nếu muốn giữ `users` gọn.

### 10.4. Bảng `staff_profiles`

Lưu hồ sơ cán bộ/giảng viên.

```text
staff_profiles
- id
- user_id
- full_name
- slug
- avatar_id
- email
- phone
- bio LONGTEXT
- bio_format VARCHAR(50)
- is_public
- sort_order
- created_at
- updated_at
```

`bio` lưu BlockNote JSON.

Các thông tin như:

```text
học hàm/học vị
văn phòng
chuyên môn
hướng nghiên cứu
website cá nhân
Google Scholar
ORCID
LinkedIn
```

chưa cần tách field riêng ở MVP, có thể đặt trong `bio`.

### 10.5. Bảng `units`

Quản lý đơn vị trong khoa.

```text
units
- id
- name
- slug
- type
- description LONGTEXT
- description_format VARCHAR(50)
- sort_order
- is_active
- created_at
- updated_at
```

`description` lưu BlockNote JSON.

Các đơn vị ban đầu:

```text
Ban chủ nhiệm
Bộ môn Khoa học máy tính
Bộ môn Hệ thống thông tin
Bộ môn Truyền thông và mạng máy tính
Bộ môn Kỹ thuật máy tính
Bộ môn Tin học đại cương
```

Type MVP:

```text
board
department
other
```

### 10.6. Bảng `positions`

Quản lý danh mục chức vụ.

```text
positions
- id
- name
- slug
- sort_order
- is_active
- created_at
- updated_at
```

Ví dụ dữ liệu:

```text
Trưởng khoa
Phó khoa
Trưởng bộ môn
Phó trưởng bộ môn
Giảng viên
Trợ lý đào tạo
```

### 10.7. Bảng `staff_appointments`

Quản lý quá trình giữ chức vụ.

```text
staff_appointments
- id
- staff_profile_id
- unit_id
- position_id
- start_date
- end_date
- note
- created_at
- updated_at
```

Một cán bộ có thể có nhiều chức vụ ở nhiều giai đoạn.

Chức vụ hiện tại xác định bằng:

```text
end_date IS NULL hoặc end_date >= today
```

Không cần `is_current` trong MVP.

### 10.8. Bảng `post_categories`

Quản lý danh mục bài viết.

```text
post_categories
- id
- name
- slug
- description
- parent_id
- sort_order
- is_active
- created_at
- updated_at
```

Ghi chú:

- `parent_id` cho phép category cha/con nếu cần.
- Với MVP, không cần bảng tags.
- Category dùng để lọc bài viết và làm đích liên kết trong navigation.

Ví dụ dữ liệu:

```text
Tin tức
Thông báo
Tuyển sinh
Đào tạo
Nghiên cứu khoa học
Sinh viên
```

### 10.9. Bảng `posts`

Quản lý tin tức/bài viết/nội dung CMS.

```text
posts
- id
- category_id
- title
- slug
- excerpt
- content LONGTEXT
- content_format VARCHAR(50)
- thumbnail_id
- author_id
- status
- published_at
- created_at
- updated_at
```

`content` lưu BlockNote JSON.

Status MVP:

```text
draft
pending
published
rejected
```

Quan hệ:

```text
Post belongsTo PostCategory
Post belongsTo User as author
```

Với MVP, một post thuộc một category để giữ schema đơn giản.
Nếu sau này cần một post nhiều category, bổ sung bảng pivot riêng.

### 10.10. Bảng `pages`

Quản lý page public có layout linh hoạt.

```text
pages
- id
- title
- slug
- excerpt
- content LONGTEXT
- content_format VARCHAR(50)
- thumbnail_id
- author_id
- status
- published_at
- created_at
- updated_at
```

`content` mặc định lưu Puck JSON.

Status MVP:

```text
draft
pending
published
rejected
```

Page dùng cho:

```text
Trang chủ
Giới thiệu
Liên hệ
Tuyển sinh
Cơ cấu tổ chức
Landing page sự kiện
```

Quy ước:

- Không gọi là `static_pages`.
- Dùng tên bảng `pages` để linh hoạt hơn.
- Page không phải post.
- Page có thể được gắn trực tiếp vào navigation.

### 10.11. Bảng `navigation_menus`

Quản lý các vùng menu.

```text
navigation_menus
- id
- name
- slug
- location
- is_active
- created_at
- updated_at
```

Ví dụ `location`:

```text
header
footer
mobile
sidebar
```

Quy ước:

- `slug` dùng để định danh nội bộ.
- `location` dùng để frontend biết menu hiển thị ở khu vực nào.
- Một location chỉ nên có một menu active trong MVP.

### 10.12. Bảng `navigation_items`

Quản lý từng item trong menu, hỗ trợ parent-child và liên kết tới dữ liệu nội bộ.

```text
navigation_items
- id
- menu_id
- parent_id
- title
- type
- linkable_type
- linkable_id
- url
- target
- sort_order
- is_active
- created_at
- updated_at
```

Type MVP:

```text
custom_url
post_category
page
post
```

Ý nghĩa:

- `menu_id`: item thuộc menu nào.
- `parent_id`: item cha, dùng để tạo menu nhiều cấp.
- `type`: loại link.
- `linkable_type` và `linkable_id`: polymorphic relation tới model nội bộ.
- `url`: dùng cho custom URL.
- `target`: `_self` hoặc `_blank`.
- `sort_order`: sắp xếp trong cùng một cấp.
- `is_active`: bật/tắt item.

Ví dụ mapping:

```text
post_category -> App\Models\PostCategory
page          -> App\Models\Page
post          -> App\Models\Post
custom_url    -> dùng url, không dùng linkable
```

Validate khi lưu:

```text
Nếu type = custom_url
→ bắt buộc có url
→ linkable_type/linkable_id = null

Nếu type = post_category/page/post
→ bắt buộc có linkable_type + linkable_id
→ url có thể null
```

Quan hệ model:

```text
NavigationMenu hasMany NavigationItem
NavigationItem belongsTo NavigationMenu
NavigationItem belongsTo parent NavigationItem
NavigationItem hasMany children NavigationItem
NavigationItem morphTo linkable
```

Ví dụ cấu trúc menu:

```text
Header
├── Giới thiệu               → page
│   ├── Tổng quan khoa       → page
│   ├── Cơ cấu tổ chức       → page
│   └── Đội ngũ giảng viên   → custom_url
├── Tin tức                  → post_category
│   ├── Thông báo            → post_category
│   ├── Tuyển sinh           → post_category
│   └── Nghiên cứu khoa học  → post_category
└── Bài viết nổi bật         → post
```

### 10.13. Bảng `documents`

Quản lý tài liệu.

```text
documents
- id
- title
- slug
- description LONGTEXT
- description_format VARCHAR(50)
- file_id
- owner_id
- document_type
- visibility
- status
- document_mode
- published_at
- created_at
- updated_at
```

`description` lưu BlockNote JSON.

`owner_id` trỏ tới `users.id`.

Document type MVP:

```text
lecture
exercise
exam
form
score
announcement
other
```

Visibility MVP:

```text
public
login_required
students
staff
private
student_code
```

Document mode MVP:

```text
file
preview
student_table
```

Status MVP:

```text
draft
pending
published
rejected
```

### 10.14. Bảng `document_rows`

Dùng cho file Excel cá nhân hóa theo mã sinh viên.

```text
document_rows
- id
- document_id
- student_code
- data
- row_index
- created_at
- updated_at
```

Trong đó `data` là JSON row data.

Một bảng này là đủ cho MVP.

### 10.15. Bảng `media`

Quản lý file upload.

```text
media
- id
- disk
- path
- original_name
- mime_type
- size
- uploaded_by
- created_at
- updated_at
```

Dùng chung cho:

```text
ảnh đại diện cán bộ
ảnh bài viết
ảnh page
file tài liệu
file Excel
file preview
```

---

## 11. Tổng schema MVP

```text
users
roles
permissions
model_has_roles
model_has_permissions
role_has_permissions

students
staff_profiles
units
positions
staff_appointments

post_categories
posts
pages
navigation_menus
navigation_items

documents
document_rows
media
```

Tư duy chính:

- `users` là auth root.
- Role/permission do Spatie quản lý.
- Domain tables tách riêng theo nghiệp vụ.
- `posts` phục vụ tin tức/thông báo.
- `pages` phục vụ page public có layout bằng Puck.
- `post_categories` phục vụ phân loại bài viết.
- `navigation_items` dùng parent-child và polymorphic link tới post category, page hoặc post.
- Content tables dùng `*_format` để hỗ trợ nhiều format trong tương lai.

---

## 12. Luồng nghiệp vụ chính

### 12.1. Quản lý bài viết

- User có permission tạo bài viết.
- Chọn category cho bài viết.
- Soạn nội dung bằng BlockNote.
- Lưu `content` dưới dạng BlockNote JSON.
- Khi submit, bài viết vào `draft` hoặc `pending`.
- User có permission duyệt/xuất bản có thể chuyển sang `published`.

### 12.2. Quản lý post categories

- Admin/editor có permission quản lý category.
- Category có thể có parent nếu cần nhóm cha/con.
- Category active mới nên hiển thị ngoài public site.
- Category có thể được gắn vào navigation item.

### 12.3. Quản lý pages

- User có permission tạo page.
- Dựng layout bằng Puck.
- Lưu `content` dưới dạng Puck JSON.
- Page vào `draft`, `pending`, `published` hoặc `rejected`.
- Page đã publish có thể được gắn vào navigation item.

### 12.4. Quản lý navigation

- Admin/editor có permission quản lý navigation.
- Tạo menu theo location như `header`, `footer`, `mobile`.
- Tạo item cha/con bằng `parent_id`.
- Mỗi item có thể trỏ tới:
    - custom URL
    - post category
    - page
    - post
- Frontend render navigation theo cây, sắp xếp bằng `sort_order`.
- Backend vẫn phải validate item trỏ tới resource tồn tại và đã được publish nếu dùng ngoài public site.

### 12.5. Quản lý hồ sơ cán bộ

- Staff cập nhật hồ sơ của mình nếu có permission phù hợp.
- Editor/admin có thể cập nhật hồ sơ công khai nếu được cấp quyền.
- `bio` lưu BlockNote JSON.

### 12.6. Quản lý tài liệu

- Staff/editor/admin tạo tài liệu.
- Mô tả tài liệu lưu bằng BlockNote JSON.
- Với tài liệu Excel cá nhân hóa, parse vào `document_rows`.
- Sinh viên tra cứu bằng `student_code` của mình.

---

## 13. Quy ước implementation

### 13.1. Backend

- Authorization qua policy, request authorize, middleware `can`.
- Controller mỏng, domain logic đi qua action/service.
- Không hardcode role string trong business logic nếu permission đã đủ diễn đạt.
- Dùng Data object cho dữ liệu đi qua controller/action/Inertia props.
- Dùng Query Builder cho danh sách có filter/sort/search.

### 13.2. Frontend

- Inertia page dùng props authorization do backend share.
- Chỉ dùng permission booleans để quyết định UI action.
- Không hardcode URL, ưu tiên Wayfinder helpers.
- Các màn danh sách đồng bộ filter/search/sort/page vào query string bằng `nuqs`.

### 13.3. Quy ước dùng package trong implementation

#### `spatie/laravel-permission`

Dùng cho toàn bộ authorization của hệ thống.

Bắt buộc:

- Model `User` dùng trait `HasRoles`.
- Seed role và permission bằng seeder riêng.
- Check quyền bằng `$user->can(...)`, policy hoặc middleware `can`.
- Không thêm `role`, `roles`, `permission`, `is_admin` vào bảng `users`.

#### `spatie/laravel-data`

Dùng để chuẩn hóa dữ liệu đi qua các lớp trong backend.

Nên tạo Data object cho các domain chính:

```text
PostData
PostCategoryData
PageData
NavigationMenuData
NavigationItemData
DocumentData
StaffProfileData
StudentData
UnitData
PositionData
MediaData
```

Mục tiêu:

- Giảm array tự do giữa controller, action và Inertia props.
- Dễ type hint.
- Dễ test.
- Dễ tái sử dụng transform dữ liệu.

#### `spatie/laravel-query-builder`

Dùng cho các màn danh sách trong CMS.

Phạm vi dùng:

- Search/filter/sort posts.
- Search/filter/sort post categories.
- Search/filter/sort pages.
- Search/filter/sort navigation menus/items.
- Search/filter/sort documents.
- Search/filter/sort users.
- Search/filter/sort staff profiles.
- Search/filter/sort students.
- Search/filter/sort media.

Quy ước:

- Chỉ allow filter/sort/include rõ ràng.
- Không cho frontend truyền query tự do chưa kiểm soát.
- Kết hợp với `nuqs` ở frontend để lưu trạng thái filter trên URL.

#### `maatwebsite/excel:"4.x-dev"`

Dùng cho import/export Excel.

Use case MVP quan trọng nhất:

```text
Upload Excel điểm/dữ liệu cá nhân hóa
→ parse từng dòng
→ lấy student_code
→ lưu vào document_rows.data
```

Quy ước:

- Logic import không viết trực tiếp trong controller.
- Tạo action/service riêng, ví dụ `ImportStudentDocumentRows`.
- Validate file trước khi import.
- Không tin tưởng header Excel tuyệt đối, cần map/normalize key.
- Mỗi row lưu `row_index` để dễ debug khi dữ liệu lỗi.

Ghi chú rủi ro:

- Vì dùng `4.x-dev`, cần pin dependency bằng `composer.lock`.
- Trước mỗi lần update dependency, cần chạy test import Excel.
- Khi có bản stable hỗ trợ PHP 8.5, chuyển khỏi `4.x-dev`.

#### BlockNote

Dùng làm editor chính cho nội dung dạng văn bản có cấu trúc.

Áp dụng cho:

- `posts.content`
- `staff_profiles.bio`
- `units.description`
- `documents.description`

Quy ước:

- Lưu BlockNote JSON vào field nội dung.
- Lưu format tương ứng là `blocknote_json`.
- Không lưu HTML làm source of truth.

#### Puck

Dùng làm page builder chính cho bảng `pages`.

Áp dụng cho:

- `pages.content`

Quy ước:

- Lưu Puck JSON vào `pages.content`.
- Lưu format tương ứng là `puck_json`.
- Chỉ expose component đã định nghĩa trong Puck config.
- Không cho nhập React/JS tự do từ CMS.
- Renderer public chỉ render component nằm trong allowlist.
- Component có props được validate bằng schema rõ ràng.

#### `react-hook-form` + `zod`

Dùng cho form trong CMS.

Quy ước:

- Frontend validate để cải thiện UX.
- Backend Form Request vẫn là lớp validate bắt buộc.
- Không xem validate frontend là bảo mật.

#### `@tanstack/react-table`

Dùng cho bảng quản trị nhiều dữ liệu.

Áp dụng cho:

- Users
- Posts
- Post categories
- Pages
- Navigation menus/items
- Documents
- Staff profiles
- Students
- Units
- Positions
- Media

Quy ước:

- Pagination, filter, sort nên phản ánh lên URL.
- Data thật vẫn lấy từ backend qua Inertia props.
- Không load toàn bộ dữ liệu lớn lên frontend để tự filter nếu dataset có thể tăng.

#### `nuqs`

Dùng để quản lý query string state.

Áp dụng cho:

- Search keyword.
- Filter status.
- Filter visibility.
- Filter category.
- Sort column.
- Page hiện tại.

#### `react-dropzone`

Dùng cho upload file kéo-thả.

Áp dụng cho:

- Avatar cán bộ.
- Thumbnail bài viết.
- Thumbnail page.
- File tài liệu.
- File Excel.
- File preview.

#### `date-fns`

Dùng cho xử lý ngày giờ ở frontend.

Áp dụng cho:

- Format `published_at`.
- Format `created_at`, `updated_at`.
- Hiển thị `start_date`, `end_date` của chức vụ.
- Filter dữ liệu theo ngày.

### 13.4. Data migration

Nếu hệ thống cũ đang có `users.role`, hướng chuyển đổi là:

1. Tạo roles và permissions chuẩn.
2. Map dữ liệu `users.role` cũ sang role mới.
3. Gán role cho user qua Spatie.
4. Gỡ logic phụ thuộc `users.role`.
5. Chỉ xóa cột `users.role` khi toàn bộ code đã chuyển xong.

---

## 14. Những điều không nên làm

- Không dùng `users.role` làm nguồn sự thật.
- Không check quyền bằng string role rải rác khắp code.
- Không lưu HTML làm source of truth cho content BlockNote/Puck.
- Không dùng Puck thay cho mọi nội dung bài viết.
- Không dùng BlockNote để dựng layout page phức tạp.
- Không thêm tags, taxonomy nâng cao hoặc multi-category cho post trong MVP nếu chưa cần.
- Không tạo navigation hardcode trong frontend nếu CMS đã có navigation.
- Không cho navigation item trỏ tới resource không tồn tại.
- Không thêm quá nhiều bảng CMS phức tạp trước khi có use case rõ ràng.
- Không dùng frontend visibility như cơ chế bảo mật cuối cùng.

---

## 15. Kết luận

Guideline chính thức của VMUFit cho MVP là:

- Auth tập trung ở `users`.
- Authorization chuẩn hóa bằng `spatie/laravel-permission`.
- Ứng dụng check bằng permission, không check bằng `users.role`.
- Editor chính cho bài viết/mô tả/tiểu sử là BlockNote.
- Page builder cho bảng `pages` là Puck.
- Content dạng block lưu bằng BlockNote JSON.
- Content dạng page layout lưu bằng Puck JSON.
- Bài viết được phân loại bằng `post_categories`.
- Navigation được quản lý bằng `navigation_menus` và `navigation_items`.
- Navigation hỗ trợ parent-child và có thể trỏ tới `post_category`, `page`, `post` hoặc `custom_url`.
- Schema và flow ưu tiên đủ gọn để triển khai nhanh nhưng không khóa khả năng mở rộng.

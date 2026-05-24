# Guideline dự án VMUFit

## 1. Mục tiêu tài liệu

Tài liệu này là guideline chính thức cho thiết kế MVP của VMUFit.

Mục tiêu:

- Thống nhất kiến trúc backend, frontend, CMS và authorization.
- Thay thế cách nghĩ cũ dựa trên `users.role`.
- Chuẩn hóa role và permission theo `spatie/laravel-permission`.
- Gộp quyết định mới về editor và content storage từ `docs/editor.md`.
- Giữ phạm vi MVP đủ nhỏ để triển khai nhanh nhưng vẫn mở rộng được.

---

## 2. Mục tiêu hệ thống

VMUFit là website/CMS cho Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam.

Hệ thống gồm:

- Website public cho khách truy cập.
- CMS quản trị nội dung.
- Khu vực quản lý tài liệu cho cán bộ/giảng viên.
- Khu vực xem tài liệu cho sinh viên.
- Quản lý hồ sơ cán bộ/giảng viên.
- Quản lý tài liệu thường và tài liệu Excel cá nhân hóa theo mã sinh viên.

Mục tiêu MVP:

- Dùng một backend Laravel duy nhất.
- Dùng một bảng `users` duy nhất cho toàn bộ tài khoản đăng nhập.
- Tách dữ liệu nghiệp vụ ra các bảng chuyên biệt như `students`, `staff_profiles`, `documents`.
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
pnpm add react-hook-form zod @hookform/resolvers
pnpm add @tanstack/react-table
pnpm add nuqs
pnpm add react-dropzone
pnpm add date-fns
```

Vai trò chính của từng package:

- `@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`: editor block chính cho CMS.
- `react-hook-form`: quản lý form ở frontend.
- `zod`: validate dữ liệu phía frontend và định nghĩa schema dùng chung cho form.
- `@hookform/resolvers`: kết nối `zod` với `react-hook-form`.
- `@tanstack/react-table`: xây dựng bảng quản trị cho posts, documents, users, staff, students, media.
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
- Editor phải sinh dữ liệu có cấu trúc để dễ render và mở rộng.
- Với MVP, BlockNote JSON là source of truth cho content dạng bài viết.

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

## 6.1. Package sử dụng

Dự án dùng `spatie/laravel-permission` làm chuẩn cho role/permission.

Điều này có nghĩa:

- User gắn role qua `model_has_roles`.
- Role gắn permission qua `role_has_permissions`.
- Có thể gắn permission trực tiếp cho user, nhưng guideline không khuyến khích.

## 6.2. Quy tắc bắt buộc

- User có roles.
- Roles có permissions.
- Ứng dụng check permissions.
- Không dùng `users.role`.
- Không thêm cột `role`, `roles`, `permission`, `is_admin` vào `users`.
- Không lưu logic quyền trong JSON config ad-hoc.

## 6.3. Chính sách gán quyền

Quy ước của dự án:

- Permission là đơn vị kiểm soát truy cập nhỏ nhất.
- Role là nhóm permission để dễ gán cho user.
- Ưu tiên gán permission cho role.
- Hạn chế tối đa việc gán permission trực tiếp cho user.

Chỉ cân nhắc direct permission nếu:

- Đây là ngoại lệ rất hiếm.
- Có nhu cầu override tạm thời.
- Đã có lý do nghiệp vụ rõ ràng.

## 6.4. Tên role đề xuất cho MVP

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

Ghi chú:

- Có thể không cần gán `student` cho mọi user ngay ngày đầu nếu chỉ dùng auth + nghiệp vụ `students`.
- Nếu cần phân quyền nhất quán qua package, vẫn nên tạo role `student`.

## 6.5. Tên permission đề xuất cho MVP

Permission nên đặt theo động từ + tài nguyên.

Ví dụ:

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

## 6.6. Mapping role -> permission ở mức guideline

### `super-admin`

- Toàn bộ permission.
- Được xử lý qua `Gate::before`.

### `admin`

- Quản lý users, roles, permissions.
- Quản lý toàn bộ posts, documents, units, positions, appointments.
- Có thể xuất bản và duyệt.

### `editor`

- Quản lý content và document theo phạm vi CMS.
- Tạo, sửa, duyệt, xuất bản bài viết.
- Có thể quản lý hồ sơ public nếu nghiệp vụ cho phép.
- Không mặc định quản lý users, roles, permissions.

### `staff`

- Xem và cập nhật hồ sơ của chính mình.
- Tạo, sửa, quản lý tài liệu của chính mình.
- Có thể xem một số tài liệu nội bộ yêu cầu đăng nhập hoặc staff-only.

### `student`

- Xem nội dung yêu cầu đăng nhập.
- Xem tài liệu dành cho sinh viên.
- Xem dữ liệu tài liệu cá nhân hóa theo `student_code`.

## 6.7. Cách check quyền trong code

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

## 6.8. Super admin

Quy ước:

- Dùng `Gate::before`.
- Nếu user có role `super-admin`, trả về `true`.
- Nếu không, trả về `null` để tiếp tục check như bình thường.

Pseudo guideline:

```php
Gate::before(function (User $user, string $ability): ?bool {
    return $user->hasRole('super-admin') ? true : null;
});
```

Không return `false` trong nhánh còn lại.

## 6.9. Middleware và route authorization

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

## 6.10. Frontend authorization

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
auth.permissions.documents.review
```

Chỉ share các permission mà UI thật sự cần.

## 6.11. Seed role và permission

Guideline seed:

- Seed roles và permissions bằng code idempotent.
- Dùng `findOrCreate`.
- Flush permission cache trước khi seed.

Quy ước:

- Có seeder riêng cho roles/permissions.
- Có thể có file map role -> permission rõ ràng.
- Tránh hardcode nhiều nơi.

## 6.12. Teams

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

## 8. Editor và content architecture

## 8.1. Kết luận cho MVP

MVP dùng **BlockNote** làm editor chính cho content CMS.

Phạm vi phù hợp:

- Tin tức
- Thông báo
- Tiểu sử giảng viên/cán bộ
- Mô tả đơn vị
- Mô tả tài liệu
- Nội dung CMS dạng bài viết

Không triển khai đồng thời BlockNote và Puck trong MVP.

## 8.2. Vì sao chọn BlockNote

BlockNote phù hợp với người dùng non-tech vì:

- Cách dùng gần với Notion hoặc block editor hiện đại.
- Có trải nghiệm block rõ ràng.
- Dễ thêm block mới.
- Dễ tích hợp với React.
- Phù hợp với Laravel + Inertia + React.

Người dùng có thể:

- Gõ nội dung.
- Thêm block bằng Enter.
- Dùng slash command.
- Chèn heading, ảnh, bảng, file, link.
- Kéo-thả block.

## 8.3. Puck dùng khi nào

Puck phù hợp cho page builder sau MVP.

Use cases sau MVP:

- Trang chủ
- Landing page tuyển sinh
- Landing page sự kiện
- Trang giới thiệu có layout đặc thù
- Các trang cần dựng layout kéo-thả theo component

Kết luận:

```text
MVP: BlockNote
Sau MVP: cân nhắc thêm Puck cho page builder
```

## 8.4. Phân vai giữa BlockNote và Puck

| Nhu cầu                 | Công cụ   | Giai đoạn |
| ----------------------- | --------- | --------- |
| Viết bài tin tức        | BlockNote | MVP       |
| Viết thông báo          | BlockNote | MVP       |
| Viết tiểu sử giảng viên | BlockNote | MVP       |
| Viết mô tả đơn vị       | BlockNote | MVP       |
| Viết mô tả tài liệu     | BlockNote | MVP       |
| Dựng trang chủ kéo-thả  | Puck      | Sau MVP   |
| Dựng landing page       | Puck      | Sau MVP   |
| Dựng layout phức tạp    | Puck      | Sau MVP   |

---

## 9. Quy ước lưu content

## 9.1. Source of truth

Nội dung dạng block phải lưu **BlockNote JSON** làm source of truth.

Phương án chuẩn:

```text
content = BlockNote JSON
content_format = blocknote_json
```

Không dùng HTML làm dữ liệu chính.
Không dùng Markdown làm dữ liệu chính cho CMS block editor.

## 9.2. Vì sao lưu JSON

Lợi ích:

- Giữ đúng cấu trúc block.
- Render lại dễ trong React.
- Dễ thêm custom block sau này.
- Dễ kiểm soát nội dung được phép render.
- Dễ migrate renderer/editor khác.
- Giảm phụ thuộc vào HTML thô.

Ví dụ block có thể mở rộng sau này:

- Alert block
- File attachment block
- Related documents block
- Staff card block
- Department info block
- Important notice block

## 9.3. Kiểu cột database

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

- Query theo cấu trúc block.
- Index các key trong JSON.
- Database-level validation.

## 9.4. Các format được chấp nhận

Nên dùng field `*_format` để biết nội dung đang lưu theo định dạng nào.

Giá trị đề xuất:

```text
blocknote_json
plain_text
html
puck_json
```

Trong MVP, format chính là:

```text
blocknote_json
```

---

## 10. Database MVP

## 10.1. Bảng `users`

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

## 10.2. Bảng permission-related

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

## 10.3. Bảng `students`

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

## 10.4. Bảng `staff_profiles`

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

## 10.5. Bảng `units`

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

## 10.6. Bảng `positions`

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

## 10.7. Bảng `staff_appointments`

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

## 10.8. Bảng `posts`

Quản lý tin tức/bài viết/nội dung CMS.

```text
posts
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

`content` lưu BlockNote JSON.

Status MVP:

```text
draft
pending
published
rejected
```

## 10.9. Bảng `documents`

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

## 10.10. Bảng `document_rows`

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

## 10.11. Bảng `media`

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

posts
documents
document_rows
media
```

Tư duy chính:

- `users` là auth root.
- Role/permission do Spatie quản lý.
- Domain tables tách riêng theo nghiệp vụ.
- Content tables dùng `*_format` để hỗ trợ nhiều format trong tương lai.

---

## 12. Luồng nghiệp vụ chính

## 12.1. Quản lý bài viết

- User có permission tạo bài viết.
- Soạn nội dung bằng BlockNote.
- Lưu `content` dưới dạng BlockNote JSON.
- Khi submit, bài viết vào `draft` hoặc `pending`.
- User có permission duyệt/xuất bản có thể chuyển sang `published`.

## 12.2. Quản lý hồ sơ cán bộ

- Staff cập nhật hồ sơ của mình nếu có permission phù hợp.
- Editor/admin có thể cập nhật hồ sơ công khai nếu được cấp quyền.
- `bio` lưu BlockNote JSON.

## 12.3. Quản lý tài liệu

- Staff/editor/admin tạo tài liệu.
- Mô tả tài liệu lưu bằng BlockNote JSON.
- Với tài liệu Excel cá nhân hóa, parse vào `document_rows`.
- Sinh viên tra cứu bằng `student_code` của mình.

---

## 13. Quy ước implementation

## 13.1. Backend

- Authorization qua policy, request authorize, middleware `can`.
- Controller mỏng, domain logic đi qua action/service.
- Không hardcode role string trong business logic nếu permission đã đủ diễn đạt.

## 13.2. Frontend

- Inertia page dùng props authorization do backend share.
- Chỉ dùng permission booleans để quyết định UI action.
- Không hardcode URL, ưu tiên Wayfinder helpers.

## 13.3. Quy ước dùng package trong implementation

### Backend package

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

### Frontend package

#### BlockNote

Dùng làm editor chính cho CMS.

Áp dụng cho:

- `posts.content`
- `staff_profiles.bio`
- `units.description`
- `documents.description`

Quy ước:

- Lưu BlockNote JSON vào field nội dung.
- Lưu format tương ứng là `blocknote_json`.
- Không lưu HTML làm source of truth.

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
- Sort column.
- Page hiện tại.

#### `react-dropzone`

Dùng cho upload file kéo-thả.

Áp dụng cho:

- Avatar cán bộ.
- Thumbnail bài viết.
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

## 13.4. Data migration

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
- Không lưu HTML làm source of truth cho content BlockNote.
- Không triển khai cả BlockNote và Puck ngay trong MVP.
- Không thêm quá nhiều bảng CMS phức tạp trước khi có use case rõ ràng.
- Không dùng frontend visibility như cơ chế bảo mật cuối cùng.

---

## 15. Kết luận

Guideline chính thức của VMUFit cho MVP là:

- Auth tập trung ở `users`.
- Authorization chuẩn hóa bằng `spatie/laravel-permission`.
- Ứng dụng check bằng permission, không check bằng `users.role`.
- Editor chính cho CMS là BlockNote.
- Content dạng block lưu bằng BlockNote JSON và có `*_format`.
- Puck để dành cho page builder sau MVP.
- Schema và flow ưu tiên đủ gọn để triển khai nhanh nhưng không khóa khả năng mở rộng.

# VMUFit - Task Plan & Collaboration Guide

Tài liệu này tách riêng phần kế hoạch triển khai, tracking task và quy trình làm việc nhiều người. Guideline kiến trúc chính nằm ở `VMUFit.md`; chiến lược render `shell -> template -> content` được tách riêng ở `docs/content-layout-strategy.md`.

## Mục lục

- [1. Kế hoạch chia nhỏ implementation cho Codex](#1-ke-hoach-chia-nho-implementation-cho-codex)
- [1.1. Phase 0 - Chuẩn bị project và quy ước làm việc](#11-phase-0---chuan-bi-project-va-quy-uoc-lam-viec)
- [1.2. Phase 1 - Nền tảng auth, role và permission](#12-phase-1---nen-tang-auth-role-va-permission)
- [1.3. Phase 2 - Database domain MVP](#13-phase-2---database-domain-mvp)
- [1.4. Phase 3 - Backend actions, data objects và policy](#14-phase-3---backend-actions-data-objects-va-policy)
- [1.5. Phase 4 - Frontend CMS foundation](#15-phase-4---frontend-cms-foundation)
- [1.6. Phase 5 - Module nội dung chính](#16-phase-5---module-noi-dung-chinh)
- [1.7. Phase 6 - Public website MVP](#17-phase-6---public-website-mvp)
- [1.8. Phase 7 - Testing, hardening và release MVP](#18-phase-7---testing-hardening-va-release-mvp)
- [2. Tracking tiến độ dự án](#2-tracking-tien-do-du-an)
- [3. Quy trình làm việc nhiều người để hạn chế conflict](#3-quy-trinh-lam-viec-nhieu-nguoi-de-han-che-conflict)

## 1. Kế hoạch chia nhỏ implementation cho Codex

Mục tiêu của phần này là chia dự án thành các phần đủ nhỏ để giao cho Codex hoặc cho từng thành viên trong team mà ít gây conflict.

Nguyên tắc chia việc:

- Mỗi task nên tạo được một pull request nhỏ.
- Một task nên tập trung vào một domain hoặc một lớp kỹ thuật rõ ràng.
- Không trộn migration, UI, authorization và import Excel trong cùng một PR lớn nếu không cần thiết.
- Mỗi task phải có checklist hoàn thành và lệnh kiểm tra tối thiểu.
- Codex chỉ nên được giao việc với phạm vi file rõ ràng.

### 1.1. Phase 0 - Chuẩn bị project và quy ước làm việc

Mục tiêu:

- Chốt cấu trúc thư mục.
- Cài package nền.
- Thiết lập quality gate.
- Chuẩn hóa cách giao task cho Codex.

Task đề xuất:

#### Task 0.1 - Cài package backend MVP

Phạm vi:

- Cài các package backend trong guideline.
- Publish config/migration nếu package yêu cầu.
- Không viết business logic ở task này.

Checklist:

- [ ] Cài `spatie/laravel-permission`.
- [ ] Cài `spatie/laravel-data`.
- [ ] Cài `spatie/laravel-query-builder`.
- [ ] Cài `maatwebsite/excel:"4.x-dev"`.
- [ ] Commit `composer.json` và `composer.lock`.
- [ ] Chạy test/lint backend tối thiểu.

Prompt mẫu cho Codex:

```text
Dựa theo guideline VMUFit.md, hãy cài và cấu hình package backend MVP. Chỉ thay đổi phần package/config/migration cần thiết. Không triển khai business logic. Sau khi làm xong, liệt kê file đã sửa và lệnh kiểm tra cần chạy.
```

#### Task 0.2 - Cài package frontend MVP

Phạm vi:

- Cài các package frontend trong guideline.
- Không xây UI domain cụ thể.

Checklist:

- [ ] Cài BlockNote packages theo hướng `@blocknote/shadcn`.
- [ ] Cài `@measured/puck` cho page builder.
- [ ] Cài `react-hook-form`, `zod`, `@hookform/resolvers`.
- [ ] Cài `@tanstack/react-table`.
- [ ] Cài `nuqs`.
- [ ] Cài `react-dropzone`.
- [ ] Cài `date-fns`.
- [ ] Commit `package.json` và lockfile.
- [ ] Chạy typecheck/lint frontend tối thiểu.

Prompt mẫu cho Codex:

```text
Dựa theo guideline VMUFit.md, hãy cài các package frontend MVP gồm BlockNote, Puck, form/table/query/upload/date utilities. Không tạo page nghiệp vụ. Nếu cần chỉnh config TypeScript/Vite thì chỉ chỉnh tối thiểu. Cuối cùng liệt kê file đã sửa và lệnh kiểm tra.
```

#### Task 0.3 - Tạo tài liệu tracking task

Phạm vi:

- Tạo `docs/tasks.md`.
- Tạo template task/PR.
- Không sửa code nghiệp vụ.

Checklist:

- [ ] Tạo bảng tracking theo phase.
- [ ] Có trạng thái `todo`, `doing`, `review`, `done`, `blocked`.
- [ ] Có owner, branch, PR, files touched, test commands.
- [ ] Có quy tắc mỗi task chỉ một owner chính.

Prompt mẫu cho Codex:

```text
Tạo file docs/tasks.md để tracking tiến độ dự án VMUFit theo guideline. File cần có bảng phase/task/status/owner/branch/PR/files/test/notes và checklist Definition of Done. Không sửa code.
```

### 1.2. Phase 1 - Nền tảng auth, role và permission

Mục tiêu:

- Loại bỏ tư duy `users.role`.
- Dùng Spatie làm chuẩn.
- Có seed role/permission idempotent.

#### Task 1.1 - Cấu hình Spatie permission cho User

Checklist:

- [ ] `User` dùng trait `HasRoles`.
- [ ] Config guard phù hợp với auth hiện tại.
- [ ] Không thêm cột role vào `users`.
- [ ] Chạy migration package.

Prompt mẫu:

```text
Triển khai cấu hình spatie/laravel-permission theo VMUFit.md. User phải dùng HasRoles. Không thêm users.role hoặc is_admin. Chỉ cấu hình nền tảng và migration liên quan.
```

#### Task 1.2 - Tạo seeder roles/permissions

Checklist:

- [ ] Tạo danh sách permission MVP.
- [ ] Tạo roles `super-admin`, `admin`, `editor`, `staff`, `student`.
- [ ] Map role -> permission.
- [ ] Seeder idempotent.
- [ ] Flush permission cache trước khi seed.
- [ ] Có test hoặc assertion cơ bản.

Prompt mẫu:

```text
Dựa theo mục authorization trong VMUFit.md, tạo seeder role/permission idempotent cho MVP. Dùng findOrCreate, flush cache trước khi seed, không hardcode logic role trong business code.
```

#### Task 1.3 - Gate::before cho super-admin

Checklist:

- [ ] Thêm `Gate::before`.
- [ ] User có role `super-admin` được allow toàn bộ ability.
- [ ] Nhánh còn lại return `null`, không return `false`.
- [ ] Có test permission cơ bản.

Prompt mẫu:

```text
Thêm Gate::before cho super-admin theo VMUFit.md. Đảm bảo return true nếu user có role super-admin, return null nếu không. Viết test chứng minh super-admin bypass permission và user thường vẫn check bình thường.
```

### 1.3. Phase 2 - Database domain MVP

Mục tiêu:

- Tạo schema gọn theo guideline.
- Chưa cần UI đầy đủ.
- Chưa xử lý flow phức tạp.

Nên chia migration theo nhóm để tránh conflict:

- Người A: users/students/staff_profiles.
- Người B: units/positions/staff_appointments.
- Người C: posts/post_categories/pages/navigation.
- Người D: documents/document_rows/media.

#### Task 2.1 - Students và Staff Profiles

Checklist:

- [ ] Tạo migration `students`.
- [ ] Tạo migration `staff_profiles`.
- [ ] Tạo model và relationship với `User`.
- [ ] `bio` dùng LONGTEXT.
- [ ] `bio_format` default `blocknote_json` nếu phù hợp.
- [ ] Không thêm quá nhiều field profile ngoài guideline.

Prompt mẫu:

```text
Triển khai bảng students và staff_profiles theo VMUFit.md. Tạo migration, model, relationship với User. Giữ schema tối giản, không thêm field ngoài guideline nếu chưa cần.
```

#### Task 2.2 - Units, Positions và Staff Appointments

Checklist:

- [ ] Tạo migration `units`.
- [ ] Tạo migration `positions`.
- [ ] Tạo migration `staff_appointments`.
- [ ] Tạo model và relationship.
- [ ] Không dùng `is_current`; xác định hiện tại bằng `end_date`.

Prompt mẫu:

```text
Triển khai units, positions, staff_appointments theo VMUFit.md. Tạo migration, model, relationship. Không thêm is_current. Chức vụ hiện tại sẽ xác định bằng end_date.
```

#### Task 2.3 - Posts, Post Categories, Pages và Navigation

Checklist:

- [ ] Tạo migration `post_categories`.
- [ ] Tạo migration hoặc cập nhật `posts` + pivot `post_post_category` để hỗ trợ nhiều chuyên mục cho một bài viết.
- [ ] Tạo migration `pages` dùng `content_format` mặc định `puck_json`.
- [ ] Tạo migration `navigation_menus`.
- [ ] Tạo migration `navigation_items` có `parent_id`, `type`, `linkable_type`, `linkable_id`, `url`, `sort_order`.
- [ ] Tạo model và relationship cơ bản: category tree, page author, navigation menu/items, item parent/children, `morphTo linkable`.
- [ ] Validate ở schema/test rằng navigation item có thể trỏ tới `post_category`, `page`, `post` hoặc `custom_url`.

Prompt mẫu:

```text
Triển khai post_categories, posts với quan hệ nhiều-nhiều category qua pivot, pages và navigation theo VMUFit.md. Pages lưu Puck JSON, posts lưu BlockNote JSON. Navigation hỗ trợ parent-child và polymorphic link tới post_category/page/post hoặc custom_url.
```

#### Task 2.4 - Documents, Document Rows và Media

Checklist:

- [ ] Tạo migration `documents`.
- [ ] Tạo migration `document_rows`.
- [ ] Tạo migration `media`.
- [ ] Description dùng LONGTEXT và `description_format`.
- [ ] Status/visibility/document_mode dùng enum-like string rõ ràng.
- [ ] Tạo model và relationship cơ bản.

Prompt mẫu:

```text
Triển khai documents, document_rows và media theo VMUFit.md. Tạo migration, model, relationship. Description dạng block lưu LONGTEXT kèm *_format, không lưu HTML làm source of truth.
```

### 1.4. Phase 3 - Backend actions, data objects và policy

Mục tiêu:

- Controller mỏng.
- Logic chính nằm trong action/service.
- Data object dùng để giảm array tự do.

Chia theo domain:

#### Task 3.1 - Data objects nền tảng

Checklist:

- [ ] Tạo `PostData`.
- [ ] Tạo `PostCategoryData`.
- [ ] Tạo `PageData`.
- [ ] Tạo `NavigationMenuData` và `NavigationItemData`.
- [ ] Tạo `DocumentData`.
- [ ] Tạo `StaffProfileData`.
- [ ] Tạo `StudentData`.
- [ ] Tạo `UnitData`.
- [ ] Tạo `PositionData`.
- [ ] Không nhồi logic database vào Data object.

Prompt mẫu:

```text
Tạo các Spatie Laravel Data object cho domain chính theo VMUFit.md, bao gồm posts, post categories, pages, navigation, documents, staff, students, units, positions và media. Data object chỉ chuẩn hóa dữ liệu vào/ra, không chứa business logic database phức tạp.
```

#### Task 3.2 - Policy và Form Request cho Posts

Checklist:

- [ ] Tạo policy cho posts.
- [ ] Check bằng `$user->can(...)`.
- [ ] Tạo request validate create/update/publish nếu cần.
- [ ] Validate `category_ids` và pivot category nếu post gắn chuyên mục.
- [ ] Tách rõ request lưu bài (`draft|pending`, hoặc `published` nếu có quyền) với request duyệt bài (`published|rejected`).
- [ ] Không check bằng `$user->hasRole('admin')` trong policy.

Prompt mẫu:

```text
Triển khai policy và form request cho posts theo VMUFit.md. Mọi authorization phải check permission bằng user->can hoặc policy ability, không check role trực tiếp trong business logic.
```

#### Task 3.3 - Policy và Form Request cho Documents

Checklist:

- [ ] Tạo policy cho documents.
- [ ] Phân biệt quyền quản lý tài liệu và quyền xem/download.
- [ ] Validate visibility/status/document_mode.
- [ ] Không tin frontend là lớp bảo mật.

Prompt mẫu:

```text
Triển khai policy và form request cho documents theo VMUFit.md. Cần validate visibility, status, document_mode và authorize ở backend. Không dựa vào frontend để bảo vệ tài nguyên.
```

#### Task 3.4 - Query Builder cho danh sách CMS

Checklist:

- [ ] Tạo query cho posts list.
- [ ] Tạo query cho documents list.
- [ ] Tạo query cho users/staff/students nếu đã có màn tương ứng.
- [ ] Chỉ allow filter/sort/include rõ ràng.

Prompt mẫu:

```text
Dùng spatie/laravel-query-builder để chuẩn hóa list query cho CMS theo VMUFit.md. Chỉ allow filter/sort/include được khai báo rõ, không cho query tự do.
```

#### Task 3.5 - Policy, Form Request và Query Builder cho Pages, Categories, Navigation

Checklist:

- [ ] Tạo policy/request cho `pages` với publish workflow `draft|pending|published|rejected`.
- [ ] Tạo policy/request cho `post_categories`.
- [ ] Tạo policy/request cho `navigation_menus` và `navigation_items`.
- [ ] Validate navigation item: `custom_url` bắt buộc `url`; `post_category/page/post` bắt buộc `linkable_type` + `linkable_id`.
- [ ] Tạo query builder/list query cho pages, categories và navigation.
- [ ] Không check role trực tiếp trong policy.

Prompt mẫu:

```text
Triển khai policy, form request và query builder cho pages, post_categories và navigation theo VMUFit.md. Pages dùng Puck JSON. Navigation item hỗ trợ parent-child và link tới post_category/page/post hoặc custom_url. Authorization phải check bằng permission, không check role trực tiếp.
```

### 1.5. Phase 4 - Frontend CMS foundation

Mục tiêu:

- Có layout admin.
- Có authorization props.
- Có component nền cho form, table, upload, BlockNote editor, Puck builder và navigation tree.

#### Task 4.1 - Admin layout và navigation theo permission

Checklist:

- [ ] Tạo admin layout.
- [ ] Menu đọc permission từ Inertia props.
- [ ] Ẩn action không có quyền.
- [ ] Backend vẫn phải authorize thật.

Prompt mẫu:

```text
Tạo admin layout và navigation cho CMS VMUFit. Menu/action chỉ hiển thị dựa trên permission props từ backend. Không hardcode role ở frontend.
```

#### Task 4.2 - BlockNote editor wrapper

Checklist:

- [x] Tạo component editor dùng BlockNote.
- [x] Input/output là BlockNote JSON string hoặc object thống nhất.
- [x] Có prop disabled/readOnly nếu cần.
- [x] Không convert HTML thành source of truth.

Prompt mẫu:

```text
Tạo component BlockNoteEditor dùng cho CMS. Component phải nhận và trả về BlockNote JSON theo guideline VMUFit.md. Không lưu HTML làm source of truth.
```

#### Task 4.3 - Table foundation với TanStack Table và nuqs

Checklist:

- [ ] Tạo component/table pattern dùng chung.
- [ ] Search/filter/sort/page đồng bộ URL bằng nuqs.
- [ ] Không tự filter toàn bộ dataset lớn ở frontend.

Prompt mẫu:

```text
Tạo pattern bảng CMS dùng @tanstack/react-table và nuqs. Search/filter/sort/pagination phải phản ánh trên query string. Data thật lấy từ backend qua Inertia props.
```

#### Task 4.4 - Upload foundation với react-dropzone

Checklist:

- [ ] Tạo component upload dùng chung.
- [ ] Hỗ trợ ảnh, tài liệu, Excel.
- [ ] Có validate mime/size ở frontend cho UX.
- [ ] Nhắc rõ backend vẫn validate bắt buộc.

Prompt mẫu:

```text
Tạo component upload dùng react-dropzone cho VMUFit. Hỗ trợ avatar, thumbnail, document file, Excel. Validate frontend chỉ để UX, backend vẫn phải validate.
```

#### Task 4.5 - Puck page builder wrapper

Checklist:

- [ ] Tạo wrapper/config cho Puck.
- [ ] Input/output là Puck JSON dùng cho `pages.content`.
- [ ] Chỉ expose component đã được kiểm soát trong config.
- [ ] Không dùng Puck thay cho posts/documents/staff bio.
- [ ] Có chế độ preview/render cơ bản cho page published.

Prompt mẫu:

```text
Tạo Puck page builder wrapper cho VMUFit theo guideline. Component dùng cho pages.content, lưu Puck JSON, chỉ expose component đã định nghĩa trong config và không thay thế BlockNote cho posts/documents/staff bio.
```

#### Task 4.6 - Navigation tree UI foundation

Checklist:

- [ ] Tạo component hiển thị/sửa cây navigation parent-child.
- [ ] Hỗ trợ reorder bằng `sort_order` trong cùng cấp.
- [ ] Cho chọn loại item: `custom_url`, `post_category`, `page`, `post`.
- [ ] Với `custom_url`, nhập `url`; với internal link, chọn resource nội bộ.
- [ ] Không hardcode menu public trong frontend nếu dữ liệu đã có trong CMS.

Prompt mẫu:

```text
Tạo foundation UI cho navigation tree theo VMUFit.md. Navigation item hỗ trợ parent-child, reorder, và link tới custom_url/post_category/page/post. UI chỉ phục vụ trải nghiệm; backend vẫn validate toàn bộ.
```

#### Task 4.7 - Reverb realtime CMS demo

Checklist:

- [x] Cài `laravel/reverb` và `pusher/pusher-php-server`.
- [x] Cập nhật `.env.example` với nhóm biến Reverb/Broadcasting cần thiết.
- [x] Tạo `web/lib/echo.ts` dùng `laravel-echo` + `pusher-js`.
- [x] Import Echo ở entry point frontend một lần.
- [x] Tạo event broadcast private channel `cms-user.{userId}`.
- [x] Tạo route `POST /cms/realtime/ping` chỉ dành cho user đã login, verified và có quyền `view admin dashboard`.
- [x] Thêm widget “Test realtime” trong CMS dashboard.
- [x] Bổ sung test backend cho route và channel authorization.
- [x] Cập nhật `composer run dev` để chạy thêm `reverb:start`.

Prompt mẫu:

```text
Triển khai Reverb theo hướng tối thiểu nhưng production-aware cho VMUFit. Cài backend broadcasting/Reverb, cấu hình env, tạo Echo setup frontend, thêm một demo realtime an toàn trong CMS dashboard và kiểm thử route/channel authorization. Không hard-code secret và không tạo permission mới nếu permission đã tồn tại.
```

### 1.6. Phase 5 - Module nội dung chính

Mục tiêu:

- Triển khai module theo thứ tự ít phụ thuộc trước.
- Mỗi module gồm backend route/controller/action/policy + frontend list/form.

Thứ tự đề xuất:

1. Media.
2. Units/Positions.
3. Staff Profiles.
4. Post Categories.
5. Posts.
6. Pages bằng Puck.
7. Navigation.
8. Documents thường.
9. Documents Excel cá nhân hóa.
10. User management.
11. Role/permission management.
12. Public website render pages/navigation.

#### Task 5.1 - Media module

Checklist:

- [ ] Upload file vào disk cấu hình.
- [ ] Lưu metadata vào `media`.
- [ ] Policy upload/view/delete.
- [ ] UI upload cơ bản.

#### Task 5.2 - Units/Positions module

Checklist:

- [x] CRUD units.
- [x] CRUD positions.
- [x] Sort order/is_active.
- [x] Description dùng BlockNote JSON.

#### Task 5.3 - Staff Profiles module

Checklist:

- [ ] CRUD staff profiles.
- [ ] Staff cập nhật hồ sơ của mình nếu có quyền.
- [ ] Avatar qua media.
- [ ] Bio dùng BlockNote.
- [ ] Public listing chỉ lấy hồ sơ `is_public`.

#### Task 5.4 - Post Categories module

Checklist:

- [ ] CRUD post categories.
- [ ] Hỗ trợ category cha/con nếu cần.
- [ ] Sort order/is_active.
- [ ] Dùng category để filter posts trong CMS và public.
- [ ] Category có thể được chọn làm đích navigation item.

#### Task 5.5 - Posts module

Checklist:

- [ ] CRUD posts.
- [ ] Gắn nhiều `category_ids` cho post qua pivot `post_post_category`.
- [ ] Draft/pending/published/rejected.
- [ ] Publish permission riêng.
- [ ] Editor lưu bản nháp hoặc gửi duyệt bằng `pending`.
- [ ] User có quyền `publish posts` có thể publish trực tiếp trong form khi cần.
- [ ] Có action/endpoint duyệt riêng để chuyển `pending -> published|rejected`.
- [ ] Thumbnail qua media.
- [ ] Content dùng BlockNote JSON.
- [ ] Public page chỉ hiển thị bài published.

#### Task 5.6 - Pages module bằng Puck

Checklist:

- [ ] CRUD pages.
- [ ] Dựng layout bằng Puck.
- [ ] Render theo nguyên tắc `shell -> template -> content` trong `docs/content-layout-strategy.md`.
- [ ] Lưu `pages.content` dạng Puck JSON.
- [ ] Draft/pending/published/rejected.
- [ ] Publish permission riêng.
- [ ] Page published có thể được chọn làm navigation item.
- [ ] Không gọi module này là `static_pages`.

#### Task 5.7 - Navigation module

Checklist:

- [x] CRUD navigation menus.
- [x] CRUD navigation items.
- [x] Hỗ trợ parent-child qua `parent_id`.
- [x] Hỗ trợ reorder bằng `sort_order`.
- [x] Item có thể trỏ tới `post_category`, `page`, `post` hoặc `custom_url`.
- [x] Chỉ render item `is_active` ở public.

#### Task 5.10 - Hardening luồng duyệt bài viết

Checklist:

- [ ] Chỉ cho phép duyệt/từ chối các bài đang ở trạng thái `pending`.
- [ ] Bổ sung metadata người duyệt và thời điểm duyệt/từ chối nếu nghiệp vụ cần theo dõi.
- [ ] Bổ sung lý do từ chối để editor có thể chỉnh sửa và gửi lại.
- [ ] Làm rõ transition `draft -> pending -> published|rejected`, và đường quay lại từ `rejected`.
- [ ] Bổ sung test cho transition bất hợp lệ và authorization của endpoint duyệt.

Prompt mẫu:

```text
Hardening luồng duyệt bài viết trong CMS. Giữ CRUD posts hiện tại, nhưng siết state transition để chỉ bài pending mới được duyệt/từ chối, bổ sung metadata reviewer và rejection reason nếu cần, đồng thời cập nhật test cho các transition và quyền publish.
```

#### Task 5.11 - User management module

Checklist:

- [ ] Có trang danh sách user trong CMS.
- [ ] Có filter cơ bản theo tên, email, trạng thái, role.
- [ ] Có form tạo user nội bộ nếu nghiệp vụ cần.
- [ ] Có form cập nhật thông tin user cơ bản.
- [ ] Có cơ chế gán hoặc bỏ role cho user.
- [ ] Không cho sửa quyền bằng cách ghi trực tiếp vào bảng trung gian ngoài flow chuẩn của Spatie.
- [ ] Có guard không cho người không đủ quyền tự nâng quyền bản thân.
- [ ] Có test cho list/create/update/assign role và authorization chính.

Prompt mẫu:

```text
Triển khai module quản lý user trong CMS cho VMUFit. Module cần có list/filter, create/update thông tin cơ bản và gán role cho user bằng API/flow chuẩn của spatie/laravel-permission. Không thêm users.role hay hardcode quyền ở frontend. Bổ sung test cho authorization và các thao tác quản trị chính.
```

#### Task 5.12 - Role và permission management module

Checklist:

- [ ] Có trang xem danh sách roles và permissions hiện có.
- [ ] Có thể tạo hoặc cập nhật role nếu dự án cho phép quản trị động.
- [ ] Có UI gán permission cho từng role.
- [ ] Hiển thị rõ permission đang được dùng bởi role nào.
- [ ] Flush permission cache đúng lúc sau khi cập nhật mapping.
- [ ] Chặn sửa hoặc xóa các role hệ thống nhạy cảm nếu nghiệp vụ yêu cầu.
- [ ] Không thay thế policy/gate bằng logic UI.
- [ ] Có test cho sync permission, authorization và các guard quan trọng.

Prompt mẫu:

```text
Triển khai module quản lý role và permission trong CMS cho VMUFit. Cho phép xem role/permission hiện có và cập nhật mapping role -> permission qua flow chuẩn của spatie/laravel-permission, đồng thời flush permission cache đúng cách và bảo vệ các role hệ thống nhạy cảm. Viết test cho authorization và permission sync.
```

### 1.7. Phase 6 - Public website MVP

Mục tiêu:

- Có các trang public đủ dùng.
- Render page bằng Puck JSON đã published.
- Render navigation từ CMS theo location và cây parent-child.
- Chỉ render dữ liệu đã published/public.

#### Task 6.1 - Public render architecture shell/template/content

Checklist:

- [ ] Chốt site shell cho header/footer/navigation.
- [ ] Chốt registry template cho page, post và category.
- [ ] Page render theo `shell -> template -> content`.
- [ ] `pages.content` chỉ là body Puck JSON.
- [ ] Post render theo `shell -> template -> content`.
- [ ] `posts.content` chỉ là body BlockNote JSON.
- [ ] Category render theo `shell -> template -> content`.
- [ ] `PostCategory` có thể dùng archive/landing/hybrid template theo `docs/content-layout-strategy.md`.
- [ ] Có test cho mapping template và render pipeline cơ bản.

Prompt mẫu cho Codex:

```text
Triển khai chiến lược render shell -> template -> content cho public website theo docs/content-layout-strategy.md. Chỉ chốt kiến trúc render, registry template và rule cho page/post/category; không làm full public pages module ở task này.
```

#### Task 6.2 - Public website, pages, and navigation MVP

Checklist:

- [x] Chốt cơ chế `system pages` cho các route public đặc biệt như `homepage`, `404`, và các trang mặc định khác nếu cần.
- [x] Tạo `site_settings` tối giản với typed foreign keys `homepage_page_id`, `not_found_page_id`, `student_home_page_id`.
- [x] Route `/` resolve qua `system pages` thay vì hardcode slug thường.
- [x] Public pages tiếp tục render theo pipeline `shell -> template -> content`.
- [ ] Header/footer navigation resolve từ `navigation_menus/items` theo `location`, không nhét vào `pages.content`.
- [ ] Tạo resolver dùng chung cho public shell để page, post, category, staff và unit dùng cùng layout/navigation contract.
- [ ] Danh sách bài viết theo category render theo category template hoặc archive template đã chốt ở task 6.1.
- [ ] Chi tiết bài viết render theo post template + BlockNote body.
- [ ] Danh sách cán bộ/giảng viên public chỉ lấy `is_public = true`.
- [ ] Chi tiết hồ sơ cán bộ public chỉ lấy `is_public = true`.
- [ ] Danh sách đơn vị public chỉ lấy `is_active = true`.
- [ ] Trang đăng nhập giữ theo auth flow hiện tại nhưng phải hòa vào public navigation/shell khi cần.
- [x] `Page` và `Post` hỗ trợ visibility `student_groups`; content restricted không dùng allowlist `student_code` lẻ nữa.
- [x] Có CMS route/module để quản lý `student_groups`, kèm quick-create component tái sử dụng được khi gắn group vào `Page` và `Post`.
- [x] Parse list `student_code` từ nhiều định dạng như khoảng trắng, dấu phẩy, chấm phẩy và xuống dòng.
- [x] `student_code` trong `student_groups` chỉ chấp nhận chữ số và không yêu cầu phải có tài khoản tương ứng trong DB.
- [ ] Có test cho public navigation theo location/tree, public chỉ thấy dữ liệu published/public, và student chỉ thấy nội dung được cấp quyền hợp lệ cho mọi public resource còn lại.

### 1.8. Phase 7 - Testing, hardening và release MVP

Checklist:

- [ ] Test seeder permission.
- [ ] Test policy quan trọng.
- [ ] Test import Excel.
- [ ] Test render shell/template/content cho page, post và category.
- [ ] Test page publish/render bằng Puck JSON.
- [ ] Test category filter cho posts.
- [ ] Test riêng cho luồng duyệt bài viết: submit review, approve, reject, invalid transition.
- [ ] Test navigation tree và linkable target.
- [ ] Test user không có quyền không truy cập được route quản trị.
- [ ] Test public chỉ thấy dữ liệu published/public.
- [ ] Chạy Pint.
- [ ] Chạy Larastan nếu đã cấu hình.
- [ ] Chạy Pest/PHPUnit.
- [ ] Chạy frontend lint/typecheck.
- [ ] Kiểm tra Composer audit.
- [ ] Kiểm tra lockfile đã commit.

---

## 2. Tracking tiến độ dự án

Nên tạo file:

```text
docs/tasks.md
```

### 2.1. Status convention

- `todo`: chưa làm
- `doing`: đang làm
- `review`: đã mở PR/chờ review
- `blocked`: đang bị chặn
- `done`: đã merge hoặc hoàn tất

### 2.2. Task board template

Mỗi task phải được tracking theo mẫu sau:

```markdown
# VMUFit Task Tracking

## Status convention

- todo: chưa làm
- doing: đang làm
- review: đã mở PR/chờ review
- blocked: đang bị chặn
- done: đã merge hoặc hoàn tất

## Task board

| ID  | Phase | Task                        | Status | Owner | Branch                          | PR  | Files touched                              | Test commands             | Notes                                                    |
| --- | ----- | --------------------------- | ------ | ----- | ------------------------------- | --- | ------------------------------------------ | ------------------------- | -------------------------------------------------------- |
| 0.1 | Setup | Backend packages            | todo   |       | feature/setup-backend-packages  |     | composer.json, composer.lock               | composer test             |                                                          |
| 0.2 | Setup | Frontend packages           | todo   |       | feature/setup-frontend-packages |     | package.json, pnpm-lock.yaml               | pnpm lint, pnpm typecheck | BlockNote + Puck + form/table/query/upload/date packages |
| 1.1 | Auth  | Configure Spatie permission | todo   |       | feature/auth-spatie-config      |     | app/Models/User.php, config/permission.php | php artisan test          |                                                          |
```

### 2.3. Definition of Ready

Một task chỉ nên bắt đầu khi có đủ:

- [ ] Mục tiêu rõ ràng.
- [ ] Phạm vi file/directory dự kiến.
- [ ] Không trùng owner với task đang sửa cùng file quan trọng.
- [ ] Có branch name.
- [ ] Có lệnh kiểm tra tối thiểu.
- [ ] Có tiêu chí hoàn thành.

### 2.4. Definition of Done

Một task được coi là xong khi:

- [ ] Code chạy được ở local.
- [ ] Migration chạy được nếu có thay đổi database.
- [ ] Seeder chạy được nếu có thay đổi seed.
- [ ] Không thêm field/schema ngoài guideline nếu chưa được thống nhất.
- [ ] Authorization backend đã được check nếu task có route/action bảo vệ.
- [ ] Frontend không hardcode role.
- [ ] Có test tối thiểu hoặc lý do chưa test được.
- [ ] Đã chạy lệnh format/lint/typecheck phù hợp.
- [ ] Đã cập nhật `docs/tasks.md`.
- [ ] PR mô tả rõ file đã sửa và cách kiểm tra.

### 2.5. Quy tắc cập nhật tracking

- Khi bắt đầu task: chuyển `todo` -> `doing`, điền owner và branch.
- Khi mở PR: chuyển `doing` -> `review`, điền PR link/id.
- Khi bị chặn: chuyển `blocked`, ghi rõ lý do và người cần hỗ trợ.
- Khi merge: chuyển `done`.
- Không nhận một task mới nếu task cũ đang `doing` mà chưa có lý do rõ ràng.

---

## 3. Quy trình làm việc nhiều người để hạn chế conflict

### 3.1. Branch strategy

Branch chính:

```text
main
```

Branch làm việc:

```text
feature/<phase>-<short-task-name>
fix/<short-bug-name>
chore/<short-task-name>
```

Ví dụ:

```text
feature/auth-permission-seeder
feature/db-staff-profiles
feature/cms-posts-table
fix/document-policy-download
chore/update-task-tracking
```

Quy tắc:

- Không commit trực tiếp vào `main`.
- Mỗi task một branch.
- Mỗi branch nên có một owner chính.
- Rebase hoặc merge `main` thường xuyên trước khi mở PR.
- PR nhỏ dễ review hơn PR lớn.

### 3.2. Chia ownership theo khu vực file

Để giảm conflict, nên chia ownership tạm thời theo module:

```text
Backend auth/permission: 1 người
Backend database/migration: 1-2 người nhưng chia theo nhóm bảng
Backend pages/navigation/categories: 1 người
Backend documents/excel: 1 người
Frontend layout/components nền: 1 người
Frontend Puck/page builder: 1 người
Frontend navigation tree: 1 người
Frontend từng module CMS: mỗi module 1 người
Public website: 1 người
```

Không nên để nhiều người cùng lúc sửa các file dễ conflict sau:

```text
routes/web.php
bootstrap/app.php
app/Models/User.php
composer.json
composer.lock
package.json
pnpm-lock.yaml
web/layouts/*
web/components/ui/*
web/components/page-builder/*
web/components/navigation/*
docs/tasks.md
```

Nếu bắt buộc phải sửa cùng file:

- Thống nhất trước trong task board.
- Một người làm thay đổi nền trước.
- Người còn lại rebase sau rồi mới tiếp tục.
- PR phải ghi rõ phần nào có nguy cơ conflict.

### 3.3. Quy tắc giao việc cho Codex

Khi dùng Codex, prompt nên luôn có:

```text
Context: Dự án VMUFit theo guideline VMUFit.md.
Goal: Mục tiêu cụ thể của task.
Scope: Chỉ được sửa những file/directory nào.
Do not: Những điều không được làm.
Acceptance criteria: Checklist hoàn thành.
Verification: Lệnh kiểm tra cần chạy.
Output: Liệt kê file đã sửa và tóm tắt thay đổi.
```

Template prompt:

```text
Context:
Dự án VMUFit dùng Laravel + Inertia + React theo guideline VMUFit.md.

Goal:
<ghi mục tiêu task>

Scope:
Chỉ sửa các file/directory sau:
- <file hoặc folder>

Do not:
- Không thêm users.role, roles, permission, is_admin vào bảng users.
- Không check quyền bằng role trong business logic.
- Không lưu HTML làm source of truth cho content BlockNote.
- Không thêm schema ngoài guideline nếu chưa cần.
- Không sửa file ngoài scope nếu không giải thích lý do.

Acceptance criteria:
- [ ] <tiêu chí 1>
- [ ] <tiêu chí 2>

Verification:
- <lệnh test/lint/typecheck>

Output:
Sau khi làm xong, hãy liệt kê:
1. File đã sửa.
2. Migration/config/action/component đã tạo.
3. Cách kiểm tra.
4. Rủi ro hoặc việc còn lại.
```

### 3.4. Quy tắc PR

Mỗi PR nên có mô tả:

```markdown
## Summary

- ...

## Scope

- ...

## Files changed

- ...

## Verification

- [ ] php artisan test
- [ ] ./vendor/bin/pint --test
- [ ] pnpm lint
- [ ] pnpm typecheck

## Screenshots

Nếu có UI thì thêm ảnh.

## Notes / Risks

- ...
```

Quy tắc review:

- Không merge PR không chạy được migration/test cơ bản.
- Không merge PR thêm schema ngoài guideline nếu chưa thống nhất.
- Không merge PR có authorization chỉ ở frontend.
- Không merge PR lớn hơn phạm vi task nếu không có lý do rõ.

### 3.5. Thứ tự merge đề xuất

Để tránh conflict và lỗi phụ thuộc, nên merge theo thứ tự:

1. Setup package backend/frontend.
2. Permission config + seeder.
3. Migration domain nền.
4. Migration pages/categories/navigation.
5. Model relationship.
6. Policy/Form Request/Data object.
7. Backend action/controller/list query.
8. Frontend component nền.
9. Frontend module CMS.
10. Public pages/navigation.
11. Test/hardening.

### 3.6. Cách xử lý khi conflict

Khi có conflict:

1. Pull hoặc fetch `main` mới nhất.
2. Rebase branch hiện tại lên `main`.
3. Resolve conflict theo guideline, không chọn bừa toàn bộ một phía.
4. Chạy lại test/lint liên quan.
5. Cập nhật PR mô tả conflict đã xử lý.

Với lockfile:

- Không tự sửa tay `composer.lock` hoặc `pnpm-lock.yaml` nếu không chắc.
- Sau khi resolve `composer.json`, chạy lại `composer install` hoặc `composer update <package>` đúng phạm vi.
- Sau khi resolve `package.json`, chạy lại `pnpm install`.
- Commit lockfile mới sau khi đã chạy install thành công.

### 3.7. Quy tắc đặt tên commit

Nên dùng conventional commit đơn giản:

```text
feat(auth): add permission seeder
feat(db): add staff profile schema
feat(cms): add posts table page
fix(documents): enforce download policy
chore(tasks): update project tracking
```

### 3.8. Daily sync ngắn cho team

Mỗi người cập nhật 3 dòng trong task board hoặc group chat:

```text
Yesterday: đã làm gì
Today: sẽ làm task nào
Blocked: đang bị chặn bởi gì
```

Mục tiêu là phát hiện sớm việc nhiều người đang sửa cùng file hoặc cùng module.

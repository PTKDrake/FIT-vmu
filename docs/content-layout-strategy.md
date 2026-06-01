# Chiến Lược Render Và Template Cho Puck, Post, Và Category

Tài liệu này mô tả cách tách rõ `site shell`, `template`, và `content` trong VMUFit để team thống nhất khi triển khai giao diện public website và CMS.

## Mục tiêu

- `Page` dùng Puck cho phần nội dung body.
- `Post` dùng BlockNote cho body bài viết, không kéo layout tự do như Page.
- `PostCategory` là nơi hợp lý nhất để cấu hình layout danh mục hoặc landing page theo template.
- Header và footer là phần của site shell, không nằm trong `pages.content`.

## Nguyên tắc thiết kế

1. `Header/Footer` là layout cấp site.
2. `Template` quyết định khung hiển thị.
3. `Content` chỉ chứa nội dung cần biên tập.
4. Dữ liệu render phải đi theo thứ tự:
   - Site shell
   - Template
   - Content hoặc template data
5. Không biến Puck thành nơi chứa toàn bộ logic giao diện của site.

## Phân vai theo từng loại nội dung

### 1. Page

Mục đích:

- Dùng cho landing page, giới thiệu, trang nội dung linh hoạt.

Thiết kế đề xuất:

- `content`: lưu Puck JSON.
- `template_key`: xác định khung hiển thị của page.
- `template_data`: JSON config cho template nếu cần.

Template gợi ý:

- `default`
- `landing`
- `fullwidth`
- `blank`
- `sidebar-right`

Khi nào dùng Puck:

- Khi cần dựng body page linh hoạt theo section.

Khi nào dùng template:

- Khi cần thay đổi cấu trúc hiển thị, không chỉ đổi nội dung.

### 2. Post

Mục đích:

- Dùng cho bài viết, tin tức, thông báo, bài chuyên môn.

Thiết kế đề xuất:

- `content`: lưu BlockNote JSON.
- `template_key`: xác định kiểu render bài viết.
- `template_data`: JSON config bổ sung.

Template gợi ý:

- `article`
- `news`
- `announcement`
- `research`
- `event`

Nguyên tắc:

- Body bài viết vẫn là BlockNote.
- Layout bài viết nên ổn định để giữ consistency.
- Không cho post kéo layout tự do như page builder.

### 3. PostCategory

Mục đích:

- Đây là nơi phù hợp nhất để custom layout theo nhóm nội dung.
- Dùng cho trang danh mục, landing page chuyên mục, hoặc trang tổng hợp bài viết.

Thiết kế đề xuất:

- `archive_template_key`: template cho trang danh mục.
- `archive_template_data`: JSON config cho template danh mục.
- `post_template_key`: template mặc định cho bài viết thuộc category này, nếu cần override.
- `post_template_data`: JSON config cho template bài viết, nếu cần override.
- `hero_data`: dữ liệu hero/banner của category.
- `sidebar_data`: dữ liệu sidebar hoặc filter block.
- `display_mode`: cách render category.

Giá trị `display_mode` gợi ý:

- `archive`: trang danh mục chuẩn, tập trung vào list bài viết.
- `landing`: category hoạt động như landing page.
- `hybrid`: vừa có cấu trúc chuẩn vừa có vài vùng custom.

Khi nào nên dùng Puck ở category:

- Chỉ khi category đó thực chất là landing page.
- Không nên mở Puck full builder cho category chuẩn chỉ để hiển thị list bài viết.

## Header và Footer

Header/footer không nên lưu trong `Page`, `Post`, hay `PostCategory`.

Chúng nên được tách riêng thành:

- `site settings`
- `navigation menus`
- `footer groups`
- `announcement bar`

Ưu tiên:

- Header lấy dữ liệu từ navigation menu `location = header`.
- Footer lấy dữ liệu từ navigation menu `location = footer`.
- Nếu cần chỗ cấu hình thêm, dùng site settings hoặc block riêng cho shell.

Không để editor chỉnh header/footer bằng Puck của từng page.

## Mô hình render đề xuất

### Page render

1. Load site shell.
2. Render header/footer theo navigation.
3. Chọn page template theo `template_key`.
4. Đổ `content` Puck vào vùng body.

### Post render

1. Load site shell.
2. Render template bài viết.
3. Đổ BlockNote content vào vùng body.
4. Render related posts, author box, CTA nếu template yêu cầu.

### Category render

1. Load site shell.
2. Xác định `display_mode`.
3. Render category template.
4. Đổ `hero_data`, `sidebar_data`, danh sách bài viết.

## Bộ template khuyến nghị ban đầu

### Page templates

- `default`
- `landing`
- `fullwidth`
- `blank`

### Post templates

- `article`
- `news`
- `announcement`
- `research`
- `event`

### Category templates

- `archive-default`
- `archive-landing`
- `archive-featured`
- `archive-sidebar`

## Roadmap triển khai

### Bước 1: Chốt schema

- Thêm các field template/config cần thiết vào `pages`, `posts`, `post_categories`.
- Giữ `pages.content` là Puck JSON.
- Giữ `posts.content` là BlockNote JSON.

### Bước 2: Tạo registry render

- Tạo registry map `template_key -> component`.
- Mỗi template có props riêng.
- Không hardcode logic template trong nhiều page riêng lẻ.

### Bước 3: Tạo UI CMS

- Cho `Page` chọn `template_key`.
- Cho `Post` chọn `template_key`.
- Cho `PostCategory` chọn `display_mode` và `archive_template_key`.
- Chỉ hiện field config khi template yêu cầu.

### Bước 4: Viết test

- Test mapping `template_key`.
- Test render đúng shell.
- Test category theo `display_mode`.
- Test Puck chỉ áp dụng cho `page.content`.

## Rule quyết định nhanh

- Cần dựng layout linh hoạt theo section: dùng Puck.
- Cần format bài viết ổn định: dùng template.
- Cần category landing page: dùng template + config.
- Cần header/footer: dùng site shell, không nhét vào content.

## Tóm tắt để thông báo cho team

- `Page` chỉ giữ body content bằng Puck.
- `Post` dùng BlockNote cho bài viết, layout vẫn theo template.
- `PostCategory` là nơi phù hợp nhất để custom layout theo category.
- Header/footer phải render từ site shell và navigation riêng, không đưa vào Puck.
- Cách làm chuẩn là: `shell -> template -> content`, không phải `Puck -> tất cả mọi thứ`.
- Nếu category nào muốn làm landing page thì bật template đặc biệt, không mở Puck tự do cho toàn bộ category.


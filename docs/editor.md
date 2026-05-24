# Cập nhật thiết kế: Block Editor và phương pháp lưu Content cho VMUFit

## 1. Mục tiêu cập nhật

Phần này bổ sung vào thiết kế tổng thể của dự án VMUFit, tập trung vào việc chọn thư viện editor hiện đại cho CMS và cách lưu nội dung trong database.

Yêu cầu chính:

- Dùng công nghệ mới, ưu tiên React.
- Có trải nghiệm kéo-thả dạng block.
- Phù hợp với người dùng non-tech như giảng viên, cán bộ khoa, editor.
- Dễ tích hợp với Laravel + Inertia + React.
- Không làm database phức tạp quá mức ở giai đoạn MVP.
- Có khả năng mở rộng sang page builder sau này.

---

## 2. Lựa chọn editor cho MVP

### Kết luận

MVP nên dùng **BlockNote** làm editor chính.

BlockNote phù hợp cho:

- Tin tức.
- Thông báo.
- Tiểu sử giảng viên/cán bộ.
- Mô tả đơn vị.
- Mô tả tài liệu.
- Các nội dung CMS dạng bài viết.

Không nên triển khai cả BlockNote và Puck ngay trong MVP, vì sẽ tăng thời gian phát triển và độ phức tạp.

---

## 3. Vì sao chọn BlockNote trước?

BlockNote phù hợp hơn với người dùng non-tech vì cách dùng gần giống Notion hoặc WordPress block editor đơn giản.

Người dùng chỉ cần:

- Gõ nội dung.
- Nhấn Enter để thêm block mới.
- Dùng slash command để chèn heading, ảnh, bảng, file.
- Kéo-thả block để sắp xếp nội dung.
- Bấm lưu hoặc gửi duyệt.

BlockNote phù hợp cho các tác vụ thường ngày của khoa:

- Đăng tin tức.
- Viết thông báo.
- Cập nhật tiểu sử giảng viên.
- Viết mô tả đơn vị.
- Viết mô tả tài liệu.
- Chèn ảnh, bảng, link, file đính kèm.

---

## 4. Puck có nên dùng không?

Có thể dùng **Puck** sau MVP, nhưng không nên làm ngay từ đầu.

Puck phù hợp với page builder, dùng để dựng layout toàn trang bằng kéo-thả component.

Puck nên dùng cho:

- Trang chủ.
- Trang giới thiệu khoa.
- Landing page tuyển sinh.
- Landing page sự kiện.
- Các trang đặc biệt cần layout tùy chỉnh.

Puck không nên dùng cho giảng viên hoặc người dùng chỉ cần viết nội dung đơn giản.

---

## 5. Phân chia vai trò giữa BlockNote và Puck

| Nhu cầu | Công cụ phù hợp | Giai đoạn |
|---|---|---|
| Viết bài tin tức | BlockNote | MVP |
| Viết thông báo | BlockNote | MVP |
| Viết tiểu sử giảng viên | BlockNote | MVP |
| Viết mô tả đơn vị | BlockNote | MVP |
| Viết mô tả tài liệu | BlockNote | MVP |
| Dựng trang chủ kéo-thả | Puck | Sau MVP |
| Dựng landing page | Puck | Sau MVP |
| Dựng layout trang phức tạp | Puck | Sau MVP |

Kết luận:

```text
MVP: BlockNote
Sau MVP: Cân nhắc thêm Puck cho page builder
```

---

## 6. Cách lưu content trong database

### Kết luận

Nên lưu **JSON gốc của BlockNote** làm source of truth.

Không nên lưu HTML làm dữ liệu chính.
Không nên dùng Markdown cho nội dung CMS dạng block.

Phương án chốt:

```text
content = BlockNote JSON
content_format = blocknote_json
```

---

## 7. Vì sao lưu BlockNote JSON?

Lưu JSON giúp:

- Giữ đúng cấu trúc block.
- Dễ render lại bằng React.
- Dễ mở rộng custom block.
- Dễ kiểm soát nội dung được phép render.
- Dễ migrate sang renderer hoặc editor khác sau này.
- Phù hợp với block editor kéo-thả.
- Không bị phụ thuộc quá chặt vào HTML.

Ví dụ sau này có thể thêm các block riêng:

- Alert block.
- File attachment block.
- Related documents block.
- Staff card block.
- Department info block.
- Important notice block.

Nếu lưu HTML, các block động như vậy sẽ khó kiểm soát và khó mở rộng hơn.

---

## 8. Nên dùng LONGTEXT hay JSON column?

### MVP nên dùng LONGTEXT

Khuyến nghị dùng `LONGTEXT` để lưu JSON string.

Lý do:

- Dễ triển khai.
- Dễ debug.
- Ít phụ thuộc vào database engine.
- Không cần query sâu vào JSON ở giai đoạn đầu.
- Dễ chuyển đổi format sau này.

Ví dụ:

```text
content LONGTEXT
content_format VARCHAR(50)
```

### Khi nào dùng JSON column?

Chỉ nên dùng JSON column nếu sau này cần:

- Query theo cấu trúc block.
- Index một số key trong JSON.
- Validate JSON ở database level.

Với CMS hiện tại, MVP chưa cần.

---

## 9. Các format nội dung nên hỗ trợ

Nên dùng field `*_format` để biết nội dung được lưu theo định dạng nào.

Các giá trị đề xuất:

```text
blocknote_json
plain_text
html
puck_json
```

Trong MVP, chủ yếu dùng:

```text
blocknote_json
```

`puck_json` để dành cho page builder sau này.

---

## 10. Cập nhật schema database

### 10.1. Posts

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

Dùng cho tin tức, thông báo, bài viết CMS.

---

### 10.2. Staff profiles

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

Các thông tin như học hàm, học vị, hướng nghiên cứu, văn phòng, website cá nhân, Google Scholar, ORCID, LinkedIn... không tách field ở MVP, mà nhập trực tiếp trong `bio`.

---

### 10.3. Units

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

`description` lưu mô tả đơn vị bằng BlockNote JSON.

---

### 10.4. Documents

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

`description` lưu mô tả tài liệu bằng BlockNote JSON.

---

### 10.5. Pages, thêm sau MVP

Khi thêm Puck page builder, có thể bổ sung bảng:

```text
pages
- id
- title
- slug
- content LONGTEXT
- content_format VARCHAR(50)
- status
- published_at
- created_at
- updated_at
```

Với page builder:

```text
content_format = puck_json
```

---

## 11. Cấu trúc dữ liệu thống nhất

Nên giữ quy ước như sau:

```text
posts.content              + posts.content_format
staff_profiles.bio         + staff_profiles.bio_format
units.description          + units.description_format
documents.description      + documents.description_format
pages.content              + pages.content_format, thêm sau
```

Quy ước này giúp backend và frontend xử lý nội dung nhất quán.

---

## 12. Cách lưu trong Laravel

Khi nhận content từ BlockNote ở frontend, backend lưu JSON string vào database.

Ví dụ trong Action:

```php
$content = json_encode($validated['content'], JSON_UNESCAPED_UNICODE);

$post->update([
    'content' => $content,
    'content_format' => 'blocknote_json',
]);
```

Khi trả dữ liệu về frontend:

```php
$content = json_decode($post->content, true);
```

Có thể xử lý tương tự cho:

- `staff_profiles.bio`
- `units.description`
- `documents.description`

---

## 13. Frontend structure đề xuất

```text
web/components/cms/editor/
- blocknote-editor.tsx
- blocknote-viewer.tsx
- media-picker.tsx
- slash-menu-items.tsx
- custom-blocks/
```

Nếu sau này thêm Puck:

```text
web/components/cms/page-builder/
- puck-editor.tsx
- puck-renderer.tsx
- puck-config.tsx
- blocks/
  - hero-banner.tsx
  - news-grid.tsx
  - document-list.tsx
  - staff-list.tsx
  - unit-section.tsx
  - major-grid.tsx
```

---

## 14. BlockNote dùng ở đâu?

### Admin / Editor

Dùng cho:

- Tạo bài viết.
- Sửa bài viết.
- Viết thông báo.
- Viết nội dung giới thiệu đơn vị.

### Staff / Giảng viên

Dùng cho:

- Cập nhật tiểu sử cá nhân nếu được cấp quyền.
- Viết mô tả tài liệu.
- Soạn nội dung tài liệu dạng rich content nếu sau này cần.

### Public site

Dùng viewer để render nội dung đã lưu.

Không dùng editor ở public page.

---

## 15. Các block nên bật trong MVP

Để người dùng non-tech dễ dùng, chỉ nên bật các block cơ bản trước:

```text
Paragraph
Heading
Bullet list
Numbered list
Image
Table
Quote
Link
File attachment
Important notice / Alert
```

Không nên bật quá nhiều tính năng ở MVP.

Chưa nên bật tự do:

- Iframe.
- Script.
- Embed không kiểm soát.
- Custom HTML.
- Layout nhiều cột phức tạp.

---

## 16. Media trong editor

Ảnh và file trong editor nên đi qua media library riêng.

Luồng đề xuất:

```text
Người dùng chọn chèn ảnh/file
→ Mở media picker
→ Upload qua Laravel
→ Lưu vào bảng media
→ BlockNote nhận media_id hoặc URL được backend cấp
→ Render qua route an toàn
```

Không nên cho paste URL file nội bộ trực tiếp nếu file cần phân quyền.

---

## 17. Bảo mật khi render content

Dù lưu JSON, vẫn cần kiểm soát kỹ khi render.

Nguyên tắc:

- Chỉ render các block đã whitelist.
- Không cho script.
- Không cho custom HTML tự do ở MVP.
- Không cho iframe tự do nếu chưa có whitelist domain.
- File private phải đi qua route Laravel và policy.
- Ảnh/file upload phải qua media library.

Đối với tài liệu có phân quyền, preview và download không được expose file public trực tiếp.

---

## 18. Có cần lưu thêm rendered HTML không?

MVP chưa cần.

Giai đoạn đầu:

```text
Lưu BlockNote JSON
Render bằng React viewer
```

Sau này nếu cần tối ưu tốc độ public site, có thể thêm:

```text
rendered_html LONGTEXT nullable
```

Luồng sau này:

```text
BlockNote JSON
→ Convert sang HTML an toàn
→ Cache vào rendered_html
→ Public site render nhanh hơn
```

Nhưng không nên thêm ngay nếu muốn MVP gọn.

---

## 19. Lộ trình triển khai

### Phase 1: BlockNote MVP

- Cài BlockNote cho React.
- Tạo `blocknote-editor.tsx`.
- Tạo `blocknote-viewer.tsx`.
- Lưu content dạng JSON string vào LONGTEXT.
- Thêm `*_format` cho các bảng cần rich content.

### Phase 2: Tích hợp CMS

- Dùng BlockNote cho bài viết.
- Dùng BlockNote cho tiểu sử giảng viên.
- Dùng BlockNote cho mô tả đơn vị.
- Dùng BlockNote cho mô tả tài liệu.

### Phase 3: Media picker

- Upload ảnh/file qua Laravel.
- Chèn ảnh/file vào editor.
- Quản lý media trong admin.

### Phase 4: Custom block nhẹ

- Important notice block.
- File attachment block.
- Related documents block nếu cần.

### Phase 5: Puck sau MVP

- Thêm bảng `pages`.
- Dùng `content_format = puck_json`.
- Tạo các page builder blocks cho trang chủ và landing page.

---

## 20. Chốt thiết kế

Thiết kế được chốt như sau:

```text
MVP dùng BlockNote làm editor chính.
Không triển khai Puck ngay trong MVP.
Lưu content bằng BlockNote JSON.
Cột lưu content dùng LONGTEXT.
Luôn có field *_format để mở rộng sau này.
Không lưu HTML làm dữ liệu chính.
Không dùng Markdown cho nội dung CMS dạng block.
Render public bằng BlockNote viewer hoặc renderer riêng.
Puck để phase sau cho page builder.
```

Đây là phương án cân bằng giữa:

- Công nghệ mới.
- Trải nghiệm kéo-thả dạng block.
- Dễ dùng cho non-tech.
- Dễ triển khai MVP.
- Database vẫn tối giản.
- Có đường mở rộng sang page builder sau này.

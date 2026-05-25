# Hướng dẫn ngôn ngữ thiết kế CMS

## Mục tiêu

Tài liệu này mô tả ngôn ngữ thiết kế đang được dùng trong khu vực CMS của VMUFit để áp dụng nhất quán cho các page thuộc `/cms`.

Đây là guideline bám theo implementation hiện tại trong `web/layouts/cms-layout.tsx`, `web/components/cms/**` và các page `web/pages/cms/**`, không phải một bộ dashboard guideline độc lập.

## Tinh thần giao diện

CMS của VMUFit là một không gian làm việc quản trị nội dung và dữ liệu:

- Gọn, sáng, trung tính, ưu tiên khả năng đọc.
- Điều hướng rõ ràng, ít nhiễu thị giác.
- Mật độ nội dung vừa phải, phù hợp với bảng dữ liệu và workflow biên tập.
- Dùng điểm nhấn màu rất tiết chế, chủ yếu qua badge, icon, trạng thái và vùng nền nhẹ.
- Ưu tiên tiếng Việt nhất quán, ngắn gọn, có đầy đủ dấu.

Không đi theo hướng landing page, marketing page hoặc admin template nặng trang trí.

## Shell chuẩn của CMS

Mọi page trong CMS phải dùng cùng application shell:

- Sidebar trái là điều hướng chính.
- Topbar trên cùng chứa nút mở sidebar và breadcrumb.
- Nội dung page nằm trong vùng inset bên phải.

Tham chiếu:

- `web/layouts/cms-layout.tsx`
- `web/components/cms/layout/cms-sidebar.tsx`
- `web/components/cms/layout/cms-topbar.tsx`

### Sidebar

Sidebar hiện tại dùng cấu trúc nhóm module:

- `Dashboard`
- `Nội dung`
- `Tài liệu`
- `Nhân sự`
- `Quản trị`

Quy tắc:

- Module cấp 1 dùng icon Heroicons nét mảnh.
- Module có nhiều page con dùng disclosure, không trải phẳng toàn bộ menu.
- Trạng thái hiện tại được xác định bằng URL hiện tại.
- Footer sidebar dành cho hồ sơ người dùng và các hành động hệ thống.

Không tạo thêm kiểu điều hướng thứ hai cạnh tranh với sidebar hiện có.

### Topbar

Topbar hiện tại rất tối giản:

- Bên trái là `SidebarTrigger`.
- Kế tiếp là `Breadcrumbs`.
- Không dùng topbar cho các khối thống kê lớn hoặc CTA chính.

Nếu page cần action riêng, đặt action trong vùng header của page content, không nhồi vào topbar toàn cục.

## Cấu trúc chuẩn của một page CMS

Page CMS nên tuân theo bố cục sau:

1. Vùng ngoài cùng: `div` với `flex flex-1 flex-col gap-4 p-4 pt-0`.
2. Nội dung chính nằm trong `Card` lớn, nền `bg-overlay`, bo `rounded-xl`, viền nhẹ, hầu như không dùng shadow.
3. Header của page gồm:
   - Badge ngắn mô tả ngữ cảnh.
   - Tiêu đề cấp trang.
   - Đoạn mô tả ngắn 1 đến 2 câu.
4. Phần thân page dùng các khối con dạng card mềm hoặc panel nền `bg-muted/40` để chia khu vực dữ liệu, bộ lọc, chi tiết hoặc hoạt động gần đây.

Tham chiếu:

- `web/components/cms/cms-page-placeholder.tsx`
- `web/components/cms/dashboard/dashboard-overview-panel.tsx`
- `web/components/cms/dashboard/dashboard-main-panel.tsx`
- `web/components/cms/dashboard/dashboard-stat-grid.tsx`

## Hệ component cần ưu tiên

Khi làm page CMS, ưu tiên dùng lại component từ `@/components/ui/` và các pattern đã có:

- `Card`, `CardHeader`, `CardContent`, `CardTitle`
- `Heading`
- `Text`
- `Badge`
- `Breadcrumbs`
- `Sidebar` và các biến thể liên quan
- `Menu`, `Avatar`, `Separator`

Quy tắc:

- Không dựng lại card, badge, heading bằng raw HTML nếu đã có component tương đương.
- Dùng semantic tokens như `bg-overlay`, `bg-muted`, `border-border`, `text-muted-fg`.
- Tránh hard-code màu Tailwind kiểu `bg-blue-500`, `text-gray-700` nếu không thật sự cần thiết.

## Hình khối và mật độ

Ngôn ngữ hiện tại thiên về panel mềm, viền mảnh, bo góc vừa:

- Card chính: `rounded-xl`, `border-border`, `shadow-none`.
- Panel con: thường `rounded-xl border border-border bg-muted/40 p-4`.
- Panel item bên trong: `rounded-xl border border-border bg-overlay px-4 py-3`.
- Khoảng cách giữa các khối chính: `gap-4`.
- Padding chuẩn ở page: `p-4`.

Ưu tiên border để phân tách, không dùng shadow nặng.

## Màu sắc và nhấn mạnh

CMS hiện tại dùng bảng màu trung tính làm nền chính:

- Nền chính sáng.
- Card và panel nổi lên bằng `bg-overlay`.
- Vùng phụ bằng `bg-muted` hoặc `bg-muted/40`.
- Chữ phụ dùng `text-muted-fg`.

Điểm nhấn màu dùng tiết chế:

- Badge `intent="primary"` cho vùng nổi bật cấp trang.
- Badge `intent="outline"` cho nhãn phụ, số lượng hoặc trạng thái trung tính.
- Icon nằm trong ô nền nhẹ `bg-muted`.

Không biến mỗi page thành một bảng màu riêng. Màu module nếu có chỉ nên xuất hiện ở mức phụ trợ.

## Typography và copy

Ngôn ngữ chữ trong CMS phải rõ ràng, nghiệp vụ và ngắn:

- Tiêu đề page: cụm từ ngắn, mô tả đúng đối tượng quản lý.
- Mô tả page: 1 đến 2 câu, giải thích chức năng và phạm vi.
- Nhãn hành động: ngắn, trực tiếp, dùng tiếng Việt có dấu.
- Tránh viết marketing copy hoặc câu quá cảm tính.

Ví dụ phù hợp:

- `Bài viết`
- `Tài liệu`
- `Hồ sơ cán bộ`
- `Vai trò & quyền`
- `Chờ duyệt`
- `Cập nhật gần đây`

## Pattern nội dung nên dùng

### 1. Dashboard hoặc overview

Phù hợp với:

- Thống kê nhanh theo card.
- Danh sách hoạt động gần đây.
- Danh sách mục chờ xử lý.
- Snapshot về phạm vi dữ liệu hoặc quyền truy cập.

Pattern đang dùng:

- Một hàng stat card phía trên.
- Một card lớn bên dưới chia thành 2 cột ở màn hình lớn.

### 2. Trang danh sách

Phù hợp với:

- Bài viết
- Tài liệu
- Người dùng
- Đơn vị
- Media

Nên có:

- Header trang rõ ràng.
- Thanh công cụ cho tìm kiếm, lọc, sắp xếp, tạo mới.
- Khu vực danh sách chính chiếm ưu tiên thị giác.
- Chi tiết phụ hoặc metadata đặt ở panel cạnh hoặc vùng dưới, không tranh chấp với dữ liệu chính.

### 3. Trang biên tập hoặc chi tiết

Khi có form hoặc detail editor:

- Nội dung chính đặt trong card lớn.
- Metadata, trạng thái, hành động phụ nên đưa sang cột phải hoặc panel riêng.
- Duy trì cùng spacing, cùng cách dùng badge và heading như các page còn lại.

## Responsive

CMS phải hoạt động tốt trên desktop và mobile:

- Sidebar có thể thu gọn hoặc mở qua trigger.
- Grid thống kê và các cột nội dung phải tự rơi về 1 cột ở màn hình hẹp.
- Không giả định chiều ngang lớn cho bảng, filter bar hoặc action group.

Nếu một trang dữ liệu lớn cần ưu tiên desktop, vẫn phải giữ khả năng truy cập cơ bản trên mobile.

## Những điều nên tránh

- Không tạo hero section kiểu marketing ở đầu page CMS.
- Không dùng gradient mạnh, background phức tạp hoặc illustration lớn.
- Không dùng quá nhiều màu nhấn trên cùng một màn hình.
- Không bỏ qua shell hiện tại để tạo layout riêng cho từng module.
- Không thay breadcrumb bằng tiêu đề tự do thiếu ngữ cảnh điều hướng.
- Không dùng thuật ngữ Anh ngữ nếu đã có nhãn tiếng Việt rõ ràng hơn.
- Không sửa `web/components/ui` chỉ để phục vụ một page CMS nếu chưa có yêu cầu rõ ràng.

## Checklist khi làm page CMS mới

- Page dùng `CmsLayout`.
- Có cấu trúc page wrapper giống các page CMS hiện tại.
- Có header gồm badge, title, description nếu phù hợp.
- Dùng lại component trong `@/components/ui/`.
- Dùng semantic color tokens thay vì màu hard-code.
- Copy tiếng Việt ngắn, rõ, đúng ngữ cảnh quản trị.
- Nội dung chính ưu tiên bảng dữ liệu, workflow hoặc thông tin vận hành.
- Giao diện giữ cùng nhịp spacing `gap-4`, `p-4`, panel `rounded-xl`.

## Mốc tham chiếu chính

- `web/layouts/cms-layout.tsx`
- `web/components/cms/layout/cms-topbar.tsx`
- `web/components/cms/layout/cms-sidebar-navigation.tsx`
- `web/components/cms/cms-page-placeholder.tsx`
- `web/components/cms/dashboard/dashboard-stat-grid.tsx`
- `web/components/cms/dashboard/dashboard-main-panel.tsx`

# VMUFit
VMUFit là website và CMS cho Khoa Công nghệ thông tin - Trường Đại học Hàng hải Việt Nam.

Repo này tập trung vào các phần chính sau:

- website public
- CMS quản trị nội dung
- quản lý hồ sơ cán bộ, giảng viên
- quản lý tài liệu thường và tài liệu Excel cá nhân hóa theo `student_code`
- xác thực và phân quyền dựa trên `spatie/laravel-permission`

## Công Nghệ

- PHP 8.5, Laravel 13
- Inertia.js v3
- React 19, TypeScript, Vite
- Tailwind CSS v4
- Pest, PHPUnit, Pint, Larastan
- Frontend source nằm trong `web/`

## Tài Liệu Trong Repo

- [docs/VMUFit.md](docs/VMUFit.md): guideline chính cho kiến trúc và phạm vi MVP
- [docs/VMUFit.tasks.md](docs/VMUFit.tasks.md): task plan chi tiết theo phase
- [docs/tasks.md](docs/tasks.md): task board và tracking trạng thái hiện tại

## Yêu Cầu Môi Trường

- PHP 8.5
- Composer
- Node.js
- pnpm
- SQLite cho môi trường local mặc định
- Nginx nếu bạn muốn chạy local qua domain như `fit.mcmevn.com`

Repo đã có wrapper sẵn:

- `./phpw`
- `./composerw`

Ưu tiên dùng hai wrapper này khi chạy lệnh PHP và Composer.

## Cài Đặt Lần Đầu

1. Cài dependencies PHP và frontend.

```bash
./composerw install
pnpm install
```

2. Tạo file môi trường và sinh app key.

```bash
cp .env.example .env
./phpw artisan key:generate
```

3. Tạo database SQLite local.

```bash
touch database/database.sqlite
```

4. Chạy migration.

```bash
./phpw artisan migrate
```

5. Nếu muốn có dữ liệu mẫu cho CMS, seed database.

```bash
./phpw artisan db:seed
```

## Cấu Hình `.env`

Các biến tối thiểu nên kiểm tra lại:

```env
APP_URL=http://fit.mcmevn.com
SESSION_DOMAIN=fit.mcmevn.com
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"
DB_CONNECTION=sqlite
SESSION_DRIVER=database
```

Lưu ý quan trọng:

- `APP_URL` và `GOOGLE_REDIRECT_URI` phải cùng một host.
- Nếu bạn đổi sang domain khác, hãy đổi đồng thời cả hai giá trị trên.
- Với local OAuth, nên dùng đúng một hostname duy nhất để tránh lỗi session/state.

## Chạy Local

### Cách khuyến nghị

Chạy toàn bộ môi trường dev bằng script Composer:

```bash
composer dev
```

Script này sẽ chạy đồng thời:

- Laravel HTTP server
- Reverb
- queue listener
- log tailing
- Vite dev server

Truyền thêm tham số cho `artisan serve` qua Composer:

```bash
composer dev -- --host=0.0.0.0 --port=8000
```

### Chạy riêng từng phần

Nếu cần tách từng service:

```bash
./phpw artisan serve --host=127.0.0.1 --port=8000
pnpm dev
./phpw artisan reverb:start --host=0.0.0.0 --port=8080
./phpw artisan queue:listen --tries=1
./phpw artisan pail --timeout=0
```

## Chạy Qua `fit.mcmevn.com`

Nếu bạn muốn mở site qua domain local `fit.mcmevn.com`, cần:

1. Trỏ `fit.mcmevn.com` về `127.0.0.1` trong `/etc/hosts`.
2. Cấu hình Nginx cho `fit.mcmevn.com`.
3. Cho Nginx proxy request về Laravel server local.
4. Đảm bảo `APP_URL` và `GOOGLE_REDIRECT_URI` trùng với domain này.

Sau khi cấu hình xong, truy cập:

```text
http://fit.mcmevn.com
```

## MCP

Repo này có sẵn Laravel Boost MCP server qua Artisan command:

```bash
./phpw artisan boost:mcp
```

Nếu bạn dùng MCP client như Codex, Cursor, Claude Desktop hoặc client tương tự, hãy cấu hình local server trỏ tới lệnh trên thay vì commit path máy cá nhân vào repo.

Ví dụ cấu hình tối thiểu:

```json
{
  "mcpServers": {
    "laravel-boost": {
      "command": "./phpw",
      "args": ["artisan", "boost:mcp"]
    }
  }
}
```

Nếu MCP client của bạn không chạy được script relative từ root repo, hãy thay `command` bằng đường dẫn tuyệt đối trên máy của bạn. Không commit file config này vào repo nếu nó chứa path local.

Bạn có thể kiểm tra server bằng:

```bash
./phpw artisan boost:mcp
```

Hoặc xem command có sẵn:

```bash
./phpw artisan list | grep boost:mcp
```

## Kiểm Tra Chất Lượng

Backend test tối thiểu:

```bash
./phpw artisan test --compact
```

Frontend lint và typecheck:

```bash
pnpm lint
pnpm typecheck
```

Full local check:

```bash
pnpm check
./composerw check
```

## Lệnh Hữu Ích

```bash
pnpm run build
pnpm run build:ssr
composer run preview
./phpw artisan wayfinder:generate --with-form --path=web
```

## Nguyên Tắc Công Tác

- Không commit `.env`
- Không commit artifact runtime như `storage/logs`, `storage/framework/*`, `public/build`, `bootstrap/ssr`
- Không commit config MCP/editor local như `.mcp.json`, `.cursor/`, `.codex/`, `.claude/`
- Không kiểm tra quyền bằng `users.role`; dùng permission và policy
- Theo dõi tiến độ task trong `docs/tasks.md`
- Tham khảo branch và phạm vi task trong `docs/VMUFit.tasks.md`

## Ghi Chú

- Branch mặc định hiện tại của repo là `master`
- `maatwebsite/excel` đang được khóa ở `4.x-dev` để phù hợp với PHP 8.5
- Với local OAuth, nếu đổi domain thì phải đổi lại cả Google Console redirect URI

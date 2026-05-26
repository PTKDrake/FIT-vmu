# VMUFit

VMUFit la website va CMS cho Khoa Cong nghe thong tin - Truong Dai hoc Hang hai Viet Nam.

Repo nay hien tap trung vao MVP voi cac phan chinh:

- website public
- CMS quan tri noi dung
- quan ly ho so can bo, giang vien
- quan ly tai lieu thuong va tai lieu Excel ca nhan hoa theo `student_code`
- auth va permission dua tren `spatie/laravel-permission`

## Tech Stack

- PHP 8.5, Laravel 13
- Inertia.js v3
- React 19, TypeScript, Vite
- Tailwind CSS v4
- Pest, PHPUnit, Pint, Larastan
- Frontend source trong `web/`

## Tai lieu trong repo

- [docs/VMUFit.md](docs/VMUFit.md): guideline chinh cho kien truc va pham vi MVP
- [docs/VMUFit.tasks.md](docs/VMUFit.tasks.md): task plan chi tiet theo phase
- [docs/tasks.md](docs/tasks.md): task board va tracking trang thai hien tai

## Yeu cau moi truong

- PHP 8.5
- Composer
- Node.js
- pnpm
- SQLite cho local mac dinh

Repo da co wrapper:

- `./phpw`
- `./composerw`

Uu tien dung cac wrapper nay khi chay lenh PHP va Composer.

## Cai dat local

```bash
./composerw install
pnpm install
cp .env.example .env
./phpw artisan key:generate
touch database/database.sqlite
./phpw artisan migrate
```

Chay moi truong dev:

```bash
composer run dev
```

Truyen them args cho `artisan serve` qua Composer:

```bash
composer run dev -- --host=0.0.0.0 --port=8000
```

Hoac chay rieng:

```bash
./phpw artisan serve
pnpm dev
```

## MCP setup

Repo nay co san Laravel Boost MCP server qua Artisan command:

```bash
./phpw artisan boost:mcp
```

Neu ban dung MCP client nhu Codex, Cursor, Claude Desktop hoac client tuong tu, hay cau hinh mot local server tro vao lenh tren thay vi commit path may ca nhan vao repo.

Vi du cau hinh toi thieu:

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

Neu MCP client cua ban khong chay duoc script relative tu root repo, hay thay `command` bang duong dan tuyet doi tren may cua ban. Khong commit file config nay vao repo neu no chua path local.

Co the tu kiem tra server bang:

```bash
./phpw artisan boost:mcp
```

Hoac xem command co san:

```bash
./phpw artisan list | grep boost:mcp
```

## Kiem tra chat luong

Backend test toi thieu:

```bash
./phpw artisan test --compact
```

Frontend lint va typecheck:

```bash
pnpm lint
pnpm typecheck
```

Full local check:

```bash
pnpm check
./composerw check
```

## Nguyen tac cong tac

- Khong commit `.env`
- Khong commit artifact runtime nhu `storage/logs`, `storage/framework/*`, `public/build`, `bootstrap/ssr`
- Khong commit config MCP/editor local nhu `.mcp.json`, `.cursor/`, `.codex/`, `.claude/`
- Khong check quyen bang `users.role`; dung permission va policy
- Theo doi tien do task trong `docs/tasks.md`
- Tham khao branch va pham vi task trong `docs/VMUFit.tasks.md`

## Ghi chu

- Branch mac dinh hien tai cua repo la `master`
- `maatwebsite/excel` dang duoc khoa o `4.x-dev` de phu hop voi PHP 8.5

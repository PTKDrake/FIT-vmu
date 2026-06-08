# Deploy Ubuntu VPS với PostgreSQL

Tài liệu này hướng dẫn deploy project này lên VPS Ubuntu khi chuyển database từ SQLite local sang PostgreSQL trên production.

Phạm vi tài liệu:

- Ubuntu VPS tự quản trị
- Nginx + PHP-FPM
- PostgreSQL
- Supervisor cho `queue:work` và `reverb:start`
- build frontend bằng `pnpm`

Tài liệu bám theo cấu hình hiện tại của repo:

- PHP qua wrapper `./phpw`
- Composer qua wrapper `./composerw`
- `QUEUE_CONNECTION=database`
- `CACHE_STORE=database`
- `SESSION_DRIVER=database`
- `BROADCAST_CONNECTION=reverb`

## 1. Kiến trúc khuyến nghị

- App web: `https://fit.mcmevn.com`
- WebSocket Reverb: `https://ws.fit.mcmevn.com`
- Mã nguồn: `/var/www/fit-vmu`
- User deploy: `deploy`
- PHP-FPM socket: `/run/php/php8.5-fpm.sock`

Khuyến nghị dùng riêng subdomain cho Reverb để cấu hình reverse proxy rõ ràng hơn và tránh trộn request web với WebSocket.

## 2. Chuẩn bị VPS

### 2.1. Tạo user deploy

```bash
sudo adduser deploy
sudo usermod -aG www-data deploy
sudo mkdir -p /var/www/fit-vmu
sudo chown -R deploy:www-data /var/www/fit-vmu
```

### 2.2. Cài package hệ thống

Ví dụ dưới đây dùng Ubuntu và cài đủ package cho Nginx, PostgreSQL, Supervisor, Node, pnpm, PHP 8.5 và extension PostgreSQL.

```bash
sudo apt update
sudo apt install -y software-properties-common ca-certificates curl git unzip supervisor nginx postgresql postgresql-contrib
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.5-cli php8.5-fpm php8.5-pgsql php8.5-curl php8.5-mbstring php8.5-xml php8.5-zip php8.5-bcmath php8.5-intl php8.5-sqlite3 php8.5-redis
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo corepack enable
sudo corepack prepare pnpm@latest --activate
```

Nếu VPS của bạn đã có sẵn PHP 8.5 từ nguồn khác thì chỉ cần bảo đảm đủ extension, đặc biệt là `pgsql`.

### 2.3. Tinh chỉnh PHP-FPM cơ bản

Kiểm tra user chạy PHP-FPM, thường là `www-data`:

```bash
grep -E '^(user|group|listen) =' /etc/php/8.5/fpm/pool.d/www.conf
```

Khởi động lại PHP-FPM sau khi chỉnh cấu hình:

```bash
sudo systemctl restart php8.5-fpm
sudo systemctl enable php8.5-fpm
```

## 3. Tạo PostgreSQL database

Đăng nhập PostgreSQL:

```bash
sudo -u postgres psql
```

Tạo database và user:

```sql
CREATE ROLE fit_vmu WITH LOGIN PASSWORD 'change-this-password';
CREATE DATABASE fit_vmu OWNER fit_vmu;
GRANT ALL PRIVILEGES ON DATABASE fit_vmu TO fit_vmu;
\c fit_vmu
GRANT ALL ON SCHEMA public TO fit_vmu;
ALTER SCHEMA public OWNER TO fit_vmu;
```

Thoát:

```sql
\q
```

Lưu ý:

- Project đang dùng database cho session, cache, queue và failed jobs.
- Các bảng này đã có migration sẵn trong repo, nên chỉ cần chạy migrate trên PostgreSQL.

## 4. Deploy mã nguồn

### 4.1. Clone repo

```bash
sudo -u deploy git clone <git-url> /var/www/fit-vmu
cd /var/www/fit-vmu
```

### 4.2. Cài dependencies

```bash
sudo -u deploy ./composerw install --no-dev --optimize-autoloader
sudo -u deploy pnpm install --frozen-lockfile
```

## 5. Cấu hình `.env`

Tạo file `.env` từ `.env.example`:

```bash
sudo -u deploy cp .env.example .env
sudo -u deploy ./phpw artisan key:generate
```

Giá trị tối thiểu cần chỉnh:

```env
APP_NAME="VMUFit"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://fit.mcmevn.com
APP_TIMEZONE=Asia/Ho_Chi_Minh

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=info

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=fit_vmu
DB_USERNAME=fit_vmu
DB_PASSWORD=change-this-password

SESSION_DRIVER=database
SESSION_DOMAIN=fit.mcmevn.com

CACHE_STORE=database
QUEUE_CONNECTION=database

BROADCAST_CONNECTION=reverb

REVERB_APP_ID=fit-vmu
REVERB_APP_KEY=change-this-key
REVERB_APP_SECRET=change-this-secret
REVERB_SERVER_HOST=0.0.0.0
REVERB_SERVER_PORT=8080
REVERB_HOST=ws.fit.mcmevn.com
REVERB_PORT=443
REVERB_SCHEME=https
REVERB_ALLOWED_ORIGINS=https://fit.mcmevn.com

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"

GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"
OPENROUTER_APP_NAME="${APP_NAME}"
OPENROUTER_APP_URL="${APP_URL}"
```

Lưu ý quan trọng:

- `APP_URL` và `GOOGLE_REDIRECT_URI` phải cùng host.
- `REVERB_ALLOWED_ORIGINS` nên trỏ đúng domain frontend.
- Nếu dùng cookie trên đúng một host duy nhất, để `SESSION_DOMAIN=fit.mcmevn.com` là đủ. Nếu cần chia sẻ cookie qua subdomain, đổi thành `.mcmevn.com`.

## 6. Phân quyền thư mục

Laravel cần ghi được vào `storage/` và `bootstrap/cache/`.

```bash
cd /var/www/fit-vmu
sudo chown -R deploy:www-data storage bootstrap/cache
sudo chmod -R ug+rwx storage bootstrap/cache
```

Nếu CMS có dùng file public qua disk `public`, tạo symlink:

```bash
sudo -u deploy ./phpw artisan storage:link
```

## 7. Build app và migrate

Chạy các bước build và cache:

```bash
cd /var/www/fit-vmu
sudo -u deploy pnpm run build
sudo -u deploy ./phpw artisan migrate --force
sudo -u deploy ./phpw artisan optimize
```

`pnpm run build` của repo này sẽ build cả client và SSR bundle.

## 8. Cấu hình Nginx cho app

Tạo file `/etc/nginx/sites-available/fit-vmu`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name fit.mcmevn.com;
    root /var/www/fit-vmu/public;

    index index.php;
    charset utf-8;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ ^/index\.php(/|$) {
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/fit-vmu /etc/nginx/sites-enabled/fit-vmu
sudo nginx -t
sudo systemctl reload nginx
```

## 9. Cấu hình Nginx reverse proxy cho Reverb

Tạo file `/etc/nginx/sites-available/fit-vmu-reverb`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name ws.fit.mcmevn.com;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header Scheme $scheme;
        proxy_set_header SERVER_PORT $server_port;
        proxy_set_header REMOTE_ADDR $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";

        proxy_pass http://127.0.0.1:8080;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/fit-vmu-reverb /etc/nginx/sites-enabled/fit-vmu-reverb
sudo nginx -t
sudo systemctl reload nginx
```

## 10. Cài SSL cho Nginx

Domain production của app:

- `fit.mcmevn.com`
- `ws.fit.mcmevn.com`

### 10.1. Cài Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 10.2. Trỏ DNS trước khi cấp SSL

Cần bảo đảm cả 2 record DNS đã trỏ đúng về IP VPS:

- `fit.mcmevn.com`
- `ws.fit.mcmevn.com`

Kiểm tra nhanh:

```bash
dig +short fit.mcmevn.com
dig +short ws.fit.mcmevn.com
```

### 10.3. Cấp chứng chỉ SSL

Sau khi đã enable 2 site Nginx HTTP ở trên, chạy:

```bash
sudo certbot --nginx -d fit.mcmevn.com -d ws.fit.mcmevn.com
```

Certbot sẽ tự:

- cấp chứng chỉ Let's Encrypt
- chèn cấu hình `listen 443 ssl`
- thêm redirect từ HTTP sang HTTPS nếu bạn chọn redirect

### 10.4. Kiểm tra tự gia hạn

```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

### 10.5. Giá trị `.env` sau khi bật SSL

```env
APP_URL=https://fit.mcmevn.com
SESSION_DOMAIN=fit.mcmevn.com

REVERB_HOST=ws.fit.mcmevn.com
REVERB_PORT=443
REVERB_SCHEME=https
REVERB_ALLOWED_ORIGINS=https://fit.mcmevn.com

VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

Sau khi sửa `.env`, chạy lại:

```bash
cd /var/www/fit-vmu
sudo -u deploy ./phpw artisan optimize:clear
sudo -u deploy ./phpw artisan optimize
sudo supervisorctl restart fit-vmu-reverb
sudo systemctl reload nginx
```

### 10.6. Cấu hình Nginx mẫu sau khi có SSL

Certbot sẽ tự chèn cấu hình, nhưng mẫu mong muốn nên tương đương như sau.

App site:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name fit.mcmevn.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name fit.mcmevn.com;
    root /var/www/fit-vmu/public;

    ssl_certificate /etc/letsencrypt/live/fit.mcmevn.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fit.mcmevn.com/privkey.pem;

    index index.php;
    charset utf-8;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ ^/index\.php(/|$) {
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Reverb site:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name ws.fit.mcmevn.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ws.fit.mcmevn.com;

    ssl_certificate /etc/letsencrypt/live/ws.fit.mcmevn.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ws.fit.mcmevn.com/privkey.pem;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header Scheme $scheme;
        proxy_set_header SERVER_PORT $server_port;
        proxy_set_header REMOTE_ADDR $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";

        proxy_pass http://127.0.0.1:8080;
    }
}
```

## 11. Supervisor cho queue worker

Tạo file `/etc/supervisor/conf.d/fit-vmu-worker.conf`:

```ini
[program:fit-vmu-worker]
process_name=%(program_name)s_%(process_num)02d
directory=/var/www/fit-vmu
command=/var/www/fit-vmu/phpw artisan queue:work --sleep=3 --tries=3 --max-time=3600
user=deploy
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/fit-vmu/storage/logs/worker.log
stopwaitsecs=3600
```

Enable:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start fit-vmu-worker:*
```

## 12. Supervisor cho Reverb

Tạo file `/etc/supervisor/conf.d/fit-vmu-reverb.conf`:

```ini
[program:fit-vmu-reverb]
directory=/var/www/fit-vmu
command=/var/www/fit-vmu/phpw artisan reverb:start --host=0.0.0.0 --port=8080
user=deploy
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
redirect_stderr=true
stdout_logfile=/var/www/fit-vmu/storage/logs/reverb.log
```

Enable:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start fit-vmu-reverb
```

## 13. Cron cho scheduler

Nếu app chưa có scheduled task thì cron này vẫn an toàn và nên cấu hình sẵn.

Mở crontab của user `deploy`:

```bash
sudo -u deploy crontab -e
```

Thêm dòng:

```cron
* * * * * cd /var/www/fit-vmu && ./phpw artisan schedule:run >> /dev/null 2>&1
```

## 14. Checklist kiểm tra sau deploy

### 14.1. Kiểm tra service

```bash
sudo systemctl status nginx
sudo systemctl status php8.5-fpm
sudo systemctl status postgresql
sudo supervisorctl status
```

### 14.2. Kiểm tra Laravel

```bash
cd /var/www/fit-vmu
sudo -u deploy ./phpw artisan about
sudo -u deploy ./phpw artisan migrate:status
sudo -u deploy ./phpw artisan queue:monitor database:default --max=100
```

### 14.3. Kiểm tra health route

App có sẵn health route tại:

```text
https://fit.mcmevn.com/up
```

Response `200` nghĩa là app boot thành công.

### 14.4. Kiểm tra realtime

Repo đã có demo realtime qua endpoint:

```text
POST /cms/realtime/ping
```

Nếu event không chạy:

- kiểm tra process `fit-vmu-reverb`
- kiểm tra `REVERB_*` trong `.env`
- kiểm tra Nginx site `ws.fit.example.com`
- kiểm tra browser console và log `storage/logs/reverb.log`

## 15. Kiểm tra SSL sau khi cấp chứng chỉ

Kiểm tra response HTTPS:

```bash
curl -I https://fit.mcmevn.com
curl -I https://fit.mcmevn.com/up
```

Kiểm tra redirect HTTP sang HTTPS:

```bash
curl -I http://fit.mcmevn.com
curl -I http://ws.fit.mcmevn.com
```

Kết quả mong muốn:

- HTTP trả `301`
- HTTPS trả `200` hoặc `302` hợp lệ theo route
- chứng chỉ hợp lệ cho cả `fit.mcmevn.com` và `ws.fit.mcmevn.com`

## 16. Quy trình deploy bản cập nhật

Mỗi lần deploy version mới:

```bash
cd /var/www/fit-vmu
sudo -u deploy git pull origin <branch>
sudo -u deploy ./composerw install --no-dev --optimize-autoloader
sudo -u deploy pnpm install --frozen-lockfile
sudo -u deploy pnpm run build
sudo -u deploy ./phpw artisan migrate --force
sudo -u deploy ./phpw artisan optimize:clear
sudo -u deploy ./phpw artisan optimize
sudo -u deploy ./phpw artisan reload
```

Nếu `artisan reload` chưa đáp ứng đúng mô hình process của bạn, thay bằng:

```bash
sudo -u deploy ./phpw artisan queue:restart
sudo -u deploy ./phpw artisan reverb:restart
```

## 17. Lỗi thường gặp khi chuyển sang PostgreSQL và SSL

### 16.1. `could not find driver`

Thiếu extension `pdo_pgsql` hoặc `php8.5-pgsql`.

### 16.2. `permission denied for schema public`

User PostgreSQL chưa có quyền trên schema `public`. Chạy lại:

```sql
GRANT ALL ON SCHEMA public TO fit_vmu;
ALTER SCHEMA public OWNER TO fit_vmu;
```

### 16.3. Login/OAuth bị mất session

Thường do một trong các nguyên nhân sau:

- `APP_URL` không khớp domain thực tế
- `SESSION_DOMAIN` sai
- `GOOGLE_REDIRECT_URI` khác host với `APP_URL`
- đang dùng HTTP nhưng cookie bị cấu hình như HTTPS

### 17.4. Certbot không cấp được SSL

Thường do:

- DNS chưa trỏ đúng IP VPS
- Nginx chưa `reload`
- firewall chặn port `80` hoặc `443`
- domain đang bị proxy qua dịch vụ khác nhưng chưa cấu hình đúng

Kiểm tra:

```bash
sudo nginx -t
sudo systemctl status nginx
sudo ufw status
```

### 17.5. Frontend thay đổi nhưng production không cập nhật

Kiểm tra lại:

- đã chạy `pnpm run build`
- Nginx đang trỏ đúng `public/`
- file build mới đã được deploy

### 17.6. Queue không xử lý job

Kiểm tra:

- Supervisor có chạy `queue:work`
- bảng `jobs` có record bị treo không
- log tại `storage/logs/worker.log`

## 18. Gợi ý hardening thêm

- Chỉ mở port `80`, `443`, `22`; không public trực tiếp port `8080`
- Bật firewall bằng `ufw`
- Tắt `APP_DEBUG`
- Đặt `LOG_LEVEL=info` hoặc `warning`
- Dùng password mạnh cho PostgreSQL
- Đặt backup cho database và thư mục `storage/app`

# Deploying Convine to a DigitalOcean Droplet

One Ubuntu server runs everything. **Vite builds the React SPA straight into
`backend/public`** (`frontend/vite.config.js` → `outDir: ../backend/public`), and
**Laravel serves it** — `routes/web.php` returns the SPA shell for non-API routes
while handling `/api` and `/storage` itself. So the document root is
`backend/public`, the SPA and API share **one origin**, and the session cookie
works without CORS/Sanctum. SQLite is the database; uploaded photos live on the
droplet's persistent disk; HTTPS is free via Let's Encrypt.

> Same-origin serving also removes the cross-origin/proxy cookie problem you saw
> in local dev, so login/session should be solid in production.

---

## 0. Before you start
- Activate **DigitalOcean** in your GitHub Student Pack ($200 credit).
- Claim your free **Namecheap `.me`** domain.
- Code is at `https://github.com/Mouhebhamza12/convine`.

## 1. Create the droplet
DigitalOcean → **Create → Droplets**:
- **Ubuntu 24.04 LTS**, **Basic / Regular**, **2 GB RAM ($12/mo)** so the Vite
  build doesn't run out of memory (1 GB works only with the swap step below).
- Datacenter near your guests; add your **SSH key**; create; copy the **public IPv4**.

## 2. Point the domain (Namecheap)
Namecheap → **Domain List → Manage → Advanced DNS** → add:
| Type | Host | Value |
|------|------|-------|
| A | `@` | `<DROPLET_IP>` |
| A | `www` | `<DROPLET_IP>` |
Remove default parking records. DNS takes ~5–30 min.

## 3. Install the stack
```bash
ssh root@<DROPLET_IP>
apt update && apt upgrade -y

# (1 GB droplet only) 2 GB swap so the build won't OOM:
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

apt install -y nginx git unzip curl \
  php8.3 php8.3-fpm php8.3-cli php8.3-sqlite3 php8.3-mbstring \
  php8.3-xml php8.3-curl php8.3-zip php8.3-gd

curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs
```

## 4. Raise PHP upload limits (for the 0–4 photo feature)
```bash
sed -i 's/^upload_max_filesize = .*/upload_max_filesize = 12M/' /etc/php/8.3/fpm/php.ini
sed -i 's/^post_max_size = .*/post_max_size = 16M/' /etc/php/8.3/fpm/php.ini
systemctl restart php8.3-fpm
```

## 5. Get the code
```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/Mouhebhamza12/convine.git
cd convine
```

## 6. Configure & build the backend
```bash
cd /var/www/convine/backend
cp .env.example .env
nano .env
```
In `.env` set, for production (the file's header lists the same checklist):
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://YOURDOMAIN.me
SESSION_SECURE_COOKIE=true
ADMIN_EMAIL=you@yourdomain.me            # your real admin login
ADMIN_PASSWORD=use-a-strong-unique-password
```
Then:
```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
touch database/database.sqlite
php artisan migrate --force
php artisan db:seed --force      # seeds the admin from ADMIN_EMAIL / ADMIN_PASSWORD
php artisan storage:link
```

## 7. Build the frontend (emits into backend/public)
```bash
cd /var/www/convine/frontend
npm ci
npm run build       # writes index.html + /assets into ../backend/public
```

## 8. Cache config + permissions
```bash
cd /var/www/convine/backend
php artisan config:cache && php artisan view:cache
# (do NOT run route:cache — web.php uses closures)
cd /var/www/convine
chown -R www-data:www-data backend/storage backend/bootstrap/cache backend/database
chmod -R 775 backend/storage backend/bootstrap/cache
```

## 9. Nginx (document root = backend/public)
```bash
cp /var/www/convine/deploy/nginx.conf /etc/nginx/sites-available/convine
nano /etc/nginx/sites-available/convine     # replace YOURDOMAIN.me
ln -s /etc/nginx/sites-available/convine /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```
Visit **http://YOURDOMAIN.me** — the platform should load.

## 10. HTTPS (free, auto-renewing)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d YOURDOMAIN.me -d www.YOURDOMAIN.me   # choose "redirect HTTP -> HTTPS"
cd /var/www/convine/backend && php artisan config:cache && systemctl reload php8.3-fpm
```

## 11. Firewall
```bash
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable
```

---

## Redeploying after you push new code
```bash
cd /var/www/convine && sudo ./deploy/deploy.sh
```

## Where things live
- **Uploaded photos:** `backend/storage/app/public/weddings/photos`, served at `/storage/...`; persist across redeploys.
- **Database:** `backend/database/database.sqlite` — back it up with `cp` periodically.
- **Logs:** `backend/storage/logs/laravel.log`; `journalctl -u nginx`; `journalctl -u php8.3-fpm`.

## Troubleshooting
- **503 "Frontend build not found"** → run step 7 (`npm run build`) so `backend/public/index.html` exists.
- **500 on every request** → `backend/.env` missing `APP_KEY`, or run `php artisan config:cache` after editing `.env`.
- **419 / login won't stick** → confirm `APP_URL` matches the real https domain and `SESSION_SECURE_COOKIE=true`.
- **413 on photo upload** → re-check step 4 (PHP limits) and `client_max_body_size` in nginx.
- **502 Bad Gateway** → confirm the FPM socket exists: `ls /run/php/php8.3-fpm.sock`.

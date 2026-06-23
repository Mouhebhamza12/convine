# Deploying Convine to a DigitalOcean Droplet

A single Ubuntu server runs everything: **Nginx** serves the built React SPA and
proxies `/api` to **Laravel** (PHP 8.3) on the **same origin**. SQLite is the
database; uploaded photos live on the droplet's persistent disk. HTTPS is free
via Let's Encrypt; the domain is your free Namecheap `.me`.

> Same-origin serving also removes the cross-origin/proxy cookie problem you saw
> in local dev, so the login/session should be solid in production.

---

## 0. Before you start
- Activate **DigitalOcean** in your GitHub Student Pack ($200 credit).
- Claim your free **Namecheap `.me`** domain.
- Code is on GitHub at `https://github.com/Mouhebhamza12/convine`.

## 1. Create the droplet
DigitalOcean → **Create → Droplets**:
- **Ubuntu 24.04 LTS**
- **Basic / Regular** — pick **2 GB RAM ($12/mo)** so the `npm run build` doesn't run out of memory (1 GB can work with swap; see step 3).
- Datacenter near your guests.
- **SSH key** (recommended) or password.
- Create, then copy the **public IPv4**.

## 2. Point the domain (Namecheap)
Namecheap → **Domain List → Manage → Advanced DNS** → add:
| Type | Host | Value |
|------|------|-------|
| A | `@` | `<DROPLET_IP>` |
| A | `www` | `<DROPLET_IP>` |
Remove any default parking records. DNS takes ~5–30 min to propagate.

## 3. Install the stack
```bash
ssh root@<DROPLET_IP>
apt update && apt upgrade -y

# (1 GB droplet only) add 2 GB swap so npm build won't OOM:
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Web stack
apt install -y nginx git unzip curl \
  php8.3 php8.3-fpm php8.3-cli php8.3-sqlite3 php8.3-mbstring \
  php8.3-xml php8.3-curl php8.3-zip php8.3-gd

# Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Node 20 (for the Vite build)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
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
cp ../deploy/laravel.env.example .env
nano .env          # replace YOURDOMAIN.me everywhere with your real domain
composer install --no-dev --optimize-autoloader
php artisan key:generate
touch database/database.sqlite
php artisan migrate --force
php artisan db:seed --force      # creates admin: you@platform.com / admin-change-me
php artisan storage:link
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

## 7. Build the frontend
```bash
cd /var/www/convine/frontend
npm ci
npm run build                    # outputs frontend/dist
```

## 8. Permissions
```bash
cd /var/www/convine
chown -R www-data:www-data backend/storage backend/bootstrap/cache backend/database
chmod -R 775 backend/storage backend/bootstrap/cache
```

## 9. Nginx
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
```
`SESSION_SECURE_COOKIE=true` is already set, so re-cache config:
```bash
cd /var/www/convine/backend && php artisan config:cache && systemctl reload php8.3-fpm
```

## 11. Firewall
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

## 12. Change the admin password (important!)
Log in at `https://YOURDOMAIN.me/login` as `you@platform.com` / `admin-change-me`,
then change it — or from the server:
```bash
cd /var/www/convine/backend
php artisan tinker --execute="\$u=App\Models\User::where('email','you@platform.com')->first(); \$u->password=Hash::make('YOUR-NEW-STRONG-PASSWORD'); \$u->save(); echo 'updated';"
```

---

## Redeploying after you push new code
```bash
cd /var/www/convine && sudo ./deploy/deploy.sh
```

## Where things live
- **Uploaded photos:** `backend/storage/app/public/weddings/photos`, served at `/storage/...` — they persist across redeploys.
- **Database:** `backend/database/database.sqlite`. Back it up with `cp` periodically.
- **Logs:** `backend/storage/logs/laravel.log`, and `journalctl -u nginx` / `journalctl -u php8.3-fpm`.

## Troubleshooting
- **500 on every request** → check `backend/.env` has `APP_KEY` and `php artisan config:cache` was run after edits.
- **419 / login won't stick** → confirm `APP_URL` and `SANCTUM_STATEFUL_DOMAINS` match the real domain and you're on **https**.
- **413 on photo upload** → re-check step 4 (PHP limits) and `client_max_body_size` in nginx.
- **502 Bad Gateway** → PHP-FPM socket path; confirm `unix:/run/php/php8.3-fpm.sock` exists (`ls /run/php/`).

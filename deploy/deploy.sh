#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────────────────
# Convine — redeploy script. Run on the droplet from the repo root:
#   cd /var/www/convine && sudo ./deploy.sh
# Pulls latest, installs deps, builds the SPA, migrates, caches, fixes perms.
# ───────────────────────────────────────────────────────────────────────────
set -euo pipefail

cd "$(dirname "$0")/.."   # repo root (deploy/ -> ..)
ROOT="$(pwd)"
echo "==> Deploying from $ROOT"

echo "==> git pull"
git pull --ff-only

echo "==> backend: composer + migrate + cache"
cd "$ROOT/backend"
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> frontend: build"
cd "$ROOT/frontend"
npm ci
npm run build

echo "==> permissions (writable paths -> www-data)"
chown -R www-data:www-data "$ROOT/backend/storage" "$ROOT/backend/bootstrap/cache" "$ROOT/backend/database"
chmod -R 775 "$ROOT/backend/storage" "$ROOT/backend/bootstrap/cache"

echo "==> reload services"
systemctl reload php8.3-fpm
systemctl reload nginx

echo "==> Done."

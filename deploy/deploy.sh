#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────────────────
# Convine — redeploy script. Run on the droplet from the repo root:
#   cd /var/www/convine && sudo ./deploy/deploy.sh
# Pulls latest, installs deps, builds the SPA (into backend/public), migrates,
# caches config, fixes writable-path permissions, reloads services.
# ───────────────────────────────────────────────────────────────────────────
set -euo pipefail

cd "$(dirname "$0")/.."   # repo root (deploy/ -> ..)
ROOT="$(pwd)"
echo "==> Deploying from $ROOT"

echo "==> git pull"
git pull --ff-only

echo "==> backend: composer + migrate"
cd "$ROOT/backend"
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan storage:link || true

echo "==> frontend: build (emits into backend/public)"
cd "$ROOT/frontend"
npm ci
rm -rf "$ROOT/backend/public/assets"   # drop stale hashed bundles
npm run build

echo "==> backend: cache config + views"
cd "$ROOT/backend"
php artisan config:cache
php artisan view:cache
# NOTE: no `route:cache` — routes/web.php uses closures, which can't be cached.

echo "==> permissions (writable paths -> www-data)"
chown -R www-data:www-data "$ROOT/backend/storage" "$ROOT/backend/bootstrap/cache" "$ROOT/backend/database"
chmod -R 775 "$ROOT/backend/storage" "$ROOT/backend/bootstrap/cache"

echo "==> reload services"
systemctl reload php8.3-fpm
systemctl reload nginx

echo "==> Done."

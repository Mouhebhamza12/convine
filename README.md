# Convive

Digital wedding invitations platform.

## Project structure

```
convive/
├── backend/    Laravel API (port 8000)
└── frontend/   React app (port 3000)
```

## Start development

**Terminal 1-backend**

```bash
cd backend
php artisan serve
```

**Terminal 2-frontend**

```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

## Guest demo templates (no login)

| Template | URL |
|----------|-----|
| Ivoire-embossed ivory florals & gilded cameo | http://localhost:3000/invite/demo-ivoire |
| Roseraie-blush, burgundy & ivory wax-seal keepsake | http://localhost:3000/invite/demo-roseraie |
| Velvet-red drape cinematic | http://localhost:3000/invite/demo |
| Sage-botanical line art | http://localhost:3000/invite/demo-sage |
| Azure-blue illustrated charm | http://localhost:3000/invite/demo-azure |

## Admin login

The seeded admin comes from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env`.
Local-dev defaults are `you@platform.com` / `admin-change-me` — **set real values
before any internet-facing deploy** (the defaults are public knowledge).

## First-time setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed

cd ../frontend
npm install
```

## Production deploy

The app is **same-origin**: auth uses session cookies + CSRF under Laravel's
`web` group (no Sanctum tokens, no CORS), so the SPA and the API must be served
from one origin.

1. **Build the SPA into Laravel's public root** (configured via Vite `outDir`):

   ```bash
   cd frontend && npm run build      # emits backend/public/index.html + assets/
   ```

   Laravel then serves `index.html` for every non-API route (see `routes/web.php`)
   and React Router handles `/login`, `/admin`, `/dashboard`, `/invite/:token`.

2. **Point the web server's document root at `backend/public`** (the standard
   Laravel front controller + `.htaccess` is already in place).

3. **Set production env in `backend/.env`** (see the checklist at the top of
   `backend/.env.example`): `APP_ENV=production`, `APP_DEBUG=false`,
   `APP_URL=https://…`, `SESSION_SECURE_COOKIE=true`, a durable DB, and unique
   `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Then `php artisan migrate --seed`.

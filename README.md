# Convive

Digital wedding invitations platform.

## Project structure

```
convive/
├── backend/    Laravel API (port 8000)
└── frontend/   React app (port 3000)
```

## Start development

**Terminal 1 — backend**

```bash
cd backend
php artisan serve
```

**Terminal 2 — frontend**

```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

## Admin login

- Email: `you@platform.com`
- Password: `admin-change-me`

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

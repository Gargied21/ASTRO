# ASTRO (Chaitanya Ved Pratishthan) — Deployment & Operations Guide

**Last Updated:** 2026-10-25  
**Architecture:** Independently deployable Frontend SPA (`frontend/`) and Backend REST API (`backend/`)

---

## 1. Prerequisites

- **Node.js:** `>= 20.x` (tested on `v24.20.0`)
- **npm:** `>= 10.x` (tested on `11.19.0`)
- **Database:** SQLite 3 (via Prisma ORM `6.19.3` out of the box; configurable to PostgreSQL for multi-node cloud deployments)

---

## 2. Environment Configuration

### 2.1 Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and configure:
```env
NODE_ENV="production"
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="<generate-a-strong-64-char-random-secret>"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="https://your-frontend-domain.org"
ADMIN_SETUP_TOKEN="<generate-a-strong-admin-bootstrap-token>"
```

### 2.2 Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env` and configure:
```env
VITE_API_BASE_URL="https://api.your-domain.org/api/v1"
```
*(In local development, `VITE_API_BASE_URL` defaults to `/api/v1`, which Vite proxies to `http://localhost:4000` via `frontend/vite.config.ts`.)*

---

## 3. Database Setup, Migrations & Reference Catalog Seeding

Run from the repository root (`/Users/rupesh/Documents/ASTRO`) or inside `backend/`:

```bash
# 1. Install dependencies for root, backend, and frontend
npm run install:all

# 2. Generate Prisma Client and apply migrations
cd backend
npx prisma generate
npx prisma migrate deploy

# 3. Seed canonical reference catalogs (8 Poojas, 6 Gurukul Courses, 4 Events)
# Note: This does NOT create fake users, fake donations, or fake appointments.
npm run db:seed
```

---

## 4. Building for Production

Both applications build independently and can be deployed to separate hosts/containers:

```bash
# Build both backend and frontend from root:
npm run build

# Or build independently:
npm --prefix backend run build     # Outputs compiled JS to backend/dist/
npm --prefix frontend run build    # Outputs static bundle to frontend/dist/
```

---

## 5. Starting the Services

### 5.1 Local Development (Hot Reload)
```bash
# Terminal 1 — Start Backend API on http://localhost:4000
npm run dev:backend

# Terminal 2 — Start Frontend Vite Dev Server on http://localhost:5173
npm run dev:frontend
```

### 5.2 Production Execution
```bash
# Start compiled Backend API server (port 4000):
cd backend
NODE_ENV=production npm start

# Preview/Serve compiled Frontend SPA:
cd frontend
npm run preview -- --port 3000 --host
```

---

## 6. Health Checks & Monitoring

- **Liveness Probe:** `GET http://localhost:4000/health`
  - Expected: `200 OK` — `{"status":"healthy","timestamp":"...","uptimeSeconds":...,"environment":"production"}`
- **Readiness Probe:** `GET http://localhost:4000/ready`
  - Expected: `200 OK` — `{"status":"ready","database":"connected","timestamp":"..."}`

---

## 7. Running Quality Gates & Automated Tests

```bash
# Run full-stack TypeScript verification (backend + frontend):
npm run lint

# Run all 41 automated tests (33 backend integration/DB tests + 8 frontend unit tests):
npm test
```

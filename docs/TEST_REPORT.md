# ASTRO (Chaitanya Ved Pratishthan) — Automated Test & Verification Report

**Execution Date:** 2026-10-25  
**Environment:** macOS (`darwin`), Node.js `v24.20.0`, npm `11.19.0`, Prisma `6.19.3`, Vite `8.3.5`, TypeScript `5.8.2`

---

## 1. Executive Summary

| Suite / Check | Command | Total Checks | Passed | Failed | Duration | Status |
|---|---|---:|---:|---:|---:|---|
| **Backend TypeScript Typecheck** | `npm run lint:backend` (`tsc --noEmit`) | 1 | 1 | 0 | ~0.6s | **PASS** |
| **Frontend TypeScript Typecheck** | `npm run lint:frontend` (`tsc --noEmit`) | 1 | 1 | 0 | ~0.8s | **PASS** |
| **Backend API & DB Integration Tests** | `npm run test:backend` (`node --import tsx --test tests/*.test.ts`) | 33 | 33 | 0 | 418.8ms | **PASS** |
| **Frontend Unit & API Client Tests** | `npm run test:frontend` (`node --import tsx --test tests/*.test.ts`) | 8 | 8 | 0 | 80.9ms | **PASS** |
| **Prisma Disposable DB Migration Test** | `DATABASE_URL="file:./test_verify.db" npx prisma migrate deploy` | 1 | 1 | 0 | 106.0ms | **PASS** |
| **Backend Production Build** | `npm run build:backend` (`tsc`) | 1 | 1 | 0 | ~0.8s | **PASS** |
| **Frontend Production Build** | `npm run build:frontend` (`tsc --noEmit && vite build`) | 1 | 1 | 0 | 165.0ms | **PASS** |
| **Total** | `npm run lint && npm test && npm run build` | **46** | **46** | **0** | **~3.0s** | **100% PASS** |

---

## 2. Backend Integration & Database Test Breakdown (`backend/tests/*.test.ts`)

### 2.1 `backend/tests/health.test.ts` (4 assertions)
- `GET /health` returns `200 OK`, `status: 'healthy'`, and numeric `uptimeSeconds`.
- `GET /ready` executes `SELECT 1` against SQLite via Prisma and returns `200 OK` with `database: 'connected'`.
- `GET /api/v1/non-existent-route-999` returns `404 NOT_FOUND` with structured error payload.

### 2.2 `backend/tests/auth.test.ts` (7 assertions)
- `POST /api/v1/auth/request-otp` rejects invalid short phone numbers (`400 VALIDATION_ERROR`).
- `POST /api/v1/auth/request-otp` generates a 6-digit OTP persisted in `OtpSession` (`200 OK`).
- `POST /api/v1/auth/verify-otp` rejects wrong OTP codes (`400 INVALID_OTP`) and increments `attempts`.
- `POST /api/v1/auth/verify-otp` verifies valid OTP, creates `User` + `DevoteeSettings` + welcome `Notification`, and returns signed JWT (`200 OK`).
- `GET /api/v1/auth/me` returns `401 UNAUTHORIZED` without Bearer token.
- `GET /api/v1/auth/me` returns authenticated user's profile with valid Bearer token (`200 OK`).

### 2.3 `backend/tests/appointments.test.ts` (5 assertions)
- `POST /api/v1/appointments` rejects missing required fields (`400 VALIDATION_ERROR`).
- `POST /api/v1/appointments` persists a real appointment (`CVP-2026-XXXX-XXXX`), creates a confirmation `Notification`, and automatically initializes an `AstrologyConsultation` record when `serviceDomain === 'jyotish'` (`201 Created`).
- `GET /api/v1/appointments/:id` retrieves the persisted appointment slip (`200 OK`).
- `GET /api/v1/appointments/my` lists appointments scoped to the authenticated user (`200 OK`).

### 2.4 `backend/tests/donations.test.ts` (6 assertions)
- `GET /api/v1/donations/receipts` and `GET /api/v1/donations/form10be/:fy` reject unauthenticated requests with `401 UNAUTHORIZED` (preventing cross-user data leaks).
- `POST /api/v1/donations` persists donation in SQLite, syncs `panNumber` to `User`, generates collision-safe receipt number (`#CVP-2026-XXXX-XXXX`), and returns `{ ...donation, donation, receipt }` (`201 Created`).
- `GET /api/v1/donations/receipts` returns only the authenticated user's receipts (`200 OK`).
- `GET /api/v1/donations/receipts/:receiptNo` retrieves a specific 80G receipt (`200 OK`).
- `GET /api/v1/donations/form10be/all` computes Form 10BE annual summary with `arn`, `trustPan: 'AAATC8942D'`, `totalAmount`, and `totalEligibleAmount` (`200 OK`).

### 2.5 `backend/tests/catalog_and_features.test.ts` (11 assertions)
- `GET /api/v1/poojas` returns all 8 canonical Vedic Pooja services from SQLite (`200 OK`).
- `GET /api/v1/poojas/maha-mrityunjaya` returns parsed `mode`, `benefits`, and `includedItems` arrays (`200 OK`).
- `GET /api/v1/gurukul/courses` returns all 6 canonical Gurukul courses with `categoryLabel` and `syllabusHighlights` (`200 OK`).
- `POST /api/v1/gurukul/submissions` validates input (`400` on invalid payload) and persists audio submission returning both `refNo` and `submissionId` (`201 Created`).
- `POST /api/v1/contact` persists inquiry (`201 Created`), while `GET /api/v1/contact` enforces RBAC (`401` unauthenticated, `403 FORBIDDEN` for `DEVOTEE`, `200 OK` for `ADMIN`).
- `POST /api/v1/events/event-1/register` validates input (`400` on invalid payload) and reserves an event pass returning `passNumber` (`201 Created`).
- `PUT /api/v1/devotee/profile`, `POST /api/v1/devotee/family`, and `DELETE /api/v1/devotee/family/:id` persist profile updates (`gotra`, `nakshatra`, `panNumber`) and family member additions/deletions in SQLite.
- `GET /api/v1/rituals` enforces `requireAuth` (`401` unauthenticated); `POST /api/v1/rituals` creates a ritual with tracking number; `GET /api/v1/rituals/track/:trackingNumber` returns `status`, `trackingStatus`, and `carrier`.
- `POST /api/v1/astrology/questions` persists pre-consultation questions in SQLite (`201 Created`).
- `PATCH /api/v1/notifications/:id/read` returns `404 NOT_FOUND` for non-existent or unowned notification IDs.

---

## 3. Frontend Test Breakdown (`frontend/tests/*.test.ts`)

### 3.1 `frontend/tests/api.test.ts` (2 tests)
- Verifies `ApiException` construction, HTTP status code, error code, and field-level validation details.
- Verifies JWT token storage helper (`setToken`, `getToken`, `removeToken`) in `localStorage`.

### 3.2 `frontend/tests/formatters.test.ts` (6 tests)
- Verifies Western-to-Devanagari (`०१२३४५६७८९`) and Western-to-Gujarati (`૦૧૨૩૪૫૬૭૮૯`) numeral conversion.
- Verifies Indian currency formatting (`₹36,000`) and multilingual currency localization (`mr`, `hi`, `gu`, `en`).
- Verifies 80G tax saving calculation (`calculate80GTaxSaving`) and ritual japa progress percentage clamping (`calculateProgressPercent`).

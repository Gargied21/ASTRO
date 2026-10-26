# ASTRO (Chaitanya Ved Pratishthan) — Backend API Documentation

**Base URL (Development):** `http://localhost:4000/api/v1`  
**Health Endpoints:** `GET /health`, `GET /ready`  
**Authentication Scheme:** `Authorization: Bearer <jwt_token>`  
**Content-Type:** `application/json`

---

## 1. Standard Response & Error Format

### Success Response
```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | INTERNAL_ERROR",
    "message": "Human-readable error summary",
    "details": [
      { "field": "body.phone", "message": "Valid 10-digit Indian mobile number is required" }
    ]
  }
}
```

---

## 2. Health & Readiness Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Returns process uptime, timestamp, and `{ status: "healthy" }`. |
| `GET` | `/ready` | Public | Executes `SELECT 1` on SQLite via Prisma; returns `{ status: "ready", database: "connected" }` (`200`) or `503`. |

---

## 3. Authentication (`/api/v1/auth`)

| Method | Path | Auth | Request Body | Response (`200 OK`) |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/request-otp` | Public (Rate-limited: 15/10m) | `{ "phone": "9822054321" }` | `{ "phone": "9822054321", "expiresInSeconds": 300, "debugOtp"?: "123456" }` |
| `POST` | `/api/v1/auth/verify-otp` | Public (Rate-limited: 15/10m) | `{ "phone": "9822054321", "otp": "123456", "name"?: "Shri Parikshit Shastri" }` | `{ "token": "<jwt>", "user": { "id", "code", "name", "phone", "gotra", "nakshatra", "rashi", "panNumber", "familyMembers", "settings" } }` |
| `GET` | `/api/v1/auth/me` | `requireAuth` | — | Full `User` profile with `familyMembers` and `settings`. |
| `POST` | `/api/v1/auth/admin-setup` | `ADMIN_SETUP_TOKEN` | `{ "setupToken": "...", "phone": "9822054321", "name": "Acharya Admin", "email"?: "..." }` | `{ "token": "<jwt>", "user": { "role": "ADMIN", ... } }` |

---

## 4. Devotee Profile, Family & Preferences (`/api/v1/devotee`)

| Method | Path | Auth | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/devotee/summary` | `requireAuth` | — | Aggregated dashboard stats (`activeRituals`, `upcomingAppointments`, `totalDonationsAmount`, `unreadNotifications`) + `profile`. |
| `GET` | `/api/v1/devotee/profile` | `requireAuth` | — | Returns authenticated devotee profile, `familyMembers`, and `settings`. |
| `PUT` | `/api/v1/devotee/profile` | `requireAuth` | `{ "name"?: string, "email"?: string, "gotra"?: string, "nakshatra"?: string, "charan"?: string, "rashi"?: string, "address"?: string, "dob"?: string, "tob"?: string, "pob"?: string, "kuladaivat"?: string, "panNumber"?: string }` | Updates devotee profile fields in SQLite. |
| `POST` | `/api/v1/devotee/family` | `requireAuth` | `{ "name": string, "relation": string, "nakshatra": string }` | Adds a family member to the devotee's Sankalpa lineage (`201 Created`). |
| `DELETE` | `/api/v1/devotee/family/:id` | `requireAuth` | — | Deletes a family member owned by the authenticated devotee (`200 OK` or `404`). |
| `GET` | `/api/v1/devotee/settings` | `requireAuth` | — | Returns notification & language preferences (`mr`, `hi`, `gu`, `en`). |
| `PUT` | `/api/v1/devotee/settings` | `requireAuth` | `{ "language"?: "mr"\|"en"\|"hi"\|"gu", "whatsappAlerts"?: boolean, "emailDigest"?: boolean, "panchangReminders"?: boolean }` | Upserts devotee settings. |

---

## 5. Appointments (`/api/v1/appointments`)

| Method | Path | Auth | Request Body | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/appointments` | `optionalAuth` | `{ "name": string, "phone": string, "email"?: string, "serviceDomain": "jyotish"\|"pooja"\|"vastu", "serviceName": string, "consultationMode": "online"\|"ashram", "slotDate": string, "slotTime": string, "birthDate"?: string, "birthTime"?: string, "birthPlace"?: string, "notes"?: string }` | Creates an appointment (`CVP-YYYY-NNNN-XXXX`). If authenticated and `serviceDomain === "jyotish"`, automatically initializes an `AstrologyConsultation` record (`201 Created`). |
| `GET` | `/api/v1/appointments/my` | `requireAuth` | — | Lists appointments belonging to the authenticated devotee. |
| `GET` | `/api/v1/appointments/:id` | Public | — | Retrieves an appointment slip by its reference ID (`CVP-...`). |

---

## 6. 80G Donations & Form 10BE Tax Vault (`/api/v1/donations`)

| Method | Path | Auth | Request Body / Query | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/donations` | `optionalAuth` | `{ "amount": number, "category": "anushthan"\|"gurukul"\|"goseva"\|"library"\|"general", "purpose": string, "purposeMr"?: string, "donorName": string, "donorPhone": string, "donorPan"?: string, "mode"?: string }` | Creates a donation record (`#CVP-YYYY-NNNN-XXXX`), syncs `donorPan` to `User.panNumber` if authenticated, and returns `{ ...donation, donation, receipt: donation }` (`201 Created`). |
| `GET` | `/api/v1/donations/receipts` | `requireAuth` | Query: `?fy=2025-26&category=gurukul` | Lists 80G tax receipts strictly scoped to the authenticated devotee. |
| `GET` | `/api/v1/donations/receipts/:receiptNo` | Public | — | Retrieves a specific 80G tax receipt by its URL-encoded `receiptNo`. |
| `GET` | `/api/v1/donations/form10be/:fy` | `requireAuth` | Path: `:fy` (`all`, `2024-25`, `2025-26`) | Generates CBDT Form 10BE certificate summary (`arn`, `trustPan`, `donorName`, `panNumber`, `totalAmount`, `totalEligibleAmount`, `receiptsCount`, `receipts`). |

---

## 7. Vedic Rituals & Prasad Tracking (`/api/v1/rituals`)

| Method | Path | Auth | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/rituals` | `requireAuth` | Query: `?status=active\|upcoming\|completed` | Lists rituals scoped to the authenticated devotee with parsed `trackingSteps`. |
| `POST` | `/api/v1/rituals` | `requireAuth` | `{ "title": string, "titleMr"?: string, "type"?: string, "sankalpaIntent": string, "date": string, "amount": number, ... }` | Creates a new ritual booking with auto-generated India Post tracking number (`IPXXXXXXIN`) and tracking steps (`201 Created`). |
| `GET` | `/api/v1/rituals/:id` | `requireAuth` | — | Retrieves a specific ritual owned by the user. |
| `GET` | `/api/v1/rituals/track/:trackingNumber` | Public | — | Tracks sacred Raksha-Sutra & Yajna Bhasma dispatch (`{ trackingNumber, status, trackingStatus, carrier, ritualTitle, steps }`). |

---

## 8. Jyotish Consultation & Pre-Session Questions (`/api/v1/astrology`)

| Method | Path | Auth | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/astrology/consultation` | `requireAuth` | — | Returns the user's active `AstrologyConsultation` with nested `questions` (or `null` if none booked yet). |
| `GET` | `/api/v1/astrology/questions` | `requireAuth` | — | Lists all pre-consultation questions submitted by the authenticated devotee. |
| `POST` | `/api/v1/astrology/questions` | `requireAuth` | `{ "category": string, "question": string, "refBhav"?: string }` | Submits a confidential astrology question (`201 Created`). |

---

## 9. Reference Catalogs, Gurukul, Events & Contact

| Method | Path | Auth | Request Body / Query | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/poojas` | Public | `?category=...&mode=...&search=...` | Returns all 8 canonical Pooja services with parsed `mode`, `benefits`, and `includedItems`. |
| `GET` | `/api/v1/poojas/:id` | Public | — | Returns a single Pooja service by slug ID. |
| `GET` | `/api/v1/gurukul/courses` | Public | `?category=all\|residential\|weekend\|paurohitya\|online` | Returns all 6 canonical Gurukul courses with `categoryLabel` and `syllabusHighlights`. |
| `GET` | `/api/v1/gurukul/courses/:id` | Public | — | Returns a single Gurukul course by slug ID. |
| `POST` | `/api/v1/gurukul/submissions` | `requireAuth` | `{ "mantraTitle": string, "durationSeconds": number }` | Submits a Vedic chanting audio exercise; returns `{ ...submission, refNo, submissionId }` (`201 Created`). |
| `GET` | `/api/v1/gurukul/submissions/my` | `requireAuth` | — | Lists the authenticated devotee's audio submissions. |
| `GET` | `/api/v1/events` | Public | — | Lists all 4 upcoming Ashram events/utsavas. |
| `GET` | `/api/v1/events/:id` | Public | — | Retrieves a single event by ID. |
| `POST` | `/api/v1/events/:id/register` | Public | `{ "name": string, "phone": string, "attendees"?: number }` | Reserves an event E-Pass (`{ passNumber, registration, event }`, `201 Created`). |
| `POST` | `/api/v1/contact` | Public (Rate-limited: 10/15m) | `{ "name": string, "phone": string, "email"?: string, "subject"?: string, "message": string }` | Saves a devotee or Gurukul admission inquiry (`201 Created`). |
| `GET` | `/api/v1/contact` | `requireAuth` + `requireRole('ADMIN','ACHARYA')` | — | Lists all contact inquiries for Ashram administrators. |
| `GET` | `/api/v1/notifications` | `requireAuth` | — | Lists notifications for the authenticated devotee. |
| `PATCH` | `/api/v1/notifications/:id/read` | `requireAuth` | — | Marks a single notification owned by the user as read (`200 OK` or `404`). |
| `POST` | `/api/v1/notifications/read-all` | `requireAuth` | — | Marks all unread notifications for the user as read. |

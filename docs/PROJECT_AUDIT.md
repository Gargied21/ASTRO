# ASTRO Project Comprehensive Audit Report

**Date:** October 25, 2026  
**Application Name:** Chaitanya Ved Pratishthan (चैतन्य वेद प्रतिष्ठान)  
**Repository:** `/Users/rupesh/Documents/ASTRO`  
**Auditor:** Senior Full-Stack Software Architect & QA Specialist  

---

## 1. Executive Summary

Chaitanya Ved Pratishthan (ASTRO) is a multilingual web application dedicated to authentic Vedic research, Jyotish Shastra (astrology), Sacred Yadnik Poojas, Gurukul Education, and a Devotee Sanctum (भक्त कक्ष).

The current repository represents a client-side Single Page Application (SPA) built with **React 19**, **Vite 8**, **Tailwind CSS v4**, and **TypeScript 7**. While the UI/UX is deeply refined with authentic Vedic aesthetics, iconography, typography, and quad-lingual support (English, Marathi, Hindi, Gujarati), the application currently lacks a functioning backend, database, and persistent API integration. All user authentication, devotee profile management, ritual tracking, astrology queries, tax receipts (80G), donations, contact submissions, and course learning progress rely entirely on hardcoded in-memory state and mock data structures.

This report outlines the technical audit of the codebase, inventories all user-facing features and mock data occurrences, identifies architectural deficiencies, and defines the roadmap to transition ASTRO into a production-grade full-stack platform with independent `frontend/` and `backend/` tiers.

---

## 2. Existing Stack & Architecture Audit

### 2.1 Technology Stack Discovered
- **Frontend Framework:** React 19.0.1 (`react`, `react-dom`)
- **Build Tool:** Vite 8.3.0 (`@vitejs/plugin-react`, `@tailwindcss/vite`)
- **Styling:** Tailwind CSS v4.3.3 + Vanilla CSS tokens (`src/index.css`)
- **Language / Type System:** TypeScript 7.0.2 (`tsconfig.json`)
- **Icons & Motion:** `lucide-react` (0.546.0), `motion` (12.23.24), Google Material Symbols Outlined
- **Unit Testing Tooling:** Node.js native test runner (`node:test`, `node:assert/strict`) via `tsx`
- **Backend / Server Code:** No active backend server exists. `express` (4.21.2) is listed in `package.json` dependencies, but there are no backend route handlers, controllers, or database connections.
- **AI Integrations:** `@google/genai` (2.4.0) is present in `package.json` dependencies, but not yet wired to server-side endpoints.

### 2.2 Entry Points & Routing
- Entry Point: `src/main.tsx` renders `<App />` into `#root` in `index.html`.
- Routing Architecture: Custom hash-based router inside `src/App.tsx` (`currentRoute`, `window.location.hash`, `routeParam`), synchronizing Google Translate and sub-paths:
  - **Public Routes:** `home`, `about`, `jyotish`, `yadnik-and-pooja`, `gurukul`, `gurukul-agni-sukta`, `book-appointment`, `events`, `resources`, `donate`, `contact`.
  - **Devotee Sanctum (Dashboard) Routes:** `dashboard`, `dashboard/rituals`, `dashboard/appointments`, `dashboard/learning`, `dashboard/astrology`, `dashboard/donations`, `dashboard/events`, `dashboard/resources`, `dashboard/notifications`, `dashboard/profile`, `dashboard/settings`.

---

## 3. Existing User-Facing Features & Feature Inventory

| Route / View | Purpose & Functionality | Current State | Target Backend Requirement |
|---|---|---|---|
| **Public: Home** (`HomeView`) | Hero, Vedic chants, featured poojas, upcoming events, counters, testimonials | Fully rendered; uses static metadata & links | Provide live counters & announcements via API |
| **Public: About** (`AboutView`) | Ashram history, Parampara, Acharyas, lineage | Static content | Remains static content |
| **Public: Yadnik & Pooja** (`PoojaCatalogueView`, `PoojaDetailModal`) | Filterable catalogue of 8 Vedic poojas by category, mode, duration, search | Static catalog in `poojaData.ts` | Services API: `GET /api/v1/poojas` |
| **Public: Gurukul** (`GurukulCatalogueView`) | Vedic study courses, syllabus highlights, audio lessons | Static catalog in `gurukulData.ts` | Courses API: `GET /api/v1/courses` |
| **Public: Agni Sukta Player** (`AgniSuktaPlayerView`) | Audio player with svara uccharan, patha mode (samhita/pada/krama), audio speed | In-memory player state in `DevoteeContext` | Retain frontend audio player controls; link tracks |
| **Public: Appointments** (`AppointmentBookingView`) | Consultation booking for Jyotish, Pooja planning, Vastu | Generates random in-memory slip `CVP-YYYY-0XXX` | `POST /api/v1/appointments` (persisted to DB) |
| **Public: Donate** (`DonateView`) | Seva donation presets (Vidyarthi, Goshala, etc.), 80G tax receipt generation | Random receipt ID, in-memory `addReceipt` | `POST /api/v1/donations` (creates real 80G receipt) |
| **Public: Contact** (`ContactView`) | Ashram seva desk inquiry form | `setTimeout` simulation, non-persisted | `POST /api/v1/contact` (saves inquiry to DB) |
| **Public: Events** (`EventsView`) | Festival calendar, collective chanting, pass reservations | `handleRegister` toast only, non-persisted | `POST /api/v1/events/:id/register` |
| **Public: Resources** (`ResourcesView`) | Vedic pothi PDFs, panchang tables, audio guides | Static links and panchang schedule | API for dynamic panchang / resource metadata |
| **Devotee Sanctum: Overview** (`DashboardOverview`) | Sanctum welcome, active muhurta, live ritual strip, quick links | Uses hardcoded `mockDevoteeProfile` & `mockRituals` | `GET /api/v1/devotee/dashboard` with real aggregates |
| **Devotee Sanctum: Rituals** (`RitualsView`) | Active Havans, live stream player, Speed Post prasad tracking | Hardcoded `mockRituals` with fake tracking number | `GET /api/v1/rituals`, `POST /api/v1/rituals` |
| **Devotee Sanctum: Appointments** (`AppointmentsView`) | Scheduled astrology & purohit consultations | Hardcoded `mockConsultation` | `GET /api/v1/appointments/my` |
| **Devotee Sanctum: Gurukul Learning** (`GurukulLearningView`) | Daily streak, audio recording submission for acharya review | Fake `#REC-7829-05` toast simulation | `POST /api/v1/gurukul/submissions` |
| **Devotee Sanctum: Astrology** (`AstrologyView`) | Kundali D1/D9 view, question submission to Shastriji | In-memory `addQuestion` only | `GET/POST /api/v1/astrology/questions` |
| **Devotee Sanctum: Donations Vault** (`DonationsVaultView`) | 80G tax receipts, Form 10BE download, direct payment initiate | Hardcoded `mockTaxReceipts` | `GET /api/v1/donations/receipts`, Form 10BE generator |
| **Devotee Sanctum: Notifications** (`NotificationsView`) | Live stream alerts, dispatch alerts, tax certificate notices | 4 hardcoded notification objects | `GET /api/v1/notifications`, `PATCH /read` |
| **Devotee Sanctum: Profile** (`ProfileView`) | Devotee Gotra, Nakshatra, birth coordinates, family members | Edits in-memory `mockDevoteeProfile` | `GET/PUT /api/v1/devotee/profile` |
| **Devotee Sanctum: Settings** (`SettingsView`) | Language preference, WhatsApp/Email alerts | UI toggles, non-persisted | `GET/PUT /api/v1/devotee/settings` |
| **Authentication: Login Modal** (`LoginModal`) | Mobile phone & OTP entry | Mock pre-filled OTP `584`, auto-login `true` | `POST /api/v1/auth/request-otp`, `POST /api/v1/auth/verify-otp` |

---

## 4. Mock and Seed Data Inventory & Classification

Every occurrence of fake/mock data in the application was audited and classified according to the Master Prompt taxonomy:
- **Class A:** Actual application configuration or legitimate static content (retained).
- **Class B:** UI placeholder or demonstration data that must be removed from production behavior.
- **Class C:** Test fixtures that remain exclusively within automated tests.
- **Class D:** Initial administrative configuration created through a secure bootstrap process.

| Location | Item Description | Classification | Required Remediation |
|---|---|---|---|
| `src/context/DevoteeContext.tsx:56` | `isLoggedIn = true` hardcoded initial state | **Class B** | Change initial state to check real session/token; unauthenticated by default |
| `src/context/DevoteeContext.tsx:58` | `profile = mockDevoteeProfile` | **Class B** | Fetch real profile via authenticated API `GET /api/v1/devotee/profile` |
| `src/context/DevoteeContext.tsx:59` | `receipts = mockTaxReceipts` | **Class B** | Fetch real tax receipts via `GET /api/v1/donations/receipts` |
| `src/context/DevoteeContext.tsx:60` | `rituals = mockRituals` | **Class B** | Fetch real rituals via `GET /api/v1/rituals` |
| `src/context/DevoteeContext.tsx:61` | `consultation = mockConsultation` | **Class B** | Fetch real consultations via `GET /api/v1/appointments/my` |
| `src/data/dashboardData.ts:8-29` | `mockDevoteeProfile` (Rajesh Kulkarni, Bharadwaj gotra, etc.) | **Class B** | Remove from production runtime; replace with database record |
| `src/data/dashboardData.ts:31-96` | `mockTaxReceipts` (4 fake receipts with mock PAN ABCDE****F) | **Class B** | Remove from production runtime; persist in database |
| `src/data/dashboardData.ts:98-157` | `mockRituals` (fake live stream status, Speed Post IP784920412IN) | **Class B** | Remove from production runtime; persist in database |
| `src/data/dashboardData.ts:159-188` | `mockConsultation` (fake session with Pt. Vishnupant Shastri) | **Class B** | Remove from production runtime; persist in database |
| `src/components/public/LoginModal.tsx:15,17` | Pre-filled mobile `98220 54321` and fake OTP `['5', '8', '4', '', '', '']` | **Class B** | Clear pre-filled credentials; implement real OTP verification API |
| `src/components/public/AppointmentBookingView.tsx:120` | `Math.random()` fake slip generation in memory | **Class B** | Call `POST /api/v1/appointments` to create DB record |
| `src/components/public/DonateView.tsx:92` | `Math.random()` fake receipt number in memory | **Class B** | Call `POST /api/v1/donations` to create DB record |
| `src/components/public/ContactView.tsx:35` | `setTimeout` mock submission handler | **Class B** | Call `POST /api/v1/contact` to persist message |
| `src/components/public/EventsView.tsx:170` | `handleRegister` toast only with zero persistence | **Class B** | Call `POST /api/v1/events/:id/register` to save registration |
| `src/components/dashboard/DonationsVaultView.tsx:71` | `Math.random()` receipt generation | **Class B** | Call `POST /api/v1/donations` |
| `src/components/dashboard/GurukulLearningView.tsx:39` | `#REC-7829-05` mock audio submission confirmation | **Class B** | Call `POST /api/v1/gurukul/submissions` |
| `src/components/dashboard/NotificationsView.tsx:13-100` | 4 hardcoded notification items | **Class B** | Fetch real notifications from `GET /api/v1/notifications` |
| `src/data/translations.ts` | Complete English, Marathi, Hindi, Gujarati localization dictionary | **Class A** | Retain in frontend; fundamental static UI configuration |
| `src/data/poojaData.ts` | 8 canonical Vedic pooja service descriptions & metadata | **Class A/D** | Seed into database or serve as official catalog |
| `src/data/gurukulData.ts` | 6 Gurukul courses and syllabus highlights | **Class A/D** | Seed into database or serve as official catalog |
| `src/utils/formatters.test.ts` | Unit tests for Devanagari/Gujarati number formatters | **Class C** | Retain in test suite |

---

## 5. Security & Configuration Audit

1. **Client-Side Authentication Bypass:**
   - Any user visiting `#dashboard` immediately gained full access to the mock devotee profile, mock tax records, and mock consultation notes because `isLoggedIn` was initialized to `true` with zero server token validation.
2. **Missing Input Validation & Sanitization:**
   - Client-side forms did basic non-empty checks, but no server schema validation (Zod) existed to prevent malformed payloads, SQL injection, XSS, or mass-assignment.
3. **Absence of Rate Limiting & CORS:**
   - No rate limiting existed for OTP generation, login attempts, or contact submissions.
   - No CORS origin restriction was configured.
4. **Secrets Management:**
   - `.env.example` contained placeholders for `GEMINI_API_KEY` and `APP_URL`, but no backend environment isolation, JWT secret, or database connection string was configured.

---

## 6. Migration & Architecture Plan

1. **Directory Split:**
   - `frontend/`: Standalone Vite + React application with isolated `package.json`, environment variables, type checks, and build pipeline.
   - `backend/`: Standalone Node.js + TypeScript + Express application with Prisma ORM, Zod validation, JWT authentication, and automated integration tests.
   - `docs/`: Comprehensive documentation suite (`PROJECT_AUDIT.md`, `API_DOCUMENTATION.md`, `TEST_REPORT.md`, `DEPLOYMENT_GUIDE.md`).
2. **Database Engine Selection:**
   - Relational database schema managed by Prisma ORM. For local zero-friction execution without external daemon dependencies, SQLite/Prisma provides instant, fully persistent database verification. The Prisma schema is crafted to be 100% portable to PostgreSQL in production environments.
3. **Frontend API Integration:**
   - Create a centralized typed HTTP client (`frontend/src/api/client.ts`) that manages authentication headers, base URL configuration via `VITE_API_BASE_URL`, error normalization, and request cancellation.
   - Connect all forms, dashboards, and modals to real REST endpoints with loading, success, empty, and error UI states.

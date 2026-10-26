# Chaitanya Ved Pratishthan (चैतन्य वेद प्रतिष्ठान)
### Full-Stack Vedic Platform — Clean Architecture & Decoupled Application

A production-grade, full-stack Vedic platform built for **Chaitanya Ved Pratishthan (Pune, Maharashtra)**. Preserves the sacred Sanskrit, Marathi, Hindi, and Gujarati heritage, authentic Vedic styling, audio recitations, and live ritual darshan, backed by a persistent relational database, type-safe REST API, and clean separation of concerns.

---

## 1. Project Architecture

The application is structured into two completely independent, decoupled application directories and a centralized documentation directory:

```text
ASTRO/
├── frontend/                  # React 19 + TypeScript + Vite + TailwindCSS
│   ├── src/
│   │   ├── api/client.ts      # Central typed HTTP API client
│   │   ├── components/        # Public Vedic views & Devotee Sanctum dashboard
│   │   ├── context/           # Devotee & Multilingual state
│   │   └── utils/             # Devanagari/Gujarati numeral and 80G tax formatters
│   ├── tests/                 # Unit tests for formatters & UI logic
│   ├── .env.example           # Frontend environment contract
│   └── package.json           # Frontend independent dependencies & scripts
│
├── backend/                   # Node.js + Express 5 + TypeScript + Prisma ORM
│   ├── src/
│   │   ├── config/            # Strict Zod environment variable validation
│   │   ├── database/          # Prisma client & idempotent canonical catalog seed
│   │   ├── middleware/        # Helmet, CORS, JWT auth, rate limiter, error handling
│   │   ├── modules/           # Auth, Devotee, Appointments, Donations, Gurukul, Poojas
│   │   ├── app.ts             # Express application factory
│   │   └── server.ts          # Server entry point on port 4000
│   ├── prisma/
│   │   └── schema.prisma      # Normalized relational database models
│   ├── tests/                 # 29 Automated integration & health tests
│   ├── .env.example           # Backend environment contract
│   └── package.json           # Backend independent dependencies & scripts
│
├── docs/                      # Architectural documentation & test evidence
│   ├── PROJECT_AUDIT.md       # Audit of legacy code, mock data & migration strategy
│   ├── API_DOCUMENTATION.md   # Complete REST API specification & schemas
│   ├── TEST_REPORT.md         # Automated test outputs & verification matrix
│   └── DEPLOYMENT_GUIDE.md    # Independent deployment instructions
│
├── package.json               # Root monorepo orchestrator (non-coupling convenience)
└── README.md                  # System overview and quickstart guide
```

---

## 2. Key Features

- **Decoupled Architecture**: Frontend and backend are independently installable, testable, buildable, and deployable.
- **Zero Fake Mock Data**: All hardcoded devotee profiles, client-side math-random IDs, and fake receipts have been eliminated. Devotee state, appointments, 80G tax receipts, and inquiries persist in the real database.
- **Vedic Heritage UI**: Fully preserves sacred saffron, burgundy, gold aesthetics, quad-lingual UI (मराठी, English, हिन्दी, ગુજરાતી), live Yajnashala video feeds, and mantra audio players.
- **Real 80G & Form 10BE System**: Dynamic generation of CBDT Section 80G deduction receipts and annual Form 10BE tax exemption certificates with official ARN.
- **Devotee Sanctum**: Secure OTP-based authentication, family Gotra/Sankalpa management, postal prasad consignment tracking via India Speed Post, and private Jyotish consultations with Pt. Vishnupant Shastri.
- **Strict Data Validation**: Zod runtime validation across all incoming request bodies, path parameters, and query parameters.
- **Zero-Dependency Local Dev**: Works out of the box with SQLite locally, seamlessly portable to PostgreSQL in production via Prisma ORM.

---

## 3. Quickstart Guide

### Prerequisites
- Node.js LTS (v20.x or v22.x)
- npm (v10+)

### Step 1: Install Dependencies
You can install both subprojects from the root orchestrator or inside each directory:

```bash
# From root directory:
npm run install:all

# Or individually:
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Configure Environment Variables

**Backend (`backend/.env`):**
```bash
cp backend/.env.example backend/.env
```
Default local variables:
```ini
PORT=4000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="vedic_chaitanya_secret_key_change_in_production"
JWT_EXPIRES_IN="7d"
FRONTEND_ORIGIN="http://localhost:5173"
```

**Frontend (`frontend/.env`):**
```bash
cp frontend/.env.example frontend/.env
```
Default local variable:
```ini
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

### Step 3: Initialize Database & Seed Canonical Catalog
```bash
# Push Prisma schema to SQLite dev.db
npm run db:push

# Seed canonical Poojas, Gurukul courses, and festival events (zero fake users)
npm run db:seed
```

### Step 4: Run Development Servers
Open two terminal windows or use root convenience commands:

**Terminal 1 (Backend API on Port 4000):**
```bash
npm run dev:backend
# API running at: http://localhost:4000
# Health check:   http://localhost:4000/health
```

**Terminal 2 (Frontend Client on Port 5173):**
```bash
npm run dev:frontend
# Devotee portal available at: http://localhost:5173
```

---

## 4. Testing & Quality Verification

Run all test suites across backend and frontend:

```bash
# Run all tests (35 / 35 tests passing)
npm test

# Run backend test suite (29 tests)
npm run test:backend

# Run frontend test suite (6 tests)
npm run test:frontend

# Run type-checking (tsc --noEmit)
npm run lint

# Generate production builds
npm run build
```

---

## 5. Documentation Links

- [Project Audit & Mock Data Inventory](file:///Users/rupesh/Documents/ASTRO/docs/PROJECT_AUDIT.md)
- [REST API Documentation](file:///Users/rupesh/Documents/ASTRO/docs/API_DOCUMENTATION.md)
- [Verification & Test Report](file:///Users/rupesh/Documents/ASTRO/docs/TEST_REPORT.md)
- [Independent Deployment Guide](file:///Users/rupesh/Documents/ASTRO/docs/DEPLOYMENT_GUIDE.md)

---

## 6. License
© Chaitanya Ved Pratishthan (चैतन्य वेद प्रतिष्ठान), Pune, Maharashtra. All rights reserved.

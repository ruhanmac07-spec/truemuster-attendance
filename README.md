# TRUEMUSTER — Smart Attendance System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Typecheck](https://img.shields.io/badge/typescript-strict-blue)]()
[![Tests](https://img.shields.io/badge/tests-4%20passed-success)]()

TRUEMUSTER is a high-integrity institutional attendance platform featuring a **Student Mobile App**, an **Admin/Teacher Windows Desktop Application**, and a shared **PostgreSQL/Supabase Backend**.

---

## 1. Project Purpose & Scope (v1.0 MVP)

- **Student Mobile App:** Authenticates against approved student rosters, enforces a single active Android hardware device binding, scans rotating 90-second QR codes, validates fresh GPS location (100-metre geofence), executes `BiometricPrompt` authorization, and commits attendance within a strict 45-second deadline.
- **Admin/Teacher Windows App:** Teachers launch assigned class sessions, project rotating dynamic QR challenges, monitor live attendance registers in real-time, and log audited manual exceptions. Administrators inspect system overviews, process dispute queues, and review immutable audit ledgers.
- **Shared Relational Backend:** PostgreSQL schema with Row-Level Security (RLS), atomic stored procedures (`verify_and_commit_attendance`), unique `(student_id, session_id)` constraints, and tamper-evident audit logs.

---

## 2. Monorepo Repository Structure

```text
truemuster/
├── apps/
│   ├── student-android/          # Student Mobile Web/Capacitor App (Vite + React + TS)
│   └── admin-windows/            # Teacher & Admin Windows App (Vite + React + TS)
├── packages/
│   ├── domain-contracts/         # Shared DTOs, interfaces, and reactive store
│   └── design-tokens/            # Canonical design tokens (colors, typography, spacing)
├── supabase/
│   └── migrations/               # PostgreSQL DDL migrations & atomic SQL functions
├── docs/
│   └── truemuster-planning/      # Master planning pack & design specifications
├── package.json                  # Root npm workspaces manifest
├── tsconfig.json                 # Strict root TypeScript configuration
└── .env.example                  # Safe environment variables template
```

---

## 3. Toolchain & Prerequisites

- **Node.js:** v20.18.0 or newer
- **npm:** v10.8.2 or newer
- **TypeScript:** v5.6.3
- **Git:** v2.54.0

---

## 4. Quickstart & Verification Commands

### Install All Workspace Dependencies
```bash
npm install
```

### Run Typecheck Across All Workspaces
```bash
npm run typecheck
```

### Execute Unit Test Suite
```bash
npx vitest run
```

### Build Production Bundles
```bash
npm run build
```

### Launch Development Servers
- **Student Mobile App:** `npm run dev:student` (Runs on `http://localhost:5173`)
- **Admin/Teacher Desktop App:** `npm run dev:admin` (Runs on `http://localhost:5174`)

---

## 5. Security & Privacy Guarantees

1. **Zero Privileged Secrets in Clients:** Mobile and desktop apps only access public APIs with the publishable/anon key. Never place `service_role` secrets in client code or source control.
2. **Server-Authoritative Clock:** The 90-second QR challenge validity and the 45-second check-in attempt deadline are enforced strictly by the backend server, never trusting device wall clocks.
3. **No Biometric Simulation / Facial Data:** Facial recognition is strictly out of v1 scope. `BiometricPrompt` authenticates only local phone unlock; no biometric samples leave the hardware device.

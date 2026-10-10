# TRUEMUSTER — Smart Attendance System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Typecheck](https://img.shields.io/badge/typescript-strict-blue)]()
[![Tests](https://img.shields.io/badge/tests-14%20passed-success)]()

TRUEMUSTER is a high-integrity institutional attendance platform featuring a **Student Mobile App**, an **Admin/Teacher Windows Desktop Application**, and a shared **PostgreSQL/Supabase Backend**.

---

## 1. Project Purpose & Scope (v1.0 MVP + Real-Time Biometrics)

- **Student Mobile App:** Authenticates against approved student rosters, enforces a single active Android hardware device binding, scans rotating 90-second QR codes via live camera feed (`jsQR`), features a dual-camera switcher (Rear QR vs Front Facial Biometric Mode), validates GPS geofence (100-metre radius), triggers platform `BiometricPrompt` / WebAuthn hardware device verification, and commits attendance within a strict 45-second deadline.
- **Admin/Teacher Windows App:** Teachers launch assigned class sessions, project rotating dynamic QR challenges, monitor live attendance registers in real-time, and log audited manual exceptions. Administrators inspect system overviews, process dispute queues, and review immutable audit ledgers.
- **Shared Relational Backend & Server:** PostgreSQL schema with Row-Level Security (RLS), atomic stored procedures (`verify_and_commit_attendance`), unique `(student_id, session_id)` constraints, tamper-evident audit logs, and real-time Server-Sent Events (SSE) synchronization.

---

## 2. Monorepo Repository Structure

```text
truemuster/
├── apps/
│   ├── student-android/          # Student Mobile Web/Capacitor App (Vite + React + TS)
│   ├── admin-windows/            # Teacher & Admin Windows App (Vite + React + TS)
│   └── backend/                  # Authoritative Attendance Backend Server (Node.js + SSE)
├── packages/
│   ├── domain-contracts/         # Shared DTOs, interfaces, Supabase client, and reactive store
│   └── design-tokens/            # Canonical design tokens (colors, typography, spacing)
├── supabase/
│   ├── migrations/               # PostgreSQL DDL migrations & atomic SQL functions
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_row_level_security.sql
│   │   └── truemuster_all_in_one.sql # Consolidated all-in-one schema, RLS, functions & seed
│   ├── functions/                # Deno Edge Functions (checkin, challenge, adjust)
│   └── seed.sql                  # Synthetic baseline seed fixtures
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

### Install Dependencies
```bash
npm install
```

### Run Typecheck Across All Workspaces
```bash
npm run typecheck
```

### Run Vitest Automated Test Suite (14 Tests)
```bash
npm test
```

### Build Production Bundles
```bash
npm run build
```

### Start Development Applications
```bash
# Student Mobile App (HTTP on Port 5173)
npm run dev:student

# Student Mobile App with HTTPS (Unlocks Mobile Camera & WebAuthn Biometrics on LAN IP)
npm run dev:student:https

# Admin / Teacher Windows App (Port 5174)
npm run dev:admin

# Shared Backend Server (Port 5175)
node apps/backend/server.js
```

---

## 5. Live Network Endpoints & Multi-Device Access

- **Student Mobile App:** `http://<LAN_IP>:5173` or `https://<LAN_IP>:5173` (Local: `http://localhost:5173`)
- **Teacher Desktop App:** `http://<LAN_IP>:5174` (Local: `http://localhost:5174`)
- **Shared API / SSE Gateway:** `http://<LAN_IP>:5175/api` (proxied by ports 5173 and 5174 under `/api/*`)

> **Mobile Camera & Biometrics Access Tip:**
> Modern mobile browsers (Chrome on Android, Safari on iOS) require a **Secure Context** (HTTPS or localhost) to access `navigator.mediaDevices.getUserMedia` and `navigator.credentials` (Fingerprint / Face ID).
> Run `npm run dev:student:https` to serve over HTTPS, visit `https://<LAN_IP>:5173` on your phone, accept the development certificate, and both the physical camera and biometric sensors will activate natively!

---

## 6. Supabase Development Integration (`truemuster-dev`)

### Project Configuration
- **Project Name:** `truemuster-dev`
- **Project URL:** `https://tqtsfdmmlaacsvzxbkil.supabase.co`
- **Publishable Key:** `sb_publishable_g-I7ylJTuKMiz9HyqTBRKQ_i87hHNzd`

### Applying the Database Migration
All tables, Haversine functions, atomic attendance committal procedures, RLS policies, and synthetic seed data have been consolidated into:
[`supabase/migrations/truemuster_all_in_one.sql`](file:///Users/mohammedruhanmemon/.gemini/antigravity-ide/scratch/truemuster/supabase/migrations/truemuster_all_in_one.sql)

1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/tqtsfdmmlaacsvzxbkil/sql](https://supabase.com/dashboard/project/tqtsfdmmlaacsvzxbkil/sql)
2. Create a "New Query".
3. Copy and paste the contents of `supabase/migrations/truemuster_all_in_one.sql`.
4. Click **Run**.
5. Once completed, all tables (`profiles`, `students`, `teachers`, `classroom_locations`, `attendance_records`, `audit_logs`, etc.) are fully indexed, secured with RLS, and populated with baseline test data.

---

## 7. Security & Privacy Guarantees

1. **Zero Privileged Secrets in Clients:** Mobile and desktop apps only access public APIs with the publishable key. Never place `service_role` secrets in client code or source control.
2. **Server-Authoritative Clock:** The 90-second QR challenge validity and the 45-second check-in attempt deadline are enforced strictly by the backend server, never trusting device wall clocks.
3. **Biometric Privacy & Hardware Keystore:** `BiometricPrompt` and WebAuthn authenticate only local device unlock via the phone's hardware TEE/StrongBox; no raw biometric samples leave the hardware device.
4. **Row-Level Security Enforcement:** Students can only read their own profiles, device bindings, and attendance history. Students cannot directly insert or modify attendance records—all commits are mediated through the atomic `verify_and_commit_attendance` procedure.

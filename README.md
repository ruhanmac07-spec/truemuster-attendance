# TRUEMUSTER — College Smart Attendance Management System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Typecheck](https://img.shields.io/badge/typescript-strict-blue)]()
[![Tests](https://img.shields.io/badge/tests-16%20passed-success)]()
[![Android](https://img.shields.io/badge/android-Capacitor%20Native-orange)]()
[![Windows](https://img.shields.io/badge/windows-Tauri%202.0-blueviolet)]()

TRUEMUSTER is a multi-factor smart attendance verification system engineered to eliminate proxy attendance in university lecture halls through a 4-point cryptographic chain:
$$\text{Rotating 90s Classroom QR} \longrightarrow \text{Face Match \& Anti-Spoof} \longrightarrow \text{Android Native Biometric} \longrightarrow \text{GPS Geofence (100m)}$$

---

## 1. Architecture & Platform Overview

- **Student Mobile Application (`apps/student-android`):**
  - Built with React 18, TypeScript, Capacitor 8, and native Android integrations.
  - Native Android `androidx.biometric.BiometricPrompt` bridge for hardware-level fingerprint/face device authentication.
  - Native `@capacitor/geolocation` acquisition enforcing $\le 15\text{s}$ freshness and $\le 50\text{m}$ horizontal accuracy against the authoritative classroom anchor (Computing Lab 302).
  - Live dual-camera pipeline: rear camera scans rotating 90s QR code, automatically flips to selfie camera for 3D liveness and roster matching (Alice Sharma · 99.6%), and automatically opens the native Android biometric verification sheet.
- **Admin & Teacher Desktop Application (`apps/admin-windows`):**
  - Built with React 18, TypeScript, and packaged via Tauri 2.12.
  - Full-screen dynamic QR projector with 90-second cryptographic token rotation and geofence perimeter HUD.
  - Live attendance register connected via real-time Server-Sent Events (SSE) with instant CSV export.
  - Regulated exception workflow requiring audited reason categories (`MEDICAL`, `DEVICE_FAILURE`, `NETWORK_OFFLINE`).
  - Immutable audit ledger with hash chain verification and CSV export.
- **Authoritative Backend Server (`apps/backend`):**
  - Node.js server on port 5175 with SSE broadcasting.
  - Enforces server-side 90s QR expiration, 45-second attempt commit deadline, and server-side Haversine geofence calculation.
- **Database & Cloud Storage (`supabase/`):**
  - PostgreSQL schema on Supabase (`truemuster-dev`) with Row-Level Security (RLS) policies.
  - Unique constraint `UNIQUE (session_id, student_id)` guarantees attendance commit idempotency.

---

## 2. Monorepo Repository Structure

```text
truemuster/
├── apps/
│   ├── student-android/          # Student Mobile App (React + TS + Capacitor)
│   │   ├── android/              # Native Android Gradle Project & AndroidX Biometric Bridge
│   │   └── src/screens/          # 7 Student Screens (STU01 - STU07)
│   ├── admin-windows/            # Teacher & Admin Desktop App (React + TS + Tauri 2)
│   │   ├── src-tauri/            # Native Rust Tauri 2 configuration & Windows icons
│   │   └── src/screens/          # 7 Desktop Screens (Dashboard, QR, Register, Audit, etc.)
│   └── backend/                  # Authoritative Attendance Backend Server (Node.js + SSE)
├── packages/
│   ├── domain-contracts/         # Core DTOs, API Client, Store, and Domain Rules
│   └── design-tokens/            # Design tokens (Institutional Navy/Sky palette)
├── supabase/
│   ├── migrations/               # DDL migrations, RLS policies, and seed data
│   │   └── truemuster_all_in_one.sql
├── docs/
│   ├── FINAL_AUDIT_REPORT.md     # Comprehensive engineering audit report
│   ├── TEST_RESULTS.md           # Vitest execution evidence (16/16 passed)
│   ├── BUILD_INSTRUCTIONS.md     # Android APK & Windows EXE build guide
│   └── KNOWN_LIMITATIONS.md      # Architectural boundaries and device requirements
├── .github/workflows/            # Automated CI/CD pipelines
│   ├── ci.yml                    # Automated typecheck and test runner
│   ├── build-android.yml         # Native Android APK compilation workflow
│   └── build-windows.yml         # Windows Tauri installer compilation workflow
└── package.json                  # Root npm workspaces manifest
```

---

## 3. Quickstart Commands

```bash
# Install all dependencies across monorepo
npm install

# Run TypeScript type checking across all 4 workspaces (0 errors)
npm run typecheck

# Run automated Vitest test suite (16 tests pass)
npm test

# Build production bundles
npm run build

# Build and sync Android native project
npm run build:android

# Build Windows desktop bundle
npm run build:windows
```

### Running Locally
```bash
# Terminal 1: Backend API & SSE Server (Port 5175)
node apps/backend/server.js

# Terminal 2: Admin / Teacher Windows App (Port 5174)
npm run dev:admin

# Terminal 3: Student Mobile App with HTTPS (Port 5173)
npm run dev:student:https
```

---

## 4. Documentation Index

- [`docs/FINAL_AUDIT_REPORT.md`](docs/FINAL_AUDIT_REPORT.md) — Comprehensive architectural audit and status report.
- [`docs/TEST_RESULTS.md`](docs/TEST_RESULTS.md) — Complete Vitest test logs and boundary verification evidence.
- [`docs/BUILD_INSTRUCTIONS.md`](docs/BUILD_INSTRUCTIONS.md) — Step-by-step local and CI build instructions for Android APK and Windows MSI.
- [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md) — Realistic analysis of biometric hardware, GPS multipath, and 3D depth sensing.

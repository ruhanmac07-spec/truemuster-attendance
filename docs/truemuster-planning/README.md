# TRUEMUSTER

TRUEMUSTER is a planned college attendance management platform comprising a Student Android application, a Windows Admin/Teacher application and a shared Supabase backend.

> **Important status note:** this planning pack is not proof that the application has been initialized, built, tested or approved for real student data. Antigravity must update this README after auditing the actual repository and verifying commands/build output. Never present placeholder or untested commands as verified.

## Selected v1 architecture

- Student Android: React + TypeScript + Vite inside a Capacitor Android shell, with native Android integrations where required.
- Admin/Teacher Windows: React + TypeScript + Vite packaged with Tauri 2.
- Backend: Supabase Auth, PostgreSQL, Row Level Security, Edge Functions, and database-side atomic operations.
- Device security: Android Keystore-bound device key plus AndroidX `BiometricPrompt` and permitted secure device credential fallback.
- Face recognition/liveness and offline attendance: future scope only; no face data is collected in v1.
- Attendance: backend-confirmed commit is authoritative. UI animations and local state never constitute confirmation.

The finalized requirements baseline selects Capacitor for Android; do not change to React Native without an approved architecture decision.

## Documentation map

- [`PLAN.md`](./PLAN.md) — phases and release gates.
- [`PRD.md`](./PRD.md) — requirements and feature scope.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — system boundaries and technical stack.
- [`ANDROID_UI_IMPLEMENTATION_AND_MOTION.md`](./ANDROID_UI_IMPLEMENTATION_AND_MOTION.md) — Stitch-to-code map, components and animation rules.
- [`SUPABASE_BACKEND_AND_DATABASE.md`](./SUPABASE_BACKEND_AND_DATABASE.md) — database, RLS, API and key handling.
- [`SECURITY_PRIVACY_AND_FUTURE_LIVENESS.md`](./SECURITY_PRIVACY_AND_FUTURE_LIVENESS.md) — v1 security and future-only biometric extension.
- [`TESTING_AND_ACCEPTANCE.md`](./TESTING_AND_ACCEPTANCE.md) — required evidence and test cases.
- [`DECISIONS_AND_OPEN_QUESTIONS.md`](./DECISIONS_AND_OPEN_QUESTIONS.md) — locked decisions and owner/organizer questions.
- [`ANTIGRAVITY_MASTER_PROMPT.md`](./ANTIGRAVITY_MASTER_PROMPT.md) — agent instructions for Phase 0.
- [`source_docs/`](./source_docs/) — supplied Android/Windows UX/design docs and source baseline PDFs.

## Status

- [ ] Workspace/repository audited
- [ ] Actual Stitch project and screen IDs recorded
- [ ] Architecture reconciliation reported
- [ ] Root README updated with verified prerequisites/commands
- [ ] Phase 1 design-token/component build verified
- [ ] Development Supabase project configured
- [ ] RLS/database tests pass
- [ ] Android/Windows build evidence attached
- [ ] Device/authorization/performance tests completed
- [ ] Pilot approvals, backup/restore and rollback completed

## Environment setup and commands

**Do not rely on these being populated until the project scaffold exists.** Antigravity must replace this section with exact, verified commands from the actual repository, including:

- required runtime/toolchain versions;
- package-manager install command;
- start/dev commands per app;
- lint, format, typecheck, unit/integration test commands;
- Android Capacitor sync/build/run commands;
- Windows Tauri dev/build/package commands;
- Supabase local/migration/function test/deploy commands;
- environment variable names and safe setup instructions;
- troubleshooting for common native build blockers.

Commands should be run and verified before this README claims they succeed. Avoid storing secret values in this file.

## Secrets and data safety

- `.env.example` contains variable names only.
- Keep `.env*` (except `.env.example`), private keys, signing files, database credentials and Supabase secret/service-role keys out of Git.
- A Supabase publishable key may be used in the app only with correct RLS and least-privilege grants. Never ship a secret/service-role key.
- Use synthetic data in development. No live student PII or biometric data in a personal/dev environment.
- Do not use actual campus coordinates until verified and approved.

## First action

Run `ANTIGRAVITY_MASTER_PROMPT.md` in Antigravity and authorize **Phase 0 only**: inspect the workspace, validate source documents and Stitch references, update this README based on reality, and return a blocker/readiness report. No large-scale code generation or destructive changes before review.

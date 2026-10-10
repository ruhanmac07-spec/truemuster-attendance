# TRUEMUSTER — Supabase Backend, Database and API Plan

**Version:** 1.0 · **Date:** 10 October 2026  
**Scope:** Supabase Auth, PostgreSQL, RLS, Edge Functions, database-side atomic operations and environment/key management for prototype v1.0.

## 1. When Supabase keys are needed

Creating these planning documents, auditing a repository, creating a local UI shell, or rendering screens with synthetic data does **not** require a Supabase API key.

A development Supabase project is needed when the team begins real authentication/database/backend integration. At that point the owner should:

1. create or select a separate development project (not production);
2. choose a region after checking current availability, institutional constraints and budget;
3. supply the Project URL and **publishable key** to the approved local client environment;
4. configure any server secrets through Supabase's secret management/dashboard or CLI, never by placing them in a client or committing them.

Current Supabase keys may use `sb_publishable_...` and `sb_secret_...` formats; older projects may use `anon` and `service_role`. Follow the current dashboard/docs. A publishable key can ship with the client only when table grants and RLS correctly constrain access. A secret/service-role key bypasses RLS and must remain in trusted backend-only code/secret storage.

Keep the key out of chat, screenshots, commits and documentation. Antigravity must never request a secret key for a client-side setup. If a real service key is needed for a migration/deployment task, use an approved backend secret mechanism and ask the owner to enter it directly.

## 2. Selected service layout

- **Supabase Auth:** account/session identity.
- **PostgreSQL:** authoritative records, relational constraints and audit metadata.
- **RLS + minimal grants:** protect direct data access for authenticated roles and resources.
- **Edge Functions:** authenticate requests, validate shape/rate limits and coordinate sensitive use cases.
- **Database functions/transactions:** enforce atomic constraints and sensitive multi-step commit decisions. Do not assume two separate REST requests form one transaction.
- **Supabase Storage:** only for approved non-biometric files needed by v1; no face reference images in v1.
- **Migrations-as-code:** SQL migrations in source control. Clean database can be recreated from migrations and seed scripts.

Do not introduce MongoDB or a long-running Node.js server as a second backend by default. Edge Functions can be used for v1 based on current baseline. If a required native SDK, transaction strategy, queue/worker or vendor integration cannot reasonably fit this architecture, write an ADR (architecture decision record) with trade-offs and request approval before introducing another service.

## 3. Database entity inventory

Exact table/column names should be generated from one reviewed schema. Proposed entities:

| Entity | Purpose / mandatory considerations |
|---|---|
| `profiles` or `app_users` | Maps Supabase Auth UID to approved app role and status; never trust a client-supplied role. |
| `students` | Authoritative enrollment ID, institutional email and academic/eligibility link; unique enrollment ID. Minimize personal fields. |
| `teachers` | Teacher identity/status. |
| `courses_sections` | Academic course/section and term. |
| `teacher_assignments` | Teacher-to-section assignment, required for session and attendance scope. |
| `rooms_locations` | Admin-approved classroom/campus anchor, source/accuracy/provenance, validity/version and audit. Never seed invented campus coordinates. |
| `registered_devices` | Student, device key ID, public key, active/revoked status, created/revoked timestamps; enforce one active binding/student. Do not store private keys. |
| `attendance_sessions` | Assigned class, schedule, open/close/finalization state, anchor reference/snapshot, teacher and timestamps. |
| `qr_challenges` | Session, unpredictable opaque challenge ID/token hash as appropriate, issued/expiry server times, status/consumed state. No student PII. |
| `checkin_attempts` | Student/session/challenge/device refs, server start/deadline, state, idempotency key and outcome metadata. |
| `attendance_records` | Authoritative committed status/time, unique student/session key, source/attempt reference. |
| `manual_adjustments` | Previous/new status, reason category/note, actor, created time, approval and notification state. Append-oriented. |
| `verification_attempts` | Minimal results/reason codes and timings. No raw keys/tokens or unnecessary location values. |
| `audit_logs` | Privileged/admin/device/manual action metadata, restricted read, append-oriented. |
| `retention_jobs` | Scheduled deletion/anonymization job definition and minimal execution result. Do not log deleted content. |

Use foreign keys, checks, unique indexes, not-null constraints and transaction-level locking as appropriate. Design based on invariants, not UI forms alone.

## 4. Mandatory database/backend invariants

1. One active registered device per student, enforced in the database/transaction boundary.
2. One committed attendance row per `(student_id, session_id)`, enforced with a unique constraint.
3. Only one current/unconsumed QR challenge for a session can start a new attempt; older/replayed challenges are rejected for new attempts.
4. The server/database clock is authoritative for QR expiry, attempt deadline, schedule windows and finalization windows.
5. An accepted attempt stores immutable `started_at` and `deadline_at = started_at + 45 seconds` according to server time.
6. Starting a check-in attempt is atomic with validating that the QR challenge is eligible to start an attempt.
7. Final attendance verification and unique attendance insert are atomic; no partial `PRESENT` record if any required policy check fails.
8. A client cannot supply `role=admin`, arbitrary teacher assignment, official campus anchor, trusted server timestamp or authoritative distance result.
9. All privileged attendance adjustments record a required reason and a durable audit event.
10. The server's result is idempotent; retries return/resolve the same accepted attempt or attendance record where appropriate.
11. Server timestamps are UTC. UI renders approved campus-local time.
12. Student reads are self-only; Teachers are limited to assigned sections; Admin scope is explicit and audited.

## 5. Proposed API/use-case contract surface

Use versioned, typed DTOs. Function/route names are proposed and may adapt to existing patterns, but the semantic boundaries are required.

| Use case | Called by | Expected behavior |
|---|---|---|
| `GET /me` or equivalent | All signed-in roles | Returns authenticated user, role/status and permitted minimal profile. Role is derived server-side. |
| `POST /student/enrollment/verify` | Student | Validates roster match and approved email OTP/SSO outcome; never activates based solely on typed strings. |
| `POST /student/device/register` | Student | Accepts public key and server challenge proof; enforces one active binding. Private key never leaves device. |
| `POST /student/device/recovery-request` | Student | Creates a pending request; cannot activate a replacement by itself. |
| `POST /teacher/sessions` | Assigned Teacher | Validates assignment, class schedule, approved anchor and session window; returns session state. |
| `POST /teacher/sessions/{id}/qr-challenge` or managed rotation | Teacher/worker | Issues a high-entropy opaque challenge; only one active challenge/session; 90-sec expiry. |
| `POST /attendance/check-in/start` | Student | Validates QR challenge, session, roster eligibility, device status, duplicate state and expiry. Atomically creates/returns attempt and server start/deadline. Only successful acceptance starts 45-sec deadline. |
| `POST /attendance/check-in/{attemptId}/submit` | Student | Verifies active challenge signature, fresh/accurate location, permitted attempt deadline, session/role and uniqueness; transactionally creates record or returns actual failure state. |
| `GET /attendance/check-in/{attemptId}` | Student | Resolves known/unknown attempt status and record after timeout. Does not create a duplicate. |
| `GET /student/attendance` | Student | Returns own attendance/history only. |
| `POST /attendance/{recordId}/correction-request` | Student, if supported | Opens a request; does not mutate the record. |
| `POST /teacher/attendance/{recordId}/adjust` | Assigned Teacher | Enforces time window, valid actor/section and required reason; records an adjustment event. |
| `POST /admin/attendance/{recordId}/adjust` | Authorized Admin | Enforces approval/time policy and audit rules. |
| `GET /admin/audit` | Authorized Admin | Returns only permitted audit fields; no raw secrets/tokens. |

The final endpoints and fields must be documented in an API schema/OpenAPI or TypeScript contract before both clients are integrated. Do not let the two apps independently invent enums or request shapes.

## 6. Response state design

Keep attempt transport state separate from final attendance status. Suggested attempt status vocabulary:

- `QR_REJECTED` — invalid, expired, replayed or ineligible QR; no accepted attempt timer started.
- `ATTEMPT_ACCEPTED` — server accepted the QR and created/resolved a unique attempt; includes attempt ID and authoritative start/deadline.
- `LOCATION_PENDING`, `AUTH_PENDING`, `EVIDENCE_SUBMITTED` — intermediate client/UI orchestration states; not necessarily durable attendance statuses unless API says so.
- `CONFIRMED` — committed attendance record returned/verified by server.
- `RETRYABLE_FAILURE` — actual policy allows retry.
- `REJECTED` — actual definitive rejection reason.
- `EXPIRED` — QR start window or accepted attempt deadline expired as applicable; include subtype/reason.
- `NEEDS_REVIEW` — policy routes for human review.
- `UNKNOWN_RECONCILING` — client doesn't know whether write completed; query attempt before retry.

Suggested attendance record source/status values should be separately typed. Do not map unknown values to success; if a newer server sends an unrecognized status, display a safe non-confirmed state and report a contract mismatch.

## 7. Edge Functions and database transactions

Edge Functions should:
- authenticate the caller or explicitly specify any webhook/public mode;
- validate method, schema, size, enum and identifier formats;
- derive identity/role from the authenticated context;
- enforce rate limits / abuse controls where applicable;
- use a caller-scoped client for ordinary data access and minimize privileged `service_role` operations;
- call constrained SQL/database functions for atomic invariants where a single transaction is required;
- return minimal information and stable reason codes;
- never log keys, bearer tokens, raw QR values, full GPS coordinates or biometric data;
- catch errors and return request/correlation IDs without leaking internals.

Database functions using elevated privileges must have explicit grants, a fixed safe `search_path`, validated parameters and direct permission tests. Review `SECURITY DEFINER` functions carefully; do not apply it by habit. Edge Function authentication modes and RLS interactions should be tested against the current Supabase version.

## 8. RLS and authorization test matrix

At a minimum, create automated SQL/API tests with positive and negative cases:

| Caller | Resource | Expected |
|---|---|---|
| Student A | Student A profile/history | Allow minimum permitted fields. |
| Student A | Student B profile/history | Deny/no leakage. |
| Student | Direct insert/update attendance record | Deny; attendance writes go through approved server workflow. |
| Teacher A | Assigned section/session/register | Allow assigned capabilities. |
| Teacher A | Unassigned section/session/register | Deny even if request ID/body is manipulated. |
| Teacher | Change global role/room anchor/policy | Deny. |
| Admin without relevant privilege | Restricted audit/device recovery | Deny. |
| Revoked/suspended user/device | Start or submit check-in | Reject. |
| Client without valid JWT | Protected function/resource | Deny. |
| Client with publishable key but no user auth | Protected data | Deny by RLS/authorization. |

UI-level tests are not an adequate substitute for database/API tests.

## 9. Development, staging and production

- Maintain separate projects/environments. `dev` uses synthetic students/courses/sessions; staging uses synthetic or specifically approved pilot test data; production only after institutional readiness approval.
- Record Project IDs and region choices in a private deployment document, not in this public project README if the team wants to keep internal config private. The publishable key can be in client environment configuration but should still not be unnecessarily posted.
- Keep `.env`, local config with secrets, keystore/Android signing files, database credentials and service keys out of Git.
- Include `.env.example` with safe variable names, e.g. `VITE_SUPABASE_URL=`, `VITE_SUPABASE_PUBLISHABLE_KEY=`. Do not fill it with live values.
- Check the exact environment variable names at build time and ensure Vite only exposes variables explicitly prefixed as intended; never put a secret behind a `VITE_` prefix.
- Store privileged Edge Function secrets using current Supabase secret management; deploy/test them separately.
- Migrations, grants, RLS policies, edge functions and seeds must be reproducible from a clean dev project.

## 10. Monitoring, backups and retention

Before a live pilot, use an approved managed backup plan with automated daily database backups or equivalent, plus a weekly encrypted independent logical export outside the repository retained 30 days. Rehearse restore into non-production before launch and monthly during pilot. Verify relationships, constraints and row counts, not only that a dashboard says “backup succeeded.” Re-check current Supabase plan/retention terms before setting a budget.

Monitor API latency/error rates, function/database failures, QR invalid/expired/replayed attempts, duplicate rejections, location issues, device-signature failures, manual override rates, privileged policy/device changes and backup/export success. During the first two pilot weeks, assign an owner to review these daily.

Run scheduled data retention/deletion jobs only after the institution approves retention periods. Do not retain unnecessary exact coordinates after the stated policy window. Log job result and counts, not deleted data.

# TRUEMUSTER — Master Delivery Plan

**Document status:** Planning baseline for Antigravity; code implementation has not been verified by this document.  
**Planning version:** 1.0  
**Date:** 10 October 2026  
**Authority:** `PRD.md`, `ARCHITECTURE.md`, `DECISIONS_AND_OPEN_QUESTIONS.md`, and the supplied finalized v1.1 requirements baseline.

## 1. Outcome

Deliver one attendance platform with three role experiences across two clients:

- **Student Android app:** authenticates a roster-approved student, binds one registered Android device, starts a check-in from a valid session QR, performs fresh location and OS-authentication checks, and shows the committed outcome.
- **Admin/Teacher Windows app:** administration configures institutional roster and policy; teachers run assigned class sessions, display rotating QR challenges, monitor attendance, and resolve genuine exceptions through audited workflows.
- **Shared backend:** Supabase Auth, PostgreSQL, Row Level Security (RLS), Edge Functions and database-side atomic operations. Both clients use the same authoritative attendance records.

Primary product promise: **one authoritative attendance record per student per class session; no success UI before a durable server-confirmed commit; every exception attributable.**

## 2. Source-of-truth and conflict rules

1. The file `College_Attendance_System_Prototype_Requirements_v1.1_FINALIZED_BASELINE.pdf` is the locked functional-policy baseline for prototype v1.0.
2. The Android visual system is defined in `source_docs/android/TRUEMUSTER_Android_DESIGN_SYSTEM.md`; Android journeys/screens are defined in `source_docs/android/TRUEMUSTER_STUDENTAPP_UX.md`.
3. Windows visual and UX references are in `source_docs/windows/`.
4. `PRD.md`, `ARCHITECTURE.md`, and the remaining planning files clarify how to implement the baseline; they must not silently loosen its attendance or security rules.
5. The older `Campus_Attendance_Integrity_System_Blueprint_v1.0.pdf` is useful context. Where it conflicts with the finalized v1.1 baseline, **v1.1 wins**. In particular, v1.1 selects Capacitor/native Android (not React Native), Supabase Edge Functions/database operations, and no facial verification or offline attendance in v1.0.
6. Organizer-listed technologies (MongoDB, Node.js, Python, OpenCV, React Native, face recognition) are not automatically mandatory just because they are listed. Confirm whether the organizer requires specific technologies. Until confirmed, do not replace PostgreSQL or add duplicate infrastructure solely to match a list.
7. If the actual repository already has working code or a different dependency version, inspect it and report a proposed reconciliation before overwriting or migrating anything.

## 3. Locked v1.0 product defaults

- Android baseline: Android 10 / API 29 or newer.
- Desktop baseline: signed Windows 11 x64 executable; Windows 10 only for internal compatibility checks unless requirements are revised.
- Student uses one active registered Android device. Replacement requires authorized recovery and revocation of the old device binding.
- QR challenge validity: 90 seconds, determined by server time; one active challenge per session; issue a new challenge every 90 seconds while the session is open.
- Check-in completion deadline: 45 seconds from backend acceptance of a valid QR and creation of the check-in attempt. Camera opening/local QR detection does not start this timer. An in-flight valid attempt retains its deadline if the displayed QR rotates.
- Student location: no older than 15 seconds, reported accuracy no worse than 50 metres, within 100 metres of the active approved session anchor and within the configured approved campus area. Actual classroom anchors must be verified on site.
- Normal session window: can open up to 10 minutes before scheduled start; check-in closes at scheduled class end. Teacher extension up to 15 minutes after scheduled end requires a recorded reason and audit event.
- Device proof: Android Keystore key pair where supported; backend verifies a signed, short-lived server challenge. Prefer hardware-backed keys when available. `BiometricPrompt` with strong biometric preferred and secure device credential fallback permitted.
- Attendance finalizes 24 hours after scheduled session end. Teacher adjustments are permitted up to 24 hours after end; Admin-only corrections until 7 calendar days after end; beyond 7 days requires exceptional written justification and a second authorized approver.
- Online-first only. No offline-confirmed attendance in v1.0.
- Facial recognition, face capture, face templates/embeddings and liveness capture are out of v1.0 scope.
- Store only necessary location and verification metadata; proposed retention defaults are listed in `PRD.md` and must be institutionally reviewed before a live pilot.

## 4. Delivery phases and gates

### Phase 0 — Repository and requirements alignment
**Goal:** establish the actual workspace state and freeze a coherent working plan.

Tasks:
- Inspect repository, Git status, branches, installed dependencies, build scripts, current app code and available Stitch MCP/design references.
- Read all supplied source documents; verify that the intended student screens are available as real Stitch screen IDs, exportable assets or supplied screenshots.
- Create or update `README.md` using verified repository facts.
- Create/update the planning documents in this pack, keeping references and version numbers consistent.
- Produce a discrepancy report, dependency/version proposal, target folder tree, key risks and decisions requiring the owner's input.

**Gate:** do not install a new framework, rewrite an existing app, create a production database, or delete/overwrite files before reporting findings.

### Phase 1 — Project foundation, design tokens, component library and motion foundation
**Goal:** initialize or align the codebase with the approved stack and make the UI foundation compile.

Tasks:
- Use React + TypeScript + Vite for the UI surface.
- Use Capacitor for the Android application shell and Tauri 2 for the Windows application shell, preserving separate platform capabilities.
- Prefer an npm-workspaces monorepo unless the inspected repository already has a clear, viable structure; avoid a repository migration without approval.
- Centralize design tokens: colour, typography, spacing, radii, borders, elevations, semantic states, motion and reduced-motion behaviour.
- Build reusable, accessible primitives and layout patterns without inventing new screen designs.
- Implement animation helpers and state transitions specified in `ANDROID_UI_IMPLEMENTATION_AND_MOTION.md`.
- Add linting, formatting, type-check/build scripts and basic tests appropriate to the actual scaffold.
- Add `.env.example` with variable names only; add `.env*` to `.gitignore` without ignoring `.env.example`.
- Build a static/demo shell using clearly labelled synthetic data. No fake server-confirmed attendance.

**Gate:** app shell builds on the selected target; design tokens are centralized; core component tests and reduced-motion behavior pass; design mapping report identifies every approved screen and unsupported asset.

### Phase 2 — Supabase development environment and domain schema
**Goal:** establish a non-production backend and the security model before real UI integration.

Tasks:
- Owner creates/selects a development Supabase project and selects a region after checking availability and institutional constraints.
- Configure Project URL and publishable key for client development only when needed. Do not request or place a secret/service-role key in a client.
- Commit SQL migrations, table constraints, indexes, initial roles/policies, test fixtures and generated API types where appropriate.
- Define roster import/activation, account verification, session, QR challenge, attempt, attendance, device, manual adjustment, audit and retention entities.
- Implement and directly test RLS policies for student-self, teacher-assigned-resource and restricted-admin access.
- Put sensitive multi-step checks/atomic writes behind secured Edge Functions and/or narrowly granted database functions with explicit transaction boundaries.

**Gate:** schema re-applies from migrations into a clean dev database; RLS tests pass for allow and deny cases; no privileged key in clients or Git; synthetic data only.

### Phase 3 — Authentication, roster and role-based access
**Goal:** make identity and permissions real before enabling check-in.

Tasks:
- Admin roster/identity model and college email verification flow.
- Supabase Auth session handling and account eligibility checks.
- Enforce backend role/assignment/resource scope; UI hiding is not authorization.
- Device enrollment/recovery contracts and audit path.

**Gate:** negative authorization tests prove a student cannot access another student, a teacher cannot access an unassigned section, and a suspended/revoked account/device is rejected.

### Phase 4 — Windows Admin/Teacher application
**Goal:** implement approved desktop designs and operational flows.

Tasks:
- Implement the Windows app in the dedicated Tauri 2 target using the Windows Stitch portfolio/specification.
- Complete sign-in, role-specific navigation, teacher timetable/session setup, QR display/rotation, live attendance, manual adjustment, roster/academic structure, room anchors, correction queue, reports and audit views according to role authorization.
- Use admin-configured classroom anchors if Windows Location Services has no reliable location; do not invent coordinates.
- Configure Tauri capabilities minimally; only expose platform commands required by a given window.
- Package and test for Windows 11 x64; verify signing/distribution plan before production.

**Gate:** role-based journeys work with backend fixtures; QR display is server-challenge-backed; all manual changes are reason-required and audited; desktop build succeeds.

### Phase 5 — Android native foundation and student screens
**Goal:** convert the six designed student screens into a working, accessible Capacitor Android app.

Tasks:
- Implement app navigation, theme, component library, onboarding/authentication, device binding education, home, scanner, outcome ticket, and history/help flows against actual designs.
- Implement contextual permissions and native lifecycle/background/error handling.
- Build only the native integrations needed for camera scanning, location and AndroidX `BiometricPrompt`/Keystore. Use vetted compatible plugins where adequate; create a small typed local Capacitor plugin when necessary.
- Do not add face capture or liveness SDKs.

**Gate:** Android build succeeds; UI states are mapped to actual API statuses; permission denied/cancelled/back-navigation/lifecycle states do not break the app; a real device test matrix is recorded.

### Phase 6 — Secure attendance check-in end to end
**Goal:** deliver authoritative, replay-resistant attendance.

Tasks:
- Implement server-issued opaque high-entropy QR challenges, server-time expiry and 90-second rotation.
- QR acceptance creates a unique check-in attempt and starts the separate 45-second deadline.
- Collect fresh location evidence, run approved Android OS authentication and sign the server challenge using the registered device key.
- Validate session/roster/device/QR/deadline/location/authorization/duplicate conditions in server-side policy and atomic database operations.
- Use idempotency and attempt reconciliation after timeouts; unknown outcomes are queried before retrying.
- Confirm attendance in UI only after a committed record is returned/verified.

**Gate:** replay, expiry, concurrency, duplicate, timeout-after-commit, revoked-device, stale-location and invalid-signature tests pass.

### Phase 7 — Exceptions, finalization, history and operations
**Goal:** finish non-happy paths and maintain integrity.

Tasks:
- Reason-required teacher manual attendance/correction workflow.
- 24-hour finalization, Admin correction window through day 7 and exceptional dual-approval path after day 7.
- Append-oriented audit trails, student correction requests where supported, export controls, retention jobs and monitoring.
- Daily backup verification policy for the real pilot, weekly encrypted independent export, restore rehearsal to a non-production project.

**Gate:** manual edits preserve original status and add a new audited event; finalization restrictions are tested; restore drill verified.

### Phase 8 — Security, accessibility, performance and pilot readiness

- Test supported physical Android phones and actual classroom GPS/Wi-Fi conditions.
- Record scan-to-confirm median and p95, camera start/scan latency, GPS accuracy/failure rate, native auth success/cancel behavior and backend latency.
- Validate accessibility, larger text, screen reader labels, reduced motion, outdoor contrast, offline/network-loss recovery and keyboard/insets.
- Complete institutionally approved privacy notice, data-retention decisions, support contact, incident/rollback and manual attendance procedure.
- Start with synthetic data, then an approved volunteer test, then a limited class/section pilot. No production student data in a developer sandbox.

**Gate:** zero unresolved critical/high security defects for the intended pilot, a verified restore rehearsal, approved policy/notice, and a documented rollback/manual fallback.

### Future Phase 9 — Face identity/liveness and offline modes
Separate approval, threat model, legal/privacy review, vendor/model/license review, actual device study, false-accept/false-reject/spoof metrics, retention/deletion tests and fallback route are required. See `SECURITY_PRIVACY_AND_FUTURE_LIVENESS.md`. No face functionality is to be implemented in v1.0.

Offline LAN and device-local queued attendance remain separate future phases as defined in the finalized baseline.

## 5. Required project artifacts

- `README.md` — verified setup, stack, commands, environment setup, architecture links, security warnings and status.
- `PLAN.md` — this phased execution plan.
- `PRD.md` — product goals, scope, roles, workflows, constraints and acceptance.
- `ARCHITECTURE.md` — selected stack, platform boundaries, repository structure and component contracts.
- `ANDROID_UI_IMPLEMENTATION_AND_MOTION.md` — Stitch-to-code mapping, components, animation and state rules.
- `SUPABASE_BACKEND_AND_DATABASE.md` — schema, RLS, functions, keys and backend contracts.
- `SECURITY_PRIVACY_AND_FUTURE_LIVENESS.md` — security/privacy baseline and the strict future-only biometric extension hook.
- `TESTING_AND_ACCEPTANCE.md` — automated, adversarial, device and release tests.
- `DECISIONS_AND_OPEN_QUESTIONS.md` — selected decisions and genuine blockers.
- `ANTIGRAVITY_MASTER_PROMPT.md` — staged instructions for agent execution.
- Source UX/design documents and finalized v1.1 baseline retained under `source_docs/` or the corresponding `docs/` path in the repo.

## 6. Working rules for Antigravity

1. Inspect before editing; report before destructive changes.
2. Execute one phase at a time, with a report and gate check between phases.
3. Never claim an install, test, build, device test, security property or performance threshold passed unless command output or test evidence supports it.
4. Keep mocks and synthetic data visually distinct from real backend results.
5. Do not invent screens or replace existing Stitch screens; list any missing references and ask for exports/IDs.
6. Do not put secret/service-role/database/signing keys in app bundles, source control or documentation.
7. Every migration must be repeatable and version-controlled. Do not edit live production schema manually as the sole source of truth.
8. Maintain a change log and list exact changed files, commands run, results, untested areas and blockers in each phase report.

## 7. Immediate next action

Use `ANTIGRAVITY_MASTER_PROMPT.md` to ask Antigravity to conduct **Phase 0 only**: inspect the workspace, reconcile these planning docs with actual files and Stitch references, create/update the root `README.md` based on verified facts, and return a readiness report. Do not authorize implementation until that report is reviewed.

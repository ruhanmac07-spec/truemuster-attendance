# TRUEMUSTER — Testing, Acceptance and Release Gates

**Version:** 1.0 · **Date:** 10 October 2026  
**Purpose:** Define evidence required before a phase or pilot is called complete.

## 1. Evidence standard

A file generated or code written is not proof of a working feature. For every phase, record exact commands, exit code, relevant logs, test results, screenshots/recordings if visual validation is involved, device/OS/environment, and open defects. Mark tests as `PASS`, `FAIL`, `BLOCKED` or `NOT RUN`. Never fabricate test results.

Use synthetic data by default. Do not use real student PII/biometric data in local or personal development projects.

## 2. Test layers

- **Static checks:** TypeScript type-check, lint, format check, dependency audit, secret scan.
- **Unit tests:** state machines, expiry interpretation, policy helpers, response mapping, idempotency keys, validation and component states.
- **Component/UI tests:** default/loading/disabled/error/empty/unknown/reduced-motion states; keyboard/screen-reader labels where testable.
- **API/DB tests:** migrations, constraints, RLS and authorization as different roles; SQL/database atomicity; duplicate/concurrency/replay behavior.
- **Integration tests:** mocked/native adapters and Supabase dev environment; validate error handling, token refresh and request reconciliation.
- **End-to-end tests:** Student ↔ backend ↔ Teacher session and QR, manual corrections, device recovery/history.
- **Device tests:** real Android cameras, location fixes, BiometricPrompt, Keystore, pause/resume, permissions, keyboard/insets, target Windows PCs/location services and QR display.
- **Operational tests:** clean build, signing/packaging, backup restore, retention jobs, monitoring and rollback/manual attendance.

## 3. Design system and animation QA

- Design tokens live in one named source and map consistently to Android/Windows requirements where relevant.
- Visual comparison to actual Stitch screen at representative viewport/device scale; log differences and decisions.
- Buttons/inputs/cards/status/outcome components include relevant default, pressed, disabled, loading, error and accessibility states.
- Android tap targets are at least 48dp unless a documented platform-specific exception is reviewed.
- Verify contrast with actual pairings; do not assume brand color always passes.
- Large font/system font scaling does not clip forms, timers, statuses or results.
- Reduced-motion mode keeps full functionality and avoids major movement.
- No infinite decorative animation; no timer animation that harms readability.
- Animation does not delay QR decoding, native auth, network requests, navigation, expiration handling or success display.
- Confirm a server-confirmed success ticket is not visible until commit state is known.

## 4. Attendance timing and integrity cases

### QR policy
- QR valid just before expiry: accepted only if server policy accepts at the server validation time.
- QR expired before backend acceptance: rejected; no 45-second attempt timer starts.
- QR decoded locally while network is slow: remain in validation/waiting state; no accepted-attempt claim.
- QR accepted by backend: attempt gets server `started_at` and `deadline_at` separated by 45 seconds.
- QR rotates while a valid attempt remains open: the accepted attempt is not invalidated solely by QR rotation.
- Client wall clock is ahead/behind: server result governs expiry/deadline.
- Challenge replay/concurrent use: only eligible, policy-permitted attempt is created; older/replayed challenge cannot create unlimited attempts.
- Double tap/retry: idempotent response; no duplicate record.

### Attendance transaction
- Valid evidence and policy: one record commits and server returns authoritative status.
- Location rejected, auth cancelled, bad signature, expired attempt, revoked device or unauthorized student: no `PRESENT` row is partially committed.
- Timeout before server received request: safe retry according to contract.
- Timeout after server commit: query by attempt/idempotency/record before retry; still one record.
- Two concurrent accepted submissions for same student/session: unique constraint and transaction prevent duplicates.
- Unknown backend enum: safe non-confirmed UI, telemetry and contract investigation.

## 5. Location tests

- Fresh fix no older than 15 seconds and accuracy reported as 50 metres or better.
- Exactly 100m/below and just beyond 100m boundary, using server distance computation.
- Student inside/outside the approved campus area.
- Missing permission, denied permanently, approximate-only result, low accuracy, stale fix, timeout, airplane mode, indoor/poor GPS and location service disabled.
- Teacher Windows location available and valid.
- Teacher Windows location unavailable: Admin-approved room anchor selected explicitly.
- Teacher device reports a coordinate outside the approved area: QR/session issuance blocked.
- No fake coordinates and no silent substitution of user estimate.
- GPS failure results in retry/review, not automatic fraud label.

## 6. Android device-authentication and device-binding tests

- Strong biometric available and succeeds.
- Biometric unavailable; secure device credential fallback is offered per policy.
- User cancels/fails prompt, locks screen, rotates device, backgrounds app, resumes app, or loses network.
- No secure device lock: enrollment/check-in requires setup, does not bypass.
- Key created, public key registered, signed challenge verifies on server.
- Tampered client `authSuccess` flag without valid signature is rejected.
- Private key never appears in app logs, files or network request.
- Device revoked; old key rejected even if app's local UI has stale status.
- Device replacement: new binding stays pending until approved; old key/session revoked; audit log created.
- One active key constraint tested under concurrent enrollment requests.

## 7. Authorization and privacy tests

- Student A cannot view/update student B profile, timetable/history, disputes or attendance.
- Student cannot insert/update attendance directly through the client Data API.
- Teacher can only access assigned courses/sections/sessions and cannot alter another teacher's roster/policy.
- Admin permissions are scoped; privileged actions appear in audit log.
- Revoked/suspended account/device is denied.
- All exposed tables have RLS and appropriate grants; test as real JWT-backed roles, not only service role.
- No secret/service-role key is present in git history, built client bundles, source maps, README or `.env.example`.
- No PII in QR payload; no tokens/passwords/private keys in logs.
- Exact coordinate and verification metadata retention jobs respect approved policy; test deletion in live tables and backup lifecycle where possible.
- v1 Android manifest has no unnecessary front-camera/face-permission flow beyond what the legitimate scanner requires.

## 8. Manual correction and finalization tests

- Missing reason prevents adjustment.
- Teacher may adjust only the assigned session/student within the 24-hour teacher window.
- Auto-finalization occurs at 24 hours after scheduled end, using server time.
- Admin may correct until day 7 with required reason, notification/audit.
- After day 7, ordinary edit blocked; exceptional path requires written justification and second authorized approver.
- Original status remains linked; audit events cannot be silently updated/deleted via normal app roles.
- Dispute submission is a request; attendance remains unchanged until authorized resolution.

## 9. Performance measurement plan

Measure with timestamps and device/network metadata that do not expose PII:

- camera-open-to-preview readiness;
- local QR decode time;
- QR submit-to-attempt accepted latency;
- native location acquisition duration, fix age and reported accuracy;
- native authentication prompt duration/outcome;
- evidence submit-to-confirm latency;
- overall scan-to-confirm median and p95;
- API/Edge Function/db error rate, retry/reconciliation rate, location/auth failure rates and manual override rate.

Report sample size and conditions. Do not claim organizer's “under 3 seconds” until they define whether it means face verification, one backend operation, or complete check-in. The full flow also depends on user interaction, camera focus, GPS and network; no guarantee should be invented.

## 10. Release and pilot readiness

Required before live pilot:
- written campus/institution approval for data, identity, retention and support policy;
- verified campus/room anchor coordinates;
- separate dev/staging and production environment;
- synthetic-data suite complete; authorized volunteer trial before a class pilot;
- no unresolved critical/high security issues affecting the planned pilot;
- daily production database backup arrangement or equivalent plus weekly encrypted independent export retained 30 days;
- restore rehearsal to non-production, with row counts/constraints/relationships verified;
- monitoring owner and rollback plan;
- written manual attendance fallback and support contact;
- tested signed Windows package and documented Android build/install/update path;
- documented device/OS compatibility matrix and p50/p95 measurements;
- privacy notice and final retention values approved by the institution.

## 11. Phase report template

Every Antigravity phase completion response must include:

1. Phase / date / branch/commit.
2. Summary of work completed.
3. Exact files added/modified and why.
4. Commands run with pass/fail and key output.
5. Tests run and actual result counts.
6. Build result and targets tested.
7. Real device/OS/environment tested—or explicitly “not tested.”
8. Accessibility/visual/motion review evidence, where relevant.
9. Security and privacy implications.
10. Known defects, untested conditions and blockers.
11. Database/deployment/key actions required from the owner (never request secret values in chat).
12. Proposed next phase and its preconditions.

A phase is not done if core acceptance criteria are unchecked or the report misrepresents untested work.

# TRUEMUSTER — Product Requirements Document (PRD)

**Version:** 1.0 planning draft aligned to finalized requirements baseline v1.1  
**Date:** 10 October 2026  
**Status:** Scope baseline; not proof of implemented or institutionally approved software.

## 1. Product vision

TRUEMUSTER is a college attendance management platform intended to reduce casual proxy attendance while keeping genuine failures recoverable and all manual changes traceable. It consists of a student Android app, a Windows Admin/Teacher application and a shared online-first backend.

The system must be honest about what it can and cannot prove. A QR scan, GPS result, successful phone unlock or individual security signal alone is not proof of a student's real-world identity. No single feature can guarantee that proxy attendance is impossible.

## 2. Goals

- Allow a roster-authorized student to check in to an eligible class from one registered Android device.
- Validate session-bound QR challenge, permitted check-in window, location evidence, registered device challenge signature and native OS authentication.
- Provide reliable, clear UI states without optimistic attendance confirmation.
- Give Teachers a fast live-attendance and exception workflow; give Admins controlled academic setup, reporting, recovery and audit tools.
- Make attendance writes idempotent and atomic, with one authoritative record per student/session.
- Minimize student personal data and precisely control role access, retention and exports.
- Keep v1 architecture modular for separately approved future face/liveness and offline modes.

## 3. Non-goals for prototype v1.0

- Facial recognition, face matching, face enrollment photos, embeddings/templates or liveness capture.
- 3D depth-based anti-spoofing or a promise of under-three-second biometric verification. These must be handled as a future workstream after organizer clarification and technical/ethics/legal review.
- Offline-confirmed attendance, student-side offline queues or campus-LAN fallback.
- iOS client.
- Continuous/background location tracking.
- Storing a face image or fingerprint image to authenticate the device.
- Self-service replacement of the student's active device without authorized recovery.
- Silent editing/deletion of attendance or audit history.
- Any claim of “100% proxy-proof.”

## 4. Users and roles

### Administrator

Manages authorized student roster, teachers, course/section/timetable, approved classroom anchors, device recovery/revocation, attendance policy, reports, retention/operations and audit review. Privileged actions are scoped and logged; audit history is not ordinarily editable/deletable.

### Teacher

Can see assigned classes, start or cancel eligible sessions, display/rotate session QR, monitor check-ins, review exceptions, and mark/correct attendance with a mandatory reason in the allowed time window. Teachers cannot manage global roster or access unassigned sections.

### Student

Can authenticate against the approved roster, register one Android device, scan a valid QR for an eligible session, view only their own records, and request review/correction if policy/backend support it. Students cannot directly edit attendance.

## 5. Platforms and supported environment

- Student: Android 10 / API 29 or newer (initial target baseline).
- Admin/Teacher: signed Windows 11 x64 executable. Windows 10 may be used in internal compatibility checks only unless support scope is formally changed.
- Client architecture: React + TypeScript + Vite; Capacitor/native Android integrations; Tauri 2 for Windows.
- Backend: Supabase Auth, PostgreSQL, RLS, Edge Functions and database-side atomic operations.
- Use a shared repository if compatible with the inspected project. Share domain types/contracts and design tokens; keep platform-specific UI and native integrations separate.

## 6. Functional requirements

### 6.1 Student identity and enrollment

- The authoritative student roster is administered/imported by authorized Admins.
- Student-supplied enrollment ID and college email are not enough on their own; a valid account must match an active roster entry and use the approved email OTP/SSO verification path.
- Exact sign-in fields and method must match the implemented auth contract; do not invent social login or unapproved SSO.
- The backend verifies eligibility before allowing attendance.
- Suspended/ineligible students receive a neutral, privacy-preserving outcome.

### 6.2 Device registration and authentication

- One active Android device binding per student.
- Generate a device-bound key pair through Android Keystore where supported, preferring hardware-backed keys. Store the public key and key state server-side; private key is not exportable to normal app storage.
- Use AndroidX `BiometricPrompt` with strong biometrics preferred and secure device-credential fallback permitted. Require secure screen lock before enrollment/check-in if none exists.
- Device authentication unlocks use of a registered key. It is not itself student-face recognition.
- The backend verifies a short-lived, challenge-bound signature; a client-side boolean such as `biometricSuccess=true` is not sufficient.
- Lost-phone/device replacement requires authorized verification, old-key/session revocation and an audit event.

### 6.3 Teacher class session and QR

- Teachers can create/open sessions only for assigned, eligible scheduled classes.
- Before QR issuance, the session anchor must be within an approved campus/room area and teacher assignment must be valid.
- Primary anchor: fresh, sufficiently accurate Windows Location Services fix when available and allowed. If not reliably available, require a preconfigured Admin-approved classroom anchor; never silently substitute a guessed coordinate.
- Server generates an opaque, high-entropy, session-bound QR challenge containing no student PII.
- One challenge is active per session and rotates every 90 seconds while the session is open. Server time is authoritative.
- Normal session opening is permitted up to 10 minutes before scheduled start; student check-in closes at class end. A Teacher may extend up to 15 minutes after scheduled end with a mandatory reason and audit record.

### 6.4 Student check-in timing and verification

1. Student opens the scanner; permission is explained and obtained in the native OS flow if needed.
2. Local decoding identifies a candidate QR. This does not prove validity or start the attempt timer.
3. The app sends the QR challenge to the backend.
4. If server validates it, the backend atomically creates/returns a unique check-in attempt. This server acceptance starts the separate 45-second deadline.
5. The app obtains a fresh location fix: timestamp age no more than 15 seconds and reported accuracy no worse than 50 metres.
6. Student completes native OS authentication and signs the server challenge with the active registered key.
7. Backend validates eligibility, challenge/attempt window, device/key status, location freshness/accuracy and distance, session/anchor policy, authorization, replay/rate-limit policy and record uniqueness.
8. Server performs the authoritative final write atomically. At most one attendance record exists for each student/session.
9. The app displays “Attendance confirmed” only after the backend confirms the commit.
10. If submission timed out after it may have reached the server, query the attempt/record or retry idempotently before creating another attempt.

The 90-second QR validity and 45-second attempt deadline are separate server-timed rules. QR rotation does not invalidate an already accepted attempt before its own deadline.

### 6.5 Location policy

- Student must be within 100 metres of the active session anchor and inside the configured approved campus area.
- Student location evidence must be no older than 15 seconds and report accuracy of 50 metres or better.
- Actual campus boundaries and classroom anchors are deployment inputs and must be verified on site. Never hardcode invented Ganpat University coordinates.
- GPS/location is collected only for the attendance attempt, not tracked continuously in the background.
- Inaccurate/unavailable location yields retry or controlled review, not an automatic accusation of fraud.

### 6.6 Attendance record and state model

Proposed durable record statuses: `PRESENT`, `LATE` (only if policy defines the threshold), `ABSENT` (only after policy/finalization), `MANUAL_REVIEW`, `CORRECTED` as an adjustment state/event rather than overwriting history. Transport/attempt states should separately represent `PENDING`, `VALIDATING`, `REJECTED`, `EXPIRED`, `CONFIRMED`, and `UNKNOWN_RECONCILING`. Avoid conflating check-in attempt status with final attendance status. Exact enum and API schema must be documented before clients implement it.

- Server/database time is authoritative; persist timestamps in UTC and present campus-local time in the UI.
- Unique constraint on `(student_id, session_id)` prevents duplicate authoritative attendance records.
- Check-in operation must be idempotent and transactionally protected against concurrent requests.
- Client animations must not determine record state.

### 6.7 Manual exceptions, disputes and finalization

- Teachers may record a genuine late/missed check-in or correct an entry with a mandatory reason during class and up to 24 hours after scheduled session end.
- Attendance automatically finalizes 24 hours after scheduled end.
- From 24 hours through 7 calendar days after session end, only authorized Admin may amend with reason and audit record; notify the Teacher and Student.
- Beyond 7 days, routine edits are blocked; exceptional written justification plus a second authorized Admin approver is required.
- Student may submit a correction request but cannot edit attendance directly.
- Preserve prior status; adjustments are append-oriented events that identify actor, time, session/student, old/new status, reason and approval as applicable.
- Exact dispute workflow UI should be implemented only where the backend supports it.

### 6.8 Admin functions

- Student roster import/create/update with validation and duplicate enrollment ID checks.
- Student profile/status and eligibility.
- Teachers and assignments.
- Academic year/term, courses, sections, timetable, holidays and schedule changes.
- Approved classroom/campus anchors with versioning and audit events.
- Policy configuration with change controls; policy changes should affect future sessions unless approved migration explicitly says otherwise.
- Device revocation/recovery.
- Attendance sessions, exception queue, reports/export, restricted audit logs, retention jobs and operational monitoring.

### 6.9 Teacher functions

- My timetable/assigned sections.
- Eligible session setup and QR display/rotation/countdown.
- Live attendance register with confirmed, pending, retry, rejected and manual-review states as returned by the backend.
- Reason-required manual adjustment.
- Session review/finalization and class reports within authorized scope.

### 6.10 Student functions

- Welcome/sign-in/enrollment (STU-01).
- Device binding education and approved setup flow (STU-02).
- Student Home/schedule/attendance overview (STU-03).
- QR scanner and check-in (STU-04).
- Outcome ticket (STU-05).
- Attendance history and help/dispute request where supported (STU-06).
- Do not expose other students, internal audit logs, raw tokens or precise security evidence.

## 7. Retention and privacy defaults for review

These are prototype defaults from the finalized baseline, not a legal opinion and not permission to process real data without institutional approval.

- Face images/embeddings/templates: not collected or created in v1.
- Exact GPS coordinates: retain only what is necessary; baseline default deletes within 30 days. Retain coarse verification outcome, distance band and reported accuracy up to 180 days.
- Verification metadata: up to 180 days, unless linked to an open dispute/security incident.
- Attendance records and adjustments: proposed 3 academic years after the academic year ends, subject to institutional records policy.
- Sensitive admin/device/reset/manual-change/access audit events: proposed 2 years.
- Account/device metadata: delete/de-identify within 1 year after account exit unless held for an open matter or institutional requirement.
- Backups: live data deletion is not complete until it expires from the approved backup lifecycle.

Implement controlled retention jobs only after the institution approves policy values. Do not log secrets, passwords, reusable tokens, raw biometric material or unnecessary location data.

## 8. Non-functional requirements

### Security
- Backend is authoritative for authentication, authorization, expiry, geofence, device state, idempotency, attendance commit and audit.
- RLS on all exposed data tables with default-deny and least privilege.
- Client keys are publishable keys only, with RLS/privileges. Secret/service-role keys and database credentials remain only in trusted server-side secrets.
- Strong input validation, rate limits, replay protection, unique constraints and reason-required privileged actions.
- Dependency and secret scans in the repo and build pipeline where practical.

### Reliability
- Network failures show not-confirmed/pending/retry, never offline-confirmed status.
- Reconcile unknown submission outcome before retrying a potentially committed operation.
- Backup and restore policy is required before a real pilot.

### Performance
- Avoid unnecessary round trips in the check-in path.
- Record scan-to-confirm median and p95 on actual devices/networks; do not declare a guarantee before testing.
- The 45-second deadline is a maximum attempt window, not an average performance promise.
- Organizer's “verification throughput < 3 seconds per student” must be clarified: v1 has no facial verification. If organizer means another operation, define a measurable endpoint and benchmark before accepting that SLA.

### Accessibility and design
- Follow the Android and Windows design-system docs; minimum interactive target 48dp on Android.
- Test contrast, large text, keyboard/navigation, screen readers, reduced motion and outdoor readability.
- Keep animation purposeful, smooth and non-blocking; never delay server correctness.

### Operations
- Separate development/staging from production.
- Synthetic test data in development; no real student records in personal test projects.
- Pilot requires daily managed backups, independent weekly encrypted export kept 30 days, restoration rehearsal, monitoring and rollback/manual attendance plan as detailed in baseline.

## 9. Organizer requirement alignment

The organizer lists face recognition, computer vision, mobile/web apps, location/proximity, authentication, cybersecurity, Python, OpenCV, React, React Native, Node.js, MongoDB, 3D liveness, sub-3-second verification and biometric privacy. The currently locked product baseline differs in important ways:

- Current v1 stack uses React + TypeScript + Capacitor for Android; not React Native.
- Current backend uses Supabase PostgreSQL/RLS/Edge Functions; not MongoDB or a separate Node.js server by default.
- Python/OpenCV/face recognition/3D liveness are not part of v1.

Before changing the selected architecture, ask the organizer/mentor whether technology names are examples, recommendations, or mandatory judging criteria. Do not create a second database or claim liveness compliance by installing OpenCV. If some technology is required, evaluate it as an explicit architecture change with scope, cost, privacy and test implications.

## 10. Definition of done for prototype v1.0

- Both clients build with reproducible instructions and versioned dependencies.
- Auth/roster/roles and RLS deny unauthorized access as tested.
- Session-bound 90-second QR and separate 45-second attempt deadline work under server-time rules.
- Location policy and registered device challenge signature are verified server-side.
- At most one committed attendance record per student/session under concurrent submissions.
- Success is shown only after commit confirmation; unknown outcome is reconciled.
- Manual changes are reason-required and audited; finalization windows are enforced.
- Student/Teacher/Admin UX is consistent with approved Stitch designs and handles failure states.
- Automated tests, device tests, latency reports, backup restore and pilot checklist are recorded.
- Facial and offline features remain disabled/out of v1 scope.

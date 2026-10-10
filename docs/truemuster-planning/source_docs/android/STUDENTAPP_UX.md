# TRUEMUSTER — Student Android UX Specification

**Product:** TRUEMUSTER — Smart Attendance System  
**Platform:** Android Student application  
**Design tool:** Google Stitch  
**Implementation handoff:** Antigravity  
**Version:** 1.0 · **Status:** Draft pending PRD/API review  
**Date:** 9 October 2026  
**Companion document:** [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

> This document specifies the Student Android information architecture, screen purposes, journeys and interactions. `DESIGN_SYSTEM.md` governs visual tokens, components and motion. The approved PRD, attendance workflow, security/privacy policy and API contracts remain authoritative for product and backend behaviour.

---

## 1. Product scope

TRUEMUSTER Student is the mobile companion to the Windows Admin/Teacher application. A student authenticates, uses an enrolled Android device, scans a currently valid classroom QR, completes approved checks and sees the authoritative attendance result.

### In scope for this prototype
- Student authentication/enrollment against the approved student roster.
- One active registered Android device per student.
- Contextual camera and location permission flows.
- Android `BiometricPrompt` with secure device credential fallback according to the agreed policy.
- Home screen with schedule/attendance context based on authorised backend data.
- QR scanning, check-in and verification feedback.
- Attendance outcome and history.
- Exception/dispute submission only if supported by the approved policy and backend.

### Explicitly out of scope
- Facial verification during registration or attendance; face verification remains future scope.
- Claiming phone authentication proves the student's real-world identity.
- Offline-first attendance/local queue in v1 unless separately approved.
- Admin/Teacher management UI.
- Claims that controls make proxy attendance impossible.
- Fake/hardcoded attendance confirmation or unsupported backend behaviour.

### Rules the UI must preserve
- QR validity is **90 seconds**, according to the server-defined issue/validity point.
- After a valid QR is accepted and a check-in attempt starts, the student has a separate **45-second attempt deadline**.
- Opening the camera or detecting a QR locally does **not** start the 45-second countdown.
- Initial geofence is **100 metres** from the approved class/session anchor, subject to the approved location accuracy/session policy.
- One active registered Android device per student; replacement requires authorised admin recovery and old binding revocation.
- Attendance is confirmed only after the backend confirms the committed record.
- Failed location/authentication checks do not automatically prove fraud.
- Teacher manual attendance/corrections are permission-controlled and auditable.
- Face verification is not part of the current prototype.

## 2. UX goals and principles

1. A student can understand today's classes and next action quickly.
2. QR scanning is reachable with minimal navigation.
3. Permission requests explain why permission is required.
4. Valid QR acceptance and the 45-second attempt start are clear.
5. Progress states are truthful and easy to understand.
6. Outcomes distinguish confirmed, expired, location unable to verify, authentication incomplete, pending and other actual server states.
7. Errors provide a policy-approved retry/review path.
8. Motion adds polish without slowing a real task.
9. Copy is neutral: an unsuccessful check is not automatically an accusation.
10. The app shows only the signed-in student's authorised records.

## 3. Navigation and screen inventory

### Proposed mobile navigation

A simple bottom-navigation pattern is a candidate:
- **Home**
- **Attendance / History**
- **Profile**

The main Scan QR action may live on Home or in a consistently reachable central action. Choose one approach in Stitch and apply it consistently. Do not add a floating action button if it conflicts with Android navigation or becomes inaccessible. This navigation proposal is a draft, not a final approval.

### Screen inventory

| ID | Screen | Priority | Purpose |
|---|---|---|---|
| STU-01 | Welcome, Student Authentication & Initial Enrollment | P0 | Sign in/enroll and match a student with the approved roster |
| STU-02 | Device Binding & Permission Education | P0 | Explain one-device policy and request camera/location contextually |
| STU-03 | Student Home — Class Schedule & Attendance Overview | P0 | Show assigned/current classes and the next action |
| STU-04 | Live QR Scanner & Check-in | P0 | Scan QR, validate challenge, guide location/device checks within deadline |
| STU-05 | Verification Outcome Ticket | P0 | Show confirmed attendance or accurate actionable failure |
| STU-06 | Attendance History & Exception/Dispute Submission | P1 | View history and submit an exception only where supported |

Supporting states belong to these screens: loading, empty, no results, camera denied, location denied/unavailable, low accuracy, QR expired/invalid/replayed, deadline expired, device already bound/revoked, authentication failed/cancelled, attendance pending, server-confirmed, session unavailable and dispute pending/approved/rejected (only if these states exist in the real system).

## 4. End-to-end journeys

### 4.1 New student enrollment

1. Student opens the app and sees a focused welcome/sign-in path.
2. Student supplies the identity fields required by the approved authentication model.
3. Authentication verifies the account; the backend matches enrolment details against the admin-approved roster and account state.
4. If details do not match, show a neutral error or admin-review path without exposing another student's data.
5. Student continues to device enrollment. Explain the one-active-device rule and admin-approved replacement process.
6. Request camera/location permissions contextually when the related feature needs them; do not demand all sensitive permissions at first launch without explanation.
7. Enrollment completes only after the real server/device-enrollment flow succeeds.
8. Route to Student Home.

**No face capture, face matching, liveness challenge or face-verification success screen belongs in this prototype.** Do not add one by inference.

### 4.2 Returning student opens the app

1. Restore a valid authenticated session only if supported by the auth design.
2. Confirm account/device eligibility through the backend.
3. Open Home with authorised data.
4. If the session expired or device binding is invalid, show the correct re-authentication/admin-recovery state; do not expose protected content.

### 4.3 Student checks in with QR

1. Student taps Scan QR.
2. If camera permission is missing, explain why and invoke the native Android permission flow.
3. Camera opens and scans the Teacher's displayed QR.
4. App submits the QR challenge to the backend.
5. Backend validates the correct session, 90-second QR validity and invalid/replay conditions.
6. Only after backend acceptance and attempt start does the separate 45-second check-in deadline begin.
7. App communicates that the attempt is active and shows the countdown.
8. Obtain the location evidence required by the approved contract, including freshness/accuracy metadata where relevant.
9. Invoke native Android `BiometricPrompt` with the approved secure device-credential fallback.
10. Submit the evidence required by the actual API contract.
11. Backend enforces device binding, session/QR rules, location policy, authentication evidence, deadline, authorization and duplicate protection.
12. Backend commits the attendance record if checks pass.
13. Display `Confirmed Present` only after the backend reports the committed result.
14. If a check fails, show the actual known outcome and approved recovery path.

Do not assume all checks must run serially: independent location acquisition and native authentication may be parallelized if the real API/workflow allows it. QR acceptance and starting the deadline must follow the authoritative backend protocol.

### 4.4 QR expired before acceptance

- Show QR expired/invalid.
- Do not start the 45-second attempt timer.
- Tell the student to request a currently valid QR where appropriate.
- Never display an expired challenge as active or infer fraud/absence from expiry alone.

### 4.5 Valid attempt fails

- Keep relevant class/session context visible.
- State the actual outcome neutrally.
- Offer retry only if allowed by policy and time remaining.
- Do not reset/extend the timer locally.
- If a timeout leaves commit outcome unknown, reconcile with the backend before allowing a potentially duplicate retry.
- If the deadline has elapsed, show that state and the approved Teacher/manual-review route where applicable.

### 4.6 Device replacement

1. Student follows account recovery when changing/loss of device occurs.
2. Explain that replacement requires administrative verification/approval.
3. Authorized Admin/backend verifies the student and revokes the old binding before activating the new one according to policy.
4. Reinstalling the app or editing local state must not bypass the device limit.
5. Show final success only after the backend confirms the new binding.

## 5. Screen specifications

### STU-01 — Welcome, Student Authentication & Initial Enrollment

**Purpose:** help the student securely sign in or enroll.

**Layout**
- TRUEMUSTER name/approved wordmark.
- Clear headline and one short explanation.
- Supported sign-in/enrollment path(s) only.
- Concise, labelled identity fields when required by the actual auth contract.
- Clear primary CTA and accessible validation region.
- Minimal decoration; no onboarding carousel unless it provides genuine value.

Do not invent Google/social sign-in, SSO, password reset, fields or registration paths not supported by the canonical authentication policy/API.

**States:** initial, submitting, invalid fields, authentication failure, roster mismatch/account ineligible, service/network unavailable, enrollment confirmed, already enrolled/device step required.

**Acceptance:** safe entries survive recoverable errors; messages do not reveal another student's enrollment; success only follows confirmed authentication/roster checks; no face verification.

### STU-02 — Device Binding & Permission Education

**Purpose:** explain the device policy and contextual camera/location permissions.

- Explain one active registered Android device per student.
- Explain that device replacement requires admin-approved recovery.
- Keep device binding separate from permission requests.
- Request camera when scanning starts unless the approved product flow requires earlier use.
- Request location when check-in needs it, explaining its role in checking proximity to the approved class/session location.
- Invoke native Android system dialogs, never fake them.
- Offer understandable recovery for denied/permanently denied permissions where Android supports it.

**States:** binding pending/success, another device bound, admin recovery required, permission not requested/granted/denied, settings recovery where applicable, service failure.

**Acceptance:** no new device is marked active before authoritative approval; denial is not portrayed as fraud; privacy copy is clear and not coercive.

### STU-03 — Student Home / Live Class Schedule & Daily Attendance Overview

**Primary question:** “What's my next class and what do I do now?”

**Hierarchy**
1. Concise greeting/context based on authenticated data.
2. Today's class schedule.
3. One clear, thumb-reachable Scan QR action.
4. Current/upcoming assigned classes.
5. Compact attendance overview only if backed by real data and unambiguous.
6. Navigation to history/profile.

A class item may display course/subject, section, scheduled time, classroom label, session status and one contextual action. Keep key information prominent; do not show raw coordinates, internal IDs or excess metadata.

**Visual treatment:** use the approved mobile design system with high-quality typography, calm surfaces, restrained accents and purposeful motion. Avoid generic charts or large metric cards that do not help the student act. Separate current, upcoming and previous classes clearly. Prevent layout jumps while data loads.

**States:** home loading, classes available, no classes scheduled, no classes assigned, attendance summary unavailable, network error, session expired, invalid device binding.

**Acceptance:** next action is obvious; no fake data in production; failed refresh is not silently shown as empty; layout supports common portrait phones and larger text.

### STU-04 — Live QR Scanner & Check-in

This is the most critical Student screen.

**Camera ready:** real camera preview, stable high-contrast scan frame, one instruction, supported torch control only if available, contextual permission recovery. Avoid radar/animation that obscures QR edges.

**QR detected locally:** short acknowledgement only; this is not backend acceptance and must not start the 45-second countdown.

**Backend validation:** show `Checking QR…`; submit via the real contract. Expired/invalid/replayed/unavailable challenges get the actual result. Do not start the check-in timer until the backend accepts the QR and the attempt begins.

**Accepted QR / active attempt:**
- Show the separate 45-second check-in deadline clearly.
- Get location evidence with appropriate freshness/accuracy metadata.
- Use `BiometricPrompt` with the approved device-credential fallback.
- Show useful stages (location, device authentication, submitting) when supported by the real workflow.
- Keep timer legible; never reset or extend it locally.
- The server deadline is authoritative.

**Location states:** permission needed, locating, checking, within permitted area only when supported, outside permitted area, location unavailable, accuracy insufficient, timeout. Use plain language such as “We couldn't get an accurate location. Try again somewhere with a clearer GPS signal.” Avoid exposing raw coordinates unnecessarily. The approved session anchor—not an assumed Windows computer GPS point—is the reference.

**Authentication states:** waiting, prompt active, success callback, cancelled, failed, secure credential fallback available/used, credential unavailable. The actual native prompt must be used; do not design a fake biometric dialog.

**Submission:** show submitting state; prevent duplicate action; never show optimistic attendance success. If a request times out near expiry, reconcile server status before allowing unsafe duplicate submission.

**Acceptance:** camera preview does not start the deadline; local QR detection is distinct from server acceptance; 90-second QR validity and 45-second attempt deadline are distinct; client-only location cannot confirm attendance.

### STU-05 — Verification Outcome Ticket

The result must come from the actual server outcome. Do not funnel different failures into a generic red error page.

- **Confirmed Present:** only after commit confirmation. Show clear result, class/session, trusted timestamp if returned, and one next action. Calm, polished motion; no routine confetti or invented scores.
- **QR expired/invalid:** explain that the QR/session is no longer valid and give the appropriate next step. Do not imply an attempt started if it did not.
- **Location out of bounds:** explain that location did not meet the permitted class-area rule; provide approved retry/review guidance. Do not accuse the student of fraud.
- **Location unavailable/low accuracy:** explain and offer retry if time/policy permits.
- **Device authentication incomplete:** explain cancel/failure and an allowed retry where permitted.
- **Attempt expired:** state that the deadline passed; never suggest the client can extend it.
- **Pending/unknown:** display `Pending` or `Checking status`; reconcile with backend. Never mark it confirmed or definitively failed without evidence.
- **Network/service issue:** explain that confirmation is unavailable and safely reconcile if the request may have reached the server.

**Acceptance:** each label matches actual response; next action is state-appropriate; failure copy is neutral and specific.

### STU-06 — Attendance History & Exception/Dispute Submission

The dispute portion is in scope only if supported by the approved policy and backend.

**History list:** server-provided records for the authenticated student; course/class, date/time and authoritative status; clear empty/no-results/error/loading states. Use only approved fields and avoid raw security evidence/location data.

**Record detail:** session context, recorded status, timestamp when available, and permitted non-sensitive outcome explanation.

**Dispute submission:** select a record, explain the correction/review process, collect only the required reason/category and minimal note, and clearly state that submission is a request—not an immediate attendance change. Use only real backend-supported statuses.

**States:** history loading, records available, no records, no filter results, service error, validation error, request submitted/pending, reviewed/approved/rejected only where supported.

**Acceptance:** history remains scoped to the signed-in student; submission is not represented as a changed attendance record until confirmed; no student self-edit bypass.

## 6. State matrix

| Situation | Correct UI representation | Must not claim |
|---|---|---|
| Camera opening | Camera starting | QR verified |
| QR locally detected | QR detected / validating | Attendance accepted |
| Backend accepts QR and begins attempt | Check-in active; 45-second deadline starts | Attendance confirmed |
| Location request in progress | Checking location | In/out of bounds before result |
| Native device auth prompt open | Waiting for authentication | Authentication succeeded before callback |
| Evidence submitted | Submitting/checking | Present |
| Server commit confirmed | Confirmed Present | — |
| QR expired before acceptance | QR expired/invalid | Attempt timer started |
| Location check fails | Actual location outcome | Fraud/intent |
| Authentication cancelled/failed | Authentication not completed | Attendance confirmed |
| Deadline passed | Check-in expired | Client can extend deadline |
| Server outcome unknown | Pending / reconciling | Definitively failed or confirmed without checking |
| Dispute submitted | Request submitted/pending | Attendance corrected |
| Device recovery waiting | Recovery pending | New device active before approval |

## 7. Privacy and permission UX

- Request camera when entering QR scanning and location when check-in requires it, unless approved policy specifies otherwise.
- Explain permission purpose before invoking the native dialog.
- Do not coerce users to grant permissions or hide the denied path.
- Do not retain raw camera frames or unnecessary location history in UI/client logs.
- Scope records to the authenticated student through backend authorization.
- Do not expose QR payloads, secrets or raw internal verification evidence.
- Do not put privileged server credentials in the mobile application.
- Face verification is not in v1; do not add a face capture/liveness flow by inference.
- A real student pilot must follow institutional privacy notices, approvals and retention policies.

## 8. Google Stitch workflow

Create a **separate project** titled `TRUEMUSTER Student Android UI`. Do not add mobile screens to the Windows project.

Generate one screen at a time in this order:
1. **STU-01:** Welcome, Student Authentication & Initial Enrollment
2. **STU-02:** Device Binding & Permission Education
3. **STU-03:** Student Home / Class Schedule & Attendance Overview
4. **STU-04:** Live QR Scanner & Check-in
5. **STU-05:** Verification Outcome Ticket
6. **STU-06:** Attendance History & Exception/Dispute Submission

For each prompt include: new Android project, `deviceType: MOBILE`, exact screen ID/name, both UX/design-system docs, user task, content hierarchy, relevant states, motion/accessibility rules, permission/privacy limits, 90-second/45-second rules when relevant, fictional demo-data restriction, explicit exclusions and a request to return actual generated screen IDs/references.

Do not ask Stitch to create all screens in one giant prompt. Refine each, check consistency, then continue. Do not claim a screen was generated unless a real Stitch reference/ID is returned.

### Stitch review questions
- Does it look like a carefully designed Android app rather than desktop UI scaled down?
- Is there one clear next action?
- Are controls at least 48 dp?
- Are text, status and timer readable outdoors?
- Is motion polished yet restrained?
- Are permission explanations contextual?
- Are local QR detection, server acceptance, check-in attempt, device/location checks and server commit distinct?
- Is demo data clearly illustrative?

## 9. Antigravity implementation handoff

Provide:
- `docs/ui-ux/android/DESIGN_SYSTEM.md`
- `docs/ui-ux/android/STUDENTAPP_UX.md`
- approved Android Stitch project and screen references
- canonical PRD, attendance workflow, auth/permissions, security/privacy and API contracts

Antigravity should inspect the repository and actual stack first, implement screens incrementally, verify native camera/location/`BiometricPrompt` support, use real permission handling and lifecycle/background behaviour, and never embed privileged secrets or fabricate results. Map each screen to actual API dependencies, handle real error responses and report real tests/builds/device limitations.

**Implementation sequence:** shared theme/navigation/states → STU-01 → STU-02 → STU-03 → STU-04 check-in state machine → STU-05 outcomes → STU-06 history/dispute where supported → real-device end-to-end testing.

## 10. Acceptance checklist

### Visual and interaction
- [ ] Distinct mobile identity, not a scaled Windows layout.
- [ ] Navy/white foundation and red accent are consistent.
- [ ] Tap targets meet 48 × 48 dp minimum target guidance.
- [ ] Important information remains readable with larger text and in bright light.
- [ ] Animations are purposeful, smooth, non-blocking and reducible.
- [ ] Loading, empty, error, pending and confirmed states exist where relevant.

### Attendance correctness
- [ ] Camera opening does not start the 45-second timer.
- [ ] The timer starts only after backend QR acceptance and attempt start.
- [ ] The 90-second QR validity and 45-second attempt deadline are distinct.
- [ ] Location/authentication feedback reflects actual known states.
- [ ] Attendance is confirmed only after backend commit confirmation.
- [ ] Unknown request outcome is reconciled before unsafe retry.
- [ ] Failed checks do not automatically imply fraud.
- [ ] Face verification is out of v1 scope.
- [ ] Device replacement follows approved admin recovery.

### Privacy and handoff
- [ ] Permission requests are contextual and use Android system UI.
- [ ] No privileged secret or actual student personal data is included.
- [ ] Student history is backend-scoped to that student.
- [ ] Each approved Stitch screen has a real reference/ID.
- [ ] Unresolved API/design choices are listed, not silently invented.

## 11. Open decisions

- [ ] Exact student authentication fields/method per auth/API contract.
- [ ] Technical method for secure single-device binding.
- [ ] Whether dispute submission is in v1 and its backend support.
- [ ] Exact API outcome for QR accepted / attempt started.
- [ ] Location accuracy and stale-location thresholds in the canonical policy.
- [ ] Minimum supported Android version and device test matrix.
- [ ] Final mobile navigation pattern in Stitch.
- [ ] Whether system dark appearance is in v1 scope.
- [ ] Actual Stitch project ID and screen IDs recorded.
- [ ] Review larger fonts, reduced motion and outdoor readability.

## 12. Version and approval log

| Version | Status | Change | Reviewer | Date |
|---|---|---|---|---|
| 1.0 | Draft | Initial Student Android UX specification | Pending | 9 October 2026 |

**Guiding principle:** make the experience beautiful, responsive and distinctive—but every attendance state must truthfully represent what the system has verified.

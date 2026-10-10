# TRUEMUSTER Android — Stitch-to-Code UI, Interaction and Motion Specification

**Version:** 1.0 · **Date:** 10 October 2026  
**Companion sources:** `source_docs/android/TRUEMUSTER_Android_DESIGN_SYSTEM.md` and `source_docs/android/TRUEMUSTER_STUDENTAPP_UX.md`.

## 1. Main instruction

Implement the existing approved Stitch screens faithfully. This is a design-to-code task, not permission to redesign or generate a new generic attendance interface. First collect the actual Stitch project/screen references, exported assets and screenshots if accessible. If Stitch MCP is not connected or screen IDs cannot be read, report that blocker and use only supplied assets/screenshots; do not pretend references were inspected and do not invent the missing design.

Source authority order:
1. Finalized v1.1 requirements baseline for behavior and policy.
2. Android UX specification for flows, screen content, states and copy intent.
3. Android Design System for visual tokens and motion rules.
4. Actual approved Stitch screen for the specific screen's composition and styling, unless it conflicts with a higher-authority policy.
5. This file clarifies implementation details; it does not relax those requirements.

## 2. Screens to map, not redesign

| ID | Screen | Implementation focus |
|---|---|---|
| STU-01 | Welcome, Student Authentication & Initial Enrollment | Approved identity inputs, loading/validation/service states; do not invent SSO/social-login flows. |
| STU-02 | Device Binding & Permission Education | One-device rule, secure device setup/recovery explanation, contextual permission education. |
| STU-03 | Student Home — Class Schedule & Attendance Overview | Next class, authorized schedule/attendance, clear scan entry point, loading/empty/error states. |
| STU-04 | Live QR Scanner & Check-in | Native camera, local decode vs server acceptance, accepted attempt/deadline, fresh location, OS auth, submission/reconciliation. |
| STU-05 | Verification Outcome Ticket | Server-returned confirmed/expired/retry/review/unknown states only. |
| STU-06 | Attendance History & Exception/Dispute Submission | Own records only, accurate statuses, request-not-edit wording; dispute UI only if supported by backend. |

Maintain traceability in `docs/ui-ux/android/stitch-screen-map.md` with columns for screen ID, actual Stitch project/screen ID, screenshot/export path, implemented route/component, supported states, review status and open gaps. Do not mark mapped/approved without checking the actual screen.

## 3. Visual design tokens

Use the supplied Android Design System as the token source; do not copy token values into many unrelated files. Initial token direction (verify exact combinations in real rendered UI):

- Navy `#001C5A`, white `#FFFFFF`, restrained red `#E21E2B`.
- Quiet canvas `#F5F7FA`, card `#FFFFFF`, subtle grouping `#EEF2F7`, primary text `#172033`, secondary text `#526078`, border `#DCE3ED`.
- Semantic status colours for success/warning/error/info/neutral, always paired with text/icon. Verify contrast rather than assuming these combinations pass.
- Roboto/Android system typography; respect dynamic text scaling.
- 4dp base spacing grid; target 48 × 48 dp minimum interactive areas.
- Consistent control/card radii and measured elevation. Avoid shadows on every component.

Implementation should produce a typed token module or CSS custom-property/semantic token layer that is centrally imported. Choose CSS variables, typed TS tokens or both based on the scaffold and avoid duplicated source-of-truth files. If a token changes, visual tests/story examples should update consistently.

Suggested semantics: `color.brand.navy`, `color.brand.red`, `color.surface.canvas`, `color.surface.card`, `color.text.primary`, `color.text.secondary`, `color.border.default`, `color.status.success`, `color.status.warning`, `color.status.error`, `color.status.info`, `space.*`, `radius.*`, `motion.*`.

## 4. Component catalogue

Build only components that support the supplied screens; avoid a huge component library before there is usage.

### Foundation
- `AppScreen` / safe-area shell
- `ScreenHeader`
- `Typography` or semantic text styles
- `PrimaryButton`, `SecondaryButton`, `TextButton`
- `TextField` with label, helper, invalid, disabled and submitting states
- `SurfaceCard` / `ClassSessionCard`
- `StatusIndicator` with semantic label + icon, not colour alone
- `InlineMessage` / `ErrorMessage` / `EmptyState`
- `LoadingIndicator` / `Skeleton` only where it improves perceived responsiveness
- `ConfirmationSheet` or dialog only where already specified/needed
- `AccessibleIconButton`

### Attendance-specific
- `SessionSummary`
- `QrScanFrame` (visual overlay only; the scanner/camera is a separate adapter)
- `QrValidityIndicator` for server challenge expiry, not a local trusted clock
- `CheckinAttemptTimer` driven from server-provided attempt start/deadline and monotonic elapsed time; reconcile on resume
- `VerificationStepList` for actual workflow steps; do not show a checkmark before the relevant operation confirms
- `AttendanceOutcomeTicket` with distinct confirmed, expired, rejected, retry, needs-review and unknown states
- `AttendanceHistoryRow`
- `DeviceStatusPanel`

### Component state requirements

Every actionable component must define default, pressed, keyboard/screen-reader focus where applicable, disabled and loading states. Form fields need valid/invalid/empty handling. Network-dependent elements need loading, success, error and unknown/reconciling behavior where applicable. Avoid implementing only the pretty default state.

## 5. Design-to-code mapping rules

- Capture real Stitch screenshot(s) and compare the running app at the same viewport/aspect ratio and font scale where possible.
- Preserve hierarchy, spacing, silhouette, component proportions, brand motif, text and button placement from the approved screen.
- Use real text and vectors, not screenshot-as-background assets, for editable UI.
- Use only approved logo assets; otherwise use the TRUEMUSTER wordmark. Do not fabricate the university logo.
- Do not use generic stock AI illustrations, excessive gradient/glass/card styling or placeholder charts.
- Do not place a desktop sidebar in the Android layout.
- Keep UI components presentational; use typed state/controller hooks and application services for business behavior.
- Do not make API calls inside animation callbacks or tie attendance state changes to the completion of animation.

## 6. Motion principles and timing

Motion is part of the visual identity, but it must signal interaction/state—not pretend to provide security. These are initial motion tokens from the supplied design system:

| Token | Duration | Use |
|---|---:|---|
| `motion.micro` | 100–140 ms | pressed feedback, tiny icon/state change |
| `motion.quick` | 150–190 ms | button/card interaction |
| `motion.standard` | 200–260 ms | screen/content/sheet transition |
| `motion.emphasis` | 280–360 ms | meaningful major state transition, used sparingly |

Choose easing consistently (a natural ease-out for entrances, ease-in/out for continuity). Prefer opacity and transform over repeated layout recalculation. Avoid bounce-heavy physics, parallax, continuous decorative animation, perpetual scan sweeps and animation across dense lists. Do not add an animation library until the repository audit establishes a real need; CSS transitions/keyframes are the baseline for web-rendered surfaces.

### Required motion mapping

| Trigger | Motion | Functional truth |
|---|---|---|
| Screen enters | Subtle opacity/short vertical translation, 150–250 ms | Content is visible; not a claim about data being loaded. Respect reduced motion. |
| Button press | Immediate scale/opacity/colour feedback, about 100–140 ms | Action was pressed; not necessarily submitted or accepted. |
| Form submitting | Stable loading indicator and disabled duplicate-submit behavior | Request is in progress. Button text remains understandable. |
| Data loading | Reserved skeleton/placeholder or clear spinner | Backend data is pending. Avoid skeleton forever; provide timeout/error. |
| Camera opens | Real native camera startup indicator; switch to live preview when ready | Camera is starting/open. No QR validity/attempt has been accepted yet. |
| Local QR decode | Brief frame acknowledgement | QR decoded locally only. Use “Checking QR”/equivalent while awaiting server response. |
| Backend accepts QR | Change to active attempt layout and start deadline using server start/deadline | Only now does the separate 45-second attempt deadline begin. |
| Location check | Step moves from waiting to passed/failed only after a real location result | No fake progress step completion. |
| OS auth | Native `BiometricPrompt` owns the real dialog; app shows waiting/cancel/error state around it | Do not imitate the system prompt in React. |
| Submit attendance evidence | Stable in-progress/reconciling state | Do not mark present. |
| Server confirms committed record | Clear outcome transition, 200–300 ms optional emphasis | This is the only point “Confirmed Present” may appear. Never delay server truth to finish animation. |
| Failure | Short fade/slide of a neutral message, preserve screen context | Failure says what is actually known; not automatic fraud accusation. |
| Expired challenge | Replace active style with clearly expired state | Never leave an expired challenge styled as actionable. |

## 7. Animation engineering and accessibility

- Respect `prefers-reduced-motion` or the equivalent system preference available to the web view. Under reduced motion, replace movement with immediate state changes or short fades; never remove status information.
- Keep a no-animation functional mode for tests and low-performance devices.
- Disable repeated click/submit while the specific mutation is in flight, but never block navigation or the OS back action unnecessarily.
- Do not tie network operations to animation completion callbacks.
- Do not depend on haptics, sound or colour alone for feedback.
- Use haptics only for meaningful actions where supported, and provide equivalent visual/text feedback.
- Check on physical Android devices with 60Hz/low-end devices; look for dropped frames, WebView resize glitches, keyboard jumps and camera preview freezes.
- Avoid animated heights for the entire screen; if expanding/collapsing a small block, preserve scroll position and content accessibility.
- Make timer text update legible and stable; don't animate each second with distracting scale changes.

## 8. Check-in state machine

Represent the flow as explicit typed states (names may adapt to the approved API contract, but semantics must remain):

```text
idle
 -> camera_starting
 -> scanning
 -> qr_submitting
 -> qr_rejected | attempt_accepted
attempt_accepted
 -> location_pending and/or native_auth_pending
 -> evidence_submitting
 -> confirmed | retryable_failure | rejected | expired | needs_review | unknown_reconciling
unknown_reconciling
 -> confirmed | rejected | retryable_failure | needs_review
```

Rules:
- QR local detection is not `attempt_accepted`.
- The server's response is the source of the attempt ID, attempt start time and deadline.
- Do not derive a trusted deadline from the device wall clock. Use server timestamps and a monotonic client elapsed-time estimate for display; on app resume/reconnection, reconcile against the backend.
- QR expiry (90s) controls whether a new attempt can start; attempt deadline (45s) controls an already accepted attempt. They are distinct.
- A valid in-progress attempt remains valid until its own deadline even if the displayed QR rotates.
- Unknown commit outcome must reconcile by attempt/record ID before another create/submit.
- Server response enums should drive outcome visuals; unknown enum values must fail to a safe “Unable to confirm / checking status” state, not map to success.

## 9. Accessibility and visual QA

- Use 48 × 48 dp minimum targets; test touch spacing as well as target size.
- Check WCAG 2.2 AA contrast reference targets; use Android screen reader semantics and accessible names.
- Support larger fonts/OS scaling without clipped fields or timer/status text.
- Keep high-priority scanner instructions/timer readable outdoors.
- Ensure camera permission denied, location denied, settings-return, secure-lock missing, auth cancellation, network timeout and app pause/resume have user-readable recovery.
- Do not use red as the only failure signal or green as the only confirmation signal.
- Compare every approved screen screenshot against a real-device render and record differences with severity and fix decision.

## 10. UI acceptance gate

Do not call UI phase done unless:

- every approved Stitch screen is mapped to an actual route/component or a listed, owner-approved deferral;
- core design tokens are centralized and no unexplained per-screen palette/spacing drift exists;
- all required component states are included;
- motion is smooth, purposeful, non-blocking, and reduced-motion-aware;
- there are no invented success/error/backend states;
- scanner, timer and outcome use actual backend state contracts;
- at least one smaller Android device and one common-size device have been checked, with font scaling and reduced motion reviewed;
- screenshot comparison and build/test output are linked in the phase report.

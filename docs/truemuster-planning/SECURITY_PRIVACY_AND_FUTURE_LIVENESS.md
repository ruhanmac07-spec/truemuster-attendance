# TRUEMUSTER — Security, Privacy and Future Face-Liveness Architecture

**Version:** 1.0 · **Date:** 10 October 2026  
**Status:** v1 security baseline plus future-only architecture boundary. This is not a security certification or legal opinion.

## 1. v1 biometric boundary — strict

**Facial verification and liveness are entirely out of prototype v1.0.** Do not capture faces, upload enrollment photos, build face embeddings/templates, perform face matching, run anti-spoof models, or request front-camera permission for face verification. Do not install ML Kit face or OpenCV face-recognition/liveness dependencies as part of v1 simply to prepare for a hypothetical future feature.

Current device authentication uses AndroidX `BiometricPrompt` with the approved secure device-credential fallback and an Android Keystore-protected registered device key. A phone fingerprint/face unlock confirms use of the phone's local authenticator; it does **not** match the student against a college identity photo and is not called “face recognition.”

The organizer's references to face recognition, 3D liveness and under-three-second verification are recorded as future-phase/organizer-alignment items. Ask whether these are mandatory judging criteria or recommended technologies before changing v1 scope. The finalized prototype baseline remains authoritative until an approved revision is made.

## 2. Future extension point: `ILivenessVerifier`

Keep future biometric work behind a small application port instead of coupling UI, attendance business rules or database schema to a specific ML model or vendor. In v1 the port can be documented and type-designed, but it is **not invoked** by attendance and returns no positive result. No camera or biometric processing is activated by the hook.

Illustrative TypeScript contract (adapt naming to actual repo conventions after the audit):

```ts
export type LivenessCapability =
  | "not-configured"
  | "on-device"
  | "server-assisted";

export type LivenessOutcome =
  | "not-configured"
  | "pass"
  | "fail"
  | "inconclusive"
  | "unavailable";

export interface LivenessRequest {
  // Opaque future correlation IDs only; never put raw biometric data in ordinary logs.
  verificationAttemptId: string;
  policyVersion: string;
  challengeId: string;
}

export interface LivenessResult {
  outcome: LivenessOutcome;
  reasonCode?: string;
  evaluatedAt?: string; // server/trusted timestamp only if actually available
  providerId?: string;
  modelVersion?: string;
}

export interface ILivenessVerifier {
  readonly capability: LivenessCapability;
  verify(request: LivenessRequest): Promise<LivenessResult>;
}
```

Rules for v1:
- `capability` is `not-configured`.
- A not-configured hook must return `outcome: "not-configured"` or a typed feature-unavailable error; it must never return `pass` or fall back to a fake-success mock in production.
- The v1 attendance workflow does not call `verify` and is not blocked by this interface.
- The hook must not accept raw face images in the general domain layer. If future work requires image/video bytes, use a separately reviewed, narrowly scoped secure adapter and transport contract.
- A unit-test fake may simulate outcomes only in tests, with explicit test-only naming and prevention from shipping in production bundle.

Face matching and liveness are different problems. If future face identity matching is approved, create a separate `IFaceMatcher`/identity-provider boundary rather than treating liveness as proof that a person is the enrolled student. Both outcomes must be independently validated and then interpreted by an approved policy.

## 3. Future liveness options to evaluate — not chosen

Possible future provider categories:
- **On-device:** model runs within app/device. Evaluate package size, device performance, anti-tamper risk, device coverage, model/license provenance and ability to validate spoof attacks.
- **Server-assisted:** native client captures only the approved challenge material, uploads through a short-lived authenticated flow, provider returns decision/metadata. Evaluate latency, bandwidth, data residency, vendor retention, breach surface and service availability.
- **Hybrid:** lightweight on-device guidance plus server-validated challenge/decision. Evaluate complexity and whether it meets the actual attack model.

No option is selected now. Do not assume OpenCV or basic face detection is a 3D liveness engine. Ordinary 2D face detection finds faces/features; that does not establish identity or guarantee photo/screen-replay resistance. A literal 3D depth requirement may demand compatible depth hardware or a specialized vetted SDK. Confirm the organizer's wording before implementation.

## 4. Future-phase entry gates

Before any real face processing:

1. Written scope approval by product owner and institution; identify whether the organizer actually requires the capability.
2. Privacy notice, lawful/appropriate basis, consent/alternative process and institutional retention/access policy reviewed by qualified stakeholders.
3. Threat model covering printed photos, phone/screen replay, recorded video, masks/3D displays as relevant, virtual camera/tampering, injection, network replay and adversarial retries.
4. Model/SDK/vendor review: source/provenance, licence/commercial-use rights, update process, supported Android devices, dependency security, data residency, retention/deletion, subcontractors and incident terms.
5. Real-device pilot with consenting volunteers and varied lighting, camera quality, pose, skin tone and accessibility needs. Measure false-accept, false-reject, inconclusive/unavailable rates, genuine/attack latency and spoof attempt outcomes. No fabricated metrics.
6. Defined threshold calibration and human review/non-biometric exception path, with accessibility and fairness review.
7. Retention implementation and deletion tests verified across live systems, object storage, logs, backups and provider retention.
8. Security/privacy sign-off, incident response and rollback before any production feature flag is enabled.

The organizer's `< 3 seconds per student` requirement must be given a measurable definition first (for example, just verification service time vs. complete check-in duration). Benchmark on supported real devices and actual network conditions; report median and p95, do not promise a target without evidence.

## 5. Privacy defaults inherited from v1 baseline

These are planning defaults requiring institutional review, not a legal opinion:
- No facial data is collected in v1.
- If face verification is later approved, prefer discarding temporary live capture immediately after the decision and no later than 15 minutes under the baseline default.
- Proposed admin reference photo deletion within 30 days after successful enrollment unless a documented/approved need exists.
- Do not persist face embeddings/templates by default; if ever proposed, require a separate justification, encryption/access/retention/deletion review.
- Store exact GPS coordinates only as necessary and delete within 30 days under the baseline default; retain coarse outcome/distance band/accuracy up to 180 days, subject to policy review.
- Verification metadata up to 180 days; attendance records proposed 3 academic years after academic-year end; sensitive audit events proposed 2 years; account/device metadata de-identified/deleted within 1 year after exit unless an approved hold/policy requires otherwise.
- Delete live data does not mean deleted from backups; implement the approved backup expiry lifecycle and verify it.

## 6. Security controls for v1

### Identity and authorization
- Use Supabase Auth session. Role and assignments are read/validated server-side.
- Do not trust user-supplied role, student ID, teacher ID, section assignment, status or schedule.
- Default deny; least privilege; RLS on exposed tables and direct API deny tests.
- UI hiding is convenience, not security. Test APIs directly as each role.

### Device binding
- Generate an asymmetric key pair using Android Keystore. Prefer hardware-backed keys when available, record capability, and do not promise hardware backing on every device.
- Register the public key by a server challenge. Keep private key material out of JavaScript persistent storage and avoid export.
- Use OS authentication to require local user verification before key use where the selected Android API/key configuration supports it; verify native behavior on supported OS versions.
- Backend creates a short-lived, single-use challenge bound to the attempt, student/device key, action and deadline; backend verifies signature and active/revoked status.
- Revoke lost/replaced device keys server-side. Local app clearing/reinstalling cannot override registration.
- Do not use IMEI or IP address as the primary permanent device identity. If Play Integrity is later adopted, treat it as an additional risk signal, not student identity or campus-presence proof.

### QR and attendance
- High-entropy opaque QR challenge, no PII, server-issued/server-expiring, session-bound and single-use for starting new attempts.
- Rate limit starts/submissions; record attempt IDs and minimal reason codes.
- Server owns both expiry clocks and final decision; client timers are display-only.
- Unique DB constraint and transaction prevent duplicate attendance.
- Unknown outcome uses reconciliation/idempotency; do not auto-create a second record.

### Secrets and build artifacts
- Publishable Supabase key only in client runtime config; RLS and grants must be correct.
- Secret/service-role/database/signing keys only in trusted backend/secret storage; no secrets in `VITE_` variables, Android assets, Tauri frontend bundle, README or Git.
- `.env.example` contains names only; `.env`, local secrets, keystores, signing files and provider credentials are ignored.
- Run secret scanning before pushes and inspect built JS/app package when practical.

### Logs and privacy
- Never log passwords, access/refresh tokens, private keys, raw QR tokens, full face captures or excessive location data.
- Use request/correlation IDs, non-sensitive status/reason codes, timestamps, attempt IDs and bounded accuracy/distance information only to the approved extent.
- Admin exports, device recovery, role/policy changes, manual adjustments and privileged read actions must be auditable.

## 7. Fail-safe behavior

- No network: not confirmed; retry/reconcile or audited Teacher exception.
- Unavailable/inaccurate location: retry or controlled review, not automatic fraud accusation.
- Cancelled native authentication: authentication incomplete; retry only if policy/time permits.
- Revoked device: reject; route to Admin recovery.
- Unknown status from server: safe non-confirmed/reconciling UI and telemetry.
- Future liveness unavailable/inconclusive (future phase): no silent pass; apply the separately approved fallback/review route.

## 8. References to verify at implementation time

- [Supabase securing your data](https://supabase.com/docs/guides/database/secure-data)
- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase Edge Function authentication](https://supabase.com/docs/guides/functions/auth)
- [Capacitor native Android code](https://next.capacitorjs.com/docs/next/android/custom-code)
- [Android BiometricPrompt reference](https://developer.android.com/reference/android/hardware/biometrics/BiometricPrompt)

The current official documentation and versioned package behavior must be verified when implementation begins.

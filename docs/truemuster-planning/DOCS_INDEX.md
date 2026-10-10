# TRUEMUSTER Documentation Index

## Start here

1. `ANTIGRAVITY_MASTER_PROMPT.md` — copy its prompt into Antigravity for Phase 0.
2. `PLAN.md` — phased delivery plan and stage gates.
3. `PRD.md` — functional and non-functional product requirements.
4. `ARCHITECTURE.md` — selected architecture, system boundaries and suggested repo layout.
5. `DECISIONS_AND_OPEN_QUESTIONS.md` — locked decisions and genuine open questions.

## During implementation

- `ANDROID_UI_IMPLEMENTATION_AND_MOTION.md` — Stitch-to-code design fidelity, component library and Android motion/animation system.
- `SUPABASE_BACKEND_AND_DATABASE.md` — database entities, invariants, API surface, RLS and API key policy.
- `SECURITY_PRIVACY_AND_FUTURE_LIVENESS.md` — v1 security plus future-only `ILivenessVerifier` hook.
- `TESTING_AND_ACCEPTANCE.md` — automated, adversarial, device and pilot acceptance tests.
- `README.md` — starter README; Antigravity must update setup commands from the actual repo and verify them.

## Source context included in the pack

- Android: `source_docs/android/TRUEMUSTER_Android_DESIGN_SYSTEM.md`, `source_docs/android/TRUEMUSTER_STUDENTAPP_UX.md`.
- Windows: `source_docs/windows/TRUEMUSTER_Windows_DESIGN_SYSTEM.md`, `source_docs/windows/TRUEMUSTER_ADMIN_WINDOWS_UX.md`, `source_docs/windows/TRUEMUSTER_Windows_UI_UX_File_Structure.md`.
- Requirements: `source_docs/baseline/College_Attendance_System_Prototype_Requirements_v1.1_FINALIZED_BASELINE.pdf` is the current policy baseline. The older `Campus_Attendance_Integrity_System_Blueprint_v1.0.pdf` is context only where consistent with v1.1.

## Architecture reminders

- React + TypeScript + Vite UI; Capacitor/native Android; Tauri 2 Windows; Supabase Auth/PostgreSQL/RLS/Edge Functions.
- Do not switch to React Native, MongoDB or a separate Node backend without approved ADR.
- No facial data/liveness/offline attendance in v1.
- QR TTL 90 seconds; 45-second attempt deadline starts only after server accepts QR and creates the attempt.
- Attendance is confirmed only after server commit; failure is not automatically fraud.

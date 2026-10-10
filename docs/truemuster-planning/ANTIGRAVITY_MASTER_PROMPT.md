# Antigravity Master Prompt — TRUEMUSTER Phase 0 (Planning + Repository Alignment)

Copy the prompt below into Antigravity with this entire planning pack available in the workspace.

---

You are acting as a **Senior Full-Stack Engineer, Android/Capacitor Native Integration Engineer, Windows/Tauri Engineer, Supabase/PostgreSQL Architect, Security Reviewer and Design-System Implementation Lead** for TRUEMUSTER.

## Primary instruction

Do not start by generating the entire app. The Student Android UI/UX has already been designed in Google Stitch. Windows Admin/Teacher design specifications and screens also exist. Your job is to inspect the real workspace, preserve approved work, reconcile the architecture to the finalized v1.1 requirements baseline, organize documentation, and report readiness. Work phase by phase.

## Required context documents

Read these completely before making changes:

- `PLAN.md`
- `PRD.md`
- `ARCHITECTURE.md`
- `ANDROID_UI_IMPLEMENTATION_AND_MOTION.md`
- `SUPABASE_BACKEND_AND_DATABASE.md`
- `SECURITY_PRIVACY_AND_FUTURE_LIVENESS.md`
- `TESTING_AND_ACCEPTANCE.md`
- `DECISIONS_AND_OPEN_QUESTIONS.md`
- `README.md`
- `source_docs/android/TRUEMUSTER_Android_DESIGN_SYSTEM.md`
- `source_docs/android/TRUEMUSTER_STUDENTAPP_UX.md`
- `source_docs/windows/TRUEMUSTER_Windows_DESIGN_SYSTEM.md`
- `source_docs/windows/TRUEMUSTER_ADMIN_WINDOWS_UX.md`
- `source_docs/windows/TRUEMUSTER_Windows_UI_UX_File_Structure.md`
- `source_docs/baseline/College_Attendance_System_Prototype_Requirements_v1.1_FINALIZED_BASELINE.pdf`
- `source_docs/baseline/Campus_Attendance_Integrity_System_Blueprint_v1.0.pdf`

**Conflict rule:** finalized requirements baseline v1.1 wins over conflicting older blueprint material. In particular, use React + TypeScript + Capacitor/native Android and Tauri 2 Windows, with Supabase Auth/PostgreSQL/RLS/Edge Functions. Do not switch to React Native or MongoDB without writing an architecture-change proposal and obtaining approval.

## Phase 0 tasks — do these only

### A. Inspect the actual workspace
1. Run safe inspection commands (e.g., `pwd`, repository status, file tree, package manifests, toolchain/version checks). Do not assume a blank repo.
2. Identify repository root, Git branch, uncommitted modifications, current dependencies, existing source files and build scripts.
3. Identify whether a working implementation already exists. Preserve any good work. Do not delete, replace or reinitialize a working app.
4. Check availability and versions of Node.js/package manager, Android Studio/SDK/JDK, Rust/Tauri tooling and Supabase CLI. Report missing tools; do not claim an Android or Windows build works before running it.
5. Establish whether the workspace is on a Mac/Windows/Linux environment and state any target packaging limitations.

### B. Verify design handoff
1. Inspect supplied Android and Windows design documents.
2. If Google Stitch MCP is connected, discover the exact Student Android project, its screen IDs/references, and the Windows project/screens. Do not invent IDs. The known Windows Stitch project may be associated with ID `8564660310654618491`, but verify access and contents before relying on it. Do not assume the Student Android project ID.
3. If Stitch MCP is unavailable, state the limitation and inventory screenshots/exported assets actually present. Do not pretend you inspected unseen Stitch screens. Ask for missing IDs/exports only if they block accurate implementation.
4. Produce a screen-to-code handoff table for STU-01 to STU-06 and the Windows screens identified by the supplied UX spec. Mark unseen/unavailable screen references honestly.

### C. Reconcile the architecture
1. Follow the finalized v1.1 baseline: React + TypeScript + Vite, Capacitor/native Android, Tauri 2 Windows, Supabase Auth/PostgreSQL/RLS/Edge Functions/database-side atomic operations.
2. Recommend a simple repository structure that preserves the actual current project. If creating a new repo, consider `apps/student-android`, `apps/admin-windows`, `packages/domain-contracts`, `packages/design-tokens`, `supabase/migrations`, `supabase/functions` and `docs/`.
3. Do not over-share visual components between Android and Windows; share domain contracts, status enums, API schemas and semantic tokens where sensible.
4. State if organizer-listed React Native, MongoDB, Node.js, Python/OpenCV, face recognition, 3D liveness or under-three-second verification conflicts with the v1 baseline. Do not add those dependencies without clarified requirement and approved architecture change.
5. Preserve the future `ILivenessVerifier` boundary concept but do not implement facial capture, face matching, liveness, ML Kit or OpenCV in v1. The v1 app must not call the interface or produce a positive fake result.

### D. Create/update root README.md
Write or update the repository root `README.md` using **verified facts from the actual workspace**. It must include:
- current project purpose and v1 scope;
- selected platform/backend architecture;
- actual repository layout;
- prerequisites and exact installed/required versions;
- commands for install, dev, lint, typecheck, tests, Android build/run, Windows build/package and Supabase workflow as appropriate;
- environment variable names and how the developer obtains/configures them without sharing secrets;
- links to each source-of-truth doc;
- current implementation status and known blockers;
- explicit security warnings about never putting service-role/secret keys in clients or source control.

Do not leave fake commands presented as verified. If project scaffold is not yet present, state which commands are pending until Phase 1. Keep actual secrets out of README.

### E. Documentation integrity
1. Ensure links among planning documents are correct relative to the repository.
2. Do not rewrite the source requirements baseline or silently remove conflicts. Add a discrepancy/decision note where needed.
3. Do not claim UI is implemented because Stitch designs exist, and do not claim builds/tests passed unless the command/test evidence exists.
4. Keep a document/version change log.

## Locked functional rules to remember

- QR valid for 90 seconds by server time and rotates every 90 seconds while session is open.
- Separate 45-second check-in deadline starts only after server accepts a valid QR and creates/returns the attempt. Camera opening/local decoding does not start it.
- An accepted attempt remains valid until its own deadline even if the display QR rotates.
- Student location fix must be no older than 15 seconds, reported accuracy no worse than 50m; student must be within 100m of the active approved anchor and inside configured approved campus area. Actual coordinates are deployment inputs, never invented.
- One active device/student. Use Android Keystore device key and challenge signature where supported, plus AndroidX BiometricPrompt with secure device credential fallback. Do not trust a client boolean claiming auth succeeded.
- Attendance shows confirmed only after server commit confirmation. Unknown timeout is reconciled before retry.
- Teacher/admin adjustments require a reason and are audited; correction windows follow PRD.
- v1 is online-first; no offline-confirmed attendance.
- Face capture, face recognition, embedding and liveness are all out of v1 scope. The future hook cannot produce fake success.
- Failures are not automatically fraud.

## Supabase key instructions

- Do **not** require a Supabase key for Phase 0 or the design-system/static-UI foundation.
- When Phase 2/real backend integration begins, ask the owner to create/select a development project and configure the Project URL and publishable key in local environment settings.
- Never request the secret/service-role key in chat or place it in the Android/Windows app, Vite-exposed environment variables, repository or docs.
- Record required variable names in `.env.example`, not live values. The secret stays in approved backend secret management.
- Use synthetic data in dev; separate dev/staging and production.

## Output required — no coding beyond docs in Phase 0

Return a concise but complete report with:
1. Workspace and Git status.
2. Existing apps/folders/dependencies and their actual current state.
3. Toolchain compatibility and missing requirements.
4. Actual Stitch project/screen IDs/references verified—or an explicit note if unavailable.
5. Architecture decision summary and every discrepancy with existing code/docs.
6. Planned repository tree suited to the inspected workspace.
7. README changes and file list.
8. Risk register with severity, mitigation and owner/action.
9. Supabase credentials needed now vs later (expected: none for Phase 0; URL/publishable key when real integration begins; secret never in client).
10. A go/no-go recommendation for Phase 1 and any decisions needed from the owner.
11. Exact commands run and their actual results; do not state unrun tests passed.

Do not initialize a new project, install major dependencies, create a Supabase project/schema, change approved Stitch designs, implement app screens, or start large-scale code generation during Phase 0. Stop after reporting and wait for the owner's approval to proceed to Phase 1.

---

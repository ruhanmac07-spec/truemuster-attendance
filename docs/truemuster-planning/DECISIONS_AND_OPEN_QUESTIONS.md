# TRUEMUSTER — Decisions, Assumptions and Open Questions

**Version:** 1.0 · **Date:** 10 October 2026

## 1. Selected decisions for prototype v1.0

| ID | Decision | Status | Notes |
|---|---|---|---|
| D-001 | One Student Android app + one Admin/Teacher Windows executable share a backend/database | Locked | Finalized v1.1 baseline. |
| D-002 | React + TypeScript + Vite for UI surfaces | Locked | Use separate application screens and platform shells. |
| D-003 | Capacitor/native Android, not React Native, for v1 | Locked | Explicit v1.1 baseline. Revisit only with owner approval and a concrete blocker. |
| D-004 | Tauri 2 for Windows desktop package | Locked | Signed Windows 11 x64 primary baseline. |
| D-005 | Supabase Auth + PostgreSQL + RLS + Edge Functions + DB-side atomic operations | Locked | Do not use a second database by default. |
| D-006 | 90-second server-timed QR validity and rotation | Locked | One active challenge/session for new attempts. |
| D-007 | 45-second deadline starts only after server accepts QR and creates/returns attempt | Locked | Camera open/local QR decode do not start it. |
| D-008 | Initial 100m location threshold; fix age ≤15 seconds; reported accuracy ≤50m | Locked planning defaults | Real class/campus anchors and behavior require on-site validation. |
| D-009 | One active device per student; admin-controlled replacement; old binding revoked | Locked | Enforce server/database side. |
| D-010 | AndroidX BiometricPrompt with secure device credential fallback allowed | Locked | Require supported secure lock; device unlock is not student face matching. |
| D-011 | Face recognition/liveness is out of v1 | Locked | No face capture/photos/embeddings/models in v1. Future hook only. |
| D-012 | Online-first only; no offline-confirmed attendance | Locked | Future LAN/device queue are separate phases. |
| D-013 | Attendance success only after DB commit confirmed | Locked | Timeout means reconcile first; UI animation is never authoritative. |
| D-014 | Reason-required, audited manual adjustments and defined correction windows | Locked | See PRD/baseline. |
| D-015 | Private GitHub repository as source of truth | Locked direction | Actual repo existence/branch protection to confirm during audit. |
| D-016 | Animation uses semantic tokens, transforms/opacity where suitable, reduced-motion mode | Locked design intent | Do not add a complex animation library unless audit identifies a need. |
| D-017 | MongoDB/Python/OpenCV/Node.js are not added merely because organizer lists them | Pending organizer interpretation | Ask if any specific stack item is mandatory; if yes, prepare architecture change proposal. |

## 2. Supabase credential decision

- **Not needed now** for this documentation pack, repository audit, UI design system or an entirely synthetic UI shell.
- **Needed for real backend integration:** a development Supabase project URL and publishable key, plus appropriate Auth/RLS configuration.
- **Never place in a client:** Supabase secret/service-role key, database credentials, private signing keys or other backend secrets.
- If a production/migration task requires a privileged secret, Antigravity must provide manual instructions for entering it into an approved secret manager; do not ask the user to paste it into the conversation.
- Use separate development/staging and production projects. Do not create a production project based solely on this planning document.

## 3. Required workspace audit findings

Antigravity must report and verify these instead of assuming:

- Does a Git repository already exist? What branch and uncommitted changes exist?
- Is it a blank workspace or an existing application? Which files are already present?
- Are the supplied planning and design docs available in the workspace or only in this pack?
- What are the actual Google Stitch project ID and each generated Android/Windows screen ID? Is Stitch MCP enabled and authenticated?
- Is the Windows screen portfolio fully generated or only specified in Markdown?
- Which Node.js/package manager/Java/Android Studio/SDK/Rust/Tauri/Capacitor versions are installed and compatible?
- Does current code already use React Native or another stack contrary to v1.1? If yes, report trade-offs and migration impact; do not auto-rewrite.
- Do package/library versions support required camera, location, Android Keystore, BiometricPrompt and target Android APIs? Prove via docs/mini-spike before relying on them.
- Is Android/Windows packaging/build tooling available on the current developer machine? A Mac can build Android when Android SDK/JDK/Android Studio tooling is configured; Windows installer/signing still needs a supported Windows build environment or CI.
- Does Supabase project exist yet? Never assume it does.
- Is organizer's technology list mandatory or recommended, and what exactly does “3D liveness” and “under 3 seconds” mean?

## 4. Deployment inputs required before a pilot

- Authorized campus boundary and exact classroom anchor coordinates, verified on site.
- Institution-approved student/teacher identity and email verification procedure.
- Final region/plan/budget and institutional approval for Supabase hosting.
- Institutional data retention, privacy notices, access and deletion policy.
- Supported real-device matrix for Android and actual Windows classroom PCs.
- Live backup destination/credentials supplied through secure setup, and successful restore evidence.
- Student/teacher support contact, incident response, rollback and manual attendance fallback.

## 5. Architecture change request template

Any proposed change to the locked stack/scope must include:

- decision ID and reason;
- baseline requirement it changes;
- verified technical blocker or measurable benefit;
- alternatives considered;
- effects on existing Stitch screens, code, database, privacy, cost, testability and schedule;
- migration/rollback plan;
- required organizer/institution approval;
- acceptance test proving the change worked.

Do not silently add React Native, MongoDB, Node.js, OpenCV, a face SDK, offline attendance or another database.

## 6. Organizer clarification questions

1. Are React Native, Node.js, MongoDB, Python/OpenCV and face recognition mandatory technologies or merely recommended examples?
2. Does “3D liveness” require actual depth sensing, or is a vetted anti-spoof SDK accepted? Which Android devices are assumed?
3. Does “verification throughput < 3 seconds per student” measure biometric verification time only or the whole QR/location/authentication check-in?
4. Is face-liveness a must-have for judging now, while v1 system baseline excludes it, or is it acceptable to present it as a future approved phase? Obtain written clarification before scope change.

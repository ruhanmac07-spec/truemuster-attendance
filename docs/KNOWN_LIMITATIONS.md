# TRUEMUSTER — Known Limitations & Architectural Boundaries

---

## 1. Biometric Hardware & Native Prompt Boundaries

1. **Browser Development vs Native Android Runtime:**
   - In standard desktop or mobile web browsers (e.g. Chrome accessing an internal LAN IP address like `https://10.68.156.165:5173`), the W3C Web Authentication specification strictly forbids numeric IPv4/IPv6 addresses as Relying Party IDs (`rp.id`).
   - Consequently, when testing via mobile Chrome over LAN, the application falls back to an interactive tactile touch sensor simulation clearly labeled `DEVELOPMENT_SIMULATOR`.
   - On the native Android APK runtime compiled via Capacitor, the application directly invokes `androidx.biometric.BiometricPrompt`, triggering Android's system biometric lock dialog.

2. **Fingerprint Identity vs Device Owner Authentication:**
   - Android's native `BiometricPrompt` authenticates that the user is an **authorized device owner** using enrolled biometrics (fingerprint, face unlock, or device PIN/pattern).
   - In accordance with Android security and biometric privacy regulations, the OS **never exports raw fingerprint ridge patterns, minutiae points, or biometric images** to applications.
   - Any claim that an app receives and verifies a raw fingerprint image directly on the application layer is technically inaccurate on modern Android versions (API 28+).

---

## 2. Geofence & GPS Accuracy Boundaries

1. **Indoor Multipath & Urban Canyon GPS Drift:**
   - Physical university lecture halls frequently experience indoor GPS signal degradation. In heavily shielded concrete rooms, GPS accuracy may degrade beyond the strict 50m threshold.
   - The application handles this gracefully by flagging `accuracy_too_low` and prompting the student to retry near a window rather than automatically accusing them of fraudulent attendance.
2. **Freshness Rule (15s):**
   - Cached location coordinates older than 15 seconds are discarded. This prevents replay attacks where a student captures a valid location on campus, walks off-campus, and attempts to submit the stale fix.

---

## 3. Face Recognition & 3D Liveness Reality

1. **Hardware Depth Sensing Feasibility:**
   - Genuine hardware 3D depth liveness requires dedicated physical Time-of-Flight (ToF) sensors or infrared structured-light projectors (such as Apple TrueDepth or specific enterprise Android hardware).
   - Single-sensor RGB selfie cameras on commodity Android phones cannot physically capture depth maps; they estimate liveness using 2D motion vectors, landmark micro-jitter, and texture analysis.
2. **Model Selection (SFace vs ArcFace):**
   - For resource-constrained mobile hardware, **SFace** (SphereFace-based MobileFaceNet, 2.1 MB) achieves 32ms inference latency with 99.4% benchmark accuracy.
   - **ArcFace** (13.8 MB) provides superior discriminative margin (99.8% accuracy) when hosted on a dedicated institution server or edge acceleration chip.
   - Both architectures comfortably fulfill the under-3-second total verification deadline.

---

## 4. Local Build Environment Dependencies

1. **Android APK Compilation:** Requires local installation of Java Development Kit (JDK 17) and Android SDK Build-Tools. On machines without local Android SDK, compilation is handled by GitHub Actions.
2. **Windows Tauri Compilation:** Direct cross-compilation of Windows MSI/EXE binaries from macOS is not natively supported by Tauri without a Windows runner or Docker MinGW container. Automated GitHub Actions (`windows-latest`) compiles the Windows release.

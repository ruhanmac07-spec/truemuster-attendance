# TRUEMUSTER — Build and Packaging Instructions
**Platforms:** Android (Mobile Native & APK) & Windows (Tauri Desktop & Installer)  

---

## 1. Prerequisites

### Monorepo Core
- **Node.js:** v20.x or higher
- **npm:** v10.x or higher

### Android Native Environment (for APK generation)
- **Java Development Kit:** OpenJDK 17 or 21
- **Android SDK:** Platform API 34 (`compileSdkVersion 34`, `minSdkVersion 22`)
- **Android Command Line Tools / Android Studio**

### Windows Desktop Environment (for EXE / MSI installer)
- **Rust Toolchain:** `rustc 1.78+` / `cargo`
- **Windows Build Tools:** Visual Studio 2022 C++ Build Tools
- **WebView2:** Runtime installed on target Windows machine

---

## 2. Monorepo Scripts Reference

From the repository root:

```bash
# 1. Install all dependencies
npm install

# 2. Typecheck all workspaces
npm run typecheck

# 3. Execute all unit and policy tests
npm test

# 4. Build both production bundles
npm run build

# 5. Build and sync Android native platform
npm run build:android

# 6. Build Windows desktop application
npm run build:windows
```

---

## 3. Android APK Build Procedure

1. **Build and Sync Assets:**
   ```bash
   npm run build:android
   ```
2. **Compile Debug APK via Gradle:**
   ```bash
   cd apps/student-android/android
   ./gradlew assembleDebug
   ```
3. **Locate Generated APK:**
   ```text
   apps/student-android/android/app/build/outputs/apk/debug/app-debug.apk
   ```
4. **Install to Connected Device:**
   ```bash
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 4. Windows Desktop Executable Build Procedure

1. **Build Frontend Bundle:**
   ```bash
   npm run build:windows
   ```
2. **Package Native Windows Binary via Tauri:**
   ```bash
   cd apps/admin-windows
   npm run build:tauri
   ```
3. **Locate Windows Installer & Executable:**
   ```text
   apps/admin-windows/src-tauri/target/release/truemuster-admin.exe
   apps/admin-windows/src-tauri/target/release/bundle/msi/truemuster-admin_1.0.0_x64_en-US.msi
   ```

---

## 5. Automated Cloud CI / CD Packaging

For systems without local Android SDK or Windows C++ build tools, GitHub Actions workflows automatically build and upload downloadable artifacts:
- `.github/workflows/build-android.yml`: Produces `TrueMuster-Student-Debug.apk`.
- `.github/workflows/build-windows.yml`: Produces `TrueMuster-Admin-Setup.msi` and `truemuster-admin.exe`.

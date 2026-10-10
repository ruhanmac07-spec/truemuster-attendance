# TRUEMUSTER Student Android — Design System

**Product:** TRUEMUSTER — Smart Attendance System  
**Platform:** Student Android application only  
**Design tool:** Google Stitch  
**Implementation handoff:** Antigravity  
**Version:** 1.0 · **Status:** Draft pending visual/device review  
**Date:** 9 October 2026

> This document defines the Android Student app's visual language, components, touch ergonomics, motion and accessibility. It does not define Windows desktop styling, APIs or backend policy. The approved PRD, attendance workflow, permissions policy and API contracts remain authoritative for product behaviour.

## 1. Design intent

TRUEMUSTER Student should feel **aesthetic, distinctive, minimal, premium, fluid and fast**—not a generic attendance utility or a mobile version of the Windows dashboard. The UI should communicate what class is next, what action is available, and whether a check-in is scanning, being verified, pending, confirmed or unsuccessful.

### Principles

1. **Distinctive but restrained:** strong type, intentional composition, calm surfaces and restrained red accents; no decoration without a purpose.
2. **Motion with meaning:** transitions explain state change. Animation must not delay camera scanning, validation or confirmation.
3. **One primary action:** make the next step clear, especially on Home and QR Scanner.
4. **Native-feeling Android:** respect system permissions, back navigation, display insets, accessibility settings, `BiometricPrompt` and Android interaction expectations.
5. **Outdoor readability:** strong text contrast and readable timers/statuses in bright light.
6. **Truthful trust states:** only show attendance as confirmed after the backend confirms the committed record.
7. **Privacy by default:** request camera/location contextually and do not collect unnecessary data.
8. **Recoverability:** explain failed checks neutrally and provide a policy-approved retry or review path.

**Desired:** modern, editorial, clear, polished, credible and welcoming.  
**Avoid:** neon/glow, cyberpunk, excessive glassmorphism, 3D illustrations, generic AI imagery, giant mascots, over-rounded everything, noisy gradients, fake stats, aggressive gamification and routine confetti.

## 2. Brand and colour system

The shared brand direction is deep navy + white + restrained red. These are **draft tokens**, not verified official university brand specifications. Review and validate in Stitch before locking them.

### Core palette

| Token | Draft value | Intended use |
|---|---|---|
| `color.brand.navy` | `#001C5A` | Brand anchor, primary action/background where contrast passes |
| `color.brand.navy-strong` | `#07162F` | High-emphasis ink and deep details |
| `color.brand.blue-soft` | `#EAF0FB` | Calm selected surfaces and low-emphasis emphasis |
| `color.brand.red` | `#E21E2B` | Restrained accent and meaningful emphasis; provisional |
| `color.surface.canvas` | `#F5F7FA` | Light-theme canvas |
| `color.surface.card` | `#FFFFFF` | Main content surfaces |
| `color.surface.subtle` | `#EEF2F7` | Secondary grouping |
| `color.text.primary` | `#172033` | Main text |
| `color.text.secondary` | `#526078` | Supporting text and metadata |
| `color.text.inverse` | `#FFFFFF` | Text on sufficiently dark surfaces |
| `color.border.default` | `#DCE3ED` | Dividers and component boundaries |
| `color.focus.ring` | `#2563EB` | Visible focus where relevant |

### Semantic tokens

| Token | Draft value | Meaning |
|---|---|---|
| `color.status.success` | `#167647` | Confirmed/completed |
| `color.status.warning` | `#9A5800` | Pending review/attention |
| `color.status.error` | `#B4232C` | Failed, expired or blocked |
| `color.status.info` | `#1D4ED8` | Guidance/information |
| `color.status.neutral` | `#526078` | Unknown/inactive/neutral |

### Colour-use rules

- Navy is the stable brand anchor; white/soft neutral surfaces keep the interface calm.
- Red is an accent, not the default colour for every button, icon, border or card.
- Pair semantic colour with a readable label and/or meaningful icon. Never communicate critical state by colour alone.
- Light appearance is the primary v1 direction for outdoor readability. Keep tokens semantic so dark appearance could be added later, but do not expand v1 into full dark-theme support unless approved and tested.
- Avoid gradients as a default. If a subtle tonal transition is tested on a welcome hero, keep it limited and preserve contrast.
- Do not use university logos or imply official endorsement without approved assets and permission.

### Contrast review

Use WCAG 2.2 AA as a reference: target at least 4.5:1 for normal text and 3:1 for large text; also check meaningful boundaries and focus indicators. Test actual combinations such as timer, helper text, buttons, badges, scanner instructions and result tickets. Adjust pairings if needed instead of assuming the brand colours pass everywhere.

## 3. Typography

**Font direction:** prefer Roboto / Android system typography. Inter may be evaluated if required by implementation, but do not mix font families casually. Use weight and hierarchy—not decorative letter spacing—to add character.

| Token | Draft size | Weight | Usage |
|---|---:|---|---|
| `type.display` | 30–32 sp | Semibold | Welcome hero, sparingly |
| `type.screen-title` | 24–26 sp | Semibold | Screen title |
| `type.section-title` | 18–20 sp | Semibold | Section heading |
| `type.card-title` | 16–18 sp | Semibold | Course/class name |
| `type.body` | 16 sp | Regular | Main content |
| `type.body-strong` | 16 sp | Medium/Semibold | Key instruction/value |
| `type.label` | 14 sp | Medium | Form labels/secondary controls |
| `type.meta` | 12–13 sp | Medium | Timestamp/metadata only |
| `type.timer` | 28–36 sp | Semibold | Prominent active countdown |

Rules: respect Android font scaling; avoid fixed-height text containers that clip larger type; keep scanning instructions short; do not use meta-size text for critical states; use tabular numerals for timers where supported.

## 4. Spacing, safe areas and touch ergonomics

Use a 4 dp base unit. Values are starting points and need verification on actual devices.

| Token | Value | Usage |
|---|---:|---|
| `space.1` | 4 dp | Micro gap |
| `space.2` | 8 dp | Compact gap |
| `space.3` | 12 dp | Tight component gap |
| `space.4` | 16 dp | Standard padding |
| `space.5` | 20 dp | Group separation |
| `space.6` | 24 dp | Main section gap |
| `space.8` | 32 dp | Major vertical gap |
| `space.10` | 40 dp | Hero separation |
| `space.12` | 48 dp | Occasional large separation |

- Design for common portrait Android phones first.
- Respect status/navigation bars, gesture insets and display cutouts.
- Aim for **minimum 48 × 48 dp interactive targets**. Separate adjacent high-impact actions.
- Keep primary actions reachable by thumb where practical.
- Use scrollable layouts where content may grow; do not clip content at larger text sizes.
- A bottom action area must respect system insets and never cover content.
- Scanner preview may use the full usable screen, but controls and messages must respect insets.
- Do not squeeze a desktop sidebar onto mobile; use a simple mobile navigation model.

## 5. Signature visual language

TRUEMUSTER should be recognisable through composition and interaction—not decoration.

1. **Confident navy anchor:** consistent brand/action treatment without an oversized navy block on every screen.
2. **Quiet canvas:** clean white surfaces, soft blue/grey grouping and restrained borders.
3. **Editorial hierarchy:** strong title, short context, clear main action.
4. **One focal action:** usually the scan/check-in action when relevant.
5. **Precise verification motif:** stable scan frame and fine-line feedback—not futuristic radar effects.
6. **Outcome clarity:** distinct treatments for confirmed, expired, out-of-bounds, authentication failure and pending.
7. **Motion continuity:** transitions explain where the user moved and what changed.

Suggested shape tokens: `radius.control` around 12–14 dp; `radius.card` around 16–20 dp; sheets/dialogs around 20–24 dp. Keep them consistent. Use elevation only where it conveys hierarchy (e.g. a modal sheet); avoid shadows on every element and do not rely on shadows alone to distinguish controls.

## 6. Icons, assets and content

- Use one consistent outline icon family. Lucide is a candidate for web-based rendering; native Android icons may be preferable for platform-specific controls.
- Pair unfamiliar icons with labels. Do not mix emoji, 3D icons and unrelated icon packs.
- Avoid stock photos, generic AI illustrations and giant mascots as core brand elements.
- Use a text wordmark if no approved logo exists; do not invent an official university logo.
- Use fictional data in Stitch. Do not paste actual student records, phone numbers, enrolment IDs, biometric samples or private location data into design prompts.
- Keep error copy neutral. A failed check is not automatically proof of fraud.

## 7. Reusable components

### Primary action
Use for the screen's main action (e.g. `Scan QR`, `Continue`). Provide default, pressed, focused where relevant, loading and disabled states. Keep the label visible; give immediate press feedback; prevent duplicate submit while in flight. Do not delay completion to finish an animation.

### Secondary and tertiary actions
Secondary supports the primary task. Tertiary is lower-emphasis navigation/context. Keep revoke/destructive actions separate from common actions. Make Back, Cancel and Confirm visually distinct.

### Class/session card
May show course/subject, section, schedule, approved classroom label, session status and one contextual action. Prioritise course name, time and next step; omit internal IDs or raw location data.

### Attendance status
Use a semantic icon and text label alongside colour. Candidate states include `Confirmed`, `Pending`, `Expired`, `Location could not be verified`, `Authentication not completed`, `Session unavailable` and `Needs review`. Use the actual API/policy vocabulary; do not invent or reinterpret outcomes.

### Permission explainer
Before a native system request, briefly explain which permission is needed and why, and what the user can do if it is denied. Invoke the real Android permission system; never imitate it with a fake system dialog.

### QR scanner overlay
Use a clear camera preview, stable high-contrast scan frame, one short instruction and only supported controls (e.g. torch). Distinguish local QR detection from backend acceptance. Start the 45-second attempt countdown only after the backend accepts the valid QR and starts the attempt. Do not animate in a way that obscures QR edges.

### Verification outcome ticket
Present a clear result state, meaningful icon, concise title, class/session context, trusted timestamp where available and one next action. Success can feel satisfying but restrained; no routine confetti or fake success metrics. Failed outcomes explain the actual reason and recovery path.

### Sheets, dialogs and snackbars
Use a sheet for a short contextual choice, a dialog for consequential confirmation, and a snackbar only for brief non-critical feedback. Do not rely on a transient snackbar as the only explanation of an important failure. Respect focus, accessibility and Android back behaviour; avoid nested dialogs.

## 8. Motion and animation system

The target feel is **smooth, premium and purposeful**. Motion supports comprehension and responsiveness; it is not security theatre.

### Timing tokens

| Token | Draft duration | Usage |
|---|---:|---|
| `motion.micro` | 100–140 ms | Press feedback/small state change |
| `motion.quick` | 150–190 ms | Button/card feedback |
| `motion.standard` | 200–260 ms | Screen/content or sheet transition |
| `motion.emphasis` | 280–360 ms | Meaningful major task-state transition only |

These are design starting points, not measured performance results.

### Motion rules

- Prefer natural easing, opacity changes, small translations and subtle scale from about 0.98 to 1.0.
- Avoid bounce-heavy motion, parallax, confetti, looping decoration or sweeping scanner effects.
- Do not animate large tables/lists in ways that make the user's place hard to track.
- Respect Android animation/reduced-motion preferences where available; functionality must remain intact without animation.
- Use haptics only for meaningful events where supported, never on every tap by default.
- Never delay QR decoding, permission handling, network requests or confirmation for an animation.
- A local scan animation must not imply server verification.

| Interaction | Recommended treatment |
|---|---|
| Primary button tap | Immediate pressed state; optional appropriate haptic |
| Open screen | Subtle continuity, around 150–250 ms |
| Expand class detail | Small opacity/height change without layout jump |
| Camera start | Real camera loading feedback, then actual preview |
| QR detected locally | Brief frame acknowledgement; not a success ticket |
| Backend validation | Clear in-progress indicator |
| Server-confirmed attendance | Clean, clear outcome transition; no artificial delay |
| Failure | Preserve context and show retry/recovery action |
| Session expiry | Explicit expired state; never leave stale content styled as active |

A smooth animation that drops frames or delays scanning is a design defect. Measure performance on actual devices; do not claim performance based on mockups.

## 9. Accessibility and privacy

- Use WCAG 2.2 AA as a reference for text/controls; test native Android semantics too.
- Maintain appropriate text contrast and visible focus where applicable.
- Support Android font scaling and avoid clipped labels.
- Provide content descriptions for meaningful icons and accessible status announcements where supported.
- Do not rely solely on colour, animation, sound or haptics.
- Make scan frame, instructions and countdown readable at arm's length and outdoors.
- Request camera when entering QR scanning and location when check-in needs it, unless an approved flow requires otherwise.
- Do not log secrets or expose QR payload contents. Avoid retaining raw camera frames or unnecessary location history.
- Never place privileged backend credentials in the mobile application.
- Face verification is out of scope for the current prototype.

## 10. Proposed token names

```text
color.brand.navy
color.brand.navy-strong
color.brand.blue-soft
color.brand.red
color.surface.canvas
color.surface.card
color.surface.subtle
color.text.primary
color.text.secondary
color.text.inverse
color.border.default
color.focus.ring
color.status.success
color.status.warning
color.status.error
color.status.info
color.status.neutral

type.display
type.screen-title
type.section-title
type.card-title
type.body
type.body-strong
type.label
type.meta
type.timer

space.1
space.2
space.3
space.4
space.5
space.6
space.8
space.10
space.12

radius.control
radius.card
radius.sheet
radius.dialog

motion.micro
motion.quick
motion.standard
motion.emphasis
```

These are semantic naming conventions, not final CSS/Compose implementation code.

## 11. Stitch approval checklist

- [ ] Student experience is distinct from Windows layout.
- [ ] Navy/white base and restrained red accent are consistent.
- [ ] Main action is obvious and controls are at least 48 × 48 dp.
- [ ] Text/status/countdown remain readable outdoors and at larger font sizes.
- [ ] Motion is purposeful, restrained and reducible.
- [ ] Camera/location explanations are contextual and honest.
- [ ] QR detection, server acceptance, attempt, verification and commit confirmation are distinct states.
- [ ] No fake attendance success, invented metrics or real student data.
- [ ] Facial verification remains out of v1 scope.
- [ ] Actual screen references and unresolved choices are recorded.

## 12. Approval log

| Version | Status | Change | Reviewer | Date |
|---|---|---|---|---|
| 1.0 | Draft | Initial Student Android design-system baseline | Pending | 9 October 2026 |

**Guiding principle:** a beautiful, responsive experience is valuable only when information remains clear and every attendance state truthfully reflects what the system has verified.
'''
Path('/mnt/data/TRUEMUSTER_Android_DESIGN_SYSTEM.md').write_text(design, encoding='utf-8')
print('Created design system', len(design.splitlines()), 'lines')
PY
python /tmp/create_truemuster_android_docs.py

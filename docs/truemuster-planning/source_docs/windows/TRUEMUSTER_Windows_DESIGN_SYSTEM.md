# TRUEMUSTER — Windows UI/UX Design System

**Document type:** Design-system specification  
**Product:** TRUEMUSTER — Smart Attendance System  
**Platform scope:** Windows Admin/Teacher desktop application only  
**Primary design tool:** Google Stitch  
**Implementation handoff:** Antigravity  
**Status:** Draft v1.0 — visual tokens and layouts must be reviewed in Stitch before they are marked Approved  
**Last updated:** 9 October 2026

> This document defines the visual and interaction rules for the Windows application. It is not the PRD, API contract, database schema, or implementation code. If a product requirement or security rule is defined in an approved canonical document, that source remains authoritative.

---

## 1. Why this document exists

TRUEMUSTER will have two separate user experiences: a Windows application for Administration/Teachers and an Android application for Students. This document covers **only the Windows Admin/Teacher application**.

It provides one shared design language so that:
- all Windows screens look like one coherent product;
- Admin and Teacher experiences are consistent while permissions remain distinct;
- Stitch can generate screens against clear, reusable design rules;
- Antigravity can implement the approved screens without inventing visual styles;
- future screens can be added without redesigning every component;
- visual consistency does not override backend authorization or attendance rules.

### 1.1 Success criteria

The Windows interface should feel:
- professional and credible in a college environment;
- fast to scan during live classes;
- calm and uncluttered, even when showing dense attendance data;
- easy to learn for staff who are not technical;
- predictable across screens;
- accessible at common Windows desktop sizes and display scaling settings.

### 1.2 What this file does not do

This file does not finalize:
- backend implementation or API contracts;
- database tables, attendance rules or security policy;
- the final screen inventory;
- college-approved official brand values or logo usage;
- actual production data, real classroom coordinates or performance results;
- the Android Student app UI;
- future offline behaviour or face verification.

These are specified elsewhere or remain pending. Never invent real student or institutional data for a visual mockup; use clearly labelled demonstration data.

---

## 2. Product and experience principles

### 2.1 Core principles

1. **Clarity over decoration.** Every visual element must support a task, hierarchy, or useful feedback.
2. **Operational speed.** Frequently used staff actions should be easy to find and require as few steps as practical.
3. **Readable information density.** Attendance tables may be compact, but names, times, statuses and actions must remain easy to scan.
4. **Consistent patterns.** A button, status, table or dialog must behave the same way wherever it appears.
5. **Visible system state.** Users should always understand whether information is loading, saved, pending, failed or confirmed.
6. **Permission-aware UI.** Show actions appropriate to the signed-in role. Hiding a control is not a substitute for backend authorization.
7. **Recoverable mistakes.** Confirm destructive actions, preserve context after recoverable errors, and explain how to retry.
8. **Accessible by default.** Do not rely on colour alone, tiny text, hover-only controls or animation to communicate essential information.
9. **Honest feedback.** Never display “Attendance Confirmed” unless the backend has returned a committed/confirmed result.
10. **Design for real Windows usage.** Respect resizing, keyboard interaction, readable scaling and familiar desktop conventions.

### 2.2 Visual personality

**Desired:** classic, modern, institutional, restrained, precise, minimal, trustworthy.

**Avoid:** generic AI-generated dashboard styling, excessive cards, huge decorative charts, gradients, glassmorphism, neon effects, oversized headings, unnecessary animation, excessive rounded pills, random icon styles, and red backgrounds used everywhere.

### 2.3 Design priority order

When trade-offs occur, prioritize in this order:

1. Correctness and understandable system state
2. Accessibility and readability
3. Task speed and information hierarchy
4. Consistency
5. Visual polish

---

## 3. Brand direction and colour system

The intended institutional direction is **deep navy + red + white**. The values below are a **working palette**, not verified official university brand specifications. Confirm the final shades visually in Stitch and obtain approval before treating them as locked brand tokens.

### 3.1 Core palette

| Token | Draft value | Use |
|---|---|---|
| `color.brand.navy` | `#001C5A` | Primary brand anchor, selected navigation, key headings or brand surfaces |
| `color.brand.red` | `#E21E2B` | Restrained emphasis, selected highlights and relevant alerts; provisional |
| `color.surface.canvas` | `#F5F7FA` | Main application background |
| `color.surface.default` | `#FFFFFF` | Main content panels, menus, dialogs and tables |
| `color.text.primary` | `#172033` | Main readable text |
| `color.text.secondary` | `#64748B` | Supporting labels, timestamps and helper text |
| `color.border.default` | `#E2E8F0` | Dividers, table borders and input outlines |
| `color.border.strong` | `#CBD5E1` | Stronger separation where necessary |
| `color.focus.ring` | `#2563EB` | Visible keyboard focus, subject to final contrast validation |

### 3.2 Semantic colours

These colours indicate meaning, not decoration. Always pair colour with a text label or icon.

| Semantic token | Draft value | Meaning |
|---|---|---|
| `color.status.success` | `#15803D` | Confirmed or completed |
| `color.status.warning` | `#B45309` | Needs attention or pending review |
| `color.status.error` | `#B91C1C` | Failed, blocked or destructive condition |
| `color.status.info` | `#1D4ED8` | Informational message |
| `color.status.neutral` | `#475569` | Inactive, unknown or neutral state |

Semantic tokens should be reviewed for contrast in actual components. Do not assume that any colour pair automatically meets accessibility requirements.

### 3.3 Colour-use rules

- Navy is the primary product colour. Use it consistently for navigation selection, the primary action and important hierarchy.
- White is the primary working surface.
- Soft grey separates the page canvas from content panels without heavy borders.
- Red is an accent, not a default colour for every button, icon or card.
- Red should not be the only indicator of an error or urgent state.
- Avoid large areas of saturated red; reserve it for meaningful emphasis.
- Do not use coloured text on a similarly coloured surface without checking contrast.
- Do not use colour alone to represent attendance states; include a readable status label.
- Keep the initial Windows experience light-theme-first. Dark mode is out of scope unless approved separately.
- Do not use university logos or claim official endorsement without permission.

### 3.4 Accessibility checks for colours

Before approval, test text and component contrast in the rendered design. Target WCAG 2.2 AA contrast: at least 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries/focus indicators where applicable. If a draft brand colour fails contrast in a use case, adjust the foreground/background pairing or use the colour only decoratively.

---

## 4. Typography

### 4.1 Font direction

- **Preferred Windows font:** Segoe UI / Segoe UI Variable, where available.
- **Design-tool fallback:** Inter if Stitch cannot render Segoe UI consistently.
- Do not mix multiple font families for decoration.
- Use standard weights and clear hierarchy rather than letter spacing or all-caps styling.

### 4.2 Type scale

| Token | Draft size | Weight | Typical use |
|---|---:|---|---|
| `type.page-title` | 28 px | Semibold | Main screen heading |
| `type.section-title` | 20 px | Semibold | Major content sections |
| `type.card-title` | 16 px | Semibold | Panel or widget heading |
| `type.body` | 14 px | Regular | Default interface text |
| `type.body-strong` | 14 px | Semibold | Important labels or values |
| `type.label` | 13 px | Medium | Form labels and table metadata |
| `type.helper` | 12 px | Regular | Helper text, secondary metadata only |
| `type.metric` | 28–32 px | Semibold | Key totals when genuinely useful |

These values are starting tokens. Validate them at 100% and common Windows scaling settings. Do not shrink essential data to fit a crowded layout; restructure the layout instead.

### 4.3 Typography rules

- Use sentence case for headings and button labels.
- Use concise, familiar words. Prefer “Generate QR” over vague labels such as “Launch experience”.
- Do not use long paragraphs in operational screens when a clear label and short explanation will do.
- Use tabular numerals for aligned counts, times and numeric columns where supported.
- Do not use helper-text sizing for primary table data, student names or critical statuses.
- Keep line lengths comfortable; avoid full-width paragraphs across dense dashboards.
- Avoid decorative all-caps text other than compact, non-essential metadata.

---

## 5. Spacing, sizing and layout

Use a consistent **4 px base spacing unit**. Use the nearest token rather than arbitrary spacing wherever practical.

### 5.1 Spacing tokens

| Token | Value | Typical use |
|---|---:|---|
| `space.1` | 4 px | Icon/text micro-gap |
| `space.2` | 8 px | Compact control gap |
| `space.3` | 12 px | Form control internal gap |
| `space.4` | 16 px | Standard component gap |
| `space.5` | 20 px | Dense panel spacing |
| `space.6` | 24 px | Standard content padding |
| `space.8` | 32 px | Large section gap |
| `space.10` | 40 px | Major section separation |
| `space.12` | 48 px | Occasional large separation |

### 5.2 Desktop viewport assumptions

- **Primary design frame:** 1440 × 900 px.
- **Secondary review frame:** 1280 × 800 px.
- **Minimum usable target:** approximately 1024 × 700 px; verify whether all required tasks remain usable rather than merely shrinking.
- The application must handle resizing and common Windows display scaling. Avoid fixed layouts that clip content.
- This is a desktop-first Windows application, not a responsive mobile web page. Tablet/mobile layouts are not required here.

### 5.3 Application shell

The shared desktop shell consists of:

1. **Left navigation rail/sidebar**
   - Draft expanded width: 240 px.
   - Optional collapsed width: 72 px only if labels and accessible tooltips remain usable.
   - Persistent role-appropriate navigation.
   - Selected item has a clear visual state.
   - Avoid excessive nesting.

2. **Top bar**
   - Draft height: 64 px.
   - Page context/title or breadcrumb where helpful.
   - Signed-in user identity and account/session actions.
   - Keep secondary tools out of the primary action area.

3. **Main content**
   - Draft horizontal padding: 24–32 px.
   - Clear page title, optional description and one primary action region.
   - Logical sections with consistent spacing.
   - Use a grid only when it improves comparison or scanning.

4. **Optional contextual panel**
   - Use only when a workflow genuinely needs details alongside a table or form.
   - Do not force every page into a three-column dashboard pattern.

### 5.4 Layout behaviour

- Prioritize stable alignment and predictable placement.
- Allow tables and long content regions to scroll without hiding global navigation.
- Avoid horizontal scrolling for basic tasks at the primary viewport.
- If a table needs many columns, choose column priority, optional columns or a detail view before forcing the entire layout wider.
- Page title and primary action should not compete visually.
- Use a consistent content max-width only where it supports readability; data-heavy pages may use the available width.
- Do not use a card for every item. Tables, section dividers, grouped forms and whitespace are often better.

---

## 6. Iconography, logos and imagery

- Use one consistent outline icon family. Lucide is a reasonable proposed choice; confirm it before implementation.
- Prefer standard icons only when their meaning is familiar. Pair unfamiliar icons with labels.
- Keep icon size and stroke visually consistent.
- Do not mix filled, outlined, emoji and multicolour icon sets within the same interface.
- Use icons to improve scanning, not as a replacement for essential text.
- Avoid stock photography and decorative illustration in the operational dashboard.
- Do not redraw or alter the university logo. Its use and clear-space rules require permission and an approved asset.
- Keep a central asset index in the UI/UX documentation so Stitch and Antigravity reuse the same approved assets.

---

## 7. Component design rules

The exact component library remains an implementation decision. This section defines visual and behavioural expectations, not a mandate to use a particular framework.

### 7.1 Buttons

Define consistent `Primary`, `Secondary`, `Tertiary/Ghost`, `Danger` and `Icon-only` button variants.

- Primary: one principal action per screen or major task area.
- Secondary: related but less prominent actions.
- Tertiary/Ghost: low-emphasis navigation or contextual actions.
- Danger: destructive actions only, with clear wording and confirmation where warranted.
- Icon-only: use only for widely understood actions; provide an accessible name and tooltip.
- Include default, hover, pressed, keyboard-focus, disabled and loading states.
- Do not use multiple competing primary buttons in the same visual group.
- A loading button must prevent duplicate submission where appropriate.
- Button labels should describe the result, e.g. “Save changes”, “Generate QR”, “Review correction”.

### 7.2 Form fields

- Every field must have a visible label; placeholder text is not a label.
- Required and optional fields must be clear.
- Place validation messages beside the relevant field and state how to fix the problem.
- Preserve entered values after recoverable errors whenever safe.
- Use sensible input widths and group related fields together.
- Make keyboard order logical.
- Mark invalid fields visually and with text; do not rely only on a red outline.
- Distinguish disabled from read-only.
- Confirm before abandoning long or consequential forms if unsaved changes would be lost.

### 7.3 Cards and summary metrics

- Use cards only when they group meaningful related information.
- Keep border, radius and padding consistent.
- Prefer subtle borders over heavy shadows.
- Summary counts should answer a real operational question. Avoid decorative dashboard metrics.
- Each metric needs a clear label and, where relevant, a time range or scope.
- Never fabricate institutional statistics in mockups. Use labels such as “Demo data” for sample values.

### 7.4 Tables and attendance registers

Tables are a core component in this product.

- Use a clear header row and consistent column alignment.
- Keep student name and attendance status easy to find.
- Align numeric/time columns consistently.
- Use a subtle row divider; avoid heavy gridlines around every cell.
- Provide search, filtering, sorting and pagination only where useful and feasible.
- Keep bulk actions clearly scoped and confirm high-impact changes.
- Preserve active filters and relevant context when opening a record and returning.
- Avoid hover-only row actions; actions must remain discoverable by keyboard.
- Make empty results distinguishable from loading and errors.
- Use a labelled status (`Present`, `Absent`, `Pending review`, etc.) only when that state is defined by the product rules.
- Do not infer “Absent” from a failed scan or network error. Attendance business rules determine the final status.
- If attendance is updating, display a clear pending/loading state and refresh from the authoritative backend response.

### 7.5 Status badges

- Use compact badges with readable text and sufficient contrast.
- Pair semantic colour with a text label and optionally an icon.
- Keep badge shapes and padding consistent.
- Do not make every piece of metadata a badge.
- Do not use “Success” to mean an uncommitted or merely submitted request.

### 7.6 Navigation

- Use stable names and ordering across screens.
- Separate global destinations from page-level actions.
- Show active navigation clearly without relying on colour alone.
- Admin and Teacher may share the application shell, but visible navigation items and permitted actions depend on role.
- Never imply that hiding a menu item enforces security; backend authorization remains authoritative.
- Do not add navigation destinations that have no defined scope or implementation plan.

### 7.7 Dialogs, drawers and notifications

- Use a dialog for a focused decision or short task, not a large multi-step workflow.
- Use a drawer only where keeping the background context helps.
- Confirm destructive or consequential actions with the target and effect clearly stated.
- Toasts should be brief and reserved for meaningful feedback. Persistent errors should not disappear before the user can act.
- Ensure keyboard focus enters a modal appropriately and returns to the invoking control when it closes.
- Avoid nesting dialogs.
- Include retry or next-step guidance in error messages whenever possible.

### 7.8 Search and filtering

- Place search/filter controls in a predictable location above their result set.
- Make applied filters visible and removable.
- Provide a “clear filters” path when filters may hide results.
- Do not silently reset searches after an unrelated action.
- Show an explicit empty result message when no records match.

---

## 8. Admin and Teacher role-aware experience

TRUEMUSTER uses one Windows application for Administration and Teachers, but these roles do not have identical permissions.

### 8.1 Admin experience — high-level visual intent

Administrative tasks may include student/teacher/course management, assignments, account or device review, attendance oversight, authorized corrections, reports and audit review, subject to the approved PRD and permissions model.

- Optimize for overview, filtering, management and traceability.
- Use wider tables and structured forms.
- Make high-impact edits visibly distinct and auditable.
- Keep sensitive actions away from casual single-click triggers.

### 8.2 Teacher experience — high-level visual intent

Teacher tasks may include viewing assigned classes, opening an authorized class session, generating/displaying the session QR, monitoring attendance, handling permitted exceptions and reviewing class records, subject to approved requirements.

- Optimize for quick access to assigned classes and current sessions.
- Make “Open class” and “Generate QR” prominent when contextually appropriate.
- Prioritize live attendance status and understandable exception handling.
- Do not expose Admin-only management functions.

### 8.3 Role-based visual rules

- Role identity must be clear after sign-in.
- Navigation should be role-aware.
- Disabled actions should explain why they are unavailable when that explanation is useful and safe.
- Do not show controls the user can never use merely to tease unavailable features.
- Backend permissions and API responses remain the authority. The UI must handle `unauthorized` responses safely and clearly.
- Never fabricate the current teacher, class assignment or permission state in production.

---

## 9. Interaction states and feedback

Every important component and screen must define the states that apply to it.

### 9.1 Required state vocabulary

- **Default:** Ready for interaction.
- **Hover:** Pointer is over an actionable item.
- **Focus:** Keyboard focus is visible.
- **Pressed:** Action is being activated.
- **Disabled:** Action is not currently available.
- **Loading:** Work is in progress.
- **Empty:** No data exists yet or no results match.
- **Success/Confirmed:** The operation completed successfully and the system can confirm that result.
- **Pending:** The operation is not yet final; do not imply completion.
- **Error:** The operation failed.
- **Permission denied:** The current user is not authorized.
- **Offline/connection problem:** The application cannot currently reach the required service, where relevant.

Not every component needs every state. Define only the states that are meaningful for each component.

### 9.2 Attendance-specific feedback

- Do not show confirmed attendance before the server confirms the committed record.
- Clearly differentiate scanning, checking, submitting, pending and confirmed states.
- If a request times out, avoid assuming it failed; safely query/reconcile the authoritative result before inviting a retry that could duplicate an operation.
- Errors must be factual and actionable. Do not claim fraud solely because a GPS, device-authentication or network check failed.
- Do not show invented security verification success in static mockups.

### 9.3 QR session screen considerations

This is an important Teacher workflow, but the screen layout itself will be specified in the screen inventory.

- The QR must be visually prominent enough to scan from a classroom display.
- Session, class and expiry information must be readable without competing with the QR.
- Expiry countdown should be clear but not excessively animated.
- Use the approved rule of 90-second QR validity and a separate 45-second check-in deadline after a valid scan; these are different timers.
- Do not imply that the QR is valid beyond the backend session/challenge rules.
- Avoid exposing secrets or student personal data in the QR payload or in a screenshot.
- Keep a clear path to regenerate or close the QR session only if the approved workflow permits it.

---

## 10. Motion and micro-interactions

The Windows app should feel responsive, not animated for its own sake.

### 10.1 Timing guidelines

| Motion type | Draft duration |
|---|---:|
| Hover/focus colour transition | 100–150 ms |
| Button press feedback | 80–120 ms |
| Menu/dialog appearance | 120–180 ms |
| Small panel transition | 150–200 ms |

These are draft targets, not performance measurements. Keep transitions short, avoid blocking an action, and verify responsiveness in implementation.

### 10.2 Motion rules

- Prefer subtle opacity, colour or small position changes.
- Avoid large slide-ins, bouncing, parallax, confetti or looping decoration in the operational dashboard.
- Do not animate tables or large layouts in a way that makes records difficult to track.
- Do not use animation as the only indicator of success, warning or failure.
- Respect reduced-motion system preferences where supported.
- Critical actions must work even when animations are disabled.
- Loading feedback should not delay an operation that has already completed.

---

## 11. Accessibility and desktop usability

Use WCAG 2.2 AA as the target reference for web-based UI content, then test the rendered desktop implementation.

- Text contrast: target 4.5:1 for normal text; 3:1 for large text.
- Provide visible keyboard focus.
- Ensure all essential operations can be reached and completed with a keyboard.
- Use a logical tab order and semantic labels.
- Do not rely on hover-only interactions.
- Do not use colour alone for status.
- Use comfortably readable text and adequate clickable targets; desktop target sizes must still be practical at common Windows scaling settings.
- Support the user resizing the app window without overlapping or clipping essential actions.
- Check at 100%, 125% and 150% display scaling where possible.
- Keep error messages near the source and explain how to recover.
- Review focus order, contrast, text resizing, table navigation and modal focus in the implemented app.
- Avoid flashing content and unnecessary motion.

Accessibility compliance cannot be claimed until the implementation has been tested.

---

## 12. Data presentation and content style

### 12.1 Writing style

- Use plain English and familiar college terminology.
- Keep labels short and specific.
- Use consistent terms for class, course, section, session, attendance, correction and finalization; the canonical terminology file should govern exact wording.
- Write error messages in a calm, helpful tone.
- Explain what happened and what the user can do next.
- Avoid blame or accusatory copy in cases where checks fail.

### 12.2 Sample data in designs

- Use clearly fictional names and values for prototypes.
- Do not paste real student records, phone numbers, enrolment identifiers or biometric information into Stitch prompts.
- Do not invent real attendance rates, class counts or institutional statistics.
- Label mock/example content if a reviewer could mistake it for a real record.
- Avoid realistic identifiers that accidentally look like production data.

### 12.3 Date, time and number formatting

- Use a consistent locale-aware date/time format across Windows screens.
- Follow the institution's confirmed timezone and formatting policy once documented.
- Display time zone only when it helps clarify a meaningful ambiguity.
- Avoid mixing 12-hour and 24-hour time formats on the same workflow without a deliberate reason.

---

## 13. Stitch workflow and design-to-code handoff

### 13.1 Recommended design order

1. Confirm the working palette, typography and basic layout direction.
2. Generate one high-fidelity **Teacher Dashboard** in a 1440 × 900 desktop frame.
3. Review hierarchy, density, navigation, contrast and action placement.
4. Revise the design in Stitch until approved.
5. Record the approved choices in this file or linked design-token files.
6. Create the Windows screen inventory and user flows.
7. Design key task screens using the same design system: class/session, QR display, live attendance register, correction/review and administrative management screens.
8. Review all screens as a family so spacing, components and terminology remain consistent.
9. Provide Antigravity with the approved Stitch project/screens plus this document and relevant screen specifications.
10. Implement one vertical workflow at a time and compare the live UI with the approved reference.

### 13.2 Initial Stitch prompt

Use this as a starting prompt for the **Teacher Dashboard only**. It is a design brief, not a complete application specification.

> Design the first screen for TRUEMUSTER, a college attendance management system. Create a Windows desktop-first Teacher Dashboard for a web-based UI that will later run inside a Windows desktop wrapper. Use a 1440 × 900 frame.
>
> Visual direction: professional, classic, minimal, fast and trustworthy. Working palette: deep navy `#001C5A`, white `#FFFFFF`, soft grey `#F5F7FA`, text `#172033`, borders `#E2E8F0`, and restrained provisional red accent `#E21E2B`. Navy should lead; use red sparingly. These are draft tokens pending visual review.
>
> Include a compact left sidebar, a clean top bar, clear page title, assigned classes or current sessions, a prominent contextual “Generate QR” action for an authorized class, and recent attendance activity. Use readable tables and clear status labels. Show only Teacher-appropriate navigation and actions. Use fictional demonstration data and do not imply it is real college data.
>
> Prioritize alignment, readable density, accessibility and a clear action hierarchy. Use subtle borders, restrained card styling and simple consistent icons. Avoid gradients, glassmorphism, decorative illustration, oversized headings, excessive cards, giant charts and unnecessary animation.
>
> Create one high-fidelity dashboard screen only. Do not design the Android app. Do not create backend logic, invent product rules or claim that functionality is implemented.

### 13.3 Handoff package for Antigravity

Before implementation, provide:
- this `DESIGN_SYSTEM.md`;
- the approved Stitch project or screen references available through the connected integration;
- the approved Windows UI/UX README and screen inventory;
- the specific screen specification being implemented;
- canonical product, attendance workflow, permissions and API documents;
- actual assets and their paths, where applicable.

Antigravity should:
- inspect the existing repository before changing files;
- follow the approved component tokens and layout rules;
- reuse existing components when appropriate rather than create near-duplicates;
- avoid inventing missing visual or functional requirements;
- flag contradictions and unresolved choices;
- keep UI presentation separate from backend business rules;
- report files changed and tests actually run;
- compare the running implementation to the approved design reference.

Do not assume the Stitch connection supports every create/export action. Verify the tools exposed by the connected integration and use available screen/project references or supported export features.

---

## 14. Proposed token reference for implementation

These are naming conventions for design tokens, not final CSS or code.

```text
color.brand.navy
color.brand.red
color.surface.canvas
color.surface.default
color.text.primary
color.text.secondary
color.border.default
color.border.strong
color.focus.ring
color.status.success
color.status.warning
color.status.error
color.status.info
color.status.neutral

type.page-title
type.section-title
type.card-title
type.body
type.body-strong
type.label
type.helper
type.metric

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
radius.dialog

motion.fast
motion.standard
motion.panel
```

Suggested radius direction: restrained and consistent. Start with approximately 6 px for standard controls, 8 px for cards and 10–12 px for large dialogs/panels, then confirm visually in Stitch. Avoid pill-shaped controls unless the component semantics genuinely call for them.

---

## 15. Design review checklist

Before marking the design system or a screen approved, verify:

### Brand and consistency
- [ ] Navy, white and red are used consistently and red is restrained.
- [ ] Tokens are named and reused rather than approximated separately on each screen.
- [ ] Typography, spacing, radii, borders and icons follow the shared system.
- [ ] No unapproved college logo or false claim of official endorsement appears.

### Layout and task flow
- [ ] The page has one obvious primary action when appropriate.
- [ ] Navigation is predictable and role-appropriate.
- [ ] Tables and forms prioritize the most important information.
- [ ] The page remains usable at the primary desktop size and the secondary review size.
- [ ] The design avoids unnecessary cards, empty decoration and competing actions.

### States and content
- [ ] Relevant loading, empty, success, pending, error and permission-denied states are specified.
- [ ] Confirmed attendance is not represented before server confirmation.
- [ ] Status is not communicated only through colour.
- [ ] Sample information is fictional and not presented as genuine university data.
- [ ] Error messages explain the problem and next step.

### Accessibility and handoff
- [ ] Contrast has been checked rather than assumed.
- [ ] Keyboard focus and keyboard interaction have been considered.
- [ ] Text is readable at common display scaling.
- [ ] Modal/dialog behaviour and focus are specified where relevant.
- [ ] Stitch reference and specification are linked for Antigravity.
- [ ] Open questions are recorded rather than silently guessed.

---

## 16. Open decisions and approval log

Do not mark this document `Approved` until the team reviews:
- [ ] Whether the draft brand navy and red match the desired identity.
- [ ] Whether Segoe UI Variable or Inter should be the final typeface.
- [ ] Whether the sidebar should support a collapsed state.
- [ ] The final Admin/Teacher screen inventory and navigation.
- [ ] The chosen icon library and any approved logo/assets.
- [ ] The implemented desktop wrapper's minimum supported viewport and scaling behaviour.
- [ ] Contrast and keyboard usability in the rendered design.
- [ ] The exact status wording and empty/error copy against product rules.

Record approval details here:

| Version | Status | Changes | Approved by | Date |
|---|---|---|---|---|
| 1.0 | Draft | Initial Windows design-system baseline | Pending | 9 October 2026 |

---

**Final rule:** The goal is not to make every screen look decorative. The goal is to make TRUEMUSTER feel consistent, polished, quick and trustworthy while staff complete real attendance work with minimal confusion.

# TRUEMUSTER — Windows Admin & Teacher UX Specification

**Document type:** Platform UX specification and screen-planning reference  
**Product:** TRUEMUSTER — Smart Attendance System  
**Platform:** Windows Admin/Teacher application  
**Design tool:** Google Stitch  
**Implementation agent:** Antigravity  
**Status:** Draft v1.0 — review the flows and screen inventory before creating the full set of high-fidelity screens  
**Last updated:** 9 October 2026  
**Companion document:** [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

> This document defines the information architecture, screen responsibilities, user journeys and interaction expectations for the Windows application. The companion `DESIGN_SYSTEM.md` defines visual tokens and reusable component styling. The approved PRD, attendance workflow, security policy and API contracts remain authoritative for product rules and backend behaviour.

---

## 1. Purpose and design outcome

TRUEMUSTER has two separate applications:
- **Windows Admin/Teacher application:** manages college operations, assigned classes, attendance sessions, review and authorized corrections.
- **Android Student application:** student registration, device enrollment, QR check-in and attendance history. It is out of scope for this document.

The Windows app must support two different staff roles inside one consistent application shell. Administration needs oversight and controlled management; Teachers need to complete class-session work quickly. A shared shell must not imply shared permissions.

### 1.1 UX goals

1. Help staff immediately understand where they are, what class/session they are working on, and what action is available.
2. Make the most frequent Teacher tasks obvious: see assigned classes, open the correct session, display its QR, monitor attendance and handle legitimate exceptions.
3. Make Admin tasks structured and traceable: maintain approved academic records, review attendance, manage authorized corrections and inspect audit history.
4. Keep the live class workflow focused and readable from a typical Windows laptop or desktop.
5. Make loading, pending, confirmed, failed and permission-denied states visibly distinct.
6. Prevent accidental edits through clear scope, reason capture, confirmation and audit-oriented feedback.
7. Keep UI display logic separate from backend authorization and attendance decision rules.

### 1.2 Non-goals

This document does not specify:
- the Android Student app;
- backend code, database schema or endpoint payloads;
- unapproved features or future offline implementation;
- facial verification or other future identity-verification features;
- official university branding approvals;
- actual campus coordinates or production attendance data.

---

## 2. Sources of truth and dependencies

Read these documents in this order before implementing screens:

1. `docs/ui-ux/windows/README.md` — Windows UI/UX entry point and status.
2. `docs/ui-ux/windows/DESIGN_SYSTEM.md` — shared visual rules and design tokens.
3. `docs/PRD.md` — approved product scope and role capabilities.
4. `docs/ATTENDANCE_WORKFLOW.md` — authoritative attendance workflow and timers.
5. `docs/AUTH_AND_PERMISSIONS.md` — authoritative role and authorization rules.
6. `docs/API_CONTRACTS.md` — real request/response contracts and error definitions.
7. `docs/SECURITY_AND_PRIVACY.md` — security, privacy and audit requirements.
8. Relevant screen-specific references or approved Stitch screens.

If a file path differs in the live repository, update the links to the actual canonical path. Do not create duplicated, competing policy documents just to match this list.

**Conflict rule:** Do not resolve a conflict by guessing. Record it in `08-review-and-decisions/open-questions.md`, identify the conflicting documents, and ask for an explicit decision.

---

## 3. User roles and mental models

### 3.1 Administration

**Mental model:** “I oversee the system, maintain authorized records and resolve issues with an audit trail.”

The Admin experience should prioritize:
- cross-class oversight;
- management of approved student, teacher, course, section and assignment records;
- attendance review and exception handling;
- authorized post-finalization corrections;
- reports and audit visibility.

A screen or action must appear in the Admin navigation only if the approved PRD/permissions policy grants it. This document's inventory is a planning baseline; it is not a grant of permission.

### 3.2 Teacher

**Mental model:** “I need to run the right class session, show its QR, see which students are confirmed and deal with legitimate exceptions.”

The Teacher experience should prioritize:
- assigned classes, not a college-wide management view;
- current/upcoming class sessions;
- a fast route to the correct class session;
- a prominent, controlled QR display;
- live attendance status;
- a reasoned manual-attendance/exception flow;
- clear closure and correction status.

Teachers must not see Admin-only account, role, course-structure or global-audit controls unless explicitly authorized by the permission policy.

### 3.3 Shared shell, distinct permissions

- One Windows application can render different navigation and actions based on the authenticated role.
- The role should be clear in the account/profile area.
- Do not create separate “Admin mode” and “Teacher mode” toggles that let users grant themselves permissions.
- A changed or expired session must return the user to a safe authentication state.
- UI gating is for usability. Every restricted operation must still be authorized by the backend.

---

## 4. Information architecture and navigation

### 4.1 Proposed application shell

The shell has four persistent regions:

1. **Left sidebar:** primary destinations; role-aware; stable order.
2. **Top bar:** page context, current identity, notifications or support only if approved, and account/session actions.
3. **Main content:** page title, concise description, contextual primary action, then the page's main task.
4. **Feedback region:** toast/banner/dialog or inline status appropriate to the action; never obscure the primary data for a long period.

Use the design tokens in `DESIGN_SYSTEM.md`. Do not create a different header, sidebar or content-padding system for every page.

### 4.2 Proposed Teacher navigation

Order is a draft to validate in Stitch:

1. **Dashboard**
2. **My Classes**
3. **Attendance Sessions**
4. **Attendance Records** (only if teachers are permitted to view historical records for their assigned classes)
5. **Correction Requests** (only if the approved process requires a separate queue)
6. **Profile / Sign out** — located in the account area, not necessarily the main sidebar.

Keep the navigation compact. Avoid showing separate menu items for the same workflow under multiple names.

### 4.3 Proposed Admin navigation

Order is a draft to validate against the approved PRD:

1. **Overview**
2. **Students**
3. **Teachers**
4. **Courses & Sections**
5. **Teacher Assignments**
6. **Classes & Locations**
7. **Attendance Sessions**
8. **Attendance Review**
9. **Correction Approvals**
10. **Reports**
11. **Audit Log**
12. **Settings** — only for settings that are explicitly in scope and role-authorized.
13. **Profile / Sign out** — in the account area.

If some destinations are out of scope for the first prototype, omit them rather than presenting decorative or inactive future-feature menus.

### 4.4 Page title pattern

Each page should use a consistent header:
- a clear page title;
- one short description only where it adds context;
- breadcrumbs only for meaningful hierarchy;
- one visually dominant primary action where appropriate;
- optional secondary actions grouped without competing with the primary task.

Do not repeat the same title in both breadcrumb and main heading unless a breadcrumb is genuinely useful.

---

## 5. Screen inventory

The following is the **proposed screen inventory for planning and Stitch design**. It is not a claim that each screen is implemented or that each capability is already approved. Confirm scope against the PRD before generating all screens.

Priority meanings:
- **P0:** required to demonstrate the core prototype workflow.
- **P1:** important supporting workflow for a credible pilot.
- **P2:** only build if explicitly in scope and time allows.

### 5.1 Shared / authentication screens

| ID | Screen | Primary user | Priority | Main purpose |
|---|---|---|---|---|
| WIN-01 | Sign in | Admin, Teacher | P0 | Secure entry and a clear sign-in error/retry state |
| WIN-02 | Session expired / re-authentication | Admin, Teacher | P0 | Explain expiration and safely resume after authentication |
| WIN-03 | Access denied | Admin, Teacher | P0 | Explain that the current account lacks permission without revealing restricted data |
| WIN-04 | Profile / account menu | Admin, Teacher | P1 | Show signed-in identity and safe account/session actions |

### 5.2 Teacher screens

| ID | Screen | Priority | Main purpose |
|---|---|---|---|
| TCH-01 | Teacher Dashboard | P0 | Surface assigned classes, upcoming/current sessions and the next likely action |
| TCH-02 | My Classes | P0 | List only the teacher's assigned classes/sections |
| TCH-03 | Class / session details | P0 | Confirm subject, section, timing, room/approved location and session state before starting |
| TCH-04 | QR Session Display | P0 | Show one active session's QR, class context, validity countdown and current status |
| TCH-05 | Live Attendance Register | P0 | Show server-confirmed attendance and unresolved/pending states for a session |
| TCH-06 | Student attendance detail | P1 | Show one student's session-specific outcome and relevant verification status permitted to the teacher |
| TCH-07 | Manual attendance / exception dialog | P0 | Record a legitimate attendance exception with required reason and auditable outcome |
| TCH-08 | Session summary / closure | P1 | Review totals and session outcome after the session closes, if this workflow is approved |
| TCH-09 | Assigned-class attendance history | P1 | Review previous sessions within the teacher's permitted scope |
| TCH-10 | Correction request / status | P1 | Submit or track a correction if post-finalization correction requires Admin review |

### 5.3 Admin screens

| ID | Screen | Priority | Main purpose |
|---|---|---|---|
| ADM-01 | Admin Overview | P0 | High-level operational status and direct links to work needing attention |
| ADM-02 | Students list | P0 | Find and manage authorized student records |
| ADM-03 | Student detail | P1 | Inspect the student's profile, enrollment status and registered-device state permitted by policy |
| ADM-04 | Teachers list / detail | P1 | Find staff records and inspect their active status |
| ADM-05 | Courses & sections | P0 | View and maintain the academic structure if in v1 scope |
| ADM-06 | Teacher assignments | P0 | Link teachers to authorized sections/subjects |
| ADM-07 | Classes / approved locations | P1 | Review class location anchors and associated metadata; coordinates require authorized administration |
| ADM-08 | Attendance sessions | P0 | Find sessions by date, class, teacher or status |
| ADM-09 | Attendance session detail / register | P0 | Inspect authoritative attendance records and session context |
| ADM-10 | Correction approval queue | P0 | Review late/manual correction requests if approval is required by policy |
| ADM-11 | Correction review detail | P0 | Compare requested and current values, reason, actor and audit history before decision |
| ADM-12 | Reports / export | P1 | Filter and export permitted attendance summaries |
| ADM-13 | Audit log | P1 | Review traceable administrative actions |
| ADM-14 | Settings / operational configuration | P2 | Only approved, role-authorized configuration controls |

### 5.4 Global supporting states (not standalone navigation destinations)

Every applicable screen should define:
- initial loading;
- empty state;
- no results from filters/search;
- recoverable network/service error;
- unauthorized/forbidden result;
- expired session;
- saved/confirmed result;
- pending operation;
- stale data / refresh required where applicable;
- destructive-action confirmation;
- form validation errors.

---

## 6. Core journeys

### 6.1 Teacher: open a class and start a QR session

**Goal:** reach the correct assigned class and display its active QR without confusion.

1. Teacher signs in.
2. Dashboard lists only assigned classes and relevant upcoming/current sessions.
3. Teacher opens the correct class/session.
4. A session-confirmation area shows class/section, subject, scheduled time, room or approved session anchor label, and current session state.
5. Teacher selects the approved start/generate action.
6. The UI shows a clear loading state while the backend validates authorization and creates the session/challenge.
7. Only after successful backend confirmation does the QR display screen appear.
8. The QR screen shows the session context and the 90-second QR validity countdown.
9. The UI distinguishes QR expiry from the separate 45-second check-in deadline that starts for a student after a valid scan. The Teacher screen must not imply these are the same timer.
10. If QR creation fails, show a clear error and safe retry; do not show a stale QR as active.

**UX safeguards**
- Show enough class context to reduce starting a session for the wrong section.
- Avoid a modal asking the teacher to re-enter data already known from the session.
- Do not fake a generated QR in a mockup or show “Active” before the backend says the challenge is active.
- Whether a teacher can regenerate QR, how often, and how session closure works must follow the approved workflow/API contract.

### 6.2 Teacher: monitor live attendance

1. Teacher opens the live register for the current session.
2. The page identifies the active class/session and last-updated state.
3. Rows show student identity fields permitted by policy and the authoritative attendance status.
4. New or changed records update using the supported backend/realtime strategy; otherwise use a clear refresh/polling indicator.
5. Pending submissions, confirmed attendance, rejected attempts and manual exceptions must not be visually conflated.
6. If a live update channel disconnects, show a small stale/disconnected indicator and an explicit refresh/retry path.
7. Teacher can open a row to inspect permitted detail or use a clearly labelled manual-attendance/exception action.
8. Do not silently change a student to Absent merely because a network, GPS or device-authentication check failed.

**Table priorities:** student name/approved identifier, status, timestamp if available and appropriate, and an action column. Do not expose unnecessary location coordinates, authentication secrets, sensitive verification signals or raw diagnostic payloads.

### 6.3 Teacher: mark attendance for a legitimate exception

The product permits manual Teacher action for a valid reason, but the exact reason taxonomy and approval requirements must match the approved policy.

1. Teacher opens the session register.
2. Teacher selects the student and the clearly labelled “Mark attendance manually” or “Record exception” action.
3. A focused dialog shows the selected student and session so the target cannot be confused.
4. Teacher chooses or enters the required reason; free-text detail should be minimized and should not invite collection of unnecessary sensitive information.
5. The UI explains whether the action applies immediately or creates a review request, based on the policy response.
6. Teacher reviews and submits.
7. The UI waits for the backend result.
8. Confirmed changes show an audit-oriented success message; pending review remains explicitly pending.
9. On failure, keep the entered reason where safe and explain how to retry.

Never display a success state before the write is committed. The UI must not let a Teacher edit a class outside their assignment.

### 6.4 Admin: review a correction request

1. Admin opens Correction Approvals.
2. Queue supports purposeful filtering by class, date, requester, status and age, subject to available data.
3. Each row shows enough context to triage: session/class, student, requester, submitted time and current status.
4. Admin opens a request detail screen.
5. The detail view presents the existing value, requested value, reason, original action/source and relevant audit timeline side by side where possible.
6. Approve and Reject are explicit, separate decisions; neither is triggered by a row click.
7. If rejecting, capture a reason when required by policy.
8. Backend authorizes the decision and records the audit event.
9. The final state and any failure to save are clearly communicated.
10. Approved requests update the register only after authoritative confirmation.

**No silent edits:** retain a history of the prior value and correction details according to the audit policy. The UI must not imply that the Admin can erase audit history.

### 6.5 Admin: find an attendance session

1. Admin opens Attendance Sessions.
2. Default list is useful without requiring multiple filters.
3. Admin can search/filter by date range, course/section, teacher, session state and other supported fields.
4. Results show a clear session identity and status.
5. Selecting a row opens the session detail rather than immediately editing attendance.
6. The session detail links to the attendance register, permitted correction/review paths and audit history where available.
7. Empty and no-results states explain whether no sessions exist or current filters return no matches.

### 6.6 Admin: find or inspect a student

1. Admin opens Students.
2. Search supports the institution-approved identifiers available in the API (for example name or enrolment ID if those fields are present).
3. The result list uses only the minimum data needed to identify the correct student.
4. Selecting a row opens a dedicated detail screen.
5. Editing, device recovery or deactivation actions are available only if permitted by the role and current record state.
6. Device changes must show the active device status and a deliberate recovery/revocation flow, not a one-click silent replacement.
7. Success requires a backend response; failure should explain what can be retried or who must review it.

### 6.7 Admin: manage approved academic structure

For courses, sections, teacher assignments and locations:
- separate list, detail and create/edit modes clearly;
- use constrained selectors for linked records instead of free-text values when the backend expects a relation;
- show active/inactive state clearly;
- prevent accidental duplicate assignment through validation feedback;
- ask for confirmation before deactivation if it affects downstream sessions;
- do not permit deleting a record merely because a Delete button looks expected—follow the approved data-retention and referential-integrity policy.

### 6.8 Sign-out, timeout and access denied

- Sign out is available in the account menu.
- If the session expires during a task, preserve safe unsaved user input where possible, but do not preserve credentials or sensitive tokens in the UI.
- Explain that re-authentication is required.
- For `403`/forbidden results, explain lack of permission without leaking protected record details.
- Do not endlessly retry unauthorized requests.
- If a session mutation may have completed but the client timed out, reconcile state before offering a duplicate action.

---

## 7. Screen layout specifications

These are structural wireframe descriptions for Stitch. Use `DESIGN_SYSTEM.md` for actual styling. Generate high-fidelity screens only after the layout and flow are reviewed.

### 7.1 WIN-01 — Sign in

**Purpose:** secure and calm entry to the Windows app.

**Layout**
- Product name/approved logo area.
- Clear “Sign in to TRUEMUSTER” heading.
- Email/username field based on the approved authentication model.
- Password or supported authentication method.
- Primary Sign in action.
- Inline validation and service error region.
- Password reset/help link only if the reset flow exists and is in scope.

**States:** initial, submitting, invalid credentials, service unavailable, session restored, account inactive/blocked if the backend reports it.

**Avoid:** fake SSO buttons, unimplemented “remember me”, or exposing whether a sensitive account exists unless the authentication policy permits it.

### 7.2 TCH-01 — Teacher Dashboard

**Primary question answered:** “What class/session do I need to act on now?”

**Layout hierarchy**
1. Page title: “Dashboard” or “Teacher Dashboard” (choose one label and use consistently).
2. Small context line such as today’s date only if useful.
3. “Current / Upcoming Classes” as the primary area.
4. Each class item presents subject/course, section, scheduled time, room/approved location label and session state.
5. Primary per-class action: “Open class” or “View session”; do not place “Generate QR” on an unverified or ambiguous class.
6. Secondary area: recent sessions or recent attendance activity, only if it improves the teacher's next decision.
7. A helpful empty state when no assigned classes/sessions are available.

**Avoid**
- generic revenue-style metric cards;
- global student management controls;
- giant charts;
- a prominent QR action detached from a known class/session;
- sample totals presented as real college data.

### 7.3 TCH-02 — My Classes

**Purpose:** a dependable searchable list of only the classes assigned to the teacher.

**Layout**
- Page title and concise context.
- Search/filter bar only for supported class, course, section or schedule fields.
- Table/list rows with course/subject, section, schedule, room label and next action.
- Clear empty state for no assignments.
- Selecting a row opens the class detail/session workflow.

**Interactions:** search, filter, sort, open details. No Admin-only assignment editing.

### 7.4 TCH-03 — Class / Session Details

**Purpose:** confirm the target before starting or viewing a session.

**Layout**
- Breadcrumb: My Classes → [Class/Session] where helpful.
- Class/subject and section headline.
- Session date/time and room/approved location label.
- Current session status.
- Primary action appropriate to state: Start/Generate QR, Open active session, View register, or View summary.
- Secondary actions only if permitted.

**Guard:** if the session is already active, avoid presenting an action that creates another session unless explicitly supported by policy.

### 7.5 TCH-04 — QR Session Display

**Purpose:** show the correct active QR while preserving context and timer clarity.

**Layout hierarchy**
1. Clear active session title and class/section context.
2. Large, high-contrast QR area centred in the main workspace.
3. Text status plus visible countdown for the QR’s 90-second validity.
4. Small but readable student check-in guidance: after a successful scan, the student has a separate 45-second check-in deadline.
5. Session state and last action/creation time if available.
6. A clear exit/back path that does not accidentally terminate a session.
7. Regenerate/close action only if the approved backend workflow supports it.

**Behaviour**
- QR becomes visible only once confirmed active by the backend.
- On expiry, show “QR expired” and an approved next action; do not leave the expired QR styled as active.
- If connection is lost, visibly distinguish stale/unknown state from an active QR.
- Countdown uses plain text/numbers; colour is supplementary.
- Do not display confidential payload data alongside or under the QR.
- QR display must not imply attendance has already been recorded.

### 7.6 TCH-05 — Live Attendance Register

**Purpose:** monitor authoritative attendance for one session.

**Layout**
- Header identifies class, section, session date/time and current session state.
- Small summary of server-provided states only, with clear labels.
- Table uses the design system's table rules.
- Search/filter controls are above the table and remain usable in a live session.
- Manual attendance action is contextually placed and clearly scoped.
- Refresh/connectivity state is visible but unobtrusive.
- Session closure/summary actions are placed separately from per-student row actions.

**Columns — draft, confirm against actual API**
- Student name
- Approved student identifier
- Attendance status
- Timestamp or outcome time (if returned)
- Action menu/details

Do not add raw location, biometric evidence or internal security fields merely to make the table look detailed.

### 7.7 TCH-07 — Manual Attendance / Exception Dialog

**Purpose:** safely record a valid manual exception.

**Required content**
- Selected student name and identifier sufficient to confirm the target.
- Session/course/section context.
- Current attendance status.
- Reason field (required according to current policy).
- Optional supporting note only if approved and necessary.
- Clear action label and cancellation path.
- Notice if the request will require Admin review.

**Validation**
- No submit if required reason is missing.
- Prevent duplicate submission while the request is in flight.
- If backend returns pending approval, use a pending state—not a confirmed attendance state.
- If failed, preserve safe inputs and show actionable guidance.

### 7.8 ADM-01 — Admin Overview

**Primary question answered:** “What requires administrative attention?”

**Layout hierarchy**
1. Page title and date/context when useful.
2. Action/queue section: pending correction approvals, sessions requiring review, or other real action queues only if supported by the system.
3. Small operational totals only where the API provides trustworthy values and their scope is clear.
4. Recent activity/audit highlights if supported and authorized.
5. Quick links to core workflows.

**Avoid:** invented percentages, charts without a decision purpose, mock values that look real, or a dashboard full of cards with no priority.

### 7.9 ADM-02 — Students List

**Layout**
- Page title plus “Add student” only if a supported and authorized creation workflow exists.
- Search by approved fields.
- Useful filters such as enrollment/active state only if available.
- Table columns should use minimum identifying information: name, approved identifier, status and relevant action.
- Row click opens details; destructive actions are not triggered by row click.
- Empty, no-results and loading states are distinct.

### 7.10 ADM-03 — Student Detail

**Layout**
- Student name and approved identifier in the header.
- Enrollment/account state.
- Related details grouped into readable sections.
- Registered-device status shown only to authorized staff; do not expose device secrets or tokens.
- Attendance summary only if the API and policy permit it.
- Edit, recovery or status actions separated from read-only data and clearly confirmed.

### 7.11 ADM-04 — Teachers List / Detail

Use the same list/detail grammar as Students to reduce relearning. Show only staff fields needed for operational identification and assignment management. Avoid duplicating the full student design without adapting its field semantics.

### 7.12 ADM-05 — Courses & Sections

**Layout**
- Tab or segmented navigation is acceptable if “Courses” and “Sections” are genuinely parallel entities.
- Each list includes clear identity, status and relationship context.
- Create/edit forms use controlled selectors and validations.
- When a record is referenced by sessions or attendance, deactivation should be considered before deletion; follow the backend/data-retention contract.
- Do not display controls for unsupported bulk import/export until implemented and approved.

### 7.13 ADM-06 — Teacher Assignments

**Purpose:** understand who is authorized to teach which class/section.

**Layout**
- Searchable assignments table.
- Clear columns: teacher, course/subject, section, status and validity/schedule if supported.
- Create/edit assignment form with relation pickers.
- Validation feedback for invalid or duplicate assignments.
- Deactivation/removal requires a clear impact message if it affects future workflows.

### 7.14 ADM-07 — Classes / Approved Locations

- Show the human-readable classroom/area label and association with relevant academic context.
- Location anchors and geofence settings are sensitive operational configuration and must be permission-gated.
- Do not invent coordinates in a design prototype.
- Do not allow users to confuse the teacher’s Windows computer location with the approved classroom/session anchor.
- Any distance/radius display must come from approved configuration and be labelled clearly.
- Changes to approved locations should use an explicit review/confirmation flow and be audited according to policy.

### 7.15 ADM-08 / ADM-09 — Attendance Sessions and Session Detail

**List**
- Filters for date, course/section, teacher and session state where supported.
- Default sort should help staff find current/recent sessions.
- Row must expose enough information to choose the correct session.

**Detail**
- Session identity, timing, status and associated class/teacher.
- Authoritative attendance register.
- Linked correction requests and audit history if permitted.
- Clear distinction between read-only inspection and authorized correction actions.
- Do not let a normal “view session” action silently mutate attendance.

### 7.16 ADM-10 / ADM-11 — Correction queue and review detail

**Queue**
- Pending review count comes from the backend.
- Rows show target student, session, requester, submitted time, reason preview and status as permitted.
- Filters are useful for triage, not decorative.

**Detail**
- Current value versus requested value.
- Reason and request context.
- Actor and timestamp details from the authoritative record.
- Approve and Reject actions with clear labels.
- Rejection reason when required by policy.
- Confirmation or re-authentication if required by the approved security policy.
- Result state must reflect the committed backend outcome.

### 7.17 ADM-12 — Reports / Export

- Start with a focused set of agreed report types; do not design a fictional analytics suite.
- Show filters and chosen scope before export.
- Identify date range, course/section and any other filters in the export confirmation/summary.
- Provide progress and success/failure feedback for longer exports.
- Enforce authorization and privacy policy server-side.
- Do not expose more student details than required by the selected report.

### 7.18 ADM-13 — Audit Log

- Read-only by default.
- Filters may include date range, actor, action type and target record if the API supports them.
- Show readable event descriptions and timestamps; technical identifiers can be placed in a detail panel.
- No edit/delete actions for audit entries.
- If a record is unavailable, show an honest unavailable state rather than inventing historical detail.

---

## 8. Tables, lists and dense operational data

### 8.1 Default table behaviour

- Table header remains visible when useful for long results.
- Search/filter state persists when opening a record and returning, unless the user intentionally resets it.
- Sort indicators are visible and keyboard-accessible.
- Pagination or virtualization must not cause confusing jumps in live attendance lists.
- Avoid using hover as the only way to expose row actions.
- Keep destructive actions in an explicit menu or detail screen, not directly beside common row controls without separation.
- Long student names/identifiers should wrap or truncate safely with accessible access to the full value; never truncate away the distinguishing identifier without another way to inspect it.

### 8.2 Live data and stale data

- Show a last-updated time or connection indicator when it materially affects trust.
- If realtime delivery is disconnected, tell the user that updates may be delayed and provide a refresh/reconnect path.
- Distinguish “no attendance records yet” from “could not load records.”
- Never change status based solely on a UI timer or local assumption; show only a server-confirmed state or a clearly labelled pending state.
- Avoid constantly reordering rows in a way that makes a teacher lose their place. Define predictable sorting.

---

## 9. Global state and error design

For each screen, explicitly document applicable states.

| State | Required UX response |
|---|---|
| Initial loading | Use a restrained loading indicator or skeleton matching the content layout; avoid flashing fake data |
| Empty | Explain what is empty and provide a relevant next step if available |
| No search results | State that no records match current filters and offer a clear-filter action |
| Validation error | Place message by the field; explain how to fix it |
| Network/service error | Explain that data/action could not be confirmed; offer retry when safe |
| Unauthorized | Explain permission limitation without exposing protected data |
| Session expired | Ask the user to re-authenticate; preserve safe context where possible |
| Pending | Make clear that the operation has not reached a final state |
| Confirmed success | Show only after authoritative success response |
| Stale/live update disconnected | Show that displayed data may be outdated and provide refresh/reconnect |
| Destructive confirmation | Name the target and consequence before proceeding |
| Partial failure | State which part completed and which did not, based on verified outcomes |

A UI timeout does not always mean the server operation failed. For high-impact actions, query/reconcile the authoritative result before enabling an unsafe duplicate retry.

---

## 10. Cross-screen copy and naming consistency

Use the same label for the same concept across the application. The canonical terminology file should eventually lock these terms.

| Concept | Recommended label | Notes |
|---|---|---|
| Teacher’s authorized teaching group | Assigned class / section | Use institution-confirmed terminology |
| One scheduled attendance event | Attendance session | Do not use “class”, “session” and “event” interchangeably |
| Displayed attendance challenge | QR code / session QR | Avoid “token” in teacher-facing text unless needed |
| Server-confirmed attendance | Confirmed / Present | Match the final policy and data model |
| Change requested after the allowed flow | Correction request | Use “approval” where review is required |
| Teacher-entered exception | Manual attendance / attendance exception | Choose one standard label after team review |
| Session data still syncing/loading | Pending | Explain what is pending; do not imply finality |
| User access restriction | Access denied / You do not have permission | Avoid accusatory language |

Avoid labels that suggest a student committed fraud merely because a validation failed. Use neutral wording such as “Location could not be verified” or “Authentication was not completed” when that is what the system knows.

---

## 11. Google Stitch design workflow

### 11.1 Design order

Design and approve screens in workflow order, not in arbitrary menu order:

1. Teacher Dashboard (visual direction and shell)
2. My Classes
3. Class / Session Details
4. QR Session Display
5. Live Attendance Register
6. Manual Attendance / Exception dialog
7. Admin Overview
8. Students list and Student detail
9. Courses/Sections and Teacher Assignments
10. Attendance Sessions and Session Detail
11. Correction Approval Queue and Review Detail
12. Reports, Audit Log and remaining approved supporting screens

This order validates the critical end-to-end attendance flow before investing time in secondary administration screens.

### 11.2 Stitch prompt pattern

Each screen prompt should include:
- exact screen ID and name from this document;
- target role and task;
- primary viewport (1440 × 900 desktop; review at 1280 × 800);
- reference to `DESIGN_SYSTEM.md`;
- required regions and information hierarchy;
- allowed actions and out-of-scope controls;
- states to render or provide alternate frames for;
- fictional-data instruction;
- exclusions (no Android layout, no fake product features, no backend implementation);
- link/reference to preceding or related screen for consistency.

Generate one screen or tightly related screen set at a time. Do not ask Stitch to create all Admin and Teacher screens in one giant prompt; it tends to produce inconsistent navigation and components.

### 11.3 Review after each Stitch generation

Check:
- hierarchy and visible primary action;
- consistency with the design system;
- readability at the target desktop size;
- realistic table density;
- permission-appropriate controls;
- loading, empty, error and success states where required;
- no invented analytics or misleading data;
- continuity with previously approved screens.

Once approved, save the screen reference and status in the documentation index. Do not treat a raw first generation as approved design.

---

## 12. Antigravity implementation handoff

Before code generation, provide Antigravity:
1. `DESIGN_SYSTEM.md`;
2. this `ADMIN_WINDOWS_UX.md`;
3. the Windows UI/UX `README.md` and current screen inventory;
4. approved Stitch project/screen references available through the connected integration;
5. canonical PRD, attendance workflow, auth/permissions and API contract files;
6. approved assets and their locations.

### Antigravity's expected behaviour

- Inspect the current repository and stack before creating or editing files.
- Use the approved screen reference; do not approximate the visual style from a text summary if a connected source is available.
- Reuse the approved shell and shared components.
- Keep display state separate from business rules.
- Read real API contracts and handle their actual error responses.
- Do not make sample data look like production data.
- Do not invent endpoints, fields, role permissions or test results.
- Do not put privileged secrets into client code.
- Do not claim attendance success before the server confirms the committed record.
- Ask for clarification or log the blocker if a design requires an unapproved business decision.
- Report files changed, tests run and unresolved issues at the end of each implementation task.

### Implementation sequencing

Implement one vertical flow at a time:
1. Shared shell and sign-in states
2. Teacher assigned-class view
3. Session creation + QR display
4. Live attendance register
5. Manual exception workflow
6. Admin review/approval workflow
7. Academic management and reports according to approved scope

This permits testing the complete core workflow early, rather than producing many disconnected screens.

---

## 13. UX acceptance criteria

A Windows screen is not considered ready simply because it looks polished. Its screen specification should have verifiable criteria.

### Common acceptance criteria
- The screen has a clear purpose and target role.
- All displayed actions are defined and permission-appropriate.
- Primary action is visually apparent where applicable.
- Loading, empty, error and forbidden states are covered if relevant.
- Keyboard focus and basic keyboard navigation are considered.
- The design follows tokens in `DESIGN_SYSTEM.md`.
- No fabricated data or unapproved feature is presented as real.
- Each action's UI result matches actual backend outcomes.
- The approved Stitch reference is linked.
- Its implementation can be compared to that reference.

### Core attendance workflow criteria
- A Teacher can identify the assigned class and correct session before generating QR.
- The active QR screen shows the backend-confirmed session and its expiry state.
- QR validity of 90 seconds and the separate 45-second post-scan check-in deadline are communicated without confusing the two timers.
- The live register distinguishes confirmed, pending and failed/unavailable states accurately.
- Manual attendance requires the required reason and has a clear authorized outcome.
- Correction review presents the current and requested values without allowing silent modification.
- UI errors do not bypass server authorization or convert failed checks directly into a false attendance result.

---

## 14. Open decisions and items to verify

These are intentionally listed rather than silently guessed:

- [ ] Confirm the final role/permission matrix against `AUTH_AND_PERMISSIONS.md`.
- [ ] Approve the full v1 screen inventory against `PRD.md`.
- [ ] Confirm whether Teacher historical attendance and report export are in scope.
- [ ] Confirm exact session start, regeneration, close and finalization controls.
- [ ] Confirm what data fields Teachers may see in attendance records.
- [ ] Confirm correction window and approval requirements against the canonical policy.
- [ ] Confirm whether reports, audit log and settings belong in the first prototype.
- [ ] Confirm the approved terminology for courses, sections, batches and rooms.
- [ ] Confirm what realtime or refresh behaviour the actual backend will support.
- [ ] Confirm whether an Admin may manage room anchors in v1 and what validation/review applies.
- [ ] Record actual Stitch screen/project references.
- [ ] Test the design at 1440 × 900 and 1280 × 800, plus common Windows display scaling.
- [ ] Test keyboard focus, contrast and table readability in implementation.

---

## 15. Screen specification template

Create one file per approved screen in the relevant screen-specification folder. Use this template to keep the handoff consistent.

```markdown
# [SCREEN-ID] — [Screen Name]

- Status: Draft / In Review / Approved
- Primary role:
- Related screens:
- Stitch reference:
- Source requirements:

## Purpose
What user task does this screen support?

## Entry points
How does the user get here?

## Primary information
What data must be visible first?

## Actions
List primary and secondary actions with permission requirements.

## Layout
Describe the main regions and hierarchy.

## States
Default, loading, empty, validation, error, pending, confirmed, forbidden, stale data, where applicable.

## Interaction rules
Keyboard, search/filter, table selection, dialogs, confirmation, navigation and recovery behaviour.

## Data and API dependencies
Link to canonical API contracts. Do not invent fields.

## Accessibility
Focus order, labels, contrast, keyboard use and error messaging.

## Acceptance criteria
Verifiable outcomes.

## Open questions
Anything not yet decided.
```

---

## 16. Review and approval log

| Version | Status | Change | Owner / reviewer | Date |
|---|---|---|---|---|
| 1.0 | Draft | Initial Admin/Teacher UX architecture, screen inventory and workflow specification | Pending team review | 9 October 2026 |

**Approval rule:** Mark this document `Approved` only after the team has reviewed the screen inventory and core workflow against the PRD, permissions policy and attendance workflow. Approval of this UX document does not authorize changes to backend rules.

---

**Guiding principle:** TRUEMUSTER Windows is an operational tool used during real college workflows. Every screen should help staff act quickly, understand the current state and avoid accidental or unauthorized changes—without sacrificing readability, consistency or auditability.

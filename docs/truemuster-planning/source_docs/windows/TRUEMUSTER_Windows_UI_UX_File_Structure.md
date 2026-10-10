# TRUEMUSTER — Windows UI/UX Documentation Structure

**Purpose:** Define only the folder and file structure for the Windows Admin/Teacher UI/UX documentation. This is a planning structure, not the actual UI design or implementation.

## 1. Recommended repository location

```text
truemuster/
└── docs/
    └── ui-ux/
        └── windows/
            ├── README.md
            ├── 00-project-context/
            │   ├── product-scope.md
            │   └── terminology.md
            ├── 01-design-system/
            │   ├── design-principles.md
            │   ├── color-palette.md
            │   ├── typography.md
            │   ├── spacing-and-layout.md
            │   ├── components-inventory.md
            │   ├── icons-and-assets.md
            │   ├── motion-and-interactions.md
            │   └── accessibility.md
            ├── 02-information-architecture/
            │   ├── sitemap.md
            │   ├── navigation-model.md
            │   ├── role-based-navigation.md
            │   └── screen-inventory.md
            ├── 03-user-flows/
            │   ├── admin-flows.md
            │   ├── teacher-flows.md
            │   ├── authentication-and-session.md
            │   ├── class-and-qr-session.md
            │   ├── attendance-review-and-correction.md
            │   └── reports-and-export.md
            ├── 04-screen-specifications/
            │   ├── authentication/README.md
            │   ├── shared-shell/README.md
            │   ├── admin/README.md
            │   ├── teacher/README.md
            │   └── shared/README.md
            ├── 05-interaction-states/
            │   ├── loading-empty-error.md
            │   ├── forms-validation.md
            │   ├── tables-search-filter-pagination.md
            │   ├── dialogs-drawers-toasts.md
            │   └── permissions-and-denied-actions.md
            ├── 06-prototypes-and-references/
            │   ├── prototype-links.md
            │   ├── design-references.md
            │   └── assets-index.md
            ├── 07-implementation-handoff/
            │   ├── frontend-structure-guidance.md
            │   ├── component-mapping.md
            │   ├── data-and-api-boundaries.md
            │   └── acceptance-criteria.md
            └── 08-review-and-decisions/
                ├── open-questions.md
                ├── review-checklist.md
                └── decisions-log.md
```

## 2. Folder responsibilities

| Folder/file | Responsibility |
|---|---|
| `README.md` | Entry point: purpose, read order, status, links and instructions for Antigravity. |
| `00-project-context/` | Product context and shared terminology; prevents UI documents from inventing behaviour. |
| `01-design-system/` | Visual foundations and reusable design rules for Windows screens. |
| `02-information-architecture/` | Screen inventory, hierarchy, navigation and role-based visibility. |
| `03-user-flows/` | Step-by-step Admin and Teacher journeys before individual screens are designed. |
| `04-screen-specifications/` | Screen-by-screen specifications grouped by role and shared layouts. |
| `05-interaction-states/` | Loading, empty, error, validation, confirmation and permission-denied states. |
| `06-prototypes-and-references/` | Links to Figma/Canva/Lovable prototypes and an index of supplied assets. |
| `07-implementation-handoff/` | Guidance for translating approved designs into components and using backend contracts. |
| `08-review-and-decisions/` | Open questions, review checklist and decisions log to prevent silent assumptions. |

## 3. What the Windows UI/UX README must contain

1. **Project:** TRUEMUSTER — Windows Admin/Teacher UI/UX.
2. **Purpose:** Design documentation for the Windows app, not the backend source of truth.
3. **Status:** Planning / Draft until reviewed and approved.
4. **Scope:** Admin and Teacher experiences in one Windows application, with role-appropriate access.
5. **Out of scope:** Student Android UI; backend implementation; unapproved future features.
6. **Read order:** Project context → Design system → Information architecture → User flows → Screen specifications → Interaction states → Implementation handoff.
7. **Source-of-truth rule:** Product behaviour comes from the approved PRD and workflow/API documents. UI documents must link to those documents, not redefine or contradict them.
8. **Design rule:** Use the approved navy, red and white direction. Exact colour tokens and values remain draft until approved in the design system.
9. **Role rule:** Admin and Teacher may share the app shell, but only authorized screens/actions should be shown or enabled for each role. Backend authorization remains authoritative.
10. **Antigravity instructions:** Read this README and relevant linked files before coding. Do not invent screens, API fields, permissions or test results. Flag conflicts and update docs when approved decisions change.
11. **Progress checklist:** Track design tokens, sitemap, user flows, screen specs, prototype links, handoff and review.
12. **Links:** Relative links to the key documents here and the canonical PRD, architecture, API contracts, security and attendance workflow elsewhere in the repository.

## 4. Screen-specification naming convention

When screens are ready to specify, create one Markdown file per screen in the appropriate subfolder. For example:

```text
04-screen-specifications/
└── teacher/
    ├── dashboard.md
    ├── class-sessions.md
    ├── qr-session-display.md
    ├── live-attendance-register.md
    ├── attendance-correction.md
    └── reports.md
```

These are example filenames, not a finalized screen inventory. Confirm the actual list in `02-information-architecture/screen-inventory.md` first. Each screen specification should link to its user flow and relevant interaction-state rules.

## 5. File conventions

- Use descriptive, lowercase kebab-case filenames.
- Keep one primary topic per Markdown file.
- Use relative links between documents.
- Mark each document `Draft`, `In Review`, or `Approved`.
- Record important decisions in `08-review-and-decisions/decisions-log.md`.
- Do not duplicate the full PRD, database schema or API contracts in UI/UX documents.
- Never put credentials, API keys, personal student data or real biometric material in documentation.
- Never claim design, accessibility, security or device behaviour has been tested unless it has actually been tested.

## 6. Suggested creation order

1. `README.md`
2. `00-project-context/product-scope.md` and `terminology.md`
3. `01-design-system/` files
4. `02-information-architecture/sitemap.md` and `screen-inventory.md`
5. `03-user-flows/` files
6. Screen specifications under `04-screen-specifications/`
7. Interaction states
8. Prototype/reference index
9. Implementation handoff and acceptance criteria
10. Review checklist and decisions log

**Important:** This file defines the folder/file structure only. It does not create or finalize individual file contents, screen designs, or implementation architecture.

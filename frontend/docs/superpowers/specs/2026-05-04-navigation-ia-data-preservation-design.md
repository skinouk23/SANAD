# Navigation IA And Data Preservation Design

Date: 2026-05-04
Status: Ready for user review

## Purpose

This design refines the app shell, bottom navigation, patient services hub, account hub, notifications inbox, and provider finance IA for Care@Home Tunisia.

The primary goal is to simplify navigation without losing existing product data or working functionality. Route changes must migrate current data contracts, query behavior, filters, dialogs, and form protections before any old destination is removed.

This document records the approved design direction. It does not authorize implementation until the written spec is reviewed and approved.

## Current Project Context

The app is a React 18, TypeScript, Vite, and Tailwind CSS v4 SPA.

Relevant architecture constraints:

- Route ownership lives in `src/app/router`.
- Route entry modules live in `src/pages`.
- Domain data, hooks, schemas, services, query keys, and feature UI live in `src/features`.
- Shared UI primitives and composites live in `src/shared/ui`.
- New generic UI must not go into legacy `src/components`.
- Server state stays in TanStack Query.
- Auth state stays in `src/contexts/AuthContext.tsx`.
- Theme state stays in `src/shared/lib/theme`.
- Language state stays in `src/shared/lib/i18n`.
- Tailwind v4 semantic tokens live in `src/styles/theme-tokens.css`.
- shadcn is configured through `components.json` with `@/shared/ui/primitives`, `@/shared/ui`, and `@/shared/lib` aliases.

Current navigation issues:

- Patient bottom nav has too many destinations and includes secondary areas such as Equipment and Medications.
- Provider bottom nav exposes Wallet, Transactions, and Analytics as separate primary destinations even though they belong under Finance.
- The top bar has account controls but no global notifications entry.
- The app has notification translation keys and a patient dashboard notification panel, but no real API-backed notification inbox route.
- Existing profile editor routes are useful but are not account hubs.
- Provider wallet, transaction history, and analytics already have feature slices that must not be lost during the finance IA change.

## Goals

- Keep bottom navigation limited to stable top-level destinations.
- Add a real authenticated notification inbox.
- Add patient and provider Account hubs without replacing existing profile editors.
- Add a patient-only Services hub while preserving public service discovery.
- Make Provider Finance the canonical parent for wallet, payment transactions, and analytics.
- Preserve existing data, filters, forms, dialogs, mutations, query keys, schemas, loaders, and route guards unless the migration table explicitly changes them.
- Keep UI aligned with shadcn/Radix and Tailwind v4 semantic tokens.

## Non-Goals

- No implementation is authorized by this spec alone.
- No backend rewrite beyond the minimal notification API contract described here.
- No public route redesign beyond the public bottom navigation discipline in this document.
- No replacement of React Router, TanStack Query, Axios, Zod, Tailwind v4, Radix, shadcn, or Sonner.
- No Base UI adoption.
- No new state library.
- No broad visual rebrand.
- No component gallery route.
- No forced redesign of existing profile editors, booking flows, wallet mutations, transaction filters, or analytics data loading.

## Chosen Approach

Use one unified navigation IA spec with a route-by-route migration table.

This keeps the product model coherent while making each moved or removed destination explicit. The table prevents accidental deletion of working data surfaces.

Alternatives considered:

- Minimal navigation cleanup: lower risk, but it leaves finance and services IA mostly unresolved.
- Split specs by domain: easier to implement in small pieces, but cross-area shell and route rules can drift.

The selected approach keeps one master design and still supports phased implementation.

## App Shell

The app keeps one global shell. The shell becomes stricter about destination hierarchy.

Authenticated root pages show global actions only:

```text
[bell] [avatar]
```

Authenticated detail pages show route back plus global actions:

```text
[back] [bell] [avatar]
```

Account-owned pages show route back plus notifications, but no avatar:

```text
[back] [bell]
```

The avatar is hidden inside Account-owned pages because it only links back to the Account area.

Top-bar control rules:

- The bell opens `/notifications` on authenticated screens.
- The avatar opens the role-specific Account hub.
- The avatar is not shown on Account hub pages or Account-owned subpages.
- Theme and language controls move out of the authenticated top bar and into Account, Settings, or Preferences.
- Public and auth screens may continue exposing theme and language controls in the top bar.
- Dashboard content must not duplicate shell-level bell or avatar controls.

Back behavior:

- Existing route `handle.parent` behavior remains the default for normal route parents.
- `/notifications` uses history-first back behavior.
- If `/notifications` has no useful app history, it falls back by role:
  - patient -> `/patient-dashboard`
  - provider -> `/provider-dashboard`

## Bottom Navigation

Authenticated patient bottom nav:

```text
Home | Services | My Space | Messages
```

Authenticated provider bottom nav:

```text
Dashboard | Services | Schedule | Messages | Finance
```

Public unauthenticated bottom nav:

```text
Home | Services | How it works | Login
```

Rules:

- Bottom nav contains only top-level destinations.
- Do not use a horizontally scrolling bottom nav.
- Do not put Help, Logout, Equipment, Medications, Wallet, Transactions, or Analytics in bottom nav.
- Removed bottom-nav entries are not automatically deleted. Their route and data behavior follow the migration table.
- The Messages item may keep a badge, but notification state belongs to the global bell and `/notifications` inbox.

## Patient Services Hub

The public `/services` route stays as the current public service discovery surface.

A new authenticated patient route becomes the canonical patient services hub:

```text
/patient/services
```

Patient bottom nav `Services` points to `/patient/services`.

The patient Services hub contains three prominent destination cards:

```text
Care Services -> /services
Equipment     -> existing equipment browsing route
Medications   -> existing medications route
```

Rules:

- Public service availability remains as it is today.
- This spec changes authenticated navigation entry points, not public browsing rules.
- Equipment and Medications are removed from patient bottom nav, but their existing routes remain unless the migration table changes them.
- The hub must not become a giant mixed list of services, equipment, and medications.
- Search appears on the hub only if it clearly searches across all three branches. Otherwise, search stays inside branch pages.
- Booking and request flows reached through the hub must preserve current route guards, wizard state behavior, query keys, idempotency behavior, and backend contracts.

## Account Hubs

Avatar opens a role-specific Account hub:

```text
/patient/account
/provider/account
```

Existing editable profile screens stay at their current routes:

```text
/patient/profile
/provider/profile
```

The Account hub is a navigation page, not an editor.

Account hub structure:

- Identity card: avatar, display name, secondary role or contact line, and an Edit profile action.
- Account group: account details or profile editor, payment history or payouts and transactions, notification preferences, settings.
- Support and legal group: contact us, terms, privacy policy, get help.
- Session group: logout, visually separated and destructive-styled.

Row behavior:

- Existing destinations use full-width tappable rows with leading icon, label, optional description, and trailing chevron.
- Planned rows may appear as non-interactive disabled rows with a visible Coming soon badge.
- Disabled rows must not trigger a toast, dialog, route change, or hidden action.
- Rows that navigate should not be implemented as accordions.
- The Account hub should not use an overflow menu for core destinations.

Data preservation:

- Existing patient and provider profile editors are linked, not absorbed.
- Existing preferences hooks, security sections, optimistic notification toggles, and profile form behavior remain owned by their current feature areas.
- Dirty-form protections must remain intact so background refetches do not overwrite unsaved edits.

## Notifications Inbox

Notifications becomes a real API-backed global inbox.

Route:

```text
/notifications
```

Access rules:

- Protected for patient and provider users.
- One shared route serves both roles.
- The backend returns only notifications visible to the signed-in user.
- The bell in the authenticated top bar always opens `/notifications`.

The existing `src/features/patient/dashboard/components/NotificationsPanel.tsx` is not a valid data source. It may inform UI tone, category names, and icon mapping, but the new inbox needs a proper feature slice with schema, service, keys, options, and hooks.

### Notification Categories

The inbox is broad and cross-role. It covers patient and provider notifications, role-filtered by the backend.

Supported categories:

- booking
- message
- finance
- account
- security
- system
- reminder
- schedule
- reward

### Minimal API Contract

The frontend should assume a minimal REST contract. Endpoint names can be adjusted during backend integration, but the capability set should remain.

List notifications:

```text
GET /api/notifications?cursor=&limit=&status=&category=
```

Response:

```json
{
  "items": [
    {
      "id": "notif_123",
      "category": "booking",
      "title": "Appointment confirmed",
      "body": "Your appointment is confirmed for tomorrow at 14:00.",
      "createdAt": "2026-05-04T06:00:00.000Z",
      "readAt": null,
      "archivedAt": null,
      "severity": "info",
      "action": {
        "label": "View booking",
        "url": "/mon-espace"
      },
      "actor": {
        "name": "Amira Mansour",
        "avatarUrl": null
      },
      "metadata": {}
    }
  ],
  "nextCursor": null
}
```

Unread count:

```text
GET /api/notifications/unread-count
```

Response:

```json
{
  "count": 3
}
```

Mark one notification read:

```text
PATCH /api/notifications/:id/read
```

Mark all notifications read:

```text
PATCH /api/notifications/read-all
```

Archive or hide one notification:

```text
PATCH /api/notifications/:id/archive
```

Undo archive for one notification:

```text
PATCH /api/notifications/:id/unarchive
```

Delete one notification permanently:

```text
DELETE /api/notifications/:id
```

Pagination and limits:

- Notification lists use cursor pagination.
- The server enforces a hard `limit` cap.
- The default inbox excludes archived or deleted notifications.

Status and category filters:

- `status=unread` returns unread items.
- `status=archived` returns archived items if the backend supports an archive view.
- `category` filters by one notification category.

Error shape:

```json
{
  "error": {
    "code": "notification_not_found",
    "message": "Notification not found.",
    "details": {
      "id": "notif_123"
    },
    "requestId": "req_abc123"
  }
}
```

HTTP behavior:

- Use `401` for unauthenticated users.
- Use `403` for authenticated users who cannot access a notification.
- Use `404` when a notification does not exist or is not visible to the actor.
- Use `422` for invalid filters or request shapes.
- Do not return `200` with an error body.

### Notification UI Behavior

- Unread count powers the bell badge.
- Dot badge is acceptable when the count is unknown.
- Count badge is used when count is available and useful.
- Default row removal action is Archive or Hide.
- Archive should offer an undo affordance backed by unarchive behavior.
- Permanent delete is a secondary destructive action.
- If the backend supports a recovery window, permanent delete can use recovery. If it does not, permanent delete requires explicit confirmation.
- Mark read, mark all read, archive, and delete use mutations with targeted invalidation.
- The page must handle empty, loading, error, and partially failed mutation states.

## Provider Finance

Provider bottom nav `Finance` points to the new canonical route:

```text
/provider/finance
```

Old finance bottom-nav entries are removed:

```text
/provider/balance
/provider/transactions
/provider/analytics
```

They are not kept as public aliases after migration. Their data and interactions must be available through the new Finance route structure before the old routes are removed.

Finance route structure:

```text
/provider/finance
/provider/finance/transactions
/provider/finance/analytics
```

### Finance Landing

The landing page answers: What is my balance, and why did it change?

It includes:

- Wallet summary.
- Wallet movement history.
- Two prominent CTA cards:
  - Payment Transactions.
  - Analytics.

Layout:

- Desktop: wallet summary and CTA cards sit side-by-side in a balanced hero area.
- Mobile: stack as wallet summary, CTA cards, wallet movements.

Wallet behavior to preserve:

- Current summary values.
- Top-up flow.
- Mark transferred flow.
- Cancel top-up flow.
- Copy reference behavior.
- Movement filters.
- Movement pagination.
- Dialog behavior.
- Mutation error handling.
- Query invalidation behavior.

Wallet movements stay on the Finance landing page because they explain balance changes. Examples include top-ups, payouts, fees, holds, releases, adjustments, and settlement movements.

### Payment Transactions Page

Route:

```text
/provider/finance/transactions
```

This page migrates the existing payment and business transaction history from `/provider/transactions`.

It stays mostly utilitarian. It should preserve:

- Search.
- Status filters.
- Pagination.
- Payment references.
- Booking links.
- Stats cards where still useful.
- List or table behavior.
- Existing schema and service validation.

This page answers: What happened to this booking or payment business event?

### Analytics Page

Route:

```text
/provider/finance/analytics
```

This page migrates the existing provider analytics from `/provider/analytics`.

It can receive a more visual treatment later, but it must remain system-compliant and preserve current data behavior.

This page answers: How is my provider business performing over time?

### Finance Data Preservation

The migration must preserve or intentionally move:

- `provider-wallet` query keys, options, service calls, schemas, hooks, dialogs, filters, and mutations.
- `provider-payment-history` query keys, options, service calls, schemas, hooks, filters, stats, and pagination.
- Provider analytics query options, hooks, charts, summaries, period selection, and loaders.
- Existing error messages and recovery actions.
- Existing Zod validation at the service boundary.

Wallet movements and payment transactions remain distinct concepts.

## Route Migration Table

| Current route | Target route or status |
| --- | --- |
| `/` | Keep public Home. |
| `/services` | Keep public service discovery. |
| `/how-it-works` | Keep public nav destination. |
| `/auth/login` | Keep public nav destination. |
| `/aide` | Keep as support/help destination, remove from bottom nav, and expose through Account where role access is supported. |
| `/patient-dashboard` | Keep as patient Home. |
| `/mon-espace` | Keep as patient My Space. |
| `/messages` | Keep shared Messages. |
| `/messages/:conversationId` | Keep shared message detail. |
| `/patient/services` | New authenticated patient Services hub. |
| `/equipment` | Keep current public/current behavior; remove from patient bottom nav. |
| `/equipment/:id` | Keep existing guard/current behavior. |
| `/equipment/booking/:equipmentId` | Keep existing booking behavior. |
| `/medicaments` | Keep existing patient route; remove from bottom nav. |
| `/donation-medicaments` | Keep existing child route. |
| `/patient/account` | New patient Account hub. |
| `/provider/account` | New provider Account hub. |
| `/patient/profile` | Keep existing patient profile editor. |
| `/provider/profile` | Keep existing provider profile editor. |
| `/notifications` | New shared protected notification inbox. |
| `/provider-dashboard` | Keep as provider Dashboard. |
| `/provider/services` | Keep provider Services. |
| `/provider/schedule` | Keep provider Schedule. |
| `/provider/finance` | New provider Finance landing. |
| `/provider/finance/transactions` | New provider payment transactions page. |
| `/provider/finance/analytics` | New provider analytics page. |
| `/provider/balance` | Remove only after wallet summary, movements, and wallet actions are migrated. |
| `/provider/transactions` | Remove only after payment transaction history is migrated. |
| `/provider/analytics` | Remove only after analytics is migrated. |

Migration rules:

- Remove means no longer canonical and not kept as a public alias after migration.
- Existing functionality must be reachable from the target route before any old route is removed.
- Routes with forms, filters, pagination, dialogs, or pending mutations need explicit migration verification.
- Route handles and back parents must be updated to match the new IA.
- Public routes do not change except where the public bottom nav is explicitly standardized.

## UI System Rules

- Use shadcn/Radix-aligned primitives already configured through `components.json`.
- Add shadcn components only through the current project registry workflow.
- Dry-run and inspect registry output before adding or updating shadcn components.
- Normalize generated code to project aliases, semantic tokens, accessibility rules, and Lucide icon usage.
- New shared UI belongs in `src/shared/ui/primitives` or `src/shared/ui/composites`.
- Feature-specific UI stays in its owning feature slice.
- Do not add new generic UI to legacy `src/components`.
- Use semantic Tailwind classes such as `bg-background`, `bg-card`, `text-muted-foreground`, `border-border`, `ring-ring`, `bg-primary`, `bg-destructive`, `bg-success`, and `bg-warning`.
- Do not introduce reusable raw color systems for service categories, finance areas, or notification categories.
- 21st.dev inspiration may inform polished composites, but copied output is not accepted directly.

## Accessibility Rules

- Bottom nav stays at 3-5 destinations per role.
- Icon-only bell and avatar buttons need accessible names.
- Notification badges must not communicate state by color alone.
- Account rows and Finance CTA cards must be keyboard reachable and use real links or buttons.
- Disabled Account rows must expose disabled state and include visible Coming soon text or a badge.
- Dialogs, sheets, and confirmations need accessible titles.
- Permanent notification delete requires destructive styling and confirmation or recovery support.
- Focus rings must remain visible in light and dark themes.
- The authenticated top bar must not duplicate avatar controls inside Account-owned pages.
- The Notifications page must expose loading, empty, error, unread, archived, and destructive action states in accessible ways.

## Error Handling

- Feature services continue to validate backend payloads with Zod before handing data to UI code.
- Notification API failures use the canonical API error shape and honest HTTP statuses.
- Notification mutations should preserve the previous list state on failure.
- Archive undo uses the unarchive capability and restores the item to the inbox.
- Finance migration must preserve existing wallet, transaction, and analytics error states and recovery actions.
- Account hub disabled rows should not produce runtime errors or navigate to missing pages.
- Services hub branch links must not break existing public or patient route guards.

## Verification Plan

Default checks for implementation:

```text
npm run lint
npm run type-check
```

Run this for shell, router, shared UI, or release-sensitive changes:

```text
npm run build
```

Manual checks:

- Patient bottom nav on mobile and desktop.
- Provider bottom nav on mobile and desktop.
- Public bottom nav.
- `/patient/services` hub.
- Existing `/services` public discovery behavior.
- Account hubs and profile editor links.
- Account-owned pages hide the top-bar avatar.
- `/notifications` list, unread count, mark read, mark all read, archive, undo archive, and permanent delete.
- `/notifications` browser/history back and role fallback.
- `/provider/finance` landing page on desktop and mobile.
- `/provider/finance/transactions` refresh and direct entry.
- `/provider/finance/analytics` refresh and direct entry.
- No loss of wallet movements, payment transactions, analytics, profile data, services data, equipment browsing, medications routes, or booking/request flows.

## Implementation Phases

Phase 1: Shell and bottom nav contract

- Update bottom nav destination sets.
- Add authenticated bell entry point.
- Move authenticated theme/language access into Account or Settings surfaces when those surfaces exist.
- Preserve public bottom nav destinations.

Phase 2: Patient Services hub

- Add `/patient/services` under the patient guard.
- Link patient bottom nav Services to the new hub.
- Preserve public `/services`, equipment, medication, and booking routes.

Phase 3: Account hubs

- Add `/patient/account` and `/provider/account`.
- Link avatar to the role-specific Account hub.
- Preserve `/patient/profile` and `/provider/profile` as profile editors.
- Add disabled Coming soon rows only where destinations are planned but absent.

Phase 4: Notifications feature

- Add a `notifications` feature slice with schema, service, keys, options, and hooks.
- Add `/notifications` under a patient/provider guard.
- Implement list, unread count, mark read, mark all read, archive, unarchive, and permanent delete behavior against the backend contract.
- Retire or ignore the hardcoded dashboard notification panel as a data source.

Phase 5: Provider Finance migration

- Add `/provider/finance` landing.
- Move wallet summary, wallet movements, and wallet actions into the Finance landing.
- Move payment transaction history to `/provider/finance/transactions`.
- Move provider analytics to `/provider/finance/analytics`.
- Remove old finance routes only after their functionality is available under the new structure.

Phase 6: Polish and documentation

- Update route docs and styling guidance if implementation changes accepted usage.
- Verify shell behavior, route guards, data preservation, and accessibility.

## Acceptance Criteria

- Patient bottom nav shows Home, Services, My Space, and Messages.
- Provider bottom nav shows Dashboard, Services, Schedule, Messages, and Finance.
- Public bottom nav shows Home, Services, How it works, and Login.
- Authenticated top bar exposes notifications and account access without duplicating those controls inside dashboards.
- Account-owned pages hide the avatar from the top bar.
- `/patient/services` exists as the authenticated patient services hub.
- Public `/services` keeps its current public discovery behavior.
- `/patient/account` and `/provider/account` exist as Account hubs.
- Existing `/patient/profile` and `/provider/profile` remain editable profile screens.
- `/notifications` exists as a protected API-backed inbox.
- Notification archive is the default hide action, and permanent delete is secondary and destructive.
- `/provider/finance` exists as the provider Finance landing page.
- `/provider/finance/transactions` and `/provider/finance/analytics` exist as Finance child pages.
- Wallet movements stay with the wallet summary.
- Payment transactions and wallet movements remain distinct views and concepts.
- Old finance routes are removed only after wallet, transaction, and analytics functionality is migrated.
- No existing wallet, transaction, analytics, profile, service, equipment, medication, or booking data behavior is lost.
- `npm run lint` and `npm run type-check` are the default verification checks.
- `npm run build` is used for shell, router, shared UI, or release-sensitive changes.

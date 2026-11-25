# Navigation Access Rollback Design

Date: 2026-05-04
Status: Ready for user review

## Purpose

This design restores the `Merged_Work` page-access model while preserving unrelated work on the current branch.

The rollback is not a visual rebrand and not a full branch revert. It changes how users reach pages through the app shell, bottom navigation, top bar, and provider finance routes.

## Current Project Context

The project is a React 18, TypeScript, Vite, and Tailwind CSS v4 SPA. Route ownership lives in `src/app/router`, page entry modules live in `src/pages`, and feature behavior lives in `src/features`.

The current branch differs from `Merged_Work` across 499 files. The navigation change is concentrated in commit `db459b1 updated the navigation`, but later branch work also touches wallet behavior, uploads, booking flows, shadcn primitives, dialogs, forms, and theme tokens.

Relevant current changes:

- `CyberLayout` became `AppLayout`.
- `CyberBottomNav` became `BottomNav`.
- Top-bar avatar links now target Account hubs.
- The authenticated top bar now includes a notification bell.
- Theme and language controls moved out of the authenticated top bar.
- Patient bottom nav now points Services to `/patient/services`.
- Provider bottom nav now points Finance to `/provider/finance`.
- Old provider finance routes `/provider/balance`, `/provider/transactions`, and `/provider/analytics` are no longer the main access model.

## Approved Direction

Use a surgical page-access rollback.

Keep neutral current module names where possible, such as `AppLayout`, `BottomNav`, `appLayoutRoutes`, and current `*Page` page-entry names. Restore the `Merged_Work` access behavior inside those modules instead of resurrecting every old `Cyber*` filename.

## Goals

- Restore patient bottom navigation to the `Merged_Work` destination set.
- Restore provider bottom navigation to the `Merged_Work` destination set.
- Restore direct provider finance routes as canonical routes.
- Restore avatar behavior so it opens the profile editor directly.
- Restore theme and language controls in the authenticated top bar.
- Remove the notification bell from the top-bar access path.
- Preserve unrelated branch work unless it directly blocks the rollback.

## Non-Goals

- Do not revert the whole branch to `Merged_Work`.
- Do not remove uploads, wallet refactors, booking fixes, shadcn primitives, dialog consistency, or form consistency work.
- Do not redesign the visual theme.
- Do not rename every current neutral page module back to `Cyber*`.
- Do not make Account hubs, Patient Services hub, Notifications, or Provider Finance hub the primary access model.
- Do not add tests unless the implementation uncovers a route contract that cannot be verified by existing checks.

## Alternatives Considered

### A. Whole-Commit Revert

Revert the navigation commit as a unit.

This is simple in concept but high risk. Later branch work depends on some renamed files and current shared UI. It may also remove useful unrelated feature work.

### B. Surgical Page-Access Rollback

Keep the current module structure and restore old access behavior.

This is the selected approach. It restores how users reach pages while avoiding broad collateral changes.

### C. Compatibility-Only Rollback

Add old routes as aliases while keeping the simplified current nav.

This is low disruption, but it does not meet the approved target because users would still not reach pages through the `Merged_Work` navigation shape.

## App Shell

`src/app/layouts/AppLayout.tsx` remains the active layout module.

Top-bar behavior returns to the `Merged_Work` access model:

- Show `ThemeSwitcher` and `LanguageSelector` for authenticated and unauthenticated users.
- Link the avatar to `/patient/profile` for patients.
- Link the avatar to `/provider/profile` for providers.
- Remove the notification bell from the top bar.
- Remove shell-level unread-count fetching.
- Remove account-owned avatar hiding from active shell behavior.
- Keep route loading and route `handle.parent` back-button behavior.

Profile routes should also return to dashboard parents. Use `/patient-dashboard` as the parent for `/patient/profile` and `/provider-dashboard` as the parent for `/provider/profile`. Do not mark profile routes as account-owned in the restored access model.

`src/app/shell/AppShell.tsx` does not need a behavioral rollback. The neutral shell can remain because the approved target is page access, not full cyber styling.

## Bottom Navigation

`src/app/shell/BottomNav.tsx` remains the active bottom navigation module.

Patient bottom nav returns to the `Merged_Work` destination set:

```text
Home | Services | Equipment | My Space | Medications | Messages | Help | Logout
```

Patient destination paths:

| Item | Path |
| --- | --- |
| Home | `/patient-dashboard` |
| Services | `/services` |
| Equipment | `/equipment` |
| My Space | `/mon-espace` |
| Medications | `/medicaments` |
| Messages | `/messages` |
| Help | `/aide` |
| Logout | `/auth/login` after `logout()` |

Provider bottom nav returns to the `Merged_Work` destination set:

```text
Dashboard | Services | Schedule | Wallet | Analytics | Finances | Messages | Help | Logout
```

Provider destination paths:

| Item | Path |
| --- | --- |
| Dashboard | `/provider-dashboard` |
| Services | `/provider/services` |
| Schedule | `/provider/schedule` |
| Wallet | `/provider/balance` |
| Analytics | `/provider/analytics` |
| Finances | `/provider/transactions` |
| Messages | `/messages` |
| Help | `/aide` |
| Logout | `/auth/login` after `logout()` |

The public unauthenticated bottom nav remains:

```text
Home | Services | How it works | Login
```

Implementation may keep compatible accessibility improvements, such as `aria-current`, real links for normal navigation, and an accessible `nav` landmark. Logout still needs an action because it must call `logout()` before navigating.

The longer authenticated nav should support mobile access without clipping. Horizontal overflow is acceptable here because it matches the old access model and carries more than five destinations.

## Route Access

Provider finance routes return to standalone canonical routes:

| Route | Page module target | Screen behavior |
| --- | --- |
| `/provider/balance` | `BalanceManagementPage` | Wallet and balance management. |
| `/provider/transactions` | `TransactionHistoryPage` | Provider transaction history. |
| `/provider/analytics` | `AnalyticsPage` | Provider analytics. |

Do not route these canonical paths through the `/provider/finance` hub. If old `Cyber*` route entry files no longer exist, use the current neutral page modules that wrap the same feature screens.

Help access must match the restored bottom nav. Because restored provider bottom nav includes Help, `/aide` must resolve for providers instead of redirecting them away. The clean implementation is to move the Help route under a patient-provider shared guard or add a provider-safe route entry that renders the same current Help page with a provider-safe parent.

Routes no longer treated as primary access destinations:

| Route | Rollback behavior |
| --- | --- |
| `/patient/services` | Not used by bottom navigation. The direct Services entry returns to `/services`. |
| `/patient/account` | Not used by the shell avatar. The avatar opens `/patient/profile`. |
| `/provider/account` | Not used by the shell avatar. The avatar opens `/provider/profile`. |
| `/notifications` | Not used by the shell because the top-bar bell is removed. |
| `/provider/finance` | Not used by provider bottom nav. Wallet, transactions, and analytics are direct routes again. |
| `/provider/finance/transactions` | Not used as the canonical transaction route. |
| `/provider/finance/analytics` | Not used as the canonical analytics route. |

Do not use these non-primary routes in the shell, bottom nav, or avatar access. Keep existing direct route entries unless they intercept restored canonical routes or trigger shell-level behavior. Removing hub routes or files can happen in a separate cleanup after this rollback is stable.

## Data Preservation

The rollback changes route access, not feature ownership.

Provider wallet behavior should remain owned by `src/features/provider-wallet` and should preserve current query keys, service calls, schemas, dialogs, top-up behavior, movement filters, pagination, and mutation invalidation.

Provider transaction history should preserve current filters, pagination, stats, payment references, booking links, schemas, and error states.

Provider analytics should preserve current query behavior, charts, summaries, period selection, and loaders.

Patient routes should preserve existing guards, booking flows, medication behavior, equipment browsing, appointment access, and messaging access.

Removing shell unread-count fetching should also remove unnecessary notification API or MSW calls from normal authenticated page loads. Keep notification routes, services, and MSW handlers unless they become unused by their own feature.

## Error Handling

- Guarded routes must keep existing `PatientRoute`, `ProviderRoute`, and `PatientProviderRoute` behavior.
- Unauthenticated users should still redirect to login where a route requires auth.
- The shell back button should keep using `handle.parent` for detail pages.
- Removing notification access means removing only the top-bar bell and shell unread-count hook/import unless another notification artifact directly breaks the restored access model.
- If unused hub files remain, they must not run code during normal route access.
- Direct entry to restored provider routes must not fall through to `NotFoundPage`.
- Provider Help must not point to a patient-only route if it remains in provider bottom navigation.

## Verification Plan

Run the project default checks after implementation:

```text
npm run lint
npm run type-check
```

Run the release-sensitive check because shell and router files change:

```text
npm run build
```

Manual route checks:

- Patient `/patient-dashboard`.
- Patient `/services`.
- Patient `/equipment`.
- Patient `/mon-espace`.
- Patient `/medicaments`.
- Shared `/messages`.
- Patient `/aide`.
- Provider `/provider-dashboard`.
- Provider `/provider/services`.
- Provider `/provider/schedule`.
- Provider `/provider/balance`.
- Provider `/provider/analytics`.
- Provider `/provider/transactions`.
- Provider `/aide`.
- Avatar target for patient: `/patient/profile`.
- Avatar target for provider: `/provider/profile`.
- Logout from patient bottom nav.
- Logout from provider bottom nav.

Manual layout checks:

- Patient bottom nav exposes all restored destinations on mobile.
- Provider bottom nav exposes all restored destinations on mobile.
- Public bottom nav remains unchanged.
- Theme and language controls appear in the top bar for authenticated users.
- No notification bell appears in the top bar.

## Acceptance Criteria

- Patient bottom navigation shows Home, Services, Equipment, My Space, Medications, Messages, Help, and Logout.
- Patient Services points to `/services`, not `/patient/services`.
- Provider bottom navigation shows Dashboard, Services, Schedule, Wallet, Analytics, Finances, Messages, Help, and Logout.
- Provider Wallet points to `/provider/balance`.
- Provider Analytics points to `/provider/analytics`.
- Provider Finances points to `/provider/transactions`.
- Provider Help points to a provider-accessible `/aide` route.
- The top-bar avatar opens `/patient/profile` or `/provider/profile`.
- Theme and language controls show in the authenticated top bar.
- The notification bell is not part of the top bar.
- Shell unread-count fetching is removed from normal authenticated route loads.
- `/provider/balance`, `/provider/transactions`, and `/provider/analytics` resolve directly.
- Unrelated upload, wallet, booking, shadcn, dialog, form, and theme-token changes remain intact unless they directly block the rollback.
- `npm run lint`, `npm run type-check`, and `npm run build` are the implementation verification checks.

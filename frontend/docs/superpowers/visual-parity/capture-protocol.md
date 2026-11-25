# Visual Parity Capture Protocol

## Purpose

This protocol defines Slice 1 evidence capture for restoring legacy frontend visual parity in the current frontend. It is documentation and audit guidance only. It does not authorize implementation changes.

The reader is an engineer capturing visual evidence. After reading this file, they should be able to capture comparable legacy and current screenshots, computed styles, and state notes without leaking credentials or mixing admin scope into the audit.

## Scope

Approved spec: `docs/superpowers/specs/2026-05-05-legacy-frontend-visual-parity-design.md`.

In scope:

| Area | Included |
| --- | --- |
| Public and auth | Landing, services, how-it-works, subscriptions, onboarding, login, signup, specialized signup pages |
| Services and bookings | Public service categories, patient-only details, patient booking flows |
| Patient | Dashboard, services, account/profile, appointments, medications, health, concierge, tracking |
| Provider | Dashboard, account/profile, services, schedule, finance, balance, transactions, analytics, delivery, marketing, insurance, billing |
| Shared | Messages, chat, help, notifications, consent banner, assistant/dock if present, overlays, toasts, shell controls |

Out of scope:

| Area | Rule |
| --- | --- |
| Admin | No admin route, shell, sidebar, dashboard, chart, approval, support, subscription-management, audit, report, fraud, balance, or system-health parity work is included. If admin appears during capture, stop and ask immediately. |

## Browser Setup

Use `playwright-cli` as the browser automation tool of record. It controls navigation, viewport resizing, screenshots, snapshots, console capture, request capture, storage/theme setup, and UI interaction for both source and target captures.

| Setting | Required value |
| --- | --- |
| Browser | Same Playwright browser/channel for source and target captures |
| Zoom | 100% |
| Device scale factor | Browser default unless the viewport tool explicitly sets one; record any non-default value |
| Extensions | Disabled or ignored by using a clean browser profile |
| Cache | Normal cache is acceptable after both apps have warmed once; hard reload before first capture of each route/state pair |
| Motion preference | Default `no-preference` for parity captures; record reduced-motion only as a separate accessibility note |
| Network | Localhost, no throttling |
| Console | Record blocking console errors that visibly affect rendering |
| Time/data | Do not change application code to freeze data. Record dynamic values that may affect visual comparison. |

Capture source and target in the same browser session settings where possible. Do not compare screenshots captured with different zoom, device emulation, language, auth state, or theme.

## Tool Responsibilities

| Evidence type | Tool | Rule |
| --- | --- | --- |
| Navigation and route setup | `playwright-cli` | Open each approved legacy or current route directly after the required storage, auth, theme, language, and consent state is set. Record redirects. |
| Viewport resizing | `playwright-cli` | Set the viewport from the approved matrix before every screenshot, snapshot, computed-style extraction, or interaction. |
| Viewport screenshots | `playwright-cli` | Use `playwright-cli` output as the screenshot evidence of record for the current viewport. |
| Full-page screenshots | `playwright-cli` | Use the same route/state matrix and naming convention as viewport screenshots. Record when fixed shell elements or lazy content make full-page output misleading. |
| Accessibility and DOM snapshots | `playwright-cli` | Capture semantic tree evidence for layout-sensitive or interactive surfaces, especially forms, overlays, navigation, chat, and route guards. |
| Console evidence | `playwright-cli` | Record blocking console errors and warnings that visibly affect rendering, state, or interaction. |
| Request evidence | `playwright-cli` | Record relevant requests when network responses, redirects, mock state, or failed data loads explain a visual mismatch. |
| Storage, theme, language, auth, and consent setup | `playwright-cli` | Prefer real UI controls. If storage setup is needed before navigation, set only the minimal local/session storage keys needed for the capture and never save secrets. |
| Interaction and UI state | `playwright-cli` | Use clicks, typing, selection, hover, key presses, file upload, scrolling, and dialog handling to reach the exact visible state under capture. |
| Computed styles | `playwright-cli eval` | Capture values from the rendered DOM with `window.getComputedStyle(...)`, not source declarations. Keep computed evidence aligned to the same route, theme, viewport, language, auth, and state prefix as screenshots. |
| Runtime debugging | `playwright-cli` and `playwright-cli eval` | Use snapshots, console, requests, and targeted runtime evaluation to explain rendering blockers or state mismatches. |

Screenshots alone are not evidence for computed style, DOM, accessibility, console, request, or interaction claims. Capture the matching `playwright-cli` evidence type before recording those claims.

## Source And Target URLs

| App | Role | Base URL | Rule |
| --- | --- | --- | --- |
| Legacy app | Visual source of truth | `http://localhost:5174/` | Runtime rendering wins over legacy source code when they differ. |
| Current app | Migration target | `http://localhost:5173/` | Current architecture and route ownership remain intact. |

For each route row in the route matrix, capture the same path on both apps when available. If the legacy app uses a different path, record that counterpart before capture. If no exact counterpart exists, capture the nearest legacy visual family and add a decision note.

## Viewport Matrix

| Viewport ID | Size | Purpose |
| --- | --- | --- |
| `desktop-1440x900` | 1440 x 900 | Primary desktop parity |
| `tablet-1024x768` | 1024 x 768 | Tablet layout, shell spacing, card density |
| `mobile-tall-390x844` | 390 x 844 | Modern tall phone, bottom navigation, safe-area behavior |
| `mobile-small-360x800` | 360 x 800 | Narrow phone wrapping, touch target pressure |

Capture both viewport screenshot and full-page screenshot when the page scrolls. For fixed shell elements, capture at top of page and after one meaningful scroll position when the fixed header or bottom navigation overlaps content.

## Theme Matrix

| Theme | Required capture |
| --- | --- |
| Dark | Full parity target for legacy cyber rendering |
| Light | Full parity target for legacy light rendering |

Set theme explicitly before each capture. Do not rely on OS auto theme. Record whether the theme switcher control is visible, active, disabled, or hidden for the route.

## Language Rules

| Language | Capture rule |
| --- | --- |
| French | First pixel-match language for all route, theme, and viewport captures |
| Arabic | RTL smoke check for layout-sensitive surfaces, including shell, navigation, forms, tables, chat, cards, booking flows, and overlays |
| Other locales | Out of Slice 1 parity capture unless a route renders only in another locale |

Before capture, set the same language in both apps. If the legacy and current apps expose different labels or language controls, capture the rendered state and ask immediately before accepting a workaround.

## Auth Rules

No reusable passwords, tokens, secrets, or private credentials may be saved in screenshots, docs, commits, browser snapshots, or visual-regression artifacts.

| Auth state | Capture rule |
| --- | --- |
| Public | Use anonymous state with no patient/provider session. Consent state must be recorded. |
| Patient | Use the approved local seeded patient account supplied for the visual-regression run. Do not write the password anywhere. |
| Provider | Use the approved local seeded provider account supplied for the visual-regression run. Do not write the password anywhere. |
| Legacy patient/provider | Use the legacy Google-login bypass or approved local bypass for the run. Do not document credentials. |

If auth setup fails or a route redirects unexpectedly, record the redirect and ask immediately. Do not bypass current route guards in code for visual capture.

## Consent Handling

Capture consent-dependent surfaces as explicit states.

| State | Required evidence |
| --- | --- |
| First visit / banner visible | Capture the banner, its placement, typography, backdrop interaction, buttons, and overlap with shell/navigation. |
| Accepted or dismissed | Capture the same route after the approved consent action. Record which action was used. |
| Settings/details open, if available | Capture modal/sheet/dropdown chrome, focus state, and scroll behavior. |

Use a clean browser profile or clear only the relevant local state for the app under capture. Do not clear unrelated app data without recording it.

## Evidence Location

All screenshots and computed-style evidence must be saved outside the current frontend app:

`C:\Work\PFE\PRESTACODE\.superpowers\visual-parity\`

Suggested subfolders:

| Folder | Contents |
| --- | --- |
| `screenshots/legacy/` | Legacy app viewport and full-page screenshots |
| `screenshots/current/` | Current app viewport and full-page screenshots |
| `computed/legacy/` | Legacy computed-style JSON or markdown captures |
| `computed/current/` | Current computed-style JSON or markdown captures |
| `dom/legacy/` | Legacy DOM inspection notes or snapshots |
| `dom/current/` | Current DOM inspection notes or snapshots |
| `accessibility/legacy/` | Legacy accessibility snapshots |
| `accessibility/current/` | Current accessibility snapshots |
| `debug/` | Console, network, rendering blocker, and capture failure notes |
| `notes/` | Route-state notes, redirects, console blockers, conflict notes |

Do not save large binary evidence under the current app docs folder.

## Screenshot Naming Convention

Use stable, sortable names.

```text
{sequence}-{app}-{routeSlug}-{theme}-{viewport}-{lang}-{auth}-{state}-{shot}.png
```

Fields:

| Field | Values |
| --- | --- |
| `sequence` | Three-digit route order from the route matrix, for example `001` |
| `app` | `legacy` or `current` |
| `routeSlug` | Path without leading slash; use `root` for `/`; replace `/`, `:`, and dynamic values with `-` |
| `theme` | `dark` or `light` |
| `viewport` | `desktop-1440x900`, `tablet-1024x768`, `mobile-tall-390x844`, `mobile-small-360x800` |
| `lang` | `fr` or `ar` |
| `auth` | `public`, `patient`, or `provider` |
| `state` | Short stable state name, for example `default`, `consent-visible`, `dialog-open`, `empty`, `error`, `loading` |
| `shot` | `viewport`, `fullpage`, or `scrolled` |

Example:

```text
014-legacy-patient-dashboard-dark-desktop-1440x900-fr-patient-default-fullpage.png
014-current-patient-dashboard-dark-desktop-1440x900-fr-patient-default-fullpage.png
```

Computed-style evidence should use the same prefix and a descriptive suffix:

```text
014-legacy-patient-dashboard-dark-desktop-1440x900-fr-patient-default-computed.json
014-current-patient-dashboard-dark-desktop-1440x900-fr-patient-default-computed.json
```

## Computed-Style Targets

Capture computed styles from the rendered DOM, not only CSS declarations.

Prefer `playwright-cli eval` for computed-style extraction. Select the target element in the rendered page and return JSON from `window.getComputedStyle(element)` plus any needed geometry from `element.getBoundingClientRect()`. Keep selectors stable enough to repeat on the legacy and current apps, and record when an element cannot be matched exactly.

For every route group, capture these repeated targets when present:

| Target | Minimum computed fields |
| --- | --- |
| Page root and body | `background`, `backgroundColor`, `color`, `fontFamily`, `fontSize`, `lineHeight`, `minHeight`, `padding`, `overflowX` |
| Cyber background | gradient/background values, fixed positioning, grid overlay opacity, orb size, blur, color, z-index |
| Top header | position, height, backdrop filter, background, border, shadow, padding, z-index |
| Bottom navigation | position, height, item dimensions, active state, icon tile, border, shadow/glow, safe-area padding |
| H1/H2/H3 | font family, size, weight, line height, letter spacing, color, margin, wrapping |
| Body and metadata text | font family, size, weight, line height, color, opacity, truncation/wrapping |
| Button variants | dimensions, padding, radius, gradient/background, border, shadow/glow, transform, transition, disabled/loading styles |
| Cards and surfaces | background, backdrop filter, border, radius, box shadow, padding, gap, hover state |
| Forms | input/select/textarea background, border, ring/focus styles, placeholder color, label typography, invalid/disabled styles |
| Badges/chips/status | background, border, radius, font, icon spacing, selected state, semantic colors |
| Service icon tiles | gradient, icon color, size, radius, shadow/glow, hover transform |
| Tables/lists | row height, header typography, borders, spacing, hover/selected state |
| Messaging | thread list cards, chat bubbles, timestamp typography, composer input, unread indicators |
| Dialogs/sheets/popovers/dropdowns | overlay color, panel background, radius, border, shadow, max size, padding, focus outline |
| Toasts/notifications | placement, surface, icon, title/body typography, action buttons, timeout state if visible |
| Loading/empty/error states | spinner/skeleton/progress dimensions, animation, text styles, illustration/icon styles |
| Consent banner | fixed placement, width, background, border, buttons, typography, stacking above shell |

Use `typography-checklist.md` for typography-specific fields.

## Capture Steps

1. Start or verify both local apps at the approved base URLs.
2. Open the route matrix and select the next route/state pair.
3. Use `playwright-cli` to open a browser session for the legacy route or nearest approved legacy counterpart.
4. Use `playwright-cli` to set the required viewport and any safe storage state for theme, language, auth, and consent. Prefer visible UI controls when they are available.
5. Use `playwright-cli` interactions to reach the exact UI state: click, type, select, hover, scroll, press keys, handle dialogs, or upload files only when the route/state matrix requires it.
6. Stabilize the page without editing code: wait for loading to finish, record dynamic data, and leave real UI state intact.
7. Capture `playwright-cli` viewport and full-page screenshots.
8. Capture `playwright-cli` snapshots for DOM or accessibility evidence when relevant.
9. Capture `playwright-cli` console and request evidence when rendering blockers, redirects, failed data, or state mismatches are relevant.
10. Capture computed-style evidence with `playwright-cli eval` for the required targets.
11. Open the current route with the same state matrix and repeat the same `playwright-cli` setup, interactions, and evidence captures.
12. Record visible mismatches and ownership guess: token, shell, shared component, feature component, route page, or exception candidate.
13. If a conflict appears, ask immediately before proceeding with implementation assumptions.

## Conflict Rules

Ask immediately when any of these occur:

| Conflict | Required action |
| --- | --- |
| A route appears to be admin or admin-adjacent | Stop capture for that surface and ask. |
| Legacy runtime and legacy source code disagree | Treat runtime as source of truth and record the discrepancy. |
| Current route has no exact legacy counterpart | Record nearest visual family and ask before accepting it. |
| A parity change would require moving architecture ownership | Ask before proposing implementation. |
| A legacy visual would remove current accessibility semantics | Preserve semantics where possible and ask for visual exception approval if needed. |
| Auth state cannot be reached without documenting credentials | Stop and ask for a safe local seeded account or bypass instruction. |
| Dynamic data prevents stable comparison | Record it and ask whether a seeded state or exception is approved. |

## User Approval Gates

| Gate | Required approval |
| --- | --- |
| Gate 1: Protocol and route matrix | User accepts the route/state/theme/viewport matrix before implementation planning advances. |
| Gate 2: Baseline evidence | User accepts that source and target evidence has been captured in the approved local evidence path. |
| Gate 3: Conflict resolution | User answers every route, component, auth, data, or accessibility conflict before coding that area. |
| Gate 4: Slice implementation plan | User approves each route-group implementation plan before code changes begin. |
| Gate 5: Exceptions | User explicitly approves any mismatch before it is listed as an accepted exception. |

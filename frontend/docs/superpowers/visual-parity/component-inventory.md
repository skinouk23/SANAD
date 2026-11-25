# Visual Parity Component Inventory

## Purpose

This inventory maps legacy visual patterns to current shared, shell, and feature owners for the visual parity migration. It excludes admin surfaces.

The current architecture remains the implementation boundary. Legacy components and source files are evidence, not architecture to copy.

## Ownership Rules

| Rule | Required direction |
| --- | --- |
| Shared primitives | Repeated low-level UI belongs in current shared primitives. |
| Shared composites | Repeated domain-neutral assemblies belong in current shared composites. |
| Shell | Header, bottom navigation, app background, assistant placement, consent placement, and page offsets belong to current app shell/layout ownership. |
| Feature UI | Business-specific card contents, provider/patient state, and data mapping stay in owning feature/page modules. |
| Legacy shared area | Do not add new generic UI under the old legacy shared area. |
| Admin | Excluded. Do not inventory admin shell, charts, approvals, reports, support, fraud, system health, or subscription-management admin surfaces. |

## Legacy Pattern Mapping

| Legacy pattern | Current owner | Capture targets | Migration note |
| --- | --- | --- | --- |
| Cyber page background with slate gradients, grid overlay, cyan/purple blurred orbs | App shell/layout and global theme styles | Body/root, page wrapper, fixed background elements, z-index layering | Should be centralized before route migration so every page inherits the same visual base. |
| Fixed translucent top header | App shell | Header height, blur, background opacity, border, back button, theme/language controls | Must preserve current route handle/back behavior while matching legacy chrome. |
| Role-aware bottom navigation | App shell bottom navigation | Geometry, active item, icon tile, notification dot, safe-area spacing, top glow | Capture patient and provider variants; admin nav excluded. |
| Assistant dock/entry point | App shell or current assistant owner if present | Current route presence, position above bottom nav when present, floating button/panel, icon, shadow/glow | Resolved by VP-D019: assistant/dock parity is route-specific. Capture where current assistant behavior exists; ask per route before adding missing legacy chatbot, voice assistant, or dock behavior. |
| Consent banner | App shell consent owner | First-visit banner, dismissed state, details/settings state | Must stack correctly with fixed header and bottom nav on mobile. |
| Language selector | Shared composite and app shell placement | Trigger, menu surface, active locale, RTL switch behavior | Preserve current i18n runtime ownership. |
| Theme switcher | Shared composite and app shell placement | Trigger icon/state, dark/light transitions, menu/dropdown if present | Set theme explicitly for captures; do not rely on OS auto. |
| Gradient primary button | Shared button primitive | Background gradient, hover/active scale, shadow glow, focus ring, disabled/loading | Must cover link-like buttons and form submit buttons consistently. |
| Glass secondary/outline/ghost buttons | Shared button primitive | Background opacity, border, text color, hover state, icon spacing | Avoid page-local button class forks. |
| Icon-only action buttons | Shared button primitive or feature-specific wrapper | Size, radius, accessible name, focus ring, hover/active state | Preserve accessible names even if legacy icon-only controls lack them. |
| Glass cards and panels | Shared card primitive and section-card composite | Backdrop blur, border, radius, shadow, padding, hover transform | The reusable surface should support dense cards and large page panels. |
| CyberSurface/page panel wrapper | New or existing shared composite if approved later | Surface background, grid/card overlay, gap, section rhythm | Inventory item only; implementation requires later plan. |
| Page container/header rhythm | Shared layout/page-header composites | Page padding, max width, title/subtitle, action placement | Must account for fixed header and bottom nav offsets. |
| Empty/loading/error composites | Shared composites and app error owners | Empty cards, skeletons, spinners, progress, error fallback | Functional error behavior remains current; visuals match legacy. |
| Inputs, textareas, native selects, Radix selects | Shared form primitives and form-field composites | Dark input surface, cyan focus ring, placeholder, disabled/invalid, label text | Preserve React Hook Form/Zod integration and accessibility labels. |
| Checkbox, radio, switch, toggle, toggle group | Shared primitives | Size, checked state, focus, disabled, label alignment | Capture forms and preferences/settings states. |
| Badges/chips/status pills | Shared badge primitive and domain-specific feature mapping | Status colors, category chips, selected state, metadata badges | Legacy category colors are allowed by the approved visual spec when runtime uses them. |
| Service gradient icon tiles | Shared composite or feature service-card component | Gradient role, icon size, tile radius, glow, hover state | Conflict: tokenized gradient roles vs page-local service gradients needs decision. |
| Dialog, sheet, alert dialog | Shared overlay primitives | Overlay, panel background, radius, border, max height, scroll body, close button | Keep Radix behavior and accessible titles while matching legacy modal chrome. |
| Dropdowns, popovers, command menu | Shared primitives | Menu surface, item hover/active, focus ring, shadow, separator | Capture language menu and any route filters. |
| Tabs | Shared tabs primitive | Trigger density, active underline/background, panel spacing | Capture patient appointments, profile/account, provider finance/services if present. |
| Tables and lists | Shared table primitive plus feature rows | Header typography, row height, hover state, status cells, empty rows | Provider finance/services/orders likely need this. |
| Pagination | Shared pagination primitive | Button size, active page, disabled state, mobile wrapping | Capture wherever lists paginate. |
| Skeleton, spinner, progress | Shared loading primitives | Dimensions, colors, animation, shimmer/progress style | Use existing test motion stubs only in tests; runtime capture uses normal motion. |
| Avatar/profile image | Shared avatar primitive and profile composites | Size, fallback initials, ring/border, status overlay | Capture patient/provider account/profile. |
| Compliance/trust badges | Shared compliance-badges composite | Icon, badge color, text, spacing, card placement | Capture public landing, auth, provider signup if visible. |
| Messaging inbox cards | Messaging route/feature UI with shared card/button/badge primitives | Thread card, unread badge, timestamp, avatar, search/filter | Patient and provider variants may differ. |
| Chat bubbles/composer | Messaging route/feature UI with shared form primitives | Bubble radius/color, alignment, timestamp, input, send button | Must preserve keyboard/focus behavior. |
| Booking stepper and summary cards | Booking route/feature UI with shared form/card/button primitives | Step indicators, form sections, provider summary, totals, confirmation | Many booking routes should share visuals after route-specific fields map in. |
| Provider metric/stat cards | Provider feature UI using shared card/badge primitives | Metric typography, chart/summary visuals, trend badges | Charts need runtime evidence; admin chart patterns are excluded. |
| Patient health metric cards | Patient health feature UI using shared card/progress primitives | Metric values, progress rings/bars, icon tiles, chart colors | VP-D018: capture exact legacy health detail routes first, then ask route by route if older/non-cyber styling conflicts with cyber consistency. |
| Toasts/sonner notifications | Shared toast/sonner primitive | Placement, background, border, icon, title/body typography, action button | Capture success/error/info if safely triggered. |

## Route-Group Component Focus

| Route group | Highest-value shared owners to audit first |
| --- | --- |
| Public/Auth | Shell, background, buttons, cards, forms, badges, language/theme controls, consent banner |
| Services/Bookings | Service cards, gradient icons, provider cards, booking forms, date/time selectors, buttons, status chips |
| Patient | Shell, bottom nav, dashboard cockpit chrome, appointments lists, hybrid account/profile hubs, legacy auth/signup-styled editable profile forms, health cards, concierge cards |
| Provider | Shell, bottom nav, dashboard cockpit chrome, stat cards, service management cards/tables, schedule/calendar, finance tables/cards, hybrid account/profile hubs, legacy auth/signup-styled editable profile forms |
| Shared/Messaging/Help/Notifications | Messaging cards, chat bubbles, notification cards, help accordions/cards, toasts, overlays |
| Unmatched/Needs Decision | Not-found/error surfaces, route fallbacks, exact legacy missing pages |

## Key Conflicts To Ask The User About

| Conflict | Why it matters | Ask before |
| --- | --- | --- |
| `/aide` is guarded shared help | Resolved by VP-D016: keep current guarded behavior and match legacy help only in authenticated patient/provider states | Capturing shared help routes |
| Current app has both account and profile routes for patient/provider | Resolved by VP-D014: use hybrid-by-section treatment, with dashboard cockpit chrome for hubs and legacy auth/signup styling for editable forms | Migrating profile/account pages |
| Provider nested finance pages inherit direct route visuals | Resolved by VP-D017: use legacy `/provider/balance`, `/provider/transactions`, and `/provider/analytics` as canonical sources | Migrating provider finance routes |
| Some health and concierge subroutes may not have exact legacy counterparts | Resolved by VP-D018: capture exact legacy first, then ask route by route before using hub inheritance, cyber consistency, or exceptions when older/non-cyber styling conflicts appear | Migrating patient health/concierge routes |
| Assistant/dock visibility differs by route | Resolved by VP-D019: assistant/dock parity is route-specific; capture current presence and ask before adding missing legacy chatbot, voice assistant, or dock behavior | Migrating routes with legacy assistant surfaces |
| Legacy service gradients conflict with earlier neutral-token guidance | Approved spec supersedes neutral guidance, but token naming still needs ownership clarity | Retargeting shared tokens/components |
| Legacy decorative motion may conflict with accessibility/reduced-motion expectations | Pixel parity should not remove current accessibility support | Adding hover/active/pulse/motion behavior |
| Legacy visual style may be less accessible than current semantics | Current semantic improvements should remain when possible | Changing overlays, icon-only buttons, forms, nav |
| Dynamic seeded data may differ between legacy and current apps | Screenshot comparison can be misleading if cards/lists differ | Accepting route evidence as baseline |
| Auth setup uses local seeded accounts and legacy bypasses | Passwords cannot be documented or saved in artifacts | Capturing patient/provider routes |
| Admin-adjacent provider finance or reporting visuals may resemble admin surfaces | Admin is out of scope even if some patterns look similar | Capturing provider analytics/finance |

## Inventory Status

| Status | Meaning |
| --- | --- |
| Drafted | Slice 1 planning inventory created from approved spec and current route structure |
| Not implemented | No code changes have been made by this inventory |
| Runtime verification needed | Each pattern still needs screenshots and computed styles from the running legacy app |
| Exceptions pending | No component-level visual exceptions are approved yet |

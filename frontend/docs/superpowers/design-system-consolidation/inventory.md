# Design System Consolidation Inventory

## Purpose

This inventory turns repeated UI mechanics introduced or changed since `4725d598d6ca5e3b9de093fc4d9aaaee7416e6f8` into migration decisions. The current `HEAD` design remains the visual source of truth; the baseline commit is only an audit aid. Implemented slices record consolidation status only; known exceptions are preservation boundaries, not rendered-change approvals.

## Implementation Status

### Implemented Slices

- Documentation inventory and exceptions are established.
- `MetricCard` covers provider dashboard and provider schedule stats.
- `AnimatedBorderSurface` covers all listed service headers.
- Booking panels, selectable cards, selected/inactive option constants, and Fast Refresh cleanup are consolidated inside booking ownership.
- `MessagingAvatar` is extracted as feature-local messaging UI.
- `ServiceProviderListing` covers laboratory and radiology service listing routes.
- `StepProgress` covers marketing new campaign and insurance file claim flows.
- `ProviderRouteHeader` covers provider wallet, transactions, dashboard, schedule, services, analytics, marketing, and insurance headers.

### Remaining Or Deferred Work

- Horizontal stats remain deferred because they need a route-family pass separate from provider metric cards.
- Service provider listing extraction is implemented for laboratory and radiology only; extension to other service routes remains deferred.
- Search and filter input chrome remains deferred until the shared input pattern is stable.
- Patient health and concierge local shells remain preservation exceptions; only repeated neutral mechanics should be extracted later.
- Delivery map chrome remains local because it carries live-operation and data-visualization meaning.
- Shell safe-area work remains deferred and shell-owned because it affects global route geometry and fixed mobile UI.
- Overlay caller migrations remain deferred; shared overlay primitives continue to own the chrome.

## Token Candidates

- Glass surfaces: centralize repeated translucent card and panel roles used across provider, marketing, insurance, landing, and services routes. Preserve current blur, border opacity, dark-mode contrast, and hover depth.
- App shell background roles: keep shell-owned background layers, safe-area offsets, fixed overlay spacing, and bottom navigation geometry as named shell tokens or shell utilities before touching route callers.
- Accent glow and border roles: extract only repeated non-business accent mechanics. Service and backend-provided colors stay feature-local.
- Skeleton and loading colors: standardize repeated shimmer, muted surface, and loading-list values when the same visual role appears outside one feature.
- Focus and selected-state rings: centralize repeated focus, selected, active, and invalid rings for controls and selectable surfaces.

## Primitive Variant Candidates

- Button: add or refine variants for gradient primary CTAs and neutral secondary buttons. Preserve current icon spacing, disabled states, hover states, and dark-mode behavior.
- Badge: add size and tone coverage for tiny badges, metadata pills, status chips, and compact labels. Do not turn business category colors into global badge variants.
- Card: add reusable surface variants for glass, elevated, bordered, interactive, dense, and stat-card shells where the same low-level card chrome repeats.
- Input: add search and filter chrome support through an `InputGroup` or `SearchInput` pattern covering icon slots, focus rings, placeholder color, and disabled state.
- Skeleton and Spinner: normalize low-level loading primitives used by shared or feature composites without changing current state semantics.
- Overlays: keep shared dialog, sheet, and alert-dialog chrome as the owner of size, scroll, width, radius, background, padding, close placement, and focus behavior. Migrate callers carefully because overlay geometry is high-risk.

## Composite Candidates

- Glass card and panel surfaces: provider metric card coverage is implemented for dashboard and schedule stats; horizontal stats remain deferred.
- Animated conic service and booking header shell: service header coverage is implemented through `AnimatedBorderSurface`; keep booking-specific shells local unless unchanged reuse is proven.
- Gradient icon tiles: extend the existing gradient icon tile pattern for domain-neutral icon containers. Provider avatars that encode provider identity stay feature-owned.
- Search and filter bars: consolidate repeated search/filter layout, clear actions, density, and mobile stacking after input chrome is stable.
- Selectable cards and options: start with booking-owned extraction because selection rhythm is concentrated there. Promote later only if unrelated routes can reuse it unchanged.
- Loading cards and lists: create shared loading composites when layout and density match across route families. Keep feature-specific skeletons local when they mirror feature-only content structure.
- Service provider list cards: laboratory and radiology coverage is implemented under the services feature UI boundary; broader service-route extension remains deferred.
- Wizard step progress: marketing new campaign and insurance file claim coverage is implemented.

## Feature-Local Exceptions

- Backend and service accent mechanics remain feature-local under `src/features/services/service-colors.ts` and `src/features/services/useServiceAccent.ts` because they represent service data and backend-driven visual meaning.
- Booking neutral flow chrome stays booking-local first. Its selectable cards, selected/inactive option constants, action bars, and flow panels should not become global until another route family can reuse them without semantic drift.
- Shell background, bottom navigation, fixed overlays, and safe-area behavior remain shell-owned. They are high-risk because small changes affect route geometry, mobile hit targets, and persistent UI placement.
- Overlay chrome is already shared. Treat remaining local overlay call sites as migration callers, not new design owners.
- Patient health and concierge local shells remain local until their visual structures repeat outside their route family.
- Dashboard, delivery, and messaging extractions remain local or feature composites unless repeated mechanics are proven across unrelated routes. Messaging avatar extraction is feature-local by design.

## Route-Family Priority

- P0: provider stat and glass cards. Provider dashboard and schedule stats are implemented through `MetricCard`; horizontal stats remain deferred.
- P0: services laboratory and radiology provider cards. Laboratory and radiology listing coverage is implemented; extension beyond those routes remains deferred.
- P0: booking local flow chrome. Booking panels, selectable cards, selected/inactive option constants, and Fast Refresh cleanup are implemented inside booking ownership.
- P1: wizard step progress. Marketing new campaign and insurance file claim coverage is implemented through `StepProgress`.
- P1: marketing and insurance. Use these routes to validate glass surfaces, gradient CTAs, badges, and icon tiles against non-dashboard content.
- P1: provider route headers. Provider wallet, transactions, dashboard, schedule, provider services, analytics, marketing, and insurance headers are implemented through `ProviderRouteHeader`.
- P1: patient health and concierge local shells. Preserve their route identity while removing only repeated neutral mechanics; work remains deferred.
- P2: dashboard, delivery, and messaging local extractions. Prefer feature-level composites for dense mobile layouts, cards, filters, status blocks, and loading states. Delivery map chrome remains local; messaging avatar extraction is implemented feature-locally.

## Migration Rules

- Extract the smallest stable layer first: token, then primitive variant, then composite.
- Preserve the current rendered design, including light and dark themes, responsive behavior, RTL-sensitive layout, hover, active, focus, loading, disabled, and error states.
- Keep pages as route composition. Do not move reusable design-system rules into page files.
- Do not promote a feature-local visual unless an unrelated route can use it unchanged.
- Ask for user approval before any intentional visual difference from current `HEAD`.

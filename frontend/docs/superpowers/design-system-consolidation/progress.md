# Design System Consolidation Progress

## Status Model

- The current `HEAD` design remains the visual source of truth.
- Implemented means the slice has been consolidated without approving a rendered change.
- Known exceptions are preservation exceptions. They do not authorize visual differences.

## Implemented Slices

| Slice | Current scope |
| --- | --- |
| Documentation inventory and exceptions | Inventory and exception boundaries are established and updated for current execution status. |
| `MetricCard` | Provider dashboard and provider schedule stats. |
| `AnimatedBorderSurface` | All listed service headers. |
| Booking local flow chrome | Booking panels, selectable cards, selected/inactive option constants, and Fast Refresh cleanup. |
| `MessagingAvatar` | Feature-local messaging avatar extraction. |
| `ServiceProviderListing` | Laboratory and radiology listing routes. |
| `StepProgress` | Marketing new campaign and insurance file claim flows. |
| `ProviderRouteHeader` | Provider wallet, transactions, dashboard, schedule, provider services, analytics, marketing, and insurance headers. |

## Remaining Or Deferred Work

| Area | Current direction |
| --- | --- |
| Horizontal stats | Deferred for a separate route-family pass. |
| Service provider listing beyond lab and radiology | Deferred until additional service routes can reuse the same services feature UI without semantic drift. |
| Search and filter input chrome | Deferred until shared input chrome is stable enough for route-family search/filter bars. |
| Patient health and concierge local shells | Preserve route identity; extract only repeated neutral mechanics later. |
| Delivery map chrome | Keep local because it represents live-operation and data-visualization state. |
| Shell safe-area work | Keep shell-owned and defer until route geometry and fixed mobile UI can be verified together. |
| Overlay caller migrations | Continue migrating callers to shared overlay primitives only when size, scroll, padding, radius, background, close placement, and focus behavior remain equivalent. |

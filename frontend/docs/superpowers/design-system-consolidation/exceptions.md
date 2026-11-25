# Design System Consolidation Exceptions

## Purpose

This log records known preservation exceptions for the inventory-led migration. These entries are not user-approved visual differences. They document visuals that should remain local unless a future spec explicitly approves a rendered change. The current `HEAD` design remains the visual source of truth.

## Known Preservation Exceptions

| Area | Preservation decision | Reason | Future change rule |
| --- | --- | --- | --- |
| Service accents | Keep backend and service accent mechanics feature-local under `src/features/services/service-colors.ts` and `src/features/services/useServiceAccent.ts`. | Colors and accent behavior carry service data meaning. | User approval is required before changing service accent semantics or rendered colors. |
| Service provider list cards | Keep the provider list card layout under services feature UI. | The layout depends on service/provider data shape and service accent behavior. | Promote only if another route family can reuse the layout without service-specific data or accent assumptions. |
| Booking neutral flow chrome | Keep booking flow panels, option cards, and flow action chrome booking-local first. | The visual rhythm supports a booking-specific progression and selection model. | Promote only after booking-local consolidation proves the component is domain-neutral. |
| Booking selectable options | Keep booking-specific selectable cards/options in booking first. | Current selection states are tied to booking choices and flow semantics. | User approval is required for any intentional visual difference; shared promotion requires unchanged reuse outside booking. |
| Shell background and bottom navigation | Keep app background layers, bottom navigation, route offsets, and safe-area behavior shell-owned. | These affect global geometry, fixed UI placement, mobile hit targets, and route-level spacing. | Any intentional geometry or visual difference requires user approval. |
| Fixed overlays and safe-area overlays | Keep fixed overlay placement and safe-area behavior under shell or approved shared overlay ownership. | Small changes can alter persistent UI placement and mobile usability. | Migrate callers only after confirming equivalent size, scroll, padding, and placement behavior. |
| Overlay chrome | Keep dialog, sheet, and alert-dialog chrome in shared overlay primitives. | Overlay ownership is already defined; route code should not recreate chrome. | Caller migrations must preserve current dimensions, scroll behavior, focus behavior, background, radius, and close placement. |
| Patient health shell | Keep patient health route shell visuals local. | Current structure appears route-specific and carries local product hierarchy. | Promote only repeated neutral mechanics; user approval is required for visible route identity changes. |
| Concierge shell | Keep concierge route shell visuals local. | Current structure appears route-specific and carries local product hierarchy. | Promote only repeated neutral mechanics; user approval is required for visible route identity changes. |
| Dashboard dense layouts | Keep dashboard-specific dense mobile layouts and panels local unless repetition is proven. | Dashboard density and hierarchy are route-family-specific. | Extract as feature composites before considering shared composites. |
| Active delivery visuals | Keep delivery-specific map, route, status, and live-operation visuals local. | These visuals represent operational state and data visualization. | User approval is required before changing data-visualization color or geometry. |
| Messaging dense layouts | Keep messaging-specific thread, status, and dense mobile layouts local unless repetition is proven. | Messaging hierarchy and interaction density are feature-specific. | Extract locally first; promote only neutral mechanics that remain visually unchanged. |
| Provider avatars | Keep provider avatar visuals feature-owned when they represent provider identity. | Avatar treatment can encode provider-specific identity and context. | Shared `GradientIcon` extensions may cover neutral icon tiles, not identity-bearing avatars. |
| Marketing and insurance route identity | Preserve current marketing and insurance route-specific hero and content identity. | These pages may reuse glass, badge, button, and icon mechanics without losing route-specific composition. | Promote repeated mechanics only; user approval is required for intentional route identity changes. |

## Current Exception Status

- Service provider list cards remain a preservation exception for service-owned data and accent behavior. Laboratory and radiology listing consolidation is implemented; extension beyond those routes remains deferred.
- Booking neutral flow chrome and selectable options remain booking-local preservation exceptions. Booking panels, selectable cards, selected/inactive option constants, and Fast Refresh cleanup are implemented inside that boundary.
- Shell background, bottom navigation, fixed overlays, and safe-area behavior remain shell-owned. Shell safe-area work is deferred until global geometry and fixed mobile UI can be verified together.
- Overlay chrome remains owned by shared primitives. Caller migrations remain deferred unless equivalent dimensions, scroll behavior, focus behavior, background, radius, padding, and close placement can be preserved.
- Patient health and concierge local shells remain preservation exceptions; only repeated neutral mechanics should be extracted later.
- Delivery map chrome remains local because it carries live-operation and data-visualization meaning.
- Messaging avatar consolidation is implemented as a feature-local extraction and does not change the messaging dense-layout preservation boundary.
- Marketing and insurance route identity remains preserved while `StepProgress` coverage is implemented for marketing new campaign and insurance file claim flows.
- Provider route headers and provider metric cards are implemented consolidation slices, not approvals for visible route changes.

## Approval Boundary

- Known preservation exceptions are decisions to keep visuals local during consolidation.
- They do not authorize rendered changes.
- Any intentional visual difference from current `HEAD` requires user approval before implementation.

# Booking Summary Across Booking Flows Design

Date: 2026-05-04
Status: Approved design

## Context

Care@Home has several booking flows under `src/features/bookings/flow/`. Recent work standardized booking action rows and top booking chrome through shared booking-owned components. Some flows already show a lightweight booking summary sidebar, while others keep the user in a single-column flow or show a payment-only summary inside `PaymentStep`.

This creates an inconsistent review experience. Users should be able to see lightweight booking context and the current selection subtotal while editing, then review the complete booking and total-to-pay on payment.

## Problem

Booking summary behavior differs by service type.

- Some flows show a right-side summary card.
- Some flows show no persistent summary until payment or confirmation.
- `PaymentStep` renders its own summary, which can duplicate flow-level summary content.
- Summary details use different structures, placeholders, and visual weights across flows.
- Single-column flows do not have the same desktop review affordance as existing two-column flows.

The result is a booking experience that changes between care, pharmacy, equipment, ambulance, funeral, veterinary, nutrition, laboratory, radiology, and gym bookings.

## Goal

Add one consistent lightweight side summary pattern to all booking flows, plus one complete payment review summary.

The side summary should appear on editable non-payment booking steps. It shows sections progressively as the user reaches each step, keeps a dynamic bottom subtotal visible from the start, and hides on payment, confirmation, and success screens. Payment keeps its own complete booking summary, including pricing and total-to-pay.

On desktop, the lightweight summary appears as a right sidebar. On mobile, it appears inline after the active step content.

## Non-Goals

- Do not change booking APIs, query keys, quote payloads, payment payloads, or submission payloads.
- Do not add edit links or step-jump behavior from the summary.
- Do not change step counts, step labels, validation rules, or transition behavior.
- Do not redesign success or confirmation panels.
- Do not create a centralized business-logic engine for all booking summaries.
- Do not standardize unrelated non-booking flows.

## Chosen Approach

Use a shared lightweight booking summary component plus a shared responsive body layout.

Each booking flow builds a small normalized summary model from its own state. The shared summary component renders booking context without total or total-to-pay rows. It also renders one bottom subtotal line from the summary total slot, computed from current selections. The shared layout places the active step content and summary consistently on non-payment steps.

This keeps booking-specific business rules inside each flow while standardizing the side summary UI, placeholders, flat section hierarchy, payment hiding behavior, and responsive placement.

## Alternatives Considered

### Shared UI, Flow-Owned Layout

Create one lightweight summary card component, but let each flow place it manually.

This is smaller initially, but layout decisions would remain duplicated. The booking flows could drift again.

### Fully Centralized Summary Builder

Create a helper that infers every side and payment summary from shared flow state.

This reduces mapping code, but it is too rigid for the current flows. Ambulance trips, equipment rentals, pharmacy prescriptions, funeral contacts, animal details, and care-style services have different concepts.

### Shared Component And Normalized Flow Data

Each flow maps its own state into lightweight side summary sections, then renders through one shared component and layout contract. Payment summaries remain complete and payment-owned.

This is the selected approach. It preserves local flow logic and gives users one lightweight side summary pattern across all booking flows.

## Layout Contract

Booking body layout uses this structure:

```text
[BookingFlowChrome]
  [Provider Header]
  [Progress Steps]
  [Responsive Booking Body]
    Desktop non-payment: [Active Step Content] [Lightweight Booking Summary Sidebar]
    Desktop payment:     [Payment Step With Complete Booking Summary]
    Mobile:  [Active Step Content]
             [Lightweight Booking Summary Card on non-payment only]
```

Rules:

- Show the lightweight side summary on editable non-payment steps.
- Hide the lightweight side summary on payment steps.
- Hide the lightweight side summary on confirmation and success screens.
- Keep the summary read-only.
- Do not add summary edit links.
- Reveal side summary sections progressively by step instead of showing every section from the start.
- On desktop non-payment steps, place the summary in the right column and allow sticky sidebar behavior where it does not obscure content.
- On mobile non-payment steps, place the summary after the active step content.
- On payment, render the complete booking summary inside the payment step content.
- Keep existing provider header and progress placement from `BookingFlowChrome`.

## Summary Content Rules

Each flow builds lightweight side summary sections and rows.

Example model:

```text
Section: Service
  Service: Consultation
  Duration: 30 min
  Location type: À domicile

Section: Schedule
  Date: _
  Time: _

Section: Details
  Address: _
  Notes: Patient has mobility issues and needs access instructions kept visible.

Summary total slot:
  Subtotal: 0
```

Rules:

- Render the summary as one card. Do not render each section as a separate card.
- The side summary title includes a shopping cart icon with a transparent background; do not place the icon in a filled chip.
- Render section rows as flat content visually indented under each section title, without vertical borders or guide lines.
- In selected-service sections, place a horizontal separator between the selected service lines and duration or service-location metadata.
- Selected-service rows show the service name on the left and the price only on the right.
- Quantity selected-service rows show `1× Service name` on the left and the line price only on the right.
- Selected-service row values must not include duration or time. Use price-only values such as `70.00 TND`.
- Selected-service price values use a nowrap right column so the amount and currency do not break across lines.
- Reveal each section when its step is active or has been reached.
- Core required rows in revealed sections stay visible and use `_` until completed.
- Optional or irrelevant rows are omitted.
- Date ranges use one `Date` row when both dates exist, for example `2026-05-13 → 2026-05-13`; do not split them into separate appointment and end date rows. Keep the date range on one line when space allows.
- Duration multiplication uses `×`, for example `60 min/day × 5 days`.
- The side summary must not include fee, deposit, delivery pricing, discount, total, or total-to-pay rows.
- The side summary shows one bottom emphasized `Subtotal` line through the summary total slot.
- The side subtotal is not a separate or nested card. It is separated from summary sections by a horizontal separator and finishes with a bottom line.
- The side subtotal label is uppercase, larger than normal row labels, and visually stronger than the price value. Keep the subtotal label and value aligned on the same row.
- The side `Subtotal` value is present from the start as `0` and updates dynamically from selected services or items. It must not wait for quote data.
- Duration or `Durée` metadata for selected services belongs in a separate normal-weight metadata row after the selected-service list separator.
- Duration or `Durée` rows use normal row weight and must not be bold or emphasized.
- Quote-backed fee, deposit, delivery pricing, discount, total, and total-to-pay rows belong only in the payment summary.
- Missing or loading payment price data uses `À confirmer` instead of invented prices.
- Summary values must not be truncated in side or payment summaries.
- Sensitive or verbose fields can wrap; the main form remains the place to edit full detail.
- The payment step shows a complete booking summary inside `PaymentStep`, including pricing and total-to-pay.

## Flow-Specific Content

Each flow owns the mapping from its local state to summary sections.

Care-style side summaries can include selected services, service location, schedule, address, patient details, and notes.

Selected-service summaries include the selected services list in the section. Service lines show the service name on the left and the line price only on the right. Quantity service lines use `1× Service name` on the left and the line price only on the right. Values use prices such as `70.00 TND`; do not use `Quantity:` prefixes or include duration/time in selected-service row values. Selected-service price values use a nowrap right column. Combined selected-service price belongs in the bottom `Subtotal` slot, and duration or `Durée` stays a separate normal-weight metadata row after the selected-service list separator.

Pharmacy side summaries can include selected pharmacy service, service location, prescription status or file name, schedule, and patient notes.

Equipment side summaries can include equipment name, rental period, duration, and delivery address.

Ambulance side summaries can include transport type, urgency, pickup address, destination address, schedule, patient details, and oxygen or accompaniment options.

Funeral side summaries can include deceased details, ceremony or repatriation details, contact details, schedule if applicable, and special requests.

Veterinary side summaries can include selected services, animal details, service address when relevant, schedule, and notes.

Laboratory, radiology, nutrition, and gym side summaries can include selected services, duration, service location, schedule, address when relevant, and notes.

Payment summaries can include all final review rows required for the booking type, including quote subtotal, platform fee, deposit, delivery cost, discounts when applicable, and total-to-pay. Payment summary values must not be truncated.

## Component Boundaries

Add one booking-owned summary component under `src/features/bookings/flow/`:

```text
BookingFlowSummary
```

`BookingFlowSummary` owns:

- Side summary card title.
- Shopping cart icon rendering with transparent icon background.
- Section heading rendering.
- One-card section layout with indented section content and no vertical guide lines.
- Selected-services separator placement before duration or service-location metadata.
- Label and value row rendering.
- Required-placeholder rendering.
- Bottom summary total slot rendering for the emphasized uppercase `Subtotal` line, horizontal separator, and bottom line.
- Lightweight visual hierarchy.
- Empty section omission.

Add one booking-owned body layout under `src/features/bookings/flow/`:

```text
BookingFlowBodyLayout
```

`BookingFlowBodyLayout` owns:

- Desktop two-column placement.
- Mobile stacked placement.
- Side summary visibility.
- Sidebar width and sticky positioning.
- Main content width and spacing.
- Payment-step summary hiding.

Booking flow files own:

- Current step and success or confirmation detection.
- Summary section mapping from local state.
- Required versus optional row decisions.
- Quote, payment, upload, availability, and submission behavior.
- Existing step validation and transitions.

The shared summary and layout must not know how to submit bookings, fetch quotes, validate payment, upload files, or resolve slot conflicts.

## Data Flow

Data remains one-way and local to each booking flow.

```text
Flow state, selected services/items, query data, quote data, and submission data
  -> flow-specific lightweight side summary section mapping
  -> flow-specific current selection subtotal
  -> BookingFlowSummary
  -> BookingFlowBodyLayout
```

The side summary receives display-ready context data and a current selection subtotal. It does not derive API payloads, wait for quotes, or mutate booking state.

## Payment Step Rules

Payment is the final review surface and does not show the lightweight side summary.

- Hide the shared lightweight side summary on payment.
- Show one complete booking summary inside the payment step.
- Include booking context, pricing, fees, deposits, delivery costs, discounts when applicable, and total-to-pay.
- Use quote values when available.
- Use `À confirmer` for missing, loading, or unavailable price data.
- Keep payment method selection, payment validation, security notices, and payment submit behavior inside `PaymentStep` or the existing payment section.
- Keep price mismatch and quote retry behavior inside the owning flow.

This gives users one complete final review surface before confirming payment without a competing side summary.

## Error Handling

Existing error behavior remains flow-owned.

- Provider loading keeps using existing booking skeletons.
- Provider load failure keeps using `BookingPageErrorState`.
- Service, availability, upload, quote, and payment errors stay in their current flow surfaces.
- Side summary rows do not trigger validation or recovery behavior.
- Missing required data appears as `_`.
- The side subtotal defaults to `0` until selections add priced services or items.
- Missing or pending payment price data appears as `À confirmer`.
- Existing step validation continues to block progress where required data is missing.

## Accessibility

The lightweight side summary is a complementary read-only region.

- The side summary card title should be a heading.
- Section headings should preserve a readable hierarchy.
- Placeholder values should be real text.
- Summary values should remain readable and must not be truncated.
- Desktop sticky behavior must not cover focused controls.
- Mobile DOM order should remain active step content first, summary second.
- The side summary must not become the only place where required information is shown.
- Payment summary totals must remain text-readable and not rely on visual emphasis alone.

## Testing And Verification

Default verification for implementation:

- `npm run lint`
- `npm run type-check`

Manual checks:

- Lightweight side summary appears on editable non-payment steps in care, laboratory, radiology, pharmacy, funeral, veterinary, nutrition, ambulance, equipment, and gym booking flows.
- Lightweight side summary hides on payment steps.
- Payment steps show one complete booking summary with pricing and total-to-pay.
- Lightweight side summary hides on confirmation and success screens.
- Desktop non-payment layout shows active step content and right summary sidebar.
- Mobile non-payment layout shows active step content before the summary card.
- Required incomplete rows show `_`.
- Optional irrelevant rows are omitted.
- Side summaries do not show fee, deposit, delivery pricing, discount, total, or total-to-pay rows.
- Side summaries show a bottom emphasized `Subtotal` line that starts at `0` and updates from current selected services or items.
- Side subtotal is separated by a horizontal rule, is not rendered as its own card, and ends with a bottom line.
- Side subtotal label is uppercase, larger than normal rows, visually stronger than the price value, and aligned with the value.
- Selected-service sections show a horizontal separator before duration or service-location metadata.
- Selected-service rows show the service name on the left and price only on the right.
- Selected-service quantity rows use `1× Service name` with line price only, such as `70.00 TND`.
- Selected-service row values do not include duration or time, and selected-service price values do not break across lines.
- Duration or `Durée` appears as a separate metadata row after the selected-service list separator.
- Duration multiplication uses `×`, for example `60 min/day × 5 days`.
- Side summary title uses a shopping cart icon with transparent background.
- Duration or `Durée` rows are not bold or emphasized.
- Date ranges appear as one `Date` row when start and end dates both exist, staying on one line when space allows.
- Summary sections appear progressively as the user reaches each step.
- Pending or unavailable payment price rows show `À confirmer`.
- Long notes or details wrap instead of being truncated in side and payment summaries.
- Payment screens do not show duplicate booking summary cards.
- Existing booking submission, quote, payment, and slot conflict behavior remains unchanged.

## Acceptance Criteria

- All booking flows use one shared lightweight side summary rendering pattern.
- All booking flows place the side summary through one shared responsive layout pattern.
- The lightweight side summary is visible on every editable non-payment step.
- The lightweight side summary is hidden on payment, confirmation, and success screens.
- Side summaries do not include fee, deposit, delivery pricing, discount, total, or total-to-pay rows.
- Payment steps show a complete booking summary with booking context, pricing, and total-to-pay.
- Core required rows show `_` until completed.
- Optional or irrelevant rows are omitted.
- Quote-backed payment price rows use real quote data or show `À confirmer`.
- Side and payment summary values are readable without truncation.
- Summary sections render inside one card, with rows visually indented under section titles and no vertical borders or guide lines.
- Selected-service sections render a horizontal separator before duration or service-location metadata.
- Selected-service rows render the service name or `1× Service name` on the left and the line price only on the right.
- Selected-service price values use a nowrap right column and do not include duration or time.
- Duration or `Durée` appears as a separate normal-weight metadata row after the selected-service list separator.
- Summary sections appear progressively by step instead of all from the start.
- Date ranges render as one `Date` row when both dates exist and stay on one line when space allows.
- Quantity service lines render as `1× Service name` with line price only, such as `70.00 TND`; do not use `Quantity:` prefixes or duration/time in selected-service row values.
- Duration multiplication uses `×`, for example `60 min/day × 5 days`.
- The side summary includes a bottom emphasized `Subtotal` line, present from the start as `0`, computed from current selected services or items.
- The side subtotal is not a card; it uses a horizontal separator, an aligned uppercase label/value row, and a bottom line.
- The side subtotal label is larger than normal rows and visually stronger than the price value.
- The side summary never labels this line as `Total` or `Total to pay`.
- The side summary title includes a shopping cart icon with transparent background.
- Duration or `Durée` rows use normal row weight.
- The side summary is read-only and does not add edit links.
- `PaymentStep` renders the only summary shown on payment.
- Existing API contracts, route behavior, quote behavior, payment behavior, and submission behavior remain unchanged.

## Risks

- Flow-specific summary mappings can drift if future flows bypass the shared component.
- Sticky sidebars can conflict with long content if spacing is too tight.
- Untruncated values can make side summaries taller if long notes are included.
- Payment summaries can drift from side summaries if final review mapping is not kept flow-owned and explicit.

## Open Decisions

No open product decisions remain. The approved direction is a read-only lightweight side summary shown on editable non-payment steps, hidden on payment, confirmation, and success screens. Payment shows the complete booking summary with pricing and total-to-pay.

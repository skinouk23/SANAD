# Dialog Consistency Design

## Status

Ready for user review. This document records the approved design direction. It does not authorize implementation until the written spec is reviewed and approved.

## Goal

Make dialogs, alert dialogs, and sheets visually and structurally consistent across the app. Existing overlays should use shared Radix/shadcn primitives and approved variants instead of feature-local dialog chrome.

## Current Context

The frontend uses React 18, Vite, Tailwind CSS v4, Radix primitives, and shadcn-style source components under `src/shared/ui`.

Current overlay primitives already exist:

- `src/shared/ui/primitives/dialog.tsx`
- `src/shared/ui/primitives/alert-dialog.tsx`
- `src/shared/ui/primitives/sheet.tsx`
- `src/shared/ui/primitives/scroll-area.tsx`

Project rules already require new shared UI under `src/shared/ui`, semantic theme tokens, and Radix/shadcn-aligned primitives. The current issue is not that dialogs lack Radix behavior. The issue is that consumers still shape dialog appearance locally with custom `max-h`, `overflow-y-auto`, `p-0`, background, radius, and close-button choices. Those local choices make scrollable dialogs look different from each other and different from the shadcn reference.

Observed hotspots include:

- `src/features/providers/schedule-planning/ui/ProviderPlanningDialogs.tsx`
- `src/features/patient/concierge/CarePlanModals.tsx`
- `src/pages/services/CareServicePage.tsx`
- `src/features/patient/dashboard/components/PatientDashboardDialogs.tsx`
- `src/features/patient/concierge/ManageDocumentsSections.tsx`
- `src/shared/ui/composites/profile-account.tsx`

## Approved Direction

Use a full existing-dialog migration.

The work has three parts:

1. Document a dialog consistency rule.
2. Strengthen the shared primitive contract.
3. Migrate existing dialog consumers to that contract.

## Non-Goals

- Do not replace `Dialog` with `Drawer`.
- Do not redesign dialog content, forms, or domain workflows.
- Do not change mutations, routing, query behavior, form schemas, validation logic, auth, theme, or i18n ownership.
- Do not add a new overlay library.
- Do not add Base UI.
- Do not create page-local fixed overlays.
- Do not add visual animation beyond the existing supported transition model.

## Architecture

The dialog system should be a shared contract.

`src/shared/ui/primitives/dialog.tsx` owns centered modal chrome: overlay, content frame, sizes, scroll behavior, header/footer/body structure, close-button placement, title and description conventions, focus trap, escape behavior, and transition behavior.

`src/shared/ui/primitives/alert-dialog.tsx` owns blocking confirmation chrome. It should visually align with `Dialog` while keeping AlertDialog semantics, cancel/action behavior, and destructive decision handling.

`src/shared/ui/primitives/sheet.tsx` owns edge-panel chrome. It should share overlay, title/description, close-button, footer, and semantic-token rules with dialogs while keeping side/top/bottom positioning.

`src/shared/ui/composites` may contain domain-neutral wrappers only when they encode repeated behavior, such as `ConfirmDialog`. Composites must not become a second visual dialog system.

Feature and page code should pass content, titles, descriptions, actions, and approved primitive props. Feature and page code should not define dialog chrome.

## Shared Dialog Contract

`DialogContent` should expose a small variant surface:

```tsx
<DialogContent size="md" scroll="none">
```

Approved sizes:

- `sm`: compact forms and simple messages.
- `md`: default dialogs.
- `lg`: multi-field forms and profile detail dialogs.
- `xl`: dense workflows such as scheduling or document flows.
- `full`: rare immersive workflows that still need modal semantics.

Approved scroll modes:

- `none`: default. Content should fit without internal scrolling.
- `content`: only the main content region scrolls. Header and footer stay visible.
- `body`: the entire dialog content scrolls as one panel. Use this only when sticky header and footer are not needed.

Shared layout rules:

- `DialogContent` owns width, max-width, max-height, radius, border, background, text color, shadow, close-button placement, and base padding.
- `DialogHeader`, `DialogFooter`, and a new `DialogBody` own internal rhythm.
- Scrollable dialogs use `DialogBody` or an approved `scroll` prop.
- Feature code may pass `size`, `scroll`, `showCloseButton`, and domain content.
- Feature code should not override dialog background, radius, base padding, or overflow.

`AlertDialogContent` should use the same size naming where practical:

```tsx
<AlertDialogContent size="sm">
```

`SheetContent` should use size naming while preserving side placement:

```tsx
<SheetContent side="right" size="md">
```

## Migration Scope

### Priority 1: Shared Primitives And Composites

- Update `DialogContent`, `AlertDialogContent`, and `SheetContent` with approved `size` and `scroll` props.
- Add `DialogBody` for scrollable content regions.
- Update `ConfirmDialog` to use the shared alert-dialog contract.
- Update docs and project instructions so future dialogs cannot invent local chrome.

### Priority 2: Inconsistent Scrollable Dialogs

Migrate current scrollable dialogs away from local combinations such as:

```tsx
max-h-[80vh] overflow-y-auto bg-background p-0 rounded-2xl
```

Preferred shape:

```tsx
<DialogContent size="lg" scroll="content">
  <DialogHeader>...</DialogHeader>
  <DialogBody>...</DialogBody>
  <DialogFooter>...</DialogFooter>
</DialogContent>
```

Primary files:

- `src/features/providers/schedule-planning/ui/ProviderPlanningDialogs.tsx`
- `src/features/patient/concierge/CarePlanModals.tsx`
- `src/pages/services/CareServicePage.tsx`
- `src/features/patient/dashboard/components/PatientDashboardDialogs.tsx`
- `src/features/patient/concierge/ManageDocumentsSections.tsx`
- `src/shared/ui/composites/profile-account.tsx`

### Priority 3: Normal Dialogs

Migrate remaining `DialogContent` users to approved `size` props. Remove local chrome classes when they duplicate primitive-owned structure.

### Priority 4: Edge Panels

Review `SheetContent` users, especially notification panels, so they follow sheet chrome rather than custom dialog or panel styling.

## Dialog Usage Rules

- Use `Dialog` for normal modal workflows.
- Use `AlertDialog` for destructive, blocking, or explicit confirmation workflows.
- Use `Sheet` for side, top, or bottom panels.
- Every overlay must include the matching title component: `DialogTitle`, `AlertDialogTitle`, or `SheetTitle`.
- Use visually hidden titles only when visible content already gives equivalent context.
- Do not create page-local fixed overlays when shared primitives fit.
- Do not set local dialog chrome with feature-level `bg-*`, `rounded-*`, `max-h-*`, `overflow-*`, `p-0`, or custom close-button placement.
- If a dialog needs new structural behavior, add a named primitive prop or shared composite first.

## Error And Edge Behavior

- Forms inside dialogs keep current validation and submit behavior.
- Destructive confirmations use `AlertDialog` and preserve cancel/action semantics.
- Long forms use `scroll="content"` so header and footer remain stable.
- Dialogs that close only after async work keep controlled `open` state and existing callbacks.
- Focus trap, escape key, outside click, and focus return stay owned by Radix primitives.

## Verification Strategy

Search gates after migration:

- `DialogContent` with local `overflow-y-auto`, `max-h-*`, `p-0`, `bg-background`, or `rounded-*`.
- custom `fixed inset-0` modal overlays outside primitives.
- missing `DialogTitle`, `SheetTitle`, or `AlertDialogTitle` in migrated overlays.

Command verification:

- `npm run type-check`
- `npm run lint`
- `npm run build`

Manual verification:

- one normal dialog
- one scrollable dialog
- one alert dialog
- one sheet
- keyboard focus, escape key, outside click, focus return, close button placement, and mobile scroll behavior

## Success Criteria

- Dialogs, sheets, and alert dialogs share one visual and interaction contract.
- Scrollable dialogs use an approved shared scroll mode instead of local overflow styling.
- Existing inconsistent dialog consumers are migrated to the shared contract.
- Documentation makes dialog consistency a project rule.
- No new page-local fixed modal overlays are introduced.
- Verification commands pass after implementation.

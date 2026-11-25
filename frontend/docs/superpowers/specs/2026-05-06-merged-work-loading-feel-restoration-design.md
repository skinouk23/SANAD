# Merged Work Loading Feel Restoration Design

## Status

Approved for specification. This document records the approved design for restoring the `Merged_Work` loading and navigation feel in the current frontend. It does not authorize implementation until the written spec is reviewed and approved.

## Goal

Restore the `Merged_Work` feel for route loading, skeletons, and navigation accents across all current app routes.

The target is not a full branch rollback. The current router and route access model stay in place. The visual and interaction behavior should match `Merged_Work` where it covered these areas:

- Branded shimmer bar under the fixed top navigation during route loading.
- Simpler pulse/glass skeleton styling.
- Bottom navigation cyber accents, including the branded divider, active underline, glow, and existing pulse details.

True page enter and exit animations are out of scope because `Merged_Work` did not use a route-level `AnimatePresence` or `motion` transition wrapper for pages. The perceived transition should come from the restored route loading bar and visual rhythm.

## Context

The current branch is `frontend-distill`. The comparison branch is `Merged_Work`.

Current branch findings:

- `src/app/layouts/AppLayout.tsx` owns the active shell.
- `AppLayout` uses React Router `useNavigation()`, `matchRoutes()`, route handles, `useDelayedPending()`, and `PageSkeletonRenderer` to show route-level skeletons.
- `src/shared/ui/composites/page-skeletons.tsx` defines route skeleton variants such as `dashboard`, `listing`, `catalog`, `detail`, `booking`, `profile`, `table`, `chat`, `form`, `calendar`, and `content`.
- `src/shared/ui/primitives/skeleton.tsx` supports shape, tone, and animation variants.
- `src/styles/theme-base.css` defines `loading-progress-indeterminate`, skeleton shimmer utilities, and reduced-motion fallbacks.
- `src/app/shell/BottomNav.tsx` is the active bottom navigation.

`Merged_Work` findings:

- `src/app/layouts/CyberLayout.tsx` owned the shell and showed a route loading indicator immediately when `navigation.state === 'loading'`.
- The old top loading bar used `app-shell-brand-progress` with `animate-[shimmer_1.5s_ease-in-out_infinite]`.
- `src/styles/theme-base.css` defined `@keyframes shimmer`, `app-shell-brand-progress`, and `app-shell-brand-divider`.
- `src/styles/theme-tokens.css` defined brand progress and divider gradients.
- `src/app/shell/CyberBottomNav.tsx` used the cyber divider, active gradients, icon glow, and pulse accents.
- Skeletons were simpler and mostly pulse-based, using `sk-base`, `sk-card`, `--skeleton-base`, `--skeleton-card-bg`, and `--skeleton-card-border`.

## Approved Direction

Use the current route wiring, but restore the `Merged_Work` visual behavior.

`AppLayout` remains the active layout because the current frontend already routes through it and it owns current back/profile behavior. Inside `AppLayout`, remove the current route-level skeleton orchestration. The shell should no longer inspect pending routes, read skeleton route handles, delay skeleton rendering, or replace `<Outlet />` with `PageSkeletonRenderer`.

The route loading signal stays simple:

1. `AppLayout` reads `navigation.state` from React Router.
2. When `navigation.state === 'loading'`, the fixed top header shows the old branded shimmer bar immediately.
3. The current page remains visible until the next route resolves.
4. The destination page then handles its own data loading after it mounts.

This matches the `Merged_Work` perceived page transition: the app communicates movement through the top shimmer and the shell accents, not by swapping the route area for a generic page skeleton.

## Architecture

### Shell

`src/app/layouts/AppLayout.tsx` should own only global route progress and shell controls:

- Fixed top navigation.
- Back button behavior.
- Theme and language controls.
- Profile action.
- Branded route loading shimmer.
- Main `<Outlet />`.
- Bottom navigation.

Remove or stop using these route-skeleton responsibilities from the shell:

- Pending route matching for skeleton selection.
- Skeleton route handle lookup.
- `DEFAULT_ROUTE_SKELETON_DELAY_MS`.
- Route-level `PageSkeletonRenderer` rendering.
- Delayed route skeleton state.

Keep non-loading route metadata, such as back/parent behavior, if still used by the current shell.

### Route Metadata

Skeleton-specific route metadata is no longer part of the desired loading design.

The implementation may remove `skeleton` and `skeletonDelayMs` from route handles if that change is clean. If removing them causes broad unrelated churn, they may remain temporarily unused, but no shell logic should depend on them.

### Shared Skeletons

The current route skeleton renderer can be discarded.

Preferred shared skeleton model:

- Keep a simple `Skeleton` primitive.
- Restore pulse-first behavior.
- Use `sk-base` for normal placeholder surfaces.
- Use `sk-card` for skeleton cards and glass panels.
- Keep skeleton styling tied to theme tokens.
- Avoid route-level skeleton variants in the shell.

Feature and page components may still render local skeletons when data is missing and the final layout is known. Those local skeletons should visually match the old pulse/glass style rather than the newer route-skeleton system.

### Top Navigation Loading Bar

The top route loading bar should match `Merged_Work`.

Expected behavior:

- Render directly under the fixed top header.
- Appear immediately when React Router reports route loading.
- Use the old branded gradient progress utility.
- Use the old shimmer timing, approximately `1.5s ease-in-out infinite`.
- Avoid full-page route skeleton replacement.

Expected ownership:

- Markup: `src/app/layouts/AppLayout.tsx`.
- Keyframes and utilities: `src/styles/theme-base.css`.
- Gradient tokens: `src/styles/theme-tokens.css` or the existing current token file that owns shell tokens.

### Bottom Navigation

`src/app/shell/BottomNav.tsx` should restore the `CyberBottomNav` accent language from `Merged_Work`.

Expected behavior:

- A branded gradient divider line sits along the top edge of the bottom nav.
- The active item uses the old gradient underline or active accent.
- The active icon/card area regains the old glow treatment.
- Existing pulse details from `Merged_Work` return where they already existed.
- No new bottom-nav animation concepts should be invented.

This restores the old bottom-nav feel without changing route destinations, role-aware visibility, or navigation semantics.

## Data Flow

Route loading and page data loading remain separate.

Route loading flow:

1. User clicks a link or triggers navigation.
2. React Router changes `navigation.state` to `loading`.
3. `AppLayout` shows the branded top shimmer bar.
4. The current route content remains visible.
5. React Router completes the navigation.
6. `navigation.state` returns to `idle`.
7. `AppLayout` hides the top shimmer bar.
8. The new route content renders through `<Outlet />`.

Data loading flow:

1. A page mounts.
2. The page or feature fetches data, usually through TanStack Query.
3. The page renders its own local loading state, skeleton, empty state, or error state.
4. The shell does not choose a generic skeleton for that page.

This keeps global navigation feedback predictable and leaves page-specific loading to the page that knows its layout.

## Error Handling

The restoration should not introduce new error handling paths.

- Route errors stay with the existing router error boundaries and page-level error handling.
- Data-fetching errors stay inside the owning page or feature.
- The top shimmer bar should disappear when React Router leaves the loading state, including after failed or redirected navigations.
- Skeleton changes must not swallow page errors or replace error states.

## Accessibility And Motion

The restored visuals must honor reduced motion preferences.

When `prefers-reduced-motion: reduce` is active:

- The top progress bar should become a static accent instead of an animated shimmer.
- Skeleton pulse, shimmer, and glow animation should stop.
- Bottom-nav pulse effects should stop.
- Active nav state must remain visible through color, shape, underline, or contrast.

The route loading indicator should remain decorative unless a route state label already exists. Do not add noisy live-region announcements for every navigation unless a future accessibility review requests them.

## Scope

In scope:

- All app routes that use the current app shell.
- Top-nav route loading shimmer restoration.
- Removal or deactivation of route-level skeleton rendering from `AppLayout`.
- Simplification of shared skeleton visuals toward `Merged_Work`.
- Bottom-nav cyber accent restoration.
- Relevant animation utilities and theme tokens.
- Light theme, dark theme, desktop, and mobile behavior.
- Reduced-motion behavior.

Out of scope:

- Backend changes.
- Admin route restoration.
- New Framer Motion page enter and exit transitions.
- New route transition concepts that did not exist in `Merged_Work`.
- Broad visual parity work outside loading, skeletons, and nav accents.
- Replacing the current router with the old `CyberLayout` route tree.

## Implementation Boundaries

Likely files to change:

- `src/app/layouts/AppLayout.tsx`
- `src/app/shell/BottomNav.tsx`
- `src/shared/ui/primitives/skeleton.tsx`
- `src/shared/ui/composites/loading.tsx`
- `src/shared/ui/composites/page-skeletons.tsx`, likely removal or deactivation
- `src/styles/theme-base.css`
- `src/styles/theme-tokens.css`
- `src/types/router.types.ts`, if skeleton handle fields are removed
- `src/app/router/helpers.ts` and route files, if skeleton metadata is removed cleanly

Implementation should avoid editing unrelated pages except where they directly depend on removed skeleton exports.

## Verification

Run these checks from `CareAtHomeFinal/`:

```bash
npm run lint
npm run type-check
```

Because the change touches routing shell, shared loading UI, CSS animation utilities, and bottom navigation, also run this when feasible:

```bash
npm run build
```

Manual acceptance checks:

- Trigger route navigation and confirm the shimmer appears immediately under the top header.
- Confirm the route area is not replaced by a generic route skeleton.
- Compare the shimmer style and timing against `Merged_Work`.
- Confirm local page loading states still render where pages fetch data.
- Compare shared skeletons against the old pulse/glass feel.
- Compare bottom-nav divider, active underline, glow, and pulse details against `Merged_Work`.
- Check dark theme and light theme.
- Check desktop and mobile layouts.
- Check `prefers-reduced-motion: reduce` behavior.

## Acceptance Criteria

The work is accepted when:

- All app routes use the restored top-nav route loading shimmer instead of the current route-level skeleton replacement.
- The shimmer, skeletons, and bottom-nav accents visually match the `Merged_Work` feel.
- Current route wiring, back navigation, profile action, theme switcher, language selector, and bottom-nav navigation still work.
- Page-local loading and error states still work.
- Reduced-motion users get static equivalents instead of continuous animation.
- `npm run lint` and `npm run type-check` pass.
- `npm run build` passes if run for final verification.

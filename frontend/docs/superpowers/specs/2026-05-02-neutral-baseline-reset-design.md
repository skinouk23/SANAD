# Neutral Baseline Reset Design

## Status

Approved for specification. This document describes a future implementation. It does not authorize implementation by itself.

## Goal

Reset the active frontend to a neutral functional baseline that is consistent, accessible, and ready for a future design built from scratch.

The reset removes the current cyber/luminous visual language, category-specific colors, decorative animation, and cyber naming from active UI. It preserves current routes, user flows, feature behavior, data ownership, and application architecture.

## Non-Goals

- Redesigning information architecture, navigation, booking flow logic, dashboards, messaging behavior, maps, or provider/patient route structure.
- Removing the `framer-motion` package during the baseline reset. Package removal is a later cleanup after all imports are gone.
- Removing functional visual dependencies such as `leaflet`.
- Replacing Tailwind, Radix, shadcn-style primitives, TanStack Query, React Router, or the current theme runtime.
- Adding a new brand identity.

## Success Criteria

- Active route, shell, page, and feature UI no longer use cyber naming, cyber shell variants, cyber effects, or `Cyber*` component/file names, except historical documentation or deliberately deferred inactive files.
- The UI uses one neutral visual system across all public, patient, provider, booking, messaging, assistant, and service surfaces.
- Services and provider types do not own unique colors. They may differ by copy, icon, metadata, pricing, availability, form fields, and workflow, but not by decorative color palette.
- Light, dark, and system theme preferences still work through the existing runtime.
- Current routes, guards, forms, bookings, dashboards, messaging, maps, and assistants remain functionally intact.
- Functional motion is limited to loading and progress indicators.
- Status color usage is semantic only: success, warning, destructive, selected, disabled, pending, and active.

## Current Context

The frontend is a React 18, TypeScript, Vite, and Tailwind CSS v4 SPA. Real backend mode is the default. MSW mock mode is development-only and opt-in.

Current architecture rules remain in force:

- `src/app/router/` owns route wiring and guards.
- `src/pages/` owns route entry composition.
- `src/features/` owns business-specific UI and data logic.
- `src/shared/ui/primitives/` owns low-level reusable UI.
- `src/shared/ui/composites/` owns reusable neutral page patterns.
- `src/styles/theme-tokens.css` and `src/styles/theme-base.css` own the global visual contract.

The current visual layer is spread across global CSS, shell components, shared UI, pages, features, maps, and assistants. The reset must therefore happen through a dependency-ordered migration, not through isolated page edits.

## Design Principles

1. Preserve behavior first. Styling changes must not change routes, guards, data loading, mutations, form behavior, or recovery actions.
2. Use one neutral system. Reusable UI and route surfaces must consume the same semantic tokens and primitive variants.
3. Reserve color for meaning. Color may communicate UI state, not business category or decorative personality.
4. Remove cyber concepts from active code. Cyber terminology should not remain in active component names, shell variants, CSS utilities, or route modules.
5. Keep motion functional. Loading and progress can move; decoration should not.
6. Keep the app accessible. The baseline must preserve readable contrast, visible focus, keyboard navigation, touch targets, reduced distraction, and responsive behavior.

## Architecture

The reset keeps the current SPA architecture and changes the visual contract around it.

The implementation should move from outer layers to inner layers:

1. Global tokens and base styles.
2. App shell and layout naming.
3. Shared primitives and composites.
4. Route pages and feature-owned UI.
5. Tests, docs, and dependency cleanup.

This order prevents new route-level neutral styles from fighting old shell or primitive styles. It also avoids a second design system.

## Neutral Token System

`src/styles/theme-tokens.css` becomes the source of truth for a small neutral token set. Tokens must be purpose-based, not hue-based.

Required token groups:

- Surfaces: `background`, `card`, `popover`, `muted`, `sidebar`.
- Text: `foreground`, `card-foreground`, `muted-foreground`, `subtle`, `faint`.
- Borders and inputs: `border`, `border-strong`, `input`, `ring`.
- Actions: `primary`, `primary-foreground`, `secondary`, `accent`.
- Feedback: `success`, `warning`, `destructive`.
- Shape: consistent radius tokens.

Light, dark, and system preferences stay in place. Light and dark modes should differ only to support readability and user preference. They must not become separate visual personalities.

The reset removes or neutralizes these token concepts:

- Cyber root gradients.
- Grid backdrop colors.
- Orb colors.
- Glow and brand-gradient tokens.
- Startup card glow tokens.
- Service or category color tokens.
- Any token named after a hue when the role is semantic.

## Base Styles

`src/styles/theme-base.css` should keep only baseline styles and utilities that support layout, accessibility, and neutral feedback.

Allowed:

- Base `html`, `body`, and global border behavior.
- Focus-visible and reduced-motion-safe accessibility helpers if needed.
- Static neutral skeleton and loading utilities.
- Layout-safe utilities that do not encode a visual theme.
- Minimal functional keyframes for loading or progress.

Removed:

- Decorative keyframes such as cyber fade, pulse, shimmer, glow, animated border, and orb effects.
- App-shell grid, orb, glow, cyber control, and cyber brand utilities.
- Decorative scrollbar styling unless it is required for usability.
- Glassmorphism helpers and backdrop effects that create visual personality.

## Shell And Cyber Removal

The active frontend should no longer describe itself as cyber.

Shell-level migration requirements:

- Rename `CyberLayout` to a neutral layout name such as `AppLayout`.
- Rename `CyberBottomNav` to `BottomNav`.
- Rename `CyberLayoutRoute` to a neutral route module name.
- Remove the `cyber` shell variant from `AppShellVariant`.
- Prefer one default app shell. Keep other shell variants only if they serve a functional layout need.
- Replace cyber-specific CSS utility usage with neutral layout and surface classes.
- Preserve public URLs and route behavior unless a URL itself contains `cyber`.
- Update tests, route imports, docs, and references with the rename. Do not leave a long-term alias layer.

The app shell should keep structural responsibilities only:

- Route outlet placement.
- Top and bottom navigation placement.
- Account, theme, and language controls.
- Consent banner placement.
- Assistant overlay placement.
- Route loading indication.
- Safe-area and mobile layout behavior.

The shell should not own a decorative visual identity.

## Shared UI

Shared primitives and composites become the enforcement layer for the neutral baseline.

Affected primitives include:

- `Button`
- `Card`
- `Badge`
- `Input`
- `Dialog`
- `Sheet`
- `Tabs`
- `Tooltip`
- `Skeleton`

Affected composites include:

- Loading states.
- Page headers.
- Section cards.
- Profile surfaces.
- Empty states.
- Form fields.

Rules:

- Shared UI must use semantic token classes.
- Shared UI must not expose raw color, gradient, glow, or category tone props.
- Variants must describe function, not style personality. Examples: `default`, `secondary`, `destructive`, `outline`, `ghost`, `selected`, `loading`.
- Focus rings, disabled states, validation states, selected states, and loading states must be visible without decorative motion.

## Pages And Features

Page and feature migration should preserve current content and behavior while removing local visual systems.

Active `Cyber*` route/page/component names should be renamed to neutral domain names. Examples:

- `CyberServiceSelection` -> `ServiceSelectionPage`.
- `CyberPatientDashboard` -> `PatientDashboardPage`.
- `CyberProviderDashboard` -> `ProviderDashboardPage`.
- `CyberCareBooking` -> `CareBookingPage`.
- `CyberMessages` -> `MessagesPage`.

The exact rename list should be produced during implementation by following active imports from the router and feature barrels.

Surface-specific rules:

- Public landing and auth pages keep content and flow, but lose gradients, orbs, animated borders, and glow effects.
- Service discovery and service detail pages converge on one neutral listing/detail pattern.
- Booking pages keep progress, forms, pricing, location, payment, and confirmation behavior, but use neutral progress and status components.
- Patient and provider dashboards keep their information hierarchy, but remove category-colored cards and decorative hover effects.
- Messaging keeps conversation layout and fixed input behavior, but removes glow, gradient, and animated presence effects unless replaced by static state labels.
- Assistant launchers and panels keep placement and behavior, but remove decorative ping, glow, and animated entrance effects.
- Map surfaces keep maps and tracking, but neutralize marker chrome and surrounding panels.

## Service And Category Identity

Services must not use unique colors as identity.

Allowed identity signals:

- Service name.
- Icon.
- Short description.
- Pricing metadata.
- Availability metadata.
- Provider type.
- Required documents or booking fields.

Disallowed identity signals:

- Per-service gradients.
- Per-service accent colors.
- Category-colored cards.
- Category-colored active states.
- Provider-type color palettes.
- Decorative emoji or color-coded urgency unless the state is semantic.

Emergency, warning, success, and destructive states may still use semantic color because they communicate state, not category.

## Motion Policy

Allowed motion:

- Loading spinners.
- Linear progress indicators.
- Minimal progress motion that communicates pending work.

Disallowed motion:

- Decorative pulse.
- Hover scale or translate.
- Animated glow.
- Animated borders.
- Decorative fade or slide entrance.
- Assistant ping effects.
- Service card hover motion.
- Map marker pulse unless it is reclassified as a functional tracking indicator and has a static fallback.

`framer-motion` should not be removed during this reset. Visible decorative use should be removed first. The package can be removed later after import cleanup proves it is unused.

## Data Flow

The reset does not change data flow.

- TanStack Query remains responsible for server state.
- Existing feature hooks and query options stay in their owning feature domains.
- Route guards stay in `src/app/router/guards/`.
- Auth stays in `src/contexts/AuthContext.tsx`.
- Theme and language state stay in `src/shared/lib/theme/` and `src/shared/lib/i18n/`.
- UI rename work must not move API calls into shared primitives or composites.

## Error, Empty, And Loading States

Error handling remains functionally unchanged and visually neutral.

- Boot and route errors still use runtime diagnostics and reference IDs.
- Form validation keeps clear inline messages and destructive semantic styling.
- Empty states use shared neutral composites.
- Loading states use shared neutral composites, spinners, or progress indicators.
- Payment, booking, map, tracking, and assistant errors keep recovery actions.
- Urgency should be communicated through text, placement, and semantic state before motion.

## Accessibility Requirements

The neutral baseline must preserve or improve accessibility.

- Maintain readable contrast in light and dark mode.
- Keep visible focus states for keyboard users.
- Preserve touch-friendly control sizes, especially on mobile and senior-facing flows.
- Keep labels and accessible names intact during component renames.
- Preserve RTL and multi-locale behavior.
- Respect reduced-motion preferences by default because decorative motion is removed.
- Avoid using color alone to communicate status.

## Testing And Verification

Implementation should update existing tests for renamed imports and accessible names where necessary.

Default verification:

- `npm run lint`
- `npm run type-check`

Release-sensitive verification because the reset touches shell, routes, and shared UI:

- `npm run build`

Budget verification if route chunking, heavy imports, assistant code, maps, or visual dependencies change:

- `npm run build:budget`
- Inspect `dist/reports/`

Functional checks should cover:

- Public route navigation.
- Patient and provider guards.
- Auth restore/loading states.
- Booking flow progression.
- Service discovery and service detail pages.
- Patient and provider dashboards.
- Messaging fixed input behavior.
- Map and tracking usability.
- Theme switching between light, dark, and system.
- Absence of active cyber naming and category color patterns.

## Migration Sequence

1. Inventory active cyber names and visual utilities from router imports, feature barrels, shared UI, and tests.
2. Replace global tokens with neutral light/dark tokens.
3. Reduce base styles to layout, accessibility, and functional loading utilities.
4. Rename shell components and remove cyber shell variants.
5. Neutralize shared primitives and composites.
6. Rename active `Cyber*` pages and feature components to neutral domain names.
7. Remove service/category color systems from service discovery, service detail, booking, dashboards, and provider pages.
8. Remove decorative motion from assistants, shell, cards, route transitions, maps, and page panels.
9. Update tests, docs, route imports, and performance budget paths.
10. Run verification and record any intentionally deferred inactive files.

## Open Decisions Closed By This Spec

- The target is a neutral token reset, not a new brand design.
- The scope is the entire SPA baseline system, not only the first implementation slice.
- Current routes, page structure, and user flows should be preserved.
- Light, dark, and system theme runtime should be preserved.
- Framer Motion package removal is a later cleanup.
- Minimal functional motion is allowed for loading and progress.
- Service categories must not own unique colors.

# Legacy Frontend Visual Parity Design

## Status

Approved for specification. This document records the design direction for restoring the legacy frontend look in `CareAtHomeFinal`. It does not authorize implementation until the written spec is reviewed and approved.

## Goal

Replicate the rendered design of `legacy-frontend` in `CareAtHomeFinal` page by page, component by component, and state by state.

The running legacy app at `http://localhost:5174/` is the visual source of truth. The current app at `http://localhost:5173/` is the migration target. The target is pixel-level parity across the approved route, state, theme, and viewport matrix while preserving the current app architecture.

Admin surfaces are explicitly out of scope because admin has been removed from the current frontend. No admin route, shell, sidebar, dashboard, chart, provider-lifecycle, approval, audit, support, subscription-management, settings, report, fraud, balance, or system-health parity work is included unless a future approved spec reintroduces admin.

## Context

`legacy-frontend` is a React, Vite, TypeScript, and Tailwind v3 app. Its active visual identity is the cyber design: slate backgrounds, cyan and blue accents, glass cards, gradient buttons, fixed header and bottom navigation, grid backgrounds, blurred glowing orbs, custom scrollbars, Framer Motion interactions, and role-aware patient/provider navigation. Many active routes use `Cyber*` page modules, `CyberLayout`, `CyberBottomNav`, and page-local Tailwind classes.

`CareAtHomeFinal` is a React, Vite, TypeScript, Tailwind v4 CSS-first app. It has a structured router under `src/app/router`, route modules under `src/pages`, business slices under `src/features`, and shared UI under `src/shared/ui`. It already contains shadcn/Radix-style primitives, semantic tokens, app-shell components, theme runtime, i18n runtime, TanStack Query, and existing verification commands.

Several existing docs conflict with this new target. The neutral-baseline reset intentionally removed cyber visuals, gradients, glow effects, category colors, and decorative motion. This spec supersedes that visual direction for the legacy parity migration. The architecture and placement rules from the ADRs remain active unless this spec records a narrow visual exception.

## Source Of Truth

The primary source of truth is the rendered legacy app in Chrome:

- Legacy URL: `http://localhost:5174/`
- Current target URL: `http://localhost:5173/`
- Browser evidence: Chrome DevTools MCP screenshots, computed styles, layout metrics, DOM state, viewport state, and interaction behavior
- Supporting evidence: `legacy-frontend` source files for hidden states, conditional UI, animation intent, and repeated class patterns

When source code and runtime rendering differ, runtime rendering wins.

## Architecture Boundaries

The migration changes visuals, not application architecture.

Keep these current boundaries:

- `src/app/router` remains the route source of truth.
- Route modules remain lazy-loaded through the current helper pattern.
- `src/pages` remains the route composition layer.
- `src/features` keeps feature UI, business logic, schemas, hooks, query options, and API calls.
- `src/shared/ui/primitives` keeps low-level reusable UI.
- `src/shared/ui/composites` keeps reusable domain-neutral assemblies.
- `AuthContext` keeps auth ownership.
- Current theme and language providers keep runtime ownership.
- TanStack Query keeps server-state ownership.
- Axios/client error normalization remains unchanged.

The legacy app is not copied as an architecture. Legacy files provide visual evidence and implementation hints only.

## Visual System

The current Tailwind v4 CSS-first token system should be retargeted to the legacy cyber visual identity.

The dark theme must match the legacy dark rendering:

- Slate page backgrounds and dark glass surfaces
- Cyan and blue primary accents
- Cyan border accents and glow shadows
- Dark input surfaces
- White primary text and slate secondary text
- Dark custom scrollbar behavior
- Fixed cyber background grid and blurred cyan/purple orbs

The light theme must match the legacy light rendering:

- Slate-50 and white page backgrounds
- White glass cards
- Soft slate borders
- Cyan and blue action accents
- Slate primary and secondary text
- Light custom scrollbar behavior

Legacy variable roles from `legacy-frontend/src/index.css` should be represented in the current token layer where they are reusable:

- `--bg-primary`
- `--bg-secondary`
- `--bg-tertiary`
- `--bg-card`
- `--bg-card-hover`
- `--bg-input`
- `--border-primary`
- `--border-secondary`
- `--border-accent`
- `--text-primary`
- `--text-secondary`
- `--text-tertiary`
- `--text-muted`
- `--accent-primary`
- `--accent-secondary`
- `--shadow-glow`

The existing semantic token names may continue to exist, but their values and component usage must produce the legacy rendering. If a legacy visual role cannot be expressed clearly with an existing semantic token, add a purpose-based token rather than scattering raw values across pages.

## Typography

Typography is part of pixel parity.

The migration must match the rendered legacy typography, including:

- Font family and fallback stack
- Web font loading behavior
- Font smoothing
- Font weights
- Font sizes
- Line heights
- Letter spacing
- Text transforms
- Heading scale
- Body text scale
- Button, badge, nav, input, label, table, dialog, and card text metrics
- Truncation, wrapping, and responsive line breaks
- Text alignment in LTR and RTL-sensitive areas

Both apps currently import Inter, but the accepted value is the computed Chrome rendering from the legacy app. Chrome DevTools MCP must be used to verify typography through computed styles, not only CSS declarations.

## Component Library Design

Build legacy visual parity through the current shared UI system.

Shared primitives and composites should absorb repeated legacy patterns before broad page migration. This prevents every page from recreating cards, buttons, forms, badges, and overlays differently.

Core primitives and composites in scope:

- `Button`: gradient primary, glass secondary, outline, ghost, icon-only, active scale, hover scale, disabled state, and composed loading state.
- `Card`: legacy glass card, bordered card, white/light card, shadowed card, and hover card behavior.
- `CyberSurface`: repeated glass surface wrapper for page panels, cards, and dense sections.
- `Input`, `Textarea`, `NativeSelect`, and `Select`: legacy input backgrounds, cyan focus border/ring, placeholder colors, disabled state, and invalid state.
- `Badge`: compliance, status, metadata, selected state, and category chip styles.
- `GradientIcon`: service icon tiles using legacy service gradients.
- `Dialog`, `Sheet`, and `AlertDialog`: Radix behavior with legacy modal chrome.
- `Tabs`, `Table`, `Pagination`, `Skeleton`, `Spinner`, `Progress`, and `Avatar`: visual parity with legacy density, radius, color, and spacing.
- `PageContainer`, `PageHeader`, `SectionCard`, `EmptyState`, and loading composites: updated to match legacy page rhythm.
- Top bar controls, theme switcher, language selector, consent banner, bottom navigation, assistant dock, and compliance badges.

Admin-specific shell surfaces, navigation, cards, charts, and controls are out of scope unless a future approved spec reintroduces admin.

Shared UI must stay under `src/shared/ui`. Do not create new generic shared UI under legacy `src/components`.

## Shell Design

The app shell controls many pixels and must be migrated before most pages.

The current shell should match legacy `CyberLayout` behavior and appearance:

- Fixed top header
- Back button behavior where current routes need it
- Theme switcher and language selector placement
- Header blur, border, and background opacity
- Page padding: fixed header offset and bottom navigation offset
- Role-aware bottom navigation
- Fixed bottom navigation geometry, overflow behavior, active state, notification dot, icon tile, top border glow, and safe-area spacing
- Cyber background gradient
- Grid overlay
- Blurred cyan and purple orbs
- Assistant placement above bottom navigation
- Consent banner placement and visual chrome

Admin shell parity is out of scope unless a future approved spec reintroduces admin.

## Route Parity Scope

The migration covers every reachable current frontend surface that has a legacy counterpart or legacy visual expectation.

Route groups in scope:

- Public routes: landing, services, how-it-works, subscriptions, help.
- Auth routes: onboarding, login, signup, and specialized provider/service signup routes.
- Patient routes: dashboard, service detail, equipment, bookings, medications, donation, profile/mon-espace, health, concierge, tracking, messages, notifications, and help.
- Provider routes: dashboard, services, new service, schedule, balance, transactions, analytics, finance, pharmacy orders, active delivery, messages, help, account/profile, marketing, insurance, and billing.
- Services and bookings routes: public services, patient service detail, patient bookings, provider services, and provider schedule surfaces.
- Messaging, help, and notifications routes: patient/provider messages, help, notifications, and related global notification UI.
- Assistant and consent routes/states: assistant entry points, assistant dock, consent banner, and consent state transitions.
- Mixed remaining routes: current reachable routes outside the removed admin role that use older legacy styles or lack exact legacy counterparts.
- Shared overlays and global UI: consent banner, assistant, language menu, theme switcher, toasts, dialogs, sheets, loading states, empty states, and errors.

If a current route has no exact legacy counterpart, it should use the nearest legacy shell, primitives, spacing, typography, and cyber visual language. These cases must be recorded in the parity matrix.

Admin routes remain out of scope unless a future approved spec reintroduces admin.

## Migration Sequence

The migration should happen in dependency order.

1. Capture visual baseline
   Capture screenshots and computed styles for legacy and current routes across the approved matrix. Record route availability, auth state, theme, viewport, language, consent state, and notable dynamic content.

2. Retarget global tokens and base styles
   Move the current visual foundation from neutral tokens to legacy cyber tokens. Restore legacy scrollbar behavior, font smoothing, transitions, reusable animation utilities, and background support.

3. Match the app shell
   Migrate the current top header, bottom navigation, background, assistant placement, page offsets, and consent banner to legacy parity. Do this before broad page work.

4. Match shared primitives and composites
   Update shared UI primitives and composites to match legacy buttons, cards, forms, badges, tabs, dialogs, tables, skeletons, loading states, and empty states.

5. Migrate public and auth pages
   Match landing, services, how-it-works, subscriptions, onboarding, login, signup, and specialized signup pages.

6. Migrate patient pages
   Match patient dashboard, service details, bookings, equipment, medications, profile, health, concierge, tracking, messages, notifications, and help.

7. Migrate provider pages
   Match provider dashboard, services, schedule, balance, transactions, analytics, finance, active delivery, pharmacy orders, messages, help, marketing, insurance, billing, and account/profile surfaces.

8. Migrate mixed remaining legacy routes
   Match any current route outside the removed admin role that uses an older non-cyber legacy style by using the rendered legacy behavior as the source of truth. Admin migration remains out of scope unless a future approved spec reintroduces admin.

9. Verify and document exceptions
   Re-run visual captures. Record any unavoidable mismatch as a user-approved exception with route, state, viewport, theme, and reason.

## Visual Regression Workflow

Chrome DevTools MCP is required for the parity workflow.

For each route/theme/viewport combination:

1. Open the legacy route on `localhost:5174`.
2. Set the theme explicitly to dark or light.
3. Set the viewport.
4. Stabilize page state by pinning language, auth state, consent state, and dynamic content where possible.
5. Capture viewport and full-page screenshots.
6. Extract computed styles for the shell, headings, body text, buttons, cards, inputs, badges, nav, overlays, and repeated components.
7. Open the current route on `localhost:5173`.
8. Apply the same theme, viewport, language, auth state, and consent state.
9. Capture matching screenshots and computed styles.
10. Compare screenshots and style evidence.
11. Fix the mismatch at the correct ownership layer: token, shell, shared component, feature component, or route page.
12. Re-run the capture until the route is accepted or an exception is approved.

Default viewport matrix:

- Desktop: `1440x900`
- Tablet: `1024x768`
- Mobile tall: `390x844`
- Mobile small: `360x800`

Theme matrix:

- Dark
- Light

Language matrix:

- French is the first pixel-match language.
- Arabic receives RTL smoke checks for layout-sensitive surfaces.

Authentication state:

- Legacy patient/provider routes use the legacy Google-login bypass.
- Current patient state uses the local seeded patient account supplied for the visual-regression run.
- Current provider state uses the local seeded provider account supplied for the visual-regression run.
- Do not store reusable passwords in screenshots, docs, commits, or visual-regression artifacts.

Acceptance is screenshot parity across the matrix. Any accepted difference must be documented as an exception.

## Data And State Rules

Visual parity must not change data ownership.

- API calls stay in the existing feature/service layers.
- Query state stays in TanStack Query.
- Auth behavior stays in the current auth context.
- Route guards stay in the current router guard layer.
- Shared primitives and composites must not call APIs or depend on business data shapes.
- Feature components map business data into shared visual components.
- Visual migration must not change backend request or response contracts.

## Error Handling

Functional error handling remains unchanged.

- Existing API error normalization remains active.
- Existing route guard behavior remains active.
- Existing route and app error boundaries remain active.
- Error screens and fallback chrome should match legacy visuals where a legacy equivalent exists.
- Form validation behavior remains current-app behavior, but labels, invalid styles, messages, focus rings, and disabled states should visually match legacy.
- Dialogs and sheets keep Radix focus management, escape behavior, portal behavior, and accessible titles while matching legacy chrome.

## Accessibility

Pixel parity must not remove current accessibility semantics.

- Keep accessible names for icon-only controls.
- Keep labels and descriptions associated with inputs.
- Keep visible focus states.
- Keep keyboard navigation for menus, dialogs, sheets, tabs, forms, and bottom navigation.
- Keep dialog titles and focus trapping.
- Preserve touch target usability on mobile.
- Avoid relying only on color for status when current code already provides text or icon backup.
- Preserve RTL support where the current app already supports it.
- Respect reduced-motion preferences where possible, while still matching the legacy motion model for normal motion users.

If the legacy page is less accessible than the current implementation, preserve the current semantic improvement while matching the visual rendering as closely as possible.

## Testing And Verification

Do not add new unit tests by default. Update existing tests when a migrated shell, route, primitive, or accessible label changes an existing assertion.

Default verification for each implementation slice:

- `npm run lint`
- `npm run type-check`

Additional verification for broad shell, shared UI, route, or release-sensitive changes:

- `npm run build`

Additional verification for route chunking, heavy UI, charts, maps, assistant changes, dependency changes, or bundle-sensitive work:

- `npm run build:budget`

Manual and browser verification must include:

- Dark and light themes
- Desktop, tablet, mobile tall, and mobile small viewports
- Public, auth, patient, provider, services/bookings, messaging/help/notifications, assistant, consent, shared overlays, and mixed remaining route states where applicable
- Consent banner shown and dismissed states where applicable
- Language selector open and closed states
- Theme switcher states
- Dialogs, sheets, popovers, dropdowns, and forms
- Hover, focus, active, disabled, loading, empty, error, and success states
- Typography computed styles and text wrapping

## Non-Goals

- Do not copy the legacy app architecture into `CareAtHomeFinal`.
- Do not move new shared UI into legacy `src/components`.
- Do not rewrite backend contracts.
- Do not change auth, route guards, API calls, or TanStack Query ownership for visual reasons.
- Do not replace fonts with approximations unless the user approves an exception.
- Do not introduce a new visual framework or styling system without a separate approved spec.
- Do not accept approximate visual matches without documenting and approving the exception.
- Do not include admin visual parity work unless a future approved spec reintroduces admin.

## Conflicting Prior Docs

This spec supersedes prior visual direction where conflicts exist.

Conflicting or partially superseded docs:

- `docs/superpowers/specs/2026-05-02-neutral-baseline-reset-design.md`
- The neutral-visual parts of `docs/superpowers/specs/2026-05-02-tailwind-design-system-roadmap-design.md`
- The raw-palette prohibition in `docs/07-styling-and-theming.md` when legacy visual parity requires repeated cyan, blue, purple, rose, amber, emerald, or slate roles
- The category-color prohibition where the running legacy app uses service gradients as part of the visual source of truth
- The decorative-motion prohibition where the running legacy app uses hover scale, pulse, ping, conic spin, blurred orbs, or Framer Motion transitions

Still active unless explicitly contradicted:

- `docs/adr/ADR-001-ui-foundation.md`
- `docs/adr/ADR-002-semantic-theme-tokens.md` as a token-ownership rule
- `docs/adr/ADR-004-router-and-module-boundaries.md`
- `docs/governance/frontend-contribution-guide.md` placement and dependency rules
- Shared overlay accessibility and focus-management rules

## Deliverables

Implementation planning should produce these artifacts or checkpoints:

- Route, state, theme, and viewport parity matrix
- Typography parity checklist
- Legacy component inventory mapped to current shared UI primitives and composites
- Chrome DevTools MCP capture protocol
- Migration slices ordered by dependency
- Separate implementation plans for each route-group slice before coding begins
- Screenshot evidence for accepted route groups
- Documented user-approved visual exceptions
- Updated docs that prevent future work from accidentally re-neutralizing the restored legacy UI

## Success Criteria

The migration succeeds when:

- The current app matches the running legacy app across the approved route, theme, viewport, and auth-state matrix.
- Shared buttons, cards, inputs, badges, overlays, shell controls, and navigation match legacy rendering.
- Typography matches computed legacy rendering, including font, weight, size, line height, and wrapping.
- Dark and light modes match legacy behavior.
- Public, auth, patient, provider, services/bookings, messaging/help/notifications, assistant, consent, shared overlays, and mixed remaining route surfaces use the restored legacy visual language.
- Admin remains out of scope unless a future approved spec reintroduces admin.
- The current architecture remains intact.
- Verification commands pass for each completed implementation slice.
- Any unavoidable visual differences are documented and approved by the user.

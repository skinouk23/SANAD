# Tailwind Design System Roadmap Design

## Status

Ready for user review. This document records the approved design direction. It does not authorize implementation until the written spec is reviewed and approved.

## Goal

Define a brand-agnostic Tailwind CSS v4 design-system roadmap for Care@Home Tunisia. The roadmap should improve visual consistency, accessibility, developer velocity, and future brand flexibility without changing routes, data flow, backend mode, or application architecture.

## Current Context

The frontend is a React 18, TypeScript, Vite, and Tailwind CSS v4 SPA. Tailwind runs in CSS-first mode through `@tailwindcss/vite`.

The active styling structure is:

- `src/index.css` imports Tailwind, defines the custom dark variant, and imports theme styles.
- `src/styles/theme-tokens.css` defines semantic CSS variables and exposes them to Tailwind through `@theme inline`.
- `src/styles/theme-base.css` owns global base styles, functional loading animation, skeleton utilities, and scrollbar utilities.
- `src/shared/ui/primitives` contains Radix- and shadcn-aligned low-level UI.
- `src/shared/ui/composites` contains reusable domain-neutral page patterns.
- `src/features/*` owns feature-specific UI and data behavior.
- `src/pages/*` owns route entry composition.
- `src/components` remains a legacy area and should not receive new generic design-system work.

Existing architecture references already support this direction:

- `docs/07-styling-and-theming.md` documents Tailwind v4, semantic tokens, theme runtime, and shared UI boundaries.
- `docs/adr/ADR-001-ui-foundation.md` standardizes on Tailwind v4, shadcn conventions, Radix primitives, and no Base UI adoption.
- `docs/adr/ADR-002-semantic-theme-tokens.md` requires reusable UI to use semantic tokens rather than page-specific palette classes.
- `docs/superpowers/specs/2026-05-02-neutral-baseline-reset-design.md` defines the current neutral baseline direction.

Project exploration also found remaining raw palette usage in active feature and page UI. The roadmap should handle that through a controlled migration, not isolated cosmetic edits.

## Non-Goals

- No new Care@Home brand identity.
- No replacement of Tailwind CSS v4, Radix, shadcn-style primitives, React Router, TanStack Query, Zod, Axios, or the current theme runtime.
- No Tailwind v3-style config migration. The live design system remains CSS-first.
- No Base UI adoption.
- No route, guard, data-fetching, mutation, auth, i18n, or backend-mode redesign.
- No broad rewrite of feature logic.
- No new test expansion by default. Later implementation tasks can add tests when explicitly requested or when existing tests must be updated for changed behavior or imports.

## Design Principles

1. Preserve behavior first. Styling and design-system changes must not alter routes, guards, forms, data loading, mutations, or recovery actions.
2. Keep the system brand-agnostic. The roadmap defines infrastructure that can support a future brand layer without another app-wide rewrite.
3. Use semantic tokens for reusable UI. Shared UI should style against meaning-based utilities such as `bg-card`, `text-muted-foreground`, `border-border`, and `ring-ring`.
4. Reserve raw palette classes for local exceptions. Repeated raw color usage should become semantic token usage or a shared component variant.
5. Prefer shared primitives and composites. Feature UI should compose system building blocks instead of forking low-level behavior.
6. Keep accessibility visible. Focus, disabled, invalid, loading, selected, and destructive states must remain perceivable in light and dark mode.
7. Keep the roadmap incremental. Each phase should have a clear target, verification path, and migration boundary.

## Recommended Approach

Use a phased design-system roadmap:

1. Define the system contract.
2. Harden shared primitives and composites.
3. Migrate active pages and features through inventory-driven cleanup.
4. Update docs and guardrails so future work follows the same contract.

This approach gives the team a stable contract before visual cleanup. It avoids inventing tokens and variants reactively while still creating a direct path to remove visible inconsistencies.

## Architecture And Boundaries

The Tailwind design system is a layered contract, not a separate package.

`src/styles/theme-tokens.css` remains the source of truth for Tailwind v4 semantic tokens. It should define purpose-based CSS variables and expose them through `@theme inline`.

`src/styles/theme-base.css` remains limited to global base behavior and shared utilities that support accessibility, layout, loading, skeletons, and scroll behavior. It should not encode a new visual identity.

`src/shared/ui/primitives` is the enforcement layer for low-level reusable UI variants. Primitive variants should describe purpose or state, not visual personality.

`src/shared/ui/composites` is the enforcement layer for reusable page patterns such as form fields, page headers, section cards, empty states, loading states, and profile surfaces.

`src/features/*` keeps business-specific UI and data behavior. Feature code can use local visual treatment when it is truly domain-specific, but repeated styling should move toward shared tokens or shared components.

`src/pages/*` remains route composition. Pages can arrange feature components and shared layout patterns, but they should not define reusable design-system rules.

`src/components` remains legacy-only. New generic shared UI belongs in `src/shared/ui`.

## Token Contract

The roadmap should formalize the existing neutral baseline into stable Tailwind v4 token groups. Token names must be purpose-based, not hue-based.

Required token groups:

- Surfaces: `background`, `card`, `popover`, `muted`, `sidebar`, and foreground pairs where needed.
- Text: `foreground`, `muted-foreground`, `subtle`, `faint`, and component foreground tokens such as `card-foreground`.
- Borders and inputs: `border`, `border-strong`, `input`, `ring`, and a documented focus-ring pattern.
- Actions: `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, and `accent-foreground`.
- Feedback: `success`, `warning`, `destructive`, and foreground pairs.
- Shape: `radius` as the source for radius scales.
- Motion: functional loading and progress patterns only unless a future approved brand spec expands motion.
- Layout: documented container widths, section spacing, grid gaps, and mobile breakpoint conventions.

Token rules:

- Shared UI must use semantic token classes such as `bg-card`, `text-muted-foreground`, `border-border`, `ring-ring`, and `bg-destructive`.
- Raw palette classes are allowed only for intentional local feature visuals.
- Repeated raw color usage becomes either semantic token usage or a shared component variant.
- Feedback tokens communicate state only. They must not become service or provider category identity.
- Light and dark modes should support readability and user preference. They should not become separate visual personalities.

## Component Contract

Shared components should be the main way developers consume the design system.

Primitive scope:

- `Button`: standardize variants around function, including `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`, and loading or disabled behavior where needed.
- `Badge`: use state and metadata variants such as `default`, `secondary`, `outline`, `success`, `warning`, `destructive`, and `selected`.
- `Card`: keep one neutral surface contract with consistent border, radius, padding, and optional interactive state.
- `Input`, `Textarea`, `Select`, `Checkbox`, and `Label`: standardize focus, invalid, disabled, help text, and error states.
- `Dialog`, `Sheet`, `DropdownMenu`, `Tabs`, and `Tooltip`: keep Radix for behavior, token-backed styling, visible focus states, and reduced-motion-safe behavior.

Composite scope:

- `FormField`: preferred pattern for label, control, description, error, and accessibility wiring.
- `PageHeader`: preferred pattern for page title, subtitle, actions, and route metadata when present.
- `SectionCard`: preferred section wrapper for page content.
- `EmptyState`, `Loading`, and `Skeleton`: preferred non-happy-path UI with consistent tone and sizing.
- Profile and shell composites: shared only when they are domain-neutral.

Component rules:

- Variants describe purpose or state, not visual personality.
- Components expose minimal props.
- Broad `tone` props should be avoided unless the allowed states are explicit.
- Components use `cn(...)`, `class-variance-authority` where variants are meaningful, and semantic token classes.
- Feature components may compose primitives, but should not fork generic primitive behavior.

## Responsive Layout Contract

Responsive layout should be documented as a small set of reusable patterns instead of ad hoc spacing per page.

Layout conventions:

- Container widths: define standard sizes for narrow forms, standard content, wide dashboards, and full-width map or tracking surfaces.
- Section rhythm: define consistent spacing between page headers, primary content sections, dense data panels, and mobile stacked content.
- Grid patterns: use a limited set of responsive grids, starting with one-column mobile layouts and expanding to tablet or desktop grids only when content density justifies it.
- Touch targets: buttons, tabs, selects, booking controls, and mobile actions should stay usable on mobile and senior-facing flows.
- Sticky and fixed regions: messaging inputs, booking summaries, bottom navigation, assistant controls, and mobile action bars need safe-area-aware spacing.
- Dashboard density: patient and provider dashboards should share card sizing, metadata hierarchy, and wrapping rules.
- Route composition: `src/pages` should compose shared layout patterns and feature components, not define reusable design rules.

Accessibility rules:

- Preserve visible focus states across interactive components.
- Avoid color-only state communication.
- Respect reduced-motion behavior.
- Maintain readable text contrast in light and dark themes.
- Keep form labels and error text programmatically associated with inputs.
- Prevent unintentional horizontal scrolling on mobile. Intentional overflow, such as data tables, needs a clear affordance.

## Migration Design

Migration should happen after the system contract and shared component targets are documented. It should be inventory-driven.

Migration phases:

1. Inventory active `src` files for raw palette classes, repeated layout shells, category colors, custom form states, and duplicated loading, empty, or error patterns.
2. Classify each finding as a valid local visual, semantic token usage, shared component usage, or deferred legacy code.
3. Harden shared primitives and composites before editing many feature pages.
4. Migrate high-traffic routes first: public landing/auth, service discovery, booking flows, patient dashboard, provider dashboard, messaging, and profile surfaces.
5. Keep domain logic inside `src/features/*` while replacing repeated styling with shared primitives, composites, and semantic classes.
6. Update styling docs and review rules with examples and exceptions.
7. Verify each implementation phase with the commands appropriate to its risk.

The migration should not remove valid local visuals blindly. A one-off feature visual can stay local if it is not reused and does not undermine the shared system.

## Documentation And Guardrails

The roadmap should update existing documentation rather than creating a separate design-system manual that drifts.

Documentation targets:

- Update `docs/07-styling-and-theming.md` with token groups, component usage examples, layout conventions, and raw palette exceptions.
- Keep `docs/adr/ADR-001-ui-foundation.md` and `docs/adr/ADR-002-semantic-theme-tokens.md` as governing decisions unless the team changes those decisions through new ADRs.
- Add examples for common patterns: buttons, badges, cards, form fields, page headers, section cards, loading states, empty states, and responsive grids.
- Document how to decide whether a repeated visual choice becomes a token, a component variant, or a local feature style.

Guardrails:

- New generic UI goes in `src/shared/ui`, not `src/components`.
- Shared UI uses semantic token classes.
- Feature-specific UI stays in the owning feature slice.
- Raw palette classes in shared UI require correction.
- Raw palette classes in feature UI require a clear local reason.
- Service and provider categories should not gain decorative color systems through incremental edits.

## Error, Empty, Loading, And State Handling

The design system should make non-happy paths consistent without changing behavior.

- Errors use destructive semantic styling and preserve recovery actions.
- Warnings use warning semantic styling and clear copy.
- Success states use success semantic styling only when they communicate state.
- Empty states use shared neutral composites.
- Loading states use shared loading, skeleton, or progress patterns.
- Form validation uses programmatically associated error text and invalid state styling.
- Disabled and pending states remain visible without relying on opacity alone when meaning could be lost.

## Verification Strategy

Default verification for implementation phases:

- `npm run lint`
- `npm run type-check`

Use `npm run build` when changes touch shared UI used across routes, app shell layout, route-level composition, or release-sensitive surfaces.

Use `npm run build:budget` and inspect `dist/reports/` when changes affect route chunking, heavy dependencies, assistant surfaces, maps, or bundle-sensitive imports.

Manual checks should cover:

- Light, dark, and system theme behavior.
- Keyboard focus visibility.
- Mobile layout and safe-area spacing.
- Booking flow readability and action placement.
- Patient and provider dashboard density.
- Messaging fixed input behavior.
- Error, empty, loading, selected, disabled, success, warning, and destructive states.
- Absence of new reusable raw palette patterns.

## Roadmap Phases

Phase 1: System contract

- Document token groups, component variant rules, layout conventions, accessibility rules, and migration classification.
- Confirm that `theme-tokens.css` and `theme-base.css` remain the correct source boundaries.

Phase 2: Shared UI hardening

- Review and adjust primitives for token usage, state coverage, focus visibility, and variant naming.
- Review and adjust composites for common page patterns, non-happy paths, and form accessibility.

Phase 3: High-traffic migration

- Inventory raw palette and repeated layout patterns.
- Migrate active public, auth, booking, dashboard, messaging, and profile surfaces to shared tokens and components.

Phase 4: Documentation and guardrails

- Update styling docs and examples.
- Record exceptions and deferred legacy areas.
- Add review guidance for future contributors.

Phase 5: Follow-up cleanup

- Remove obsolete duplicate styling patterns when no active imports use them.
- Revisit any deferred legacy code with a separate, scoped plan.

## Success Criteria

- The project has one documented Tailwind v4 design-system contract.
- Shared primitives and composites use semantic token classes and clear functional variants.
- Route and feature UI have a migration path away from repeated raw palette and category-color patterns.
- Responsive layout conventions cover forms, dashboards, mobile action regions, messaging, maps, and tracking surfaces.
- Accessibility requirements are explicit for focus, contrast, motion, touch targets, form errors, and color-independent state communication.
- The roadmap preserves the neutral baseline and remains brand-agnostic.
- Future brand work can change tokens and selected component variants without redesigning route and feature architecture.

## Open Decisions Closed By This Spec

- The roadmap covers tokens, shared components, responsive layout, migration cleanup, documentation, and guardrails.
- The roadmap is brand-agnostic and does not introduce a new visual identity.
- The first implementation phase should define the system contract before component hardening or page migration.
- Visual consistency and accessibility are the leading priorities, with developer velocity and future brand flexibility as constraints.
- The existing Tailwind v4 CSS-first architecture remains the foundation.

# shadcn Form System Migration Design

## Status

Ready for user review. This document records the approved design direction. It does not authorize implementation until the written spec is reviewed and approved.

## Goal

Repair the app-wide form system so inputs, input icons, focus rings, invalid states, disabled states, field layout, and action buttons follow the project's shadcn/Radix conventions.

The immediate symptom is broken-looking login inputs, especially icon placement and focus styling. The chosen scope is broader: migrate the shared form foundation and app form consumers that duplicate primitive behavior so the same issue does not reappear in other screens.

## Approved Direction

Use a full form-system migration.

The approved approach is to align shared form primitives and then migrate auth, profile, provider, equipment, and other form call sites that duplicate control chrome or field layout. This is broader than a login-only fix and should be implemented in controlled phases under this spec.

The visual direction is hybrid: align structure and behavior with shadcn, while preserving Care@Home's current density, semantic tokens, and product feel where they work.

## Current Context

The frontend is a React 18, TypeScript, Vite, and Tailwind CSS v4 SPA.

`components.json` currently resolves through `npx shadcn@latest info --json` with:

- framework: Vite
- style: `radix-nova`
- base: `radix`
- icon library: `lucide`
- Tailwind CSS file: `src/index.css`
- UI alias: `@/shared/ui/primitives`
- shared UI alias: `@/shared/ui`
- utility alias: `@/shared/lib/utils`

The project already has the relevant primitives installed, including `field`, `input`, `input-group`, `button`, `checkbox`, `select`, `native-select`, `separator`, `alert`, and `spinner`.

Exploration found these concrete form-system issues:

- `src/features/auth/screens/login/LoginFormStep.tsx` uses `AuthInputField`, but also passes local padding, focus, background, and ring classes into the control.
- `src/features/auth/components/AuthFormControls.tsx` wraps shadcn-style primitives, but it still owns part of the input chrome through `authControlClassName`, custom icon classes, and feature-level control classes.
- Login uses raw `<button>` elements for primary submit, account change, forgot password, social placeholders, and separator markup instead of shared `Button`, `Spinner`, and `Separator` patterns.
- Login uses `className="space-y-3"` for form layout instead of `FieldGroup`.
- Auth signup screens and professional signup sections reuse the same auth wrappers, so fixing only login would leave the broader auth form system inconsistent.
- Profile, provider, equipment, and service-authoring screens contain many direct `Input` usages and field layouts that should be checked against the final shared primitive rules.

Relevant project rules already exist:

- `AGENTS.md` says new and touched forms use React Hook Form, Zod, and shadcn `Field` primitives or shared RHF adapters.
- `docs/07-styling-and-theming.md` defines the shared UI boundary, primitive inventory, and form usage rules.
- `docs/governance/frontend-contribution-guide.md` requires `FieldGroup`, `Field`, `aria-invalid`, `data-invalid`, `InputGroupInput` inside `InputGroup`, and `Controller` for Radix-controlled controls.
- `docs/adr/ADR-001-ui-foundation.md` standardizes Tailwind v4, shadcn conventions, Radix primitives, and `src/shared/ui` as the UI foundation.

## Scope

In scope:

- Shared form primitives: `Input`, `InputGroup`, `InputGroupInput`, `InputGroupAddon`, `Field`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError`, `Button`, `Checkbox`, `Select`, `NativeSelect`, `Separator`, `Alert`, and `Spinner`.
- Auth form wrappers: `AuthInputField`, `AuthSelectField`, `AuthCheckboxField`, `PasswordToggle`, and `PasswordStrengthMeter` where it touches field layout.
- Auth screens: login, patient signup, and professional signup.
- Input-heavy consumers that recreate primitive behavior locally: patient profile tabs, provider profile tabs, provider service authoring, equipment public forms, and nearby call sites that add local input padding, icon positioning, focus rings, invalid rings, or raw field wrappers.
- Documentation updates when source changes alter accepted usage.
- Verification with lint, type-check, and build.

Out of scope:

- No new visual preset.
- No Base UI adoption.
- No component showcase route.
- No backend, auth-session, routing, data-fetching, or business-flow rewrite.
- No unrelated design-system cleanup outside forms.
- No broad test addition unless explicitly requested.

## Architecture

`src/shared/ui/primitives` owns low-level shadcn-compatible behavior.

Primitives define default sizing, focus rings, invalid rings, disabled behavior, icon alignment, semantic token usage, and accessible structure. Consumers should not repair primitive behavior with local `pl-*`, `pr-*`, `focus-visible:*`, absolute icon placement, manual icon sizing, or custom loading button markup.

`src/shared/ui/composites` may own repeated domain-neutral form assemblies.

Good candidates include form section layout, form action rows, inline form status messages, and React Hook Form adapters if repeated across unrelated features. These composites must depend only on shared primitives and generic form concepts.

`src/features/auth/components/AuthFormControls.tsx` remains feature-owned.

Auth-specific wrappers can preserve the auth visual language, labels, density, and password-strength behavior. They should compose shared primitives correctly and stop owning core input chrome that belongs in `Input` or `InputGroup`.

Feature screens own business composition.

Login, signup, profile, provider, and equipment screens should express labels, help text, schema errors, submit behavior, and field ordering. They should not recreate low-level primitive behavior.

The key boundary is: primitive behavior belongs in primitives; repeated neutral form layout belongs in composites; business-specific labels and flows stay in features.

## Form Behavior Rules

Inputs with no adornments use `Input` directly.

Inputs with icons, suffix buttons, prefixes, password toggles, or other add-ons use `InputGroup`, `InputGroupInput`, and `InputGroupAddon`.

Icon spacing comes from `InputGroup` structure. It must not come from local `pl-9`, `pr-9`, absolute positioning, or duplicated focus classes.

Focus and invalid states are centralized. `Input` and `InputGroup` own border, ring, `aria-invalid`, and `data-invalid` styling. Feature code passes state and relationships; it does not style rings manually.

Field layout uses `FieldGroup` and `Field`. Responsive grids are allowed, but they should arrange complete fields, not rebuild primitive control chrome.

Native text-like inputs can use React Hook Form `register(...)`.

Radix/shadcn controlled controls use `Controller`, `useController`, or an approved adapter. This applies to `Checkbox`, `Select`, `RadioGroup`, and `Switch`.

Action buttons use shared `Button`. Pending actions use `disabled`, `aria-busy`, and `Spinner` with `data-icon` where the button pattern supports it.

Dividers use `Separator` or `FieldSeparator`.

Repeated form-level errors or status messages use shared feedback primitives or existing form-status composites instead of raw destructive text.

## Migration Plan

### Phase 1: Shared Form Foundation

Inspect current shadcn docs, registry output, or diffs for the form primitives before changing source.

Align local primitives where needed while preserving Care@Home semantic tokens and density. The result should make the primitives themselves responsible for sizing, focus, invalid, disabled, and icon-adornment behavior.

Priority primitives:

- `Input`
- `InputGroup`
- `Field`
- `Button`
- `Checkbox`
- `Select`
- `NativeSelect`
- `Separator`
- `Alert`
- `Spinner`

### Phase 2: Auth Forms

Simplify `AuthInputField`, `AuthSelectField`, `AuthCheckboxField`, and `PasswordToggle` so they compose the shared primitives without overriding core input chrome.

Migrate login, patient signup, and professional signup to use `FieldGroup`, `Button`, `Spinner`, `Separator`, and shared feedback patterns.

The login email and password controls are the first visible acceptance target. Their icons should align consistently, focus rings should match the shared primitive, invalid states should be clear, and password toggle placement should not shift the input text.

### Phase 3: App Form Consumers

Migrate form consumers that fight the shared primitives.

Priority targets:

- patient profile account and health tabs
- provider profile account and professional tabs
- provider service authoring fields
- equipment public form
- nearby input-heavy screens discovered during migration when they add local input padding, icon positioning, focus rings, invalid rings, or raw field wrappers

This phase should update visible form patterns that conflict with the new system. It should not chase unrelated styled blocks or redesign business flows.

### Phase 4: Documentation

Update `docs/07-styling-and-theming.md` and `docs/governance/frontend-contribution-guide.md` if implementation changes accepted usage examples or rules.

Docs should show the final preferred patterns for:

- `Input` without adornments
- `InputGroup` with icons and actions
- `FieldGroup` and `Field`
- validation state
- controlled Radix form controls
- pending submit buttons

## Error Handling And Accessibility

Every field with validation output should connect the control to error or help text through `aria-describedby`.

Invalid fields should set `data-invalid` on `Field` and `aria-invalid` on the concrete control.

Field errors should use `FieldError`, preserve `role="alert"` behavior, and avoid duplicate announcements.

Icon-only buttons, including password toggles, must keep accessible names.

Disabled controls should use the real `disabled` prop where possible and should receive consistent disabled styling from primitives.

Form-level submit errors should be announced through an accessible feedback component or an equivalent shared status pattern.

## Verification

Default verification:

- `npm run lint`
- `npm run type-check`
- `npm run build`

Manual visual checks should cover:

- login form
- patient signup form
- professional signup form
- one patient or provider profile tab
- equipment public form
- light mode and dark mode for at least the login form

No new tests are required by default. Add tests only if the user explicitly requests them or if implementation introduces reusable logic that needs durable coverage.

## Acceptance Criteria

The migration is successful when:

- Login email and password inputs use shared input behavior without local padding, icon-placement, or focus-ring overrides.
- Input icons align consistently inside `InputGroup` across auth forms.
- Focus, invalid, disabled, and placeholder states match the shared primitive rules.
- Auth submit actions use `Button` and `Spinner`; auth dividers use `Separator`; account change, forgot password, and disabled social placeholders use `Button` variants instead of raw button markup.
- Touched form layouts use `FieldGroup` and `Field` instead of ad hoc field stacks.
- Radix-controlled controls touched by the migration use `Controller`, `useController`, or an approved adapter.
- Touched app form consumers no longer duplicate input chrome with local classes.
- Updated docs match the implemented form patterns.
- `npm run lint`, `npm run type-check`, and `npm run build` pass.

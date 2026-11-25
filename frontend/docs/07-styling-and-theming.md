# 07 — Styling and Theming

## Current Styling Stack

The frontend uses Tailwind CSS v4 in CSS-first mode.

The active pipeline is:

- `vite.config.ts` loads the `@tailwindcss/vite` plugin.
- `src/index.css` loads Inter from Google Fonts, imports `tailwindcss`, defines the custom `dark` variant, and imports the theme styles.
- `src/styles/theme-tokens.css` defines semantic tokens and exposes them to Tailwind through `@theme inline`.
- `src/styles/theme-base.css` contains base styles, functional loading animation, scrollbars, skeleton utilities, and app-shell utilities.

`tailwind.config.js` and `postcss.config.js` still exist as empty compatibility stubs. The live theme and token setup is CSS-driven, not config-driven.

## Theme Token Contract

`src/styles/theme-tokens.css` is the source of truth for reusable theme tokens. Token names describe purpose, not hue or brand personality.

Token groups:

| Group | Tokens and Tailwind utilities | Use for |
| --- | --- | --- |
| Surfaces | `background`, `card`, `popover`, `muted`, `sidebar`, `overlay` and foreground pairs | Page backgrounds, cards, floating panels, subdued panels, navigation surfaces, modal/sheet backdrops |
| Text | `foreground`, `muted-foreground`, `subtle`, `faint`, plus surface foreground pairs | Primary copy, secondary copy, low-emphasis metadata, disabled-adjacent text |
| Borders and inputs | `border`, `border-strong`, `input`, `ring` | Dividers, cards, form controls, focus-visible rings |
| Actions | `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground` | Primary actions, secondary actions, hover/selected neutral emphasis |
| Feedback | `success`, `success-foreground`, `warning`, `warning-foreground`, `destructive`, `destructive-foreground` | Status only: success, warning, error, destructive actions |
| Shape | `radius` mapped to `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` | Shared component rounding and layout surfaces |
| Motion | `loading-progress-indeterminate` and component-local loading spinners | Functional pending-work indicators only |
| Layout | documented container, stack, section, grid, touch-target, and safe-area conventions | Responsive page composition and route layout consistency |

Tailwind v4 maps these tokens through `@theme inline`, which enables semantic utilities such as `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `ring-ring`, and `bg-primary text-primary-foreground`.

## Semantic Class Usage Matrix

Use semantic classes first in shared UI and repeated page patterns.

| UI need | Preferred classes |
| --- | --- |
| App/page background | `bg-background text-foreground` |
| Card or section surface | `bg-card text-card-foreground border border-border` |
| Popover, tooltip, dropdown | `bg-popover text-popover-foreground border border-border` |
| Modal or sheet overlay | `bg-overlay` |
| Muted panel | `bg-muted text-foreground` or `bg-muted/40 text-foreground` |
| Primary action | `bg-primary text-primary-foreground hover:bg-primary/90` |
| Secondary action | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| Neutral hover or active item | `hover:bg-accent hover:text-accent-foreground` |
| Selected metadata pill | `border-primary/30 bg-primary/10 text-primary` or `Badge variant="selected"` |
| Destructive action or error | `bg-destructive text-destructive-foreground`, `text-destructive`, `border-destructive` |
| Warning notice | `border-warning/30 bg-warning/10 text-warning` |
| Success notice or badge | `border-success/30 bg-success/10 text-success` |
| Form control | `border-input bg-input text-foreground placeholder:text-muted-foreground` |
| Invalid form control | `aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/40` |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background` |
| Skeleton shape | `Skeleton` or `sk-base`; skeleton cards use `sk-card` |

## Raw Palette Policy

Reusable UI must use semantic token classes. Do not add raw palette classes such as `bg-blue-*`, `text-emerald-*`, `border-red-*`, `bg-black/*`, or `text-white` inside `src/shared/ui/primitives` or reusable composites unless there is a documented exception.

Feature and page UI may use raw palette classes only for intentional local visuals that do not become a reusable system rule. If the same raw color choice appears across multiple components, route families, or feature states, migrate it to a semantic token, a shared component variant, or a documented shared composite.

Allowed or candidate exceptions:

- `LanguageSelector` national flag rendering may use fixed flag colors because the colors are content, not theme state.
- Rating stars may keep a fixed star color when the team treats the color as a domain-neutral rating convention. If rating UI becomes repeated and inconsistent, extract a shared rating display instead.
- Map markers, routes, legends, and heatmap-style data visualizations may use fixed colors when the colors are part of the represented content rather than reusable UI state.
- Media overlays may use black or white alpha colors when needed to preserve contrast over unpredictable images or video.
- Third-party brand marks may use their official colors when required by brand guidelines.

Feedback tokens communicate state only. Do not create service-category, provider-type, or marketing palette variants through incremental edits.

## Theme Runtime

Theme state lives in `src/shared/lib/theme/theme-context.tsx`. `src/contexts/ThemeContext.tsx` is only a compatibility re-export.

Current behavior:

- supported preferences are `dark`, `light`, and `system`
- the current preference is persisted in `localStorage` under `theme-preference`
- the provider writes `data-theme-preference` to `<html>`
- the provider toggles the `dark` and `light` classes on `<html>`
- `system` resolves from `matchMedia('(prefers-color-scheme: light)')`
- components consume `useTheme()` for `theme`, `resolvedTheme`, `toggleTheme`, and `isDark`

Because the HTML class is the switch point, both Tailwind's custom dark variant and the CSS token selectors stay aligned.

## Shared UI Boundary

The shared UI foundation is Radix- and shadcn-aligned. New reusable UI belongs under `src/shared/ui`, not under legacy `src/components`.

`components.json` is part of the design-system contract:

- `style` is `radix-nova`.
- Tailwind stays in v4 CSS-first mode with `tailwind.config` set to an empty string and `tailwind.css` set to `src/index.css`.
- `tailwind.cssVariables` stays `true`, `tailwind.baseColor` stays `neutral`, and live tokens remain in `src/styles/theme-tokens.css`.
- `aliases.ui` points to `@/shared/ui/primitives` for generated low-level components.
- `aliases.components` points to `@/shared/ui` for generated shared UI files that are not primitive-only.
- `aliases.utils` points to `@/shared/lib/utils` so generated components use the canonical `cn(...)` helper.
- `aliases.lib` points to `@/shared/lib` for shadcn helpers that need a shared library destination.
- No alias may target legacy `src/components`, `src/components/ui`, `src/lib`, or an unapproved hooks directory.

Key directories:

- `src/shared/ui/primitives/*` contains low-level reusable building blocks.
- `src/shared/ui/composites/*` contains domain-neutral assembled patterns such as `PageHeader`, `SectionCard`, `EmptyState`, layout composites, profile chrome, shared loading compositions, and temporary migration wrappers.
- `src/shared/lib/utils.ts` provides `cn(...)` via `clsx` and `tailwind-merge`.

The primitives follow shadcn conventions:

- variants use `class-variance-authority` when variants are meaningful
- accessible behavior comes from Radix primitives where needed
- classes are merged through `cn(...)`
- ref-capable primitives use React `forwardRef`
- generated code is normalized to semantic theme tokens before it becomes project code

See [ADR-001 — UI Foundation](./adr/ADR-001-ui-foundation.md).

## Current Primitive Inventory

The source of truth is `src/shared/ui/primitives/index.ts`. Add or remove entries there when primitive files change.

| Primitive | Use for |
| --- | --- |
| `Alert` | Inline feedback that needs a titled message and optional action. |
| `AlertDialog` | Blocking confirmations, destructive decisions, and flows where the user must choose before continuing. |
| `Avatar` | Person, provider, patient, or account imagery with accessible fallbacks. |
| `Badge` | Metadata, selected filters, and status labels. Status variants must describe state only. |
| `Button` | Actions, links rendered as actions through `asChild`, and icon buttons with accessible names. |
| `Card` | Low-level section surfaces. Prefer `SectionCard` when a titled domain-neutral section pattern fits. |
| `Checkbox` | Radix-backed boolean or tri-state choices. Use `checked` and `onCheckedChange`. |
| `Command` | Command palette and searchable option-list internals, usually composed with `Popover`. |
| `Dialog` | Centered modal workflows that are not destructive confirmations. |
| `DropdownMenu` | Menus attached to buttons, avatars, or toolbar triggers. |
| `Field` | Labels, descriptions, validation messages, and grouped form-control layout. |
| `Input` | Plain text-like native inputs. Use `InputGroupInput` inside `InputGroup`. |
| `InputGroup` | Inputs or textareas with inline icons, actions, prefixes, suffixes, or block add-ons. |
| `Label` | Standalone labels when `FieldLabel` is not enough. |
| `NativeSelect` | Browser-native select controls, especially simple form values and mobile-friendly pickers. |
| `Pagination` | Page navigation with accessible previous, next, current, and ellipsis items. |
| `Popover` | Lightweight anchored content that is not a menu, tooltip, or modal dialog. |
| `Progress` | Determinate progress or a clear pending-work meter. Do not use it as decoration. |
| `RadioGroup` | Single-choice sets with Radix value and change semantics. |
| `ScrollArea` | Contained scroll regions inside panels, dialogs, tables, or menus. |
| `Select` | Radix select for custom select interactions, rich option display, or non-native popover behavior. |
| `Separator` | Structural separators between related blocks or menu/list groups. |
| `Sheet` | Side, top, or bottom panels backed by Radix dialog behavior. |
| `Skeleton` | Loading placeholders when the final shape is known. |
| `Sonner` and `toast` | App-level transient notifications. Keep the app mount in `AppToaster`. |
| `Spinner` | Inline pending-work indicators in actions, rows, cards, or compact surfaces. |
| `Switch` | Boolean settings or toggles where on/off state is the UI concept. |
| `Tabs` | Section switching where all panels belong to the same route context. |
| `Table` | Semantic tabular data with a built-in horizontal overflow container. |
| `Textarea` | Multi-line native text input. Use `InputGroupTextarea` inside `InputGroup`. |
| `Toggle` | Pressed/unpressed toolbar-style actions. |
| `ToggleGroup` | Related toggle choices, especially compact option sets. |
| `Tooltip` | Short supplemental hints for controls that already have accessible names. |

## Updating Shadcn Components

Use the upstream shadcn source-code workflow for every add or replacement:

1. Inspect the current project state with `npx shadcn@latest info`.
2. Inspect upstream docs, registry entries, and examples with shadcn docs/view/search tools before generating code.
3. Run `npx shadcn@latest add @shadcn/<component> --dry-run` and confirm the planned output stays under `src/shared/ui` or `src/shared/lib`.
4. For an existing primitive, run a diff workflow such as `npx shadcn@latest add @shadcn/<component> --diff <file>` when the CLI supports it.
5. Add the component only after the dry-run and diff match the active migration slice.
6. Review every generated file before migrating consumers.
7. Fix generated imports, aliases, token classes, Lucide icon usage, and dependency placement.
8. Export accepted primitives from `src/shared/ui/primitives/index.ts`.
9. Migrate consumers directly to the current API instead of keeping broad compatibility props.
10. Verify with `npm run type-check` and `npm run lint`; run `npm run build` for broad shared UI, routing, or release-sensitive changes.

Do not run overwrite operations unless the affected file and every required consumer migration are part of the active slice. Do not create an app component gallery route.

## Component Usage Examples

### Button

Use `default` for the primary page action. Compose pending submit and layout states explicitly.

```tsx
import { SaveIcon } from 'lucide-react';

import { Button, Spinner } from '@/shared/ui/primitives';

<Button>Save changes</Button>
<Button variant="secondary">Save draft</Button>
<Button variant="outline">Cancel</Button>
<Button className="w-full">Continue</Button>
<Button type="submit" disabled={pending} aria-busy={pending}>
  {pending ? <Spinner data-icon="inline-start" aria-label="Saving" /> : null}
  {!pending ? <SaveIcon data-icon="inline-start" aria-hidden="true" /> : null}
  Save changes
</Button>
```

Icon-only buttons must keep an accessible name through visible text, `aria-label`, or an `sr-only` label.

### Badge

Use status variants only for status. Use `selected` for active filters or selected metadata.

```tsx
import { Badge } from '@/shared/ui/primitives';

<Badge variant="secondary">Metadata</Badge>
<Badge variant="selected">Selected</Badge>
<Badge variant="success">Available</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Failed</Badge>
```

### Card And SectionCard

Use `Card` for low-level surfaces and `SectionCard` for titled content sections.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/primitives';
import { SectionCard } from '@/shared/ui/composites';

<Card>
  <CardHeader>
    <CardTitle>Care summary</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>

<SectionCard title="Documents" description="Files required for verification">
  ...
</SectionCard>
```

### Forms And Controls

Use `FieldGroup` and `Field` for layout and validation state. Put `data-invalid` on `Field` and `aria-invalid` on the concrete control.

```tsx
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Controller } from 'react-hook-form';

import {
  Button,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@/shared/ui/primitives';

<FieldGroup>
  <Field data-invalid={Boolean(errors.fullName)}>
    <FieldLabel htmlFor="fullName">Full name</FieldLabel>
    <Input
      id="fullName"
      autoComplete="name"
      aria-invalid={Boolean(errors.fullName) || undefined}
      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
      {...register('fullName')}
    />
    <FieldError id="fullName-error">{errors.fullName?.message}</FieldError>
  </Field>

  <Field data-invalid={Boolean(errors.email)}>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <Mail aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        id="email"
        type="email"
        autoComplete="email"
        aria-invalid={Boolean(errors.email) || undefined}
        aria-describedby={errors.email ? 'email-error' : undefined}
        {...register('email')}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label={showEmailHelp ? 'Hide email help' : 'Show email help'}
          onClick={() => setShowEmailHelp((current) => !current)}
          size="icon-sm"
        >
          {showEmailHelp ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    <FieldError id="email-error">{errors.email?.message}</FieldError>
  </Field>

  <Controller
    control={control}
    name="city"
    render={({ field }) => (
      <Field data-invalid={Boolean(errors.city)}>
        <FieldLabel htmlFor="city">City</FieldLabel>
        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
          <SelectTrigger
            id="city"
            ref={field.ref}
            onBlur={field.onBlur}
            className="w-full"
            aria-invalid={Boolean(errors.city) || undefined}
            aria-describedby={errors.city ? 'city-error' : undefined}
          >
            <SelectValue placeholder="Choose a city" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="tunis">Tunis</SelectItem>
              <SelectItem value="sfax">Sfax</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>Choose the service city.</FieldDescription>
        <FieldError id="city-error">{errors.city?.message}</FieldError>
      </Field>
    )}
  />

  <Controller
    control={control}
    name="acceptTerms"
    render={({ field }) => (
      <Field orientation="horizontal" data-invalid={Boolean(errors.acceptTerms)}>
        <Checkbox
          id="acceptTerms"
          checked={field.value === true}
          onCheckedChange={(checked) => field.onChange(checked === true)}
          aria-invalid={Boolean(errors.acceptTerms) || undefined}
          aria-describedby={errors.acceptTerms ? 'acceptTerms-error' : undefined}
        />
        <FieldContent>
          <FieldLabel htmlFor="acceptTerms">Accept terms</FieldLabel>
          <FieldError id="acceptTerms-error">{errors.acceptTerms?.message}</FieldError>
        </FieldContent>
      </Field>
    )}
  />

  <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
    {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
    Save changes
  </Button>
</FieldGroup>
```

Use `Input` and `Textarea` directly when there are no add-ons. Use `InputGroupInput` and `InputGroupTextarea` inside `InputGroup` when a control has inline icons, prefix/suffix text, or inline actions. Do not place icons with local `pl-*`, `pr-*`, absolute positioning, or feature-level `focus-visible:*` classes.

Direct `Input` and `Textarea` `className` usage should be limited to layout or narrow state-specific exceptions, such as `className="resize-none"`. Do not override base chrome such as border, background, radius, padding, focus ring, disabled state, or invalid state in consumers.

Use `NativeSelect` for simple form values and mobile-friendly browser behavior. Use Radix `Select` when the UI needs custom trigger/content composition or richer option rendering.

Use `Controller` for Radix controls that expose `value`/`onValueChange` or `checked`/`onCheckedChange`, including `Select`, `Checkbox`, `RadioGroup`, and `Switch`. Use `register(...)` for native inputs, textareas, and `NativeSelect` when standard DOM events are sufficient.

### Overlays

Use Radix-backed overlays instead of custom fixed backdrops.

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/primitives';
```

Use `Dialog` for centered modal workflows, `Sheet` for side or edge panels, and `AlertDialog` for blocking confirmation or destructive decisions. Every `DialogContent`, `SheetContent`, and `AlertDialogContent` must contain the matching title component. Use an `sr-only` title only when the visible layout already provides equivalent context.

`DialogContent` owns dialog chrome: width, max-width, max-height, overflow behavior, padding, radius, background, shadow, and close-button placement. Choose `size="sm"`, `size="md"`, `size="lg"`, `size="xl"`, or `size="full"`. Choose `scroll="none"` for content that fits, `scroll="content"` with `DialogBody` when header and footer should stay visible, and `scroll="body"` when the whole panel should scroll.

```tsx
<DialogContent size="lg" scroll="content">
  <DialogHeader>
    <DialogTitle>Care plan</DialogTitle>
    <DialogDescription>Review the details before saving.</DialogDescription>
  </DialogHeader>
  <DialogBody>...</DialogBody>
  <DialogFooter>...</DialogFooter>
</DialogContent>
```

`AlertDialogContent` and `SheetContent` use the same approved size names where practical. `SheetContent` still owns `side` placement; combine it with `size` instead of local width classes.

Do not build page-local overlays with `fixed inset-0`, `role="dialog"`, or `aria-modal` when a shared overlay primitive fits. Do not set manual z-index values or recreate overlay chrome with feature-level `bg-*`, `rounded-*`, `max-h-*`, `overflow-*`, `p-0`, or custom close-button placement; the primitive owns portal, overlay, content, escape-key, outside-click, focus-trap, and focus-return behavior.

### Data Display And Feedback

Use shared primitives and composites for repeated data, empty, loading, and status states.

```tsx
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Pagination,
  Progress,
  Separator,
  Skeleton,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/primitives';
import { EmptyState, SkeletonCard, SkeletonText } from '@/shared/ui/composites';
```

Use `Table` for semantic tabular data and `Pagination` for page navigation. Use `Alert` for repeated inline feedback; use form-level status composites for form submission messages. Use `Separator` for structural division, `Spinner` for compact pending work, `Skeleton` or loading composites when the final shape is known, and `EmptyState` for empty collections. If the upstream `Empty` primitive is added later, keep any project wrapper domain-neutral and exported from shared UI.

Use `Avatar` for repeated person/provider imagery, `Progress` only for real determinate progress or explicit pending-work meters, and `Badge` only for metadata, selected state, or status.

### Responsive Layout

Use layout composites when page structure matches the documented conventions.

```tsx
import { PageContainer, PageSection, PageStack, ResponsiveGrid } from '@/shared/ui/composites';

<PageContainer size="wide">
  <PageStack spacing="lg">
    <PageHeader title="Dashboard" />
    <PageSection>
      <ResponsiveGrid columns={4} gap="lg">
        {cards.map((card) => (
          <SectionCard key={card.id} title={card.title}>
            {card.content}
          </SectionCard>
        ))}
      </ResponsiveGrid>
    </PageSection>
  </PageStack>
</PageContainer>
```

## 21st-Dev-Magic Guardrails

Use 21st-dev-magic selectively after the shadcn foundation is in place. Treat generated output as source material, not as accepted project code.

Rules for adoption:

- Prefer inspiration and selective extraction over raw copy-in.
- Normalize imports to `@/shared/ui/primitives`, `@/shared/ui/composites`, and feature-owned modules.
- Replace raw palette classes with semantic token classes.
- Replace unsupported primitives, icons, and helpers with approved shadcn/Radix primitives, Lucide icons, and shared helpers.
- Do not adopt Base UI.
- Do not use 21st-dev-magic as the source for low-level primitives.
- Put accepted domain-neutral composites under `src/shared/ui/composites` and business-specific UI under the owning `src/features/*` slice.
- Verify type-check, lint, and build impact after each adopted composite slice.

## Responsive Layout Conventions

Use a small set of repeatable layout patterns instead of ad hoc wrappers.

Container widths:

| Pattern | Composite | Use for |
| --- | --- | --- |
| Narrow | `PageContainer size="narrow"` | Auth forms, single-column profile forms, focused settings |
| Standard | `PageContainer size="standard"` | Default content pages and simple lists |
| Wide | `PageContainer size="wide"` | Dashboards, provider management screens, multi-card data layouts |
| Full | `PageContainer size="full"` | Maps, live tracking, large tables, route-specific immersive surfaces |

Section rhythm:

- Start route pages with a `PageHeader` when the page has a title, subtitle, badge, or actions.
- Use `PageStack spacing="md"` for normal pages and `spacing="lg"` for dashboard-level separation.
- Use `PageSection spacing="md"` for titled sections and dense data panels.
- Prefer `SectionCard` for grouped content instead of repeating card header/content markup.

Grid conventions:

- Mobile starts as one column unless the content is naturally paired and still readable.
- `ResponsiveGrid columns={2}` fits paired settings or summary cards.
- `columns={3}` fits standard card collections.
- `columns={4}` fits dashboard metrics and short summaries.
- Use horizontal overflow intentionally for data tables; do not allow accidental page-level horizontal scrolling.

Touch targets:

- Buttons, tabs, selects, date controls, booking actions, and mobile action buttons should stay near or above a 40px interactive height.
- Icon-only controls must keep accessible names and visible focus states.
- Avoid dense click targets in senior-facing patient flows.

Sticky and fixed safe areas:

- Fixed action bars, chat inputs, bottom navigation, booking summaries, and assistant controls must account for `env(safe-area-inset-bottom)` when they sit at the viewport edge.
- Keep sticky regions on semantic surfaces such as `bg-background`, `bg-card`, or `bg-popover` with `border-border` separators.
- Avoid stacking fixed controls over mobile bottom navigation or messaging inputs.

## Global Base Styles And Utilities

`src/styles/theme-base.css` owns only global behavior that backs multiple surfaces:

- base `html`, `body`, and global border styling
- the `loading-progress-indeterminate` keyframe used by shell loading indicators
- scrollbar styling and utilities such as `scrollbar-hide` and `custom-scrollbar`
- skeleton utilities such as `sk-base` and `sk-card`
- the loading progress utility used by app-shell and startup screens

Do not add decorative keyframes, glow utilities, gradients, or brand-specific base styles without a separate approved design spec.

## Review Rules

Use these rules for new styling work and code review:

- Shared UI uses semantic token classes and token-backed utilities.
- New reusable low-level UI belongs in `src/shared/ui/primitives`.
- New reusable domain-neutral assemblies belong in `src/shared/ui/composites`.
- Feature-specific visual logic stays inside the owning `src/features/*` slice.
- Route pages compose shared layout patterns and feature components; they should not define reusable design-system rules.
- Raw palette classes in shared UI require correction or an explicit documented exception.
- Repeated feature/page raw palette classes should become semantic token usage, a shared variant, or a shared composite.
- Status colors must map to state, not service category or provider identity.
- Keep focus, disabled, invalid, selected, loading, warning, success, and destructive states visible in light and dark themes.
- Do not reintroduce new shared UI under legacy `src/components`.

## Related References

- [ADR-001 — UI Foundation](./adr/ADR-001-ui-foundation.md)
- [ADR-002 — Semantic Theme Tokens](./adr/ADR-002-semantic-theme-tokens.md)
- [Frontend Contribution Guide](./governance/frontend-contribution-guide.md)

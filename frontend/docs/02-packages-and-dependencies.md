# 02 — Packages and Dependencies

This page tracks the packages and repo tooling that currently define the frontend architecture. It focuses on the active Block 12 stack rather than every transitive dependency.

## Core Application Stack

| Package(s) | Current role | Primary locations |
| --- | --- | --- |
| `react`, `react-dom` | SPA runtime and rendering | `src/App.tsx`, `src/app/**`, `src/pages/**` |
| `react-router-dom` | Data router, guards, route fallbacks, and route error elements | `src/app/router/**`, `src/App.tsx` |
| `@tanstack/react-query` | Server-state caching, query orchestration, and mutation invalidation | `src/shared/lib/query/client.ts`, `src/features/**/options.ts`, `src/features/**/hooks/**`, `src/features/**/hooks.ts` |
| `axios` | Shared HTTP client with auth, refresh, retry, normalization, and diagnostics hooks | `src/api/client.ts`, `src/shared/lib/http/auth-session.ts` |
| `zod` | Runtime schema validation for API envelopes and feature DTOs | `src/shared/schemas/api.schema.ts`, `src/features/**/schema.ts` |
| `react-error-boundary` | App-level crash containment | `src/app/providers/AppProviders.tsx`, `src/app/errors/ErrorFallback.tsx` |
| `react-hook-form`, `@hookform/resolvers` | Form state and schema-backed validation | `src/features/auth/**`, `src/features/patient/profile/**`, `src/features/providers/profile/**`, `src/features/equipment/**` |

## UI Foundation

| Package(s) | Current role | Primary locations |
| --- | --- | --- |
| `tailwindcss`, `@tailwindcss/vite` | Tailwind v4 CSS-first styling pipeline | `vite.config.ts`, `src/index.css`, `src/styles/theme-tokens.css`, `src/styles/theme-base.css` |
| `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-slot`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip` | Accessibility-sensitive primitives used by shared UI | `src/shared/ui/primitives/*.tsx` |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Variant definitions and class merging for shadcn-aligned primitives | `src/shared/ui/primitives/button.tsx`, `src/shared/ui/primitives/badge.tsx`, `src/shared/lib/utils.ts` |
| `lucide-react` | Shared icon set | `src/app/**`, `src/shared/ui/**`, `src/features/**` |
| `sonner` | App-wide toast container and toast helpers | `src/app/providers/AppToaster.tsx`, `src/shared/lib/notifications/toast.ts`, `src/shared/ui/primitives/toast.ts` |

The shared UI source of truth is:

- `src/shared/ui/primitives/*` for low-level building blocks
- `src/shared/ui/composites/*` for domain-neutral shared patterns
- `components.json` for shadcn generator metadata and shared aliases
- [ADR-001 — UI Foundation](./adr/ADR-001-ui-foundation.md) for the architectural decision

## Feature Integrations

| Package | Current role | Primary locations |
| --- | --- | --- |
| `framer-motion` | Animated shell and feature interactions | `src/app/shell/**`, `src/features/**` |
| `leaflet` | Maps, live tracking, and address selection | `src/integrations/maps/**` |
| `jspdf` | Client-side PDF and report export | `src/integrations/billing/pdf.ts` |

These heavier domains are intentionally visible to the performance tooling described below.

## Development, Testing, and Quality

| Package(s) | Current role | Primary locations |
| --- | --- | --- |
| `vite`, `@vitejs/plugin-react` | Dev server, build pipeline, and manifest generation | `vite.config.ts` |
| `typescript` | Strict type checking | `tsconfig.json` |
| `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-no-relative-import-paths`, `eslint-config-prettier` | Linting and import-boundary enforcement | `eslint.config.js` |
| `prettier`, `husky`, `lint-staged` | Formatting and pre-commit automation | `package.json` |
| `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom` | Unit and component test stack | `vite.config.ts`, `src/test/setup.ts` |
| `msw` | Browser-level mock API interception when mock mode is enabled in development | `src/shared/lib/dev/msw.ts`, `src/mocks/**` |
| `@tanstack/react-query-devtools` | Lazy dev-only query inspector | `src/app/providers/AppProviders.tsx` |

## Runtime Diagnostics

Runtime diagnostics are part of the active frontend platform even though they are not an npm package dependency.

- Collector and public surface: `src/shared/lib/monitoring/`
- Bootstrap initialization: `src/app/bootstrap/runtime.ts`
- Route context updates: `src/app/layouts/RootLayout.tsx`
- Error boundary and route error references: `src/app/errors/ErrorFallback.tsx`, `src/app/router/error-elements.tsx`
- Detailed reference: [12 — Runtime Diagnostics](./12-runtime-diagnostics.md)

## Performance Reporting and Budgets

Bundle governance is script-driven rather than embedded in Vite plugins.

- `npm run build` executes `vite build --manifest`
- `npm run build:report` executes `node ./scripts/performance-report.mjs`
- `npm run build:budget` executes `node ./scripts/performance-report.mjs --budget`
- The report script reads `dist/.vite/manifest.json` and `performance-budgets.json`
- It writes `dist/reports/performance-report.json` and `dist/reports/performance-report.txt`
- Current budgets cover the shared shell, heavy route entry deltas, and optional feature domains such as `assistant-tools`, `mapping-stack`, and `report-export-stack`

## Related References

- [03 — Data Layer](./03-data-layer.md)
- [07 — Styling and Theming](./07-styling-and-theming.md)
- [08 — Internationalization](./08-i18n.md)
- [11 — Axios](./11-axios.md)
- [ADR-001 — UI Foundation](./adr/ADR-001-ui-foundation.md)

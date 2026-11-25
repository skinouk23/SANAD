# Care@Home Tunisia Frontend

Care@Home Tunisia (Sanad) is the frontend single-page application for the public, patient, provider, service-discovery, and messaging surfaces in this workspace. This repository is the frontend only; the backend lives in the sibling `Sanad CareAtHome Backend/` project.

The current stack is React 18, TypeScript, Vite, Tailwind CSS v4, React Router data routing, TanStack React Query, Zod, Axios, MSW, and Vitest.

## Current Architecture Snapshot

- The runtime boot flow starts in `src/index.tsx`, calls `initializeRuntime()` from `src/app/bootstrap/runtime.ts`, and only then mounts React.
- App-wide providers are composed in `src/app/providers/AppProviders.tsx`.
- The single browser router is owned by `src/app/router/`, not by the legacy `src/routes/` directory.
- Theme and language source-of-truth modules live in `src/shared/lib/theme/` and `src/shared/lib/i18n/`.
- `src/contexts/ThemeContext.tsx` and `src/contexts/LanguageContext.tsx` are compatibility re-exports; `src/contexts/AuthContext.tsx` remains the real auth store.
- `admin` and `super_admin` roles are still parsed from backend auth responses, but this SPA rejects those accounts instead of mounting an admin portal.
- Runtime diagnostics live in `src/shared/lib/monitoring/` and capture bootstrap, router, React boundary, API, and schema failures with local reference IDs.
- MSW is available for local development, but it is opt-in via `VITE_ENABLE_MOCK_DATA=true`. Real backend mode is the default.

## Getting Started

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Set `VITE_ENABLE_MOCK_DATA=false` for real backend mode or `VITE_ENABLE_MOCK_DATA=true` for mock development mode.
4. Start the app with `npm run dev`.

`src/app/bootstrap/runtime.ts` validates env configuration before render, initializes diagnostics, and only starts the mock worker when development mode and the mock flag are both enabled. The Vite dev server also proxies `/api` to `http://localhost:5000`.

## CSP Ownership

`vite.config.ts` injects a `<meta http-equiv="Content-Security-Policy">` tag so the SPA still ships useful browser-enforced resource restrictions for `default-src`, `script-src`, `style-src`, `font-src`, `img-src`, `connect-src`, `base-uri`, and `form-action`.

`frame-ancestors` is intentionally not included in that meta-generated CSP. Browsers only enforce `frame-ancestors` when it is delivered as an HTTP response header, so clickjacking protection is deployment-owned until this repo also owns production hosting configuration.

Production deployments must send a real `Content-Security-Policy` header at the reverse proxy, CDN, or app server and include `frame-ancestors 'none'` or the approved framing allowlist there.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build with a manifest |
| `npm run build:report` | Build and write bundle reports to `dist/reports/` |
| `npm run build:budget` | Run the bundle report and fail if `performance-budgets.json` is exceeded |
| `npm run preview` | Serve the built app locally |
| `npm run test` | Run Vitest in jsdom |
| `npm run type-check` | Run `tsc --noEmit` |
| `npm run lint` | Run ESLint |
| `npm run ci:verify` | Run lint, type-check, and build in sequence |
| `npm run format` | Format the repo with Prettier |
| `npm run format:check` | Check formatting with Prettier |

## Architecture Map

| Path | Responsibility |
| --- | --- |
| `src/app/bootstrap/` | Runtime initialization before React renders |
| `src/app/providers/` | Error boundary, global providers, toaster, and dev-only React Query Devtools |
| `src/app/router/` | Browser router, route groups, guards, fallback element, and route error pages |
| `src/app/layouts/` | Root and cyber layout shells |
| `src/app/shell/` | Cross-route shell UI such as startup loaders, bottom nav, assistants, and consent banner |
| `src/features/` | Domain-owned services, schemas, query options, hooks, and feature UI |
| `src/pages/` | Lazy-loaded route entry modules and page composition |
| `src/shared/lib/` | Shared platform modules such as query client, theme, i18n, monitoring, HTTP session helpers, and dev utilities |
| `src/shared/ui/` | Shared primitives and composites |
| `src/contexts/` | `AuthContext` and compatibility re-export barrels for theme and language |
| `src/mocks/` | MSW worker and handler aggregation |
| `src/integrations/` | Third-party boundaries such as maps and export helpers |
| `src/styles/` | Theme tokens and shared global styling |
| `scripts/performance-report.mjs` | Bundle analysis and reporting |
| `performance-budgets.json` | Performance budget thresholds enforced by `npm run build:budget` |

`src/components/` still exists as a legacy shared area. New cross-domain UI should go to `src/shared/ui/`.

## Documentation

Current architecture references:

- [01 — Project Overview](./docs/01-project-overview.md)
- [05 — Routing and Pages](./docs/05-routing-and-pages.md)
- [06 — State Management](./docs/06-state-management.md)
- [ADR Index](./docs/adr/README.md)
- [Frontend Contribution Guide](./docs/governance/frontend-contribution-guide.md)

ADR set:

- [ADR-001: UI Foundation](./docs/adr/ADR-001-ui-foundation.md)
- [ADR-002: Semantic Theme Tokens](./docs/adr/ADR-002-semantic-theme-tokens.md)
- [ADR-003: State Ownership](./docs/adr/ADR-003-state-ownership.md)
- [ADR-004: Router and Module Boundaries](./docs/adr/ADR-004-router-and-module-boundaries.md)
- [ADR-005: Loading and Skeleton Policy](./docs/adr/ADR-005-loading-and-skeleton-policy.md)
- [ADR-006: Auth and Session Handling](./docs/adr/ADR-006-auth-and-session-handling.md)

Additional reference material lives under [`docs/`](./docs/).

# Frontend project review — scalability, maintainability, robustness, conformity, and structure

_Date:_ 2026-04-24  
_Project:_ Care@Home Tunisia frontend SPA

## Scope reviewed

- Root frontend configuration: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
- Runtime/bootstrap: `src/app/bootstrap`, `src/config`, `src/api`
- Routing/layout/shell: `src/app/router`, `src/app/layouts`, `src/app/shell`
- Domain code: `src/features/**`, `src/pages/**`, `src/shared/**`, `src/contexts/**`, `src/mocks/**`, `src/i18n/**`, `src/styles/**`

## Validation snapshot

These checks were run during the review and passed:

- `npm run lint`
- `npm run type-check`
- `npm run build:budget`

That means the project is currently **green from the tooling point of view**, so most of the review items below are about **architecture, long-term maintainability, robustness, and conformity**, not immediate CI failures.

## Scoring model

The score below is an **improvement priority score** from 0-100.

- **90-100**: high-priority correctness or architectural risk
- **80-89**: important structural/robustness issue
- **70-79**: meaningful improvement with medium-high leverage
- **60-69**: moderate issue worth fixing during refactors
- **51-59**: lower-priority but still above the reporting threshold you requested

Only findings with a score **above 50** are included.

## Strong foundations to preserve

- Runtime bootstrap is disciplined: env validation happens before render and mock mode is explicitly gated.
- Query/API infrastructure is centralized and stronger than average: shared client, request tracing, refresh coordination, diagnostics.
- A good portion of the page layer already follows the desired thin-wrapper pattern.
- Build-budget reporting is in place and currently passing.
- Theme/i18n foundations already exist in the right direction (`src/shared/lib/*`, theme tokens, lazy locale loading).

---

## Critical (90-100)

### [91] Assistant route and auth actions are out of sync with the real router/session model
- **Areas:** correctness, UX robustness
- **Files:**
  - `src/app/shell/ChatbotAssistant.tsx`
  - `src/app/shell/VoiceAssistant.tsx`
  - `src/app/router/routes/patientRoutes.tsx`
- **Evidence:**
  - Both assistants navigate to `/ambulance/booking`.
  - The router defines `ambulance/booking/:providerId`.
  - In `ChatbotAssistant`, the logout action only does `navigate('/auth/login')`; it does not call `logout()` from auth state.
- **Why it matters:** assistant actions can send users to invalid routes and can leave stale authenticated state behind.
- **Recommendation:** move assistant actions to a typed route/action registry that uses real route builders and auth commands instead of hard-coded strings.

---

## Important (80-89)

### [88] `/admin` has no index route or redirect, but auth flows navigate to `/admin`
- **Areas:** routing, robustness
- **Files:**
  - `src/app/router/routes/adminRoutes.tsx`
  - `src/features/auth/screens/CyberLoginScreen.tsx`
  - `src/features/auth/screens/CyberSignUpProfessionalScreen.tsx`
  - `src/app/layouts/AdminLayout.tsx`
- **Evidence:**
  - `adminRoutes` defines children such as `dashboard`, `reports`, `fraud`, etc., but no `index` child and no redirect.
  - Login and professional signup navigate admins to `/admin`.
  - `AdminLayout` simply renders `<Outlet />`, so the route can land on an empty shell.
- **Why it matters:** first admin navigation is brittle and can produce a blank admin shell instead of a meaningful landing page.
- **Recommendation:** add an index child that redirects to `/admin/dashboard`, or navigate directly to `/admin/dashboard` from auth flows.

### [87] `src/app/shell/` is carrying feature-sized business modules instead of shell-only wiring
- **Areas:** project structure, maintainability, AGENTS.md conformity
- **Files:**
  - `src/app/shell/ChatbotAssistant.tsx`
  - `src/app/shell/VoiceAssistant.tsx`
- **Evidence:**
  - `ChatbotAssistant.tsx` is 1068 lines.
  - `VoiceAssistant.tsx` is 790 lines.
  - These files own business logic, intent parsing, emergency flows, route decisions, sub-service catalogs, and auth-adjacent behavior.
- **Why it matters:** AGENTS.md says `src/app/shell/` is for app shell only. These are effectively feature domains living in the shell layer.
- **Recommendation:** move assistant logic into `src/features/assistant` (or separate `chat-assistant` / `voice-assistant` domains) and keep `app/shell` as thin mounting/wiring only.

### [84] The “lazy” assistants are still rendered on every cyber route, so the chunks are not interaction-gated
- **Areas:** performance, scalability
- **Files:**
  - `src/app/layouts/CyberLayout.tsx`
  - `src/app/shell/ChatbotAssistant.tsx`
  - `src/app/shell/VoiceAssistant.tsx`
- **Evidence:**
  - `CyberLayout` unconditionally renders both `LazyChatbotAssistant` and `LazyVoiceAssistant`.
  - The comment says they are “not needed until user interacts with them,” but the layout mounts them immediately.
  - `build:budget` shows `assistant-tools: 46.4 KiB extra across 2 entries`.
- **Why it matters:** code-splitting exists, but those modules still load for every cyber page instead of only when needed.
- **Recommendation:** gate loading behind explicit user interaction, route metadata, or device capability checks.

### [83] Large admin route modules still own feature implementation instead of acting as thin page wrappers
- **Areas:** scalability, maintainability, project structure
- **Files:**
  - `src/pages/admin/AnalyticsDashboard.tsx` (593 lines)
  - `src/pages/admin/UserManagement.tsx` (648 lines)
  - `src/pages/admin/SupportTickets.tsx` (557 lines)
  - `src/pages/admin/ReportsPage.tsx` (627 lines)
  - `src/pages/admin/FraudDashboard.tsx` (1157 lines)
  - contrast: `src/pages/admin/ProviderBalanceManagement.tsx`, `src/pages/provider/CyberScheduleManagement.tsx`
- **Evidence:** newer pages are one-line wrappers that re-export feature screens, while several admin routes still contain full screen logic, helpers, and UI implementation directly in the route module.
- **Why it matters:** route-level files become long-lived monoliths and make refactoring, reuse, and ownership harder.
- **Recommendation:** migrate remaining admin screens into `src/features/admin/.../screens/*` and keep `src/pages/admin/*` as lazy route entries only.

### [82] Mock-only types leak into real runtime code
- **Areas:** architecture conformity, correctness
- **Files:**
  - `src/features/users/service.ts`
  - `src/pages/admin/UserManagement.tsx`
  - `src/data/mock/types.ts`
- **Evidence:** runtime-facing code imports `User`, `Patient`, and `Provider` types from `src/data/mock/types.ts`, which is explicitly a mock-only area.
- **Why it matters:** production code becomes coupled to the mock layer instead of using feature-owned or shared API schemas.
- **Recommendation:** replace mock-layer types with `src/features/*/schema.ts` or shared API DTO types, then confine `src/data/mock/*` to MSW and test-only paths.

### [82] Service listing pages duplicate the same provider-listing shell across nine routes
- **Areas:** scalability, maintainability
- **Files:**
  - `src/pages/services/CyberCareService.tsx`
  - `src/pages/services/CyberAmbulanceService.tsx`
  - `src/pages/services/CyberFuneralServices.tsx`
  - `src/pages/services/CyberLaboratory.tsx`
  - `src/pages/services/CyberNutritionProviders.tsx`
  - `src/pages/services/CyberPharmacy.tsx`
  - `src/pages/services/CyberRadiology.tsx`
  - `src/pages/services/CyberVeterinary.tsx`
  - `src/pages/services/Gym.tsx`
- **Evidence:** all nine pages prefetch `providerListOptions(...)`; all mount `ProviderContactModal`; the pages carry repeated listing/filter/presentation responsibilities.
- **Why it matters:** every UX change or bug fix across provider discovery risks becoming a 9-file patch set.
- **Recommendation:** extract a generic service-provider-listing screen/presenter and feed it service-specific config.

### [82] Default `API_BASE_URL` bypasses the Vite dev proxy and weakens dev/prod parity
- **Areas:** runtime conformity, robustness
- **Files:**
  - `src/config/env.ts`
  - `vite.config.ts`
- **Evidence:**
  - `vite.config.ts` proxies `/api` to `http://localhost:5000`.
  - `env.ts` defaults `API_BASE_URL` to `http://localhost:5000/api/v1`.
- **Why it matters:** the configured default skips the proxy path entirely, which undermines the intended same-origin dev behavior described in project guidance.
- **Recommendation:** prefer a relative default like `/api/v1` for local development, or make the base URL fully explicit via `.env` without a hard-coded absolute fallback.

### [81] `SupportTickets` mixes real API data with demo-only data and a non-functional reply composer
- **Areas:** correctness, maintainability
- **Files:**
  - `src/pages/admin/SupportTickets.tsx`
- **Evidence:**
  - Tickets/stats come from hooks.
  - The agent leaderboard is a local hard-coded array.
  - The reply input updates `replyText`, but the send/attachment buttons do not dispatch any mutation.
- **Why it matters:** the screen looks operational but is only partially real, which is risky in admin/support workflows.
- **Recommendation:** either finish the workflow end-to-end or clearly isolate the unfinished UI behind a feature flag / placeholder state.

### [80] `UserManagement` mixes live API data with random synthetic business metrics
- **Areas:** data correctness, admin trust
- **Files:**
  - `src/pages/admin/UserManagement.tsx`
- **Evidence:**
  - Users are fetched through `useAdminUsers(...)`.
  - The modal augments selected users with `Math.random()`-based `risk`, `bookings`, and `spent` values.
  - The page also imports `User` from the mock type layer.
- **Why it matters:** the same user can display different “business” values across interactions, which undermines admin trust.
- **Recommendation:** remove synthetic enrichment and only show fields backed by real data or explicit placeholders.

### [80] Feature public APIs are incomplete or ignored, so pages deep-import feature internals
- **Areas:** module boundaries, maintainability
- **Files:**
  - `src/pages/messaging/CyberMessages.tsx`
  - `src/pages/messaging/CyberMessageChat.tsx`
  - `src/pages/admin/SupportTickets.tsx`
  - `src/pages/admin/EquipmentManagement.tsx`
  - `src/pages/equipment/CyberEquipmentCatalog.tsx`
  - `src/features/messaging/index.ts`
  - `src/features/admin/index.ts`
  - `src/features/equipment/index.ts`
- **Evidence:** pages import from `@/features/messaging/display`, `@/features/messaging/schema`, `@/features/admin/schema`, and `@/features/equipment/schema`. Some barrels expose these APIs; others do not.
- **Why it matters:** pages become tightly coupled to feature internals, making future feature refactors noisy and risky.
- **Recommendation:** expose page-consumed types/helpers from feature public APIs and restrict pages to `@/features/<domain>` imports.

---

## Medium-high (70-79)

### [79] `ReportsPage` is still a stubbed admin screen with fake export/generation behavior
- **Areas:** correctness, maintainability
- **Files:**
  - `src/pages/admin/ReportsPage.tsx`
- **Evidence:**
  - Report data is hard-coded in local objects/arrays.
  - `handleExport()` only shows a toast.
  - `handleGenerateReport()` simulates work with `setTimeout` and success state.
- **Why it matters:** the page looks production-ready while key flows are simulated.
- **Recommendation:** either wire the screen to feature services or explicitly downgrade it to a placeholder/preview state.

### [78] `FraudDashboard` is still a large static demo page instead of a real feature screen
- **Areas:** correctness, maintainability
- **Files:**
  - `src/pages/admin/FraudDashboard.tsx`
- **Evidence:** the file contains page-local `stats`, `recentEvents`, and other mock datasets, and no real feature query/service wiring.
- **Why it matters:** a security-sensitive admin surface is currently built around static data and UI-only behavior.
- **Recommendation:** move the screen into a feature module and connect it to real API contracts before treating it as operational.

### [78] Large parts of admin/app/shared UI still hard-code French copy instead of using the i18n layer
- **Areas:** i18n completeness, maintainability
- **Files:**
  - `src/pages/admin/UserManagement.tsx`
  - `src/pages/admin/SupportTickets.tsx`
  - `src/pages/admin/ReportsPage.tsx`
  - `src/pages/admin/FraudDashboard.tsx`
  - `src/app/layouts/AdminLayout.tsx`
  - `src/app/router/error-elements.tsx`
  - `src/shared/ui/composites/theme-switcher.tsx`
- **Evidence:** only `EquipmentManagement.tsx` uses `useLanguage()` under `src/pages/admin`; multiple other pages/components embed French labels and sentences directly.
- **Why it matters:** the app has a real i18n foundation, but major surfaces bypass it, which limits actual multilingual support.
- **Recommendation:** migrate admin/app/shared copy to translation keys, starting with route chrome, headers, CTA text, and status labels.

### [77] `connect-src` in CSP is hard-coded while the backend origin is environment-configurable
- **Areas:** deployability, robustness, security configuration
- **Files:**
  - `index.html`
  - `src/config/env.ts`
- **Evidence:** `index.html` whitelists fixed API origins, while `env.ts` allows arbitrary `VITE_API_BASE_URL` values.
- **Why it matters:** the env can validate successfully, but the browser can still block requests when the deployment target uses a different origin.
- **Recommendation:** generate CSP from deployment config, serve it from the backend/reverse proxy, or at minimum align allowed `connect-src` values with the real environment model.

### [76] The legacy `@/contexts/LanguageContext` compatibility path is still widespread
- **Areas:** maintainability, architecture conformity
- **Files:**
  - `src/contexts/LanguageContext.tsx`
  - many consumers across `src/features`, `src/pages`, `src/app`
- **Evidence:** the compatibility file is only a re-export, but there are 68 imports from `@/contexts/LanguageContext` across the project.
- **Why it matters:** AGENTS.md says i18n ownership lives in `src/shared/lib/i18n`; keeping the legacy import path alive at scale blurs ownership and prolongs migration.
- **Recommendation:** codemod or systematically replace imports with `@/shared/lib/i18n/language-context` and reserve `src/contexts/LanguageContext.tsx` for temporary backwards compatibility only.

### [75] Audit logging bypasses the shared API client and its auth/diagnostics conventions
- **Areas:** robustness, consistency
- **Files:**
  - `src/utils/audit-logger.ts`
  - `src/api/client.ts`
- **Evidence:** normal API traffic goes through the shared Axios client with base URL, auth headers, request IDs, diagnostics, and retry/refresh logic. `auditLogger.flush()` uses raw `fetch('/api/audit/events', ...)`.
- **Why it matters:** audit delivery can diverge from the configured API base URL, shared auth/session behavior, and observability pipeline.
- **Recommendation:** send audit events through the shared client or introduce a shared low-level transport abstraction reused by both.

### [74] Locale-sensitive formatting is hard-coded to `fr-FR` in many places
- **Areas:** i18n correctness, UX consistency
- **Files:**
  - `src/pages/admin/UserManagement.tsx`
  - `src/pages/admin/SupportTickets.tsx`
  - `src/features/bookings/hooks/useBookingHelpers.ts`
  - `src/features/patient/appointments/patientAppointments.utils.ts`
  - `src/features/transactions/provider-balance/components/transactions-panel.tsx`
  - `src/features/transactions/provider-billing/providerBilling.hooks.ts`
  - others found by grep
- **Evidence:** multiple files call `toLocaleDateString('fr-FR')`, `toLocaleTimeString('fr-FR')`, or `toLocaleString('fr-FR')` directly.
- **Why it matters:** switching app language will not consistently switch date/time formatting behavior.
- **Recommendation:** centralize locale-aware date/number formatting behind i18n-aware helpers tied to the active language/country.

### [72] Saved language preference is applied after the first render instead of before bootstrap completes
- **Areas:** i18n UX, robustness
- **Files:**
  - `src/app/bootstrap/runtime.ts`
  - `src/shared/lib/i18n/language-context.tsx`
- **Evidence:** bootstrap always loads default translations first; `LanguageProvider` only checks `localStorage` in a client effect after mount.
- **Why it matters:** returning users can see a first-paint language flash before their saved preference is applied.
- **Recommendation:** read persisted language before calling `loadDefaultTranslations()` or pass the stored language into bootstrap as the initial locale.

### [71] Country metadata has duplicate and divergent sources of truth
- **Areas:** consistency, maintainability
- **Files:**
  - `src/contexts/AdminCountryContext.tsx`
  - `src/constants/countries.ts`
  - `src/app/layouts/admin/CountrySelector.tsx`
- **Evidence:** `AdminCountryContext` defines its own country list, while `constants/countries.ts` already provides a richer canonical map with locale, phone prefix, and region data. `CountrySelector` uses the context-local list.
- **Why it matters:** country support can drift between admin filters, locale formatting, and global configuration.
- **Recommendation:** collapse to one canonical country source and let admin state store only the selected code/value.

---

## Moderate (60-69)

### [68] Router error pages force full page reloads instead of using router-native recovery
- **Areas:** UX resilience, SPA behavior
- **Files:**
  - `src/app/router/error-elements.tsx`
- **Evidence:** the admin and cyber error pages recover using `window.location.href = ...`.
- **Why it matters:** full reloads discard in-memory state and bypass React Router’s normal navigation/recovery flow.
- **Recommendation:** use router navigation (`useNavigate`, `<Link>`, or reset/retry actions) rather than hard reloads.

### [66] Shared/app UI still uses raw palette classes instead of semantic theme tokens
- **Areas:** design-system conformity, maintainability
- **Files:**
  - `src/shared/ui/composites/theme-switcher.tsx`
  - `src/shared/ui/composites/language-selector.tsx`
  - `src/app/router/error-elements.tsx`
  - other shared/app surfaces using raw `slate-*`, `cyan-*`, `red-*`, `amber-*`
- **Evidence:** shared components directly encode concrete palette classes instead of using reusable semantic token classes.
- **Why it matters:** AGENTS.md asks for semantic theme tokens from `src/styles/`; raw palette coupling makes theme changes harder and less consistent.
- **Recommendation:** convert shared/app surfaces to semantic tokens/utilities first, then let page-level variants opt into specific accents only when necessary.

### [63] Some feature hook barrels still violate the `@/` alias rule with cross-directory relative imports
- **Areas:** conformity, import hygiene
- **Files:**
  - `src/features/rewards/hooks/index.ts`
  - `src/features/pharmacy/hooks/index.ts`
  - `src/features/nutrition/hooks/index.ts`
  - `src/features/marketing/hooks/index.ts`
  - `src/features/insurance/hooks/index.ts`
  - `src/features/laboratory/hooks/index.ts`
  - `src/features/family-circle/hooks/index.ts`
  - `src/features/care-plan/hooks/index.ts`
  - `src/features/analytics/hooks/index.ts`
- **Evidence:** grep found cross-directory imports such as `from '../schema'` and `from '../service'` in hook barrel files.
- **Why it matters:** AGENTS.md explicitly requires `@/` for cross-directory imports. Small exceptions make the rule harder to enforce consistently.
- **Recommendation:** standardize these barrels on `@/features/<domain>/...` imports and keep relative imports only within the same folder.

---

## Suggested order of remediation

1. **Fix correctness first**
   - Assistant route/auth mismatches
   - `/admin` landing path
   - Fake admin workflows that look live (`UserManagement`, `SupportTickets`, `ReportsPage`, `FraudDashboard`)

2. **Fix structural hotspots second**
   - Move assistants out of `app/shell`
   - Migrate big admin route files into feature screens
   - Consolidate duplicated service-listing pages
   - Remove mock-only type leakage

3. **Fix conformity/consistency third**
   - Replace `@/contexts/LanguageContext` imports
   - Complete feature public APIs and stop deep imports
   - Unify country metadata
   - Remove alias-rule violations

4. **Fix UX/platform polish fourth**
   - Make language selection first-paint correct
   - Centralize locale formatting
   - Replace raw palette classes in shared UI with semantic tokens
   - Align CSP and API base URL strategy
   - Route error recovery through the router instead of hard reloads

## Highest-value architectural themes

If you want maximum payoff with minimum churn, the biggest multipliers are:

1. **Finish the page-to-feature migration** for admin and assistant-heavy areas.
2. **Create one source of truth** for routes, locale formatting, and country metadata.
3. **Stop mixing demo/static data with live admin surfaces**.
4. **Tighten public feature APIs** so pages only depend on barrels, not feature internals.
5. **Complete the i18n migration** so language support applies to content _and_ formatting.

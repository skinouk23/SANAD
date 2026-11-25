# Changes review — future-proofing and best-practice assessment

_Date:_ 2026-04-24  
_Scope reviewed:_ current uncommitted frontend changes in the working tree

## What was reviewed

This review covered the current implementation wave across:

- runtime/network foundation changes
- assistant extraction and lazy-loading changes
- boundary/public-API cleanup
- i18n/bootstrap/country changes
- shared/app theme-token cleanup

## Verification snapshot

### Passing
- `npm run lint`
- `npm run type-check`
- `npm run build`
- `npm run build:budget`

### Failing
- `npm run test -- --run`
  - the suite currently fails immediately on the new i18n/provider contract
  - first reproduced failures include `src/contexts/AuthContext.test.tsx` and `src/app/router/guards/PatientProviderRoute.test.tsx`

---

## Critical

### [92] CSP is still delivered through a `<meta>` tag, so the clickjacking control is not actually enforced
- **Files:**
  - `vite.config.ts:43-53`
  - `vite.config.ts:68-83`
- **Why this matters:**
  - The refactor correctly centralized CSP generation, but it still injects CSP with `transformIndexHtml` as `<meta http-equiv="Content-Security-Policy">`.
  - Browsers do **not** enforce `frame-ancestors` from a meta-delivered CSP, so `frame-ancestors 'none'` is currently a false sense of protection.
  - This weakens the security posture of the new runtime/network foundation and is not future-proof for production hardening.
- **Best-practice direction:**
  - Move CSP delivery to real HTTP response headers at the reverse proxy/server level.
  - If a meta fallback is retained for local convenience, do not rely on unsupported directives there.
  - Keep the current Vite code only as a shared policy string builder if that still helps dev/prod parity.

---

## Important

### [89] The extracted assistant feature still hard-codes French behavior and does not honor the active locale
- **Files:**
  - `src/features/assistant/voice/VoiceAssistantPanel.tsx:257-265`
  - `src/features/assistant/voice/VoiceAssistantPanel.tsx:319-340`
  - `src/features/assistant/chatbot/ChatbotAssistantDialog.tsx:333-336`
  - `src/features/assistant/chatbot/ChatbotAssistantDialog.tsx:409-410`
  - `src/features/assistant/chatbot/ChatbotAssistantDialog.tsx:573-577`
  - `src/features/assistant/chatbot/ChatbotAssistantDialog.tsx:675-701`
  - `src/features/assistant/voice/VoiceAssistant.tsx:37-40`
  - `src/features/assistant/voice/VoiceAssistant.tsx:52-53`
- **AGENTS.md / architecture concern:**
  - AGENTS says `src/shared/lib/i18n/` is the source of truth for language state and `src/i18n/` owns translation assets.
  - The new assistant extraction still bypasses that contract in several places.
- **Evidence:**
  - `SpeechSynthesisUtterance.lang` is hard-coded to `fr-FR`.
  - speech-recognition fallback strings are inline French.
  - launcher labels, placeholders, payment labels, and flow prompts still contain inline French text instead of translation keys or locale configuration.
- **Why this matters:**
  - Locale switching will still leave visible assistant UI partially untranslated.
  - Speech recognition and speech synthesis quality will be wrong for non-French users.
  - This turns the assistant feature into a long-term localization outlier even though the rest of the app now has a centralized i18n path.
- **Best-practice direction:**
  - Read `currentLanguage.code` from the language context.
  - Map app languages to supported speech locales/voices through a dedicated assistant locale config.
  - Move all visible assistant copy, ARIA labels, placeholders, and quick-action labels into translation keys or per-locale assistant config modules.

### [86] The i18n migration left the test/support surface inconsistent, and the full test suite is now broken
- **Files:**
  - `src/app/router/guards/PatientProviderRoute.tsx:4-10`
  - `src/app/router/guards/PatientProviderRoute.test.tsx:17-21`
  - `src/shared/lib/i18n/language-context.tsx:39-99`
  - `src/app/bootstrap/runtime.ts:27-35`
- **Evidence:**
  - Runtime code now correctly imports `useLanguage` from `@/shared/lib/i18n/language-context`.
  - `PatientProviderRoute.test.tsx` still mocks `@/contexts/LanguageContext`, so it no longer intercepts the source-of-truth hook.
  - `npm run test -- --run` currently fails; reproduced first failures include `useLanguage must be used within a LanguageProvider`.
- **Why this matters:**
  - The implementation is not fully future-proof if the support surface collapses whenever i18n ownership changes.
  - Broken tests reduce confidence in further refactors, especially around router guards and provider composition.
  - The new `LanguageProvider` contract is now bootstrap-driven, but isolated mounts/tests do not yet have a first-class helper path to satisfy that contract consistently.
- **Best-practice direction:**
  - Introduce one canonical test/helper entrypoint for i18n state creation, based on the new bootstrap contract.
  - Update remaining tests and mocks to target `@/shared/lib/i18n/language-context`, not the compatibility shim.
  - Add a lightweight helper for non-runtime mounts/stories/tests so they can construct `initialI18nState` without duplicating bootstrap logic.

### [84] The assistant refactor still bypasses the app-to-feature boundary via dynamic import from `src/app/shell`
- **Files:**
  - `src/app/shell/AssistantDock.tsx:3-6`
  - `src/app/layouts/CyberLayout.tsx:5`
  - `src/app/layouts/CyberLayout.tsx:90`
- **AGENTS.md / ADR concern:**
  - `AGENTS.md` says `src/app/layouts/`, `src/app/shell/`, `src/app/providers/`, and `src/app/errors/` are app-shell only.
  - `ADR-004` says non-router `src/app` code must not import `pages` or `features`.
- **Evidence:**
  - `src/app/shell/AssistantDock.tsx` performs `import('@/features/assistant')` directly.
  - This avoids the static lint rule, but it still leaves the app shell reaching into a feature package.
- **Why this matters:**
  - The architecture rule is now being bypassed by implementation technique instead of actually being satisfied.
  - Future contributors can copy this pattern and silently erode the layer boundaries while lint remains green.
  - That makes the architecture less enforceable over time, which is the opposite of future-proofing.
- **Best-practice direction:**
  - Redesign the seam so the shell mounts a shell/shared-owned primitive and receives feature-owned behavior through an explicit boundary.
  - Good options are:
    - a page/route-composition-owned mount point that injects the assistant feature
    - or a shared shell primitive that accepts feature-provided controllers/config rather than importing the feature itself
  - Avoid letting `src/app/*` import feature code, even through `import()`.

### [82] `AdminCountryContext` still stores a reduced snapshot object instead of a selected code, which reintroduces a second country model
- **Files:**
  - `src/contexts/AdminCountryContext.tsx:4-17`
  - `src/contexts/AdminCountryContext.tsx:19-31`
  - `src/contexts/AdminCountryContext.tsx:40-57`
  - `src/app/layouts/admin/CountrySelector.tsx:3-20`
- **Why this matters:**
  - The refactor correctly derives the admin country list from the canonical registry, but the context still defines its own reduced `Country` interface and stores the full selected object in state.
  - That means the selected value is now a snapshot copy of canonical data rather than a canonical reference.
  - If the registry grows additional fields or if labels/currency/locale metadata evolve, the context shape will need another refactor instead of naturally inheriting the source of truth.
- **Best-practice direction:**
  - Store only `selectedCountryCode` in context.
  - Derive `selectedCountry` from the canonical registry on read.
  - Reuse the shared country type or an explicit derived admin type instead of redefining a parallel `Country` interface in the context layer.

---

## Summary

The change set moves the codebase forward overall: runtime bootstrap is cleaner, assistant loading is lighter, i18n ownership is more coherent, and feature/page boundaries improved. The remaining gaps are mostly about **making the new architecture enforceable and complete**: real CSP headers, fully localized assistants, a repaired i18n test/support surface, eliminating the hidden `app -> feature` import seam, and finishing the country source-of-truth cleanup at the state layer.

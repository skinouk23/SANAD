# Phase 6 Notes

## Phase 6A Landing Page Visual Parity

Phase 6A updates only `src/pages/landing/LandingPage.tsx` to restore the legacy cyber landing visuals from `legacy-frontend/src/pages/CyberLandingPage.tsx` while preserving current routes, translation keys, data flow, shell ownership, and shared component boundaries.

The landing hero and final CTA now use the legacy animated conic-border wrappers, rounded glass inner panels, cyan-to-blue primary actions, hover glow, hover scale, and CTA icon motion. The hero trust badge, title gradient, service cards, trust indicator cards, process markers, connector line, and stats panel now match the legacy cyan/glass/gradient treatment with page-local raw gradient classes where required for parity.

Compliance badges keep the existing placement below the hero at `mb-6 scale-90 origin-top`. No service modules, auth pages, shell, routes, backend, translations, data loading, tests, or other pages were changed for this batch.

Phase 6A verification-command output and Playwright evidence capture were skipped per user instruction. Going forward, skip both the verification-command phase and Playwright evidence capture unless the user explicitly requests those steps again.

## Phase 6B Services Page Visual Parity

Phase 6B updates only `src/pages/services/ServiceSelectionPage.tsx` to restore the legacy cyber `/services` treatment from `legacy-frontend/src/pages/CyberServiceSelection.tsx` while preserving the current backend-driven category groups, route mapping through `getCategoryRoute`, shell ownership, auth behavior, translations, and data fetching.

The page header now matches the legacy centered cyan eyebrow, bold title, and muted subtitle. Filter pills use the legacy cyan-to-blue active gradient with white text and shadow, while inactive filters use glass card surfaces, token-like borders, muted text, and cyan/foreground hover states.

Service cards now use the legacy rounded glass card structure with relative hover overlays, dark/light translucent surfaces, cyan hover borders, cyan title hover, cyan price text, and translating cyan arrows. Icon tiles use inline CSS `linear-gradient(135deg, stop1, stop2)` backgrounds derived from `category.color`; hover overlays use the same parsed gradient. Badge text remains backend-provided and renders as the legacy cyan chip treatment.

Backend `category.color` is treated as the source of truth and is expected to arrive as comma-separated hex colors, for example `#06b6d4,#3b82f6`, not Tailwind gradient classes. The frontend parses only safe `#rgb` or `#rrggbb` stops and falls back to `#06b6d4,#3b82f6` when the value is missing or invalid, avoiding unsafe arbitrary dynamic Tailwind classes.

The loading state now uses a centered primary/cyan `Spinner` to match the legacy `Loader2` treatment. The empty state continues to use the shared cyber-styled `EmptyState`. The footer support link uses the legacy cyan underline and hover treatment while preserving the current `mailto:support@sanad.tn` destination.

Phase 6B verification-command output and Playwright evidence capture were skipped per user instruction.

## Phase 6C How It Works Page Visual Parity

Phase 6C updates only `src/pages/landing/HowItWorksPage.tsx` to restore the legacy cyber `/how-it-works` visuals from `legacy-frontend/src/pages/CyberHowItWorks.tsx` while preserving the current route target, translation usage, static copy, shell ownership, backend boundaries, and business behavior.

The page hero and section headers now match the legacy centered cyan eyebrow, bold slate/white title treatment, and muted slate subtitles. Patient flow cards restore the cyan/blue/purple connector line, glass card surfaces, per-step gradient icon circles, and cyan-to-blue numbered badges.

The payment/subscription area restores the three legacy plan treatments: slate commission, blue highlighted standard with popular badge, and amber elite with decorative glow. The payment flow card now uses the legacy glass surface, cyan wallet accent, amber section badge, gradient numbered circles, and colored amount chips.

Benefits and provider flow cards restore the legacy glass surfaces, cyan hover borders, and gradient icon tiles. The final CTA restores the animated conic border wrapper, glass inner panel, cyan-to-blue gradient button, hover glow, and hover scale while preserving navigation to `/services`.

Phase 6C verification-command output and Playwright evidence capture were skipped per user instruction.

## Phase 6D Subscriptions Page Visual Parity

Phase 6D updates only `src/pages/services/SubscriptionsPage.tsx` to restore the legacy cyber `/subscriptions` visuals from `legacy-frontend/src/pages/CyberSubscriptions.tsx` while preserving the current patient/professional plan arrays, user-type state behavior, shell-owned back navigation, translation usage where already available, routes, auth flow, backend boundaries, and business behavior.

The subscriptions header now uses the legacy centered cyan eyebrow, large slate/white title, muted subtitle, compliance badge placement, and rounded glass user-type toggle. The active patient toggle uses the cyan-to-blue gradient, while the active professional toggle uses the blue-to-purple gradient.

The benefits banner now restores the legacy glass rounded panel and cyan, purple, and blue gradient icon tiles. Pricing cards now use the legacy glass surfaces, plan-specific gradient icon tiles, cyan popular border/glow/overlay, uppercase cyan-to-blue `POPULAIRE` badge, cyan feature check states, muted excluded states, and legacy CTA treatments using gradient emphasis for popular plans and slate muted buttons for non-popular plans.

The FAQ cards now use glass surfaces with cyan hover borders and the legacy `Questions Fréquentes` heading. The custom plan CTA restores the gradient glow background, glass panel, cyan sparkle icon, and cyan-to-blue gradient button while keeping the current available translation text. The security footer uses cyan icons with muted text.

Phase 6D verification-command output and Playwright evidence capture were skipped per user instruction.

## Phase 6E Auth Onboarding Visual Parity

Phase 6E updates only `src/features/auth/screens/OnboardingScreen.tsx` and `src/features/auth/screens/onboarding/AuthOnboardingCard.tsx` to restore the legacy cyber `/auth/onboarding` visual treatment from `legacy-frontend/src/pages/auth/CyberOnboarding.tsx` while preserving the current `getOnboardingOptions` option list, titles, descriptions, features, signup routes, `AuthShell`, theme/language controls, routes, auth behavior, translations, backend boundaries, and other auth flows.

The onboarding header now restores the legacy Sanad cyan-to-blue gradient logo tile with pulsing glow, cyan uppercase eyebrow, bold slate/white title, and muted subtitle. The profile grid now sits inside the legacy animated conic-border wrapper with a rounded translucent white/dark inner panel.

Profile cards now use a static gradient metadata map keyed by the current option ids. Legacy gradients are retained for patient, professional, equipment, laboratory, radiology, and gym, with legacy-style additions for pharmacy, funeral, and veterinary. Each card restores the hover gradient glow, glass surface, top gradient accent line, gradient icon tile, cyan title hover, gradient feature dots, and translating continue arrow while preserving the existing option content and `signUpPath` values.

The login link and security footer now match the legacy muted text, cyan underline/link treatment, and cyan icon accents. Phase 6E verification-command output and Playwright evidence capture were skipped per user instruction.

## Phase 6F Login Page Visual Parity

Phase 6F updates only the `/auth/login` visual components in `src/features/auth/screens/LoginScreen.tsx`, `src/features/auth/screens/login/LoginSelectionStep.tsx`, and `src/features/auth/screens/login/LoginFormStep.tsx` to restore the legacy cyber login treatment from `legacy-frontend/src/pages/auth/CyberLogin.tsx` while preserving the current `AuthShell`/`AuthPanel` wrapper, real auth flow, React Hook Form and Zod validation, rate limiting, auth context login call, `returnTo` behavior, forgot-password dialog behavior, provider service options, and disabled OAuth state.

The login header now restores the legacy Sanad gradient logo tile with pulsing glow, slate/white title color, muted subtitle color, cyan back/change link, cyan signup link, and cyan security accent. The selection step now restores the legacy patient glass card with cyan icon gradient, hover overlay, cyan hover border, bold title, muted description, and translating arrow. The professional panel now uses the legacy glass surface, blue-purple icon tile, and specialty grid tiles with hover gradient overlays, cyan hover borders, emoji scale, and light/dark text transitions.

The login form now restores the legacy selected-account/service summary cards with cyan glass borders and gradient icon tiles. Form labels use the legacy uppercase cyan tracking treatment through local `AuthInputField` classes. The submit button now uses the legacy cyan-to-blue gradient CTA with hover glow and scale while keeping the current submit handler and loading state. The divider uses the existing localized `t.auth.orContinueWith` label, and Google/Facebook buttons keep the current disabled OAuth behavior plus the explanatory note.

`ForgotPasswordDialog` was intentionally left unchanged in this batch because its shared dialog primitives and current reset behavior are safe to handle in a separate overlay-specific visual parity slice. Phase 6F verification-command output and Playwright evidence capture were skipped per user instruction.

## Phase 6G AuthPanel Global Conic Border

By user decision, the legacy animated conic-border wrapper was added globally to `AuthPanel` in `src/features/auth/components/AuthShell.tsx`, so all current auth panel usages receive the legacy rounded animated cyan border rather than only `/auth/login`. The public `AuthPanel` API remains unchanged: `className` still applies to the outer wrapper, `contentClassName` still applies to the inner translucent card, and existing children/content behavior is preserved.

Phase 6G verification-command output and Playwright evidence capture were skipped per user instruction.

## Phase 6H Signup Page Visual Parity

Phase 6H updates only `src/features/auth/screens/SignUpScreen.tsx` to restore the legacy cyber `/auth/signup` visual treatment from `legacy-frontend/src/pages/auth/CyberSignUp.tsx` while preserving the current real registration behavior, React Hook Form and Zod validation, field set, submit payload, consent grants, auth context registration call, and post-submit navigation.

The signup header now uses the legacy patient/professional gradient icon tile with pulsing glow, cyan uppercase registration eyebrow, slate/white title, and muted subtitle. The form controls now pass local legacy-style cyan uppercase label classes and rounded light/dark input surface classes through the supported `AuthInputField` and `AuthSelectField` props without changing their register/controller behavior.

The terms checkbox uses the available checkbox class hooks for the compact muted label treatment, with cyan underlined terms and privacy links. The submit button now uses the legacy patient cyan-blue or professional blue-purple gradient CTA with hover glow and scale while preserving `Button`, disabled state, loading state, and submit handler. The login link and secure-registration footer now match the legacy cyan accent and muted text treatment.

Phase 6H verification-command output and Playwright evidence capture were skipped per user instruction.

Manual filled input state matched the shared InputGroup shell, but browser autofill could still paint the raw grouped input area differently from icons and addons. The input-group autofill override now keeps grouped controls transparent while preserving foreground text and caret color.

## Phase 6I Professional Signup Visual Parity

Phase 6I updates only the `/auth/signup/professional` visual layer in `src/features/auth/screens/ProfessionalSignUpScreen.tsx` and `src/features/auth/screens/professional-signup/ProfessionalSignUpSections.tsx` while preserving the current real registration behavior, React Hook Form state, Zod validation, field arrays, upload handlers, provider service selection, nutrition subtype behavior, plan selection, submit payload, auth context registration call, and post-submit route.

The professional signup header now uses the legacy-style blue-to-purple Briefcase icon tile with pulsing glow, cyan registration eyebrow, slate/white title, muted subtitle, cyan back link, and cyan secure-registration footer. The stepper now uses compact cyan/blue gradient active circles and connectors with muted inactive states.

Account fields pass local legacy label and input surface classes through the supported `AuthInputField` and `AuthSelectField` props. Service cards now use glass surfaces, cyan hover borders, selected gradient/cyan treatment, and emoji hover scale. Document sections use cyan glass panels, dashed cyan upload triggers, and emerald uploaded states while preserving the file inputs and field-array mutations. Subscription cards now use legacy glass/gradient selected treatments, cyan popular badge styling, gradient selected CTA bars, and muted inactive states. Navigation buttons use gradient primary treatments and glass outline previous actions where present.

Phase 6I verification-command output and Playwright evidence capture were skipped per user instruction.

## Phase 6J Specialized Signup Visual Parity

Phase 6J updates only the specialized signup shared components used by `/auth/signup/equipment`, `/auth/signup/laboratory`, `/auth/signup/radiology`, `/auth/signup/pharmacy`, `/auth/signup/funeral`, `/auth/signup/veterinary`, and `/auth/signup/gym`: `src/features/auth/components/specialized-signup/SpecializedProviderAccountSignUpPage.tsx`, `src/features/auth/components/specialized-signup/SpecializedReviewRequestPage.tsx`, and `src/features/auth/components/specialized-signup/SpecializedFlowShared.tsx`.

The specialized shared header now uses a cyan-to-blue gradient icon badge with pulse/glow, cyan registration eyebrow, slate/white title, muted subtitle, and gradient accent line. The shared stepper now matches the cyber gradient active circles/connectors and muted inactive states. Account/review fields pass local legacy label and input classes through `AuthInputField` without changing field names, schemas, submit handlers, or route page configs.

Offering, service, special-option, file, plan, and review/confirmation surfaces now use cyan glass cards, selected gradient borders/rings, hover lift, dashed cyan upload panels, emerald uploaded indicators, gradient CTA treatments, and success gradient confirmation icon styling. The existing specialized config content, review-only behavior for manual routes, provider account registration behavior for account routes, upload state, and backend boundaries remain unchanged.

Phase 6J verification-command output and Playwright evidence capture were skipped per user instruction.

# Visual Parity Decision Log

## Purpose

This log records decisions already approved for the legacy frontend visual parity work. It is initialized for Slice 1 planning and audit artifacts only.

## Decisions

| ID | Date | Decision | Consequence |
| --- | --- | --- | --- |
| VP-D001 | 2026-05-05 | The visual source of truth is the running legacy app at `http://localhost:5174/`. | Runtime rendering wins over source-code guesses or previous neutral design docs. |
| VP-D002 | 2026-05-05 | The current target app is `http://localhost:5173/`. | Captures compare legacy and current route/state pairs by URL and rendered state. |
| VP-D003 | 2026-05-05 | Target is pixel-match everywhere in approved scope. | Approximate matches are not accepted unless documented as user-approved exceptions. |
| VP-D004 | 2026-05-05 | Preserve the current frontend architecture. | Visual work must use current route, shell, shared UI, feature, auth, theme, i18n, and TanStack Query boundaries. |
| VP-D005 | 2026-05-05 | The viewport matrix is desktop, tablet, mobile tall, and mobile small. | Required viewport sizes are 1440x900, 1024x768, 390x844, and 360x800. |
| VP-D006 | 2026-05-05 | Both dark and light themes are in scope. | Captures and later verification must include both theme states. |
| VP-D007 | 2026-05-05 | Admin is out of scope. | No admin routes, shells, dashboards, charts, approvals, reports, support, subscription-management, audit, fraud, balance, or system-health work is included. |
| VP-D008 | 2026-05-05 | Screenshot and computed-style evidence must be saved outside the current app under the workspace `.superpowers` directory. | Evidence path is `C:\Work\PFE\PRESTACODE\.superpowers\visual-parity\`; do not store large evidence under app docs. |
| VP-D009 | 2026-05-05 | Conflicts should be asked immediately. | Do not silently choose a legacy counterpart, route behavior, visual exception, auth workaround, or architecture change when ambiguity appears. |
| VP-D010 | 2026-05-05 | French is the first pixel-match language. | Route captures begin in French before broader language checks. |
| VP-D011 | 2026-05-05 | Arabic receives RTL smoke checks for layout-sensitive surfaces. | Shell, navigation, forms, tables, chat, cards, booking flows, and overlays need RTL evidence where relevant. |
| VP-D012 | 2026-05-05 | Passwords and reusable credentials must not be stored in docs, screenshots, commits, or evidence. | Patient/provider captures use approved local seeded accounts or legacy bypasses without documenting secrets. |
| VP-D013 | 2026-05-05 | No visual exceptions are approved at Slice 1 initialization. | Every mismatch remains a fix candidate or a user-decision candidate until explicitly approved. |
| VP-D014 | 2026-05-05 | Current patient/provider account and profile pages use a hybrid visual family. | Account hub chrome matches the relevant patient/provider dashboard cockpit, while editable profile/form sections use legacy auth/signup form styling. |
| VP-D015 | 2026-05-05 | Superseded: the initial workflow split exact viewport screenshots from diagnostic browser automation. | Kept only as historical context. VP-D028 is the current browser-automation rule. |
| VP-D016 | 2026-05-05 | `/aide` is guarded shared help, not public help. | Keep the current guarded patient/provider behavior. Match legacy help visuals only in authenticated patient and provider states, not as a public help surface. |
| VP-D017 | 2026-05-05 | Direct provider finance routes are canonical for visual parity. | Use legacy `/provider/balance`, `/provider/transactions`, and `/provider/analytics` as the source. Nested finance pages are no longer active route targets. |
| VP-D018 | 2026-05-05 | Health and concierge detail pages use a hybrid-by-route matching process. | Capture each exact legacy route first. When an exact route is missing, or when older/non-cyber legacy styling conflicts with cyber consistency, ask the user route by route before applying hub inheritance, cyber consistency, or any exception. |
| VP-D019 | 2026-05-05 | Assistant/dock parity is route-specific. | Capture where the current app already renders assistant or dock behavior. Ask per route before adding missing legacy chatbot, voice assistant, or dock behavior to routes that do not currently show it. |
| VP-D020 | 2026-05-05 | Phase 3 must not restore the legacy global `*` color/background/border transition. | Add a reusable transition utility instead, so components can opt into parity transitions later without reintroducing global transition side effects. |
| VP-D021 | 2026-05-05 | Primary action foreground uses white text in light and dark themes. | Cyan and blue CTA surfaces keep the legacy white label treatment through `--primary-foreground`, rather than deriving action text from theme body or background tokens. |
| VP-D022 | 2026-05-05 | Phase 4 keeps the current top-bar profile/avatar action. | Do not remove the action for legacy parity; restyle it as a cyber-compatible shell control that follows the current control style. |
| VP-D023 | 2026-05-05 | Phase 4 keeps compact bottom-nav labels, including the current compact `Guide` behavior. | Do not force the full legacy `Comment ça marche` label everywhere; compact navigation may keep the current shorter label treatment. |
| VP-D024 | 2026-05-05 | Phase 4 keeps theme and language control backgrounds like the current frontend. | Do not hardcode legacy `bg-slate-800/80` backgrounds for those controls; preserve the current frontend control background treatment. |
| VP-D025 | 2026-05-05 | Shell background gradients use the exact legacy CyberLayout values: `bg-gradient-to-br from-slate-50 via-white to-slate-100` in light mode and `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900` in dark mode. | Phase 4 shell parity keeps the legacy page gradient baseline while preserving the current grid, orb, layering, and shell-content structure. |
| VP-D026 | 2026-05-05 | Phase 4 keeps the current light theme and language control backgrounds while correcting the shell grid and orbs to legacy CyberLayout strength. | Light controls remain current; shell backdrop parity uses legacy grid line strength and legacy cyan/purple orb size, placement, and theme opacity. |
| VP-D027 | 2026-05-05 | Phase 4 keeps current auth page bottom-navigation behavior. | Do not force `/auth/login` or other auth pages to always show bottom navigation like legacy; preserve current state-, theme-, and route-dependent behavior where it differs. |
| VP-D028 | 2026-05-05 | Browser automation uses `playwright-cli` going forward instead of Chrome DevTools MCP. | `playwright-cli` owns navigation, resizing, screenshots, snapshots, console, requests, storage/theme setup, interactions, and computed-style extraction through `playwright-cli eval`. Chrome DevTools MCP is no longer required for visual-parity capture. |
| VP-D029 | 2026-05-05 | Skip the verification-command phase and Playwright evidence capture unless the user explicitly requests them again. | Visual-parity documentation should record that these steps were intentionally skipped by user instruction, rather than treating missing command output or screenshots as incomplete work. |
| VP-D030 | 2026-05-05 | `/medicaments` visual migration must not add a sticky header. | Avoid adding sticky headers during route migrations unless explicitly approved; keep migrated route headers non-sticky by default. |
| VP-D031 | 2026-05-05 | Loading states remain skeleton-based across all pages. | Do not replace skeletons with centered spinners during visual parity unless explicitly approved. |
| VP-D032 | 2026-05-05 | `/patient/profile` is considered done for Phase 7. | Do not migrate or restyle `/patient/profile` further unless the user explicitly reopens it. |
| VP-D033 | 2026-05-05 | Route cleanup removes obsolete patient account/services, provider account/finance, and shared notification inbox routes. | Canonical replacements are `/patient/profile`, `/provider/profile`, `/provider/balance`, `/provider/transactions`, and `/provider/analytics`; notification route UI is removed while shared toast utilities and conservative MSW API support may remain. |

## Superseded Visual Direction

| Prior direction | Current decision |
| --- | --- |
| Neutral baseline visual reset removed cyber visuals, gradients, glow effects, category colors, and decorative motion | The approved legacy parity spec supersedes that visual direction for this migration. |
| Raw/category color restrictions where legacy runtime uses repeated service gradients or cyber accents | Legacy runtime visual parity wins, but reusable roles should still be represented through current token/shared UI ownership where practical. |
| Decorative-motion prohibition where legacy runtime uses hover scale, pulse, ping, conic spin, blurred orbs, or Framer Motion transitions | Legacy motion is in scope for normal-motion users, while reduced-motion/accessibility support should be preserved where possible. |

## Pending Decisions

No pending decisions remain at this checkpoint. Continue asking route-specific questions as new legacy/current conflicts are encountered.

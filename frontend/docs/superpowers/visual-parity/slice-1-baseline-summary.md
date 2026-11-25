# Slice 1 Baseline Summary

## Purpose

This document summarizes the current Slice 1 visual-parity baseline work for the public pilot capture set. It records the decisions, artifacts, evidence, initial findings, blockers, and remaining user decisions needed before implementation work begins.

## Decisions Made

- Use a local workspace `.superpowers` path for visual-parity working material.
- Ask about conflicts immediately instead of silently choosing one behavior or visual source.
- Keep admin surfaces out of scope for this slice.
- Treat account/profile surfaces as a hybrid visual family rather than forcing a single source family.
- Use `playwright-cli` for visual screenshots, computed-style extraction, DOM/accessibility snapshots, console evidence, request evidence, storage/theme setup, and route interaction.
- Treat `/aide` as guarded shared help, matching legacy help only in authenticated patient/provider states.
- Treat direct provider finance routes as canonical visual sources. Removed nested finance routes are replaced by `/provider/balance`, `/provider/transactions`, and `/provider/analytics`.
- Treat health and concierge detail pages as hybrid-by-route matching targets: capture exact legacy first, then ask the user route by route when older/non-cyber styling conflicts with cyber consistency.
- Treat assistant/dock parity as route-specific: capture where current assistant behavior already exists, then ask per route before adding missing legacy chatbot, voice assistant, or dock behavior.

## Artifacts Created

- `capture-protocol.md`
- `component-inventory.md`
- `decision-log.md`
- `exceptions.md`
- `route-matrix.md`
- `typography-checklist.md`
- Evidence folder for pilot screenshots and computed inspection JSON outputs.

## Pilot Evidence Captured

Capture conditions: legacy/current `/` and `/auth/login`, dark theme, `1440x900` viewport, French/default language, public session, and consent visible.

Screenshots captured:

- Legacy `/` landing page screenshot.
- Current `/` landing page screenshot.
- Legacy `/auth/login` page screenshot.
- Current `/auth/login` page screenshot.

Computed JSON files captured:

- Legacy `/` landing page computed inspection JSON.
- Current `/` landing page computed inspection JSON.
- Legacy `/auth/login` page computed inspection JSON.
- Current `/auth/login` page computed inspection JSON.

## Initial Findings From Computed Evidence

- Legacy uses variables such as `--bg-primary` with values like `#0f172a`, while current uses neutral tokens such as `--background` with values like `#09090b` and lacks the legacy variables.
- Landing H1 typography differs: legacy line-height is `40px`, while current line-height is `45px` at the same `36px` font size.
- Current body/root width was captured around `1424.8px` versus legacy `1440px` at the requested viewport. This needs follow-up during shell/token work.
- Legacy bottom navigation height was captured around `92.8px`, while current bottom navigation height was captured around `88.79px`.
- Login page H2 typography is close, but colors differ: legacy uses white/cyan link styling, while current uses foreground/primary neutral styling.

## Current Blockers

- None for pilot capture.

## Pending User Decisions

No standing pending user decisions remain. Continue asking about unmatched route visual families and route-specific assistant/dock additions as they are encountered.

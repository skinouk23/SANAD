# Visual Parity Exceptions

## Purpose

This file records user-approved visual differences from the running legacy app. It starts empty because no exceptions are approved yet.

Unapproved differences are blocking mismatches, not exceptions.

## Current Status

| Status | Value |
| --- | --- |
| Approved exceptions | None |
| Admin exceptions | Not applicable; admin is out of scope |
| Approval rule | A mismatch can be listed here only after explicit user approval |
| Evidence location | `C:\Work\PFE\PRESTACODE\.superpowers\visual-parity\` |

## Exception Template

Copy this template when a user approves a mismatch.

```markdown
## EX-000 - Short Title

| Field | Value |
| --- | --- |
| Status | Proposed / Approved / Rejected / Superseded |
| Approved by | User name or role |
| Approval date | YYYY-MM-DD |
| Route/surface | Current path or component surface |
| Route group | Public/Auth / Services/Bookings / Patient / Provider / Shared/Messaging/Help/Notifications / Unmatched/Needs Decision |
| App state | Auth, theme, language, viewport, consent, data state |
| Legacy evidence | Screenshot/computed-style evidence path |
| Current evidence | Screenshot/computed-style evidence path |
| Mismatch | Concrete visual difference |
| Reason | Why exact parity is not possible or not desired |
| Accessibility impact | None / Preserves current semantics / Needs mitigation |
| Implementation owner | Token / shell / shared primitive / shared composite / feature route / documentation only |
| Expiry/revisit trigger | When to revisit this exception |

### Notes

Describe the approved tradeoff in plain language. Include only local evidence paths, not credentials or secrets.
```

## Approved Exceptions

No exceptions are approved yet.

| ID | Route/surface | State | Mismatch | Approval | Notes |
| --- | --- | --- | --- | --- | --- |
| None | None | None | None | None | No approved exceptions. |

## Proposed But Not Approved

Use this section only for mismatches that need a user decision. Do not treat entries here as accepted parity.

| ID | Route/surface | State | Mismatch | Decision needed |
| --- | --- | --- | --- | --- |
| None | None | None | None | No proposed exceptions recorded yet. |

## Rejection Rules

| Mismatch type | Default result |
| --- | --- |
| Approximate color, gradient, shadow, or typography match without approval | Rejected as an exception; fix or ask. |
| Route has no exact legacy counterpart | Needs decision before using nearest visual family. |
| Legacy visual would remove current accessibility semantics | Preserve semantics and request exception only for visual delta. |
| Admin surface appears | Out of scope, not an exception candidate under this spec. |
| Missing screenshot or computed-style evidence | Cannot be approved. |
| Credential or secret exposure risk | Cannot be approved; recapture safely. |

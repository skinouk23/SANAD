# ADR-002: Semantic Theme Tokens

## Status

Accepted

## Decision

Reusable UI will style against semantic theme tokens, not page-specific color picks.

## Why

- Shared components need stable meaning-based tokens such as surface, border, foreground, accent, success, warning, and danger.
- Tokens make dark/light behavior consistent without duplicating class logic in every component.
- shadcn and Tailwind v4 both work best when tokens are the system contract.

## Rules

- Prefer token-backed utilities and CSS variables for shared UI.
- Hard-coded palette classes are acceptable in feature pages only when the value is intentionally local and not part of the design system.
- If a reusable component needs a new visual role, add a semantic token name first; do not encode the role as a raw color.
- Keep token names purpose-based, not hue-based.

## Consequences

- Theme work becomes centralized.
- Reusable UI can change brand or mode behavior with fewer file-level edits.

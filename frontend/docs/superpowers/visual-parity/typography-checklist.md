# Visual Parity Typography Checklist

## Purpose

Typography is part of pixel parity. This checklist defines the computed typography evidence to capture by element category and route group.

The accepted value is the rendered computed style from the running legacy app, captured with `playwright-cli eval`, not a source-code declaration or design-system guess.

## Capture Rules

| Rule | Requirement |
| --- | --- |
| Source of truth | Running legacy app at `http://localhost:5174/` |
| Target | Current app at `http://localhost:5173/` |
| First language | French |
| RTL smoke | Arabic on layout-sensitive surfaces |
| Themes | Dark and light |
| Viewports | 1440x900, 1024x768, 390x844, 360x800 |
| Credentials | Never capture or store passwords, tokens, or private credentials |
| Admin | Excluded |

Capture computed typography on both legacy and current apps with matching route, theme, viewport, language, auth state, and UI state.

## Computed Typography Fields

Capture these fields whenever the element exists:

| Field | Notes |
| --- | --- |
| `fontFamily` | Include fallback stack exactly as the browser computes it. |
| `fontSize` | Capture pixel value. |
| `fontWeight` | Capture numeric weight. |
| `fontStyle` | Usually normal, but record italic/emphasis. |
| `lineHeight` | Capture computed pixel value, not only unitless declaration. |
| `letterSpacing` | Include `normal` or pixel value. |
| `textTransform` | Record uppercase/capitalize/none. |
| `textAlign` | Important for RTL and centered CTAs. |
| `direction` | Capture on page root and Arabic/RTL-sensitive containers. |
| `color` | Capture computed color. |
| `opacity` | Capture if text inherits opacity or disabled state. |
| `textDecorationLine` | Links, nav items, tab states. |
| `whiteSpace` | Wrapping and truncation. |
| `overflow` | Truncation and chat/table/list behavior. |
| `textOverflow` | Ellipsis states. |
| `wordBreak` | Long labels, emails, service names, chat messages. |
| `marginBlockStart` and `marginBlockEnd` | Heading and paragraph rhythm. |
| `padding` | Buttons, badges, nav labels, table cells, form controls. |
| `height` and `minHeight` | Buttons, inputs, nav items, table rows. |
| `-webkit-font-smoothing` | Capture when available. |
| `text-rendering` | Capture when available. |

If computed-style extraction returns shorthand values, record enough detail to compare rendered size, spacing, and wrapping.

## Element Categories

| Category | Elements to sample | Required states |
| --- | --- | --- |
| Page title | Primary `h1` or visual page title | Default, long text/wrap if present, Arabic RTL smoke |
| Section headings | `h2`, `h3`, card headers, modal titles | Default, compact/mobile wrapping |
| Body copy | Paragraphs, help text, descriptions, empty-state copy | Default, muted, long line wrapping |
| Metadata | Dates, timestamps, prices, helper captions, card footers | Default, muted, disabled if applicable |
| Links | Inline links, back links, CTA links | Default, hover, focus, active/current if applicable |
| Buttons | Primary, secondary, outline, ghost, icon-only, destructive if present | Default, hover, active, focus, disabled, loading |
| Badges/chips | Status badges, category chips, selected filters, compliance badges | Default, selected, disabled/unavailable, warning/error/success |
| Navigation | Top header nav labels, bottom nav labels, menu items | Default, active/current, hover/focus, notification/unread state |
| Forms | Labels, inputs, placeholders, help text, validation messages | Default, focus, invalid, disabled, filled, placeholder |
| Select/dropdown/menu | Trigger text, item text, selected item, group labels | Open, highlighted, selected, disabled |
| Tabs | Tab trigger text, active tab, panel headings | Default, active, hover/focus, wrapped mobile tabs |
| Tables/lists | Table headers, row cells, list item titles, row metadata | Default, hover/selected, empty row/message, mobile collapse if present |
| Cards | Card title, subtitle, metric value, supporting text, CTA text | Default, hover, selected/active if present |
| Metrics/charts | Stat value, axis/legend/tooltip labels if rendered DOM/SVG text | Default, hover/tooltip if safe, mobile layout |
| Dialogs/sheets | Dialog title, description, labels, buttons, close control | Open, scrolled body, focus state |
| Messaging | Inbox title, thread preview, chat bubble, timestamp, composer placeholder | Patient/provider variants, unread, sent/received, long message |
| Toasts/notifications | Toast title/body/action, notification row title/body/time | Success, error, info if safely triggerable; unread/read |
| Consent banner | Banner title/body, action buttons, settings/details text | Visible, dismissed state note, details open if available |
| Error/loading/empty | Error title/body/action, skeleton labels if any, loading text | Loading, empty, error, retry button |

## Route-Group Coverage

| Route group | Typography targets to prioritize |
| --- | --- |
| Public/Auth | Hero title, nav labels, CTA buttons, service cards, auth labels, placeholders, validation messages, terms/consent copy |
| Services/Bookings | Service names, provider names, category chips, price/distance/availability metadata, booking step labels, form labels, summary totals |
| Patient | Dashboard metric values, appointment titles/statuses, medication names, profile/account labels, health metric values, concierge card titles |
| Provider | Dashboard metrics, service management rows/cards, schedule labels, finance currency values, transaction rows, analytics labels, marketing/insurance/billing forms |
| Shared/Messaging/Help/Notifications | Inbox thread titles/previews, chat bubbles, timestamps, help question/answer text, notification titles/body/time, unread badges |
| Unmatched/Needs Decision | 404/error title/body/action, fallback route copy, any route with missing legacy counterpart |

## Capture Template

Use this table shape in route notes or computed-style files when manual transcription is needed.

| Route | App | Theme | Viewport | Language | Auth | State | Element | Field | Value | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/patient-dashboard` | legacy | dark | desktop-1440x900 | fr | patient | default | page h1 | `fontSize` | TBD | Capture with `playwright-cli eval`. |
| `/patient-dashboard` | current | dark | desktop-1440x900 | fr | patient | default | page h1 | `fontSize` | TBD | Compare to legacy. |

## Acceptance Notes

| Condition | Result |
| --- | --- |
| Computed typography matches legacy within the visual capture tolerance approved for the slice | Accept candidate route typography. |
| Text wraps differently at an approved viewport | Treat as mismatch unless user approves an exception. |
| Font stack differs but rendered pixels match | Record the computed difference and ask before accepting. |
| Legacy typography conflicts with current accessibility semantics | Preserve semantics and request visual exception approval if needed. |
| Arabic RTL exposes clipped, misaligned, or incorrectly ordered text | Record as a parity/a11y issue before implementation planning. |

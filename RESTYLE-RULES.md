# Restyle rules — extracted from the proof draft

Source: `~/dev/crestfall-main/Crestfall/design-system/proof/` (read-only reference, never written to). Canonical page-head recipe lives in `library.css` (`.pagehead`, `.pagehead h1`/`.h1like`, `.pagehead .lede`) and `proof.css` (`.eyebrow`, `.eyebrow--ruled`). `library.css` explicitly states this is the one shared recipe; older per-page copies (e.g. `studio.html`'s local `.pagehead` override) are earlier/retired duplicates and were not used as the source of truth.

Every value below already exists as a token in this repo's `app/theme.css` — nothing new was added.

## Page-head element rules

| Element | Property | Value | Token |
|---|---|---|---|
| Eyebrow | font family | inherited (Inter / `--font-sans`, no override) | — |
| Eyebrow | font size | 0.8125rem (13px) | `--text-eyebrow` (→ `--text-ui`) |
| Eyebrow | line height | 1.25rem (20px) | `--lh-eyebrow` (→ `--lh-ui`) |
| Eyebrow | font weight | 500 | `--weight-medium` |
| Eyebrow | letter spacing | .16em | `--track-eyebrow` |
| Eyebrow | text transform | uppercase | (literal, not tokenized) |
| Eyebrow | color | gold | `--gold-ornament` |
| Eyebrow rule mark | position | to the right of the text, `gap: var(--space-3)`, vertically centered via flex `align-items: center` | `--space-3` |
| Eyebrow rule mark | size | 1px tall, `var(--space-8)` (2rem/32px) wide | `--space-8` |
| Eyebrow rule mark | fill | solid gold at the text edge fading to transparent outward | `--grad-rule` |
| Title | font family | display face | `--font-display` (Cormorant Garamond) |
| Title | font size | 2.0625rem (33px) | `--text-title` |
| Title | line height | 2.5rem (40px) | `--lh-title` |
| Title | font weight | 500 | `--weight-medium` |
| Title | letter spacing | -.01em | `--track-tight` |
| Description (lede) | font family | inherited (Inter / `--font-sans`, no override) | — |
| Description (lede) | font size | 0.8125rem (13px) | `--text-ui` |
| Description (lede) | line height | 1.25rem (20px) | `--lh-ui` |
| Description (lede) | color | dim ink | `--ink-dim` |
| Description (lede) | max width | 44rem | (literal in the draft itself, not tokenized there) |

## Spacing between the three

- Eyebrow → title: `var(--space-2)` (0.5rem/8px) — from the title's top margin, mirroring the draft's `.titlerow` wrapper margin.
- Title → description: `var(--space-2)` (0.5rem/8px) — from the title's bottom margin, same source.
- Whole page-head block → following content: `var(--space-5)` (1.25rem/20px) in the draft's `.pagehead` (not applied here — this component's outer header framing, divider, and side-action layout are unchanged; only the eyebrow/title/description text and the eyebrow rule mark were touched, per task scope).

## Notes

- The eyebrow rule mark only renders when eyebrow text is present, sits to the right of the text (never left), and has no arrow or caret — matches the draft's "eyebrow law, ruled 2 Aug 2026."
- Legacy bridge variable names (`--muted-gold`, `--muted`) were replaced with their real design-system tokens (`--gold-ornament`, `--ink-dim`) directly in this pass, since that migration is the point of the per-package restyle sequence.
- No new hex value, font family, or token name was introduced. Every value above resolves through a token already defined in this repo's `app/theme.css`.

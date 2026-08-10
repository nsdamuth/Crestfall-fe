# Kit Badge LOOM Package

**Contract:** `KitBadge.contract.js`

## Purpose

The constrained badge set ratified in `docs/BUILD-BLUEPRINT.md`
section 2.10: Canon is the only gold badge, every other category is
quiet, and category is always carried by the label word, never by
color alone.

## Boundary

```text
KitBadge.jsx
  -> useKitBadgeViewModel.js
  -> KitBadge.view.jsx
```

- The ViewModel validates `variant` and `surface` against the
  constrained set and defaults defensively.
- The portable View owns the two-recipe bed/border/text logic (keyed
  to background, per docs/RESTYLE-RULES.md Badges).
- The caller resolves a real record's category into a label and one
  of the three variants before this component ever sees it; the View
  never sees a visibility enum or product record.

## States

Badges are non-interactive labels: rest only, by shape law. A
dismissible or clickable "badge" is a chip, not a badge
(`KitFilterChip`).

## Package assets

- `KitBadge.contract.js`
- `KitBadge.fixtures.js`
- `useKitBadgeViewModel.js`
- `/dev/ui-preview/kit-badge`

The preview is fixture-only.

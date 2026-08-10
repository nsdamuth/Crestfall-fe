# Kit Studio Filter Bar LOOM Package

**Contract:** `KitStudioFilterBar.contract.js`

## Purpose

The sticky filter bar ratified in `docs/BUILD-BLUEPRINT.md` section
2.1: one component, search, filter chips, sort, and a slot for the
existing `ViewModeToggle` package, configured per page with whatever
groups are relevant to that page's entities
(`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 3.1).

## Boundary

```text
KitStudioFilterBar.jsx
  -> useKitStudioFilterBarViewModel.js
  -> KitStudioFilterBar.view.jsx
      -> KitFilterChip.view.jsx (each filter option)
```

- The ViewModel defends every group, option, and sort entry, coercing
  malformed input to safe defaults rather than throwing.
- The portable View owns the sticky canvas-tinted chrome and the
  filter-chip rows; it consumes `KitFilterChipView` directly rather
  than reimplementing the chip recipe.
- The caller owns what a filter value means, how the list is queried,
  and how selection persists; it reports intent through
  `onFilterToggle`, `onSortChange`, and `onSearchChange` only.
- `viewModeSlot` is a plain render slot so a real page can compose the
  existing `components/studio/view-mode-toggle` package in without
  this bar knowing anything about it.

## Deferred, flagged

The ruled behavior for the phone overflow menu is to dock to the
bottom edge using the unified modal frame (Ruling 7,
docs/RESTYLE-RULES.md). The `modal-frame` kit piece (section 2.5) is
not part of kit batch 1. This package's interim: filter chip rows
scroll horizontally at narrow widths instead of collapsing into an
overflow menu. Flagged for conversion once `modal-frame` ships.

## States

The bar's own chrome is rest only (sticky chrome does not hover).
Every chip and the sort control carry their own five states. A
loading-counts state hides numeric counts and shows a quiet caption
instead of a skeleton, since no loading-skeleton primitive is part of
this batch.

## Package assets

- `KitStudioFilterBar.contract.js`
- `KitStudioFilterBar.fixtures.js`
- `useKitStudioFilterBarViewModel.js`
- `/dev/ui-preview/kit-studio-filter-bar`

The preview is fixture-only; search, sort, and filter toggles only
update local preview state.

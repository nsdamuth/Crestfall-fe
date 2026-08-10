# Kit Studio Filter Bar LOOM Package

**Contract:** `KitStudioFilterBar.contract.js` (v2.0.0)

## Purpose

The sticky filter line ruled 9 Aug 2026 (`docs/BUILD-BLUEPRINT.md`
sections 2.1 and 2.16, the filter-line law): search, every filter
group, and sort share one sticky line. Filters and multi-selects are
branded dropdowns (`KitDropdown`) carrying live selection counts;
loose chip rows are retired from filter surfaces. The legacy control
bar already ruled this shape ("every category is a dropdown on one
line", `docs/MOCKUP-DECISIONS.md` control bar entry); this package is
that ruling rebuilt on the current tokens.

## Boundary

```text
KitStudioFilterBar.jsx
  -> useKitStudioFilterBarViewModel.js
  -> KitStudioFilterBar.view.jsx
       -> KitDropdown.view (one per filter group, plus Sort)
```

- The bar itself is REST-only chrome; every control inside carries
  its own five states.
- Semantic callbacks are unchanged from v1 (contract law):
  `onFilterToggle(groupId, value)`, `onSortChange(value)`,
  `onSearchChange(value)`.
- The view-mode toggle slots in through `viewModeSlot` unchanged.
- The caller owns what a filter value means, how the list is queried,
  and how selection persists.

## Mobile law (390)

Search takes its own full-width row inside the sticky block (ruled
this pass: the always-visible field beats a two-tap icon-expand for
the page's highest-frequency control); the dropdown line below it
scrolls horizontally without clipping. Dropdown panels dock to the
bottom edge as sheets under 700px per the modal law. The search input
bumps to `--text-body` at coarse pointers (iOS zoom guard, adopted
from the legacy bar). This supersedes the kit-batch-1 interim note
about waiting on `modal-frame`; the dropdown package now carries its
own sheet treatment.

## Focus law

The focused search control outlines its full border via
`focus-within` carrying `--focus-ring`; the inner input suppresses
the per-element ring. Ruled 9 Aug 2026.

## Package assets

- `KitStudioFilterBar.contract.js`
- `KitStudioFilterBar.fixtures.js`
- `useKitStudioFilterBarViewModel.js`
- `/dev/ui-preview/kit-studio-filter-bar`

Fixture-only; no list, query, or persisted filter state is connected.

# Kit Studio Filter Bar LOOM Package

**Contract:** `KitStudioFilterBar.contract.js` (v2.1.0)

## Purpose

The sticky filter line. RULED 6 Sep 2026 (FE/FILTERS, Brian): search
left; anchored right, optional quick tabs, one Filter button opening
the shared `KitFilterPanel` (active-count badge, search-within,
chip-group sections in caller order, Clear all), a Sort dropdown whose
trigger reads "Sort: <value>", and the view-mode slot. This supersedes
the 9 Aug 2026 filter-line law's per-category dropdown row
(`docs/BUILD-BLUEPRINT.md` 2.16(b), amended the same day: filter
categories live in one Filter panel; dedicated dropdowns are the
fallback). The fallback survives behind `filterPresentation="dropdowns"`,
which renders the 2.0.0 row exactly, so any page rolls back with one
prop.

## Boundary

```text
KitStudioFilterBar.jsx
  -> useKitStudioFilterBarViewModel.js
  -> KitStudioFilterBar.view.jsx
       -> KitFilterPanel.view (all filter groups)      [default]
       -> KitDropdown.view (one per group)             [fallback]
       -> KitDropdown.view (Sort)
```

- The bar itself is REST-only chrome; every control inside carries
  its own five states.
- Semantic callbacks are unchanged since v1 (contract law):
  `onFilterToggle(groupId, value)`, `onSortChange(value)`,
  `onSearchChange(value)`. 2.1.0 adds `onClearFilters` (fires once
  from Clear all) and `onQuickTabChange(value)`.
- An empty `filterGroups` hides the Filter button (Creators,
  Adventures); an empty `sortOptions` hides Sort (Lore, Images).
- The view-mode toggle slots in through `viewModeSlot` unchanged.
- The caller owns what a filter value means, how the list is queried,
  how selection persists, and the section order (see
  `orderFilterGroups` in `app/studio/v2/catalog/creationCatalogFilterTaxonomy.js`).

## Mobile law (390)

Search takes its own full-width row inside the sticky block; the
control line below it scrolls horizontally without clipping. The
Filter panel and every dropdown dock to the bottom edge as sheets
under 700px. The search input bumps to `--text-body` at coarse
pointers (iOS zoom guard).

## Focus law

The focused search control outlines its full border via
`focus-within` carrying `--focus-ring`; the inner input suppresses
the per-element ring. Ruled 9 Aug 2026.

## Package assets

- `KitStudioFilterBar.contract.js`
- `KitStudioFilterBar.fixtures.js`
- `useKitStudioFilterBarViewModel.js`
- `/dev/ui-preview/kit-studio-filter-bar` (harness only; review on
  the live `/studio/v2/*` pages)

Fixture-only; no list, query, or persisted filter state is connected.

## Shared search field, 6 Sep 2026 (FE/FILTERS refine)

`KitSearchField.view.jsx` in this folder is the one kit search field:
the bar's search and the Filter panel's search-within both render it.
The focus ring sits outside the field on the `kit-search-field`
wrapper (app/design-system.css), and any input inside the wrapper
drops its own ring, so the treatment is fixed once. `debounceMs`
defaults to 200 for the bar's full-dataset consumers; the panel passes
0. Contract 2.1.0 is unchanged by the extraction.

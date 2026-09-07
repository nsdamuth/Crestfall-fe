# Kit Filter Panel LOOM Package

**Contract:** `KitFilterPanel.contract.js` (v1.0.0)

## Purpose

The one Filter control on the shared sticky bar, RULED 6 Sep 2026
(FE/FILTERS, Brian): one trigger reading "Filter" with a live
active-count badge, opening a panel whose structure matches the
OurDream reference (search-within at the top, "Filter by", labelled
chip groups, Clear all at the bottom) with every value drawn from
`app/theme.css`. It supersedes the per-category dropdown row of the
9 Aug 2026 filter-line law; `docs/BUILD-BLUEPRINT.md` 2.16(b) is
amended the same day ("filter categories live in one Filter panel;
dedicated dropdowns are the fallback").

## Boundary

```text
KitFilterPanel.jsx
  -> useKitFilterPanelViewModel.js
  -> KitFilterPanel.view.jsx
       -> useAnchoredPanel (shared with KitDropdown)
       -> KitFilterChip.view (one per option)
       -> KitModalFrame variant="sheet" (under 700px)
```

- Open/closed and the search-within text are the only local state;
  the text resets on close.
- Sections render in caller order. The kit View carries no page
  vocabulary; the ruled section order lives in
  `app/studio/v2/catalog/creationCatalogFilterTaxonomy.js`
  (`FILTER_SECTION_ORDER`, `orderFilterGroups`).
- A section with no options is not rendered; a page passes only the
  sections its data supports.
- Clear all fires `onClearAll` once. With no `onClearAll`, it emits
  `onToggleOption` once per selected value so older consumers still
  clear correctly.
- The caller owns what a value means, how the list is queried, and
  how selection persists.

## Mobile law (390)

Under 700px the panel is a bottom-docked `KitModalFrame` sheet with a
grabber, capped at 70dvh with internal scroll; chips keep the 44px
touch floor. At 700px and up it is a popover below the trigger,
28rem wide at most and never wider than the viewport minus the
standing edge guard, flipped to right-anchored when left-anchoring
would overflow (measured in `useAnchoredPanel`).

## Contrast law

The popover surface is menu glass, so section labels and helper lines
use `--ink-dim`, never `--ink-faint`. Chip counts keep `--ink-faint` on
the chip's own `--surface-1` bed.

## Package assets

- `KitFilterPanel.contract.js`
- `KitFilterPanel.fixtures.js`
- `useKitFilterPanelViewModel.js`
- `/dev/ui-preview/kit-filter-panel` (harness only; review happens on
  the live `/studio/v2/*` pages per the 29 Aug 2026 standing order)

Fixture-only; no list, query, or persisted filter state is connected.

## Refine, 6 Sep 2026 (Brian)

Spacing one step up the scale (sections `--space-5`, chip gaps and
divider padding `--space-3`). Search-within renders the shared
`KitSearchField` (studio-filter-bar package) with no debounce. Chips
with a zero count render muted (`--ink-faint`) and stay selectable.
Selected states are the gold family only. Every option label is Title
Case; section labels are the caller's copy.

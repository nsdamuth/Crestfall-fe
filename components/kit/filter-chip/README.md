# Kit Filter Chip LOOM Package

**Contract:** `KitFilterChip.contract.js`

## Purpose

The selectable filter chip ratified in `docs/BUILD-BLUEPRINT.md`
section 2.7, lifted from the fully specified `.fchip` recipe in
`docs/RESTYLE-RULES.md` ("OPEN: none"). Not a redesign, a LOOM
package around an already-settled visual recipe.

## Boundary

```text
KitFilterChip.jsx
  -> useKitFilterChipViewModel.js
  -> KitFilterChip.view.jsx
```

- The ViewModel validates `variant` against the constrained set and
  defends every prop.
- The portable View owns the four variants (default, sort,
  select-toggle, dropdown trigger) and their selected/hover/pressed/
  disabled treatment.
- The caller owns what the chip filters and how selection persists;
  it reports intent through `onToggle` only.

## States

Rest, hover, focus (the global `:focus-visible` rule in
`app/design-system.css` already covers this button, no local override
needed), selected, pressed, disabled. Disabled opacity is `.45`,
verbatim from the ruled proof recipe, not the shared `.5` state token;
this is a documented, ruled exception, not a drift.

## Package assets

- `KitFilterChip.contract.js`
- `KitFilterChip.fixtures.js`
- `useKitFilterChipViewModel.js`
- `/dev/ui-preview/kit-filter-chip`

The preview is fixture-only; toggling a chip only updates local
preview state.

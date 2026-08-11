# Kit Picker Modal LOOM Package

**Contract:** `KitPickerModal.contract.js`

## Purpose

The one shared searchable picker (`docs/BUILD-BLUEPRINT.md` 2.9,
picker modal anatomy; CR-009 records that no shared visual picker
existed before this package). Composed on the unified modal frame
(2.5): search field, optional filter chip row, rich rows or a tile
grid, single and multi select, sticky footer with the count in words
plus Confirm and Cancel, a load-more slot (2.4) where the source is
paged. `menu-popover` is NOT built this pass; only the picker modal.

## Boundary

```text
KitPickerModal.jsx
  -> useKitPickerModalViewModel.js
  -> KitPickerModal.view.jsx
```

- The View is fixture-fed: it does not fetch, search, filter, or
  page. Every list, filter, and paging state is caller-owned; the
  View reports intent through the semantic callbacks
  (`onSearchChange`, `onToggleFilter`, `onToggleItem`, `onLoadMore`,
  `onConfirm`, `onClose`).
- Single-select rows confirm and close immediately on activation
  (`onToggleItem` then `onConfirm`), matching the live pickers'
  behavior. Multi-select rows toggle and the picker stays open; the
  footer's Confirm button commits the selection.
- Selected rows take the chip selected law: `--gold-action`
  border/inset, `--gold-bright` text (kit revision ruling 2.16i).

## Layouts

`layout="rows"` (default): rich rows, thumbnail at `--radius-sm`,
title `--ink`, supporting line `--ink-dim`, quiet badge, trailing
check mark. `layout="grid"`: a tile grid, same selected treatment,
check mark overlay top-right on the art.

## States

Content area: loading (searching, distinct from load-more's own
loading flag), empty (words, ink family), error (`--status-danger`
with words), populated. Rows carry rest, hover
(`--state-hover-fill`), focus, selected, pressed, and disabled is
inherited by construction (a disabled row is simply absent from
`items`; the picker never ships a dead row).

## Package assets

- `KitPickerModal.contract.js`
- `KitPickerModal.fixtures.js`
- `useKitPickerModalViewModel.js`
- `/dev/ui-preview/kit-picker-modal`

Fixture-only; no query, persistence, or navigation is wired. Converting
an existing live picker onto this package must keep reporting the
same selection to the same handler (contract law); if a live picker's
contract cannot map, that conversion stops and escalates rather than
being improvised.

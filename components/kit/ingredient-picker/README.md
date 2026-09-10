# Kit Ingredient Picker LOOM package

**Contract:** `KitIngredientPicker.contract.js` (`2.0.0`)

## Purpose

THE asset picker for Media Studio (FE/MEDIA-STUDIO session 2, Brian's
note 3, 9 Sep 2026): one layout and one component for every asset
type. Opened from the composer's five asset tiles (Character, Pose,
Outfit, Location, Preset) and from the Camera framing control in
Image settings. The page composes it; the picker never fetches.

## Boundary

```text
KitIngredientPicker.jsx
  -> useKitIngredientPickerViewModel.js
  -> KitIngredientPicker.view.jsx
     -> KitModalFrame (variant="sheet" with grabber under 700px,
        the same sheet the composer uses; variant="modal" at 700px
        and up, through usePhoneWidth)
     -> KitDropdown.view (the one filter dropdown)
```

## Search and filtering are the caller's responsibility

Matching the `studio-filter-bar` convention: this View receives an
already-filtered `items` array and reports search text through
`onSearchChange` and the filter choice through `filter.onChange`. It
never filters, sorts, or fetches. The filter dropdown holds only
filters that already exist for the asset type: Mine / Public for the
five asset slots, the catalog groups for camera framing. Nothing is
invented; the OD reference's gender, style, and age filters have no
Crestfall data behind them.

## Anatomy

Header (eyebrow "Select asset", the asset word as the title, one
sentence), the search field with the filter dropdown to its right
(both on the filter-line height, `--control-filter` on fine pointers
and `--control-md` on coarse), an optional load-error banner
(`--status-danger` triad), then the grid.

Cards layout (the five asset slots): Custom is the first card, the
same shape as an asset card, with the pen mark where an asset carries
its art. It reads selected while the slot holds a once-only custom
description (`customIsSelected`). Tapping it opens the custom asset
modal (`KitSaveIngredientPreset`), never an inline text mode (note 4).

Rows layout (camera framing, ruled at the session 2 plan gate, option
A): text options with a one-line description, the option's group as a
quiet label, and a check mark when selected. No Custom card.

Selected cards and rows follow the selection-state law
(`docs/BUILD-BLUEPRINT.md` 2.16(i)): `--fill` wash plus `--gold-bright`
title text, never a bold border change.

## Nested modal back label

`backLabel` (`string|null`): NESTED MODAL LAW, this picker opened from
the mobile composer sheet. When non-null, the caller passes a labeled
back affordance so the return path reads correctly instead of a bare
close.

## Fixture states

`default` (Character, cards, source filter), `camera` (rows, group
filter, no Custom), `emptyResults` (Custom first and selected),
`loadError`.

## Package assets

- `KitIngredientPicker.contract.js`
- `KitIngredientPicker.fixtures.js`
- `useKitIngredientPickerViewModel.js`
- `/dev/ui-preview/kit-ingredient-picker` (harness only, never a
  review surface; Brian reviews on the live page)

Fixture-only; no query, persistence, or navigation is wired.

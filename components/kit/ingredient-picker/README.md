# Kit Ingredient Picker LOOM package

**Contract:** `KitIngredientPicker.contract.js` (`1.0.0`)

## Purpose

Fixture-driven mirror of the live ingredient picker's function
(docs/SPRINT-E-PLAN.md section 1.2, R6), never its code
(`components/studio/image-studio/ingredient-picker/`, READ ONLY
reference, never imported). Opened from the KitImageCreatorPanel
(1.1) when a non-custom slot tile is tapped.

## Boundary

```text
KitIngredientPicker.jsx
  -> useKitIngredientPickerViewModel.js
  -> KitIngredientPicker.view.jsx
     -> KitModalFrame (variant="modal", full-screen at 390 per R4)
```

## Search is the caller's responsibility

Matching the `studio-filter-bar` convention: this View receives an
already-filtered `items` array and reports search-text intent through
`onSearchChange`. It never filters, sorts, or fetches.

## Anatomy

Header (eyebrow, slot label as title, an intro sentence assembled from
which actions are shown), search field (`kit-search-input` recipe),
an optional load-error banner (`--status-danger` triad), the item grid
(or the empty-state message when `items` is empty), and the action row
(`Use Once`, shown by `showUseCustomAction`; `New Preset`, shown by
`showCreatePresetAction`, only true for the four savable slots per the
live rule: pose, outfit, location, preset).

Selected cards follow the selection-state law
(`docs/BUILD-BLUEPRINT.md` 2.16(i)): `--fill` wash plus `--gold-bright`
title text, never a bold border change.

## Fixture states

`default` (Character, non-savable), `savableSlot` (Pose, exercises the
New Preset card), `emptyResults`, `loadError`.

## Package assets

- `KitIngredientPicker.contract.js`
- `KitIngredientPicker.fixtures.js`
- `useKitIngredientPickerViewModel.js`
- `/dev/ui-preview/kit-ingredient-picker`

Fixture-only; no query, persistence, or navigation is wired.

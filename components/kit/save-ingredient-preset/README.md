# Kit Save Ingredient Preset LOOM package

**Contract:** `KitSaveIngredientPreset.contract.js` (`1.1.0`)

## Purpose

Fixture-driven mirror of the live save-preset modal's function
(docs/SPRINT-E-PLAN.md section 1.3, R6), never its code
(`components/studio/image-studio/save-ingredient-preset/`, READ ONLY
reference, never imported). Opened from a savable slot's custom
editor inside KitImageCreatorPanel (1.1) or from the ingredient
picker's New Preset card (1.2). Only POSE, OUTFIT, LOCATION, and
IMAGE_PRESET are savable live; this piece never gates that itself.

## Boundary

```text
KitSaveIngredientPreset.jsx
  -> useKitSaveIngredientPresetViewModel.js
  -> KitSaveIngredientPreset.view.jsx
     -> KitModalFrame (variant="modal")
```

## Fields

Preset Name (required), Description, Prompt / Guidance, Tags. None
carries a character cap in the live flow, so none is invented here
(token-first / honesty law): no counters render, matching the live
modal exactly.

## Saving disables close

The live modal disables its close control while a save is in flight.
This package has no separate prop for that: the caller passes
`onClose={isSaving ? null : closeHandler}`, and KitModalFrame's
null-safe dismissal makes backdrop click, Escape, and the close
control all no-ops while saving (the `saving` fixture demonstrates
this by shipping `onClose: null`).

## Nested modal back label

`backLabel` (`string|null`, added 1.1.0, additive): NESTED MODAL LAW
(the R1 pattern, this piece opened from another modal under 700px).
When non-null, the caller passes a labeled back affordance so the
return path reads correctly instead of a bare close.

## Fixture states

`default`, `saving` (`onClose: null`, `canSave: true`), `longestContent`.

## Package assets

- `KitSaveIngredientPreset.contract.js`
- `KitSaveIngredientPreset.fixtures.js`
- `useKitSaveIngredientPresetViewModel.js`
- `/dev/ui-preview/kit-save-ingredient-preset`

Fixture-only; `onSavePreset` opens the R4 fixture-action notice in
every fixture-mode consumer; the real persistence call is live wiring.

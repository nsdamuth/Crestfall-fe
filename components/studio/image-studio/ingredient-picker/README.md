# Image Studio Ingredient Picker

## Purpose

Allows Image Studio to choose a reusable creation, switch a slot to one-use
custom guidance, or begin the existing preset flow without coupling the modal
presentation to Image Studio slot configuration or selected-ingredient state.

## Feature structure

```text
IngredientPickerModal.jsx
ingredient-picker/
  IngredientPickerModal.view.jsx
  useIngredientPickerViewModel.js
  IngredientPickerModal.contract.js
  IngredientPickerModal.fixtures.js
  README.md
```

The existing `IngredientPickerModal.jsx` path remains the Binding Shell.

## Public application props

```text
slot
items
loadError
selected
onSelect(item)
onUseCustom(slot)
onCreatePreset(slot)
onClose()
```

The Shell and ViewModel preserve this application-facing contract. The
portable View does not receive the raw slot object or raw ingredient options.

## View ownership

The View owns:

- modal structure, headings, icon treatment, and responsive card grid
- search and empty-state presentation through the existing visual picker panel
- selected-card presentation
- load-error presentation
- custom and new-preset action cards
- safe invocation of semantic callbacks

The View currently uses the presentation-only `CreationPickerPanel` and
`ModalShell` UI helpers. Neither helper loads or saves application data.

## ViewModel ownership

The ViewModel:

- translates the Image Studio slot into semantic labels and action visibility
- selects the display icon name
- converts ingredient options into display-ready picker cards
- identifies the currently selected card
- translates a semantic item-ID selection back to the original raw item
- preserves the existing `onUseCustom(slot)` and `onCreatePreset(slot)` calls

## Isolated preview

```text
/dev/ui-preview/ingredient-picker
```

The route is unavailable in production. It does not load Image Studio assets,
change composer state, create a preset, or save application data.

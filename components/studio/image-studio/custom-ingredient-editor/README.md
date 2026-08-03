# Image Studio Custom Ingredient Editor

## Purpose

Renders the inline custom-guidance editor shown when an Image Studio ingredient
slot is placed in one-use custom mode. The Loom boundary keeps the presentation
independent from slot configuration, selected-ingredient storage, and preset
creation behavior.

## Feature structure

```text
CustomIngredientEditor.jsx
custom-ingredient-editor/
  CustomIngredientEditor.view.jsx
  useCustomIngredientEditorViewModel.js
  CustomIngredientEditor.contract.js
  CustomIngredientEditor.fixtures.js
  README.md
```

The existing `CustomIngredientEditor.jsx` path remains the Binding Shell.

## Public application props

```text
slot
value
promptValue
onPromptChange(value)
onBackToPresets()
onClear()
onSavePreset()
canSavePreset
```

The Shell and ViewModel preserve this application-facing contract. The
portable View does not receive the raw slot object or raw selected ingredient.

## View ownership

The View owns:

- inline editor structure and visual hierarchy
- ingredient label and explanatory copy presentation
- prompt textarea presentation
- Back to Presets, Save as Preset, Clear, and selected Use Once controls
- safe invocation of semantic callbacks

## ViewModel ownership

The ViewModel:

- determines whether the editor is visible from the selected custom value
- derives the semantic ingredient label and prompt placeholder
- selects the reusable-preset versus one-use explanatory copy
- controls whether Save as Preset is available
- normalizes prompt changes before returning them to the composer
- preserves the existing callback behavior without receiving or saving data

## Isolated preview

```text
/dev/ui-preview/custom-ingredient-editor
```

The route is unavailable in production. It does not alter Image Studio
composer state, select an ingredient, create a preset, or save application data.

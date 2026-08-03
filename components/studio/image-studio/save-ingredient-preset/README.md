# Save Image Studio Ingredient Preset

## Purpose

Allows Image Studio to save current custom ingredient guidance as a private
reusable creation draft or continue using the guidance once without saving it.

## Feature structure

```text
SaveIngredientPresetModal.jsx
save-ingredient-preset/
  SaveIngredientPresetModal.view.jsx
  useSaveIngredientPresetViewModel.js
  SaveIngredientPresetModal.contract.js
  SaveIngredientPresetModal.fixtures.js
  README.md
```

The existing `SaveIngredientPresetModal.jsx` path remains the Binding Shell.

## Public application props

```text
slot
promptValue
onPromptChange(value)
onSave({ name, description, tags, promptValue })
onClose()
```

The Shell and ViewModel preserve this application-facing contract. The
portable View does not receive the raw Image Studio slot.

## View ownership

The View owns:

- modal structure, headings, explanatory copy, and responsive form layout
- text input and textarea presentation
- disabled, saving, and error-message presentation
- safe invocation of semantic form and action callbacks

## ViewModel ownership

The ViewModel owns:

- mapping the raw slot to a display label and default preset name
- local name, description, and tag state
- save eligibility and in-flight state
- construction of the existing `onSave` value object
- propagation of prompt edits to the Image Studio owner
- error normalization
- closing after a successful save or a one-use decision

The creation-type mapping and actual draft creation remain outside this feature
in `ImageStudioWorkbench.jsx`, preserving the existing Crestfall data path.

## Isolated preview

```text
/dev/ui-preview/save-ingredient-preset
```

The route is unavailable in production. It does not create a draft, call an
API, or change the Image Studio composer.

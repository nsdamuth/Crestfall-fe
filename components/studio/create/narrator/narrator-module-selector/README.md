# Narrator Module Selector Loom Feature

## Public Shell

```text
components/studio/create/narrator/NarratorModuleSelector.jsx
```

The public Shell preserves the existing `selectedModules`, `updateModule`,
`responseDirection`, and `updateResponseDirection` API. It binds the ViewModel
to the portable View and contains no presentation or persistence behavior.

## Portable View

```text
components/studio/create/narrator/narrator-module-selector/
  NarratorModuleSelector.view.jsx
```

The View owns only:

- Response Direction option presentation;
- conditional Ensemble Character Limit presentation;
- official starter-module group presentation;
- selected and unselected visual states;
- responsive grids;
- semantic selection callbacks.

It does not import narrator presets, merge response-direction defaults, inspect
creation payload fields, save a Narrator, or know how selections are persisted.

## ViewModel

```text
components/studio/create/narrator/narrator-module-selector/
  useNarratorModuleSelectorViewModel.js
```

The ViewModel owns:

- official module and response-direction preset normalization;
- response-direction default merging;
- selected module and option interpretation;
- conditional Ensemble Character Limit visibility;
- mapping semantic View actions to the existing application callbacks.

## Preview

```text
/dev/ui-preview/narrator-module-selector
```

The preview renders direct View-contract fixtures. Option selections update
preview-local state only and do not create, edit, or save a Narrator.

## Live Callers

```text
components/studio/create/narrator/NarratorBuilderShell.jsx
components/studio/my-creations/edit/sections/narrators/
  NarratorModulesSection.jsx
```

# Character Creator LOOM Feature

## Boundary

```text
CharacterCreator.jsx
  → useCharacterCreatorViewModel.js
  → CharacterCreator.view.jsx
```

`CharacterCreator.jsx` remains the public Binding Shell used by the existing
Create Character route. It composes Crestfall-owned step editors, preview, page
header, and template modal, then injects them into the portable View.

## View ownership

`CharacterCreator.view.jsx` owns only the wizard layout, progress presentation,
step navigation controls, save/error presentation, and semantic callback
invocation. It does not know character storage fields, creation payloads,
templates, client APIs, routing, or persistence.

## ViewModel ownership

`useCharacterCreatorViewModel.js` owns:

- form and wizard state;
- progress calculation;
- template application;
- character payload construction through the existing character utilities;
- draft creation through `characterClient`;
- save/error state; and
- redirecting to Creation Edit after a successful create.

The legacy `components/studio/characters/hooks/useCharacterCreator.js` path is
retained as a compatibility adapter and delegates to the LOOM ViewModel.

## Application-owned child features

The following existing Crestfall features remain composed by the Shell rather
than imported by the portable View:

- Identity, Appearance, Body, Behavior, and Review step editors;
- Character Preview;
- Character Template Modal; and
- Studio Page Header.

Several nested controls are already LOOM features and continue to save through
the same `updateField` callback.

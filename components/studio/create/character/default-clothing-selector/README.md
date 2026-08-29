# Default Clothing Selector Loom Feature

## Public Shell

```text
components/studio/create/character/DefaultClothingSelector.jsx
```

The public Shell preserves the existing `form` / `updateField` API, binds the
ViewModel to the portable View, and mounts the existing Outfit Picker Binding
Shell only while a picker is open. This preserves the picker's current
on-demand data loading.

## Portable View

```text
components/studio/create/character/default-clothing-selector/
  DefaultClothingSelector.view.jsx
```

The View owns only the selected-clothing card, empty state, action buttons,
responsive layout, and semantic callbacks.

It does not know character form field names, creation payloads, featured-media
fallbacks, content-rating storage, picker fetching, or draft mutation rules.

## ViewModel

```text
components/studio/create/character/default-clothing-selector/
  useDefaultClothingSelectorViewModel.js
```

The ViewModel owns:

- current Outfit / Wardrobe / None mode interpretation;
- display normalization for the selected clothing source;
- picker disclosure;
- Outfit and Wardrobe picker configuration;
- selected-creation normalization into character form fields;
- clearing all default-clothing fields;
- application of field updates through the supplied `updateField` callback.

The existing named `getDefaultClothingInitialFields()` export remains available
from the public component path.

## Preview

```text
/dev/ui-preview/default-clothing-selector
```

The preview renders direct View-contract fixtures. Picker buttons and Clear
produce local feedback only; the route does not load owned creations or modify
an application draft.

## Live Callers

```text
components/studio/create/character/AppearanceStep.jsx
```

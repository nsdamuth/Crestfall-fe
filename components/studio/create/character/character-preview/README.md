# Character Preview Loom Feature

## Public Shell

```text
components/studio/create/character/CharacterPreview.jsx
```

The Shell preserves the existing public API:

```jsx
<CharacterPreview form={form} />
```

## Portable View

```text
components/studio/create/character/character-preview/CharacterPreview.view.jsx
```

The View receives display-ready identity values only. It does not receive the
raw character form or know fields such as `custom_species`,
`custom_gender_presentation`, `short_concept`, or the compatibility-backed default-clothing title (`clothing_style`).

## ViewModel

```text
components/studio/create/character/character-preview/useCharacterPreviewViewModel.js
```

The ViewModel owns raw-form normalization, custom identity sentinel handling,
and the existing empty, draft, and missing-custom-value fallbacks.

## Live Caller

```text
components/studio/create/character/CharacterCreator.jsx
```

## Preview

```text
/dev/ui-preview/character-preview
```

The preview renders direct View-contract fixtures only. It does not load a
character, update the builder form, call an API, or save data.

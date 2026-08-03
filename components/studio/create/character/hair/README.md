# Hair Loom Feature

**Status:** In-repository Loom conversion

**Contract version:** `1.0.0`

## Purpose

This feature separates Hair presentation from Crestfall character builder and
character edit form behavior.

```text
HairModal.jsx
        ↓
useHairModalViewModel.js
        ↓ semantic View contract
HairModal.view.jsx
```

## Public Shell Props

The existing import path and public props are preserved:

```jsx
<HairModal form={form} updateField={updateField} />
```

The current live consumers remain:

- `components/studio/create/character/AppearanceStep.jsx`
- `components/studio/my-creations/edit/sections/AppearanceSection.jsx`

## Ownership Boundary

The View owns:

- trigger and modal markup
- swatch and option layouts
- selection styling
- custom-input presentation
- responsive layout and accessibility

The ViewModel owns:

- Crestfall form-field mapping
- preset/custom-value detection
- trigger-summary calculation
- immediate `updateField` calls
- custom-value length enforcement
- modal and custom-section state

The View receives semantic section identifiers such as `hairColor`,
`hairLength`, `hairTexture`, and `hairStyle`. It does not receive Crestfall
storage field names.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/hair
```

The route renders the actual portable View from direct contract fixtures. It
does not load or save a character.

## Live Regression Checklist

1. Open the Hair trigger in character creation and character editing.
2. Choose preset color, length, texture, and style values.
3. Confirm the trigger summary updates immediately.
4. Choose Custom for each section and enter a value.
5. Close and reopen the modal; custom mode and text should remain correct.
6. Save the character.
7. Refresh and confirm all four values persist.

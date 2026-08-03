# Eye Color Loom Feature

**Status:** In-repository Loom conversion

**Contract version:** `1.0.0`

## Purpose

This feature separates Eye Color presentation from Crestfall character builder
and character edit form behavior.

```text
EyeColorModal.jsx
        ↓
useEyeColorModalViewModel.js
        ↓ semantic View contract
EyeColorModal.view.jsx
```

## Public Shell Props

The existing import path and public props are preserved:

```jsx
<EyeColorModal form={form} updateField={updateField} />
```

The current live consumers remain:

- `components/studio/create/character/AppearanceStep.jsx`
- `components/studio/my-creations/edit/sections/AppearanceSection.jsx`

## Ownership Boundary

The View owns:

- trigger and modal markup
- swatch layout and selection styling
- custom-input presentation
- responsive layout and accessibility

The ViewModel owns:

- the Crestfall `eye_color` form-field mapping
- preset/custom-value detection
- trigger-summary calculation
- immediate `updateField` calls
- custom-value length enforcement
- modal and custom-mode state

The View receives display-ready swatches and semantic option identifiers. It
does not receive Crestfall storage field names.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/eye-color
```

The route renders the actual portable View from direct contract fixtures. It
does not load or save a character.

## Live Regression Checklist

1. Open the Eye Color trigger in character creation and character editing.
2. Choose a preset eye color and confirm the trigger summary updates.
3. Confirm a preset choice closes the modal as before.
4. Choose Custom and enter a custom eye color.
5. Close and reopen the modal; custom mode and text should remain correct.
6. Save the character.
7. Refresh and confirm the eye color persists.

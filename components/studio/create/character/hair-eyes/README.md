# Hair & Eyes Loom Feature

**Status:** In-repository Loom conversion

**Contract version:** `1.0.0`

## Purpose

This feature separates the reusable Hair & Eyes presentation from Crestfall
builder state and form-field behavior.

```text
HairEyesModal.jsx
        ↓
useHairEyesModalViewModel.js
        ↓ semantic View contract
HairEyesModal.view.jsx
```

## Public Shell Props

The existing import path and public props are preserved:

```jsx
<HairEyesModal
  label="Eye Color"
  summaryField="eye_color"
  form={form}
  updateField={updateField}
/>
```

The current live consumers remain:

- `components/studio/create/character-template/CharacterTemplateBuilder.jsx`
- `components/studio/my-creations/edit/sections/character-templates/CharacterTemplateFieldsSection.jsx`

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
- summary-label resolution
- immediate `updateField` calls
- custom-value length enforcement
- modal and custom-section state

The View receives semantic section identifiers such as `eyeColor`,
`hairColor`, and `hairStyle`. It does not receive `eye_color`, `hair_color`,
or `hair_style` storage field names.

## Preview

Development-only route:

```text
http://localhost:3000/dev/ui-preview/hair-eyes
```

The route renders the actual portable View from direct contract fixtures. It
does not load or save a character, Player Character, or character template.

## Live Regression Checklist

For each supported workflow:

1. Open the Eye Color, Hair Color, and Hair Style triggers.
2. Choose preset values and confirm summaries update immediately.
3. Choose Custom and enter a custom value.
4. Close and reopen the modal; custom mode and text should remain correct.
5. Save the creation or template.
6. Refresh and confirm the values persist.

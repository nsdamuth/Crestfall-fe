# Skin Tone Loom Feature

**Status:** In-repository Loom conversion

**Contract version:** `1.0.0`

## Purpose

This feature separates Skin Tone presentation from Crestfall character,
player-character, and character-template form behavior.

```text
SkinToneModal.jsx
        ↓
useSkinToneModalViewModel.js
        ↓ semantic View contract
SkinToneModal.view.jsx
```

## Public Shell Props

The existing import path and public props are preserved:

```jsx
<SkinToneModal form={form} updateField={updateField} />
```

The current live consumers remain:

- `components/studio/create/character/AppearanceStep.jsx`
- `components/studio/create/player-character/PlayerCharacterCreator.jsx`
- `components/studio/create/character-template/CharacterTemplateBuilder.jsx`
- `components/studio/my-creations/edit/sections/AppearanceSection.jsx`
- `components/studio/my-creations/edit/sections/character-templates/CharacterTemplateFieldsSection.jsx`

## Ownership Boundary

The View owns:

- trigger and modal markup
- swatch layout and selection styling
- custom-input presentation
- responsive layout and accessibility

The ViewModel owns:

- the Crestfall `skin_tone` form-field mapping
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
http://localhost:3000/dev/ui-preview/skin-tone
```

The route renders the actual portable View from direct contract fixtures. It
does not load or save a character.

## Live Regression Checklist

1. Open the Skin Tone trigger in each applicable create/edit workflow.
2. Choose a preset skin tone and confirm the trigger summary updates.
3. Confirm a preset choice closes the modal as before.
4. Choose Custom and enter a custom skin tone.
5. Close and reopen the modal; custom mode and text should remain correct.
6. Save the creation or template.
7. Refresh and confirm the skin tone persists.

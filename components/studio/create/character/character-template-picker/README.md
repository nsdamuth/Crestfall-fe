# Character Template Picker Loom Feature

**Status:** In-repository Loom conversion

**Contract version:** `1.0.0`

## Purpose

This feature separates character-template picker presentation from Crestfall
character-form mutation behavior.

```text
CharacterTemplateModal.jsx
        ↓
useCharacterTemplateModalViewModel.js
        ↓ semantic View contract
CharacterTemplateModal.view.jsx
```

## Public Shell Props

The existing import path and public props are preserved:

```jsx
<CharacterTemplateModal
  templates={characterTemplates}
  onApply={applyTemplate}
  onClose={() => setTemplateModalOpen(false)}
/>
```

## Ownership Boundary

The View owns:

- modal, tab, search, card, and empty-state presentation
- responsive layout and accessibility
- safe invocation of semantic callbacks

The ViewModel owns:

- local tab and search state
- normalization of Crestfall template records into display cards
- template filtering
- future-tab copy selection
- translating a selected card ID back to the original template object
- invoking the existing `onApply(template)` callback

The Shell only binds the ViewModel to the View.

The View does not receive template `fields` payloads and does not know how a
chosen template mutates the character draft.

## Fixtures

Fixtures cover:

- populated built-in templates
- filtered results
- My Templates placeholder
- Community placeholder
- empty template collection
- long labels and descriptions

The preview route is development-only:

```text
/dev/ui-preview/character-template-picker
```

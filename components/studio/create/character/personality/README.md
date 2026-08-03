# Personality Modal Loom Feature

**Status:** In-repository Loom conversion

**Contract version:** `1.0.0`

## Purpose

This feature separates personality-archetype presentation from Crestfall
character and character-template form behavior.

```text
PersonalityModal.jsx
        ↓
usePersonalityModalViewModel.js
        ↓ semantic View contract
PersonalityModal.view.jsx
```

## Public Shell Props

The existing import path and public props are preserved:

```jsx
<PersonalityModal
  label="Outward Personality"
  field="outward_personality"
  form={form}
  updateField={updateField}
/>
```

## Ownership Boundary

The View owns:

- trigger and modal markup
- archetype-card layout and selection styling
- custom-entry presentation
- responsive layout and accessibility

The ViewModel owns:

- reading the requested Crestfall form field
- the built-in personality-archetype catalogue
- preset/custom detection and routing
- calling the existing `updateField(field, value)` callback
- local open, custom-mode, and custom-text state

The Shell only binds the ViewModel to the View.

## Fixtures

Fixtures cover:

- closed trigger
- selected preset
- no selected value
- custom entry
- internal-personality usage
- long labels and descriptions

The preview route is development-only:

```text
/dev/ui-preview/personality
```

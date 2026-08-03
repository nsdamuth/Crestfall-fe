# Trait Modal Loom Feature

**Status:** In-repository Loom conversion

**Contract version:** `1.0.0`

## Purpose

This feature separates reusable trait-picking presentation from Crestfall
character, player-character, and character-template form behavior.

```text
TraitModal.jsx
        ↓
useTraitModalViewModel.js
        ↓ semantic View contract
TraitModal.view.jsx
```

## Public Shell Props

The existing import path and public props are preserved:

```jsx
<TraitModal
  label="Body Type"
  field="body_type"
  form={form}
  updateField={updateField}
  options={bodyTypeOptions}
  description="Choose a broad body silhouette."
/>
```

## Ownership Boundary

The View owns:

- trigger and modal markup
- option-card layout and selection styling
- custom-entry presentation
- responsive layout and accessibility

The ViewModel owns:

- reading the requested Crestfall form field
- translating raw option objects into display-ready options
- preset/custom routing
- calling the existing `updateField(field, value)` callback
- local open, custom-mode, and custom-text state

The Shell only binds the ViewModel to the View.

## Fixtures

Fixtures cover:

- closed trigger
- selected preset
- no selected value
- custom entry
- missing description
- long labels and descriptions

The preview route is development-only:

```text
/dev/ui-preview/trait-modal
```

# Scenario Reference Picker Loom Feature

## Purpose

This feature separates the reusable Scenario reference picker presentation from
Scenario create/edit application behavior.

## Files

- `ScenarioReferencePickerModal.jsx` — explicit Binding Shell that preserves the existing import path.
- `ScenarioReferencePickerModal.view.jsx` — portable, API-free View.
- `useScenarioReferencePickerViewModel.js` — search, selection, and raw-option mapping behavior.
- `ScenarioReferencePickerModal.contract.js` — versioned semantic View boundary.
- `ScenarioReferencePickerModal.fixtures.js` — isolated visual states.
- `/app/dev/ui-preview/scenario-reference-picker` — development-only preview route.

## Preserved application contract

The Shell still accepts:

```js
{
  title,
  body,
  options,
  selected,
  multiple,
  onChange,
  onClose,
  emptyMessage,
}
```

For multiple selection, `onChange` still receives the updated array containing
the original option objects. For single selection, `onChange` still receives the
original selected option and the modal closes immediately.

## View boundary

The View receives display-ready cards and emits `onChooseItem(itemId)`. It does
not know Scenario field names, registry-binding storage, reference payload
shapes, or how create/edit workflows persist the selected references.

# Mechanics Module Picker Loom Feature

## Purpose

`MechanicsModulePickerModal` is the binding Shell for attaching reusable
Mechanics Module creations to locations, runtime mechanics sections, and story
rooms.

## Files

- `MechanicsModulePickerModal.view.jsx` owns modal presentation, source tabs,
  and visual search filtering.
- `useMechanicsModulePickerViewModel.js` owns client loading, exclusion,
  creation normalization, and callback translation.
- `MechanicsModulePickerModal.contract.js` documents the stable View boundary.
- `MechanicsModulePickerModal.fixtures.js` provides isolated visual states.
- `../MechanicsModulePickerModal.jsx` preserves the existing public import path.

## Application boundary

The View does not fetch Crestfall data or receive raw creation records. The
ViewModel loads owned and community Mechanics Modules through `/lib/client`,
excludes already-attached IDs, converts creations into display-ready cards, and
maps a selected card ID back to the original creation object before calling:

```js
onSelected(originalMechanicsModuleCreation)
```

Selection still closes the modal through the existing `onClose()` callback.

## Preview

Development-only route:

```text
/dev/ui-preview/mechanics-module-picker
```

The route renders fixtures only. It does not authenticate, load creations,
attach mechanics, update runtime bindings, or save application data.

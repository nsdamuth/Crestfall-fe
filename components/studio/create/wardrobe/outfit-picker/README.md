# Outfit Picker Loom Feature

## Purpose

`OutfitPickerModal` is the binding Shell for the reusable Outfit/Wardrobe
creation picker used by character clothing, wardrobe creation, and wardrobe
editing workflows.

## Files

- `OutfitPickerModal.view.jsx` owns modal presentation.
- `useOutfitPickerModalViewModel.js` owns loading, search, normalization, and
  callback translation.
- `OutfitPickerModal.contract.js` documents the stable View boundary.
- `OutfitPickerModal.fixtures.js` provides isolated visual states.
- `../OutfitPickerModal.jsx` preserves the existing public import path.

## Application boundary

The View must not import Crestfall client modules or receive raw creation
objects. The ViewModel loads owned creations through the existing client API,
converts them into display-ready cards, and translates a selected item ID back
to the original caller contract.

The caller-supplied `normalizeSelection` function remains application-owned.
It is invoked only by the ViewModel and is never passed to the View.

## Preview

Development-only route:

```text
/dev/ui-preview/outfit-picker
```

The route renders fixtures only. It does not authenticate, load creations, or
change character or wardrobe data.

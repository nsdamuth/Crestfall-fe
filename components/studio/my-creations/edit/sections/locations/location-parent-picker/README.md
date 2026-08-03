# Location Parent Picker Loom Feature

## Purpose

`LocationParentPickerModal` is the binding Shell for selecting the broader
Location creation that supplies hierarchy and inherited runtime context.

## Files

- `LocationParentPickerModal.view.jsx` owns modal presentation.
- `useLocationParentPickerModalViewModel.js` owns loading, exclusion, search,
  normalization, and callback translation.
- `LocationParentPickerModal.contract.js` documents the stable View boundary.
- `LocationParentPickerModal.fixtures.js` provides isolated visual states.
- `../LocationParentPickerModal.jsx` preserves the existing public import path.

## Application boundary

The View does not import Crestfall client modules or receive raw Location
creations. The ViewModel loads owned Locations through the existing client API,
excludes the current Location when supplied, converts results into display-ready
cards, and reconstructs the existing parent-location selection payload before
calling `onSelect`.

The existing caller contract remains:

```js
onSelect({
  parentLocationId,
  parentLocationTitle,
  parentLocationDescription,
  parentLocationImageUrl,
  parentLocationScale,
  parentLocationSpaceType,
});
```

## Preview

Development-only route:

```text
/dev/ui-preview/location-parent-picker
```

The route renders fixtures only. It does not authenticate, load Locations, or
change hierarchy or runtime inheritance data.

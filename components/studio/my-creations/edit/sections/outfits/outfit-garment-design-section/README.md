# Outfit Garment Design Section Loom Boundary

## Public Shell

```text
components/studio/my-creations/edit/sections/outfits/OutfitGarmentDesignSection.jsx
```

The public Shell preserves the existing `form` and `updateDataField` API used by
Creation Edit.

## Portable View

```text
OutfitGarmentDesignSection.view.jsx
```

The View owns only the garment-design form presentation. It receives
presentation-ready strings and semantic callbacks. It does not inspect the raw
creation form, know Outfit JSON storage fields, resolve legacy design values,
or save a creation.

## ViewModel

```text
useOutfitGarmentDesignSectionViewModel.js
```

The ViewModel owns:

- `form.data` access;
- `silhouette`, `fit`, `coverage`, and `style_language` mapping;
- `clothing_pieces` mapping;
- current `design_notes` and legacy `design_reference` compatibility;
- mapping semantic changes back to exact stored field names.

## Contract and Fixtures

The contract version is `1.0.0`. Fixtures are direct View-contract objects and
cover populated, empty, legacy-note, minimal, long-content, alternate-copy, and
missing-callback states.

## Preview

```text
/dev/ui-preview/outfit-garment-design-section
```

The preview is blocked in production and updates local fixture state only.

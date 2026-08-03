# Image Preset Identity Section Loom Boundary

## Public Shell

```text
components/studio/my-creations/edit/sections/image-presets/ImagePresetIdentitySection.jsx
```

The public Shell preserves the existing `form` and `updateDataField` API used by
Creation Edit.

## Portable View

```text
ImagePresetIdentitySection.view.jsx
```

The View owns only the Image Preset identity form presentation. It receives
presentation-ready strings and semantic callbacks. It does not inspect the raw
creation form, know JSON storage fields, resolve legacy style-family values,
parse tags, or save a creation.

## ViewModel

```text
useImagePresetIdentitySectionViewModel.js
```

The ViewModel owns:

- `form.data` access;
- the existing Image Preset name `data.name ?? form.title` behavior;
- current `category` and legacy `style_family` compatibility;
- `intended_use` mapping;
- comma-separated tag formatting and parsing;
- mapping semantic changes back to exact stored field names.

## Contract and Fixtures

The contract version is `1.0.0`. Fixtures are direct View-contract objects and
cover populated, empty, title-fallback, legacy-style-family, long-content,
alternate-copy, and missing-callback states.

## Preview

```text
/dev/ui-preview/image-preset-identity-section
```

The preview is blocked in production and updates local fixture state only.

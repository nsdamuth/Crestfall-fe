# Image Preset Style / Medium LOOM Feature

## Public Shell

```text
components/studio/my-creations/edit/sections/image-presets/
  ImagePresetStyleMediumSection.jsx
```

The existing public import path is retained. The Shell invokes the ViewModel and
renders the portable View.

## Portable View

```text
image-preset-style-medium-section/
  ImagePresetStyleMediumSection.view.jsx
```

The View owns the Style / Medium form presentation only. It receives
presentation-ready values and semantic edit callbacks. It does not inspect the
creation form, know stored Image Preset field names, resolve legacy fields, or
save data.

## ViewModel

```text
image-preset-style-medium-section/
  useImagePresetStyleMediumSectionViewModel.js
```

The ViewModel owns:

- reading `form.data`;
- current `artist_influence`, `rendering_mode`, and `style_notes` fields;
- legacy `era_influence`, `rendering_style`, and `design_reference` fallbacks;
- exact current-field callback mapping through `updateDataField`.

Current fields take precedence. New edits continue writing only to the current
fields; legacy data is read but is not rewritten or removed by this feature.

## Contract and Fixtures

```text
ImagePresetStyleMediumSection.contract.js
ImagePresetStyleMediumSection.fixtures.js
```

Fixtures are direct View-contract objects and contain no production data or API
behavior.

## Development Preview

```text
/dev/ui-preview/image-preset-style-medium-section
```

The preview is unavailable in production and updates fixture-local state only.

## Live Validation

Validate the Style / Medium section while editing an Image Preset. Confirm all
seven fields save and reload, and confirm older presets using the three legacy
fallback fields continue displaying their stored values.

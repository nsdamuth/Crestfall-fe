# Image Preset Rendering Notes LOOM Feature

## Public Shell

```text
components/studio/my-creations/edit/sections/image-presets/
  ImagePresetRenderingNotesSection.jsx
```

The existing public import path and `form` / `updateDataField` interface are
retained.

## Ownership

The ViewModel reads the raw Image Preset creation form, preserves the legacy
`atmosphere` fallback for the current `mood` field, and maps semantic edits to
these current stored fields:

```text
lighting_style
detail_level
linework
shading
mood
composition_style
rendering_guidance
```

Current `mood` data takes precedence over legacy `atmosphere`. New edits write
only to `mood`; this conversion does not rewrite or remove legacy data.

The portable View owns only the Rendering Notes form presentation and semantic
edit callbacks. It does not save creations or know Image Preset persistence.

## Preview

```text
/dev/ui-preview/image-preset-rendering-notes-section
```

The preview is unavailable in production and updates fixture-local state only.

## Live Validation

Edit an Image Preset and confirm all seven Rendering Notes values save and
reload. Also confirm an older preset using only `atmosphere` still displays that
value in Mood / Atmosphere.

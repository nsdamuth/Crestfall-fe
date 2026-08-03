# ImagePresetPromptStackSection LOOM boundary

## Public Binding Shell

```text
components/studio/my-creations/edit/sections/image-presets/
  ImagePresetPromptStackSection.jsx
```

The Shell preserves the existing `form` and `updateDataField` public API.

## Portable View

```text
image-preset-prompt-stack-section/
  ImagePresetPromptStackSection.view.jsx
```

The View owns only prompt-stack form presentation and semantic edit callbacks.
It must not inspect creation forms, know JSON field names, resolve legacy
prompt data, enforce save behavior, or call application APIs.

## ViewModel

```text
image-preset-prompt-stack-section/
  useImagePresetPromptStackSectionViewModel.js
```

The ViewModel owns:

- `prompt_guidance` with legacy `prompt` read fallback;
- `style_prompt`;
- `quality_notes`;
- `image_prompt` and its 2,000-character limit;
- `negative_prompt` and its 2,000-character limit;
- `usage_notes`;
- `compatibility_notes`;
- semantic callback mapping to `updateDataField`.

Current fields take precedence over legacy values. New edits write only to the
current fields; legacy data is not rewritten or removed.

## Preview

```text
/dev/ui-preview/image-preset-prompt-stack-section
```

The preview is development-only and returns `notFound()` in production.
Fixture edits update local preview state only and never modify a real creation.

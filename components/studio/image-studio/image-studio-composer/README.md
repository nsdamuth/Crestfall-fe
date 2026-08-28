# Image Studio Composer Loom Feature

## Public entry point

```text
components/studio/image-studio/ImageStudioComposer.jsx
```

## Feature files

```text
components/studio/image-studio/image-studio-composer/
  ImageStudioComposer.view.jsx
  useImageStudioComposerViewModel.js
  ImageStudioComposer.contract.js
  ImageStudioComposer.fixtures.js
  README.md
```

## Ownership

The Binding Shell preserves the existing `ImageStudioComposer` import path and
passes the current public props into the ViewModel.

The ViewModel owns:

- Image versus Video mode normalization;
- ingredient-slot and custom-editor composition;
- Image Studio option data, bounded workflow-tuning projection, and controlled callbacks;
- generation availability and feedback normalization;
- coin-balance presentation values;
- composition of the validated Ingredient Slot, Custom Ingredient Editor, and
  Video Tools ViewModels.

The portable View owns:

- the sticky composer panel;
- mode-switcher presentation;
- presentation-local options disclosure;
- prompt and negative-prompt controls;
- option selectors and the workflow-specific Advanced tuning disclosure;
- generation-button presentation;
- coin and generation feedback;
- direct composition of the validated portable child Views.

Advanced workflow tuning is intentionally semantic and bounded: the FE exposes
reference influence, target-style balance, and first/second pass detail only for
validated hybrid profiles. CFG, sampler, scheduler, model, and unrestricted node
parameters are not exposed. Untouched controls remain payload-neutral.

The View does not own image-generation requests, media history, ingredient
pickers, preset persistence, coin loading, account mutations, or Image Studio
application state.

## Public API

The current `ImageStudioComposer` public props are preserved. The only live
caller remains:

```text
components/studio/image-studio/ImageStudioWorkbench.jsx
```

## Preview

```text
/dev/ui-preview/image-studio-composer
```

The preview uses contract-shaped fixtures and local callback state. It does not
load Image Studio history, open production ingredient pickers, spend coins,
call the image-generation API, save presets, or persist application data.

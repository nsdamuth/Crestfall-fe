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
- Image Studio option data and controlled callbacks;
- generation availability and feedback normalization;
- coin-balance presentation values;
- composition of the validated Ingredient Slot, Custom Ingredient Editor, and
  Video Tools ViewModels.

The portable View owns:

- the sticky composer panel;
- mode-switcher presentation;
- presentation-local options disclosure;
- prompt and negative-prompt controls;
- option selectors;
- generation-button presentation;
- coin and generation feedback;
- direct composition of the validated portable child Views.

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

## W52 contract alignment

The public View contract is `1.1.0` and declares the Camera/scenery presentation
surface already made live by W39:

- `showSceneryOnlyHelper`
- `sceneryOnlyHelperEnabled`
- `cameraPresetValue`
- `cameraPresetLabel`
- `cameraPresetDescription`
- `onChangeSceneryOnlyHelper`
- `onOpenCameraPresetPicker`

Camera framing is selected through the grouped Camera Preset Picker modal. The
composer View only opens the picker and displays the selected summary; tested
prompt fragments remain in `imageStudioData.js` and are appended by the
Workbench request composer.

This contract alignment does not move Camera prompt construction, scenery
prompt expansion, Image Studio state, generation requests, API authority, or
persistence into the View.

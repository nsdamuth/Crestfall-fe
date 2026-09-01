# Character Preview Loom Feature

## Public Binding Shell

```text
components/studio/create/character/CharacterPreview.jsx
```

The Shell preserves the existing form-display API and accepts controlled live
preview generation state from the Character creator application boundary.

## Portable View

```text
components/studio/create/character/character-preview/CharacterPreview.view.jsx
```

The View receives display-ready identity values plus controlled preview status,
image URL, error copy, and CTA callback. It does not receive the raw Character
form, construct image-generation payloads, save drafts, poll jobs, spend Coins,
or call APIs.

## ViewModel

```text
components/studio/create/character/character-preview/useCharacterPreviewViewModel.js
```

The ViewModel owns raw-form display normalization and maps controlled generation
state into View props. The preview price is the normal Image Studio cost: 5
Coins.

## Generation Contract

```text
components/studio/create/character/character-preview/characterPreviewGeneration.js
lib/client/studio/characters/characterPreviewClient.js
```

The current V2 seven-stop Character creator owns the consequential sequence:

```text
explicit Generate preview tap
  -> persist current Character draft
  -> submit one image-generation job using that Character asset
  -> services-api charges the normal 5 Coins
  -> poll normal image-generation history until the job output is ready
  -> render the generated display derivative in the preview panel
```

The request uses `renderProfileKey: auto`, allowing services-api to honor the
saved Character's Default Rendering Style. No Outfit, Pose, Location, or Image
Preset is silently selected by the preview; the Character's authored default
clothing may still resolve through the normal backend Character contract.

Any edit to the Character invalidates the displayed preview so stale art is not
presented as the current form.

## Development Preview

```text
/dev/ui-preview/character-preview
```

The development preview remains fixture-only and never spends Coins or calls an
API.

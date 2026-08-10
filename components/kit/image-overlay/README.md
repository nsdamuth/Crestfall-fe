# Kit Image Overlay LOOM Package (INTERIM)

**Contract:** `KitImageOverlay.contract.js` (`0.1.0-interim`)

## This is an interim shape

This package **converts to the unified modal frame (section 2.5) in
batch 2**. It exists now so `KitCreationCard` and `KitCreatorCard` have
a real destination for `assetKind: "image"` and every thumbnail this
batch, without waiting on `modal-frame`. Do not extend this component
with new affordances; extend the modal-frame version once it ships.

## Purpose

The image destination ratified in `docs/BUILD-BLUEPRINT.md` section
2.14: full image display, love, save, share. No download, details,
report, or remix; those live on the production `MediaLightbox`
(`components/studio/media/media-lightbox`) and are reconciled at the
batch-2 conversion, not duplicated here.

## Boundary

```text
KitImageOverlay.jsx
  -> useKitImageOverlayViewModel.js
  -> KitImageOverlay.view.jsx
```

## States

The veil is REST only; Love, Save, and Share each carry their own
five states, Love and Save additionally carry an active/toggled
visual.

## Package assets

- `KitImageOverlay.contract.js`
- `KitImageOverlay.fixtures.js`
- `useKitImageOverlayViewModel.js`
- `/dev/ui-preview/kit-image-overlay`

The preview is fixture-only.

# Kit Image Overlay LOOM package

**Contract:** `KitImageOverlay.contract.js` (`1.0.0`)

## Converted onto the unified modal frame

Batch-2 conversion (`docs/BUILD-BLUEPRINT.md` section 2.5), landed
this pass per `docs/SPRINT-A-PLAN.md` section 4. The package is now
the whole destination: callers render `<KitImageOverlay ... />` when
open, no external `ModalShell` wrapper. The shell composes
`KitModalFrame` (variant `modal`, `panelClassName="w-full
max-w-[76rem] min-[700px]:w-fit"`), which owns the veil, panel, and
close control; the view owns only the image block, the title line,
and the love/save/share action row.

## Purpose

The destination every `image`-kind media card and every creator card
thumbnail opens (`docs/BUILD-BLUEPRINT.md` section 2.14): full image
display, love, save, share. No download, details, report, or remix;
those live on the production `MediaLightbox`
(`components/studio/media/media-lightbox`) and are reconciled at that
surface's own conversion, not duplicated here.

## Boundary

```text
KitImageOverlay.jsx
  -> KitModalFrame (components/kit/KitModalFrame.jsx)
  -> useKitImageOverlayViewModel.js
  -> KitImageOverlay.view.jsx
```

## States

The veil is REST only (frame anatomy); every action button carries its
own five states, Love and Save additionally carry an active/toggled
visual.

## Package assets

- `KitImageOverlay.contract.js`
- `KitImageOverlay.fixtures.js`
- `useKitImageOverlayViewModel.js`
- `/dev/ui-preview/kit-image-overlay`

The preview is fixture-only.

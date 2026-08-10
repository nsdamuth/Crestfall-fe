# Kit Image Overlay LOOM package

**Contract:** `KitImageOverlay.contract.js` (`1.0.0`)

## Recomposed treatment, RULED 10 Aug 2026 (kit polish 3 pass, R4)

Presentation-only recomposition, `docs/SPRINT-A-POLISH-PLAN.md` section
3; the package's prop surface is unchanged so the contract stays
`1.0.0` (contract law: presentation may change, reporting may not).
The shell composes `KitModalFrame` (variant `modal`,
`panelClassName="w-full max-w-[76rem]"`, the prior `min-[700px]:w-fit`
shrink-wrap removed so the image spans the modal's full inner width,
needed for a stable zoom viewport).

One framed figure block spans the panel's full inner width: a thin
gold hairline (`1px solid var(--gold-ornament)`, `--radius-md`,
`overflow-hidden`) around the image viewport (`object-contain`,
`--canvas` bed, `max-h-[65vh]` under 700px, `70vh` at 700px and up)
AND the Love/Save/Share action shelf directly beneath the image
inside the same frame (`--surface-1`, `border-t border-[var(--line)]`,
`p-[var(--space-3)]`, centered row, behavior unchanged). The title
moves below the figure in `--ink` (it now sits on the `--surface-4`
panel, not on art; the prior `--art-ink` use is corrected as part of
this recomposition).

## Zoom and pan

Presentation-only local state in the view (scale, translate), no
effects on product data:

- Pinch on touch zooms (two-pointer distance via pointer events).
- Pointer drag pans while zoomed only (`cursor-grab` /
  `cursor-grabbing`); at scale 1 the viewport does not intercept
  drag, so the backdrop press-and-drag dismissal guard on
  `KitModalFrame`/`ModalShell` is never confused.
- Desktop defaults (R4 names touch only; this is the built default,
  logged as OPEN FOR BRIAN item 9): wheel over the viewport zooms
  toward the cursor (`preventDefault` scoped to the viewport so panel
  scroll elsewhere is untouched), double-click toggles 1x/2x.
- Ceiling 4x, floor 1x. Translate is clamped to the scaled image's
  overflow so it never pans fully out of the viewport.
- Reset on close: the overlay unmounts on close everywhere it is
  used, so scale and translate reset by construction. A future
  persistent-mount consumer would need to reset explicitly.
- `touch-action: none` on the viewport only while zoomed.

## Purpose

The destination every `image`-kind media card and every creator card
thumbnail opens (`docs/BUILD-BLUEPRINT.md` section 2.14): full image
display, love, save, share, plus zoom and pan. No download, details,
report, or remix; those live on the production `MediaLightbox`
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

The frame (hairline plus shelf) is REST only; every action button
carries its own five states, Love and Save additionally carry an
active/toggled visual per the selection-state law. The no-image
fallback keeps the shelf reachable; zoom is disabled when there is no
image.

## Package assets

- `KitImageOverlay.contract.js`
- `KitImageOverlay.fixtures.js`
- `useKitImageOverlayViewModel.js`
- `/dev/ui-preview/kit-image-overlay`

The preview is fixture-only; zoom and pan are interactive and not
fixture-capturable.

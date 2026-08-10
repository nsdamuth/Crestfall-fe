# Kit Image Overlay LOOM package

**Contract:** `KitImageOverlay.contract.js` (`1.0.0`)

## Recomposed treatment, RULED 10 Aug 2026 (kit polish 3 pass, R2/R5)

Presentation-only recomposition, `docs/SPRINT-D-PLAN.md` section 1.2;
the package's prop surface is unchanged so the contract stays `1.0.0`
(contract law: presentation may change, reporting may not). The shell
composes `KitModalFrame` `variant="viewer"` (no `panelClassName` width
cap: the panel is a transparent full-viewport column, not a bounded
surface).

The viewer is its own surface, never a panel with an image inside it:

- **Veil**: the sticky nav chrome-frost treatment
  (`bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)]` plus
  `backdrop-blur-[var(--blur-chrome)]`), the same recipe as
  `StudioTopBar` and `KitStudioFilterBar`. No `--scrim-strong`, no
  `--blur-panel` on this surface.
- **Panel**: none. No background, border, shadow, or radius anywhere;
  a transparent, full-viewport (`h-[100dvh] w-full`) flex column whose
  only chrome is the frame's close control, absolutely positioned top
  right. The panel and the figure column are click-transparent
  (`pointer-events-none`, R3 review-gate fix, 10 Aug 2026): only the
  hairline frame, the shelf, and the close control accept pointer
  events, so a click anywhere else reaches the veil and dismisses
  (backdrop click, close control, and Escape all close, standing
  Sprint A law).
- **The figure column**: shrink-wrapped (`w-fit max-w-full` at every
  width, R5 review-gate fix: on mobile too, so the shelf snaps to a
  narrow image's own width instead of spanning the viewport), with
  `--space-2` gutters under 700px, centered in the viewport.
  - **The gold hairline** (`1px solid var(--gold-ornament)`,
    `--radius-md`, `overflow-hidden`) wraps the IMAGE ALONE, snapped
    to its rendered edges. Never around empty space: the image is
    sized by `max-width`/`max-height` with `width`/`height: auto` (no
    `object-fit` box independent of the image), so the frame always
    hugs the actual rendered pixels at both breakpoints. Desktop caps
    `max-w-[min(88vw,76rem)]` `max-h-[78dvh]`; under 700px the image
    takes the maximum space the flex-1 hairline (itself bounded by the
    column's `h-full`, shared with the action shelf) allows.
  - **The action shelf** sits directly beneath, width-synced to the
    hairline by construction: both are children of the same
    `items-center` flex column, and the shelf uses `self-stretch`
    (not a hardcoded width) to match whatever width the hairline
    shrank to around the image. Bed RULED darker and slightly
    translucent (R1, 10 Aug 2026): the sticky-chrome recipe's exact
    composition, `bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)]`,
    replacing the `--surface-1` bed so focus stays on the image; no
    new value minted. `--line` border, `--radius-md`,
    `p-[var(--space-3)]`, centered row, Love/Save/Share unchanged.
- **No visible title line** (OPEN FOR BRIAN item 11, plan 1.2): the
  witness renders no text around the image. `title` is forwarded as
  the frame's `ariaLabel`, the accessible name only.
- **No-image fallback**: a fixed `aspect-[5/3]` `w-[min(88vw,40rem)]`
  `--surface-1` stand-in box inside the hairline, at every width; the
  shelf still renders beneath (actions stay reachable); zoom disabled.

## Zoom and pan

Unchanged from the R4 build, presentation-only local state in the
view (scale, translate), no effects on product data, now operating on
the hairline-framed image box (which also serves as the zoom viewport
and pan-clamp measurement container):

- Wheel over the frame zooms toward the cursor (`preventDefault`
  scoped to the frame so page scroll elsewhere is untouched).
- Double-click toggles 1x/2x.
- Two-pointer pinch zooms; one-pointer drag pans while zoomed only.
- Ceiling 4x, floor 1x. Translate is clamped to the scaled image's
  overflow so it never pans fully out of the frame.
- Reset on close: the overlay unmounts on close everywhere it is
  used, so scale and translate reset by construction.
- `touch-action: none` on the frame only while zoomed.

## Purpose

The destination every `image`-kind media card and every creator card
thumbnail opens (`docs/BUILD-BLUEPRINT.md` section 2.16 (r)): full
image display, love, save, share, plus zoom and pan. No download,
details, report, or remix; those live on the production
`MediaLightbox` (`components/studio/media/media-lightbox`) and are
reconciled at that surface's own conversion, not duplicated here.

## Boundary

```text
KitImageOverlay.jsx
  -> KitModalFrame (components/kit/KitModalFrame.jsx), variant="viewer"
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
fixture-capturable. Fixture states cover default, loved, saved,
longest title, no image, and (R2, 10 Aug 2026) the four aspect
witnesses: wide, tall, square, tiny.

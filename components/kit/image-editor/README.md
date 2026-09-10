# Kit Image Editor LOOM package

**Contract:** `KitImageEditor.contract.js` (`1.0.0`)

## Purpose

The brush editor inside the image viewer (FE/MEDIA-STUDIO session 3,
Brian's note 6a, 10 Sep 2026). Edit lives in the image viewer only,
never a sidebar tab, never a composer mode. Painting areas, adjusting
the crop, or both is one edit run for one flat cost the caller
supplies; every result is a new linked library item, never an
overwrite. The editor writes nothing: it reports a payload (mask,
crop, prompt) and the page decides what to do with it.

## Boundary

```text
KitImageEditor.jsx
  -> useKitImageEditorViewModel.js
  -> KitImageEditor.view.jsx
     -> ImageFrame (components/kit/image-overlay/ImageFrame.jsx,
        the gold hairline frame with zoom and pan, shared with the
        overlay and the viewer)
     -> growTextarea (components/kit/form-field)
```

Composed only by `components/kit/image-viewer`. No fetch, no coin
literal: `editRunCoinCost` and `editState` arrive as props from the
page, which reads them from the workbench ViewModel the way the
composer reads the generation cost.

## Honest Soon

The Chassis has no inpainting, mask, or crop job today, so the live
page passes `editState="soon"`: Generate renders disabled, with the
coin glyph and the cost, the Soon chip, and the title "Not available
yet". Everything local works now: brush, eraser, three sizes, undo,
redo, the crop box with drag handles, and the pixel entry. See gap 8
in `docs/handoffs/MEDIA-STUDIO-BACKEND.md` for the call the page will
make.

## Drawing model (ruled at the plan gate, option A of three)

Strokes are recorded in image pixels, `{ tool, size, points[] }`, and
replayed onto a canvas whose pixel buffer is the image's native size;
CSS scales the canvas to the rendered image, so the preview rides the
frame's zoom and pan for free. Undo and redo move whole strokes
between two lists. The eraser paints with destination-out. The
preview canvas reads its color from the gold-action token through the
element's own computed color, at half strength over the art. The
export (`buildMaskDataUrl`) is a PNG at native size, white where
painted, black elsewhere: those two keywords are the bitmap's data
values, not interface colors.

Brush sizes are fractions of the image's short edge (`BRUSH_SIZE_STEPS`),
so a stroke reads the same on a small and a large image.

## Crop

A single box: a strong line, eight 44px handles, the dark wash outside
it cast by the box's own shadow in `--scrim-strong` and clipped by the
frame. Drag the body to move, a handle to resize. The pixel entry (W x
H, "Set size") sets the box around its current center. A size larger
than the image stops at the image edge and shows "Larger sizes need
Upscale" with a "Go to Upscale" action that asks the caller to move
focus to the viewer's Upscale control. Nothing invents pixels.

## Phone framing (ruled at the plan gate, option A of three)

One column. The rows below the image (toolbar, crop entry, prompt) are
fixed; the image shrinks to what is left through its own caps. Nothing
scrolls the canvas away. Zoom pauses while a brush, the eraser, or the
crop tool is active and returns with the hand tool. Every target is
`--control-md` (44px).

## Fixtures

`KitImageEditor.fixtures.js`: default (soon), ready with strokes,
cropping, crop larger than the image, pending, longest title, no image.
Preview routes are retired as a review surface (29 Aug 2026); review is
on the live page, signed in.

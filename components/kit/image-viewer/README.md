# Kit Image Viewer LOOM package

**Contract:** `KitImageViewer.contract.js` (`1.0.0`)

## Purpose

The image viewer that opens from a library item on the live Media
Studio page (FE/MEDIA-STUDIO session 3, Brian's notes 6 and 6a, RULED
10 Sep 2026). It replaces the legacy `MediaLightbox` on
`/studio/v2/images` only; the legacy Images page and the creation
image library keep the lightbox. Ruled at the plan gate, option A of
three: a new Kit viewer on the existing frame, the page keeping every
operation's handler.

## Boundary

```text
KitImageViewer.jsx
  -> useKitImageViewerViewModel.js
  -> KitImageViewer.view.jsx
     -> KitModalFrame variant="viewer" (composed by the shell: the B7
        veil, no panel chrome, the close control, full screen under
        700px)
     -> ImageFrame (components/kit/image-overlay/ImageFrame.jsx: the
        gold hairline, zoom and pan, pinch on touch, shared with the
        mockup overlay)
     -> KitImageEditor (edit mode; Edit lives here and nowhere else)
     -> InfoTip and MenuRow (components/kit/form-field, shared with
        the composer)
```

Live call site: `app/studio/v2/images/images-live/ImagesV2ImageViewer.jsx`,
the page adapter, injected through `MediaHistoryGridSkin`'s
`renderLightbox`. The adapter keeps calling `useMediaLightboxViewModel`
for delete, details, report, share, and assign, and renders the
lightbox's dialogs through `overlaySlot`, so what the viewer reports
to the application is unchanged (contract law).

## Anatomy

- **Header** (glass, `--panel-glass` at `--blur-panel`): the title;
  then the image's current pixel size beside the Upscale control (the
  only place Upscale exists) with an "i" tooltip explaining what
  upscale is for, the produced size never stated because it comes
  from the server; then the icon row: Delete, Report, Details,
  Download, Save. No rename pencil, no heart (note 6).
- **Download size menu**: Small, Medium, Large, Extra Large, the
  composer's menu recipe. Rows are download anchors. The Large row
  shows the measured pixel size; Small and Medium carry no numbers
  because the server does not tell the page its variant sizes. Extra
  Large is grey with the Soon chip and "Not available yet" until the
  image has been upscaled.
- **Frame**: the gold hairline hugging the image, zoom and pan (wheel
  and drag on desktop, pinch and drag on touch, double click to zoom).
- **Bottom bar** (gold ink): Edit (no cost on it), Assign, Share.
  Assign is live when the page says the image can be reassigned;
  otherwise it renders disabled with the Soon chip (an image with no
  asset has no assign call yet, gap 11).
- **Thumbnail strip**: view mode only, hidden in edit mode.
- **Edit mode**: the frame, bar, and strip give way to
  `KitImageEditor` under the same header.

## Costs and readiness

`upscaleCoinCost` and `editRunCoinCost` are props. The live page reads
`UPSCALE_COIN_COST` and `EDIT_RUN_COIN_COST` from the workbench
ViewModel through `mediaHistoryProps.viewerCoinCosts`, the way the
composer reads the generation cost. No View imports a constant and no
copy writes a number. `upscaleState` and `editState` are "soon" today:
disabled controls with the coin glyph and cost, the Soon chip, and
the title "Not available yet". Gap lines 8 to 12 in
`docs/handoffs/MEDIA-STUDIO-BACKEND.md` name the calls.

## Pixel size

`pixelSize` is the stored size when the page has one; when it is null
the viewer measures the image on load, keyed by source, and the
header reads "Measuring size..." until then.

## Phone

Full screen through the frame variant. One column: header, image, bar,
strip; the image shrinks through its own caps so nothing scrolls. Every
target is `--control-md` (44px).

## Fixtures

`KitImageViewer.fixtures.js`: default, single item, assignable, saved
with a share message, longest title, no stored size, no image, upscale
pending. Preview routes are retired as a review surface (29 Aug 2026);
review is on the live page, signed in.

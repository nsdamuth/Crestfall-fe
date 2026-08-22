# Kit Image Overlay LOOM package

**Contract:** `KitImageOverlay.contract.js` (`1.1.0`)

## B7 viewer final, RULED 22 Aug 2026 (Fable law review, ED1F propagation plan group G3)

Supersedes the R2/R5 recomposition (`docs/BUILD-BLUEPRINT.md` 2.16
(r)). Additive contract bump 1.0.0 to 1.1.0: six new optional action
callbacks join the existing prop surface, every prior caller keeps
working unchanged. The shell composes `KitModalFrame`
`variant="viewer"` (no `panelClassName` width cap: the panel is a
transparent full-viewport column, not a bounded surface).

**Cross-boundary note**: the veil color/blur is owned by
`components/kit/modal-frame/` (`useKitModalFrameViewModel.js`,
viewer-only `VARIANT_VEIL` entry), outside this package's own files.
That constant was updated to the B7 recipe (`--chrome-wash` at
`--blur-panel`, 2px) as part of this pass since it is exclusively
consumed by this viewer and the change was required to deliver the
manifest's veil requirement. The close control's desktop-vs-390
repositioning was left as the frame's existing single top-right
recipe (BLOCKED, see the G3 execution report) pending a ruling on
whether that touch belongs to this pass or its own follow-on.

The viewer is its own surface, never a panel with an image inside it:

- **Veil**: the lawful 2px veil at the `--chrome-wash` color, paired
  with `--blur-panel` ("lawful 2px veil, no glass extension", B7,
  reverses R2). Owned by `KitModalFrame`, see the note above.
- **Panel**: none. No background, border, shadow, or radius anywhere;
  a transparent, full-viewport (`h-[100dvh] w-full`) flex column whose
  only chrome is the frame's close control, absolutely positioned top
  right. The panel and the figure column are click-transparent
  (`pointer-events-none`, R3 review-gate fix, 10 Aug 2026): only the
  header, the hairline frame, the bottom bar, the delete-confirm
  panel, and the close control accept pointer events, so a click
  anywhere else reaches the veil and dismisses (backdrop click, close
  control, and Escape all close, standing Sprint A law).
- **The figure column**: shrink-wrapped (`w-fit max-w-full` at every
  width, R5 review-gate fix: on mobile too, so the header and bottom
  bar snap to a narrow image's own width instead of spanning the
  viewport), with `--space-2` gutters under 700px, centered in the
  viewport.
  - **The header** (new, B7): a two-line glass surface
    (`--panel-glass` paired with `--blur-panel`, 2px), `self-stretch`
    to width-match the hairline. Line one is the centered visible
    title (OPEN FOR BRIAN item 11 now resolved: the title renders, it
    is no longer accessible-name-only). Line two is the six-icon row
    in quiet ink: delete, report, details, download, bookmark, like,
    in that order. Bookmark and like reuse the existing
    `isSaved`/`onSave` and `isLoved`/`onLove` props; delete opens the
    package's own B5 danger-confirm step (below) rather than firing
    `onDelete` directly.
  - **The gold hairline** (`1px solid var(--gold-ornament)`,
    `--radius-md`, `overflow-hidden`) wraps the IMAGE ALONE, snapped
    to its rendered edges. Never around empty space: the image is
    sized by `max-width`/`max-height` with `width`/`height: auto` (no
    `object-fit` box independent of the image), so the frame always
    hugs the actual rendered pixels at both breakpoints. Desktop caps
    `max-w-[min(88vw,76rem)]` `max-h-[78dvh]`; under 700px the image
    takes the maximum space the flex-1 hairline (itself bounded by the
    column's `h-full`, shared with the header and bottom bar) allows.
  - **The bottom bar** (replaces the old Love/Save/Share shelf, B7):
    Generate Variant, Reassign Asset, Share, in `--gold-action` ink
    with `--gold-bright` hover, on a `--panel-glass` bed
    (`self-stretch`, width-matched to the header by the same
    construction). Reassign Asset always renders disabled: an honest
    stub, CR-055, filed by this build since no backend operation
    exists yet.
- **Delete confirm** (B5, new): clicking the header's delete icon
  replaces the header/image/bottom-bar column with a single glass
  confirm panel (fade divider, "Keep image" / "Delete" footer, the
  `.cf-btn--danger-filled` recipe) instead of firing `onDelete`
  immediately. Copy carries the CR-054 "[X] days" placeholder; the
  recovery window is not yet ruled to a single number.
- **No-image fallback**: a fixed `aspect-[5/3]` `w-[min(88vw,40rem)]`
  `--surface-1` stand-in box inside the hairline, at every width; the
  header and bottom bar still render (actions stay reachable); zoom
  disabled.

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
image display, the B7 six-icon row (delete, report, details,
download, bookmark, like), the B7 bottom bar (Generate Variant,
Reassign Asset, Share), plus zoom and pan. The action set now matches
the production `MediaLightbox` (`components/studio/media/media-
lightbox`) per B7; both packages carry their own contract bump rather
than sharing one component.

## Boundary

```text
KitImageOverlay.jsx
  -> KitModalFrame (components/kit/KitModalFrame.jsx), variant="viewer"
  -> useKitImageOverlayViewModel.js
  -> KitImageOverlay.view.jsx
```

## States

The frame (header, hairline, bottom bar) is REST only; every action
button carries its own five states, Bookmark and Like additionally
carry an active/toggled visual per the selection-state law. Reassign
Asset is a permanent disabled state (CR-055 stub). Delete opens the
B5 confirm panel in place of the header/image/bottom-bar column. The
no-image fallback keeps the header and bottom bar reachable; zoom is
disabled when there is no image.

## Package assets

- `KitImageOverlay.contract.js`
- `KitImageOverlay.fixtures.js`
- `useKitImageOverlayViewModel.js`
- `/dev/ui-preview/kit-image-overlay`

The preview is fixture-only; zoom and pan are interactive and not
fixture-capturable, and the delete-confirm panel is local view state
so it is reached by clicking Delete in the live preview, not by a
dedicated fixture. Fixture states cover default, loved, saved,
longest title, no image, and (R2, 10 Aug 2026) the four aspect
witnesses: wide, tall, square, tiny.

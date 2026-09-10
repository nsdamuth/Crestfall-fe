# Kit Image Creator Panel LOOM package (the Media Studio composer)

**Contract:** `KitImageCreatorPanel.contract.js` (`2.4.0`, 10 Sep 2026; Director fidelity additive/semantic over Video 2.3.0, Video additive over 2.2.0, Remix count additive over 2.1.0, Remix additive over 2.0.0)

## Purpose

The composer sidebar of the Media Studio page (`/studio/v2/images`),
rebuilt 9 Sep 2026 from Brian's notes 1 and 2
(`docs/references/media-studio/NOTES.md`). The live flow
(`components/studio/image-studio/`) is READ ONLY reference and is
never imported here; the page adapter
(`app/studio/v2/images/images-live/useImagesV2LiveViewModel.js`)
projects the workbench ViewModel onto this contract. Anything the
backend cannot do yet renders disabled with the words "Not available
yet" and never fakes a result, spends coins, or invents a number.

## Browser review round 1 (9 Sep 2026), applied

The root is two siblings: a scroll region (toggle, tabs, tiles, custom
prompt, the closed "Image settings" disclosure holding Render style,
Camera framing, Wardrobe theme, Aspect ratio, Advanced, Negative
prompt) and a footer that never scrolls (the count control on its own
row, layers glyph plus the number, menu opening upward; then Generate
on its own line). The consumer gives the root a bounded height: the
desktop rail (`overflow-hidden`, no padding) and the mobile sheet
(`ImagesV2ComposerSheet`, KitModalFrame variant sheet, 78dvh). Tiles
read (required) or (optional). Advanced keeps every slider the
workflow definition supplies; copy is the label plus an "i" tooltip.
Nothing inside the scroll region may be wider than it
(`overflow-x-hidden`, `min-w-0` on every flex child).

## Anatomy, top to bottom

1. Mode toggle: Image / Video with icons, one outlined track around
   both options and the active option filled inside it (rounded
   square, not a pill; ruled 9 Sep 2026, no law change). Video stays
   non-interactive with the `Soon` label while `videoDisabled`; live
   (session 5) it opens the Video mode and keeps the `Soon` label
   while `video.available` is false. See "Video mode" below.
2. Stage tabs: Generate and Remix. The Remix stage (session 4, notes
   5, 5a, 5b, 10 Sep 2026) renders when the caller passes `remix`;
   without it the session 1 stub ("Not available yet") stays. See
   "Remix stage" below.
3. Five asset tiles, fixed anatomy: `character` (required, spans the
   row, quiet gold glow), then `pose`, `outfit`, `location`, `preset`
   two by two. Empty: icon centered, title centered at the bottom with
   `required` or `optional` under it, no eyebrow chip. Selected: the
   image fills the tile with the name centered at the bottom. The
   Player slot is gone (Character covers it). The caller supplies only
   each slot's STATE through `slots`, keyed by id.
4. Custom prompt (optional): one row that grows with the text.
5. Inline options, no Options dropdown: Render style (slider plus six
   diagonal step names, each with a hover or tap tooltip carrying its
   definition, one short context line above the slider), Camera /
   Framing (the catalogue picker trigger), Wardrobe theme and Aspect
   ratio (KitDropdown single-selects), Advanced (disclosure, unchanged
   inside), the scenery-only checkbox when relevant, Negative prompt.
6. Sticky footer: the Count dropdown (2, 4, 8, 16, 32, 64, 128, 256;
   values above the backend's 4 render disabled with the tooltip) and
   one Generate button reading `Generate`, a coin glyph, and the cost
   (`generateCostLabel`, count times the per-image cost, computed by
   the caller). Block reasons are the disabled button's tooltip and
   accessible description, never helper copy on the panel. Errors
   render as an alert line above the footer.

No coins block: the balance lives in the left sidebar.

## Remix stage (session 4, RULED A and A of three at the plan gate)

Up to six characters plus one location, each contributing its
featured image and prompt details to one scene. The caller owns the
limits and the cost (one constant each, defined once outside this
package) and passes them pre-computed; this View writes no number.

1. References: a three-across grid, filled character slots first in
   slot order (art fills a square tile, the name at the bottom, the
   `@img1` to `@img6` handle top-left on the tag-over-art bed, the
   overlay clear button top-right; tapping the art re-opens the
   picker for that slot), then ONE "Add character" tile (dashed,
   plus glyph, `(required)` while nothing is chosen, `(optional)`
   after), then dark placeholder tiles (the darker bed, the Crestfall
   rosette from the primary logo drawn inline in the faint ink,
   nothing to press, hidden from assistive technology) to the
   end of the row, so the grid always reads as even rows of three
   (Brian's browser note, 10 Sep 2026). A new row appears when the
   Add tile moves into it. At the limit the Add tile leaves and the
   grid is exactly the six filled tiles. Handles bind to slot position
   and never renumber: clearing slot 2 leaves a gap the next Add
   fills, so a prompt's `@img3` keeps pointing at its character.
2. Location: the Generate Character tile's shape spanning the row,
   optional, opens the same shared picker.
3. Custom prompt (required): one row that grows. Typing `@` opens the
   mention list (the shared menu recipe, a thumbnail per row, filtered
   by the letters after the `@`); choosing a row inserts `@imgN ` or
   `@location ` at the caret. Escape, blur, or moving the caret off
   the `@` closes it. The prompt carries the handles as plain text.
   The mention list opens ABOVE the field (round 2): the prompt sits
   at the bottom of the scroll region, so a list below it would need
   a scroll to read.
4. Footer, shared with Generate: the same Count control, but Remix's
   own list and value when the caller passes `remix.countOptions`
   (2.2.0): Remix starts at 1 image, Generate at 2, both end at 128,
   and the two stages keep separate values. Then the Remix cost label
   (count times the Remix cost) and the Remix gate (coins, at least
   one character, a prompt). While `remix.available`
   is false (the Chassis carries no Remix job,
   `docs/handoffs/MEDIA-STUDIO-BACKEND.md` gap 13) the button renders
   disabled with the coin glyph, the cost, the Soon chip, and the
   title "Not available yet".

Rejected at the gate: six fixed empty tiles (pushes the prompt off
screen on the rail and the sheet), OD's sideways thumbnail strip
(the scroll region may not scroll sideways), and sharing Generate's
Character as Remix slot 1 (a data-flow change to the one-subject rule).

## Boundary

```text
KitImageCreatorPanel.jsx
  -> useKitImageCreatorPanelViewModel.js
  -> KitImageCreatorPanel.view.jsx
     -> native snapping render-style rail with inline step tooltips
     -> KitDropdownView (../dropdown/KitDropdown.view) for the 2.2.0
        video block's three dropdowns only; every live select is the
        shared SettingSelect and the count is the footer's CountMenu
     -> ../form-field/{growTextarea, InfoTip, menuRecipe, SoonChip}
        shared with the custom asset modal and the image viewer
```

Sticky footer note: the footer uses negative horizontal margins equal
to `--space-4`, so the consuming wrapper (the desktop `aside` and the
mobile modal body on the Media Studio page) pads the panel by exactly
`--space-4` on every side.

## Video mode (session 5, notes 7 and 7a, RULED A, A, A, A of four at the plan gate)

Rendered when the caller passes `video` (2.3.0+; Director timing is 2.4.0); a null `video` keeps
the 2.2.0 video block (Duration, Video aspect, Motion style, Video
direction) for the `videoMode` fixture. Video is Soon for alpha: the
whole composer is reviewable, and Generate carries the Soon treatment
until the Chassis carries a video job
(`docs/handoffs/MEDIA-STUDIO-BACKEND.md` gap 15). The segment length,
the ceiling, the count list, and the cost rule are the caller's; this
View writes no number.

1. Stage tabs, the Generate / Remix row relabeled: Text to video and
   Image to video, with their own state, so switching Image and Video
   never moves the Generate / Remix tab.
2. Text to video: the same five asset tiles as Generate, reading the
   Video mode's own `video.slots` (the caller keeps them apart from
   Generate's, the Remix ruling applied again). Image to video: one
   Image tile (required) in the Character tile's shape; tapping it
   opens the shared picker fed with the library's images, never a
   second picker.
3. Custom prompt: `(optional)` on Text to video, `(required)` on Image
   to video, one row that grows.
4. Custom director: a secondary button under the prompt opens a compact
   temporal cue sheet. Each row has editable start/end seconds on the
   left (0.1-second precision) and a growing prompt field on the right.
   Gaps are allowed, overlapping/reversed ranges surface inline
   validation, rows can be removed, and the plus adds the next open cue
   without changing video duration or cost. Provider/billing segments
   remain a separate concern owned by the caller.
5. Video settings, open (no disclosure): Aspect ratio through the
   shared SettingSelect (4:5, 5:4, 9:16, 16:9, 1:1), Duration as the
   Advanced slider's recipe moving in segment steps with the value
   chip on the right, Quality as a two-option 720p / 1080p control in
   the mode toggle's recipe. No model, extend, audio, or 4k.
6. Footer, shared: Video's own count list (1, 2, 4, 8, 16, 32 videos),
   the cost label (segments times the segment cost, times the quality
   multiplier, times the count, pre-computed by the caller), the Video
   gate (coins, then a character on Text, an image and a prompt on
   Image), and the Soon treatment while `video.available` is false.

Rejected at the gate: a disabled toggle with a hidden review path
(review happens on the real page), a Soon panel only (nothing to
review), a Mode select inside the settings (buries the primary
choice), a second segmented toggle (reads as one four-way control),
sharing Generate's slots (two modes over one source of truth), page-
held slots outside the workbench (a second selection path), a
Character asset as the source image (the job needs an image), and a
file upload (no endpoint, no external uploads).

## Fixture states

`default`, `emptySlots`, `insufficientCoins` (disabled Generate with
the cost tooltip), `customIngredient`, `remixStage` (three references,
one custom, a location, a prompt with mentions), `remixFull` (six
references, Add disabled with the limit line), `videoMode` (the 2.2.0
block, null `video`), `videoText` (Text to video, two tiles filled,
the director open with 0-1s, 1-2s, and 3-5s cue ranges inside a
10-second video, two videos at 720p),
`videoImage` (Image to video, the source filled, no prompt so the
gate reads its block reason, 5 seconds at 1080p), `longestContent`.

## Package assets

- `KitImageCreatorPanel.contract.js`
- `KitImageCreatorPanel.fixtures.js`
- `useKitImageCreatorPanelViewModel.js`

Review happens on the live page, signed in, never on a preview route
(standing order, 29 Aug 2026).

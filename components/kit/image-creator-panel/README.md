# Kit Image Creator Panel LOOM package (the Media Studio composer)

**Contract:** `KitImageCreatorPanel.contract.js` (`2.2.0`, 10 Sep 2026; Remix count additive over 2.1.0 of the same day, Remix additive over 2.0.0 of 9 Sep 2026)

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
   square, not a pill; ruled 9 Sep 2026, no law change). Video carries
   the `Soon` label and stays non-interactive while `videoDisabled`.
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
     -> KitDropdownView (../dropdown/KitDropdown.view) for Wardrobe
        theme, Aspect ratio, Count, and the three video dropdowns
     -> ../form-field/{growTextarea, InfoTip, menuRecipe, SoonChip}
        shared with the custom asset modal and the image viewer
```

Sticky footer note: the footer uses negative horizontal margins equal
to `--space-4`, so the consuming wrapper (the desktop `aside` and the
mobile modal body on the Media Studio page) pads the panel by exactly
`--space-4` on every side.

## Video mode

Unreachable while `videoDisabled` (alpha). The video block (Duration,
Video aspect, Motion style, Video direction) is kept for the fixture;
note 7 replaces it in a later session.

## Fixture states

`default`, `emptySlots`, `insufficientCoins` (disabled Generate with
the cost tooltip), `customIngredient`, `remixStage` (three references,
one custom, a location, a prompt with mentions), `remixFull` (six
references, Add disabled with the limit line), `videoMode`,
`longestContent`.

## Package assets

- `KitImageCreatorPanel.contract.js`
- `KitImageCreatorPanel.fixtures.js`
- `useKitImageCreatorPanelViewModel.js`

Review happens on the live page, signed in, never on a preview route
(standing order, 29 Aug 2026).

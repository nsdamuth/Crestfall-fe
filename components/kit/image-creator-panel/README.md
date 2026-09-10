# Kit Image Creator Panel LOOM package (the Media Studio composer)

**Contract:** `KitImageCreatorPanel.contract.js` (`2.0.0`, 9 Sep 2026)

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
2. Stage tabs: Generate and Remix. The Remix stage body is a later
   session (note 5); today it renders the one line "Not available yet"
   and the footer button disabled.
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

## Boundary

```text
KitImageCreatorPanel.jsx
  -> useKitImageCreatorPanelViewModel.js
  -> KitImageCreatorPanel.view.jsx
     -> native snapping render-style rail with inline step tooltips
     -> KitDropdownView (../dropdown/KitDropdown.view) for Wardrobe
        theme, Aspect ratio, Count, and the three video dropdowns
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
the cost tooltip), `customIngredient`, `remixStage`, `videoMode`,
`longestContent`.

## Package assets

- `KitImageCreatorPanel.contract.js`
- `KitImageCreatorPanel.fixtures.js`
- `useKitImageCreatorPanelViewModel.js`

Review happens on the live page, signed in, never on a preview route
(standing order, 29 Aug 2026).

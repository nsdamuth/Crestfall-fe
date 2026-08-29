# Kit Image Creator Panel LOOM package

**Contract:** `KitImageCreatorPanel.contract.js` (`1.0.0`)

## Purpose

Fixture-driven mirror of the live image composer's FUNCTION
(`docs/SPRINT-E-PLAN.md` section 1.1, R6), never its code. The live
flow (`components/studio/image-studio/`) is READ ONLY reference and
is never imported here. Mode toggle, the six live ingredient slots,
the inline custom-guidance editor, prompt and Options block, the
generate block, and the video block. Generation and persistence stay
honest stubs until live wiring (SOP HIDE/STUB law); this package never
fakes a pending job or a saved preset.

## Boundary

```text
KitImageCreatorPanel.jsx
  -> useKitImageCreatorPanelViewModel.js
  -> KitImageCreatorPanel.view.jsx
     -> native snapping render-style rail for the five validated image workflows
     -> KitDropdownView (../dropdown/KitDropdown.view) for the remaining
        Options dropdowns and the three video dropdowns
```

## The six slots are fixed anatomy

Id, label, icon, and savable-as-preset are owned by this package,
mirroring `components/studio/image-studio/imageStudioData.js`
`ingredientSlots` verbatim: `character` (Character, required, not
savable), `playerCharacter` (Player Character, not savable), `pose`
(Pose, savable), `outfit` (Clothing Source, savable), `location`
(Location / Scene, savable), `preset` (Rendering Preset, savable). The
caller supplies only each slot's live STATE through the `slots` prop,
keyed by the same six ids; character and player character mutual
exclusivity is the caller's responsibility (matching the live rule:
picking one clears the other), enforced by whatever state owns
`slots`, not by this View.

A slot in custom ("Use Once") mode renders the inline guidance editor
in place of the picker-opening tile: `Custom Guidance` textarea, `Back
to presets`, `Save as preset` (only for the four savable slots), a
disabled `Use once` state indicator, and a clear control. Tapping a
non-custom tile fires `onSlotActivate`; the caller owns opening the
ingredient picker (1.2, phase 2).

## Options expander

One control, not two (the live composer's duplicate sliders-icon
button collapses into this single expander, a presentation change the
contract permits per FRONTEND-SOP section 13). In V2 Image Studio, Render
Style is a five-stop snapping rail from Crestfall Fantasy at the left endpoint
to Crestfall Realistic at the right endpoint. Camera / Framing uses its
dedicated catalogue picker; Wardrobe Theme, Aspect Ratio, and Output Count
remain KitDropdown single-selects. Bounded Advanced Workflow Tuning renders
only semantic controls supplied by the application layer; raw CFG, sampler,
scheduler, and model selection remain outside the View. The negative prompt
textarea remains in the same expander.

## Generate block

Coin balance and per-generation cost render from caller-supplied
labels; `canGenerate` and `generationHelpText` are pre-computed by the
caller (fixture logic, never business logic in this View), matching
the live block-reason grammar: insufficient coins beats no-renderable-
source beats the non-blocking no-clothing help line. `Generate image`
fires `onGenerate`, which opens the R4 fixture-action notice in every
fixture-mode consumer; the real job pipeline is live wiring.

## Video mode

Replaces the prompt/Options/generate block with Duration, Video
Aspect, and Motion Style dropdowns, a Video Direction textarea, and
the honest disabled `Generate video soon` stub (no handler, matching
the live flow).

## Fixture states

`default`, `emptySlots`, `insufficientCoins`, `customIngredient`
(exercises both the savable and non-savable custom-editor variants in
one fixture), `videoMode`, `longestContent`.

## Package assets

- `KitImageCreatorPanel.contract.js`
- `KitImageCreatorPanel.fixtures.js`
- `useKitImageCreatorPanelViewModel.js`
- `/dev/ui-preview/kit-image-creator-panel`

Fixture-only; no query, persistence, or navigation is wired. The
ingredient picker (1.2) and save-preset (1.3) modals ship as their own
packages in phase 2 and are wired from a consuming page, not composed
inside this package.

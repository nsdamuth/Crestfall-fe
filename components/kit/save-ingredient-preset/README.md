# Kit Save Ingredient Preset LOOM package (the custom asset modal)

**Contract:** `KitSaveIngredientPreset.contract.js` (`2.0.0`)

## Purpose

THE custom asset modal for Media Studio (FE/MEDIA-STUDIO session 2,
Brian's note 4, 9 Sep 2026). Tapping Custom in any asset picker opens
this modal for that asset type; the slot never switches into an
inline text mode. One modal, one field order, one spacing for every
type. Persistence is live wiring, never this piece's concern.

## Boundary

```text
KitSaveIngredientPreset.jsx
  -> useKitSaveIngredientPresetViewModel.js
  -> KitSaveIngredientPreset.view.jsx
     -> KitModalFrame (variant="sheet" with grabber under 700px,
        the same sheet the composer uses; variant="modal" at 700px
        and up, through usePhoneWidth)
     -> ../form-field/growTextarea (shared with the composer prompts)
```

## Anatomy

Eyebrow "Custom asset", the asset word as the title, one sentence
from the caller. Fields in one order for every type: Preset name,
Description (optional), Prompt, Tags (optional). Captions use the
composer's control-title recipe; values sit at `--text-ui` on the
composer's field recipe; Description and Prompt render as one row and
grow with content through the shared `growTextarea`. No bottom note.
An optional save result line (`message`, `messageTone`) sits above the
fade divider; errors use the status-danger text tier with the word
"Error" beside them.

Footer: "Use once" (secondary, left; needs a prompt) and "Save and use
preset" (primary, right; needs a name and a prompt). When the caller
passes `saveAvailable=false` (Character has no preset type yet), the
Save button renders disabled with the composer's Soon chip, never a
faked save.

## Saving disables close

The caller passes `onClose={isSaving ? null : closeHandler}`, and
KitModalFrame's null-safe dismissal makes backdrop click, Escape, and
the close control all no-ops while saving (the `saving` fixture ships
`onClose: null`). `hasUnsavedChanges` routes dismissal through the
frame's confirm step; the caller decides what counts as dirty (the
prefilled name alone does not).

## Nested modal back label

`backLabel` (`string|null`): NESTED MODAL LAW, this modal opened from
the mobile composer sheet. When non-null, the caller passes a labeled
back affordance so the return path reads correctly instead of a bare
close.

## Fixture states

`default`, `saving` (`onClose: null`), `longestContent`,
`characterNoSave` (Save reads Soon), `error`.

## Package assets

- `KitSaveIngredientPreset.contract.js`
- `KitSaveIngredientPreset.fixtures.js`
- `useKitSaveIngredientPresetViewModel.js`
- `/dev/ui-preview/kit-save-ingredient-preset` (harness only, never a
  review surface; Brian reviews on the live page)

Fixture-only; the real persistence call is live wiring
(docs/handoffs/MEDIA-STUDIO-BACKEND.md gap 7).

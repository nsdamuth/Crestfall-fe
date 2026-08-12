# Kit Form Field LOOM Package

**Contract:** `KitFormField.contract.js`, 1.1.0

## Purpose

The shared field anatomy ruled by `docs/BUILD-BLUEPRINT.md` 2.8: four
slots plus the input (label, input bed, helper line, error line) and
an optional counter, folding disclosure, and the five control states.
Consolidates the label tracking literal (`FIELD_LABEL_CLASS`) and the
creator's folding-input pattern (Advanced Creator Guidance, Advanced
Prompting) onto tokens.

1.1.0 (K1 wave, `docs/plans/FABLE-GATE-PLAN.md`) adds `variant`
(`text` | `textarea` | `select` | `number`), the O1 long-form resting
state, the O4 counter visibility rule, and `mono`, all additive; every
1.0.0 consumer is unaffected.

## Boundary

```text
KitFormField.jsx
  -> useKitFormFieldViewModel.js
  -> KitFormField.view.jsx
  -> KitDropdown.view.jsx (variant="select" only, read-only import)
```

- Value, helper, error, success, and count are always caller-owned;
  the View never derives or formats them.
- The fold's open/closed state is sanctioned presentation-only local
  state inside the View; `isFolded` only seeds the initial state,
  `onToggleFold` is an optional caller notification, never a control.
- The `variant="textarea"` collapsed/expanded state is the same
  sanctioned pattern: `startExpanded` only seeds the initial state.
- Error and success are mutually exclusive in the View's rendering
  (error wins when both are present); the input border and bed follow
  whichever triad is active. Neither ever renders on color alone: the
  word always ships beside the state.

## Variants

- `text` (default): single-line input, `type` selects the native
  input type (`text`, `search`, `email`, `password`).
- `number`: single-line input, native `type="number"`.
- `textarea`: long-form field per O1 (below).
- `select`: composes `KitDropdown.view.jsx` for its options panel,
  including its popover-at-700px / bottom-docked-sheet-under-700px
  grammar unchanged. `options` matches `KitDropdownOption`; `onSelect`
  fires the chosen value. The field's own uppercase label stays the
  visible label; the dropdown trigger's own label slot is left empty
  (or shows `placeholder` when nothing is selected) so the label is
  never announced twice, with `ariaLabel` carrying it to the trigger,
  listbox, and sheet for assistive tech.

## O1: long-form resting state

Ratified option A (`docs/plans/FABLE-GATE-PLAN.md`, O1). A `textarea`
variant field rests collapsed to one `--control-md` line showing a
single-line preview of the entered value (or the placeholder when
empty), so whether the field is filled is always visible at a glance.
It expands to a real multi-row `<textarea>` on focus or tap (Tab
landing on the collapsed preview button expands it immediately, same
as a click), keeps keyboard focus on the real field the moment it
mounts, and returns to the collapsed preview on blur.

## O4: counter visibility

Ratified option A (`docs/plans/FABLE-GATE-PLAN.md`, O4). The counter
is hidden at rest. It appears while the field is focused, and
independently whenever the count is past 80% of `maxLength`; at or
over `maxLength` it takes `--status-danger` and appends the word
"limit" (never color alone). The fold header's group budget counter
is a named exception, per 2.8's "combined budget line" rule: it stays
always visible regardless of focus, unaffected by O4.

## States

Input: rest, hover (`--state-hover-line` border), focus (global ring,
or the sanctioned `cf-field` 1px variant inside dense modal grids),
disabled (`--state-disabled-opacity`, label stays `--ink-faint`).
Pressed is n/a for the text input; select/toggle-shaped fields built
on this anatomy carry it themselves. The fold header carries all five
states as a button. `select` and `textarea`'s collapsed preview carry
the same five states through their own button element.

## Package assets

- `KitFormField.contract.js`
- `KitFormField.fixtures.js`
- `useKitFormFieldViewModel.js`
- `/dev/ui-preview/kit-form-field`

Fixture-only; no query, persistence, or navigation is wired.

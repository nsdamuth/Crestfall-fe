# Kit Form Field LOOM Package

**Contract:** `KitFormField.contract.js`

## Purpose

The shared field anatomy ruled by `docs/BUILD-BLUEPRINT.md` 2.8: four
slots plus the input (label, input bed, helper line, error line) and
an optional counter, folding disclosure, and the five control states.
Consolidates the label tracking literal (`FIELD_LABEL_CLASS`) and the
creator's folding-input pattern (Advanced Creator Guidance, Advanced
Prompting) onto tokens.

## Boundary

```text
KitFormField.jsx
  -> useKitFormFieldViewModel.js
  -> KitFormField.view.jsx
```

- Value, helper, error, success, and count are always caller-owned;
  the View never derives or formats them.
- The fold's open/closed state is sanctioned presentation-only local
  state inside the View; `isFolded` only seeds the initial state,
  `onToggleFold` is an optional caller notification, never a control.
- Error and success are mutually exclusive in the View's rendering
  (error wins when both are present); the input border and bed follow
  whichever triad is active. Neither ever renders on color alone: the
  word always ships beside the state.

## States

Input: rest, hover (`--state-hover-line` border), focus (global ring,
or the sanctioned `cf-field` 1px variant inside dense modal grids),
disabled (`--state-disabled-opacity`, label stays `--ink-faint`).
Pressed is n/a for the text input; select/toggle-shaped fields built
on this anatomy carry it themselves. The fold header carries all five
states as a button.

## Counter

Right-aligned on the label row, `--text-label`/`--ink-faint`,
tabular-nums. At limit (`count >= maxLength`) it takes
`--status-danger` and appends the word "limit" (never color alone). A
folded group's counter is a group-level budget slot, not a per-field
count.

## Package assets

- `KitFormField.contract.js`
- `KitFormField.fixtures.js`
- `useKitFormFieldViewModel.js`
- `/dev/ui-preview/kit-form-field`

Fixture-only; no query, persistence, or navigation is wired.

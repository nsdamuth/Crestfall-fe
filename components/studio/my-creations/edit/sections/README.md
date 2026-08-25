# SharedFields

Plain shared primitive module, not a LOOM package (no contract, no
ViewModel, no fixtures exist for it today; the plan keeps it that
way). Consumed by 47+ files across the advanced editor's section
tree.

## Version

`SHARED_FIELDS_VERSION = "1.0.0"`, added wave E1
(`docs/plans/FABLE-GATE-PLAN.md`). First version header this file has
carried; bump it on any prop-shape change to an existing export.
Additive changes (new primitives, new optional props) do not require
a bump.

## What changed, wave E1

Internals rebuilt onto tokens end to end: label
(`--text-label`/`--track-label`/`--ink-faint`), field bed
(`--surface-1`, `--line-whisper` border, `--radius-md`,
`--control-md` 44px minimum height), body/UI type
(`--text-body`/`--text-ui`), `SectionTitle` heading onto
`--text-heading`/`--text-heading-m`. No raw hex, no `bg-black/NN`, no
`border-white/NN`, no Tailwind default type sizes, no `rounded-xl`
remain in this file.

**Defect fixed**: `TextField` previously accepted no `maxLength` prop;
`CharacterIdentitySection.view.jsx:85,135` passed one that was
silently dropped (no DOM limit, no counter) even though the contract
and fixtures declared it. `TextField` now wires `maxLength` through to
the input and its counter, plus `placeholder`, `helperText`, and
`disabled`.

**New primitives**: `SelectField` and `NumberField`, same label/bed
grammar as `TextField`, for the later sweep waves (E3 onward) that
tokenize the ~66 hand-rolled selects and raw number inputs the gate
found across the editor tree.

**`TextAreaField`** adopts the Fable Gate ruling O1 (long-form resting
state, option A): collapsed at one `--control-md` line showing a
preview of the current value rather than hiding whether the field is
filled, expands on focus and stays expanded once focused. Counter
behavior follows ruling O4 (option A): renders on focus and whenever
the value is past 80% of `maxLength`; silent otherwise; at limit it
takes `--status-danger` plus the word "limit". Both rulings mirror the
World/Look/Story quick-create `FoldingTextField` interaction
(`components/studio/create/world/creator-stops/shared/Controls.jsx`)
so the kit and editor trees read identically.

## Exports

- `SHARED_FIELDS_VERSION`
- `SHORT_LONGFORM_MAX_LENGTH`, `DEEP_LONGFORM_MAX_LENGTH`
- `SectionTitle({ eyebrow, title, body })`
- `TextField({ label, value, onChange, placeholder, maxLength, helperText, disabled })`
- `SelectField({ label, value, onChange, options, placeholder, helperText, disabled })` (new)
- `NumberField({ label, value, onChange, placeholder, min, max, step, helperText, disabled })` (new)
- `TextAreaField({ label, value, onChange, placeholder, maxLength, helperText, disabled, mono })`
- `ReadOnlyField({ label, value })`
- `ActionPanel({ title, body, button, onClick, disabled })`

Every existing prop on every existing export is unchanged; all
additions are optional and additive. The 47+ consuming files build
unmodified.

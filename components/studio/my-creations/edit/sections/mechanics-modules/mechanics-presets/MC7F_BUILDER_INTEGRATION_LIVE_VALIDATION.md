# MC7F — Builder Integration and Live Validation

**Contract:** `mechanics_preset_live_validation_v1`

MC7F connects MC7E reference runtime evidence to the live Mechanics preset
workflow without adding another runtime executor or changing persistence.

## Builder behavior

- Preset cards advertise their available validation path.
- Module starters display the registered MC7E runtime implementation,
  representative command, and expected outcome before apply.
- Applying any preset returns a bounded validation guide with the atomic apply
  result.
- The Mechanics builder displays that guide transiently until dismissed.
- The guide can copy its reference command, but cannot save, attach modules, or
  mutate runtime state.
- The normal page Save action remains authoritative for persistence.

## LOOM feature

```text
MechanicsPresetValidationPanel.jsx
        ↓
useMechanicsPresetValidationPanelViewModel.js
        ↓ semantic contract
MechanicsPresetValidationPanel.view.jsx
```

Development preview:

```text
/dev/ui-preview/mechanics-preset-validation
```

The route returns `notFound()` in production.

## Validation classes

- Complete module presets: deterministic MC7E reference runtime guide.
- Complete command presets: generated command smoke-test guide.
- Resolution and Composition references: selected-target command smoke test.

## Boundaries

- No API route, database, PostGraphile, or services-api changes.
- No runtime mutation path is added.
- No validation status is persisted.
- No preset is auto-saved.
- MC5 stays frozen at `mechanics_command_resolution_v6`.
- MC6 stays frozen at `mechanics_command_composition_v1`.

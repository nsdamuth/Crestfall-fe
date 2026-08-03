# Mechanics Command Outcomes

This LOOM package owns the stored shape and presentation of command outcome branches:

- `CRITICAL_SUCCESS`
- `SUCCESS`
- `FAILURE`
- `FUMBLE`
- branch `effectMode`
- branch summaries
- branch effect ordering and add/remove orchestration

The package does **not** own effect-field authoring. The application parent injects the existing effect card component so M4B can separate outcome shape without prematurely extracting requirements, effects, targets, value binding, progression reconciliation, or resolution.

## Storage

The package preserves `command.outcomes`, including legacy lowercase/camel-case branch aliases and unknown root or branch metadata. Canonical branches use `mechanics_command_outcomes_v1` and the effect modes `INHERIT`, `REPLACE`, `APPEND`, and `NONE`.

## Boundary

- Binding Shell: `MechanicsCommandOutcomes.jsx`
- Portable View: `MechanicsCommandOutcomes.view.jsx`
- ViewModel: `useMechanicsCommandOutcomesViewModel.js`
- Pure normalization: `mechanicsCommandOutcomesNormalization.js`
- Pure operations: `mechanicsCommandOutcomesOperations.js`

The parent remains the whole-command owner and persists the full Mechanics document atomically.

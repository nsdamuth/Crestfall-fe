# Mechanics Defaults LOOM Package

M7A extracts `instanceData.defaults` from the Mechanics Module orchestrator.

## Ownership

The package owns authoring and compatibility for:

- `defaults.flags[]`
- `defaults.counters[]`
- `defaults.stages[]`
- entry `id`, `label`, and `initial`
- legacy root bucket aliases and entry aliases
- unknown root and entry metadata preservation

It does not own live runtime state, Status Blocks, Guards, command effects, preset orchestration, JSON replacement, or persistence.

## Boundary

`MechanicsModuleFieldsSection.jsx` remains the application orchestrator and replaces the complete Mechanics document. `MechanicsDefaults.jsx` is the Binding Shell, the ViewModel owns normalization and semantic mutation, and `MechanicsDefaults.view.jsx` is the portable skin.

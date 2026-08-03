# Mechanics Status Blocks LOOM Package

M7B extracts `instanceData.statusBlocks` from the Mechanics Module orchestrator.

## Ownership

The package owns:

- status-block identity, label, and slot;
- `response_start` / `response_end` placement;
- public, private, and hidden visibility;
- required state;
- deterministic rendered-line authoring and ordering;
- legacy field aliases;
- unknown block metadata preservation.

It does not own services-api rendering, live runtime values, Defaults, Guards, commands, preset orchestration, JSON replacement, or persistence.

## Boundary

`MechanicsModuleFieldsSection.jsx` remains the application orchestrator and replaces the complete Mechanics document. `MechanicsStatusBlocks.jsx` is the Binding Shell, the ViewModel owns normalization and semantic mutation, and `MechanicsStatusBlocks.view.jsx` is the portable skin.

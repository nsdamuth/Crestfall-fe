# Mechanics Guards LOOM Package

M7C extracts `instanceData.guards` from the Mechanics Module orchestrator.

## Ownership

The package owns:

- guard identity and labels;
- `HARD_LOCK`, `SOFT_LOCK`, and `GUIDANCE` enforcement;
- `ALL` and `ANY` condition modes;
- counter, meter, flag, and stage conditions;
- comparison operators and typed loose values;
- on-pass and on-fail summaries;
- composer guidance and visibility;
- public visibility;
- condition ordering and guard ordering;
- legacy aliases and unknown metadata preservation.

It does not own runtime guard evaluation, command requirements, services-api enforcement, composer application, Defaults, Status Blocks, preset orchestration, JSON replacement, or persistence.

## Boundary

`MechanicsModuleFieldsSection.jsx` remains the application orchestrator and replaces the complete Mechanics document. `MechanicsGuards.jsx` is the Binding Shell, the ViewModel owns normalization and semantic mutation, and `MechanicsGuards.view.jsx` is the portable skin.

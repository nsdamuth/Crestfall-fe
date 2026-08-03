# Mechanics Command Domain Actions — M5C

This package owns the authoring boundary for `command.domainAction`.

It preserves the existing Crestfall domain-adapter contract for:

- Item custody and placement actions;
- Item use, consumption, damage, and repair;
- Participant condition application and removal;
- Connected-location transitions;
- Active-journey operations;
- Outcome gating through `applyOnOutcomes`;
- Current and legacy field aliases;
- Unknown forward-compatible action metadata.

The package does not execute domain actions. Runtime validation and mutation remain owned by services-api and the relevant authoritative domain services.

## LOOM boundary

- `MechanicsCommandDomainActions.jsx` is the Binding Shell.
- `MechanicsCommandDomainActions.view.jsx` is the portable View.
- `useMechanicsCommandDomainActionsViewModel.js` is the Chassis.
- `mechanicsCommandDomainActionsNormalization.js` owns compatibility and projection.
- `mechanicsCommandDomainActionsOperations.js` owns immutable semantic mutations.

The parent Mechanics editor still owns the complete command and root Mechanics document replacement boundary.

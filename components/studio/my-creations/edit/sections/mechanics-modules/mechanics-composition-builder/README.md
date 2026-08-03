# Mechanics Composition Builder LOOM Feature

**Status:** In-repository LOOM integration

**Contract version:** `1.0.0`

## Purpose

This feature provides a bounded visual editor for the MC6 command-composition contract without moving creation persistence or services-api authority into presentation code.

```text
MechanicsCompositionBuilder.jsx
        ↓
useMechanicsCompositionBuilderViewModel.js
        ↓ semantic View contract
MechanicsCompositionBuilder.view.jsx
```

## Boundaries

The Shell preserves the public feature entry and only connects the ViewModel to the View.

The ViewModel owns:

- composition normalization
- ordered step mutations
- reference composition application
- dependency pruning after reorder/removal
- argument-option mapping
- patch-lane and Location-last UI enforcement
- validation/warning projection
- semantic callbacks

The View owns:

- JSX and visual hierarchy
- responsive layouts
- form controls and accessible labels
- empty, warning, disabled, and configured states
- safe callback invocation

The View does not know creation storage, API routes, services-api, PostGraphile, database fields, room runtime state, or persistence behavior.

## Runtime authority

The visual editor authors `command.composition`. services-api remains authoritative for:

- pre-roll validation
- condition evaluation
- pending-state sequencing
- continuation policies
- domain action validation and execution
- replay/idempotency protection
- patch isolation

The UI does not claim cross-lane transactionality. The contract remains `NOT_TRANSACTIONAL`.

## Preview

Development-only route:

```text
/dev/ui-preview/mechanics-composition-builder
```

The production route returns `notFound()`.


## M3 progression injection

`MechanicsCompositionBuilder.jsx` owns the application import of the shared effect-level progression Binding Shell and injects it into the portable View as `ProgressionProfileFieldsComponent`. The development preview supplies the same local-only component explicitly.

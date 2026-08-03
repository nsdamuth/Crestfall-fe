# Mechanics Progression Profile

LOOM package for the effect-level `PROGRESSION_RECONCILE` profile editor used by Mechanics commands.

## Boundary

- `MechanicsProgressionProfileFields.jsx` is the thin Binding Shell.
- `useMechanicsProgressionProfileViewModel.js` owns normalization, generated-table projection, summaries, and semantic mutations.
- `MechanicsProgressionProfileFields.view.jsx` is the portable Skin.
- `mechanicsProgressionProfileOperations.js` provides immutable profile operations.
- `../mechanicsProgressionProfileBuilder.js` remains the shared runtime-compatible normalization and calculation authority.

## Storage

The package edits `effect.progressionProfile` on both legacy command effects and composition Mechanics-step effects. The complete Mechanics document remains owned by the parent editor and is still replaced atomically.

Canonical profile version:

```text
mechanics_progression_profile_v1
```

## Compatibility

The builder preserves unknown profile, curve, override, threshold, and derived-value metadata through object spreads while recovering legacy aliases such as `profile_id`, `experience_id`, `level_id`, `derived_values`, and snake-case curve fields.

Explicit threshold rows and explicit derived-value tables remain supported through the whole-document JSON editor even when the compact visual editor displays a guidance message instead of a row-by-row table editor.

## Callers

- `MechanicsModuleFieldsSection.jsx`
- `mechanics-composition-builder/MechanicsCompositionBuilder.jsx`, which injects the progression Binding Shell into its portable View

## Non-goals

This package does not modify the standalone Progression Profile Creation workflow, Character advancement services, preset semantics, command composition storage, or engine execution.

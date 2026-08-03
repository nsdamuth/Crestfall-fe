# Mechanics Document Orchestration LOOM Package

M8 extracts the bounded preset/JSON interaction state and presentation from the
Mechanics Module editor while preserving atomic complete-document replacement
at the create/edit parent boundary.

## Ownership

The package owns:

- opening and closing the Mechanics Preset Library;
- opening and closing the complete Mechanics JSON Editor;
- transient preset live-validation guidance;
- routing successful preset and JSON applications to one semantic complete-
  document replacement callback;
- disabled controls when atomic replacement is unavailable;
- clearing preset guidance after JSON replacement or ordinary visual edits.

It composes the existing preset application, preset validation, and JSON editor
LOOM packages. Those packages retain their own validation, formatting, copy,
download, preview, destructive-confirmation, and compatibility behavior.

## Atomic boundary

`MechanicsModuleFieldsSection.jsx` remains the application orchestrator. Its
`replaceMechanicsData(nextData)` function normalizes and sends exactly one
complete Mechanics `data` object through the caller-provided `replaceData`
callback. The M8 package never falls back to piecemeal field updates for preset
or JSON application.

The normal page Save action remains the only persistence action.

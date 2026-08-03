# Mechanics Module Assembly LOOM Package

M9 completes the Mechanics decomposition by reducing
`MechanicsModuleFieldsSection.jsx` to the create/edit persistence Binding Shell
and moving the assembled Runtime Fields experience into a portable package.

## Boundary

`MechanicsModuleFieldsSection.jsx` still owns the only semantic complete-data
replacement callback. It normalizes the complete Mechanics document and calls
caller-provided `replaceData` exactly once. Create and edit continue to provide
that callback, and the normal page Save action remains the only persistence
operation.

The M9 package owns:

- projection of the normalized Mechanics document into assembled section props;
- local section/card folds and Runtime Fields navigation events;
- root identity, priority, and tags authoring;
- immutable visual-edit routing into the complete Mechanics document;
- slot composition for Trackers, Commands, Defaults, Status Blocks, Guards, and
  M8 preset/JSON orchestration;
- command-level composition of the already-extracted command domain packages;
- portable View presentation with no route, API, auth, or persistence imports.

Runtime attachment, runtime evaluation, services-api, PostGraphile, Supabase,
and database behavior remain outside this package.

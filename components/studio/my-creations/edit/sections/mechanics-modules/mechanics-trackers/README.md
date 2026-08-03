# Mechanics Trackers — M2

This package extracts the active Mechanics tracker editor from
`MechanicsModuleFieldsSection.jsx` without changing the saved
`instanceData.trackers` contract.

## Boundary

- **Binding Shell:** `MechanicsTrackersSection.jsx`
- **Portable View:** `MechanicsTrackersSection.view.jsx`
- **Chassis:** `useMechanicsTrackersViewModel.js`
- **Compatibility:** `mechanicsTrackersNormalization.js`
- **Immutable operations:** `mechanicsTrackersOperations.js`

The parent still owns the complete Mechanics document and performs the atomic
root replacement. This package emits only a normalized next tracker array.

## Preserved fields

Tracker:

- `id`
- `kind`
- `label`
- `min`
- `max`
- `initial`
- `phases`
- `mutationHints`
- unknown tracker metadata

Phase:

- `id`
- `label`
- `min`
- `max`
- unknown phase metadata

Mutation hint:

- `id`
- `eventTypes`
- `triggers`
- `delta`
- `reason`
- unknown hint metadata

Legacy aliases remain readable: `mutation_hints`, `event_types`, and `amount`.

## Modal classification

`components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx`
has no active production caller in the current repository. M2 classifies it as
`QUARANTINED_UNREFERENCED_LEGACY_OR_FUTURE`. It is not imported, converted,
deleted, or treated as the active Mechanics definition editor.

## Explicitly out of scope

- Commands and command tracker references
- Progression profiles
- Defaults
- Status blocks
- Guards
- Presets and JSON orchestration
- Runtime Mechanics attachments
- services-api and engine-middleware behavior

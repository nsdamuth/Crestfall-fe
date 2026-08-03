# Registry Linked Creation Picker

Loom-separated modal for selecting one owned creation to link or attach within
an existing Crestfall registry workflow.

## Structure

- `../RegistryLinkedCreationPickerModal.jsx`: binding Shell preserving the existing public import path.
- `RegistryLinkedCreationPickerModal.view.jsx`: portable, API-free presentation.
- `useRegistryLinkedCreationPickerViewModel.js`: allowed-type loading, deduplication, raw-field search, image fallback, selection-state mapping, and parent callback orchestration.
- `RegistryLinkedCreationPickerModal.contract.js`: versioned semantic View boundary.
- `RegistryLinkedCreationPickerModal.fixtures.js`: isolated visual states.
- `app/dev/ui-preview/registry-linked-creation-picker/`: development-only fixture preview.

## Boundary

The View receives caller-supplied heading text and display-ready creation cards.
It emits `onChooseCreation(creationId)` and does not know allowed creation types,
raw creation `data`, featured-media fallback rules, selected registry ID arrays,
or any caller-specific attachment storage shape.

The ViewModel continues to use the existing Crestfall client API module and
preserves the original public callback behavior by passing the selected raw
creation object to `onSelect(creation)`.

## Existing live consumers

- `components/studio/create/room-template/RoomRegistryAttachmentsSection.jsx`
- `components/studio/create/structured-registry/StructuredRegistryBuilder.jsx`
- `components/studio/registries/ItemStartingAssignmentEditor.jsx`
- `components/studio/my-creations/edit/sections/locations/LocationRegistryAttachmentsSection.jsx`

None of these consumers needs to change for this Loom conversion.

# Location Registry Attachments Section

## Portable LOOM boundary

`LocationRegistryAttachmentsSection.jsx` is the thin Binding Shell. It invokes the ViewModel, keeps `RegistryLinkedCreationPickerModal` application-owned, and injects that modal into the portable View as a slot.

`LocationRegistryAttachmentsSection.view.jsx` renders only display-ready registry groups, attachment cards, optional notes, and semantic callbacks. It does not receive `form`, `updateDataField`, Creation records, registry picker implementation details, or persistence clients.

`useLocationRegistryAttachmentsSectionViewModel.js` owns:

- the seven supported registry kinds and their display metadata;
- normalization of `boundRegistries` and `boundRegistryLinks`;
- legacy ID-only binding projection when mirrored link metadata is absent;
- picker state, allowed Creation types, and selected-Creation IDs;
- linked-Creation metadata construction through the existing application utility;
- duplicate prevention;
- add, remove, and attachment-note mutations;
- coordinated writes to both `boundRegistries` and `boundRegistryLinks`.

The existing public component path remains shared by Location Create and Asset Builder Location mode. Their hydration, save orchestration, authorization, and persistence behavior remain unchanged.

## Preview

Development-only preview:

`/dev/ui-preview/location-registry-attachments-section`

The route renders complete, legacy ID-only, mixed, and empty fixture states. It includes a local fixture picker so attach, remove, and notes behavior can be inspected without loading saved Creations. The route is blocked in production.

## Diagnostics

Run:

`npm run diagnostics:loom:location-registry-attachments-section`

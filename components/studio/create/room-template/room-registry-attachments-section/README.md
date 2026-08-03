# Room Registry Attachments Loom Feature

## Public Shell

```text
components/studio/create/room-template/RoomRegistryAttachmentsSection.jsx
```

The public Shell preserves the existing `data`, `updateDataField`, `eyebrow`,
`title`, and `body` API. It binds the ViewModel to the portable View and mounts
the existing Registry Linked Creation Picker Binding Shell only while a picker
is open. This preserves the picker's current on-demand creation loading.

## Portable View

```text
components/studio/create/room-template/room-registry-attachments-section/
  RoomRegistryAttachmentsSection.view.jsx
```

The View owns only:

- the section heading;
- registry-group cards;
- empty states;
- attachment cards;
- image fallbacks;
- editable attachment notes;
- semantic attach, remove, and notes-change callbacks.

It does not know bound-registry field names, legacy ID-only links, creation
payloads, type filters, deduplication rules, registry mutation behavior, or
Story persistence.

## ViewModel

```text
components/studio/create/room-template/room-registry-attachments-section/
  useRoomRegistryAttachmentsSectionViewModel.js
```

The ViewModel owns:

- the seven Story registry groups;
- current bound-registry and mirrored-link normalization;
- legacy ID-only attachment fallback;
- picker disclosure and type-filter configuration;
- selected-creation IDs;
- linked-creation normalization;
- duplicate prevention;
- attachment removal;
- attachment-note updates;
- paired `boundRegistries` and `boundRegistryLinks` field updates.

## Preview

```text
/dev/ui-preview/room-registry-attachments-section
```

The preview renders direct View-contract fixtures. Attach, remove, and notes
changes update local preview state only. The route does not load creations,
open the production picker, modify a Story draft, call an API, or persist data.

## Live Callers

```text
components/studio/create/room-template/RoomTemplateBuilderShell.jsx

components/studio/my-creations/edit/sections/room-templates/
  RoomTemplateRuntimeSection.jsx
```

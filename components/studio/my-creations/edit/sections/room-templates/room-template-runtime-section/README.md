# Room Template Runtime Section Loom Feature

## Public Shell

```text
components/studio/my-creations/edit/sections/room-templates/
  RoomTemplateRuntimeSection.jsx
```

The public Shell preserves the existing `form` and `updateDataField` API. It
binds the runtime-section ViewModel to the portable View and mounts the
existing Registry Linked Creation Picker Binding Shell while either the nested
Rules Codex or registry-attachments ViewModel has an active picker.

## Portable View

```text
components/studio/my-creations/edit/sections/room-templates/
  room-template-runtime-section/RoomTemplateRuntimeSection.view.jsx
```

The View owns only:

- the Story Runtime Context heading;
- composition of the portable Rules Codex attachment View;
- composition of the portable registry-attachments View;
- the Private Room Guidance textarea;
- semantic private-guidance change intent.

It does not know raw Story data fields, Rules Codex or registry storage, picker rules,
linked-creation payloads, runtime Codex selection, saving, or persistence.

## ViewModel

```text
components/studio/my-creations/edit/sections/room-templates/
  room-template-runtime-section/useRoomTemplateRuntimeSectionViewModel.js
```

The ViewModel owns:

- reading `form.data` defensively;
- mapping Private Room Guidance to `private_room_guidance`;
- composing the validated Story Rules Codex Attachments ViewModel;
- composing the validated Room Registry Attachments ViewModel;
- passing its direct View contract to the parent View;
- forwarding its picker contract to the public Shell.

## Preview

```text
/dev/ui-preview/room-template-runtime-section
```

The preview renders direct View-contract fixtures. Rules Codex and registry attach/remove,
attachment-note, and private-guidance changes update local preview state only.
It does not load registry creations, open the production picker, modify a Story,
call an API, or save data.

## Live Caller

```text
components/studio/my-creations/CreationEditShell.jsx
```

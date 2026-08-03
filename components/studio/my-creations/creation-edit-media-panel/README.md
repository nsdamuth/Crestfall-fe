# Creation Edit Media Panel Loom Feature

## Public Binding Shell

```text
components/studio/my-creations/CreationEditMediaPanel.jsx
```

The Shell preserves the existing public props:

```text
creationId
form
activeMediaSlot
setActiveMediaSlot
supportsChatMedia
onReplaceSlot
```

## Portable View

```text
components/studio/my-creations/creation-edit-media-panel/
  CreationEditMediaPanel.view.jsx
```

The View owns the featured-media preview, slot controls, navigation link,
current chat-media placeholder, and Image Studio ingredient explanation. It
receives display-ready values and emits semantic selection and replacement
intent.

The View does not know the Creation Edit form structure, creation IDs, featured
slot storage keys, picker orchestration, image-library route construction, save
payloads, or persistence behavior.

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for fixtures and extracted UI-package
rendering while production keeps the existing client-side navigation behavior.

## ViewModel

```text
components/studio/my-creations/creation-edit-media-panel/
  useCreationEditMediaPanelViewModel.js
```

The ViewModel translates the existing Creation Edit props into the View
contract. It normalizes featured-media slots, identifies the active slot,
constructs the image-library destination, and maps semantic View callbacks back
to the existing application callbacks.

## Contract and Fixtures

```text
components/studio/my-creations/creation-edit-media-panel/
  CreationEditMediaPanel.contract.js
  CreationEditMediaPanel.fixtures.js
```

Current View contract version:

```text
CREATION_EDIT_MEDIA_PANEL_VIEW_CONTRACT_VERSION = "1.0.0"
```

Fixtures are direct View props and contain no creation record, form payload,
creation ID, API behavior, or persistence logic.

## Development Preview

```text
/dev/ui-preview/creation-edit-media-panel
```

The preview is development-only and returns `notFound()` in production. Slot
selection and Replace Slot actions update preview-local state only. The preview
does not load a creation, open the real image picker, call an API, or save media.

## Live Validation

Validate the panel through its existing caller:

```text
components/studio/my-creations/CreationEditShell.jsx
```

Test featured slots with and without images, switching the active slot, opening
Replace Slot, navigating to the image library, chat-capable and non-chat-capable
creation types, saving, and refreshing when media selections change.

## Navigation portability

The Binding Shell owns `next/link` and injects it as `LinkComponent`. The
portable View defaults to a native anchor for direct fixtures and extracted UI
package rendering. Destinations, click handlers, classes, targets, and labels
remain part of the existing display-ready View contract.

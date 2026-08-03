# Selected Characters Panel LOOM boundary

## Public Shell

```text
components/studio/room-templates/SelectedCharactersPanel.jsx
```

The Shell preserves the existing application-facing props used by the Story
create workflow:

```text
selectedCharacters
onOpen
onRemove
```

## Portable View

```text
SelectedCharactersPanel.view.jsx
```

The View receives display-ready character items and semantic callbacks. It does
not know Story package storage, creation/reference payloads, picker state,
selection mutation rules, or persistence behavior.

## ViewModel

```text
useSelectedCharactersPanelViewModel.js
```

The ViewModel normalizes the existing selected-character references into the
versioned View contract and maps application callback names into semantic View
callbacks.

## Fixtures and preview

```text
SelectedCharactersPanel.fixtures.js
app/dev/ui-preview/selected-characters-panel/
```

The preview renders the View directly from contract-shaped fixtures. Add and
remove actions update preview-local state only. It does not open the real
creation picker, update a Story package, or persist data.

## Live caller

```text
components/studio/create/room-template/RoomTemplateBuilderShell.jsx
```

The Story create workflow must be regression-tested. Opening the character
picker, selecting characters, removing characters, saving, and refreshing must
retain the same application behavior.

## Separate edit-flow component

The repository also contains:

```text
components/studio/create/room-template/SelectedCharactersPanel.jsx
```

That component is imported by the Story edit workflow and uses different helper
copy. This conversion does not merge, remove, relocate, or otherwise modify it.
It should receive its own audit and LOOM conversion as a separate task.

# Story Edit Selected Characters Panel LOOM boundary

## Public Shell

```text
components/studio/create/room-template/SelectedCharactersPanel.jsx
```

The Shell preserves the existing application-facing props used by the Story
edit workflow:

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

The existing edit-flow helper copy remains unchanged:

```text
Select one or more characters for this Story.
```

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
app/dev/ui-preview/selected-characters-panel-edit/
```

The preview renders the View directly from contract-shaped fixtures. Add and
remove actions update preview-local state only. It does not open the real
creation picker, update a Story package, or persist data.

## Live caller

```text
components/studio/my-creations/edit/sections/room-templates/
  RoomTemplatePackageSection.jsx
```

The Story edit workflow must be regression-tested. Opening the character
picker, selecting characters, removing characters, saving, and refreshing must
retain the same application behavior.

## Separate create-flow component

The repository also contains the separately validated feature:

```text
components/studio/room-templates/SelectedCharactersPanel.jsx
components/studio/room-templates/selected-characters-panel/
app/dev/ui-preview/selected-characters-panel/
```

That component is used by the Story create workflow and has different helper
copy. This conversion does not merge, remove, relocate, import, or otherwise
modify it.

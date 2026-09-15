# KitFoldersPanel

The Folders panel (ASSET-FOLDERS plan, package AF3, RULED 14 Sep
2026). One panel, titled Folders, listing a surface's folders as a
tree to three levels under a root row All, with the five folder
writes. Contract 1.0.0. Folder glyph only: no emoji, no color (R4).

## What it shows

- Title Folders, New folder at the top (opens a dialog on the Kit
  frame: a name field and an Inside list of allowed parents).
- Root row All with the surface's item count, then the tree, each
  row a folder glyph, the name (truncating with an ellipsis), the
  count of items filed in it and its sub-folders, and a 44px menu
  trigger. Rows are 44px (`--control-md`) at every pointer.
- The row menu, on the shared menu recipe (`components/kit/form-field/
  menuRecipe.jsx`), expands inline under its row: Rename (an inline
  field on the row, Enter saves, Escape cancels), Move to (a picker
  on the Kit frame listing All and every folder with space under the
  cap), Delete (a confirmation on the Kit frame naming what moves up
  to the parent).
- Footer line: "Kept on this device until folders sync." (option 2A).
- Empty state: "No folders yet" with one line of guidance.

## Hosts

| host | where | how |
| --- | --- | --- |
| `column` | 1100 and up, left of the grid | an 18rem sticky aside under the shared filter bar (`top` is the bar's own height in tokens plus one `--space-4`), list scrolling inside |
| `sheet` | below 1100 | `KitModalFrame variant="sheet"` with the grabber, the title in the header slot beside the frame's 44px close control, the ruled mobile sheet surface (`--surface-3`, `--line-whisper`, inset by the `--space-5` gutter), list capped at 70dvh |

The row menu never floats: a floating menu inside the list's
scroller would be clipped by it and could open past the sheet's
bottom edge at 390, so the menu is the shared recipe in flow, always
inside the viewport by construction.

## Contract (1.0.0)

| prop | type | default | meaning |
| --- | --- | --- | --- |
| `host` | `"column"` or `"sheet"` | `"column"` | which host renders |
| `surface` | `"MEDIA"` or `"VAULT"` | `"MEDIA"` | the surface the folders belong to; the rules refuse a cross-surface item |
| `title` | string | `"Folders"` | the panel title |
| `folders` | `{ id, parentId, name, depth }[]` | `[]` | the surface's folders, from the store |
| `itemsByFolder` | `{ [folderId]: itemId[] }` | `{}` | memberships, for the counts |
| `allCount` | number or null | `null` | the count beside All; null hides it |
| `selectedFolderId` | string or null | `null` | null means All |
| `onSelectFolder` | `(folderId or null) => void` | | the user picked a row |
| `onCreateFolder` | `({ parentId, name }) => { ok, note }` | | the store's create |
| `onRenameFolder` | `({ folderId, name }) => { ok, note }` | | the store's rename |
| `onMoveFolder` | `({ folderId, parentId }) => { ok, note }` | | the store's move |
| `onDeleteFolder` | `({ folderId }) => { ok, note }` | | the store's delete |
| `onNotice` | `(note, tone) => void` | | every write's note for KitNotice; a delete arrives in the danger tone, a refusal too |
| `onClose` | `() => void` | | the sheet host's dismiss |
| `footerNote` | string | the ruled line | pass `""` to hide |
| `maxDepth` | number | 3 | display only; the rules enforce the cap |

A callback may return the store's `{ ok, note }`; a refusal inside a
dialog shows as the dialog's error line, a refusal elsewhere goes to
`onNotice` in the danger tone.

## Boundary

```text
AF5 (Media) / AF6 (Vault), out of this package's scope
  -> useFolderStore(surface)              lib/client/studio/folders/useFolderStore.js
       -> getFolderStore(surface)         lib/client/studio/folders/folderStore.js, the one adapter
            -> folderRules.js             pure rules, no React, no storage
  -> KitFoldersPanel (Binding Shell, components/kit/KitFoldersPanel.jsx)
       -> useKitFoldersPanelViewModel     transient state (menu, rename draft, dialogs); rows through folderRules
       -> KitFoldersPanel.view.jsx        presentation only, reads no storage
            -> ../KitModalFrame           the sheet host and the three dialogs
            -> ../form-field/menuRecipe   the row menu and the parent pickers
```

## The store, option 2A

`folderStore.js` is the adapter, shaped like the route the FE
expects and persisted per surface in browser storage behind try and
catch (missing, blocked, or corrupt storage reads as an empty tree; a
failed write keeps the in-memory state). Its header quotes the
expected route. Every write validates through the rules, applies,
persists, notifies, and returns `{ ok, note }`. `useFolderStore`
binds it to React through `useSyncExternalStore`, so there is no
effect anywhere in the chain.

## Rules, `folderRules.js`

Depth cap three; one surface per store, a cross-surface item
refused; sibling names unique within a parent (case-insensitive,
60 characters or fewer); delete lifts children and items to the
parent (at the root the items leave every folder); one folder per
item per surface (M1: filing into another folder removes it from
the first).

## Fixtures

default, empty, deep, longest. `npm run diagnostics:loom:folders`
runs `folderRulesDiagnostics.mjs` (the rules and the store) and
`kitFoldersPanelDiagnostics.mjs` (the fixtures, the View's shape,
and the same four ruled behaviors through the panel's inputs).

## Out of scope

Drag and drop, emoji, color, sharing, and page wiring (AF5 and AF6
mount the panel, bind the store, and place the Folders trigger).

# KitSelectionBar

The one selection bar for Media and Vault (ASSET-FOLDERS plan,
package AF4, RULED 14 Sep 2026, option 3A: one Kit bar, selection
state staying in each page). Contract 1.0.0. Five items exactly (R6):
"N selected", Add to folder, Download, Delete, Done. Select all
visible and Clear are not on it (M2).

## What it shows

- "N selected" in the ornament gold, truncating if the row is tight.
- Add to folder: a read-only picker over the page's folder tree (the
  same rows KitFoldersPanel shows, built by the rules module); one
  tap files the whole selection through `onAddToFolder(folderId)`.
  A modal at 700 and up, the Kit frame's sheet below.
- Download: the page's handler, or the Soon chip on a disabled
  control (`isDownloadSoon`, M3: Vault ships it Soon).
- Delete: the Kit-frame confirmation lifted from the Media grid's
  bulk section, the count and the page's noun in the copy; the
  page's handler runs from the confirm's primary only. `isDeleteSoon`
  puts it on the Soon chip.
- Done: leaves select mode.
- Every control is 44px. Below 700 the Add to folder and Download
  labels drop to their glyphs (the accessible name keeps the word);
  Delete and Done keep their words at every width.

## Placement

Below md the bar is fixed above the mobile dock, full width inside
the page gutter, at the create-page action bar's own offset. At md
and up it is fixed to the bottom of the viewport with a `--space-5`
margin from the bottom edge, never in flow under the grid (1.1.0,
AF5 follow-up 2), centered at a fixed 40rem max width between two
dock insets: `dockInsets` (`{ left, right }` in px) is the page
column's distance from the viewport's left and right edges, so the
bar centers on the column rather than the viewport; absent, the
`--space-5` gutter on both sides. Surface-3 with a whisper line; no
blur, no shadow utility.

## Contract (1.0.0)

| prop | type | default | meaning |
| --- | --- | --- | --- |
| `selectedCount` | number | 0 | 0 renders nothing |
| `itemNoun` | string | `"item"` | the copy's noun, pluralized by the bar |
| `folders` | `{ id, parentId, name, depth }[]` | `[]` | the page's folder tree for the picker |
| `onAddToFolder` | `(folderId) => void` | | files the page's selection |
| `onDownload` | `() => void` | | the page's download |
| `onDelete` | `() => void` | | runs from the confirm's primary only |
| `onDone` | `() => void` | | leaves select mode |
| `isDownloadSoon` | boolean | false | Soon chip, disabled |
| `isDeleteSoon` | boolean | false | Soon chip, disabled |
| `isBusy` | boolean | false | actions disable, Delete reads "Deleting..." |
| `deleteBody` | string | "This cannot be undone." | the confirmation's body line |
| `dockInsets` | `{ left, right }` or null | null | 1.1.0: the page column's px distances from the viewport edges, centering the fixed bar at md and up |

## Handlers, by name, for AF5 and AF6

`onAddToFolder(folderId)`, `onDownload()`, `onDelete()`, `onDone()`.
The bar never sees item ids; the page reads its own selection when a
handler fires.

## Boundary

```text
AF5 (Media) / AF6 (Vault), out of this package's scope
  -> KitSelectionBar (Binding Shell, components/kit/KitSelectionBar.jsx)
       -> useKitSelectionBarViewModel   picker and confirm flags, the phone-width host choice, the copy
       -> KitSelectionBar.view.jsx      presentation only
            -> ../KitModalFrame          the picker (modal or sheet) and the delete confirmation
            -> ../form-field/menuRecipe  the picker rows
            -> ../form-field/SoonChip    the Soon state
```

## Fixtures

none, one, many, soon. `kitSelectionBarDiagnostics.mjs`
(`npm run diagnostics:loom:selection-bar`).

## Out of scope

Page wiring (AF5 and AF6), the Media grid's own bulk section (AF5
replaces it), stacking with KitNotice.

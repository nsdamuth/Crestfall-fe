Nick, folders and select mode are ready for a look. Branch fe/asset-folders, latest code commit 6f8a51a7, docs on top of it.

WHAT LANDED
- Folders: Media Studio and the Vault both get a Folders panel, a column beside the grid on desktop and a sheet on phones, to group, rename, move, and delete folders and file items into them.
- Select mode: both pages let you check off cards and act on the group at once, delete, file into a folder, or take one out.
- Notices: every folder edit and every group action shows one short confirmation line above the grid.
- The Filter swap: the shared filter bar owns its Filter dropdown again on both pages instead of the page rendering it itself.
- The hairline fade: dividers across the sidebar, the mobile drawer, and page headers now fade out at both ends instead of a hard line.
- The composer toggle: on Media Studio, the same open and close arrow the story chat uses collapses the image composer to a thin rail.

THE FOLDERS ROUTE, SHAPED FOR YOU
- Read: GET /api/folders?surface= returns { surface, folders: [{ id, surface, parentId, name, depth, createdAt }], itemsByFolder: { folderId: itemId[] } }.
- Five writes: POST /api/folders { surface, parentId, name } creates; PATCH /api/folders/{id} { name } renames; PATCH /api/folders/{id} { parentId } moves; DELETE /api/folders/{id} deletes; PUT /api/folders/items/{itemId} { surface, folderId or null } files or unfiles one item.
- Three refusals to keep: a folder more than three levels deep, two folders sharing a name under the same parent, and an item filed across surfaces (a Media item into a Vault folder or the reverse).

TODAY, BROWSER ONLY
Folders live in the visitor's own browser storage, not your database, until this route exists. The panel's footer line, "Folders are saved in this browser for now.", says so; remove it the same day you swap the adapter for the real route.

COSTS
None. No coin cost anywhere in folders or select mode.

DRAG AND DROP
Held back this pass. A short written suggestion for it was part of the original plan conversation but never made it into a committed doc, so it is not in this handoff; ask Brian for it directly if you want to scope it now.

WHERE TO LOOK
/studio/v2/images and /studio/v2/vault, at 390 by 844 first, then 1440.

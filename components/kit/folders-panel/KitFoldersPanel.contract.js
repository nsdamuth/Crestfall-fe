export const KIT_FOLDERS_PANEL_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * 1.1.0 (14 Sep 2026, AF5 follow-up 4 item 2, RULED by Brian), additive:
 * collapse and expand. Every row with children carries a 44px chevron
 * at its left that turns 90 degrees on open; children hide while the
 * parent is collapsed; the chosen folder's ancestors always read
 * open; the open state is the panel's own page memory, default open,
 * never persisted; a collapsed parent's count still reads its full
 * subtree. The ViewModel hands the View rows carrying isOpen and
 * hasChildren plus onToggleOpen(folderId); no page prop changes.
 */

/**
 * Stable portable UI boundary for the shared Folders panel kit piece
 * (ASSET-FOLDERS plan, package AF3, RULED 14 Sep 2026). One panel,
 * titled Folders, that lists a surface's folders as a tree to three
 * levels under a root row All, lets the user pick one to filter by,
 * and carries the five folder writes: New folder at the top, and a
 * row menu on the shared menu recipe with Rename (an inline field on
 * the row), Move (a picker on the Kit frame; the copy ruled at AF5
 * follow-up 3), and Delete (a
 * confirmation on the Kit frame). Folder glyph only: no emoji, no
 * color (R4).
 *
 * Two hosts, chosen by the caller: "column", an 18rem column sticky
 * under the shared filter bar (1100 and up, the plan's option 1A),
 * and "sheet", the Kit frame's bottom sheet with a grabber (below
 * 1100). The same content renders in both.
 *
 * The View is stateless presentation and reads no storage. The
 * Shell's ViewModel owns every transient state (the open row menu,
 * the inline rename draft, the create, move, and delete dialogs)
 * and turns the caller's folder state into rows through the rules
 * module (lib/client/studio/folders/folderRules.js). The caller owns
 * the folder state itself, the selection, and what a selection
 * filters; it reports intent through the callbacks below, each of
 * which may return the store's { ok, note } so the panel can hand the
 * note to onNotice for KitNotice.
 *
 * @typedef {Object} KitFoldersPanelFolder
 * @property {string} id
 * @property {string|null} parentId null at the root
 * @property {string} name
 * @property {number} depth 1 to 3
 *
 * @typedef {Object} KitFoldersPanelViewProps (Shell props; the View
 *   receives these plus the ViewModel's display-ready rows and
 *   transient state)
 * @property {"column"|"sheet"} [host] default "column"
 * @property {string} [title] default "Folders"
 * @property {KitFoldersPanelFolder[]} folders the surface's folders
 * @property {Record<string, string[]>} [itemsByFolder] item ids by
 *   folder id, for the count beside each row; default {}
 * @property {number|null} [allCount] the count beside All (every item
 *   on the surface, filed or not); null hides it
 * @property {string|null} [selectedFolderId] null means All
 * @property {((folderId: string|null) => void)|null} onSelectFolder
 * @property {((input: {parentId: string|null, name: string}) => {ok: boolean, note?: string}|void)|null} onCreateFolder
 * @property {((input: {folderId: string, name: string}) => {ok: boolean, note?: string}|void)|null} onRenameFolder
 * @property {((input: {folderId: string, parentId: string|null}) => {ok: boolean, note?: string}|void)|null} onMoveFolder
 * @property {((input: {folderId: string}) => {ok: boolean, note?: string}|void)|null} onDeleteFolder
 * @property {((note: string, tone: "neutral"|"danger") => void)|null} [onNotice]
 *   receives every write's note (a delete's in the danger tone) for
 *   the page's KitNotice
 * @property {(() => void)|null} [onClose] the sheet host's dismiss;
 *   ignored by the column host
 * @property {string} [footerNote] default "Folders are saved in this
 *   browser for now." (option 2A: the panel states where the folders
 *   live until the route lands; copy ruled at AF5 follow-up 1, item 6)
 * @property {number} [maxDepth] default 3, display only; the rules
 *   module enforces the cap
 */

export {};

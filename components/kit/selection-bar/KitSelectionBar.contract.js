export const KIT_SELECTION_BAR_VIEW_CONTRACT_VERSION = "1.2.0";

/**
 * 1.2.0 (14 Sep 2026, AF5 follow-up 3 item 1, RULED by Brian), additive:
 * - removeFromFolderName (string, default ""): while the page has a
 *   folder other than All chosen, the second control reads "Remove
 *   from folder" with the folder-minus glyph and calls
 *   onRemoveFromFolder() on tap; the page unfiles its selection
 *   through the store (a null folder) and shows its note. Empty, the
 *   control is Add to folder as before. Below 700 the label drops to
 *   the glyph with the words as the accessible name, the bar's
 *   existing phone treatment.
 * - onRemoveFromFolder (() => void, default null).
 */

/**
 * 1.1.0 (14 Sep 2026, AF5 follow-up 2 item 1, RULED by Brian), additive:
 * - at md and up the bar is fixed to the bottom of the viewport with a
 *   space-5 margin from the bottom edge, never in flow under the grid.
 * - dockInsets ({ left, right } in px, default null): the page
 *   column's distances from the viewport's left and right edges, so
 *   the fixed bar centers on the page column; absent, the space-5
 *   gutter on both sides. Below md the bar is unchanged.
 */

/**
 * Stable portable UI boundary for the shared selection bar kit piece
 * (ASSET-FOLDERS plan, package AF4, RULED 14 Sep 2026, option 3A: one
 * Kit bar for Media and Vault, selection state staying in each page).
 * One bar, in this order: "N selected", Delete, Add to folder,
 * Download, Done (R6; the order ruled at AF5 follow-up 2, item 7).
 * Select all visible and Clear are not on the bar (M2 ruled). The bar
 * holds no selection state and no item ids; every action reports to
 * a handler the page supplies, and the page reads its own selection
 * when the handler fires.
 *
 * Add to folder opens a read-only picker over the page's folder tree
 * (the same rows KitFoldersPanel shows, built by the rules module);
 * one tap files the whole selection through onAddToFolder(folderId).
 * Delete opens the Kit-frame confirmation lifted from the Media
 * grid's bulk section, with the count in the copy; the page's
 * handler runs from the confirm's primary only. Download and Delete
 * each take an optional Soon state (M3: Download on Vault ships Soon)
 * rendered as the shared SoonChip on a disabled control.
 *
 * Placement: below md the bar docks full width above the mobile
 * dock (fixed, the create-page action bar's own offset); at md and
 * up it is fixed at the bottom of the viewport (1.1.0), centered on
 * the page column through dockInsets at a fixed max width. Every control is 44px. Below 700 the Add to
 * folder and Download labels drop to their glyphs (the accessible
 * name keeps the word); Delete keeps its word at every width
 * (destructive law) and so does Done.
 *
 * @typedef {Object} KitSelectionBarFolder
 * @property {string} id
 * @property {string|null} parentId
 * @property {string} name
 * @property {number} depth
 *
 * @typedef {Object} KitSelectionBarViewProps (Shell props)
 * @property {number} selectedCount 0 hides the bar entirely
 * @property {string} [itemNoun] default "item"; the copy's noun
 *   ("image" on Media, "creation" on Vault), pluralized by the bar
 * @property {KitSelectionBarFolder[]} [folders] the page's folder
 *   tree for the picker; empty shows the picker's empty line
 * @property {((folderId: string) => void)|null} onAddToFolder
 * @property {(() => void)|null} onDownload
 * @property {(() => void)|null} onDelete fires from the confirm's
 *   primary only
 * @property {(() => void)|null} onDone leaves select mode
 * @property {boolean} [isDownloadSoon] default false; Soon chip,
 *   disabled control, title "Not available yet"
 * @property {boolean} [isDeleteSoon] default false; same treatment
 * @property {boolean} [isBusy] default false; while a delete or a
 *   download runs the actions disable and Delete reads "Deleting..."
 * @property {string} [deleteBody] optional one-sentence body for the
 *   confirmation; default "This cannot be undone."
 */

export {};

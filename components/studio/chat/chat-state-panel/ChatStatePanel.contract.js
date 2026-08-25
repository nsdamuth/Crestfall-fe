export const CHAT_STATE_PANEL_VIEW_CONTRACT_VERSION = "1.1.0";

export const CHAT_STATE_PANEL_SECTION_ICON_KEYS = Object.freeze({
  SCENARIO: "scenario",
  WORLD: "world",
  KNOWLEDGE: "knowledge",
  MEMORY: "memory",
  MECHANICS: "mechanics",
});

export const CHAT_STATE_PANEL_ACTION_ICON_KEYS = Object.freeze({
  DOWNLOAD: "download",
  SHARE: "share",
  DELETE: "delete",
});

// Ported from the crestfall-main chat baseline's cast-panel delete
// confirmation, RELOCATED here 23 Aug 2026 (build-0823 pass 2):
// Delete Story now lives on this panel's management row.
export const CHAT_STATE_PANEL_DELETE_CONFIRMATION = [
  "Delete this Story?",
  "",
  "This permanently deletes this chat session and all messages.",
  "Underlying characters, templates, scenarios, narrators, and locations are not deleted.",
  "Interaction totals will remain.",
  "",
  "This cannot be undone.",
].join("\n");

/**
 * Portable View contract, wave C3 (docs/plans/FABLE-GATE-PLAN.md),
 * RESHAPED 1.1.0 (23 Aug 2026, build-0823 pass 2). The management row
 * (Share, Export, Delete) replaces the prior button-stack `actions`
 * rendering; a "delete" action id in `actions` triggers this
 * package's own confirm step through onRequestDeleteRoom/deleteConfirm
 * (relocated from chat-cast-panel) rather than the caller's onPress.
 * Below the row, World, Knowledge, and Mechanics render as quiet
 * key-value rows separated by fade-line section labels, replacing the
 * boxed StateCards. The View must not know the Story snapshot shape,
 * engine-module result fields, room-state fallbacks, export behavior,
 * sharing behavior, delete persistence, APIs, or storage. Desktop
 * renders a sticky collapsible rail; mobile renders a KitModalFrame
 * sheet (R4/R7), never a hand-rolled drawer.
 *
 * @typedef {Object} ChatStatePanelRow
 * @property {string} id
 * @property {string} label
 * @property {string} value Honest static placeholder where no live source exists yet; never fabricated.
 *
 * @typedef {Object} ChatStatePanelSection
 * @property {string} id
 * @property {"scenario"|"world"|"knowledge"|"memory"|"mechanics"} iconKey
 * @property {string} title
 * @property {ChatStatePanelRow[]} rows
 *
 * @typedef {Object} ChatStatePanelAction
 * @property {string} id
 * @property {"download"|"share"|"delete"} iconKey
 * @property {string} label
 * @property {boolean} disabled
 * @property {(() => void)|null} onPress Entry point only for non-delete actions; a "delete" action ignores onPress and routes through the panel's own confirm step instead.
 *
 * @typedef {Object} ChatStatePanelDeleteConfirm
 * @property {boolean} open
 * @property {string} message Baseline copy, CHAT_STATE_PANEL_DELETE_CONFIRMATION.
 * @property {boolean} pending
 * @property {string} error
 * @property {(() => void)|null} onConfirm
 * @property {(() => void)|null} onCancel
 *
 * @typedef {Object} ChatStatePanelViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {ChatStatePanelSection[]} sections World, Knowledge, and Mechanics (the ruled three, 23 Aug 2026).
 * @property {ChatStatePanelAction[]} actions
 * @property {boolean} showCloseControl
 * @property {boolean} initialMobileOpen Fixture/dev-only seed for the mobile sheet's local disclosure state, used only when mobileOpen is not supplied.
 * @property {boolean} [mobileOpen] Controlled mobile-sheet open state; when supplied (a boolean), the View defers to the caller instead of its own local state.
 * @property {((next: boolean) => void)|null} [onMobileOpenChange] Required alongside mobileOpen; fires on every open/close request.
 * @property {(() => void)|null} onClosePanel
 * @property {boolean} deletePending
 * @property {(() => void)|null} onDeleteRoom Performs the real delete; caller-provided, wired live once a room is bound.
 */

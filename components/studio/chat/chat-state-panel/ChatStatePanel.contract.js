export const CHAT_STATE_PANEL_VIEW_CONTRACT_VERSION = "1.1.0";

export const CHAT_STATE_PANEL_SECTION_ICON_KEYS = Object.freeze({
  SCENARIO: "scenario",
  WORLD: "world",
  KNOWLEDGE: "knowledge",
  MEMORY: "memory",
});

export const CHAT_STATE_PANEL_ACTION_ICON_KEYS = Object.freeze({
  DOWNLOAD: "download",
  SHARE: "share",
});

/**
 * Portable View contract, wave C3 (docs/plans/FABLE-GATE-PLAN.md).
 *
 * A designed superset of the crestfall-main chat baseline
 * (story-room-state-panel 1.0.0), scoped to this wave: the four state
 * cards plus entry points only. The full Export Chat and Share
 * Snapshot dialogs are wave C4's chat-session-dialogs package; this
 * package's `actions` are the buttons that will open them, wired to a
 * caller-supplied `onPress`. The View must not know the Story
 * snapshot shape, engine-module result fields, room-state fallbacks,
 * export behavior, sharing behavior, APIs, or persistence. Desktop
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
 * @property {"scenario"|"world"|"knowledge"|"memory"} iconKey
 * @property {string} title
 * @property {ChatStatePanelRow[]} rows
 *
 * @typedef {Object} ChatStatePanelAction
 * @property {string} id
 * @property {"download"|"share"} iconKey
 * @property {string} label
 * @property {boolean} disabled
 * @property {(() => void)|null} onPress Entry point only; opens wave C4's export/share dialog once it exists.
 *
 * @typedef {Object} ChatStatePanelViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {ChatStatePanelSection[]} sections The four cards: Scenario Phase, World State, Knowledge Boundaries, Memory.
 * @property {ChatStatePanelAction[]} actions
 * @property {boolean} showCloseControl
 * @property {boolean} initialMobileOpen Fixture/dev-only seed for the mobile sheet's local disclosure state.
 * @property {boolean|null} mobileOpen Optional controlled mobile-sheet state supplied by ChatShell so composer State actions can open this panel.
 * @property {((open:boolean)=>void)|null} onMobileOpenChange Controlled mobile-sheet disclosure callback.
 * @property {import("react").ReactNode} supplementalContent Optional caller-owned live panel content rendered below session actions; used by the Story Room binding to preserve Runtime Mechanics without moving its application logic into this View.
 * @property {(() => void)|null} onClosePanel
 */

export const STORY_ROOM_STATE_PANEL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Display-ready row supplied to one Story Room state card.
 *
 * @typedef {Object} StoryRoomStatePanelRowViewItem
 * @property {string} id
 * @property {string} label
 * @property {string} value
 */

/**
 * Display-ready state card supplied to the portable View.
 *
 * @typedef {Object} StoryRoomStatePanelSectionViewItem
 * @property {string} id
 * @property {"scenario"|"world"|"knowledge"|"memory"} iconKey
 * @property {string} title
 * @property {StoryRoomStatePanelRowViewItem[]} rows
 */

/**
 * Display-ready future action supplied to the portable View.
 *
 * @typedef {Object} StoryRoomStatePanelActionViewItem
 * @property {string} id
 * @property {"download"|"share"} iconKey
 * @property {string} label
 * @property {boolean} disabled
 */

/**
 * Stable UI boundary for the portable Story Room State Panel View.
 *
 * The View must not know the Story Room snapshot shape, engine-module result
 * fields, room-state fallbacks, runtime ownership, transcript state, mobile
 * drawer orchestration, export behavior, sharing behavior, APIs, or persistence.
 * It receives display-ready sections and emits only semantic close intent.
 *
 * @typedef {Object} StoryRoomStatePanelViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {StoryRoomStatePanelSectionViewItem[]} sections
 * @property {StoryRoomStatePanelActionViewItem[]} actions
 * @property {boolean} showCloseControl
 * @property {(() => void)|null} onClosePanel
 */

export {};

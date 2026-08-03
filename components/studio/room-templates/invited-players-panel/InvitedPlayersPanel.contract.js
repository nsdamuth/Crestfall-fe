export const INVITED_PLAYERS_PANEL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Display-ready invitee supplied to the portable Invited Players Panel.
 *
 * @typedef {Object} InvitedPlayerViewItem
 * @property {string} id
 * @property {string} username
 * @property {string|null} avatarUrl
 * @property {string} displayInitial
 */

/**
 * Stable UI boundary for the portable Invited Players Panel View.
 *
 * The View must not know mutual-follower records, Story package fields,
 * picker state, invite persistence, or removal orchestration. It receives
 * display-ready invitees and emits semantic user intent.
 *
 * @typedef {Object} InvitedPlayersPanelViewProps
 * @property {InvitedPlayerViewItem[]} invitedPlayers
 * @property {string} loadError
 * @property {(() => void)|null} onOpenPlayerPicker
 * @property {((playerId: string) => void)|null} onRemovePlayer
 */

export {};

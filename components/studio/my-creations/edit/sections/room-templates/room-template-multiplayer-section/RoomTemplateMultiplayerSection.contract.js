export const ROOM_TEMPLATE_MULTIPLAYER_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Story multiplayer View.
 *
 * The View must not inspect a creation form, call the mutual-followers hook,
 * know Story JSON storage fields, enforce runtime multiplayer flags, or decide
 * how invited-player changes are persisted. It renders display-ready players
 * and emits semantic turn-mode, invite, and removal intent only.
 *
 * Picker disclosure and search state are presentation-local. They do not
 * change Story application truth.
 *
 * @typedef {Object} RoomTemplateInvitedPlayerViewItem
 * @property {string} id
 * @property {string} username
 * @property {string|null} avatarUrl
 * @property {string} displayInitial
 * @property {string} statusLabel
 * @property {string} removeAriaLabel
 *
 * @typedef {Object} RoomTemplateMutualPlayerViewItem
 * @property {string} id
 * @property {string} username
 * @property {string} tagline
 * @property {string} description
 * @property {string} imageUrl
 * @property {boolean} isSelected
 *
 * @typedef {Object} RoomTemplateMultiplayerSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} turnBasedLabel
 * @property {boolean} effectiveTurnBased
 * @property {string} turnBasedDescription
 * @property {boolean} showTurnBasedRequiredMessage
 * @property {string} turnBasedRequiredMessage
 * @property {string} inviteesLabel
 * @property {string} inviteesDescription
 * @property {string} addPlayerLabel
 * @property {RoomTemplateInvitedPlayerViewItem[]} invitedPlayers
 * @property {string} inviteeStatusLabel
 * @property {string} emptyInviteesMessage
 * @property {string} mutualLoadError
 * @property {RoomTemplateMutualPlayerViewItem[]} mutualPlayers
 * @property {string} pickerEyebrow
 * @property {string} pickerTitle
 * @property {string} pickerDescription
 * @property {string} pickerSearchPlaceholder
 * @property {string} pickerUserLabel
 * @property {string} pickerSelectedLabel
 * @property {string} pickerEmptyTitle
 * @property {string} pickerEmptyDescription
 * @property {(() => void)|null} onToggleTurnBased
 * @property {((playerId: string) => void)|null} onToggleInvitedPlayer
 * @property {((playerId: string) => void)|null} onRemoveInvitedPlayer
 */

export {};

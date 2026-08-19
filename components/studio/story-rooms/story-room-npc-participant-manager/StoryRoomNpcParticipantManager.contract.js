export const STORY_ROOM_NPC_PARTICIPANT_MANAGER_VIEW_CONTRACT_VERSION = "1.2.0";

/**
 * Display-ready NPC entry supplied to the portable View.
 *
 * @typedef {Object} StoryRoomNpcParticipantViewItem
 * @property {string} actionId Opaque View action identifier.
 * @property {string} name
 * @property {string} title
 * @property {string} registryTitle
 * @property {string} avatarUrl
 * @property {string} fallbackInitial
 * @property {string} statusLabel
 * @property {string} statusDetail
 * @property {string} pendingReason
 * @property {string} actionLabel
 * @property {string} busyLabel
 * @property {boolean} busy
 * @property {boolean} disabled
 * @property {string} actionTitle
 * @property {boolean} hasAction
 */

/**
 * Display-ready NPC section supplied to the portable View.
 *
 * @typedef {Object} StoryRoomNpcParticipantSectionViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} emptyMessage
 * @property {"unload"|"target"|"load"|"reload"|"unavailable"} actionIconKey
 * @property {StoryRoomNpcParticipantViewItem[]} entries
 */

/**
 * Stable UI boundary for the portable Story Room NPC Participant Manager View.
 *
 * The View must not know the Story Room registry lifecycle response shape,
 * registry or participant identifiers, action-key construction, load/unload
 * API ownership, Story Room snapshot state, or persistence. It receives only
 * display-ready sections and emits opaque semantic action intent.
 *
 * @typedef {Object} StoryRoomNpcParticipantManagerViewProps
 * @property {string} title
 * @property {string} summaryText
 * @property {boolean} isOpen
 * @property {string} loadingNotice
 * @property {string} registryNotice
 * @property {string} errorMessage
 * @property {StoryRoomNpcParticipantSectionViewItem[]} sections
 * @property {(() => void)|null} onTogglePanel
 * @property {((actionId: string) => void)|null} onActivateNpc
 */

export {};

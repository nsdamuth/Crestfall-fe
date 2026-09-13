export const STORY_ROOM_CAST_PANEL_VIEW_CONTRACT_VERSION = "2.0.0";

/**
 * Stable UI boundary for the Story Room cast panel.
 *
 * 2.0.0, fe/chat-studio item 6 (12 Sep 2026). BREAKING: the panel is the
 * roster and its two actions only, rendered inside the details rail's
 * Cast drill-in. Removed: `eyebrow`, `canClose`, `featuredMedia`,
 * `roomTitle`, `roomIdLabel`, `narrator`, `deleteAction`, `deleteError`,
 * `roomListHref`, `roomListLabel`, `onClosePanel`, `onDeleteRoom`,
 * `LinkComponent`. The story's media, title, delete, and the way back
 * belong to the rail.
 *
 * The portable View owns the cast cards, the Set player character and
 * Manage Cast actions, errors, the Manage Cast modal, and composition of
 * the already-portable NPC participant-manager View. It does not receive
 * raw Story Room records, participant lifecycle records, player-character
 * creations, or API clients.
 *
 * @typedef {Object} StoryRoomCastMemberViewItem
 * @property {string} id
 * @property {string} name
 * @property {string} avatarUrl
 * @property {string} fallbackInitial
 * @property {string} role
 * @property {string} typeLabel Compact player-facing category label.
 * @property {string} state
 * @property {string} displayState Exceptional state only; normal Present/Active is omitted.
 * @property {string} note
 * @property {boolean} isActive
 * @property {boolean} selectable
 * @property {boolean} selected
 * @property {string} selectionAriaLabel
 *
 * @typedef {Object} StoryRoomCastPanelViewProps
 * @property {string} castHeading
 * @property {string} castDescription
 * @property {StoryRoomCastMemberViewItem[]} castMembers
 * @property {{visible:boolean,disabled:boolean,busy:boolean,label:string,busyLabel:string}} playerCharacterAction
 * @property {string} setPlayerCharacterError
 * @property {Object|null} npcParticipantManager Direct StoryRoomNpcParticipantManager View props.
 * @property {{visible:boolean,disabled:boolean,busy:boolean,label:string,busyLabel:string}} randomLikedAction
 * @property {string} randomLikedError
 * @property {import("react").ReactNode} playerCharacterPickerContent Opaque picker overlay slot supplied by the Binding Shell.
 * @property {boolean} manageCastOpen Whether the cast-management modal is visible.
 * @property {(participantId:string)=>void} onSelectCastMember
 * @property {()=>void} onOpenPlayerCharacterPicker
 * @property {()=>void} onOpenManageCast
 * @property {()=>void} onCloseManageCast
 * @property {()=>void} onLoadRandomLiked
 */

export {};

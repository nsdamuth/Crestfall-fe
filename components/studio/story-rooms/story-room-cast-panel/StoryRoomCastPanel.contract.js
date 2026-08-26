export const STORY_ROOM_CAST_PANEL_VIEW_CONTRACT_VERSION = "1.2.0";

/**
 * Stable UI boundary for the Story Room Room & Cast panel.
 *
 * The portable View owns the room-media presentation, cast cards, compact action
 * rail, Manage Cast modal, errors, room-list link, and composition of the already-portable
 * NPC participant-manager View. It does not receive raw Story Room records,
 * participant lifecycle records, player-character creations, or API clients.
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
 * @property {string} eyebrow
 * @property {boolean} canClose
 * @property {{imageUrl:string,imageAltText:string,speakerName:string,emptyEyebrow:string,emptyMessage:string,imageEyebrow:string}} featuredMedia
 * @property {string} roomTitle
 * @property {string} roomIdLabel
 * @property {{label:string,value:string}} narrator
 * @property {string} castHeading
 * @property {string} castDescription
 * @property {StoryRoomCastMemberViewItem[]} castMembers
 * @property {{visible:boolean,disabled:boolean,busy:boolean,label:string,busyLabel:string}} playerCharacterAction
 * @property {string} setPlayerCharacterError
 * @property {Object|null} npcParticipantManager Direct StoryRoomNpcParticipantManager View props.
 * @property {{visible:boolean,disabled:boolean,busy:boolean,label:string,busyLabel:string}} randomLikedAction
 * @property {string} randomLikedError
 * @property {{visible:boolean,disabled:boolean,busy:boolean,label:string,busyLabel:string}} deleteAction
 * @property {string} deleteError
 * @property {string} roomListHref
 * @property {string} roomListLabel
 * @property {import("react").ReactNode} playerCharacterPickerContent Opaque picker overlay slot supplied by the Binding Shell.
 * @property {boolean} manageCastOpen Whether the cast-management modal is visible.
 * @property {()=>void} onClosePanel
 * @property {(participantId:string)=>void} onSelectCastMember
 * @property {()=>void} onOpenPlayerCharacterPicker
 * @property {()=>void} onOpenManageCast
 * @property {()=>void} onCloseManageCast
 * @property {()=>void} onLoadRandomLiked
 * @property {()=>void} onDeleteRoom
 * @property {import("react").ElementType} [LinkComponent] link/anchor component
 *   injected by the host, defaults to "a" in the View.
 */

export {};

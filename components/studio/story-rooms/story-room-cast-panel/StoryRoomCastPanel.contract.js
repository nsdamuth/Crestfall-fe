export const STORY_ROOM_CAST_PANEL_VIEW_CONTRACT_VERSION = "2.3.0";

/**
 * Stable UI boundary for the Story Room cast panel.
 *
 * 2.3.0, fe/chat-studio brief 4 item 6 (13 Sep 2026). Presentation
 * only, no prop changed: the cast card's name is centered at the bottom
 * under the initial or the avatar; the type tag bed moves from the
 * translucent --tag-bed-art (--scrim-strong, 70 percent) to the over-art
 * glass --panel-glass (85 percent), one step more opaque; the wash over
 * the art moves from a literal black gradient to --scrim (40 percent),
 * one token step lighter than --scrim-strong; the selected card carries
 * the gold ring; over-art ink and the 11px label floor replace the
 * card's literals.
 *
 * 2.2.0, fe/chat-studio brief 4 item 5 (13 Sep 2026). ADDITIVE on the
 * ViewModel input: `onOpenManageCast`, handed down by the chat shell
 * when it owns the Manage cast dialog (opened from the composer's add
 * character circle through the StoryRoomManageCastDialog binding); the
 * panel's Manage cast button then opens that one dialog. Without it the
 * panel keeps its local dialog. `ManageCastModal` is exported from the
 * View for that binding. No View prop changed. The roster the panel
 * lists and the composer's cast circles read one participants source,
 * `cast` from useStoryRoomChat (buildCastViewModel).
 *
 * 2.0.0, fe/chat-studio item 6 (12 Sep 2026). BREAKING: the panel is the
 * roster and its two actions only, rendered inside the details rail's
 * Cast drill-in. Removed: `eyebrow`, `canClose`, `featuredMedia`,
 * `roomTitle`, `roomIdLabel`, `narrator`, `deleteAction`, `deleteError`,
 * `roomListHref`, `roomListLabel`, `onClosePanel`, `onDeleteRoom`,
 * `LinkComponent`. The story's media, title, delete, and the way back
 * belong to the rail.
 *
 * 2.1.0, fe/chat-studio item 8: the Manage cast modal is the shared
 * StoryChatDialog recipe (eyebrow Cast, title Manage cast, one sentence,
 * Random liked left, Done right). No prop changed.
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

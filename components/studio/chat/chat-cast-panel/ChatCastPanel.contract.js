export const CHAT_CAST_PANEL_VIEW_CONTRACT_VERSION = "1.1.0";

export const CHAT_CAST_MEMBER_STATES = Object.freeze({
  ARRIVING: "Arriving",
  PRESENT: "Present",
  INACTIVE: "Inactive",
});

// Ported unchanged from the crestfall-main chat baseline
// (useStoryRoomChatShellViewModel.js): the real confirm-step copy this
// package's deleteConfirm sheet carries, replacing window.confirm.
export const CHAT_CAST_PANEL_DELETE_CONFIRMATION = [
  "Delete this Story?",
  "",
  "This permanently deletes this chat session and all messages.",
  "Underlying characters, templates, scenarios, narrators, and locations are not deleted.",
  "Interaction totals will remain.",
  "",
  "This cannot be undone.",
].join("\n");

/**
 * Portable View contract, wave C3 (docs/plans/FABLE-GATE-PLAN.md).
 *
 * A designed superset of the crestfall-main chat baseline
 * (story-room-cast-panel 1.0.0). The View owns the room-media
 * presentation, cast cards, action controls, errors, the delete
 * confirm step, room-list link, and composition of the already
 * portable `chat-npc-manager` View. It does not receive raw Story
 * records, participant lifecycle records, player-character creations,
 * or API clients. Desktop renders a sticky collapsible rail; mobile
 * renders a KitModalFrame sheet (R4/R7), never a hand-rolled drawer.
 *
 * @typedef {Object} ChatCastMemberViewItem
 * @property {string} id
 * @property {string} name
 * @property {string} avatarUrl
 * @property {string} fallbackInitial
 * @property {string} role
 * @property {"Arriving"|"Present"|"Inactive"|string} state
 * @property {string} note
 * @property {boolean} isActive
 * @property {boolean} selectable
 * @property {boolean} selected
 * @property {string} selectionLabel
 * @property {string} selectionAriaLabel
 *
 * @typedef {Object} ChatCastPanelActionState
 * @property {boolean} visible
 * @property {boolean} disabled
 * @property {boolean} busy
 * @property {string} label
 * @property {string} busyLabel
 *
 * @typedef {Object} ChatCastPanelDeleteConfirm
 * @property {boolean} open
 * @property {string} message Baseline copy, CHAT_CAST_PANEL_DELETE_CONFIRMATION.
 * @property {boolean} pending
 * @property {string} error
 * @property {(() => void)|null} onConfirm
 * @property {(() => void)|null} onCancel
 *
 * @typedef {Object} ChatCastPanelViewProps
 * @property {string} eyebrow
 * @property {boolean} canClose
 * @property {{imageUrl:string,imageAltText:string,speakerName:string,emptyEyebrow:string,emptyMessage:string,imageEyebrow:string}} featuredMedia Deterministic last-speaker image pick; determinism is caller-owned.
 * @property {string} roomTitle
 * @property {string} roomIdLabel
 * @property {{label:string,value:string}} narrator
 * @property {string} castHeading
 * @property {string} castDescription
 * @property {ChatCastMemberViewItem[]} castMembers
 * @property {ChatCastPanelActionState} playerCharacterAction Visible only when turnCount === 0 (caller-owned gate).
 * @property {string} setPlayerCharacterError
 * @property {import("react").ReactNode} playerCharacterPickerContent Opaque picker overlay slot supplied by the Binding Shell.
 * @property {Object|null} npcParticipantManager Direct ChatNpcManager View props.
 * @property {ChatCastPanelActionState} randomLikedAction
 * @property {string} randomLikedError
 * @property {ChatCastPanelActionState} deleteAction
 * @property {string} deleteError
 * @property {ChatCastPanelDeleteConfirm|null} deleteConfirm
 * @property {string} roomListHref
 * @property {string} roomListLabel
 * @property {boolean} initialMobileOpen Fixture/dev-only seed for the mobile sheet's local disclosure state.
 * @property {boolean|null} mobileOpen Optional controlled mobile-sheet state supplied by ChatShell so composer Cast actions can open this panel.
 * @property {((open:boolean)=>void)|null} onMobileOpenChange Controlled mobile-sheet disclosure callback.
 * @property {(() => void)|null} onClosePanel
 * @property {((participantId: string) => void)|null} onSelectCastMember
 * @property {(() => void)|null} onOpenPlayerCharacterPicker
 * @property {(() => void)|null} onLoadRandomLiked
 * @property {(() => void)|null} onRequestDeleteRoom Opens deleteConfirm; the confirm step's own onConfirm performs the real delete.
 */

export const CHAT_CAST_PANEL_VIEW_CONTRACT_VERSION = "2.0.0";

export const CHAT_CAST_PANEL_MAX_PARTY_SIZE = 5;

/**
 * Portable View contract, wave C3 (docs/plans/FABLE-GATE-PLAN.md),
 * RESHAPED 2.0.0 (23 Aug 2026, build-0823 pass 2, the Party panel
 * ruling): renamed from Cast to Party in every user-visible string;
 * fixed 5 slots, vertical rows, dashed "Open slot" placeholders past
 * the filled count. Set Player Character, Random Liked, and Delete
 * Story left this package (Delete Story now lives on
 * chat-state-panel's management row); a double-click on a filled
 * slot or a tap on an open slot opens the Party roster instead,
 * through onOpenPartyRoster. The scene-art well is icon-only per the
 * missing-image law (no caption) and opens the image selector
 * through onOpenSceneImagePicker. The View does not receive raw Story
 * records, participant lifecycle records, player-character creations,
 * or API clients. Desktop renders a sticky collapsible rail; mobile
 * renders a KitModalFrame sheet (R4/R7), never a hand-rolled drawer.
 *
 * @typedef {Object} ChatPartyMemberViewItem
 * @property {string} id
 * @property {string} name
 * @property {string} avatarUrl
 * @property {string} fallbackInitial
 * @property {string} role
 * @property {string} color CSS color, the per-member --chat-speaker anchor for the avatar tile and fallback initial ink.
 *
 * @typedef {Object} ChatCastPanelViewProps
 * @property {string} eyebrow
 * @property {boolean} canClose
 * @property {{imageUrl:string,imageAltText:string,speakerName:string,imageEyebrow:string}} featuredMedia Deterministic last-speaker image pick; determinism is caller-owned.
 * @property {string} roomTitle
 * @property {string} roomIdLabel
 * @property {{label:string,value:string}} narrator
 * @property {string} partyHeading
 * @property {string} partyDescription
 * @property {ChatPartyMemberViewItem[]} partyMembers Up to CHAT_CAST_PANEL_MAX_PARTY_SIZE; remaining slots render dashed and open.
 * @property {Object|null} npcParticipantManager Direct ChatNpcManager View props.
 * @property {string} roomListHref
 * @property {string} roomListLabel
 * @property {boolean} initialMobileOpen Fixture/dev-only seed for the mobile sheet's local disclosure state, used only when mobileOpen is not supplied.
 * @property {boolean} [mobileOpen] Controlled mobile-sheet open state; when supplied (a boolean), the View defers to the caller instead of its own local state.
 * @property {((next: boolean) => void)|null} [onMobileOpenChange] Required alongside mobileOpen; fires on every open/close request.
 * @property {(() => void)|null} onClosePanel
 * @property {(() => void)|null} onOpenPartyRoster Opens the Party roster selection surface (new package, chat-party-roster).
 * @property {(() => void)|null} onOpenSceneImagePicker Opens the scene image selector.
 */

export const CHAT_SHELL_VIEW_CONTRACT_VERSION = "1.1.0";

export const CHAT_SHELL_STATUS_PILL_TONES = Object.freeze({
  NEUTRAL: "neutral",
  GOLD: "gold",
  DANGER: "danger",
});

/**
 * Portable View contract, wave C5 (docs/plans/FABLE-GATE-PLAN.md).
 *
 * Composes the wave C1-C4 chat packages (chat-transcript, chat-composer,
 * chat-cast-panel, which itself composes chat-npc-manager, chat-state-panel,
 * chat-session-dialogs) into the three-region desktop layout (cast rail,
 * transcript + docked composer, state rail) with collapsible rails, and a
 * mobile context header carrying title, scenario, and status pills, the
 * improvement over the crestfall-main baseline's desktop-only header (C1).
 * Also seats the O6 monetization surfaces: a coin chip composing the
 * existing Studio Economy Widget View, and a fixture-fed gated-action
 * upsell sheet for Library Pass moments (CR-046 for real data; Scene Image
 * gating itself already lives inside chat-composer's own confirm sheet).
 *
 * The View does not receive raw Story/room records, does not call an API,
 * and does not own persistence. Every composed prop group below is a
 * direct pass-through of that package's own View-contract props; this
 * package never reshapes them. The page's Binding Shell (wave C5,
 * app/studio/v2/stories/[id]/**) supplies every value from a named mock
 * module pending CR-043.
 *
 * @typedef {Object} ChatShellStatusPill
 * @property {string} id
 * @property {string} label
 * @property {"neutral"|"gold"|"danger"} tone
 *
 * @typedef {Object} ChatShellCoinChip Direct StudioEconomyWidget View-contract props, layoutMode fixed to "mobileHeader" by this package.
 * @property {string} balanceLabel
 * @property {boolean} buyInfoOpen
 * @property {boolean} notificationsInfoOpen
 * @property {(() => void)|null} onOpenBuyInfo
 * @property {(() => void)|null} onCloseBuyInfo
 * @property {(() => void)|null} onOpenNotificationsInfo
 * @property {(() => void)|null} onCloseNotificationsInfo
 *
 * @typedef {Object} ChatShellLibraryPassUpsell CR-046: fixture-fed gated-action upsell sheet for auto-event media pool moments (O6).
 * @property {boolean} open
 * @property {string} title
 * @property {string} message
 * @property {string} passLabel
 * @property {string} coinCostLabel
 * @property {(() => void)|null} onOpenLibrary
 * @property {(() => void)|null} onDismiss
 *
 * @typedef {Object} ChatShellSessionDialogs Direct { activeDialog, summaryPending } ChatSessionDialogs View-contract props.
 *
 * @typedef {Object} ChatShellViewProps
 * @property {string} backHref
 * @property {string} backLabel
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} scenarioLabel
 * @property {string} modeLabel
 * @property {ChatShellStatusPill[]} statusPills
 * @property {ChatShellCoinChip} coinChip
 * @property {boolean} loading
 * @property {string} errorMessage
 * @property {boolean} leftRailCollapsed Desktop-only; mobile always reaches the cast panel through chat-cast-panel's own sheet.
 * @property {boolean} rightRailCollapsed Desktop-only; mobile always reaches the state panel through chat-state-panel's own sheet.
 * @property {(() => void)|null} onToggleLeftRail
 * @property {(() => void)|null} onToggleRightRail
 * @property {Object} transcript Direct ChatTranscript View-contract props.
 * @property {Object} composer Direct ChatComposer View-contract props.
 * @property {Object} castPanel Direct ChatCastPanel View-contract props.
 * @property {Object} statePanel Direct ChatStatePanel View-contract props.
 * @property {ChatShellSessionDialogs} sessionDialogs
 * @property {ChatShellLibraryPassUpsell|null} libraryPassUpsell
 * @property {Object|null} partyRoster Added 1.1.0. Direct ChatPartyRoster View-contract props (open gates rendering); the caller wires it to chat-cast-panel's onOpenPartyRoster.
 *
 * 1.1.0, 23 Aug 2026 (build-0823 pass 2): the two chat-local headers
 * this package rendered are removed; the real StudioShell top bar
 * and sidebar already wrap this route. This package now contributes
 * one in-flow header (title, one meta line, the coin chip) instead.
 * The rail-collapse toggles moved into the composed panels' own
 * headers (chat-cast-panel's canClose/onClosePanel, chat-state-panel's
 * showCloseControl/onClosePanel, both already-declared props, no
 * shape change). This package also now opens the cast/state panels'
 * mobile sheets from the composer's Menu and Party chips, by lifting
 * the panels' mobile-open state and passing it down through each
 * panel's own (already-additive) mobile-open controls; no new prop
 * is added to this package's own boundary.
 */

export {};

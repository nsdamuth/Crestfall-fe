export const STORY_ROOM_CHAT_SHELL_VIEW_CONTRACT_VERSION =
  "story-room-chat-shell.view.v2.0";

/**
 * v2.0, fe/chat-studio item 1 (12 Sep 2026). BREAKING: `layoutClass`,
 * `onShowLeftPanel`, and `onShowRightPanel` are removed; the desktop
 * header block (eyebrow, title, type line, Cast Open and State Open
 * toggles, status pills) is gone. ADDITIVE: `railsState` drives the grid
 * through app/design-system.css (.cf-story-room-grid[data-rails]),
 * `swipeEnabled` replaces the View's own viewport read, `primaryCharacter`
 * and `backHref` feed the 44px mobile bar below md, `storyListProps` and
 * `StoryListComponent` mount the left rail story list (ruling D4), and
 * `LinkComponent` keeps the View portable for the back link. The rails
 * collapse to one bare 44px edge toggle each. Left rail ownership goes
 * through StudioChromeProvider (one left panel at a time).
 *
 * @typedef {Object} StoryRoomChatShellViewProps
 * @property {Object} room
 * @property {"none"|"left"|"right"|"both"} railsState
 * @property {boolean} leftOpen
 * @property {boolean} rightOpen
 * @property {boolean} swipeEnabled True below md, where horizontal swipes open the mobile panels.
 * @property {{label: string, avatarUrl: string}|null} primaryCharacter The first Character responder, for the mobile bar circle.
 * @property {string} backHref The mobile bar's back link, the Stories page.
 * @property {Object} storyListProps { currentRoomId, refetchKey }
 * @property {"cast"|"state"|null} mobilePanel
 * @property {"COMMANDS"|"HELP"|null} composerHelpPanel
 * @property {Array<Object>} commands
 * @property {Array<Object>} statusSurfaces Host-agnostic authoritative readout projections.
 * @property {string} statusSurfaceError Non-fatal persistent surface loading error.
 * @property {Object} castPanelProps
 * @property {Object} mobileCastPanelProps
 * @property {Object} transcriptProps
 * @property {Object|null} playerCharacterPickerProps binding-shell props for the
 *   transient pre-first-message Player Character picker
 * @property {Object} composerProps
 * @property {Object} desktopStatePanelProps
 * @property {Object} mobileStatePanelProps
 * @property {Object|null} runtimeMechanicsPanelProps
 * @property {() => void} onToggleLeftPanel
 * @property {() => void} onToggleRightPanel
 * @property {() => void} onOpenMobileCast
 * @property {() => void} onOpenMobileState
 * @property {() => void} onCloseMobilePanel
 * @property {() => void} onCloseComposerHelpPanel
 * @property {import("react").ElementType} CastPanelComponent
 * @property {import("react").ElementType} ComposerComponent
 * @property {import("react").ElementType} MobileDrawerComponent
 * @property {import("react").ElementType} RuntimeMechanicsPanelComponent
 * @property {import("react").ElementType} StatePanelComponent
 * @property {import("react").ElementType} StatusSurfaceHostComponent
 * @property {import("react").ElementType} StoryListComponent
 * @property {import("react").ElementType} TranscriptComponent
 * @property {import("react").ElementType} LinkComponent Injected next/link; "a" when portable.
 */

export const STORY_ROOM_CHAT_SHELL_PORTABILITY_RULES = Object.freeze({
  ownsRouterNavigation: "Binding Shell",
  ownsBrowserConfirmation: "Binding Shell",
  ownsApplicationChildBindings: "Binding Shell",
  ownsStoryRoomTransportHook: "Transport / Runtime Hook",
  ownsSnapshotNormalization: "Transport / Runtime Hook",
  ownsOptimisticMessageLifecycle: "Transport / Runtime Hook",
  ownsRegistryNpcLifecycle: "Transport / Runtime Hook",
  ownsComposerAndPanelState: "ViewModel",
  ownsCapabilityPresentation: "ViewModel",
  ownsLocalCommandResolution: "ViewModel",
  ownsStoryRoomDeletionClient: "ViewModel",
  ownsViewportReads: "ViewModel",
  ownsResponsiveChatLayout: "CSS block plus Portable View",
  ownsHelpAndMobileBarMarkup: "Portable View",
});

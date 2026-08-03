export const STORY_ROOM_CHAT_SHELL_VIEW_CONTRACT_VERSION =
  "story-room-chat-shell.view.v1";

/**
 * @typedef {Object} StoryRoomChatShellViewProps
 * @property {Object} room
 * @property {string} layoutClass
 * @property {boolean} leftOpen
 * @property {boolean} rightOpen
 * @property {"cast"|"state"|null} mobilePanel
 * @property {"COMMANDS"|"HELP"|null} composerHelpPanel
 * @property {Array<Object>} commands
 * @property {Object} castPanelProps
 * @property {Object} mobileCastPanelProps
 * @property {Object} transcriptProps
 * @property {Object} composerProps
 * @property {Object} desktopStatePanelProps
 * @property {Object} mobileStatePanelProps
 * @property {Object} runtimeMechanicsPanelProps
 * @property {() => void} onToggleLeftPanel
 * @property {() => void} onToggleRightPanel
 * @property {() => void} onShowLeftPanel
 * @property {() => void} onShowRightPanel
 * @property {() => void} onCloseMobilePanel
 * @property {() => void} onCloseComposerHelpPanel
 * @property {import("react").ElementType} CastPanelComponent
 * @property {import("react").ElementType} ComposerComponent
 * @property {import("react").ElementType} MobileDrawerComponent
 * @property {import("react").ElementType} RuntimeMechanicsPanelComponent
 * @property {import("react").ElementType} StatePanelComponent
 * @property {import("react").ElementType} TranscriptComponent
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
  ownsLocalCommandResolution: "ViewModel",
  ownsStoryRoomDeletionClient: "ViewModel",
  ownsResponsiveChatLayout: "Portable View",
  ownsHelpAndHeaderMarkup: "Portable View",
});

export const STORY_ROOM_CHAT_SHELL_VIEW_CONTRACT_VERSION =
  "story-room-chat-shell.view.v4.0";

/**
 * v4.0, fe/chat-studio brief 2 item 11 (13 Sep 2026). BREAKING:
 * `onOpenMobileGallery` and the "gallery" mobile panel are removed with
 * the mobile bar's media button; the mobile bar keeps the back chevron,
 * the character circle, and the title. `mobilePanel` is now
 * "stories" | "details" | null: "stories" mounts the story list as a
 * left sheet (`KitModalFrame variant="drawer"`), "details" the details
 * rail as the bottom sheet. ADDITIVE: `onOpenMobileStoryList`;
 * `composerProps` carries `onOpenStoryList` and `onOpenSettings` for
 * the composer's below-md buttons (starred placement: story list at
 * the far left of the cast row, settings at the far right of the send
 * row; the cast row budget at 390 is measured in
 * story-room-composer/storyRoomComposerMobileRowBudgetDiagnostics.mjs).
 * Rails (items 5 and 6, presentation only): the edge toggles carry the
 * primary sidebar's collapse glyph and bare recipe, an open rail sits
 * on --surface-2, a closed rail carries no surface.
 *
 * v3.0, fe/chat-studio item 6 (12 Sep 2026). BREAKING: the right rail is
 * the details rail (`DetailsRailComponent`, `detailsRailProps`,
 * `mobileDetailsRailProps`); `CastPanelComponent`, `StatePanelComponent`,
 * `RuntimeMechanicsPanelComponent`, `MobileDrawerComponent`,
 * `castPanelProps`, `mobileCastPanelProps`, `desktopStatePanelProps`,
 * `mobileStatePanelProps`, `runtimeMechanicsPanelProps`,
 * `onOpenMobileCast`, and `onOpenMobileState` leave the View (the rail's
 * own binding composes those panels). `mobilePanel` is now
 * "details" | "gallery" | null: below md the settings button opens the
 * rail as a bottom sheet and the media button opens it with the gallery
 * viewer on the featured image (`onOpenMobileDetails`,
 * `onOpenMobileGallery`). The delete confirm is the shared
 * StoryChatDialog (ruling D3, danger tone per decision E1). The center
 * column sits on the canvas and the rails on the card surface (Brian's
 * amendment).
 *
 * v2.1, fe/chat-studio item 4 (12 Sep 2026), additive: `chatColorProps`
 * ({ paletteId, creatorPaletteId, isOverridden, options, onChange,
 * onReset }) carries the chat color state the ViewModel owns (creator
 * default from the primary Character's palette, page-state override
 * until CR-066) for the Preferences drill-in the right rail mounts in
 * item 6; `transcriptProps.chatColor` is the resolved anchor.
 *
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
 * @property {Object} detailsRailProps StoryRoomDetailsRail binding props (room, cast, messages, castPanelProps, statePanelProps, runtimeMechanicsPanelProps, chatColorProps, onDeleteRoom, isDeletingRoom, deleteError).
 * @property {Object} mobileDetailsRailProps The same bag for the right sheet; its cast roster closes the sheet on a pick.
 * @property {"stories"|"details"|null} mobilePanel
 * @property {"COMMANDS"|"HELP"|null} composerHelpPanel
 * @property {Array<Object>} commands
 * @property {Array<Object>} statusSurfaces Host-agnostic authoritative readout projections.
 * @property {string} statusSurfaceError Non-fatal persistent surface loading error.
 * @property {Object} transcriptProps
 * @property {Object|null} playerCharacterPickerProps binding-shell props for the
 *   transient pre-first-message Player Character picker
 * @property {Object} composerProps
 * @property {{paletteId: string, creatorPaletteId: string, isOverridden: boolean, options: Array<{id: string, label: string, family: string, swatch: string}>, onChange: (paletteId: string) => void, onReset: () => void}} chatColorProps
 * @property {() => void} onToggleLeftPanel
 * @property {() => void} onToggleRightPanel
 * @property {() => void} onOpenMobileDetails
 * @property {() => void} onOpenMobileStoryList
 * @property {() => void} onCloseMobilePanel
 * @property {boolean} isConfirmingDeleteRoom
 * @property {boolean} isDeletingRoom
 * @property {() => void} onCloseComposerHelpPanel
 * @property {import("react").ElementType} ComposerComponent
 * @property {import("react").ElementType} DetailsRailComponent
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
  ownsDetailsRailComposition: "StoryRoomDetailsRail Binding Shell",
});

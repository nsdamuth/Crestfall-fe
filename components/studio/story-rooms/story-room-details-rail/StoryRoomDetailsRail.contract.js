export const STORY_ROOM_DETAILS_RAIL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the story chat page's right rail
 * (fe/chat-studio item 6, 12 Sep 2026), also the content of the right
 * sheet below md.
 *
 * Order: gallery (featured image, previous and next, thumbnail strip;
 * tap opens the full-screen viewer), title with the three-dot menu
 * (Delete story), rating and visibility chips, byline and description
 * when served (CR-067, CR-068), Export and Share, then the drill-in rows
 * Cast, Narrator, World state, Mechanics, Preferences. A drill-in
 * replaces the rail content in place under a 44px back row. No rows for
 * anything the Chassis does not serve.
 *
 * @typedef {Object} StoryRoomMediaItem
 * @property {string} id
 * @property {string} url
 * @property {string} altText
 * @property {string} sourceLabel
 *
 * @typedef {Object} StoryRoomDetailsRailViewProps
 * @property {string} title
 * @property {Array<{id: string, label: string}>} chips
 * @property {{handle: string, href: string|null}|null} byline Hidden until CR-067.
 * @property {string} description Hidden until CR-068.
 * @property {boolean} descriptionExpanded
 * @property {() => void} onToggleDescription
 * @property {{items: StoryRoomMediaItem[], activeIndex: number, onSelect: (index: number) => void, onPrevious: () => void, onNext: () => void, viewerIndex: number|null, onOpenViewer: (index?: number) => void, onCloseViewer: () => void, onViewerPrevious: () => void, onViewerNext: () => void}} gallery
 * @property {{open: boolean, onToggle: () => void, onClose: () => void, items: Array<{id: string, label: string, tone: "default"|"danger", disabled: boolean, onSelect: () => void}>}} menu
 * @property {string} deleteError
 * @property {import("react").ReactNode} actionsSlot Export and Share, the state panel's live actions.
 * @property {Array<{id: "cast"|"narrator"|"world"|"mechanics"|"preferences", label: string}>} rows
 * @property {string|null} activeDetail
 * @property {(id: string) => void} onOpenDetail
 * @property {() => void} onBack
 * @property {Record<string, import("react").ReactNode>} detailPanels One node per row id.
 * @property {import("react").ElementType} LinkComponent Injected next/link; "a" when portable.
 */

export const STORY_ROOM_DETAILS_RAIL_PORTABILITY_RULES = Object.freeze({
  ownsRouterNavigation: "Binding Shell",
  ownsPanelComposition: "Binding Shell",
  ownsMediaSetAndDrillInState: "ViewModel",
  ownsChatColorState: "Chat shell ViewModel",
  ownsRailMarkup: "Portable View",
});

export {};

export const STORY_ROOMS_HUB_VIEW_CONTRACT_VERSION =
  "story-rooms-hub.view.v1";

/**
 * @typedef {Object} StoryRoomsHubFilterViewItem
 * @property {string} id
 * @property {string} label
 *
 * @typedef {Object} StoryRoomsHubRoomViewItem
 * @property {string} id
 * @property {string} href
 * @property {string} title
 * @property {string} subtitle
 * @property {string} type
 * @property {string} status
 * @property {string} visibility
 * @property {string} contentRating
 * @property {string} scenario
 * @property {string} narrator
 * @property {string} location
 * @property {string} roomMode
 * @property {string[]} cast
 * @property {string} lastMessage
 * @property {string} lastActive
 * @property {number} messages
 * @property {boolean} selected
 *
 * @typedef {Object} StoryRoomsHubViewProps
 * @property {StoryRoomsHubFilterViewItem[]} filters
 * @property {string} activeFilter
 * @property {string} activeFilterLabel
 * @property {string} query
 * @property {"grid"|"list"} viewMode
 * @property {boolean} mobileToolsOpen
 * @property {boolean} manageMode
 * @property {boolean} deletingRooms
 * @property {number} selectedCount
 * @property {boolean} canDeleteSelected
 * @property {StoryRoomsHubRoomViewItem[]} visibleRooms
 * @property {boolean} hasRooms
 * @property {string} latestRoomHref
 * @property {string} createTemplateHref
 * @property {string} loadError
 * @property {string} deleteError
 * @property {boolean} showLoading
 * @property {boolean} showEmpty
 * @property {string} libraryEyebrow
 * @property {string} libraryDescription
 * @property {string} desktopSearchPlaceholder
 * @property {string} mobileSearchPlaceholder
 * @property {string} loadingTitle
 * @property {string} loadingMessage
 * @property {string} emptyTitle
 * @property {string} emptyMessage
 * @property {(() => void)|null} onToggleMobileTools
 * @property {((query: string) => void)|null} onQueryChange
 * @property {((filterId: string) => void)|null} onActiveFilterChange
 * @property {((viewMode: "grid"|"list") => void)|null} onViewModeChange
 * @property {(() => void)|null} onToggleManageMode
 * @property {((roomId: string) => void)|null} onToggleRoomSelection
 * @property {(() => void)|null} onDeleteSelectedRooms
 * @property {import("react").ElementType} InternalLinkComponent
 * @property {import("react").ElementType|null} ViewModeToggleComponent
 */

export const STORY_ROOMS_HUB_PORTABILITY_RULES = Object.freeze({
  ownsRoomClientCalls: "ViewModel",
  ownsRawRoomNormalization: "ViewModel",
  ownsFilteringAndSelection: "ViewModel",
  ownsPersistentViewMode: "ViewModel",
  ownsDeleteConfirmationAndMutation: "ViewModel",
  ownsNextLinkBinding: "Binding Shell",
  ownsApplicationViewModeBinding: "Binding Shell",
  ownsPortableMarkup: "Portable View",
});

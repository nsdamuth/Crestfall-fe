export const COMMUNITY_HUB_VIEW_CONTRACT_VERSION = "community-hub.view.v1";

/**
 * @typedef {Object} CommunityHubViewProps
 * @property {"CREATIONS"|"CREATORS"} mode
 * @property {string} query
 * @property {string} queryPlaceholder
 * @property {string} activeTag
 * @property {string} activeType
 * @property {string} activeCreationFilter
 * @property {string} activeCreatorFilter
 * @property {"GRID"|"LIST"} creatorView
 * @property {Array<{id: string, label: string}>} creationTypes
 * @property {Array<{id: string, label: string}>} creationFilters
 * @property {Array<{id: string, label: string}>} creatorFilters
 * @property {Array<{value: string, label: string}>} sortOptions
 * @property {Array<{value: string, label: string}>} ratingOptions
 * @property {Array<{value: string, label: string}>} renderingOptions
 * @property {string[]} topCommunityTags
 * @property {string} sort
 * @property {string} rating
 * @property {string} rendering
 * @property {Object[]} visibleCommunityCreations
 * @property {Object[]} visibleCommunityCreators
 * @property {number} filteredCreationCount
 * @property {number} filteredCreatorCount
 * @property {number} remainingCommunityCreationCount
 * @property {number} remainingCommunityCreatorCount
 * @property {number} nextCreationLoadCount
 * @property {number} nextCreatorLoadCount
 * @property {boolean} isMobileCompactCreationGrid
 * @property {boolean} isMobileCompactCreatorGrid
 * @property {string} mobileCreationGridToggleLabel
 * @property {string} creationGridClass
 * @property {string} creatorGridClass
 * @property {string} engagementMessage
 * @property {number} eagerCreationImageCount
 * @property {(creation: Object) => boolean} isCreationLiked
 * @property {(creation: Object) => boolean} isCreationBookmarked
 * @property {(creator: Object) => boolean} isProfileLiked
 * @property {(creator: Object) => boolean} isProfileBookmarked
 * @property {(creator: Object) => boolean} isProfileFollowed
 * @property {Function|null} toggleCreationLike
 * @property {Function|null} toggleCreationBookmark
 * @property {Function|null} toggleProfileLike
 * @property {Function|null} toggleProfileBookmark
 * @property {Function|null} toggleProfileFollow
 * @property {Function|null} onModeChange
 * @property {Function|null} onQueryChange
 * @property {Function|null} onActiveTagChange
 * @property {Function|null} onActiveTypeChange
 * @property {Function|null} onActiveCreationFilterChange
 * @property {Function|null} onActiveCreatorFilterChange
 * @property {Function|null} onCreatorViewChange
 * @property {Function|null} onSortChange
 * @property {Function|null} onRatingChange
 * @property {Function|null} onRenderingChange
 * @property {Function|null} onToggleMobileCreationGridMode
 * @property {Function|null} onLoadMoreCreations
 * @property {Function|null} onLoadMoreCreators
 * @property {import("react").ElementType} FilterPanelComponent
 * @property {import("react").ElementType} SelectComponent
 * @property {import("react").ElementType|null} TagFilterComponent
 * @property {import("react").ElementType|null} CreationCardComponent
 * @property {import("react").ElementType|null} CreatorCardComponent
 * @property {import("react").ElementType|null} CreatorListRowComponent
 */

export const COMMUNITY_HUB_PORTABILITY_RULES = Object.freeze({
  ownsCommunityFilteringAndSorting: "ViewModel",
  ownsPaginationAndDisplayModes: "ViewModel",
  ownsEngagementOrchestration: "ViewModel",
  ownsApplicationCardsAndControls: "Binding Shell",
  ownsPortableMarkup: "Portable View",
});

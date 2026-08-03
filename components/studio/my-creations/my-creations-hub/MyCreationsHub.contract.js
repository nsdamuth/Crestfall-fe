export const MY_CREATIONS_HUB_VIEW_CONTRACT_VERSION =
  "my-creations-hub.view.v1";

/**
 * @typedef {Object} MyCreationsHubViewProps
 * @property {string} eyebrow
 * @property {string} filterBody
 * @property {string} queryPlaceholder
 * @property {string} createHref
 * @property {string} createLabel
 * @property {string} emptyActionLabel
 * @property {string} tagFilterLabel
 * @property {string} allTagValue
 * @property {Array<{id: string, label: string}>} tabs
 * @property {string} activeTab
 * @property {string} activeTag
 * @property {string} query
 * @property {string[]} ownedCreationTags
 * @property {Object[]} visibleCreations
 * @property {number} filteredCreationCount
 * @property {number} remainingCreationCount
 * @property {number} nextLoadCount
 * @property {boolean} isMobileCompactGrid
 * @property {string} mobileGridToggleLabel
 * @property {string} creationGridClass
 * @property {string} engagementMessage
 * @property {number} eagerCreationImageCount
 * @property {(creation: Object) => boolean} isCreationLiked
 * @property {(creation: Object) => boolean} isCreationBookmarked
 * @property {((creation: Object) => void)|null} toggleCreationLike
 * @property {((creation: Object) => void)|null} toggleCreationBookmark
 * @property {((tabId: string) => void)|null} onActiveTabChange
 * @property {((tag: string) => void)|null} onActiveTagChange
 * @property {((query: string) => void)|null} onQueryChange
 * @property {(() => void)|null} onToggleMobileGridMode
 * @property {(() => void)|null} onLoadMore
 * @property {import("react").ElementType} InternalLinkComponent
 * @property {import("react").ElementType} FilterPanelComponent
 * @property {import("react").ElementType|null} TagFilterComponent
 * @property {import("react").ElementType|null} CreationCardComponent
 */

export const MY_CREATIONS_HUB_PORTABILITY_RULES = Object.freeze({
  ownsRawCreationNormalization: "ViewModel",
  ownsFilterAndPaginationState: "ViewModel",
  ownsEngagementOrchestration: "ViewModel",
  ownsNextLinkBinding: "Binding Shell",
  ownsApplicationCardBinding: "Binding Shell",
  ownsResponsiveFilterBinding: "Binding Shell",
  ownsPortableMarkup: "Portable View",
});

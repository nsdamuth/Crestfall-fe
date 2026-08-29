export const MEDIA_HISTORY_GRID_VIEW_CONTRACT_VERSION = "1.3.0";

/**
 * Portable presentation contract for Image Studio's generated-media history.
 *
 * The View receives normalized media cards, selection/filter state, semantic
 * callbacks, and injected application-owned controls. It does not import
 * Crestfall media clients, delete image outputs, fetch reactions, interpret
 * legacy output identifiers, or confirm destructive actions.
 *
 * 1.3.0 (V2 convergence): adds asset/prompt search, opaque desktop filters,
 * and a working Grid/Large density toggle across responsive breakpoints.
 *
 * 1.2.0 (V2 convergence): adds an optional mobile primary workspace action
 * so Image Studio can expose its editor in-flow above fixed mobile navigation.
 *
 * 1.1.0 (V2 convergence): destructive bulk deletion now uses a portable
 * Kit confirmation surface and inline error state rather than browser-native
 * confirm/alert dialogs.
 *
 * Doc-only correction (ED1G sw12), no version bump: 22 view props
 * already read by the View were undeclared here.
 *
 * @typedef {Object} MediaHistoryGridViewProps
 * @property {Array<{value:string,label:string}>} filterOptions
 * @property {string} activeFilter
 * @property {string} searchQuery
 * @property {boolean} filtersOpen
 * @property {boolean} compactMobileGrid
 * @property {string} [mobileGridClass]
 * @property {Array<Object>} mediaItems
 * @property {Array<Object>} visibleMediaItems
 * @property {string} historyStatus
 * @property {string} historyError
 * @property {boolean} hasMoreHistory
 * @property {boolean} isLoadingMoreHistory
 * @property {string} [reactionMessage]
 * @property {string} [deleteMessage]
 * @property {boolean} selectionMode
 * @property {number} selectedCount
 * @property {boolean} isBulkDeleting
 * @property {boolean} [bulkDeleteConfirmOpen]
 * @property {string} [mobilePrimaryActionLabel] optional primary mobile workspace action label
 * @property {(() => void)|null} [onMobilePrimaryAction] opens the primary mobile workspace action
 * @property {boolean} [hasSelectableMedia]
 * @property {boolean} [hasVisibleSelectableMedia]
 * @property {boolean} [allVisibleSelectableItemsSelected]
 * @property {string} [summaryText]
 * @property {Object|null} lightboxProps
 * @property {number} [eagerImageCount]
 * @property {number} [masonryRowHeight]
 * @property {number} [masonryGap]
 * @property {((value:string) => void)|null} [onSetFilter]
 * @property {((value:string) => void)|null} [onChangeSearchQuery]
 * @property {(() => void)|null} [onClearFilters]
 * @property {(() => void)|null} [onToggleFilters]
 * @property {(() => void)|null} [onToggleMobileGrid]
 * @property {(() => void)|null} [onToggleSelectionMode]
 * @property {((item:Object) => void)|null} [onToggleMediaSelection]
 * @property {((item:Object) => void)|null} [onToggleLike]
 * @property {((item:Object) => void)|null} [onToggleBookmark]
 * @property {((item:Object) => void)|null} [onOpenMedia]
 * @property {(() => void)|null} [onToggleSelectAllVisible]
 * @property {(() => void)|null} [onClearSelection]
 * @property {(() => void)|null} [onBulkDeleteSelected]
 * @property {(() => void)|null} [onCancelBulkDelete]
 * @property {(() => void)|null} [onConfirmBulkDelete]
 * @property {(() => void)|null} [onLoadMoreHistory]
 * @property {import("react").ElementType} FilterPillComponent
 * @property {(props:Object)=>import("react").ReactNode} renderQuickActions
 * @property {(props:Object)=>import("react").ReactNode} renderLightbox
 */

export {};

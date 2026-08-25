export const CREATION_IMAGE_LIBRARY_PAGE_VIEW_CONTRACT_VERSION = "1.3.0";

/**
 * Portable presentation contract for a Creation-owned image library.
 *
 * The View receives display-ready featured slots, visible/hidden image cards,
 * filters, semantic callbacks, and injected application-owned Link, quick-action,
 * and lightbox renderers. It does not fetch the library, interpret image-output
 * aliases, mutate reactions, delete outputs, or persist featured/visibility state.
 *
 * 1.1.0 (ED1G SW7, B5 delete-confirm recipe): the grid delete controls
 * (`onDeleteImage`) now open a confirm modal owned by the ViewModel
 * instead of routing through `window.confirm`. Additive only.
 *
 * 1.3.0 (V2 convergence): adds live share, reassignment feedback, and
 * Library Pass owner controls while retaining the V2 B5 delete-confirm flow.
 *
 * Doc-only correction (ED1G sw12), no version bump: 24 view props
 * already read by the View were undeclared here (loadStatus,
 * showBackLink, and the semantic callback set below).
 *
 * @typedef {Object} CreationImageLibraryPageViewProps
 * @property {string} title
 * @property {string} backHref
 * @property {string} [shareHref]
 * @property {boolean} [isShareable]
 * @property {boolean} [showBackLink]
 * @property {"idle"|"loading"|"error"} [loadStatus]
 * @property {string} [loadMessage]
 * @property {boolean} [isLoading]
 * @property {string} [reactionMessage]
 * @property {string} [deleteMessage]
 * @property {string} [reassignmentMessage]
 * @property {Object|null} [libraryPassPanel]
 * @property {Array<Object>} featuredSlotCards
 * @property {Array<Object>} visibleImages
 * @property {Array<Object>} hiddenImages
 * @property {boolean} [hasImages]
 * @property {boolean} [noMatchingImages]
 * @property {string} [visibleSummary]
 * @property {string} [eligibilityFilter]
 * @property {Array<{value:string,label:string}>} eligibilityFilterOptions
 * @property {string} [sortMode]
 * @property {Array<{value:string,label:string}>} sortOptions
 * @property {boolean} [hasMoreVisibleImages]
 * @property {Object|null} lightboxProps
 * @property {number} [eagerImageCount]
 * @property {boolean} deleteConfirmOpen
 * @property {boolean} deleteConfirmIsFeatured
 * @property {(() => void)|null} [onRefresh]
 * @property {(() => void)|null} [onToggleLibraryPassSales]
 * @property {((value:string) => void)|null} [onSetEligibilityFilter]
 * @property {((value:string) => void)|null} [onSetSortMode]
 * @property {(() => void)|null} [onLoadMoreVisibleImages]
 * @property {((image:Object) => void)|null} [onOpenPreview]
 * @property {((image:Object) => void)|null} [onToggleLike]
 * @property {((image:Object) => void)|null} [onToggleBookmark]
 * @property {((image:Object, slotIndex:number) => void)|null} [onAssignFeaturedSlot]
 * @property {((image:Object) => void)|null} [onHideImage]
 * @property {((image:Object) => void)|null} [onShowImage]
 * @property {((image:Object) => void)|null} [onDeleteImage]
 * @property {(() => void)|null} onCancelDeleteImage
 * @property {(() => void)|null} onConfirmDeleteImage
 * @property {import("react").ElementType} BackLinkComponent
 * @property {import("react").ElementType} [ShareButtonComponent]
 * @property {(props:Object)=>import("react").ReactNode} renderQuickActions
 * @property {(props:Object)=>import("react").ReactNode} renderLightbox
 */

export {};

export const CREATION_IMAGE_LIBRARY_PAGE_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Portable presentation contract for a Creation-owned image library.
 *
 * The View receives display-ready featured slots, visible/hidden image cards,
 * filters, semantic callbacks, and injected application-owned Link, quick-action,
 * and lightbox renderers. It does not fetch the library, interpret image-output
 * aliases, mutate reactions, delete outputs, or persist featured/visibility state.
 *
 * @typedef {Object} CreationImageLibraryPageViewProps
 * @property {string} title
 * @property {string} backHref
 * @property {Array<Object>} featuredSlotCards
 * @property {Array<Object>} visibleImages
 * @property {Array<Object>} hiddenImages
 * @property {Array<{value:string,label:string}>} eligibilityFilterOptions
 * @property {Array<{value:string,label:string}>} sortOptions
 * @property {Object|null} lightboxProps
 * @property {import("react").ElementType} BackLinkComponent
 * @property {(props:Object)=>import("react").ReactNode} renderQuickActions
 * @property {(props:Object)=>import("react").ReactNode} renderLightbox
 */

export {};

export const OUTFIT_PICKER_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} OutfitPickerViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} typeLabel
 * @property {string} ratingLabel
 * @property {string} displayImageUrl
 * @property {string} imageAltText
 * @property {boolean} isSelected
 */

/**
 * Stable UI boundary for the portable Outfit/Wardrobe picker View.
 *
 * The View must not know Crestfall creation types, raw creation payloads,
 * featured-media fallback rules, clothing field names, wardrobe-entry storage,
 * or caller-specific selection normalization. It renders display-ready cards
 * and emits semantic selection intent only.
 *
 * @typedef {Object} OutfitPickerModalViewProps
 * @property {string} title
 * @property {string} eyebrow
 * @property {string} description
 * @property {string} searchPlaceholder
 * @property {string} searchQuery
 * @property {OutfitPickerViewItem[]} items
 * @property {boolean} isLoading
 * @property {string} loadingMessage
 * @property {string} errorMessage
 * @property {string} emptyMessage
 * @property {((query: string) => void)|null} onSearchQueryChange
 * @property {(() => void)|null} onClose
 * @property {((itemId: string) => void)|null} onChooseItem
 */

export {};

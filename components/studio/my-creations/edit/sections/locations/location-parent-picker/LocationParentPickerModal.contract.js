export const LOCATION_PARENT_PICKER_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} LocationParentPickerViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} displayImageUrl
 * @property {string} imageAltText
 * @property {boolean} isSelected
 * @property {string[]} badges
 * @property {string} referenceText
 */

/**
 * Stable UI boundary for the portable parent-location picker View.
 *
 * The View must not load creations, know LOCATION query rules, inspect raw
 * creation data, exclude the current creation, or construct the parent-location
 * persistence payload. It renders display-ready cards and emits selection
 * intent by item ID only.
 *
 * @typedef {Object} LocationParentPickerModalViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {string} searchPlaceholder
 * @property {string} searchQuery
 * @property {LocationParentPickerViewItem[]} items
 * @property {boolean} isLoading
 * @property {string} loadingMessage
 * @property {string} errorMessage
 * @property {string} emptyMessage
 * @property {((query: string) => void)|null} onSearchQueryChange
 * @property {(() => void)|null} onClose
 * @property {((locationId: string) => void)|null} onChooseLocation
 */

export {};

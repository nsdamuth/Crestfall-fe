export const REGISTRY_LINKED_CREATION_PICKER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} RegistryLinkedCreationPickerViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} typeLabel
 * @property {string} displayImageUrl
 * @property {string} imageAltText
 * @property {boolean} isSelected
 */

/**
 * Stable UI boundary for the portable linked-creation picker View.
 *
 * The View must not know Crestfall creation payloads, allowed creation-type
 * queries, raw creation data fields, featured-media fallback rules, registry
 * storage shapes, or how a selected creation is attached by each caller. It
 * renders display-ready cards and emits semantic user actions only.
 *
 * @typedef {Object} RegistryLinkedCreationPickerModalViewProps
 * @property {string} title
 * @property {string} body
 * @property {string} searchQuery
 * @property {RegistryLinkedCreationPickerViewItem[]} creations
 * @property {boolean} isLoading
 * @property {string} errorMessage
 * @property {((query: string) => void)|null} onSearchQueryChange
 * @property {(() => void)|null} onClose
 * @property {((creationId: string) => void)|null} onChooseCreation
 */

export {};

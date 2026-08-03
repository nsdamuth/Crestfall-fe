export const SCENARIO_REFERENCE_PICKER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} ScenarioReferencePickerViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} typeLabel
 * @property {string} ratingLabel
 * @property {string} imageUrl
 * @property {string} imageAltText
 * @property {boolean} isSelected
 */

/**
 * Stable UI boundary for the portable Scenario reference picker View.
 *
 * The View must not know Scenario form fields, registry binding storage,
 * reference option payloads, single-versus-multiple update semantics, or how a
 * selected reference is persisted by create and edit workflows. It renders
 * display-ready cards and emits semantic user actions only.
 *
 * @typedef {Object} ScenarioReferencePickerModalViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} body
 * @property {string} searchQuery
 * @property {string} searchPlaceholder
 * @property {ScenarioReferencePickerViewItem[]} items
 * @property {number} selectedCount
 * @property {boolean} showSelectedCount
 * @property {boolean} showDoneAction
 * @property {string} emptyMessage
 * @property {((query: string) => void)|null} onSearchQueryChange
 * @property {((itemId: string) => void)|null} onChooseItem
 * @property {(() => void)|null} onClose
 */

export {};

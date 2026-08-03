export const KIBBE_PRESET_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} KibbeIdentityViewOption
 * @property {string} value
 * @property {string} label
 * @property {string} description
 */

/**
 * @typedef {Object} KibbePresetViewSummary
 * @property {string} value
 * @property {string} label
 * @property {string} description
 */

/**
 * @typedef {Object} KibbeSuggestionViewRow
 * @property {string} label
 * @property {string} value
 */

/**
 * Stable UI boundary for the portable Kibbe preset View.
 *
 * The View must not know Crestfall form field names, preset mappings, persistence
 * rules, or API behavior. It renders these props and emits semantic events only.
 *
 * @typedef {Object} KibbePresetModalViewProps
 * @property {boolean} open
 * @property {string} label
 * @property {string} selectedPresetLabel
 * @property {KibbeIdentityViewOption[]} identityOptions
 * @property {string} pendingValue
 * @property {KibbePresetViewSummary|null} pendingPreset
 * @property {KibbeSuggestionViewRow[]} suggestionRows
 * @property {(() => void)|null} onOpen
 * @property {(() => void)|null} onClose
 * @property {((identity: string) => void)|null} onSelectIdentity
 * @property {(() => void)|null} onSaveIdentityOnly
 * @property {(() => void)|null} onFillEmptyFields
 * @property {(() => void)|null} onReplaceBodyTraits
 */

export {};

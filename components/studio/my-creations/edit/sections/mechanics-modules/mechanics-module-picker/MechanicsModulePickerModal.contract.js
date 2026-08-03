export const MECHANICS_MODULE_PICKER_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} MechanicsModulePickerItem
 * @property {string} id
 * @property {string} sourceLabel
 * @property {string} title
 * @property {string} description
 * @property {string} moduleId
 * @property {number} trackerCount
 * @property {number} guardCount
 * @property {number} commandCount
 * @property {string} status
 * @property {string} visibility
 * @property {string[]} tags
 * @property {string[]} searchTerms
 */

/**
 * @typedef {Object} MechanicsModulePickerSource
 * @property {string} id
 * @property {string} label
 * @property {string} emptyMessage
 * @property {MechanicsModulePickerItem[]} items
 */

/**
 * Stable UI boundary for the portable Mechanics Module picker.
 *
 * The View must not receive raw creation records, excluded binding IDs,
 * database payloads, API response shapes, or runtime attachment callbacks. It
 * renders display-ready module cards and emits a semantic module-ID choice.
 *
 * @typedef {Object} MechanicsModulePickerModalViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {MechanicsModulePickerSource[]} sources
 * @property {string} initialSourceId
 * @property {"loading"|"loaded"|"error"} loadStatus
 * @property {string} loadMessage
 * @property {string} searchPlaceholder
 * @property {(() => void)|null} onClose
 * @property {((moduleId: string) => void)|null} onChooseModule
 */

export {};

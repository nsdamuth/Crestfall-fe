export const TRAIT_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} TraitModalViewOption
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {boolean} isSelected
 * @property {boolean} isCustom
 */

/**
 * Stable UI boundary for the portable Trait Modal View.
 *
 * The View must not know Crestfall form-field names, character/template form
 * storage, preset/custom detection rules, or how a selected trait is persisted.
 * It renders display-ready options and emits semantic user actions only.
 *
 * @typedef {Object} TraitModalViewProps
 * @property {boolean} open
 * @property {string} triggerLabel
 * @property {string} triggerSummary
 * @property {string} modalTitle
 * @property {string} modalDescription
 * @property {TraitModalViewOption[]} options
 * @property {boolean} customActive
 * @property {string} customTitle
 * @property {string} customValue
 * @property {string} customPlaceholder
 * @property {(() => void)|null} onOpen
 * @property {(() => void)|null} onClose
 * @property {((optionId: string) => void)|null} onChooseOption
 * @property {((value: string) => void)|null} onChangeCustomValue
 * @property {(() => void)|null} onBackFromCustom
 * @property {(() => void)|null} onUseCustomValue
 */

export {};

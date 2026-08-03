export const MULTI_TRAIT_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} MultiTraitModalViewOption
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {boolean} isSelected
 * @property {boolean} isNone
 * @property {boolean} isCustom
 * @property {boolean} isExclusive
 */

/**
 * Stable UI boundary for the portable Multi-Trait Modal View.
 *
 * The View must not know Crestfall form-field names, array storage rules,
 * exclusive-option behavior, or how selected values are persisted. It renders
 * display-ready options and emits semantic user actions only.
 *
 * @typedef {Object} MultiTraitModalViewProps
 * @property {boolean} open
 * @property {string} triggerLabel
 * @property {string} triggerSummary
 * @property {string} modalTitle
 * @property {string} modalDescription
 * @property {MultiTraitModalViewOption[]} options
 * @property {boolean} customActive
 * @property {string} customTitle
 * @property {string} customValue
 * @property {string} customPlaceholder
 * @property {(() => void)|null} onOpen
 * @property {(() => void)|null} onClose
 * @property {((optionId: string) => void)|null} onChooseOption
 * @property {((value: string) => void)|null} onChangeCustomValue
 * @property {(() => void)|null} onBackFromCustom
 * @property {(() => void)|null} onAddCustomValue
 * @property {(() => void)|null} onDone
 */

export {};

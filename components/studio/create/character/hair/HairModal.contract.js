export const HAIR_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} HairViewOption
 * @property {string} id
 * @property {string} label
 * @property {boolean} isCustom
 * @property {Object|null} swatchStyle
 */

/**
 * @typedef {Object} HairViewSection
 * @property {string} id
 * @property {string} title
 * @property {"swatches"|"options"} layout
 * @property {HairViewOption[]} options
 * @property {string} selectedOptionId
 * @property {boolean} customActive
 * @property {string} customValue
 * @property {string} customInputTitle
 * @property {string} customPlaceholder
 * @property {string} customHelperText
 */

/**
 * Stable UI boundary for the portable Hair View.
 *
 * The View must not know Crestfall form-field names, preset/custom detection
 * rules, appearance persistence behavior, or how character create/edit forms
 * store their data. It renders display-ready sections and emits semantic user
 * actions only.
 *
 * @typedef {Object} HairModalViewProps
 * @property {boolean} open
 * @property {string} triggerLabel
 * @property {string} triggerSummary
 * @property {string} modalTitle
 * @property {HairViewSection[]} sections
 * @property {number} customValueMaxLength
 * @property {(() => void)|null} onOpen
 * @property {(() => void)|null} onClose
 * @property {((sectionId: string, optionId: string) => void)|null} onChooseOption
 * @property {((sectionId: string, value: string) => void)|null} onChangeCustomValue
 */

export {};

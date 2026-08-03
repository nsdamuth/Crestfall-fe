export const HAIR_EYES_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} HairEyesViewOption
 * @property {string} id
 * @property {string} label
 * @property {boolean} isCustom
 * @property {Object|null} swatchStyle
 */

/**
 * @typedef {Object} HairEyesViewSection
 * @property {string} id
 * @property {string} title
 * @property {"swatches"|"options"} layout
 * @property {HairEyesViewOption[]} options
 * @property {string} selectedOptionId
 * @property {boolean} customActive
 * @property {string} customValue
 * @property {string} customInputTitle
 * @property {string} customPlaceholder
 * @property {string} customHelperText
 */

/**
 * Stable UI boundary for the portable Hair & Eyes View.
 *
 * The View must not know Crestfall form-field names, custom-value detection
 * rules, appearance persistence behavior, or how character, Player Character,
 * and character-template builders store their data. It renders display-ready
 * sections and emits semantic user actions only.
 *
 * @typedef {Object} HairEyesModalViewProps
 * @property {boolean} open
 * @property {string} triggerLabel
 * @property {string} triggerSummary
 * @property {string} modalTitle
 * @property {HairEyesViewSection[]} sections
 * @property {number} customValueMaxLength
 * @property {(() => void)|null} onOpen
 * @property {(() => void)|null} onClose
 * @property {((sectionId: string, optionId: string) => void)|null} onChooseOption
 * @property {((sectionId: string, value: string) => void)|null} onChangeCustomValue
 */

export {};

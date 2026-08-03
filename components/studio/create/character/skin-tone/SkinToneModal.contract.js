export const SKIN_TONE_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} SkinToneViewOption
 * @property {string} id
 * @property {string} label
 * @property {boolean} isCustom
 * @property {Object} swatchStyle
 */

/**
 * Stable UI boundary for the portable Skin Tone View.
 *
 * The View must not know Crestfall form-field names, preset/custom detection
 * rules, appearance persistence behavior, or how character create/edit forms
 * store their data. It renders display-ready swatches and emits semantic user
 * actions only.
 *
 * @typedef {Object} SkinToneModalViewProps
 * @property {boolean} open
 * @property {string} triggerLabel
 * @property {string} triggerSummary
 * @property {string} modalTitle
 * @property {SkinToneViewOption[]} options
 * @property {string} selectedOptionId
 * @property {boolean} customActive
 * @property {string} customValue
 * @property {string} customInputTitle
 * @property {string} customPlaceholder
 * @property {string} customHelperText
 * @property {number} customValueMaxLength
 * @property {(() => void)|null} onOpen
 * @property {(() => void)|null} onClose
 * @property {((optionId: string) => void)|null} onChooseOption
 * @property {((value: string) => void)|null} onChangeCustomValue
 */

export {};

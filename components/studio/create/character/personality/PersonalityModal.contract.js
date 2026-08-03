export const PERSONALITY_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} PersonalityModalViewOption
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {boolean} isSelected
 * @property {boolean} isCustom
 */

/**
 * Stable UI boundary for the portable Personality Modal View.
 *
 * The View must not know Crestfall form-field names, character/template form
 * storage, preset/custom detection rules, or how personality values persist.
 * It renders display-ready archetypes and emits semantic user actions only.
 *
 * @typedef {Object} PersonalityModalViewProps
 * @property {boolean} open
 * @property {string} triggerLabel
 * @property {string} triggerSummary
 * @property {string} modalTitle
 * @property {string} modalDescription
 * @property {PersonalityModalViewOption[]} options
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

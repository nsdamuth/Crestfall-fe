export const CRESTFALL_OPTION_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} CrestfallOptionModalViewOption
 * @property {string} key
 * @property {string} id
 * @property {string} label
 * @property {import("react").ReactNode|null} icon
 * @property {boolean} selected
 */

/**
 * Stable UI boundary for the portable Crestfall Option Modal View.
 *
 * The View must not own source-option grouping, pinned-option ordering,
 * selection persistence, or custom-value application. It receives a
 * display-ready option list and emits semantic user intent only.
 *
 * @typedef {Object} CrestfallOptionModalViewProps
 * @property {boolean} open
 * @property {string} title
 * @property {string} triggerLabel
 * @property {string} selectedLabel
 * @property {string} searchQuery
 * @property {string} searchPlaceholder
 * @property {string[]} groups
 * @property {string|null} activeGroup
 * @property {boolean} customMode
 * @property {string} customEyebrow
 * @property {string} customValue
 * @property {string} customPlaceholder
 * @property {CrestfallOptionModalViewOption[]} options
 * @property {2|3|4|number} columns
 * @property {(() => void)|null} onOpen
 * @property {(() => void)|null} onClose
 * @property {((query: string) => void)|null} onSearchQueryChange
 * @property {((group: string) => void)|null} onChooseGroup
 * @property {((optionId: string) => void)|null} onChooseOption
 * @property {((value: string) => void)|null} onCustomValueChange
 * @property {(() => void)|null} onBackFromCustom
 * @property {(() => void)|null} onUseCustom
 */

export {};

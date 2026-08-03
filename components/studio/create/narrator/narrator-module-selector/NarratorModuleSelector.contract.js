export const NARRATOR_MODULE_SELECTOR_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} NarratorSelectorOptionViewItem
 * @property {string} id
 * @property {string|number} value
 * @property {string} title
 * @property {string} [body]
 * @property {boolean} active
 */

/**
 * @typedef {Object} NarratorResponseDirectionGroupViewItem
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {NarratorSelectorOptionViewItem[]} options
 */

/**
 * @typedef {Object} NarratorModuleViewItem
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {boolean} active
 */

/**
 * @typedef {Object} NarratorModuleGroupViewItem
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {NarratorModuleViewItem[]} modules
 */

/**
 * Stable UI boundary for the portable Narrator module-selector View.
 *
 * The View must not import narrator module presets, merge stored response
 * direction defaults, inspect creation payload fields, or know how module and
 * response-direction selections are persisted. It renders display-ready
 * groups and emits semantic selection intent only.
 *
 * @typedef {Object} NarratorModuleSelectorViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} responseEyebrow
 * @property {string} responseTitle
 * @property {string} responseDescription
 * @property {NarratorResponseDirectionGroupViewItem[]} responseDirectionGroups
 * @property {boolean} showEnsembleLimit
 * @property {string} ensembleLimitLabel
 * @property {string} ensembleLimitDescription
 * @property {NarratorSelectorOptionViewItem[]} ensembleLimitOptions
 * @property {string} safeDefaultNote
 * @property {NarratorModuleGroupViewItem[]} moduleGroups
 * @property {((groupId: string, value: string|number) => void)|null} onSelectResponseDirection
 * @property {((value: string|number) => void)|null} onSelectEnsembleCharacterLimit
 * @property {((groupId: string, moduleId: string) => void)|null} onSelectModule
 */

export {};

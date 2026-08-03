export const CHARACTER_TEMPLATE_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} CharacterTemplateModalViewTab
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} CharacterTemplateModalViewCard
 * @property {string} id
 * @property {string} sourceLabel
 * @property {string} categoryLabel
 * @property {string} title
 * @property {string} description
 * @property {string} prefillLabel
 * @property {string} prefillSummary
 * @property {string} actionLabel
 */

/**
 * Stable UI boundary for the portable Character Template Modal View.
 *
 * The View must not know Crestfall character form fields, template field
 * payloads, how a template mutates the character draft, or where template
 * collections are loaded from. It renders display-ready tabs and cards and
 * emits semantic user actions only.
 *
 * @typedef {Object} CharacterTemplateModalViewProps
 * @property {string} eyebrow
 * @property {string} modalTitle
 * @property {string} modalDescription
 * @property {CharacterTemplateModalViewTab[]} tabs
 * @property {string} activeTabId
 * @property {string} searchQuery
 * @property {string} searchPlaceholder
 * @property {boolean} showTemplateGrid
 * @property {CharacterTemplateModalViewCard[]} templates
 * @property {string} emptyStateTitle
 * @property {string} emptyStateDescription
 * @property {(() => void)|null} onClose
 * @property {((tabId: string) => void)|null} onChooseTab
 * @property {((value: string) => void)|null} onChangeSearchQuery
 * @property {((templateId: string) => void)|null} onChooseTemplate
 */

export {};

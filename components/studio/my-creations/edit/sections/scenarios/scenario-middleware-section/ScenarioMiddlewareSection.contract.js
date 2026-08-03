export const SCENARIO_MIDDLEWARE_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Scenario Middleware View.
 *
 * The View receives display-ready module cards and semantic toggle callbacks.
 * It must not inspect a Creation form, know the `middleware_modules` JSONB key,
 * merge stored module state, or invoke Crestfall persistence helpers directly.
 *
 * @typedef {Object} ScenarioMiddlewareModuleViewModel
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {"flag"|"key"|"lock"|"eye"|"compass"|"refresh"} iconKey
 * @property {boolean} isEnabled
 * @property {(() => void)|null} onToggle
 *
 * @typedef {Object} ScenarioMiddlewareSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {ScenarioMiddlewareModuleViewModel[]} modules
 */

export {};

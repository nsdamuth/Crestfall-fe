export const SCENARIO_CAST_REQUIREMENTS_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Display-ready selected Scenario reference.
 *
 * @typedef {Object} ScenarioCastRequirementsViewReference
 * @property {string} id
 * @property {string} title
 * @property {string} typeLabel
 * @property {string} imageUrl
 * @property {string} imageAltText
 * @property {string} initial
 */

/**
 * Display-ready Scenario cast/reference selector.
 *
 * @typedef {Object} ScenarioCastRequirementsViewField
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {ScenarioCastRequirementsViewReference[]} selectedItems
 * @property {(() => void)|null} onOpen
 * @property {((referenceId: string) => void)|null} onRemove
 */

/**
 * Stable UI boundary for the portable Scenario cast requirements View.
 *
 * The View must not inspect a creation form, load Crestfall creations, know
 * Scenario JSONB field names, normalize creation references, filter Player
 * Characters, construct registry binding state, or persist reference changes.
 * It renders display-ready selector fields and emits semantic open/remove
 * intent only. The application Binding Shell retains ownership of the existing
 * Scenario reference picker Shell.
 *
 * @typedef {Object} ScenarioCastRequirementsSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {ScenarioCastRequirementsViewField[]} fields
 * @property {string} referenceLoadError
 */

export {};

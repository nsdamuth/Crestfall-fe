export const SCENARIO_IDENTITY_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Scenario Identity View.
 *
 * The View must not inspect a creation form, know Scenario JSON storage fields,
 * choose application defaults, parse tag strings into arrays, or decide how
 * identity changes are persisted. It renders display-ready values and emits
 * semantic edit intent only.
 *
 * @typedef {Object} ScenarioIdentityOption
 * @property {string} value
 * @property {string} label
 *
 * @typedef {Object} ScenarioIdentitySectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} toneLabel
 * @property {string} toneValue
 * @property {ScenarioIdentityOption[]} toneOptions
 * @property {string} participantModeLabel
 * @property {string} participantModeValue
 * @property {ScenarioIdentityOption[]} participantModeOptions
 * @property {string} tagsLabel
 * @property {string} tagsValue
 * @property {string} creationTypeLabel
 * @property {string} creationTypeValue
 * @property {((value: string) => void)|null} onSelectTone
 * @property {((value: string) => void)|null} onSelectParticipantMode
 * @property {((value: string) => void)|null} onChangeTags
 */

export {};

export const SCENARIO_STORY_CIRCLE_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Scenario Story Circle View.
 *
 * The View receives display-ready Story Circle steps and emits semantic edits.
 * It must not inspect a Creation form, know the `story_circle` JSONB key, merge
 * stored state, or invoke Crestfall persistence helpers directly.
 *
 * @typedef {Object} ScenarioStoryCircleStepViewModel
 * @property {string} id
 * @property {string} label
 * @property {string} title
 * @property {string} helper
 * @property {string} value
 * @property {string} placeholder
 * @property {((value: string) => void)|null} onChange
 *
 * @typedef {Object} ScenarioStoryCircleSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {ScenarioStoryCircleStepViewModel[]} steps
 */

export {};

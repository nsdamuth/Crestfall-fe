export const STORYLINE_OPEN_WORLD_SETTINGS_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Portable LOOM boundary for Storyline open-world continuity settings.
 *
 * The View receives display-ready copy, transition options, normalized values,
 * and semantic callbacks. It does not normalize Storyline JSONB, import the
 * authoring contract, decide which transition policies are legal, merge the
 * openWorld object, or persist Creation data.
 *
 * @typedef {Object} StorylineTransitionOption
 * @property {string} value
 * @property {string} label
 *
 * @typedef {Object} StorylineOpenWorldSettingsViewProps
 * @property {string} title
 * @property {string} description
 * @property {string} defaultTransitionLabel
 * @property {string} defaultTransitionValue
 * @property {StorylineTransitionOption[]} defaultTransitionOptions
 * @property {string} defaultTransitionHelp
 * @property {string} continuityEyebrow
 * @property {string} continuityDescription
 * @property {string} guidanceLabel
 * @property {string} guidanceValue
 * @property {string} guidancePlaceholder
 * @property {string} pressureCadenceLabel
 * @property {string} pressureCadenceValue
 * @property {string} pressureCadencePlaceholder
 * @property {(value: string) => void} onChangeDefaultTransition
 * @property {(value: string) => void} onChangeGuidance
 * @property {(value: string) => void} onChangePressureCadence
 */

export {};

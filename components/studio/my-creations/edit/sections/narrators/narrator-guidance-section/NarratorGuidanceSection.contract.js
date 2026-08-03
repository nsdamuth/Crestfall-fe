export const NARRATOR_GUIDANCE_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Narrator guidance View.
 *
 * The View must not inspect a creation form, know Narrator JSON storage fields,
 * or decide how guidance changes are persisted. It renders display-ready text
 * values and emits semantic editing intent only.
 *
 * @typedef {Object} NarratorGuidanceSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} guidanceLabel
 * @property {string} guidanceValue
 * @property {string} guidancePlaceholder
 * @property {string} avoidGuidanceLabel
 * @property {string} avoidGuidanceValue
 * @property {string} avoidGuidancePlaceholder
 * @property {((value: string) => void)|null} onChangeGuidance
 * @property {((value: string) => void)|null} onChangeAvoidGuidance
 */

export {};

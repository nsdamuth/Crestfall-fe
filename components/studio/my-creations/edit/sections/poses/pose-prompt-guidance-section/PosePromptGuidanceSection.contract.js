export const POSE_PROMPT_GUIDANCE_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Pose prompt-guidance View.
 *
 * The View must not inspect a creation form, know Pose JSON storage fields,
 * or decide how guidance changes are persisted. It renders display-ready text
 * values and emits semantic editing intent only.
 *
 * @typedef {Object} PosePromptGuidanceSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} promptGuidanceLabel
 * @property {string} promptGuidanceValue
 * @property {string} promptGuidancePlaceholder
 * @property {string} usageNotesLabel
 * @property {string} usageNotesValue
 * @property {string} usageNotesPlaceholder
 * @property {string} compatibilityNotesLabel
 * @property {string} compatibilityNotesValue
 * @property {string} compatibilityNotesPlaceholder
 * @property {((value: string) => void)|null} onChangePromptGuidance
 * @property {((value: string) => void)|null} onChangeUsageNotes
 * @property {((value: string) => void)|null} onChangeCompatibilityNotes
 */

export {};

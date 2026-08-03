export const SCENARIO_RUNTIME_GUIDANCE_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Scenario Runtime Guidance View.
 *
 * The View receives normalized text values and semantic change callbacks. It
 * must not inspect a Creation form, know Scenario JSONB storage keys, or call
 * Crestfall persistence helpers directly.
 *
 * @typedef {Object} ScenarioRuntimeGuidanceSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} openingScene
 * @property {string} openingMessages
 * @property {string} privateRuntimeGuidance
 * @property {string} driftFixes
 * @property {string} failureHandling
 * @property {((value: string) => void)|null} onOpeningSceneChange
 * @property {((value: string) => void)|null} onOpeningMessagesChange
 * @property {((value: string) => void)|null} onPrivateRuntimeGuidanceChange
 * @property {((value: string) => void)|null} onDriftFixesChange
 * @property {((value: string) => void)|null} onFailureHandlingChange
 */

export {};

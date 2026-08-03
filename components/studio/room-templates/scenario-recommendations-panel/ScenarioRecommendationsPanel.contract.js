export const SCENARIO_RECOMMENDATIONS_PANEL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Scenario Recommendations Panel View.
 *
 * The View must not know scenario creation payloads, reference IDs, room
 * package state, registry attachment storage, or how applying a recommendation
 * mutates the create/edit workflow. It receives display-ready recommendation
 * labels and emits semantic user intent only.
 *
 * @typedef {Object} ScenarioRecommendationsPanelViewProps
 * @property {string[]} requiredCharacterTitles
 * @property {string[]} optionalCharacterTitles
 * @property {string} suggestedLocationTitle
 * @property {string} suggestedNarratorTitle
 * @property {string[]} suggestedNpcRegistryTitles
 * @property {boolean} canApplyRequiredCharacters
 * @property {boolean} canApplyOptionalCharacters
 * @property {boolean} canApplySuggestedLocation
 * @property {boolean} canApplySuggestedNarrator
 * @property {boolean} canApplySuggestedNpcRegistries
 * @property {(() => void)|null} onApplyAll
 * @property {(() => void)|null} onApplyRequiredCharacters
 * @property {(() => void)|null} onApplyOptionalCharacters
 * @property {(() => void)|null} onApplySuggestedLocation
 * @property {(() => void)|null} onApplySuggestedNarrator
 * @property {(() => void)|null} onApplySuggestedNpcRegistries
 * @property {(() => void)|null} onSkipRecommendations
 */

export {};

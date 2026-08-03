export const STORY_NARRATIVE_RUNTIME_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Story narrative-runtime View.
 *
 * The View must not inspect a creation form, know the
 * `story_runtime_authoring` storage field, normalize Story authoring data,
 * split or join guidance lists, choose Story Circle defaults, or persist
 * changes. It renders display-ready policy options and phase content and emits
 * semantic authoring intent only.
 *
 * @typedef {Object} StoryNarrativePolicyOption
 * @property {*} value
 * @property {string} label
 *
 * @typedef {Object} StoryNarrativePhaseViewModel
 * @property {*} id
 * @property {string} phaseEyebrow
 * @property {string} phaseTitle
 * @property {boolean} initiallyOpen
 * @property {string} objectiveValue
 * @property {string} pressuresValue
 * @property {string} consequencesValue
 * @property {string} reentryHooksValue
 * @property {string} beatSuggestionsValue
 *
 * @typedef {Object} StoryNarrativeRuntimeSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} branchingPolicyLabel
 * @property {*} branchingPolicyValue
 * @property {StoryNarrativePolicyOption[]} branchingPolicyOptions
 * @property {string} completionPolicyLabel
 * @property {*} completionPolicyValue
 * @property {StoryNarrativePolicyOption[]} completionPolicyOptions
 * @property {string} completionGuidanceLabel
 * @property {string} completionGuidanceValue
 * @property {string} completionGuidancePlaceholder
 * @property {string} phaseObjectiveLabel
 * @property {string} phaseObjectivePlaceholder
 * @property {string} pressuresLabel
 * @property {string} consequencesLabel
 * @property {string} reentryHooksLabel
 * @property {string} beatSuggestionsLabel
 * @property {string} guidanceLinesPlaceholder
 * @property {string} openLabel
 * @property {string} closeLabel
 * @property {StoryNarrativePhaseViewModel[]} phases
 * @property {((value: *) => void)|null} onChangeBranchingPolicy
 * @property {((value: *) => void)|null} onChangeCompletionPolicy
 * @property {((value: string) => void)|null} onChangeCompletionGuidance
 * @property {((phaseId: *, value: string) => void)|null} onChangePhaseObjective
 * @property {((phaseId: *, value: string) => void)|null} onChangePhasePressures
 * @property {((phaseId: *, value: string) => void)|null} onChangePhaseConsequences
 * @property {((phaseId: *, value: string) => void)|null} onChangePhaseReentryHooks
 * @property {((phaseId: *, value: string) => void)|null} onChangePhaseBeatSuggestions
 */

export {};

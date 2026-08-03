export const CHARACTER_REVIEW_STEP_VIEW_CONTRACT_VERSION =
  "crestfall.character-review-step.view.v1";

export const CHARACTER_REVIEW_VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
]);

export const CHARACTER_REVIEW_CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
]);

export const CHARACTER_REVIEW_RENDERING_STYLE_OPTIONS = Object.freeze([
  { value: "EITHER", label: "Either / Auto" },
  { value: "ANIME", label: "Anime" },
  { value: "REALISTIC", label: "Realistic" },
]);

export const CHARACTER_REVIEW_ADVANCED_FIELDS = Object.freeze([
  {
    key: "greeting",
    label: "Greeting",
    placeholder: "Optional opening message or first interaction.",
  },
  {
    key: "scenario",
    label: "Scenario",
    placeholder: "Optional opening premise, environment, or setup.",
  },
  {
    key: "relationship_to_player",
    label: "Relationship to Player",
    placeholder: "Optional starting relationship or dynamic.",
  },
  {
    key: "backstory",
    label: "Backstory",
    placeholder: "Optional history, origins, or important past events.",
  },
  {
    key: "appearance_notes",
    label: "Appearance Notes",
    placeholder: "Optional advanced physical or visual guidance.",
  },
  {
    key: "personality_notes",
    label: "Personality Notes",
    placeholder: "Optional deeper personality instructions.",
  },
  {
    key: "extra_runtime_notes",
    label: "Extra Runtime Notes",
    placeholder: "Optional extra runtime guidance or edge-case behavior.",
  },
]);

/**
 * @typedef {Object} CharacterReviewSelectField
 * @property {string} key
 * @property {string} label
 * @property {string} value
 * @property {{value: string, label: string}[]} options
 */

/**
 * @typedef {Object} CharacterReviewAdvancedField
 * @property {string} key
 * @property {string} label
 * @property {string} value
 * @property {string} placeholder
 */

/**
 * @typedef {Object} CharacterReviewSummaryItem
 * @property {string} key
 * @property {string} label
 * @property {string} value
 */

/**
 * @typedef {Object} CharacterReviewStepViewProps
 * @property {CharacterReviewSelectField[]} selectFields
 * @property {string|number} ageValue
 * @property {boolean} advancedOpen
 * @property {CharacterReviewAdvancedField[]} advancedFields
 * @property {CharacterReviewSummaryItem[]} summaryItems
 * @property {import("react").ReactNode} advancedPromptingContent
 * @property {(key: string, value: string) => void} onSelectChange
 * @property {(value: string) => void} onAgeChange
 * @property {() => void} onNormalizeAge
 * @property {() => void} onToggleAdvanced
 * @property {(key: string, value: string) => void} onAdvancedFieldChange
 */

export const characterReviewStepViewDefaults = Object.freeze({
  selectFields: [],
  ageValue: "",
  advancedOpen: false,
  advancedFields: [],
  summaryItems: [],
});

export const ACTOR_MECHANICS_PROFILE_BUILDER_VIEW_CONTRACT_VERSION = "1.0.0";
export const ACTOR_MECHANICS_PROFILE_CREATION_TYPE = "ACTOR_MECHANICS_PROFILE";

export const ACTOR_MECHANICS_PROFILE_VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
]);

export const ACTOR_MECHANICS_PROFILE_CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
]);

/**
 * @typedef {Object} ActorMechanicsProfileBuilderViewProps
 * @property {string} title
 * @property {string} description
 * @property {string} visibility
 * @property {string} contentRating
 * @property {Array<{value:string,label:string}>} visibilityOptions
 * @property {Array<{value:string,label:string}>} contentRatingOptions
 * @property {Object} editorViewProps
 * @property {boolean} saveDisabled
 * @property {string} saveStatus
 * @property {string} saveMessage
 * @property {number} errorCount
 * @property {number} warningCount
 * @property {((field:string,value:string)=>void)|null} onUpdateIdentity
 * @property {(()=>void)|null} onSave
 */

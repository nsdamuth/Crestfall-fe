/**
 * 1.1.0, package MOBILE-SHELLS, additive and prop-free: the root grid's
 * two children carry min-w-0 so the base column can shrink to the page
 * gutter, and the existing saveStatus/onSave/saveDisabled trio is
 * repeated in a bottom-docked action bar below the md breakpoint. No
 * prop was added, removed, or changed in meaning.
 */
export const ACTOR_MECHANICS_PROFILE_BUILDER_VIEW_CONTRACT_VERSION = "1.1.0";
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

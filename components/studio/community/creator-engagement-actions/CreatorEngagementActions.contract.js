export const CREATOR_ENGAGEMENT_ACTIONS_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for creator Like, Save, and Follow controls.
 *
 * The View owns action presentation, active visual states, compact sizing,
 * accessible labels, event containment, and safe semantic callback invocation.
 * It does not receive the raw creator record and does not own engagement API
 * requests, optimistic state, authentication, profile refreshes, or persistence.
 *
 * @typedef {Object} CreatorEngagementActionsViewProps
 * @property {boolean} liked
 * @property {boolean} bookmarked
 * @property {boolean} followed
 * @property {boolean} canLike
 * @property {boolean} canBookmark
 * @property {boolean} canFollow
 * @property {boolean} compact
 * @property {(() => void)|null} onToggleLike
 * @property {(() => void)|null} onToggleBookmark
 * @property {(() => void)|null} onToggleFollow
 */

export {};

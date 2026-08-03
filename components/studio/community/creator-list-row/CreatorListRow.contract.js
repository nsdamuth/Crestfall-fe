export const CREATOR_LIST_ROW_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for a creator result rendered in list mode.
 *
 * The View owns the row layout, creator badges, stats presentation, profile
 * link presentation, and composition of the portable engagement-action View.
 * It does not receive the raw creator record and does not own creator identity
 * fallbacks, profile-route construction, engagement state, API requests, or
 * persistence.
 *
 * @typedef {Object} CreatorListRowStat
 * @property {"followers"|"creations"|"canon"|"likes"} id
 * @property {string|number} value
 * @property {string} label
 *
 * @typedef {Object} CreatorListRowEngagementActions
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
 *
 * @typedef {Object} CreatorListRowViewProps
 * @property {string} creatorName
 * @property {string} creatorHandle
 * @property {string} profileHref
 * @property {string} avatarInitial
 * @property {string} summary
 * @property {boolean} featured
 * @property {boolean} canonContributor
 * @property {CreatorListRowStat[]} stats
 * @property {CreatorListRowEngagementActions} engagementActions
 */

export {};

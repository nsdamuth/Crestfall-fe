export const CREATOR_CARD_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for a creator result rendered in grid/card mode.
 *
 * The View owns the card layout, banner treatment, creator badges, stats,
 * profile-link presentation, and composition of the portable engagement-action
 * View. It does not receive the raw creator record and does not own creator
 * identity fallbacks, profile-route construction, engagement state, API
 * requests, or persistence.
 *
 * @typedef {Object} CreatorCardStat
 * @property {"followers"|"creations"|"canon"|"likes"} id
 * @property {string|number} value
 * @property {string} label
 *
 * @typedef {Object} CreatorCardEngagementActions
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
 * @typedef {Object} CreatorCardViewProps
 * @property {string} creatorName
 * @property {string} creatorHandle
 * @property {string} profileHref
 * @property {string} avatarInitial
 * @property {string} tagline
 * @property {string} description
 * @property {boolean} featured
 * @property {boolean} canonContributor
 * @property {CreatorCardStat[]} stats
 * @property {CreatorCardEngagementActions} engagementActions
 */

export {};

export const MEDIA_TILE_QUICK_ACTIONS_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for media-tile hover actions.
 *
 * The View receives only display-ready action state and semantic callbacks.
 * It does not know media IDs, reaction APIs, optimistic-update rules, routing,
 * creation ownership, image-library payloads, or persistence behavior.
 *
 * @typedef {Object} MediaTileQuickActionsViewProps
 * @property {boolean} liked
 * @property {boolean} bookmarked
 * @property {string} likeLabel
 * @property {string} bookmarkLabel
 * @property {string} expandLabel
 * @property {(() => void)|null} onLike
 * @property {(() => void)|null} onBookmark
 * @property {(() => void)|null} onExpand
 */

export {};

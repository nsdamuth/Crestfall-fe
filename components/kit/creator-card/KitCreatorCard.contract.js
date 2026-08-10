export const KIT_CREATOR_CARD_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared creator card kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.13, RULED 9 Aug 2026). Creator
 * identity, a strip of up to three recent-work thumbnails (each
 * routing to the image overlay), and Follow / View profile actions
 * as soft-cornered rectangles, never pills.
 *
 * The View receives only display-ready fields and semantic
 * callbacks. It does not know follower counts come from a live
 * account, does not call a follow API, and does not navigate.
 *
 * @typedef {Object} KitCreatorCardStats
 * @property {number|null} followers
 * @property {number|null} plays
 * @property {number|null} works
 *
 * @typedef {Object} KitCreatorCardThumbnail
 * @property {string} id
 * @property {string} imageSrc
 * @property {string} alt
 *
 * @typedef {Object} KitCreatorCardViewProps
 * @property {string} handle
 * @property {string|null} avatarSrc
 * @property {KitCreatorCardStats} stats
 * @property {KitCreatorCardThumbnail[]} thumbnails
 * @property {boolean} isFollowing
 * @property {((thumbnailId: string) => void)|null} onThumbnailOpen
 * @property {(() => void)|null} onFollow
 * @property {(() => void)|null} onViewProfile
 */

export {};

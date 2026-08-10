export const KIT_CREATION_CARD_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared creation card kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.6), grid and list layouts.
 *
 * The View receives only display-ready fields, semantic action
 * callbacks, and a layout switch. It does not receive a raw creation
 * record, resolve visibility/ownership policy, call a media or
 * reaction API, or navigate. Image actions are scoped strictly to
 * functionality that exists today: opening the lightbox (the same
 * destination for both the image click and the Expand quick action,
 * so both fire onOpen), and sharing (icon plus the word "Share",
 * never icon-only, per the ruled Share controls law).
 *
 * @typedef {Object} KitCreationCardBadge
 * @property {string} label
 * @property {"canon"|"status"|"meta"} variant
 *
 * @typedef {Object} KitCreationCardStats
 * @property {number|null} plays
 * @property {number|null} hearts
 * @property {number|null} saves
 * @property {number|null} followers
 *
 * @typedef {Object} KitCreationCardViewProps
 * @property {"grid"|"list"} layout
 * @property {string} title
 * @property {string} subtitle
 * @property {string|null} imageSrc
 * @property {KitCreationCardBadge[]} badges
 * @property {KitCreationCardStats} stats
 * @property {boolean} liked
 * @property {boolean} bookmarked
 * @property {boolean} allowDownload
 * @property {boolean} isDisabled
 * @property {(() => void)|null} onOpen
 * @property {(() => void)|null} onShare
 * @property {(() => void)|null} onLike
 * @property {(() => void)|null} onBookmark
 * @property {(() => void)|null} onDownload
 * @property {(() => void)|null} onDelete
 */

export {};

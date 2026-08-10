export const KIT_CREATION_CARD_VIEW_CONTRACT_VERSION = "2.0.0";

/**
 * Stable portable UI boundary for the shared creation card kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.6, synthesized media card
 * template, RULED 9 Aug 2026). Grid is the image-first template:
 * title, meta, and stats sit directly over the art on a bottom
 * gradient scrim. List keeps its own row composition.
 *
 * The View receives only display-ready fields, semantic action
 * callbacks, and layout/assetKind switches. It does not receive a raw
 * creation record, resolve visibility/ownership policy, call a media
 * or reaction API, or navigate.
 *
 * Two ruled click destinations: image assets open the image overlay
 * (onOpenImageOverlay); character, story, and adventure assets open
 * the asset detail popup (onOpenAssetDetail). The image click and the
 * Expand quick action both route through the same resolved
 * destination for the card's assetKind; there is no third
 * destination.
 *
 * Contract-breaking change from v1.0.0: onOpen split into
 * onOpenImageOverlay and onOpenAssetDetail, and assetKind added as a
 * required routing input. No consumer exists yet (kit batch 1 shipped
 * fixtures only), so this is a version bump with no live migration.
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
 * @property {"image"|"character"|"story"|"adventure"} assetKind
 * @property {string} title
 * @property {string} subtitle
 * @property {string|null} imageSrc
 * @property {KitCreationCardBadge[]} badges
 * @property {KitCreationCardStats} stats
 * @property {boolean} liked
 * @property {boolean} bookmarked
 * @property {boolean} allowDownload
 * @property {boolean} isDisabled
 * @property {(() => void)|null} onOpenImageOverlay
 * @property {(() => void)|null} onOpenAssetDetail
 * @property {(() => void)|null} onShare
 * @property {(() => void)|null} onLike
 * @property {(() => void)|null} onBookmark
 * @property {(() => void)|null} onDownload
 * @property {(() => void)|null} onDelete
 */

export {};

export const KIT_CREATION_CARD_VIEW_CONTRACT_VERSION = "3.0.0";

/**
 * Stable portable UI boundary for the shared creation card kit piece
 * (docs/BUILD-BLUEPRINT.md 2.6 as amended by 2.16(a), the card law,
 * RULED 9 Aug 2026). Full-bleed art in BOTH layouts: grid is the 3/4
 * image-first template with title, meta, and stats on a bottom fade;
 * list is a wide full-bleed art row with a left-anchored fade. There
 * is no bottom action bar in any layout.
 *
 * Face actions are exactly three overlay icons: like, save, expand.
 * Share, download, and delete belong to the destination the card
 * opens (Ruling 6 and the destructive law both require their words,
 * and worded controls have no home on a full-bleed face).
 *
 * Two ruled click destinations, unchanged from v2: image assets open
 * the image overlay (onOpenImageOverlay); character, story, and
 * adventure assets open the asset detail popup (onOpenAssetDetail).
 *
 * actionPlacement ships BOTH credible grid-card overlay placements
 * for Brian's pick (2.16(a)): "overlay-top" (icons top-right over
 * the art) or "scrim-row" (icons bottom-right in the scrim band
 * beside the title). List layout always trails its actions at the
 * row's right edge.
 *
 * Tag economy (2.16(c)) is enforced by the DATA a caller passes:
 * Canon always; visibility badges only in own-work contexts; never a
 * badge restating an active filter selection.
 *
 * Contract-breaking change from v2.0.0: onShare, onDownload,
 * onDelete, and allowDownload leave the card contract (they belong
 * to destination surfaces); actionPlacement added. No live consumer
 * existed (fixture pages only), so this is a version bump with the
 * fixture pages migrated in the same commit.
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
 * @property {"overlay-top"|"scrim-row"} actionPlacement
 * @property {boolean} isDisabled
 * @property {(() => void)|null} onOpenImageOverlay
 * @property {(() => void)|null} onOpenAssetDetail
 * @property {(() => void)|null} onLike
 * @property {(() => void)|null} onBookmark
 */

export {};

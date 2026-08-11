export const KIT_CREATION_CARD_VIEW_CONTRACT_VERSION = "3.2.0";

/**
 * Stable portable UI boundary for the shared creation card kit piece
 * (docs/BUILD-BLUEPRINT.md 2.6 as amended by 2.16(a), the card law,
 * RULED 9 Aug 2026). Full-bleed art in BOTH layouts: grid is the 3/4
 * image-first template with title, meta, and stats on a bottom fade;
 * list is a wide full-bleed art row with a left-anchored fade. There
 * is no bottom action bar in any layout.
 *
 * Face actions are exactly three overlay icons, never more. Slots one
 * and two are always like, save. Slot three is contextual by content
 * type as of v3.2.0 (RULED 11 Aug 2026): play (Story, Adventure),
 * generate (Image asset), expand as the universal fallback everywhere
 * else, including any card whose caller passes no handler for its
 * contextual action. Share, download, and delete belong to the
 * destination the card opens (Ruling 6 and the destructive law both
 * require their words, and worded controls have no home on a
 * full-bleed face).
 *
 * Two ruled click destinations, unchanged from v2: image assets open
 * the image overlay (onOpenImageOverlay); character, story, and
 * adventure assets open the asset detail popup (onOpenAssetDetail).
 *
 * Overlay-action placement is RULED (10 Aug 2026, kit polish 3 pass,
 * docs/BUILD-BLUEPRINT.md): icons sit top-right over the art,
 * everywhere, in every grid card. The scrim-row alternative (icons
 * bottom-right beside the title) is retired; there is no placement
 * prop. List layout always trails its actions at the row's right
 * edge.
 *
 * Tag economy (2.16(c)) is enforced by the DATA a caller passes:
 * Canon always; visibility badges only in own-work contexts; never a
 * badge restating an active filter selection.
 *
 * Contract-breaking change from v2.0.0: onShare, onDownload,
 * onDelete, and allowDownload leave the card contract (they belong
 * to destination surfaces). v3.1.0 removes actionPlacement now that
 * placement is ruled rather than a per-instance choice. No live
 * consumer existed (fixture pages only), so this is a version bump
 * with the fixture pages migrated in the same commit.
 *
 * v3.2.0, RULED 11 Aug 2026: the third face-action slot becomes
 * contextual by content type, additive only, slots one and two
 * (like, save) unchanged everywhere. Story and Adventure cards get a
 * play action, icon plus accessible label "Start Chat", invoking the
 * new optional `onPlay`. Image asset cards get a generate action,
 * icon plus accessible label "Generate", invoking the new optional
 * `onGenerate`. Every other card type, and any card whose caller
 * passes no handler for its contextual action, keeps today's expand
 * action: expand is the universal fallback, a card never renders a
 * dead third icon. Tapping the card artwork opens the card (the
 * expand destination) on every card, all types, both layouts;
 * VERIFIED already true pre-3.2.0 via the existing full-bleed
 * absolute-inset open button under the face icons, unchanged by this
 * bump. Face icon taps never trigger the artwork tap; unchanged,
 * `stopAndRun` already isolates every overlay icon click.
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
 * @property {boolean} isDisabled
 * @property {(() => void)|null} onOpenImageOverlay
 * @property {(() => void)|null} onOpenAssetDetail
 * @property {(() => void)|null} onLike
 * @property {(() => void)|null} onBookmark
 * @property {(() => void)|null} [onPlay] optional (v3.2.0), default
 *   null; the contextual third face action for `assetKind` "story" and
 *   "adventure" only. Icon plus accessible label "Start Chat". Any
 *   other assetKind, or a "story"/"adventure" card with no `onPlay`,
 *   renders the expand fallback instead.
 * @property {(() => void)|null} [onGenerate] optional (v3.2.0),
 *   default null; the contextual third face action for `assetKind`
 *   "image" only. Icon plus accessible label "Generate". An "image"
 *   card with no `onGenerate` renders the expand fallback instead.
 */

export {};

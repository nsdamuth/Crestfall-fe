export const KIT_CREATION_CARD_VIEW_CONTRACT_VERSION = "3.4.0";

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
 *
 * v3.2.1, RULED 11 Aug 2026 (Sprint H render review, item 5): the
 * no-art fallback (both layouts) swaps the generic "No image" icon
 * and caption for the shared KitArtPlaceholder camellia mark. No
 * prop change.
 *
 * v3.3.0, RULED 11 Aug 2026 (Sprint H render review, item 1):
 * additive new optional `onContinue`. When supplied it overrides
 * every kind-based contextual-action branch (onPlay, onGenerate,
 * expand fallback), rendering the third face action as "Continue"
 * (Play icon) regardless of `assetKind`. Used by the Stories page
 * Continue group, now rendered as normal cards in the same grid/list
 * collection rather than the retired compact-row treatment.
 * @property {(() => void)|null} [onContinue] optional (v3.3.0),
 *   default null; overrides onPlay/onGenerate/expand, label
 *   "Continue".
 *
 * v3.4.0, RULED 22 Aug 2026 (Fable law review, Final Ruling Render
 * close, ED1F propagation plan NEW LAW A). Two additive changes, both
 * non-breaking:
 *
 * 1. The contextual third face-action slot widens from
 *    {"story"|"adventure"} to {"character"|"story"|"adventure"}: an
 *    `assetKind: "character"` card with an `onPlay` handler now also
 *    renders the "Start Chat" action instead of falling through to
 *    expand. No prop change, a resolver-scope change only.
 * 2. A new, separate, owner-gated kebab menu control (not a fourth
 *    face icon; the three-icon face law is unchanged). Renders only
 *    when `isOwner` is true. Contents are exactly Edit, Generate
 *    Image, Share, Archive, Delete, with a fade divider before the
 *    sole danger item (Delete), on the ratified glass surface
 *    (`--panel-glass` at `--blur-panel`, 2px, NEW LAW B). Archive
 *    ships as an honest disabled stub (CR-056: no endpoint exists
 *    yet); its callback prop still exists so callers may pass one
 *    once CR-056 resolves without another contract bump.
 *
 * @property {boolean} [isOwner] optional (v3.4.0), default false;
 *   gates the kebab menu's existence. Non-owned cards render no kebab.
 * @property {(() => void)|null} [onEdit] optional (v3.4.0), default
 *   null; kebab menu item.
 * @property {(() => void)|null} [onGenerateImage] optional (v3.4.0),
 *   default null; kebab menu item, distinct from the face action's
 *   `onGenerate` (image-kind contextual slot).
 * @property {(() => void)|null} [onShare] optional (v3.4.0), default
 *   null; kebab menu item. Distinct re-introduction from the
 *   v2.0.0-removed face `onShare`; this one lives in the owner-only
 *   kebab menu, not the face.
 * @property {(() => void)|null} [onArchive] optional (v3.4.0), default
 *   null; kebab menu item, renders disabled pending CR-056 (no
 *   endpoint exists).
 * @property {(() => void)|null} [onDelete] optional (v3.4.0), default
 *   null; kebab menu item, the sole danger action, below the fade
 *   divider.
 */

export {};

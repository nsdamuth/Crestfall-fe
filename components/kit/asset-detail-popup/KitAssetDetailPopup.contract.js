export const KIT_ASSET_DETAIL_POPUP_VIEW_CONTRACT_VERSION = "2.0.0";

/**
 * Stable portable UI boundary for the asset detail popup kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.15, specced 9 Aug 2026, recomposed
 * 10 Aug 2026 kit polish 3 pass per R3/R8/R9, docs/SPRINT-A-POLISH-PLAN.md
 * section 2). The destination every "character", "story", and
 * "adventure" media card opens. Composed on the unified modal frame
 * (`KitModalFrame`, variant "modal", `panelClassName="w-full max-w-xl"`);
 * the popup renders no close control of its own, the frame owns
 * dismissal.
 *
 * v2.0.0, RULED 10 Aug 2026: `imageSrc` is REMOVED, replaced by
 * `media`; `isLiked`, `onLike`, and `onViewCatalogue` are ADDED. A
 * removal is a major bump per contract law.
 *
 * @typedef {Object} KitAssetDetailPopupBadge
 * @property {string} label
 * @property {"canon"|"status"|"meta"} variant
 *
 * @typedef {Object} KitAssetDetailPopupMediaItem
 * @property {string} id
 * @property {string} src
 *
 * @typedef {Object} KitAssetDetailPopupStats
 * @property {number|null} plays
 * @property {number|null} hearts
 * @property {number|null} saves
 * @property {number|null} followers
 *
 * @typedef {Object} KitAssetDetailPopupViewProps
 * @property {"character"|"story"|"adventure"} assetKind the popup's
 *   species key; the derived primary action label is "Play" for all
 *   three kinds (R9)
 * @property {string} title rendered in the body, not over art (R8)
 * @property {string} subtitle body, under the title
 * @property {KitAssetDetailPopupMediaItem[]} media carousel media,
 *   ported from the old preview modal's normalized shape. At most 4
 *   items render (the old modal's own cap) plus the synthetic
 *   catalogue slide. Empty or absent: the standard no-art fallback
 *   renders and NO carousel chrome and NO catalogue slide render.
 * @property {KitAssetDetailPopupBadge[]} badges rendered in the body
 *   above the title, KitBadgeView surface="canvas" (default)
 * @property {KitAssetDetailPopupStats} stats same shape and icon
 *   order as the card stat row
 * @property {string} description body copy, clamps at three lines
 *   with a See more / See less control
 * @property {boolean} isLiked like toggle state (R3)
 * @property {boolean} isSaved save toggle state
 * @property {(() => void)|null} onLike Like toggle intent (R3)
 * @property {(() => void)|null} onPrimaryAction Play intent (R9)
 * @property {(() => void)|null} onShare Share intent (Ruling 6: icon
 *   plus the word, always)
 * @property {(() => void)|null} onSave Save toggle intent
 * @property {(() => void)|null} onViewCatalogue the catalogue slide's
 *   CTA intent (R8)
 * @property {(() => void)|null} onClose forwarded to the frame; the
 *   popup renders no close control of its own
 */

export {};

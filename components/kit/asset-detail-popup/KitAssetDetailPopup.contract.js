export const KIT_ASSET_DETAIL_POPUP_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the asset detail popup kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.15, specced 9 Aug 2026, built
 * this pass per docs/SPRINT-A-PLAN.md section 3). The destination
 * every "character", "story", and "adventure" media card opens.
 * Composed on the unified modal frame (`KitModalFrame`, variant
 * "modal", `panelClassName="w-full max-w-xl"`); the popup renders no
 * close control of its own, the frame owns dismissal.
 *
 * @typedef {Object} KitAssetDetailPopupBadge
 * @property {string} label
 * @property {"canon"|"status"|"meta"} variant
 *
 * @typedef {Object} KitAssetDetailPopupStats
 * @property {number|null} plays
 * @property {number|null} hearts
 * @property {number|null} saves
 * @property {number|null} followers
 *
 * @typedef {Object} KitAssetDetailPopupViewProps
 * @property {"character"|"story"|"adventure"} assetKind drives the
 *   primary action label: Play for character and story, Continue for
 *   adventure (2.15 verbatim; whether character and story need
 *   distinct copy is 2.15's own open flag, carried in OPEN FOR BRIAN)
 * @property {string} title over-art headline
 * @property {string} subtitle the card's supporting line (kind and
 *   creator)
 * @property {string|null} imageSrc header art; null renders the
 *   standard no-art fallback
 * @property {KitAssetDetailPopupBadge[]} badges same constrained
 *   shape as the card, rendered with KitBadgeView surface="art"
 * @property {KitAssetDetailPopupStats} stats same shape and icon
 *   order as the card stat row
 * @property {string} description body copy
 * @property {boolean} isSaved save toggle state
 * @property {(() => void)|null} onPrimaryAction Play or Continue
 *   intent
 * @property {(() => void)|null} onShare Share intent (Ruling 6: icon
 *   plus the word, always)
 * @property {(() => void)|null} onSave Save toggle intent
 * @property {(() => void)|null} onClose forwarded to the frame; the
 *   popup renders no close control of its own
 */

export {};

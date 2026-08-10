export const KIT_ASSET_DETAIL_POPUP_VIEW_CONTRACT_VERSION = "2.1.0";

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
 * v2.1.0, RULED 10 Aug 2026 (R11): optional `credits` ADDED, rendered
 * between the description/stats block and the footer, matching the
 * old modal's own order (credits after description and tags, before
 * actions).
 *
 * Presentation recomposed 10 Aug 2026 (R1, kit polish 3 pass, plan
 * 1.3), contract stays 2.1.0 (contract law: presentation may change,
 * reporting may not; the `credits` prop, its shape, and every
 * callback are unchanged). Credits now render as a one-row collapsed
 * block (first credit only, plus a "View all credits (N)" control
 * when more than one exists) instead of the full `KitCreditsView`
 * list, opening the stacked `KitCreditsModal` (`components/kit/
 * credits/`, package v1.1.0) in the same space. The shell owns
 * whether that stacked modal is open (internal plumbing only, never
 * part of this package's public prop surface): it suppresses this
 * frame's own Escape and backdrop dismissal while the credits modal
 * is open, via the frame's existing `closeOnEscape`/`closeOnBackdrop`
 * props, so one Escape keypress never closes both layers.
 *
 * @typedef {Object} KitAssetDetailPopupBadge
 * @property {string} label
 * @property {"canon"|"status"|"meta"} variant
 *
 * @typedef {Object} KitAssetDetailPopupCreditItem
 * @property {string} id
 * @property {string} kindLabel
 * @property {string} creatorHandle
 * @property {string|null} creatorHref
 * @property {string|null} assetTitle
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
 * @property {KitAssetDetailPopupCreditItem[]} credits optional (R11),
 *   default []; rendered by KitCreditsView between the description/
 *   stats block and the footer
 * @property {(() => void)|null} onClose forwarded to the frame; the
 *   popup renders no close control of its own
 */

export {};

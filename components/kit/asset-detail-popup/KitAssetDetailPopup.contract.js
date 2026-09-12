export const KIT_ASSET_DETAIL_POPUP_VIEW_CONTRACT_VERSION = "2.5.0";

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
 * v2.2.0, RULED 10 Aug 2026 (docs/STUDIO-SPEC.md section 5, Studio
 * brief S5): optional `onEdit` ADDED, rendering a fifth footer action,
 * Edit, only when provided.
 *
 * v2.3.0, RULED 11 Aug 2026: reconciles two independent 2.2.0 drafts
 * that diverged from the same 2.1.0 base (design/sprint-h-final and
 * design/community-parity), merged whole, nothing dropped. From
 * design/sprint-h-final: optional `onEdit`, the fifth footer action
 * documented above. From design/community-parity (restoring the
 * parity audit's candidate 6 leftovers for /studio/v2/community):
 * optional `tags` and `creator` ADDED. `tags` renders a pill row
 * matching the old preview modal's tag treatment, between the
 * description/stats block and credits; empty by default, renders
 * nothing (the fixture model carries no tag data yet, CR-037).
 * `creator` renders the old modal's "by @handle" line under the
 * subtitle, linking to the profile when `href` is present; both
 * additive, defaulting to [] and null, pixel-stable for every
 * existing consumer (Vault, Stories) that does not pass them.
 *
 * v2.5.0, RULED 12 Sep 2026: the popup is reduced back to a quick
 * consumer decision surface. Semantic metrics move into the identity
 * header, creator attribution is rendered once, the body media library
 * is removed, View Full Catalogue becomes a button beneath the
 * description/tags, credits move to a conditional disclosure below that
 * button, and optional `moreFromCreator` + `onOpenMoreFromCreator` are
 * added for compact creator discovery. The hero carousel remains.
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
 * @property {string} src display-sized fallback URL
 * @property {string} [displaySrc] display-sized carousel URL
 * @property {string} [thumbnailSrc] thumbnail-sized compact-tile URL
 *
 * @typedef {Object} KitAssetDetailPopupMetric
 * @property {"interactionCount"|"likeCount"|"imageUseCount"|"storyUseCount"|"externalCreationUseCount"} id
 * @property {string} label
 * @property {number} value
 *
 * @typedef {Object} KitAssetDetailPopupStats
 * @property {number|null} plays legacy fallback only
 * @property {number|null} hearts legacy fallback only
 * @property {number|null} saves legacy fallback only; aggregate is never displayed
 * @property {number|null} followers legacy fallback only
 *
 * @typedef {Object} KitAssetDetailPopupCreator
 * @property {string} handle rendered with its leading "@" as given
 * @property {string|null} href profile link; a plain span renders
 *   when absent
 *
 * @typedef {Object} KitAssetDetailPopupRelatedItem
 * @property {string} id
 * @property {string} title
 * @property {string} [imageSrc]
 * @property {KitAssetDetailPopupMetric[]} [metrics]
 * @property {number} [sortOrder]
 *
 * @typedef {Object} KitAssetDetailPopupViewProps
 * @property {"character"|"story"|"adventure"} assetKind the popup's
 *   species key; the derived primary action label is "Play" for all
 *   three kinds (R9)
 * @property {string} title rendered in the body, not over art (R8)
 * @property {string} subtitle body, under the title
 * @property {KitAssetDetailPopupCreator|null} creator optional (v2.3.0),
 *   default null; renders creator attribution once in the identity line
 *   and links the handle when `href` is present
 * @property {string[]} tags optional (v2.3.0), default []; renders a
 *   pill row between the description/stats block and credits,
 *   matching the old preview modal's tag treatment
 * @property {KitAssetDetailPopupMediaItem[]} media hero-carousel media,
 *   ported from the old preview modal's normalized shape. At most 4
 *   items render plus the synthetic catalogue slide. No body media
 *   library is rendered. Empty or absent: the standard no-art fallback
 *   renders and NO carousel chrome and NO catalogue slide render.
 * @property {KitAssetDetailPopupBadge[]} badges rendered in the body
 *   above the title, KitBadgeView surface="canvas" (default)
 * @property {KitAssetDetailPopupMetric[]} [metrics] ordered semantic consumer metrics, max three
 * @property {KitAssetDetailPopupStats} stats legacy fallback while fixture callers migrate
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
 *   default []; when non-empty, adds a conditional Credits disclosure
 *   beneath View Full Catalogue; zero credits add no control
 * @property {KitAssetDetailPopupRelatedItem[]} [moreFromCreator] up to four
 *   compact Creation recommendations from the same creator
 * @property {((creationId:string) => void)|null} [onOpenMoreFromCreator]
 *   opens a related Creation in the same quick-detail flow
 * @property {(() => void)|null} onClose forwarded to the frame; the
 *   popup renders no close control of its own
 * @property {(() => void)|null} [onEdit] ADDED 10 Aug 2026 (v2.1.0 to
 *   v2.2.0, docs/STUDIO-SPEC.md section 5, Studio brief S5): optional,
 *   compatible addition (docs/FRONTEND-SOP.md section 5). Renders a
 *   fifth footer action, Edit, only when provided; omitted entirely
 *   renders the same four-action footer as before, so Community and
 *   every non-owner context is pixel-stable. The Vault v2 page passes
 *   this for isOwn items, routing straight to the advanced editor
 *   (/studio/v2/editor/[id]), the ruled single edit path.
 */

export {};

export const KIT_PROMO_BANNER_VIEW_CONTRACT_VERSION = "1.4.0";

/**
 * Stable portable UI boundary for the shared promo banner kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.3, RULED 9 Aug 2026 in full).
 * Exactly three treatments, no fourth, no per-instance veil or copy
 * anchor settings: fade direction and copy position are fixed per
 * treatment.
 *
 * The View does not know what page it sells or where its CTA
 * navigates; the caller supplies display-ready copy and reports
 * intent through onCtaClick.
 *
 * Hierarchy law (2.16(f), 9 Aug 2026): one primary CTA emphasized,
 * the description de-emphasized and measure capped, the stack spaced
 * on the ladder. v1.1.0 adds the optional showGalaxy flag
 * (compatible addition): the `top` treatment may layer the existing
 * .cf-galaxy starfield between the art and the veil; the flag is
 * ignored on the other two treatments.
 *
 * Mobile banner law (R6, 10 Aug 2026, kit polish 3 pass, 2.16(t)):
 * presentation-only, contract stays 1.1.0, no prop changes. The
 * `bottom` treatment's mobile aspect and CTA sizing change; `top` and
 * `card` are untouched.
 *
 * v1.2.0, RULED 11 Aug 2026 (Home continue banner secondary CTA):
 * optional `secondaryCtaLabel`/`onSecondaryCtaClick` ADDED, additive.
 * Renders a ghost button (`cf-btn--secondary`, border only, no fill)
 * beside the primary CTA, visually subordinate; one primary per
 * banner still holds. Omitted entirely on every existing consumer
 * that does not pass it, pixel-stable. Both CTAs resolve to
 * `cf-btn`'s default `--control-md` height (44px), the mobile law
 * floor.
 *
 * v1.4.0, RULED 30 Aug 2026 (Home semantic-banner correction):
 * optional `emptyArtworkVariant` ADDED, additive. The default remains
 * the existing neutral empty-art icon. `"crestfall-gray-wordmark"` is
 * a branded gray CRESTFALL wordmark surface intended only for Home's
 * top banner when no real Story/room art exists. No geometry, copy,
 * veil, CTA, or image behavior changes for any existing consumer.
 *
 * v1.3.0, RULED 11 Aug 2026 (banner-anchor ruling): optional
 * `imageAnchor` ADDED, additive. An object-position string applied to
 * the art layer, default `"center 10%"` (banner art pins toward the
 * top of its frame with roughly a 10% downward bias so faces and
 * subjects stay visible), supersedes the 10 Aug kit polish 3 pass's
 * fixed `object-[center_35%]` crop. A caller overrides it per image
 * only where the ruled default does not read well; see
 * docs/reviews/BANNER-AUDIT.md for the per-slot survey. Omitted
 * entirely on every existing consumer, defaults to the ruled anchor,
 * pixel-stable elsewhere.
 *
 * @typedef {Object} KitPromoBannerViewProps
 * @property {"top"|"card"|"bottom"} treatment
 * @property {"uniform"|"bottom-fade"} bottomVariant only read when treatment is "bottom"
 * @property {boolean} [showGalaxy] top treatment only
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} line
 * @property {string} ctaLabel
 * @property {string|null} imageSrc
 * @property {"default"|"crestfall-gray-wordmark"} [emptyArtworkVariant]
 * @property {string} [imageAnchor] optional (v1.3.0), default
 *   "center 10%", an object-position string for the art layer
 * @property {(() => void)|null} onCtaClick
 * @property {string} [secondaryCtaLabel] optional (v1.2.0), default
 *   "", renders a quiet ghost button beside the primary CTA when set
 * @property {(() => void)|null} [onSecondaryCtaClick] optional
 *   (v1.2.0), the secondary CTA's click intent
 */

export {};

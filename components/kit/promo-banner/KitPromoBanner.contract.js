export const KIT_PROMO_BANNER_VIEW_CONTRACT_VERSION = "1.2.0";

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
 * @typedef {Object} KitPromoBannerViewProps
 * @property {"top"|"card"|"bottom"} treatment
 * @property {"uniform"|"bottom-fade"} bottomVariant only read when treatment is "bottom"
 * @property {boolean} [showGalaxy] top treatment only
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} line
 * @property {string} ctaLabel
 * @property {string|null} imageSrc
 * @property {(() => void)|null} onCtaClick
 * @property {string} [secondaryCtaLabel] optional (v1.2.0), default
 *   "", renders a quiet ghost button beside the primary CTA when set
 * @property {(() => void)|null} [onSecondaryCtaClick] optional
 *   (v1.2.0), the secondary CTA's click intent
 */

export {};

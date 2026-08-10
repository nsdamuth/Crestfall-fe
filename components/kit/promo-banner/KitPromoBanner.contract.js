export const KIT_PROMO_BANNER_VIEW_CONTRACT_VERSION = "1.0.0";

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
 * @typedef {Object} KitPromoBannerViewProps
 * @property {"top"|"card"|"bottom"} treatment
 * @property {"uniform"|"bottom-fade"} bottomVariant only read when treatment is "bottom"
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} line
 * @property {string} ctaLabel
 * @property {string|null} imageSrc
 * @property {(() => void)|null} onCtaClick
 */

export {};

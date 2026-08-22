export const STUDIO_ACTION_CARD_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Studio action/navigation card.
 *
 * The View owns card presentation and rendering the supplied destination as a
 * Next.js Link when the card is enabled. It does not own route selection,
 * permissions, feature availability, page composition, API calls, or
 * persistence.
 *
 * @typedef {Object} StudioActionCardViewProps
 * @property {string} eyebrow
 * @property {string} title
 * @property {import("react").ReactNode|null} children
 * @property {string} href
 * @property {string} actionLabel
 * @property {boolean} disabled
 * @property {import("react").ElementType} [LinkComponent] doc-only addition
 *   (ED1G sw12): link/anchor component injected by the host, defaults to
 *   "a" in the View. Already read by the View, undeclared here. No
 *   version bump.
 */

export {};

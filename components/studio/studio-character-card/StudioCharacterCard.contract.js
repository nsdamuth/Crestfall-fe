export const STUDIO_CHARACTER_CARD_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for an official Crestfall character card.
 *
 * The View owns card presentation, image and empty-image rendering, canon
 * labeling, character copy, details-link presentation, and the disabled future
 * Start action. It does not receive the raw character record and does not own
 * asset-path construction, description fallback selection, character routing,
 * search, pagination, session creation, API requests, or persistence.
 *
 * @typedef {Object} StudioCharacterCardViewProps
 * @property {string} imageSrc Fully resolved character image URL or an empty string.
 * @property {string} imageAlt Accessible image alternative text.
 * @property {string} title Display-ready character title.
 * @property {string} eyebrow Optional display-ready character eyebrow.
 * @property {string} description Display-ready card summary.
 * @property {string} detailsHref Resolved character-details route.
 * @property {import("react").ElementType} [LinkComponent] doc-only addition
 *   (ED1G sw12): link/anchor component injected by the host, defaults to
 *   "a" in the View. Already read by the View, undeclared here. No
 *   version bump.
 */

export {};

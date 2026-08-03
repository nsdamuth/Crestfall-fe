export const CREATE_TYPE_CARD_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable creation-type navigation card.
 *
 * The View owns card presentation and rendering the supplied destination as a
 * Next.js Link when the card is enabled. It does not own creation-type
 * discovery, section grouping, route selection, permissions, feature
 * availability, builder startup, API calls, or persistence.
 *
 * An enabled card is expected to receive a valid `href`. Disabled cards render
 * the existing non-interactive Coming Soon state.
 *
 * @typedef {Object} CreateTypeCardViewProps
 * @property {string} title
 * @property {string} description
 * @property {string} href
 * @property {string} image
 * @property {string} eyebrow
 * @property {boolean} disabled
 */

export {};

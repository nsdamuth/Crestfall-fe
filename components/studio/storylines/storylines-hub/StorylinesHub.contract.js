export const STORYLINES_HUB_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable LOOM boundary for the owned Storylines hub.
 *
 * The portable View receives display-ready copy, state flags, normalized cards,
 * and an injected internal-link component. It does not receive raw creation
 * rows, inspect creation.data, call the Storyline client, construct creation
 * routes, or own loading orchestration.
 *
 * @typedef {Object} StorylinesHubCardViewItem
 * @property {string} id
 * @property {string} href
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} description
 * @property {number} nodeCount
 * @property {string} nodeCountLabel
 *
 * @typedef {Object} StorylinesHubViewProps
 * @property {string} heading
 * @property {string} description
 * @property {string} createHref
 * @property {string} createLabel
 * @property {string} loadingMessage
 * @property {string} emptyTitle
 * @property {string} emptyMessage
 * @property {StorylinesHubCardViewItem[]} cards
 * @property {boolean} showLoading
 * @property {boolean} showEmpty
 * @property {string} errorMessage
 * @property {import("react").ElementType} InternalLinkComponent
 */

export {};

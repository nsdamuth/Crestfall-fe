export const SELECTION_CARD_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable room-template selection card.
 *
 * The View owns card presentation, the supplied icon, selected and placeholder
 * text, optional supporting copy, and safe invocation of the semantic open
 * action. It does not own picker state, creation-reference loading, selection
 * persistence, recommendation behavior, API calls, or Story package updates.
 *
 * @typedef {Object} SelectionCardValue
 * @property {string} title
 * @property {string=} subtitle
 *
 * @typedef {Object} SelectionCardViewProps
 * @property {string} label
 * @property {import("react").ComponentType<{className?: string, size?: number}>|null} icon
 * @property {SelectionCardValue|null} value
 * @property {string} placeholder
 * @property {function(): void=} onOpen
 */

export {};

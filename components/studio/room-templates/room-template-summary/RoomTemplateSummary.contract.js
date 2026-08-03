export const ROOM_TEMPLATE_SUMMARY_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the Create Story package summary.
 *
 * The View owns the compact summary-card presentation. It does not receive raw
 * character, Scenario, Narrator, or Location records and does not know Story
 * package fields, picker state, builder progress, saving, APIs, or persistence.
 *
 * @typedef {Object} RoomTemplateSummaryRow
 * @property {string} id Stable presentation identifier.
 * @property {string} label Display-ready row label.
 * @property {string|number} value Display-ready row value.
 *
 * @typedef {Object} RoomTemplateSummaryViewProps
 * @property {string} eyebrow Display-ready summary heading.
 * @property {RoomTemplateSummaryRow[]} summaryRows Ordered display rows.
 */

export {};

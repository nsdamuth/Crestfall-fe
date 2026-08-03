export const CREATION_STATS_ROW_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the Creation Stats Row portable View.
 *
 * The View receives ordered, normalized stat items. It does not receive the
 * raw creation stats object or know how Crestfall stores engagement and media
 * totals.
 *
 * @typedef {"likes" | "messages" | "images" | "videos"} CreationStatViewItemId
 *
 * @typedef {Object} CreationStatViewItem
 * @property {CreationStatViewItemId} id Semantic icon and rendering key.
 * @property {number} value Positive numeric total to display.
 *
 * @typedef {Object} CreationStatsRowViewProps
 * @property {CreationStatViewItem[]} items
 * @property {boolean} compact
 */

export {};

export const STUDIO_ACCOUNT_METRICS_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} StudioAccountMetricViewItem
 * @property {string} id
 * @property {string} value
 * @property {string} label
 */

/**
 * Stable UI boundary for the portable Studio Account Metrics View.
 *
 * The View must not load account metrics, inspect API payloads, choose fallback
 * fields, or format raw metric values. It receives display-ready metric cards
 * and an optional presentation error only.
 *
 * @typedef {Object} StudioAccountMetricsViewProps
 * @property {string} className
 * @property {string} errorMessage
 * @property {StudioAccountMetricViewItem[]} metricItems
 */

export {};

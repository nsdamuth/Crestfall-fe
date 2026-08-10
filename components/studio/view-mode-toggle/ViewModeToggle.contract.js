export const VIEW_MODE_TOGGLE_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the shared portable Grid/List View Mode Toggle.
 *
 * The View owns the two-option visual control and safe selection intent only.
 * It does not own persistent view preferences, local-storage keys, collection
 * layout, filtering, routing, API calls, or application persistence.
 *
 * @typedef {Object} ViewModeToggleViewProps
 * @property {"grid"|"list"} value
 * @property {string} label accessible group name (aria-label); not
 *   rendered as visible text, RULED 9 Aug 2026 icons-only pass
 * @property {((nextValue: "grid"|"list") => void)|null} onChange
 */

export {};

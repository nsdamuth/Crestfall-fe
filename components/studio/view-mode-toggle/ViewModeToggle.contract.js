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
 * @property {string} label
 * @property {((nextValue: "grid"|"list") => void)|null} onChange
 */

export {};

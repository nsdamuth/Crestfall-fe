export const CREATION_TAG_FILTER_ROW_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the shared portable Creation Tag Filter Row.
 *
 * The View owns tag-pill presentation and safe selection intent only. It does
 * not own creation filtering, route state, API calls, persistence, community
 * visibility, or creation lifecycle behavior.
 *
 * @typedef {Object} CreationTagFilterRowViewProps
 * @property {string[]} tags
 * @property {string} activeTag
 * @property {string} label
 * @property {string} allValue
 * @property {((tagValue: string) => void)|null} onTagChange
 */

export {};

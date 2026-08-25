export const OFFICIAL_CHARACTERS_GRID_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the bounded Official Characters search and grid.
 *
 * The View owns search-control, result-summary, empty-state, pagination, and
 * official-character-card presentation. It does not receive raw official
 * character records and does not own searchable-field selection, asset-path
 * construction, character-route construction, page data loading, session
 * creation, APIs, or persistence.
 *
 * @typedef {Object} OfficialCharacterCardViewItem
 * @property {string} id Stable list key.
 * @property {string} imageSrc
 * @property {string} imageAlt
 * @property {string} title
 * @property {string} eyebrow
 * @property {string} description
 * @property {string} detailsHref
 *
 * @typedef {Object} OfficialCharactersGridViewProps
 * @property {string} query
 * @property {number} resultCount
 * @property {number} totalCount
 * @property {OfficialCharacterCardViewItem[]} cards
 * @property {string} searchEyebrow
 * @property {string} searchPlaceholder
 * @property {string} emptyTitle
 * @property {string} emptyMessage
 * @property {(nextQuery: string) => void} [onChangeQuery]
 * @property {import("react").ElementType} [LinkComponent] doc-only addition
 *   (ED1G sw12): link/anchor component injected by the host, defaults to
 *   "a" in the View. Already read by the View, undeclared here. No
 *   version bump.
 */

export {};

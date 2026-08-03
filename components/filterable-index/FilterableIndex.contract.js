export const FILTERABLE_INDEX_VIEW_CONTRACT_VERSION =
  "crestfall.filterable-index.view.v1";

/**
 * @typedef {Object} FilterableIndexFilterOption
 * @property {string} key
 * @property {string} label
 * @property {string} value
 * @property {string[]} values
 */

/**
 * @typedef {Object} FilterableIndexTag
 * @property {string} value
 * @property {boolean} isActive
 */

/**
 * @typedef {Object} FilterableIndexCard
 * @property {string} key
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} text
 * @property {string} href
 * @property {string|null|undefined} image
 * @property {string} imageAlt
 */

/**
 * @typedef {Object} FilterableIndexViewProps
 * @property {string} search
 * @property {FilterableIndexFilterOption[]} filterOptions
 * @property {FilterableIndexTag[]} tags
 * @property {boolean} allTagsActive
 * @property {FilterableIndexCard[]} cards
 * @property {string} emptyText
 * @property {(value: string) => void} onSearchChange
 * @property {() => void} onClearSearch
 * @property {(key: string, value: string) => void} onFilterChange
 * @property {() => void} onClearFilters
 * @property {() => void} onSelectAllTags
 * @property {(tag: string) => void} onToggleTag
 * @property {(card: FilterableIndexCard) => import("react").ReactNode} renderCard
 */

export const filterableIndexViewDefaults = Object.freeze({
  search: "",
  filterOptions: [],
  tags: [],
  allTagsActive: true,
  cards: [],
  emptyText: "No matching records found.",
});

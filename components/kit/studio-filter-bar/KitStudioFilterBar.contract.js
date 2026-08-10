export const KIT_STUDIO_FILTER_BAR_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared sticky filter bar kit
 * piece (docs/BUILD-BLUEPRINT.md section 2.1). One component: search,
 * filter chips, sort, and a slot for the existing ViewModeToggle
 * package, configured per page with the variables relevant to that
 * page's entities (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md section 3.1).
 *
 * The View does not know what list it filters, how selection is
 * persisted, or what a filter value maps to in a query; the caller
 * supplies display-ready groups and reports intent through the
 * semantic callbacks.
 *
 * @typedef {Object} KitStudioFilterBarOption
 * @property {string} value
 * @property {string} label
 * @property {number|null} count
 *
 * @typedef {Object} KitStudioFilterBarGroup
 * @property {string} id
 * @property {string} label
 * @property {KitStudioFilterBarOption[]} options
 *
 * @typedef {Object} KitStudioFilterBarSortOption
 * @property {string} value
 * @property {string} label
 *
 * @typedef {Object} KitStudioFilterBarViewProps
 * @property {string} searchValue
 * @property {string} searchPlaceholder
 * @property {((value: string) => void)|null} onSearchChange
 * @property {KitStudioFilterBarGroup[]} filterGroups
 * @property {Record<string, string[]>} selectedValues
 * @property {((groupId: string, value: string) => void)|null} onFilterToggle
 * @property {KitStudioFilterBarSortOption[]} sortOptions
 * @property {string} selectedSort
 * @property {((value: string) => void)|null} onSortChange
 * @property {boolean} isLoadingCounts
 * @property {import("react").ReactNode|null} viewModeSlot
 */

export {};

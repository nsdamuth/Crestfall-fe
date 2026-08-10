export const KIT_STUDIO_FILTER_BAR_VIEW_CONTRACT_VERSION = "2.0.0";

/**
 * Stable portable UI boundary for the shared sticky filter bar kit
 * piece (docs/BUILD-BLUEPRINT.md sections 2.1 and 2.16). One sticky
 * line: search, every filter group as a branded dropdown
 * (KitDropdown) with a live selection count, sort as a single-select
 * dropdown, and a slot for the view-mode toggle. Loose chip rows are
 * retired from filter surfaces (filter-line law, 9 Aug 2026). At 390
 * the search field takes its own row inside the same sticky block.
 *
 * The View does not know what list it filters, how selection is
 * persisted, or what a filter value maps to in a query; the caller
 * supplies display-ready groups and reports intent through the
 * semantic callbacks.
 *
 * Contract-breaking change from v1.0.0: filter groups render as
 * dropdowns, so options gain the KitDropdown option fields
 * (description, isDisabled) and groups gain isMultiSelect. The
 * semantic callbacks are unchanged: onFilterToggle(groupId, value),
 * onSortChange(value), onSearchChange(value) report exactly what they
 * reported in v1 (contract law: presentation changed, reporting did
 * not). No live consumer existed; the fixture pages migrate in the
 * same commit.
 *
 * @typedef {Object} KitStudioFilterBarOption
 * @property {string} value
 * @property {string} label
 * @property {number|null} count
 * @property {string} [description]
 * @property {boolean} [isDisabled]
 *
 * @typedef {Object} KitStudioFilterBarGroup
 * @property {string} id
 * @property {string} label
 * @property {KitStudioFilterBarOption[]} options
 * @property {boolean} [isMultiSelect] defaults true
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

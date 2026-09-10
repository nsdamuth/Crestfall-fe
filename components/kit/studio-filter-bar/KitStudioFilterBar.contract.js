export const KIT_STUDIO_FILTER_BAR_VIEW_CONTRACT_VERSION = "2.2.0";

/**
 * Stable portable UI boundary for the shared sticky filter bar kit
 * piece (docs/BUILD-BLUEPRINT.md sections 2.1 and 2.16). One sticky
 * line: search left; then, anchored right, optional quick tabs, one
 * Filter button opening the shared filter panel (KitFilterPanel:
 * active-count badge, search-within, chip-group sections, Clear in the header),
 * sort as a single-select dropdown whose trigger reads "Sort: <value>",
 * and a slot for the view-mode toggle. At 390 the search field takes
 * its own row inside the sticky block.
 *
 * The View does not know what list it filters, how selection is
 * persisted, or what a filter value maps to in a query; the caller
 * supplies display-ready groups and reports intent through the
 * semantic callbacks.
 *
 * 2.1.0 (6 Sep 2026, FE/FILTERS, RULED by Brian): additive only.
 * Filter groups render inside one KitFilterPanel instead of one
 * KitDropdown per group; `filterPresentation: "dropdowns"` restores
 * the 2.0.0 per-group row exactly (the ruled fallback and the
 * rollback lever). The Sort trigger literal changes from "Sort" to
 * "Sort:", copy only. onFilterToggle(groupId, value),
 * onSortChange(value), onSearchChange(value) report exactly what they
 * reported in 2.0.0 (contract law: presentation changed, reporting
 * did not). Every 2.0.0 consumer renders without a code change.
 *
 * Contract-breaking change from v1.0.0: filter groups render as
 * dropdowns, so options gain the KitDropdown option fields
 * (description, isDisabled) and groups gain isMultiSelect.
 *
 * @typedef {Object} KitStudioFilterBarOption
 * @property {string} value
 * @property {string} label
 * @property {number|null} count
 * @property {string} [description]
 * @property {string} [tooltip] forwarded to the panel chip (1.1.0
 *   KitFilterChip) or the dropdown row
 * @property {boolean} [isDisabled]
 *
 * @typedef {Object} KitStudioFilterBarGroup
 * @property {string} id
 * @property {string} label
 * @property {KitStudioFilterBarOption[]} options
 * @property {boolean} [isMultiSelect] defaults true
 * @property {string} [restingValue] (added 2.2.0, 10 Sep 2026) the
 *   group's "no filter" value, passed through to KitDropdown 1.2.0's
 *   restingValue in the dropdowns presentation only; the panel
 *   presentation ignores it. Images uses "ALL".
 *
 * @typedef {Object} KitStudioFilterBarSortOption
 * @property {string} value
 * @property {string} label
 *
 * @typedef {Object} KitStudioFilterBarQuickTab
 * @property {string} value
 * @property {string} label
 * @property {number|null} [count]
 *
 * @typedef {Object} KitStudioFilterBarViewProps
 * @property {string} searchValue
 * @property {string} searchPlaceholder
 * @property {((value: string) => void)|null} onSearchChange
 * @property {KitStudioFilterBarGroup[]} filterGroups rendered in the
 *   order given (section order is the caller's, see
 *   orderFilterGroups in app/studio/v2/catalog); an empty array hides
 *   the Filter button entirely
 * @property {Record<string, string[]>} selectedValues
 * @property {((groupId: string, value: string) => void)|null} onFilterToggle
 * @property {KitStudioFilterBarSortOption[]} sortOptions
 * @property {string} selectedSort
 * @property {((value: string) => void)|null} onSortChange
 * @property {boolean} isLoadingCounts
 * @property {import("react").ReactNode|null} viewModeSlot
 * @property {KitStudioFilterBarQuickTab[]} [quickTabs] added 2.1.0,
 *   default []. A single-select tab row between search and the
 *   Filter button, for a page with one dominant split (Images: All /
 *   Images / Videos / Liked). Absent: nothing renders
 * @property {string} [selectedQuickTab] added 2.1.0, default ""
 * @property {((value: string) => void)|null} [onQuickTabChange] added
 *   2.1.0
 * @property {(() => void)|null} [onClearFilters] added 2.1.0. Fires
 *   once from the panel's Clear. Null: the panel clears by
 *   emitting onFilterToggle once per selected value instead
 * @property {"panel"|"dropdowns"} [filterPresentation] added 2.1.0,
 *   default "panel". "dropdowns" renders the 2.0.0 per-group row
 * @property {string} [filterButtonLabel] added 2.1.0, default "Filter"
 */

export {};

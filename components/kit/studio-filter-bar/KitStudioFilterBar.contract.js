export const KIT_STUDIO_FILTER_BAR_VIEW_CONTRACT_VERSION = "2.5.0";

/**
 * Stable portable UI boundary for the shared sticky filter bar kit
 * piece (docs/BUILD-BLUEPRINT.md sections 2.1 and 2.16). One sticky
 * line: search left; then, anchored right, optional quick tabs, one
 * Filter button opening the shared filter panel (KitFilterPanel:
 * active-count badge, search-within, chip-group sections, Clear in the header),
 * sort as a single-select dropdown, and a slot for the view-mode
 * toggle. At 390 the search field takes its own row inside the sticky
 * block.
 *
 * 2.3.0 (12 Sep 2026, eight-fix package FIX 5, RULED by Brian,
 * supersedes the 6 Sep sort label): every filter and sort trigger
 * reads "Filter" with no value while its selection equals the
 * default, and reads the chosen option's label alone once the user
 * picks a non-default option; the menu still marks the default as
 * selected. Additive `defaultSort` names the default sort value
 * (absent: the first sort option). The per-group dropdowns keep the
 * group name as their accessible name. Callbacks unchanged.
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
 * rollback lever). The Sort trigger literal changed at 2.1.0, copy
 * only (that literal is superseded at 2.3.0). onFilterToggle(groupId, value),
 * onSortChange(value), onSearchChange(value) report exactly what they
 * reported in 2.0.0 (contract law: presentation changed, reporting
 * did not). Every 2.0.0 consumer renders without a code change.
 *
 * Contract-breaking change from v1.0.0: filter groups render as
 * dropdowns, so options gain the KitDropdown option fields
 * (description, isDisabled) and groups gain isMultiSelect.
 *
 * 2.3.1 (fe/chat-studio item 9, 12 Sep 2026), copy only: the sort
 * trigger reads "Sort" at rest and the chosen option's label after a
 * non-default pick; every filter trigger keeps reading "Filter". The
 * mechanism (KitDropdown labelMode "replace" with restingValue) is
 * unchanged.
 *
 * 2.4.0 (ASSET-FOLDERS plan, package AF2, 14 Sep 2026), additive:
 * an optional `controlsSlot`, rendered inside the bar's existing
 * sideways-scrolling control group, after Sort and before
 * `viewModeSlot`. Absent (the default, every existing consumer),
 * the bar renders byte-identical to 2.3.1. The slot exists so a
 * page can add its own controls (the Folders trigger, AF5 and
 * AF6) to the shared bar row instead of duplicating the row's
 * layout, sticky offset, and mobile scroller.
 *
 * 2.5.0 (ASSET-FOLDERS plan, package AF6, 14 Sep 2026), additive:
 * an optional `leadingSlot`, rendered before the Filter button.
 * With it, the bar's controls become one row, the Media row ruled
 * at AF5 follow-up 2 (items 3 and 5): the leading controls, then
 * Filter, Sort, `controlsSlot`, and `viewModeSlot`, filling the
 * search field's width with equal gaps on phones and sitting at the
 * row's right with one equal gap at 700 and up. Absent (the
 * default, every consumer but Media and Vault), the bar renders
 * byte-identical to 2.4.0. The slot exists so a page can put Select
 * and Folders before Filter while the bar still owns Filter and
 * Sort, instead of rendering Filter itself (Media's round-1
 * workaround, retired with this version). Callbacks unchanged.
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
 * @property {string} [defaultSort] added 2.3.0. The sort value that
 *   means the user has not chosen a sort; while selectedSort equals
 *   it the trigger reads "Filter". Absent: the first sort option
 * @property {((value: string) => void)|null} onSortChange
 * @property {boolean} isLoadingCounts
 * @property {import("react").ReactNode|null} viewModeSlot
 * @property {import("react").ReactNode|null} [leadingSlot] added
 *   2.5.0, default null. Rendered before the Filter button. While
 *   present the bar lays every control out on one row (leadingSlot,
 *   Filter, Sort, controlsSlot, viewModeSlot): justify-between at
 *   the row's full width on phones, right-aligned with one
 *   --space-3 gap at 700 and up. The bar applies no sizing to what
 *   it holds; a slotted control meets the touch floor on its own.
 * @property {import("react").ReactNode|null} [controlsSlot] added
 *   2.4.0, default null. Rendered after Sort and before
 *   viewModeSlot, inside the same sideways scroller (390) or the
 *   same flex-wrap row (700 and up) as Filter and Sort. The bar
 *   applies no sizing to what it holds; a caller's control still
 *   resolves to `--control-md` on a coarse pointer under the
 *   standing touch-floor law.
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

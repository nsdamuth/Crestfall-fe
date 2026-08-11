export const KIT_PICKER_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the shared picker modal kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.9, picker modal anatomy).
 * Composed on the unified modal frame (2.5): search field, optional
 * filter chip row, rich rows or a tile grid, single and multi
 * select, sticky footer with a count in words plus Confirm and
 * Cancel, a load-more slot where the source is paged.
 *
 * The View owns no data: it is fixture-fed and reports intent
 * through the semantic callbacks. Search, filtering, and paging all
 * live with the caller.
 *
 * @typedef {Object} KitPickerModalItem
 * @property {string} id
 * @property {string} title
 * @property {string} [subtitle] supporting line under the title
 * @property {string} [imageSrc] thumbnail; the no-image fallback
 *   renders when absent
 * @property {string} [badgeLabel] quiet badge, rendered per the tag
 *   economy (2.16c); omitted when the row carries none
 *
 * @typedef {Object} KitPickerModalFilterOption
 * @property {string} value
 * @property {string} label
 * @property {boolean} [isSelected]
 *
 * @typedef {Object} KitPickerModalViewProps
 * @property {string} title
 * @property {"grid"|"rows"} [layout] default "rows"
 * @property {boolean} isMultiSelect
 * @property {KitPickerModalItem[]} items
 * @property {string[]} selectedIds
 * @property {string} searchValue
 * @property {string} [searchPlaceholder]
 * @property {KitPickerModalFilterOption[]} [filters] optional filter
 *   chip row; omitted when the source picker carries none
 * @property {boolean} isLoading
 * @property {boolean} hasMore
 * @property {boolean} [isSearching] distinct loading flag for a
 *   pending search request, so the footer and grid can distinguish
 *   "searching" from "loading more"
 * @property {string} [emptyMessage]
 * @property {string} [errorMessage]
 * @property {((value: string) => void)|null} onSearchChange
 * @property {((value: string) => void)|null} [onToggleFilter]
 * @property {((id: string) => void)|null} onToggleItem fires per row
 *   activation; single-select confirms and closes immediately,
 *   multi-select toggles the row and stays open
 * @property {(() => void)|null} [onLoadMore]
 * @property {(() => void)|null} onConfirm
 * @property {(() => void)|null} onClose
 */

export {};

"use client";

// Thin pass-through ViewModel, matching kit-batch practice: the kit
// piece is fixture-fed and owns no data. Search, filtering, paging,
// and selection all belong to the caller.
export function useKitPickerModalViewModel({
  title = "",
  layout = "rows",
  isMultiSelect = false,
  items = [],
  selectedIds = [],
  searchValue = "",
  searchPlaceholder = "Search...",
  filters = [],
  isLoading = false,
  hasMore = false,
  isSearching = false,
  emptyMessage = "No results found.",
  errorMessage = "",
  onSearchChange = null,
  onToggleFilter = null,
  onToggleItem = null,
  onLoadMore = null,
  onConfirm = null,
  onClose = null,
} = {}) {
  return {
    title,
    layout,
    isMultiSelect: Boolean(isMultiSelect),
    items: Array.isArray(items) ? items : [],
    selectedIds: Array.isArray(selectedIds) ? selectedIds : [],
    searchValue,
    searchPlaceholder,
    filters: Array.isArray(filters) ? filters : [],
    isLoading: Boolean(isLoading),
    hasMore: Boolean(hasMore),
    isSearching: Boolean(isSearching),
    emptyMessage,
    errorMessage,
    onSearchChange,
    onToggleFilter,
    onToggleItem,
    onLoadMore,
    onConfirm,
    onClose,
  };
}

"use client";

// Thin pass-through ViewModel: fixture-fed, owns no data. Search and
// filtering are the caller's responsibility (studio-filter-bar
// convention); this hook only normalizes display-ready props.
export function useKitIngredientPickerViewModel({
  slotLabel = "Asset",
  description = "",
  searchValue = "",
  searchPlaceholder = "Search assets...",
  onSearchChange = null,
  filter = null,
  items = [],
  itemLayout = "cards",
  emptyMessage = "No assets found.",
  loadErrorMessage = "",
  onChooseIngredient = null,
  showUseCustomAction = true,
  customIsSelected = false,
  onUseCustom = null,
  backLabel = null,
  onClose = null,
} = {}) {
  return {
    slotLabel: slotLabel || "Asset",
    description: description || "",
    searchValue: searchValue || "",
    searchPlaceholder: searchPlaceholder || "Search assets...",
    onSearchChange,
    filter: filter && Array.isArray(filter.options) ? filter : null,
    items: Array.isArray(items) ? items : [],
    itemLayout: itemLayout === "rows" ? "rows" : "cards",
    emptyMessage: emptyMessage || "No assets found.",
    loadErrorMessage: loadErrorMessage || "",
    onChooseIngredient,
    showUseCustomAction: Boolean(showUseCustomAction),
    customIsSelected: Boolean(customIsSelected),
    onUseCustom,
    backLabel: backLabel || null,
    onClose,
  };
}

"use client";

// Thin pass-through ViewModel: fixture-fed, owns no data. Search
// filtering is the caller's responsibility (studio-filter-bar
// convention); this hook only normalizes display-ready props.
export function useKitIngredientPickerViewModel({
  slotLabel = "Ingredient",
  searchValue = "",
  searchPlaceholder = "Search ingredients...",
  onSearchChange = null,
  items = [],
  emptyMessage = "No ingredient assets found.",
  loadErrorMessage = "",
  onChooseIngredient = null,
  showUseCustomAction = true,
  onUseCustom = null,
  showCreatePresetAction = false,
  onCreatePreset = null,
  onClose = null,
} = {}) {
  return {
    slotLabel: slotLabel || "Ingredient",
    searchValue: searchValue || "",
    searchPlaceholder: searchPlaceholder || "Search ingredients...",
    onSearchChange,
    items: Array.isArray(items) ? items : [],
    emptyMessage: emptyMessage || "No ingredient assets found.",
    loadErrorMessage: loadErrorMessage || "",
    onChooseIngredient,
    showUseCustomAction: Boolean(showUseCustomAction),
    onUseCustom,
    showCreatePresetAction: Boolean(showCreatePresetAction),
    onCreatePreset,
    onClose,
  };
}

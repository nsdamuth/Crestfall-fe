"use client";

// Thin pass-through ViewModel, matching kit-batch practice: the kit
// piece is fixture-fed and owns no data. Selection state belongs to
// the consuming page (or, later, a PostGraphile-backed ViewModel);
// this hook only normalizes the display-ready props.
export function useKitDropdownViewModel({
  label = "",
  options = [],
  selectedValues = [],
  isMultiSelect = false,
  isDisabled = false,
  onToggleOption = null,
} = {}) {
  return {
    label,
    options: Array.isArray(options) ? options : [],
    selectedValues: Array.isArray(selectedValues) ? selectedValues : [],
    isMultiSelect: Boolean(isMultiSelect),
    isDisabled: Boolean(isDisabled),
    onToggleOption,
  };
}

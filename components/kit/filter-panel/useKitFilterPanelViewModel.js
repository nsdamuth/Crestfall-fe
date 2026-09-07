function toCallback(value) {
  return typeof value === "function" ? value : null;
}

function toSections(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((section) => section && typeof section.id === "string")
    .map((section) => ({
      id: section.id,
      label: typeof section.label === "string" ? section.label : "",
      isMultiSelect: section.isMultiSelect !== false,
      options: Array.isArray(section.options)
        ? section.options
            .filter((option) => option && typeof option.value === "string")
            .map((option) => ({
              value: option.value,
              label: typeof option.label === "string" ? option.label : option.value,
              count:
                typeof option.count === "number" && Number.isFinite(option.count)
                  ? option.count
                  : null,
              tooltip: typeof option.tooltip === "string" ? option.tooltip : undefined,
              isDisabled: Boolean(option.isDisabled),
            }))
        : [],
    }));
}

export function useKitFilterPanelViewModel(props) {
  return {
    sections: toSections(props?.sections),
    selectedValues:
      props?.selectedValues && typeof props.selectedValues === "object"
        ? props.selectedValues
        : {},
    onToggleOption: toCallback(props?.onToggleOption),
    onClearAll: toCallback(props?.onClearAll),
    isLoadingCounts: Boolean(props?.isLoadingCounts),
    triggerLabel: typeof props?.triggerLabel === "string" ? props.triggerLabel : "Filter",
    searchPlaceholder:
      typeof props?.searchPlaceholder === "string" ? props.searchPlaceholder : "Search filters",
    ariaLabel: typeof props?.ariaLabel === "string" ? props.ariaLabel : "Filters",
    isDisabled: Boolean(props?.isDisabled),
  };
}

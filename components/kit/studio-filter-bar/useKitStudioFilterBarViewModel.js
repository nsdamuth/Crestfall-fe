function toCallback(value) {
  return typeof value === "function" ? value : null;
}

function toGroups(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((group) => group && typeof group.id === "string")
    .map((group) => ({
      id: group.id,
      label: typeof group.label === "string" ? group.label : "",
      isMultiSelect: group.isMultiSelect !== false,
      options: Array.isArray(group.options)
        ? group.options
            .filter((option) => option && typeof option.value === "string")
            .map((option) => ({
              value: option.value,
              label: typeof option.label === "string" ? option.label : option.value,
              count:
                typeof option.count === "number" && Number.isFinite(option.count)
                  ? option.count
                  : null,
              description:
                typeof option.description === "string" ? option.description : undefined,
              isDisabled: Boolean(option.isDisabled),
            }))
        : [],
    }));
}

function toSortOptions(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((option) => option && typeof option.value === "string")
    .map((option) => ({
      value: option.value,
      label: typeof option.label === "string" ? option.label : option.value,
    }));
}

export function useKitStudioFilterBarViewModel(props) {
  return {
    searchValue: typeof props?.searchValue === "string" ? props.searchValue : "",
    searchPlaceholder:
      typeof props?.searchPlaceholder === "string" ? props.searchPlaceholder : "Search",
    onSearchChange: toCallback(props?.onSearchChange),
    filterGroups: toGroups(props?.filterGroups),
    selectedValues:
      props?.selectedValues && typeof props.selectedValues === "object"
        ? props.selectedValues
        : {},
    onFilterToggle: toCallback(props?.onFilterToggle),
    sortOptions: toSortOptions(props?.sortOptions),
    selectedSort: typeof props?.selectedSort === "string" ? props.selectedSort : "",
    onSortChange: toCallback(props?.onSortChange),
    isLoadingCounts: Boolean(props?.isLoadingCounts),
    viewModeSlot: props?.viewModeSlot ?? null,
  };
}

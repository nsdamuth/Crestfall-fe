function toCallback(value) {
  return typeof value === "function" ? value : null;
}

export function useKitRailViewModel(props) {
  return {
    label: typeof props?.label === "string" ? props.label : "",
    viewAllLabel: typeof props?.viewAllLabel === "string" ? props.viewAllLabel : "View all",
    onViewAll: toCallback(props?.onViewAll),
    headControlSlot: props?.headControlSlot ?? null,
    children: props?.children ?? null,
  };
}

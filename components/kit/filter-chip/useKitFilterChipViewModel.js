const VALID_VARIANTS = new Set(["default", "sort", "toggle", "dropdown"]);

export function useKitFilterChipViewModel(props) {
  const label = typeof props?.label === "string" ? props.label : "";
  const count =
    typeof props?.count === "number" && Number.isFinite(props.count)
      ? props.count
      : null;
  const isSelected = Boolean(props?.isSelected);
  const isDisabled = Boolean(props?.isDisabled);
  const variant = VALID_VARIANTS.has(props?.variant) ? props.variant : "default";
  const onToggle = typeof props?.onToggle === "function" ? props.onToggle : null;

  return { label, count, isSelected, isDisabled, variant, onToggle };
}

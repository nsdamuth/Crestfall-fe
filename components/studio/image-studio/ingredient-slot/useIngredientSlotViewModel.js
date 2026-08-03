export function getIngredientSlotViewProps({
  slot = {},
  value = null,
  onOpen,
  onClear,
} = {}) {
  const label = String(slot?.label || "Ingredient");
  const isCustom = Boolean(value?.custom);
  const hasValue = Boolean(value);

  return {
    label,
    SlotIcon: slot?.icon || null,
    isCustom,
    hasValue,
    requirementLabel: isCustom
      ? "custom"
      : slot?.required
        ? "required"
        : "optional",
    title: String(value?.title || "Select…"),
    subtitle: value?.subtitle ? String(value.subtitle) : "",
    clearLabel: `Clear ${label}`,
    onOpenSlot: () => onOpen?.(),
    onClearSlot: () => onClear?.(),
  };
}

export function useIngredientSlotViewModel(props = {}) {
  return getIngredientSlotViewProps(props);
}

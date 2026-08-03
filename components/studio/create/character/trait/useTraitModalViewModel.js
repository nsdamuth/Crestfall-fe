"use client";

import { useState } from "react";

function normalizeOption(option) {
  return {
    id: String(option?.value || ""),
    label: String(option?.label || option?.value || "Unnamed trait"),
    description: String(option?.description || ""),
    isCustom: option?.value === "CUSTOM",
  };
}

export function useTraitModalViewModel({
  label = "Trait",
  field = "",
  form = {},
  updateField = null,
  options = [],
  description = "",
} = {}) {
  const [open, setOpen] = useState(false);
  const [customActive, setCustomActive] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const currentValue = field ? form?.[field] : "";
  const normalizedOptions = options.map(normalizeOption);
  const selectedOption = normalizedOptions.find(
    (option) => option.id === currentValue
  );

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setCustomActive(false);
  }

  function chooseOption(optionId) {
    const option = normalizedOptions.find((item) => item.id === optionId);

    if (!option) return;

    if (option.isCustom) {
      setCustomActive(true);
      return;
    }

    updateField?.(field, option.id);
    setOpen(false);
  }

  function backFromCustom() {
    setCustomActive(false);
  }

  function useCustomValue() {
    const nextValue = customValue.trim();

    if (!nextValue) return;

    updateField?.(field, nextValue);
    setCustomValue("");
    setCustomActive(false);
    setOpen(false);
  }

  return {
    open,
    triggerLabel: label,
    triggerSummary:
      selectedOption?.label || (currentValue ? String(currentValue) : "Not chosen"),
    modalTitle: label,
    modalDescription: description,
    options: normalizedOptions.map((option) => ({
      ...option,
      isSelected: option.id === currentValue,
    })),
    customActive,
    customTitle: `Custom ${label}`,
    customValue,
    customPlaceholder: `Type a custom ${String(label).toLowerCase()}...`,
    onOpen: openModal,
    onClose: closeModal,
    onChooseOption: chooseOption,
    onChangeCustomValue: setCustomValue,
    onBackFromCustom: backFromCustom,
    onUseCustomValue: useCustomValue,
  };
}

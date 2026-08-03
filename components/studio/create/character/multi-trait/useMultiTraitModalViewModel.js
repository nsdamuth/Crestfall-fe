"use client";

import { useState } from "react";

const NONE_OPTION_ID = "__NONE__";

function normalizeSelected(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function normalizeOption(option) {
  const value = String(option?.value || "");

  return {
    id: value || NONE_OPTION_ID,
    value,
    label: String(option?.label || value || "Not chosen"),
    description: String(option?.description || ""),
    isNone: !value,
    isCustom: value === "CUSTOM",
    isExclusive: Boolean(option?.exclusive),
  };
}

function getSelectedLabels(options, selectedValues) {
  return selectedValues
    .map((value) => options.find((option) => option.value === value)?.label)
    .filter(Boolean);
}

export function useMultiTraitModalViewModel({
  label = "Traits",
  field = "",
  form = {},
  updateField = null,
  options = [],
  description = "",
} = {}) {
  const [open, setOpen] = useState(false);
  const [customActive, setCustomActive] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const selectedValues = normalizeSelected(field ? form?.[field] : []);
  const normalizedOptions = options.map(normalizeOption);
  const selectedLabels = getSelectedLabels(normalizedOptions, selectedValues);

  function setSelected(nextValues) {
    updateField?.(field, nextValues);
  }

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

    if (option.isNone) {
      setSelected([]);
      return;
    }

    if (option.isCustom) {
      setCustomActive(true);
      return;
    }

    if (option.isExclusive) {
      setSelected([option.value]);
      return;
    }

    const withoutExclusive = selectedValues.filter((value) => {
      const selectedOption = normalizedOptions.find(
        (item) => item.value === value
      );

      return !selectedOption?.isExclusive;
    });

    if (withoutExclusive.includes(option.value)) {
      setSelected(
        withoutExclusive.filter((value) => value !== option.value)
      );
      return;
    }

    setSelected([...withoutExclusive, option.value]);
  }

  function backFromCustom() {
    setCustomActive(false);
  }

  function addCustomValue() {
    const nextValue = customValue.trim();

    if (!nextValue) return;

    setSelected([...selectedValues, nextValue]);
    setCustomValue("");
    setCustomActive(false);
  }

  function finishSelection() {
    setOpen(false);
  }

  return {
    open,
    triggerLabel: label,
    triggerSummary: selectedLabels.length
      ? selectedLabels.join(" + ")
      : "Not chosen",
    modalTitle: label,
    modalDescription: description,
    options: normalizedOptions.map((option) => ({
      id: option.id,
      label: option.label,
      description: option.description,
      isSelected: option.isNone
        ? selectedValues.length === 0
        : selectedValues.includes(option.value),
      isNone: option.isNone,
      isCustom: option.isCustom,
      isExclusive: option.isExclusive,
    })),
    customActive,
    customTitle: `Custom ${label}`,
    customValue,
    customPlaceholder: `Type custom ${String(label).toLowerCase()}...`,
    onOpen: openModal,
    onClose: closeModal,
    onChooseOption: chooseOption,
    onChangeCustomValue: setCustomValue,
    onBackFromCustom: backFromCustom,
    onAddCustomValue: addCustomValue,
    onDone: finishSelection,
  };
}

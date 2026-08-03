"use client";

import { useState } from "react";

import {
  CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH,
} from "@/components/studio/create/character/constants/constants";

const eyeColorOptions = [
  { value: "", label: "Not chosen", color: "transparent" },
  { value: "BLACK", label: "Black", color: "#111111" },
  { value: "BROWN", label: "Brown", color: "#6b3a1e" },
  { value: "BLUE", label: "Blue", color: "#3b82f6" },
  { value: "GREEN", label: "Green", color: "#22c55e" },
  { value: "GOLD", label: "Gold", color: "#facc15" },
  { value: "AMBER", label: "Amber", color: "#f59e0b" },
  { value: "GRAY", label: "Gray", color: "#9ca3af" },
  { value: "SILVER", label: "Silver", color: "#d1d5db" },
  { value: "WHITE", label: "White", color: "#f8fafc" },
  { value: "RED", label: "Red", color: "#ef4444" },
  { value: "ORANGE", label: "Orange", color: "#f97316" },
  { value: "PINK", label: "Pink", color: "#ec4899" },
  { value: "VIOLET", label: "Violet", color: "#8b5cf6" },
  {
    value: "GLOWING",
    label: "Glowing",
    color: "linear-gradient(135deg, #ffffff, #60a5fa, #a78bfa)",
  },
  {
    value: "HETEROCHROMIA",
    label: "Heterochromia",
    color:
      "linear-gradient(135deg, #3b82f6 0%, #3b82f6 50%, #facc15 50%, #facc15 100%)",
  },
  {
    value: "CUSTOM",
    label: "Custom",
    color: "linear-gradient(135deg, #ec4899, #8b5cf6, #22c55e)",
  },
];

function toSwatchStyle(color) {
  return color?.includes("gradient")
    ? { backgroundImage: color }
    : { backgroundColor: color };
}

function isPresetValue(options, value) {
  return options.some(
    (option) => option.value && option.value !== "CUSTOM" && option.value === value
  );
}

function isCustomValue(options, value) {
  return Boolean(value) && (value === "CUSTOM" || !isPresetValue(options, value));
}

function getDisplayLabel(options, value) {
  const selected = options.find(
    (option) => option.value !== "CUSTOM" && option.value === value
  );

  if (selected) return selected.label;
  if (value === "CUSTOM") return "Custom";
  return String(value || "").trim() || "Not chosen";
}

function getCustomInputValue(options, value) {
  if (!value || value === "CUSTOM" || isPresetValue(options, value)) return "";
  return String(value);
}

function toViewOption(option) {
  return {
    id: option.value,
    label: option.label,
    isCustom: option.value === "CUSTOM",
    swatchStyle: toSwatchStyle(option.color),
  };
}

export function useEyeColorModalViewModel({ form = {}, updateField = null } = {}) {
  const [open, setOpen] = useState(false);
  const [customActive, setCustomActive] = useState(false);

  const currentValue = form?.eye_color || "";

  function openModal() {
    setCustomActive(isCustomValue(eyeColorOptions, currentValue));
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function chooseOption(optionId) {
    if (optionId === "CUSTOM") {
      if (!isCustomValue(eyeColorOptions, currentValue)) {
        updateField?.("eye_color", "");
      }

      setCustomActive(true);
      return;
    }

    setCustomActive(false);
    updateField?.("eye_color", optionId || "");
    setOpen(false);
  }

  function changeCustomValue(nextValue) {
    const normalizedValue = String(nextValue || "").slice(
      0,
      CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH
    );

    setCustomActive(true);
    updateField?.("eye_color", normalizedValue);
  }

  return {
    open,
    triggerLabel: "Eye Color",
    triggerSummary: getDisplayLabel(eyeColorOptions, currentValue),
    modalTitle: "Select Eye Color",
    options: eyeColorOptions.map(toViewOption),
    selectedOptionId: customActive ? "CUSTOM" : currentValue,
    customActive,
    customValue: getCustomInputValue(eyeColorOptions, currentValue),
    customInputTitle: "Custom Eye Color",
    customPlaceholder: "e.g. iridescent teal with gold flecks",
    customHelperText: "This text is saved directly as the character's eye color.",
    customValueMaxLength: CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH,
    onOpen: openModal,
    onClose: closeModal,
    onChooseOption: chooseOption,
    onChangeCustomValue: changeCustomValue,
  };
}

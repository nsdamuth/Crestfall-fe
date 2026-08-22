"use client";

import { useState } from "react";

import {
  CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH,
} from "@/components/studio/create/character/constants/constants";

const skinToneOptions = [
  { value: "", label: "Not chosen", color: "transparent" },
  { value: "PORCELAIN", label: "Porcelain", color: "#f8e2c2" },
  { value: "FAIR", label: "Fair", color: "#f1cfa7" },
  { value: "LIGHT", label: "Light", color: "#d8a36f" },
  { value: "WARM_TAN", label: "Warm Tan", color: "#a66a3d" },
  { value: "BROWN", label: "Brown", color: "#7a421f" },
  { value: "DEEP_BROWN", label: "Deep Brown", color: "#3f2415" },
  { value: "PINK_TONE", label: "Pink Tone", color: "#f4a7c7" },
  { value: "ORANGE_TONE", label: "Orange Tone", color: "#d87332" },
  { value: "LAVENDER_TONE", label: "Lavender Tone", color: "#8b6bd6" },
  { value: "RED_TONE", label: "Red Tone", color: "#b11818" },
  { value: "BLUE_TONE", label: "Blue Tone", color: "#0a7eac" },
  { value: "GREEN_TONE", label: "Green Tone", color: "#149b51" },
  { value: "GRAY_TONE", label: "Gray Tone", color: "#808080" },
  { value: "DARK_GRAY_TONE", label: "Dark Gray Tone", color: "#3f3f46" },
  { value: "PITCH_BLACK_TONE", label: "Pitch Black Tone", color: "#020202" },
  { value: "WHITE_TONE", label: "White Tone", color: "#ffffff" },
  {
    value: "CUSTOM",
    label: "Custom",
    color: "var(--surface-1)",
  },
];

// ED1E section 8: no gradient swatches, ever. Every option renders as
// a flat radius-md tile; the CUSTOM entry is the neutral surface-1
// tile the law names explicitly, not a mixed-color preview (the
// banned purple-to-cyan #8b6bd6-to-#0a7eac gradient this used to
// carry).
function toSwatchStyle(color) {
  return { backgroundColor: color };
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

export function useSkinToneModalViewModel({ form = {}, updateField = null } = {}) {
  const [open, setOpen] = useState(false);
  const [customActive, setCustomActive] = useState(false);

  const currentValue = form?.skin_tone || "";

  function openModal() {
    setCustomActive(isCustomValue(skinToneOptions, currentValue));
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function chooseOption(optionId) {
    if (optionId === "CUSTOM") {
      if (!isCustomValue(skinToneOptions, currentValue)) {
        updateField?.("skin_tone", "");
      }

      setCustomActive(true);
      return;
    }

    setCustomActive(false);
    updateField?.("skin_tone", optionId || "");
    setOpen(false);
  }

  function changeCustomValue(nextValue) {
    const normalizedValue = String(nextValue || "").slice(
      0,
      CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH
    );

    setCustomActive(true);
    updateField?.("skin_tone", normalizedValue);
  }

  return {
    open,
    triggerLabel: "Skin Tone",
    triggerSummary: getDisplayLabel(skinToneOptions, currentValue),
    modalTitle: "Select Skin Tone",
    options: skinToneOptions.map(toViewOption),
    selectedOptionId: customActive ? "CUSTOM" : currentValue,
    customActive,
    customValue: getCustomInputValue(skinToneOptions, currentValue),
    customInputTitle: "Custom Skin Tone",
    customPlaceholder: "e.g. pale blue with silver undertones",
    customHelperText: "This text is saved directly as the character's skin tone.",
    customValueMaxLength: CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH,
    onOpen: openModal,
    onClose: closeModal,
    onChooseOption: chooseOption,
    onChangeCustomValue: changeCustomValue,
  };
}

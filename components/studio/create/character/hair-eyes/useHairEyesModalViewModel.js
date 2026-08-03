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

const hairColorOptions = [
  { value: "", label: "Not chosen", color: "transparent" },
  { value: "BLACK", label: "Black", color: "#111111" },
  { value: "BROWN", label: "Brown", color: "#6b3a1e" },
  { value: "BLONDE", label: "Blonde", color: "#facc15" },
  { value: "RED", label: "Red", color: "#dc2626" },
  { value: "ORANGE", label: "Orange", color: "#f97316" },
  { value: "WHITE", label: "White", color: "#f5f5f5" },
  { value: "SILVER", label: "Silver", color: "#d1d5db" },
  { value: "GRAY", label: "Gray", color: "#9ca3af" },
  { value: "PINK", label: "Pink", color: "#ec4899" },
  { value: "BLUE", label: "Blue", color: "#3b82f6" },
  { value: "GREEN", label: "Green", color: "#22c55e" },
  { value: "PURPLE", label: "Purple", color: "#8b5cf6" },
  {
    value: "CUSTOM",
    label: "Custom",
    color: "linear-gradient(135deg, #111111, #dc2626, #f5f5f5)",
  },
];

const hairStyleOptions = [
  { value: "", label: "Not chosen" },
  { value: "LONG", label: "Long" },
  { value: "VERY_LONG", label: "Very Long" },
  { value: "SHORT", label: "Short" },
  { value: "STRAIGHT", label: "Straight" },
  { value: "WAVY", label: "Wavy" },
  { value: "CURLY", label: "Curly" },
  { value: "MESSY", label: "Messy" },
  { value: "WILD", label: "Wild" },
  { value: "FLOATING", label: "Floating" },
  { value: "BRAIDED", label: "Braided" },
  { value: "PONYTAIL", label: "Ponytail" },
  { value: "TWIN_TAILS", label: "Twin Tails" },
  { value: "BUN", label: "Bun" },
  { value: "BOB", label: "Bob" },
  { value: "BANGS", label: "Bangs" },
  { value: "PIXIE", label: "Pixie" },
  { value: "BALD", label: "Bald" },
  { value: "CUSTOM", label: "Custom" },
];

const sectionConfigs = [
  {
    id: "eyeColor",
    formField: "eye_color",
    title: "Eye Color",
    layout: "swatches",
    options: eyeColorOptions,
    customInputTitle: "Custom Eye Color",
    customPlaceholder: "e.g. iridescent teal with gold flecks",
  },
  {
    id: "hairColor",
    formField: "hair_color",
    title: "Hair Color",
    layout: "swatches",
    options: hairColorOptions,
    customInputTitle: "Custom Hair Color",
    customPlaceholder: "e.g. black fading into crimson tips",
  },
  {
    id: "hairStyle",
    formField: "hair_style",
    title: "Hair Style",
    layout: "options",
    options: hairStyleOptions,
    customInputTitle: "Custom Hair Style",
    customPlaceholder:
      "e.g. asymmetrical braid with loose face-framing strands",
  },
];

const sectionConfigById = Object.fromEntries(
  sectionConfigs.map((section) => [section.id, section])
);

const summarySectionIdByField = {
  eye_color: "eyeColor",
  hair_color: "hairColor",
  hair_style: "hairStyle",
};

function isPresetValue(options, value) {
  return options.some(
    (option) =>
      option.value && option.value !== "CUSTOM" && option.value === value
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

function toSwatchStyle(color) {
  if (!color) return {};

  return color.includes("gradient")
    ? { backgroundImage: color }
    : { backgroundColor: color };
}

function toViewOption(option, layout) {
  return {
    id: option?.value || "",
    label: option?.label || "Not chosen",
    isCustom: option?.value === "CUSTOM",
    swatchStyle: layout === "swatches" ? toSwatchStyle(option?.color) : null,
  };
}

export function useHairEyesModalViewModel({
  label = "Hair & Eyes",
  summaryField = "all",
  form = {},
  updateField = null,
} = {}) {
  const [open, setOpen] = useState(false);
  const [customSections, setCustomSections] = useState({});

  function openModal() {
    setCustomSections(
      Object.fromEntries(
        sectionConfigs.map((section) => [
          section.id,
          isCustomValue(section.options, form?.[section.formField]),
        ])
      )
    );
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function setCustomSection(sectionId, active) {
    setCustomSections((current) => ({
      ...current,
      [sectionId]: active,
    }));
  }

  function chooseOption(sectionId, optionId) {
    const section = sectionConfigById[sectionId];
    if (!section) return;

    const currentValue = form?.[section.formField] || "";

    if (optionId === "CUSTOM") {
      if (!isCustomValue(section.options, currentValue)) {
        updateField?.(section.formField, "");
      }

      setCustomSection(sectionId, true);
      return;
    }

    setCustomSection(sectionId, false);
    updateField?.(section.formField, optionId || "");
  }

  function changeCustomValue(sectionId, nextValue) {
    const section = sectionConfigById[sectionId];
    if (!section) return;

    const normalizedValue = String(nextValue || "").slice(
      0,
      CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH
    );

    setCustomSection(sectionId, true);
    updateField?.(section.formField, normalizedValue);
  }

  const sections = sectionConfigs.map((section) => {
    const value = form?.[section.formField] || "";
    const customActive = Boolean(customSections[section.id]);

    return {
      id: section.id,
      title: section.title,
      layout: section.layout,
      options: section.options.map((option) =>
        toViewOption(option, section.layout)
      ),
      selectedOptionId: customActive ? "CUSTOM" : value,
      customActive,
      customValue: getCustomInputValue(section.options, value),
      customInputTitle: section.customInputTitle,
      customPlaceholder: section.customPlaceholder,
      customHelperText:
        "This text is saved directly in the selected appearance field.",
    };
  });

  const summarySectionId = summarySectionIdByField[summaryField];
  const summarySection = sectionConfigById[summarySectionId];
  const triggerSummary = summarySection
    ? getDisplayLabel(
        summarySection.options,
        form?.[summarySection.formField]
      )
    : "";

  return {
    open,
    triggerLabel: label,
    triggerSummary,
    modalTitle: "Select Hair & Eyes",
    sections,
    customValueMaxLength: CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH,
    onOpen: openModal,
    onClose: closeModal,
    onChooseOption: chooseOption,
    onChangeCustomValue: changeCustomValue,
  };
}

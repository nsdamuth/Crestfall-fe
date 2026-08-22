"use client";

import { useState } from "react";

import {
  CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH,
} from "@/components/studio/create/character/constants/constants";

const hairColorOptions = [
  { value: "", label: "Not chosen", color: "transparent" },
  { value: "BLACK", label: "Black", color: "#111111" },
  { value: "PITCH_BLACK", label: "Pitch Black", color: "#020202" },
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
    color: "var(--surface-1)",
  },
];

const hairLengthOptions = [
  { value: "", label: "Not chosen" },
  { value: "BALD_SHAVED", label: "Bald / Shaved" },
  { value: "VERY_SHORT", label: "Very Short" },
  { value: "SHORT", label: "Short" },
  { value: "SHOULDER_LENGTH", label: "Shoulder Length" },
  { value: "MEDIUM", label: "Medium Length" },
  { value: "LONG", label: "Long" },
  { value: "VERY_LONG", label: "Very Long" },
  { value: "FLOOR_LENGTH", label: "Floor Length" },
  { value: "CUSTOM", label: "Custom" },
];

const hairTextureOptions = [
  { value: "", label: "Not chosen" },
  { value: "STRAIGHT", label: "Straight" },
  { value: "WAVY", label: "Wavy" },
  { value: "CURLY", label: "Curly" },
  { value: "COILY", label: "Coily" },
  { value: "MESSY", label: "Messy" },
  { value: "WILD", label: "Wild" },
  { value: "FLOATING", label: "Floating" },
  { value: "VOLUMINOUS", label: "Voluminous" },
  { value: "SPIKY", label: "Spiky" },
  { value: "CUSTOM", label: "Custom" },
];

const hairStyleOptions = [
  { value: "", label: "Not chosen" },
  { value: "LOOSE", label: "Loose" },
  { value: "BANGS", label: "Bangs" },
  { value: "SIDE_BANGS", label: "Side Bangs" },
  { value: "PONYTAIL", label: "Ponytail" },
  { value: "TWIN_TAILS", label: "Twin Tails" },
  { value: "BRAIDED", label: "Braided" },
  { value: "BUN", label: "Bun" },
  { value: "BOB", label: "Bob" },
  { value: "PIXIE", label: "Pixie" },
  { value: "HIME_CUT", label: "Hime Cut" },
  { value: "UNDERCUT", label: "Undercut" },
  { value: "CUSTOM", label: "Custom" },
];

const sectionConfigs = [
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
    id: "hairLength",
    formField: "hair_length",
    title: "Hair Length",
    layout: "options",
    options: hairLengthOptions,
    customInputTitle: "Custom Hair Length",
    customPlaceholder: "e.g. waist-length with uneven layers",
  },
  {
    id: "hairTexture",
    formField: "hair_texture",
    title: "Hair Texture",
    layout: "options",
    options: hairTextureOptions,
    customInputTitle: "Custom Hair Texture",
    customPlaceholder: "e.g. dense corkscrew curls",
  },
  {
    id: "hairStyle",
    formField: "hair_style",
    title: "Hair Style",
    layout: "options",
    options: hairStyleOptions,
    customInputTitle: "Custom Hair Style",
    customPlaceholder:
      "e.g. asymmetrical braided crown with loose strands",
  },
];

const sectionConfigById = Object.fromEntries(
  sectionConfigs.map((section) => [section.id, section])
);

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

// ED1E section 8: no gradient swatches, ever. Every option renders as
// a flat radius-md tile.
function toSwatchStyle(color) {
  if (!color) return {};

  return { backgroundColor: color };
}

function toViewOption(option, layout) {
  return {
    id: option?.value || "",
    label: option?.label || "Not chosen",
    isCustom: option?.value === "CUSTOM",
    swatchStyle: layout === "swatches" ? toSwatchStyle(option?.color) : null,
  };
}

export function useHairModalViewModel({
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

  const triggerSummary = sectionConfigs
    .map((section) =>
      getDisplayLabel(section.options, form?.[section.formField])
    )
    .filter((label) => label && label !== "Not chosen")
    .join(" / ");

  return {
    open,
    triggerLabel: "Hair",
    triggerSummary: triggerSummary || "Not chosen",
    modalTitle: "Select Hair",
    sections,
    customValueMaxLength: CUSTOM_VISUAL_APPEARANCE_VALUE_MAX_LENGTH,
    onOpen: openModal,
    onClose: closeModal,
    onChooseOption: chooseOption,
    onChangeCustomValue: changeCustomValue,
  };
}

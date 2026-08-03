const noop = () => {};

const proportionOptions = [
  {
    id: "__NONE__",
    label: "Not chosen",
    description: "Leave proportions undefined.",
    isSelected: false,
    isNone: true,
    isCustom: false,
    isExclusive: true,
  },
  {
    id: "BALANCED",
    label: "Balanced",
    description: "Neutral, proportional silhouette.",
    isSelected: false,
    isNone: false,
    isCustom: false,
    isExclusive: true,
  },
  {
    id: "BROAD_SHOULDERS",
    label: "Broad Shoulders",
    description: "Shoulder-dominant frame.",
    isSelected: true,
    isNone: false,
    isCustom: false,
    isExclusive: false,
  },
  {
    id: "NARROW_WAIST",
    label: "Narrow Waist",
    description: "Defined waist emphasis.",
    isSelected: true,
    isNone: false,
    isCustom: false,
    isExclusive: false,
  },
  {
    id: "WIDE_HIPS",
    label: "Wide Hips",
    description: "Hip-emphasized silhouette.",
    isSelected: false,
    isNone: false,
    isCustom: false,
    isExclusive: false,
  },
  {
    id: "FULL_CHEST_BUST",
    label: "Full Chest / Bust",
    description: "Chest or bust-emphasized silhouette.",
    isSelected: false,
    isNone: false,
    isCustom: false,
    isExclusive: false,
  },
  {
    id: "STRAIGHT_FRAME",
    label: "Straight Frame",
    description: "Less curve, straighter silhouette.",
    isSelected: false,
    isNone: false,
    isCustom: false,
    isExclusive: false,
  },
  {
    id: "CUSTOM",
    label: "Custom",
    description: "Write custom proportions.",
    isSelected: false,
    isNone: false,
    isCustom: true,
    isExclusive: false,
  },
];

const baseFixture = {
  open: true,
  triggerLabel: "Proportions",
  triggerSummary: "Broad Shoulders + Narrow Waist",
  modalTitle: "Proportions",
  modalDescription:
    "Optional silhouette emphasis for image generation and narration. You can select multiple compatible traits.",
  options: proportionOptions,
  customActive: false,
  customTitle: "Custom Proportions",
  customValue: "",
  customPlaceholder: "Type custom proportions...",
  onOpen: noop,
  onClose: noop,
  onChooseOption: noop,
  onChangeCustomValue: noop,
  onBackFromCustom: noop,
  onAddCustomValue: noop,
  onDone: noop,
};

export const multiTraitModalClosedFixture = {
  ...baseFixture,
  open: false,
};

export const multiTraitModalSelectedFixture = {
  ...baseFixture,
};

export const multiTraitModalEmptyFixture = {
  ...baseFixture,
  triggerSummary: "Not chosen",
  options: proportionOptions.map((option) => ({
    ...option,
    isSelected: option.isNone,
  })),
};

export const multiTraitModalExclusiveFixture = {
  ...baseFixture,
  triggerSummary: "Balanced",
  options: proportionOptions.map((option) => ({
    ...option,
    isSelected: option.id === "BALANCED",
  })),
};

export const multiTraitModalCustomFixture = {
  ...baseFixture,
  customActive: true,
  customValue: "Long-limbed with an unusually narrow torso",
};

export const multiTraitModalLongContentFixture = {
  ...baseFixture,
  triggerLabel: "Supplemental Silhouette and Proportion Emphasis",
  modalTitle: "Supplemental Silhouette and Proportion Emphasis",
  modalDescription:
    "Select any compatible visual traits that should influence generated imagery, narrative descriptions, and movement cues without overriding the character's explicitly authored body notes.",
  triggerSummary:
    "Broad Shoulders + Narrow Waist + Full Chest / Bust + Straight Frame",
  options: proportionOptions.map((option, index) => ({
    ...option,
    label:
      index === 2
        ? "Exceptionally broad and structurally dominant shoulders"
        : option.label,
    description:
      index === 2
        ? "A deliberately long option used to stress responsive wrapping and card-height behavior while preserving the same semantic option contract."
        : option.description,
  })),
};

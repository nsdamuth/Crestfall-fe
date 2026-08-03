const noop = () => {};

const personalityOptions = [
  {
    id: "STOIC",
    label: "Stoic",
    description: "Restrained, steady, difficult to shake.",
    isSelected: true,
    isCustom: false,
  },
  {
    id: "CHARMING",
    label: "Charming",
    description: "Warm, socially smooth, persuasive.",
    isSelected: false,
    isCustom: false,
  },
  {
    id: "PROTECTIVE",
    label: "Protective",
    description: "Loyal, vigilant, quick to defend.",
    isSelected: false,
    isCustom: false,
  },
  {
    id: "THINKER",
    label: "Thinker",
    description: "Reflective, analytical, inward, pattern-seeking.",
    isSelected: false,
    isCustom: false,
  },
  {
    id: "COMMANDING",
    label: "Commanding",
    description: "Decisive, dominant, expects action.",
    isSelected: false,
    isCustom: false,
  },
  {
    id: "MYSTERIOUS",
    label: "Mysterious",
    description: "Layered, evasive, hard to read.",
    isSelected: false,
    isCustom: false,
  },
  {
    id: "CUSTOM",
    label: "Custom",
    description: "Write your own personality shorthand.",
    isSelected: false,
    isCustom: true,
  },
];

const baseFixture = {
  open: true,
  triggerLabel: "Outward Personality",
  triggerSummary: "Stoic",
  modalTitle: "Outward Personality",
  modalDescription:
    "Choose a shorthand archetype. Outward personality is what others see first; internal personality is what drives the character beneath the surface.",
  options: personalityOptions,
  customActive: false,
  customTitle: "Custom Personality",
  customValue: "",
  customPlaceholder: "Type a custom archetype...",
  onOpen: noop,
  onClose: noop,
  onChooseOption: noop,
  onChangeCustomValue: noop,
  onBackFromCustom: noop,
  onUseCustomValue: noop,
};

export const personalityModalClosedFixture = {
  ...baseFixture,
  open: false,
};

export const personalityModalPresetFixture = {
  ...baseFixture,
};

export const personalityModalEmptyFixture = {
  ...baseFixture,
  triggerSummary: "Not chosen",
  options: personalityOptions.map((option) => ({
    ...option,
    isSelected: false,
  })),
};

export const personalityModalCustomFixture = {
  ...baseFixture,
  triggerSummary: "Quietly intense and relentlessly observant",
  customActive: true,
  customValue: "Quietly intense and relentlessly observant",
  options: personalityOptions.map((option) => ({
    ...option,
    isSelected: false,
  })),
};

export const personalityModalInternalFixture = {
  ...baseFixture,
  triggerLabel: "Internal Personality",
  modalTitle: "Internal Personality",
  triggerSummary: "Thinker",
  options: personalityOptions.map((option) => ({
    ...option,
    isSelected: option.id === "THINKER",
  })),
};

export const personalityModalLongContentFixture = {
  ...baseFixture,
  triggerLabel: "Outward Personality and Immediate Social Presentation",
  modalTitle: "Outward Personality and Immediate Social Presentation",
  triggerSummary:
    "Measured, socially perceptive, quietly magnetic, and difficult to unsettle",
  options: personalityOptions.map((option, index) => ({
    ...option,
    label:
      index === 0
        ? "Restrained, socially perceptive, and exceptionally difficult to unsettle"
        : option.label,
    description:
      index === 0
        ? "A deliberately long archetype description used to stress responsive wrapping, card height, and modal scrolling without changing the contract."
        : option.description,
  })),
};

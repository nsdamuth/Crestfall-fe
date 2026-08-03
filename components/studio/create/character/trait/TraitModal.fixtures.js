const noop = () => {};

const bodyTypeOptions = [
  {
    id: "SLENDER",
    label: "Slender",
    description: "A narrow, lightly built physical silhouette.",
    isSelected: false,
    isCustom: false,
  },
  {
    id: "ATHLETIC",
    label: "Athletic",
    description: "A conditioned, balanced, physically capable build.",
    isSelected: true,
    isCustom: false,
  },
  {
    id: "BROAD",
    label: "Broad",
    description: "A wider, heavier visual silhouette.",
    isSelected: false,
    isCustom: false,
  },
  {
    id: "CUSTOM",
    label: "Custom",
    description: "Write a trait that is not represented by the presets.",
    isSelected: false,
    isCustom: true,
  },
];

const baseFixture = {
  open: true,
  triggerLabel: "Body Type",
  triggerSummary: "Athletic",
  modalTitle: "Body Type",
  modalDescription: "Choose a broad body silhouette.",
  options: bodyTypeOptions,
  customActive: false,
  customTitle: "Custom Body Type",
  customValue: "",
  customPlaceholder: "Type a custom body type...",
  onOpen: noop,
  onClose: noop,
  onChooseOption: noop,
  onChangeCustomValue: noop,
  onBackFromCustom: noop,
  onUseCustomValue: noop,
};

export const traitModalClosedFixture = {
  ...baseFixture,
  open: false,
};

export const traitModalPresetFixture = {
  ...baseFixture,
};

export const traitModalEmptyFixture = {
  ...baseFixture,
  triggerSummary: "Not chosen",
  options: bodyTypeOptions.map((option) => ({ ...option, isSelected: false })),
};

export const traitModalCustomFixture = {
  ...baseFixture,
  triggerSummary: "Tall, angular, and reed-thin",
  customActive: true,
  customValue: "Tall, angular, and reed-thin",
  options: bodyTypeOptions.map((option) => ({ ...option, isSelected: false })),
};

export const traitModalNoDescriptionFixture = {
  ...baseFixture,
  triggerLabel: "Movement Style",
  modalTitle: "Movement Style",
  modalDescription: "",
  triggerSummary: "Not chosen",
  options: bodyTypeOptions.map((option) => ({ ...option, isSelected: false })),
};

export const traitModalLongContentFixture = {
  ...baseFixture,
  triggerLabel: "Supplemental Character Behavior and Presentation Trait",
  modalTitle: "Supplemental Character Behavior and Presentation Trait",
  modalDescription:
    "Choose a broad behavioral shorthand that supports scene narration without overriding the character's explicit personality, authored dialogue guidance, or creator-written notes.",
  triggerSummary:
    "Deliberate and observant, with restrained gestures and an unusually measured physical presence",
  options: bodyTypeOptions.map((option, index) => ({
    ...option,
    label:
      index === 0
        ? "Deliberate, restrained, and exceptionally observant"
        : option.label,
    description:
      index === 0
        ? "A long descriptive option used to stress responsive wrapping and card height while preserving the same semantic option contract."
        : option.description,
  })),
};

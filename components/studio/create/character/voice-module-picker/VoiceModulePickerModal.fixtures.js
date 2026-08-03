const noop = () => {};

const vocalTextureOptions = [
  {
    id: "playful_vocal_emphasis",
    label: "Playful Vocal Emphasis",
    description:
      "Rare ellipses, vocal elongation, repeated letters, or playful emphasis when compatible with the character voice.",
  },
  {
    id: "dry_wit",
    label: "Dry Wit",
    description:
      "Understated humor, restrained sarcasm, and sharp observational phrasing without turning the character into a joke machine.",
  },
  {
    id: "gentle_grounding",
    label: "Gentle and Grounding",
    description:
      "Gentle, composed speech with thoughtful pacing, quiet confidence, and calm emotional warmth.",
  },
];

const dialectOptions = [
  {
    id: "old_west_frontier",
    label: "Old West Frontier",
    description:
      "Frontier western vocabulary, saloon and cowboy register, and readable period-flavored phrasing.",
  },
  {
    id: "warm_appalachian",
    label: "Warm Appalachian",
    description:
      "Natural Appalachian rhythm, plainspoken warmth, neighborly expressions, and practical wisdom.",
  },
];

const baseFixture = {
  open: true,
  triggerLabel: "Voice Modules",
  triggerDescription:
    "Attach one or more reusable tone, emphasis, accent, or dialogue modules. These modify expression without replacing the character's core voice.",
  triggerActionLabel: "Choose Modules",
  selectedItems: [
    { id: "dry_wit", label: "Dry Wit" },
    { id: "warm_appalachian", label: "Warm Appalachian" },
  ],
  emptySelectionMessage: "No voice modules selected.",
  modalAriaLabel: "Choose voice modules",
  modalTitle: "Choose Voice Modules",
  modalDescription:
    "Select one or more prebuilt modules. Character voice still has priority; modules are expression overlays, not replacements.",
  optionGroups: [
    {
      id: "VOCAL_TEXTURE",
      label: "Vocal Texture",
      options: vocalTextureOptions,
    },
    {
      id: "DIALECT_REGISTER",
      label: "Dialect / Register",
      options: dialectOptions,
    },
  ],
  selectedIds: ["dry_wit", "warm_appalachian"],
  clearActionLabel: "Clear All",
  doneActionLabel: "Done",
  canClear: true,
  onOpen: noop,
  onClose: noop,
  onToggleModule: noop,
  onClearAll: noop,
  onDone: noop,
};

export const voiceModulePickerClosedFixture = {
  ...baseFixture,
  open: false,
};

export const voiceModulePickerSelectedFixture = {
  ...baseFixture,
};

export const voiceModulePickerEmptySelectionFixture = {
  ...baseFixture,
  selectedItems: [],
  selectedIds: [],
  canClear: false,
};

export const voiceModulePickerNoOptionsFixture = {
  ...baseFixture,
  selectedItems: [],
  selectedIds: [],
  optionGroups: [],
  canClear: false,
};

export const voiceModulePickerLongContentFixture = {
  ...baseFixture,
  triggerLabel: "Voice, Accent, Dialogue Rhythm, and Expressive Emphasis Modules",
  triggerDescription:
    "Attach one or more reusable tone, emphasis, accent, dialogue-rhythm, authority-register, genre-register, or social-register modules. These expression overlays must remain subordinate to the character's core personality, history, mood, and established voice.",
  modalTitle: "Choose Reusable Character Voice and Expression Modules",
  optionGroups: [
    {
      id: "VOCAL_TEXTURE",
      label: "Vocal Texture and Emotional Presentation",
      options: vocalTextureOptions.map((option) => ({
        ...option,
        description: `${option.description} This deliberately extended fixture description tests wrapping, card height, and responsive grid behavior without changing any Crestfall data.`,
      })),
    },
    baseFixture.optionGroups[1],
  ],
};

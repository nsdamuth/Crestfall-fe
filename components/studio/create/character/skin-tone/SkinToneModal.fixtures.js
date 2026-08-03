const noop = () => {};

function toSwatchStyle(color) {
  return color.includes("gradient")
    ? { backgroundImage: color }
    : { backgroundColor: color };
}

function toOption(id, label, color) {
  return {
    id,
    label,
    isCustom: id === "CUSTOM",
    swatchStyle: toSwatchStyle(color),
  };
}

const options = [
  toOption("", "Not chosen", "transparent"),
  toOption("PORCELAIN", "Porcelain", "#f8e2c2"),
  toOption("FAIR", "Fair", "#f1cfa7"),
  toOption("LIGHT", "Light", "#d8a36f"),
  toOption("WARM_TAN", "Warm Tan", "#a66a3d"),
  toOption("BROWN", "Brown", "#7a421f"),
  toOption("DEEP_BROWN", "Deep Brown", "#3f2415"),
  toOption("PINK_TONE", "Pink Tone", "#f4a7c7"),
  toOption("ORANGE_TONE", "Orange Tone", "#d87332"),
  toOption("LAVENDER_TONE", "Lavender Tone", "#8b6bd6"),
  toOption("RED_TONE", "Red Tone", "#b11818"),
  toOption("BLUE_TONE", "Blue Tone", "#0a7eac"),
  toOption("GREEN_TONE", "Green Tone", "#149b51"),
  toOption("GRAY_TONE", "Gray Tone", "#808080"),
  toOption("DARK_GRAY_TONE", "Dark Gray Tone", "#3f3f46"),
  toOption("PITCH_BLACK_TONE", "Pitch Black Tone", "#020202"),
  toOption("WHITE_TONE", "White Tone", "#ffffff"),
  toOption(
    "CUSTOM",
    "Custom",
    "linear-gradient(135deg, #f4a7c7, #8b6bd6, #0a7eac)"
  ),
];

const baseFixture = {
  open: true,
  triggerLabel: "Skin Tone",
  triggerSummary: "Warm Tan",
  modalTitle: "Select Skin Tone",
  options,
  selectedOptionId: "WARM_TAN",
  customActive: false,
  customValue: "",
  customInputTitle: "Custom Skin Tone",
  customPlaceholder: "e.g. pale blue with silver undertones",
  customHelperText: "This text is saved directly as the character's skin tone.",
  customValueMaxLength: 240,
  onOpen: noop,
  onClose: noop,
  onChooseOption: noop,
  onChangeCustomValue: noop,
};

export const skinToneClosedFixture = {
  ...baseFixture,
  open: false,
};

export const skinTonePresetFixture = {
  ...baseFixture,
};

export const skinToneEmptyFixture = {
  ...baseFixture,
  triggerSummary: "Not chosen",
  selectedOptionId: "",
};

export const skinToneCustomFixture = {
  ...baseFixture,
  triggerSummary: "Pale blue with silver undertones",
  selectedOptionId: "CUSTOM",
  customActive: true,
  customValue: "pale blue with silver undertones",
};

export const skinToneLongContentFixture = {
  ...baseFixture,
  triggerSummary:
    "Moonlit lavender-blue skin with opalescent silver undertones and faint constellations across the shoulders",
  selectedOptionId: "CUSTOM",
  customActive: true,
  customValue:
    "Moonlit lavender-blue skin with opalescent silver undertones, faint constellations across the shoulders, and a subtle pearlescent glow in low light.",
};

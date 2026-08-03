const noop = () => {};

function toSwatchStyle(color) {
  return color.includes("gradient")
    ? { backgroundImage: color }
    : { backgroundColor: color };
}

function toSwatchOption(id, label, color) {
  return {
    id,
    label,
    isCustom: id === "CUSTOM",
    swatchStyle: toSwatchStyle(color),
  };
}

const eyeColorOptions = [
  toSwatchOption("", "Not chosen", "transparent"),
  toSwatchOption("BLACK", "Black", "#111111"),
  toSwatchOption("BROWN", "Brown", "#6b3a1e"),
  toSwatchOption("BLUE", "Blue", "#3b82f6"),
  toSwatchOption("GREEN", "Green", "#22c55e"),
  toSwatchOption("GOLD", "Gold", "#facc15"),
  toSwatchOption("AMBER", "Amber", "#f59e0b"),
  toSwatchOption("GRAY", "Gray", "#9ca3af"),
  toSwatchOption("SILVER", "Silver", "#d1d5db"),
  toSwatchOption("WHITE", "White", "#f8fafc"),
  toSwatchOption("RED", "Red", "#ef4444"),
  toSwatchOption("ORANGE", "Orange", "#f97316"),
  toSwatchOption("PINK", "Pink", "#ec4899"),
  toSwatchOption("VIOLET", "Violet", "#8b5cf6"),
  toSwatchOption(
    "GLOWING",
    "Glowing",
    "linear-gradient(135deg, #ffffff, #60a5fa, #a78bfa)"
  ),
  toSwatchOption(
    "HETEROCHROMIA",
    "Heterochromia",
    "linear-gradient(135deg, #3b82f6 0%, #3b82f6 50%, #facc15 50%, #facc15 100%)"
  ),
  toSwatchOption(
    "CUSTOM",
    "Custom",
    "linear-gradient(135deg, #ec4899, #8b5cf6, #22c55e)"
  ),
];

const hairColorOptions = [
  toSwatchOption("", "Not chosen", "transparent"),
  toSwatchOption("BLACK", "Black", "#111111"),
  toSwatchOption("BROWN", "Brown", "#6b3a1e"),
  toSwatchOption("BLONDE", "Blonde", "#facc15"),
  toSwatchOption("RED", "Red", "#dc2626"),
  toSwatchOption("ORANGE", "Orange", "#f97316"),
  toSwatchOption("WHITE", "White", "#f5f5f5"),
  toSwatchOption("SILVER", "Silver", "#d1d5db"),
  toSwatchOption("GRAY", "Gray", "#9ca3af"),
  toSwatchOption("PINK", "Pink", "#ec4899"),
  toSwatchOption("BLUE", "Blue", "#3b82f6"),
  toSwatchOption("GREEN", "Green", "#22c55e"),
  toSwatchOption("PURPLE", "Purple", "#8b5cf6"),
  toSwatchOption(
    "CUSTOM",
    "Custom",
    "linear-gradient(135deg, #111111, #dc2626, #f5f5f5)"
  ),
];

const hairStyleOptions = [
  ["", "Not chosen"],
  ["LONG", "Long"],
  ["VERY_LONG", "Very Long"],
  ["SHORT", "Short"],
  ["STRAIGHT", "Straight"],
  ["WAVY", "Wavy"],
  ["CURLY", "Curly"],
  ["MESSY", "Messy"],
  ["WILD", "Wild"],
  ["FLOATING", "Floating"],
  ["BRAIDED", "Braided"],
  ["PONYTAIL", "Ponytail"],
  ["TWIN_TAILS", "Twin Tails"],
  ["BUN", "Bun"],
  ["BOB", "Bob"],
  ["BANGS", "Bangs"],
  ["PIXIE", "Pixie"],
  ["BALD", "Bald"],
  ["CUSTOM", "Custom"],
].map(([id, label]) => ({
  id,
  label,
  isCustom: id === "CUSTOM",
  swatchStyle: null,
}));

function buildSections({
  eyeColor = "GREEN",
  hairColor = "BLACK",
  hairStyle = "WAVY",
  customValues = {},
} = {}) {
  return [
    {
      id: "eyeColor",
      title: "Eye Color",
      layout: "swatches",
      options: eyeColorOptions,
      selectedOptionId: customValues.eyeColor ? "CUSTOM" : eyeColor,
      customActive: Boolean(customValues.eyeColor),
      customValue: customValues.eyeColor || "",
      customInputTitle: "Custom Eye Color",
      customPlaceholder: "e.g. iridescent teal with gold flecks",
      customHelperText:
        "This text is saved directly in the selected appearance field.",
    },
    {
      id: "hairColor",
      title: "Hair Color",
      layout: "swatches",
      options: hairColorOptions,
      selectedOptionId: customValues.hairColor ? "CUSTOM" : hairColor,
      customActive: Boolean(customValues.hairColor),
      customValue: customValues.hairColor || "",
      customInputTitle: "Custom Hair Color",
      customPlaceholder: "e.g. black fading into crimson tips",
      customHelperText:
        "This text is saved directly in the selected appearance field.",
    },
    {
      id: "hairStyle",
      title: "Hair Style",
      layout: "options",
      options: hairStyleOptions,
      selectedOptionId: customValues.hairStyle ? "CUSTOM" : hairStyle,
      customActive: Boolean(customValues.hairStyle),
      customValue: customValues.hairStyle || "",
      customInputTitle: "Custom Hair Style",
      customPlaceholder:
        "e.g. asymmetrical braid with loose face-framing strands",
      customHelperText:
        "This text is saved directly in the selected appearance field.",
    },
  ];
}

const baseFixture = {
  open: true,
  triggerLabel: "Eye Color",
  triggerSummary: "Green",
  modalTitle: "Select Hair & Eyes",
  sections: buildSections(),
  customValueMaxLength: 240,
  onOpen: noop,
  onClose: noop,
  onChooseOption: noop,
  onChangeCustomValue: noop,
};

export const hairEyesClosedFixture = {
  ...baseFixture,
  open: false,
};

export const hairEyesPresetFixture = {
  ...baseFixture,
};

export const hairEyesEmptyFixture = {
  ...baseFixture,
  triggerSummary: "Not chosen",
  sections: buildSections({
    eyeColor: "",
    hairColor: "",
    hairStyle: "",
  }),
};

export const hairEyesCustomFixture = {
  ...baseFixture,
  triggerSummary: "Iridescent teal with gold flecks",
  sections: buildSections({
    customValues: {
      eyeColor: "iridescent teal with gold flecks",
      hairColor: "black fading into crimson tips",
      hairStyle: "asymmetrical braid with loose face-framing strands",
    },
  }),
};

export const hairEyesLongCustomFixture = {
  ...baseFixture,
  triggerLabel: "Hair Style With An Unusually Long Trigger Label",
  triggerSummary:
    "An elaborate constellation braid threaded with tiny silver ornaments and long face-framing strands",
  sections: buildSections({
    customValues: {
      hairStyle:
        "An elaborate constellation braid threaded with tiny silver ornaments and long face-framing strands used to stress-test wrapping and the custom-value counter.",
    },
  }),
};

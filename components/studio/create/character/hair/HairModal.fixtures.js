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

const hairColorOptions = [
  toSwatchOption("", "Not chosen", "transparent"),
  toSwatchOption("BLACK", "Black", "#111111"),
  toSwatchOption("PITCH_BLACK", "Pitch Black", "#020202"),
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

const hairLengthOptions = [
  ["", "Not chosen"],
  ["BALD_SHAVED", "Bald / Shaved"],
  ["VERY_SHORT", "Very Short"],
  ["SHORT", "Short"],
  ["SHOULDER_LENGTH", "Shoulder Length"],
  ["MEDIUM", "Medium Length"],
  ["LONG", "Long"],
  ["VERY_LONG", "Very Long"],
  ["FLOOR_LENGTH", "Floor Length"],
  ["CUSTOM", "Custom"],
];

const hairTextureOptions = [
  ["", "Not chosen"],
  ["STRAIGHT", "Straight"],
  ["WAVY", "Wavy"],
  ["CURLY", "Curly"],
  ["COILY", "Coily"],
  ["MESSY", "Messy"],
  ["WILD", "Wild"],
  ["FLOATING", "Floating"],
  ["VOLUMINOUS", "Voluminous"],
  ["SPIKY", "Spiky"],
  ["CUSTOM", "Custom"],
];

const hairStyleOptions = [
  ["", "Not chosen"],
  ["LOOSE", "Loose"],
  ["BANGS", "Bangs"],
  ["SIDE_BANGS", "Side Bangs"],
  ["PONYTAIL", "Ponytail"],
  ["TWIN_TAILS", "Twin Tails"],
  ["BRAIDED", "Braided"],
  ["BUN", "Bun"],
  ["BOB", "Bob"],
  ["PIXIE", "Pixie"],
  ["HIME_CUT", "Hime Cut"],
  ["UNDERCUT", "Undercut"],
  ["CUSTOM", "Custom"],
];

function toOptionList(options) {
  return options.map(([id, label]) => ({
    id,
    label,
    isCustom: id === "CUSTOM",
    swatchStyle: null,
  }));
}

function buildSection({
  id,
  title,
  layout,
  options,
  selectedOptionId,
  customValue = "",
  customInputTitle,
  customPlaceholder,
}) {
  return {
    id,
    title,
    layout,
    options,
    selectedOptionId: customValue ? "CUSTOM" : selectedOptionId,
    customActive: Boolean(customValue),
    customValue,
    customInputTitle,
    customPlaceholder,
    customHelperText:
      "This text is saved directly in the selected appearance field.",
  };
}

function buildSections({
  hairColor = "BLACK",
  hairLength = "LONG",
  hairTexture = "WAVY",
  hairStyle = "LOOSE",
  customValues = {},
} = {}) {
  return [
    buildSection({
      id: "hairColor",
      title: "Hair Color",
      layout: "swatches",
      options: hairColorOptions,
      selectedOptionId: hairColor,
      customValue: customValues.hairColor || "",
      customInputTitle: "Custom Hair Color",
      customPlaceholder: "e.g. black fading into crimson tips",
    }),
    buildSection({
      id: "hairLength",
      title: "Hair Length",
      layout: "options",
      options: toOptionList(hairLengthOptions),
      selectedOptionId: hairLength,
      customValue: customValues.hairLength || "",
      customInputTitle: "Custom Hair Length",
      customPlaceholder: "e.g. waist-length with uneven layers",
    }),
    buildSection({
      id: "hairTexture",
      title: "Hair Texture",
      layout: "options",
      options: toOptionList(hairTextureOptions),
      selectedOptionId: hairTexture,
      customValue: customValues.hairTexture || "",
      customInputTitle: "Custom Hair Texture",
      customPlaceholder: "e.g. dense corkscrew curls",
    }),
    buildSection({
      id: "hairStyle",
      title: "Hair Style",
      layout: "options",
      options: toOptionList(hairStyleOptions),
      selectedOptionId: hairStyle,
      customValue: customValues.hairStyle || "",
      customInputTitle: "Custom Hair Style",
      customPlaceholder:
        "e.g. asymmetrical braided crown with loose strands",
    }),
  ];
}

const baseFixture = {
  open: true,
  triggerLabel: "Hair",
  triggerSummary: "Black / Long / Wavy / Loose",
  modalTitle: "Select Hair",
  sections: buildSections(),
  customValueMaxLength: 240,
  onOpen: noop,
  onClose: noop,
  onChooseOption: noop,
  onChangeCustomValue: noop,
};

export const hairClosedFixture = {
  ...baseFixture,
  open: false,
};

export const hairPresetFixture = {
  ...baseFixture,
};

export const hairEmptyFixture = {
  ...baseFixture,
  triggerSummary: "Not chosen",
  sections: buildSections({
    hairColor: "",
    hairLength: "",
    hairTexture: "",
    hairStyle: "",
  }),
};

export const hairCustomFixture = {
  ...baseFixture,
  triggerSummary:
    "Black fading into crimson tips / Waist-length layers / Dense corkscrew curls / Asymmetrical braided crown",
  sections: buildSections({
    customValues: {
      hairColor: "black fading into crimson tips",
      hairLength: "waist-length with uneven layers",
      hairTexture: "dense corkscrew curls",
      hairStyle: "asymmetrical braided crown with loose strands",
    },
  }),
};

export const hairLongContentFixture = {
  ...baseFixture,
  triggerSummary:
    "Midnight black with silver-blue iridescence / Floor-length layered waves / Dense floating corkscrew texture / Elaborate braided crown with ornaments",
  sections: buildSections({
    customValues: {
      hairStyle:
        "An elaborate asymmetrical braided crown threaded with tiny silver ornaments, loose face-framing strands, and several unusually long trailing sections used to stress-test wrapping and the custom-value counter.",
    },
  }),
};

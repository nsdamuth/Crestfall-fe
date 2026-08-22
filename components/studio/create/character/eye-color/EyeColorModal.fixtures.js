const noop = () => {};

function toSwatchStyle(color) {
  return { backgroundColor: color };
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
  toOption("BLACK", "Black", "#111111"),
  toOption("BROWN", "Brown", "#6b3a1e"),
  toOption("BLUE", "Blue", "#3b82f6"),
  toOption("GREEN", "Green", "#22c55e"),
  toOption("GOLD", "Gold", "#facc15"),
  toOption("AMBER", "Amber", "#f59e0b"),
  toOption("GRAY", "Gray", "#9ca3af"),
  toOption("SILVER", "Silver", "#d1d5db"),
  toOption("WHITE", "White", "#f8fafc"),
  toOption("RED", "Red", "#ef4444"),
  toOption("ORANGE", "Orange", "#f97316"),
  toOption("PINK", "Pink", "#ec4899"),
  toOption("VIOLET", "Violet", "#8b5cf6"),
  toOption("GLOWING", "Glowing", "#93c5fd"),
  toOption("HETEROCHROMIA", "Heterochromia", "#3b82f6"),
  toOption("CUSTOM", "Custom", "var(--surface-1)"),
];

const baseFixture = {
  open: true,
  triggerLabel: "Eye Color",
  triggerSummary: "Blue",
  modalTitle: "Select Eye Color",
  options,
  selectedOptionId: "BLUE",
  customActive: false,
  customValue: "",
  customInputTitle: "Custom Eye Color",
  customPlaceholder: "e.g. iridescent teal with gold flecks",
  customHelperText: "This text is saved directly as the character's eye color.",
  customValueMaxLength: 240,
  onOpen: noop,
  onClose: noop,
  onChooseOption: noop,
  onChangeCustomValue: noop,
};

export const eyeColorClosedFixture = {
  ...baseFixture,
  open: false,
};

export const eyeColorPresetFixture = {
  ...baseFixture,
};

export const eyeColorEmptyFixture = {
  ...baseFixture,
  triggerSummary: "Not chosen",
  selectedOptionId: "",
};

export const eyeColorCustomFixture = {
  ...baseFixture,
  triggerSummary: "Iridescent teal with gold flecks",
  selectedOptionId: "CUSTOM",
  customActive: true,
  customValue: "iridescent teal with gold flecks",
};

export const eyeColorLongContentFixture = {
  ...baseFixture,
  triggerSummary:
    "Luminous sea-glass teal with shifting violet rings and scattered metallic gold flecks",
  selectedOptionId: "CUSTOM",
  customActive: true,
  customValue:
    "Luminous sea-glass teal with shifting violet rings, scattered metallic gold flecks, and a faint glow that becomes more visible in darkness.",
};

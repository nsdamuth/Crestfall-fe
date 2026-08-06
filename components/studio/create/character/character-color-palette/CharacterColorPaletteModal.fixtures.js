const noop = () => {};

function palette(id, label, description, colors) {
  return {
    id,
    label,
    description,
    swatches: [
      colors.dialogue,
      colors.narration,
      colors.emphasis,
      colors.strong,
      colors.whisper,
    ],
    previewColors: colors,
  };
}

const crestfallDefault = palette(
  "CRESTFALL_DEFAULT",
  "Crestfall Default",
  "Warm parchment, antique gold, and restrained neutral accents designed for Crestfall's default dark interface.",
  {
    dialogue: "#F5E7C7",
    narration: "#C89B5A",
    emphasis: "#E2B96F",
    strong: "#FFD99A",
    whisper: "#AFA08A",
    speaker: "#D6B36A",
    border: "#8A6A3C",
  }
);

const brightWinter = palette(
  "BRIGHT_WINTER",
  "Bright Winter",
  "Clear icy blues with electric magenta highlights and sharp, high-contrast energy.",
  {
    dialogue: "#F3F8FF",
    narration: "#5FC6FF",
    emphasis: "#D77CFF",
    strong: "#FF5FA2",
    whisper: "#93A8C7",
    speaker: "#78D7FF",
    border: "#315E8A",
  }
);

const deepWinter = palette(
  "DEEP_WINTER",
  "Deep Winter",
  "Dark jewel tones with violet, teal, and berry accents for dramatic presence.",
  {
    dialogue: "#F6F1FF",
    narration: "#A06CFF",
    emphasis: "#3DD7D0",
    strong: "#E65AA8",
    whisper: "#8B839B",
    speaker: "#C18CFF",
    border: "#55386F",
  }
);

const warmAutumn = palette(
  "WARM_AUTUMN",
  "Warm Autumn",
  "Burnished orange, ochre, and warm russet tones with rich seasonal warmth.",
  {
    dialogue: "#F8E8CF",
    narration: "#C57A32",
    emphasis: "#D2A23A",
    strong: "#D8613B",
    whisper: "#9B8065",
    speaker: "#D18A42",
    border: "#7B4725",
  }
);

const baseFixture = {
  open: true,
  triggerEyebrow: "Character Color Palette",
  triggerPalette: crestfallDefault,
  triggerDescription:
    "Used for this character's chat presentation and future character UI accents.",
  modalAriaLabel: "Select character color palette",
  modalEyebrow: "Character Preference",
  modalTitle: "Choose a Color Palette",
  modalDescription:
    "Select one curated seasonal palette. This preference controls chat presentation and may support other character-facing UI later. It is not inferred from appearance and does not affect image generation.",
  selectedPaletteId: crestfallDefault.id,
  paletteFamilies: [
    {
      id: "CRESTFALL",
      label: "Crestfall",
      palettes: [crestfallDefault],
    },
    {
      id: "WINTER",
      label: "Winter",
      palettes: [brightWinter, deepWinter],
    },
    {
      id: "AUTUMN",
      label: "Autumn",
      palettes: [warmAutumn],
    },
  ],
  onOpen: noop,
  onClose: noop,
  onChoosePalette: noop,
};

export const characterColorPaletteClosedFixture = {
  ...baseFixture,
  open: false,
};

export const characterColorPaletteDefaultFixture = {
  ...baseFixture,
};

export const characterColorPaletteSeasonalFixture = {
  ...baseFixture,
  triggerPalette: deepWinter,
  selectedPaletteId: deepWinter.id,
};

export const characterColorPaletteEmptyFixture = {
  ...baseFixture,
  paletteFamilies: [],
};

export const characterColorPaletteLongContentFixture = {
  ...baseFixture,
  triggerPalette: {
    ...warmAutumn,
    label: "Warm Autumn · Burnished Storytelling Edition",
  },
  selectedPaletteId: warmAutumn.id,
  modalTitle: "Choose a Curated Character Presentation Color Palette",
  modalDescription:
    "Select one curated seasonal palette for dialogue, narration, emphasis, strong text, whispers, speaker labels, borders, and future character-facing presentation surfaces. This preference remains separate from physical appearance, image generation, and character-color inference.",
  paletteFamilies: [
    ...baseFixture.paletteFamilies.slice(0, 2),
    {
      id: "AUTUMN",
      label: "Autumn",
      palettes: [
        {
          ...warmAutumn,
          label: "Warm Autumn · Burnished Storytelling Edition",
          description:
            "A deliberately long fixture description that combines burnished orange, ochre, warm russet, antique bronze, and softened earthen neutrals to stress card height, wrapping, and responsive layout behavior.",
        },
      ],
    },
  ],
};

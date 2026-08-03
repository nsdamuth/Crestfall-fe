const fixtureMedia = [
  {
    id: "fixture-image-1",
    title: "Lantern-lit traveler",
    status: "ready",
  },
  {
    id: "fixture-image-2",
    title: "Moonlit courtyard",
    status: "pending",
  },
];

const baseComposerProps = {
  mode: "IMAGE",
  selectedIngredients: {
    character: {
      id: "fixture-character",
      title: "Aveline",
      custom: false,
    },
  },
  prompt: "A poised traveler in a lantern-lit courtyard",
  renderStyle: "crestfall_fantasy",
  cameraPreset: "FULL_BODY",
  wardrobeTheme: "AUTO",
  aspectRatio: "PORTRAIT_4_5",
  imageCount: "1",
  negativePrompt: "",
  videoDuration: "4",
  videoAspectRatio: "PORTRAIT",
  videoMotionStyle: "SUBTLE",
  canGenerateImage: true,
  generationStatus: "idle",
  generationError: "",
  generationHelpText:
    "No clothing source selected. Crestfall will use the character's default clothing when available, otherwise simple generic SFW clothing.",
  coinBalance: 35,
  coinCost: 5,
  coinStatus: "loaded",
  coinError: "",
  hasEnoughCoins: true,
};

export const imageStudioWorkbenchReadyFixture = {
  mode: "IMAGE",
  mobileComposerOpen: false,
  canGenerateImage: true,
  mediaHistoryProps: {
    generatedMedia: fixtureMedia,
    historyStatus: "loaded",
    historyError: "",
    hasMoreHistory: true,
    isLoadingMoreHistory: false,
  },
  composerProps: baseComposerProps,
  pickerModalProps: null,
  savePresetModalProps: null,
};

export const imageStudioWorkbenchNoSourceFixture = {
  ...imageStudioWorkbenchReadyFixture,
  canGenerateImage: false,
  composerProps: {
    ...baseComposerProps,
    selectedIngredients: {},
    canGenerateImage: false,
    generationHelpText:
      "Select a character, clothing source, wardrobe, or location before generating.",
  },
};

export const imageStudioWorkbenchLowCoinsFixture = {
  ...imageStudioWorkbenchReadyFixture,
  canGenerateImage: false,
  composerProps: {
    ...baseComposerProps,
    coinBalance: 2,
    hasEnoughCoins: false,
    canGenerateImage: false,
    generationHelpText: "You need at least 5 coins to generate an image.",
  },
};

export const imageStudioWorkbenchGenerationErrorFixture = {
  ...imageStudioWorkbenchReadyFixture,
  composerProps: {
    ...baseComposerProps,
    generationStatus: "error",
    generationError: "Fixture generation request failed.",
  },
  mediaHistoryProps: {
    ...imageStudioWorkbenchReadyFixture.mediaHistoryProps,
    historyError: "Fixture history refresh failed.",
  },
};

export const imageStudioWorkbenchPickerFixture = {
  ...imageStudioWorkbenchReadyFixture,
  pickerModalProps: {
    slot: {
      id: "outfit",
      label: "Outfit",
      allowCreatePreset: true,
    },
    items: [
      { id: "outfit-1", title: "Court Attire" },
      { id: "outfit-2", title: "Traveling Leathers" },
    ],
    loadError: "",
    selected: null,
  },
};

export const imageStudioWorkbenchSavePresetFixture = {
  ...imageStudioWorkbenchReadyFixture,
  savePresetModalProps: {
    slot: {
      id: "location",
      label: "Location",
      allowCreatePreset: true,
    },
    promptValue: "A lantern-lit stone courtyard after rain",
  },
};

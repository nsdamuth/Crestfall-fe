export const kitImageCreatorCameraSceneryBasePanelFixture = Object.freeze({
  mode: "IMAGE",
  slots: {
    location: {
      selection: {
        title: "Brasswhisker Workshop",
        subtitle: "Location / Scene",
      },
      isCustomMode: false,
      customText: "",
    },
  },
  promptValue:
    "A quiet workshop interior beneath warm brass lamps.",
  negativePromptValue: "",
  optionFields: [
    {
      id: "renderStyle",
      label: "Render Style",
      value: "auto",
      options: [
        { value: "auto", label: "Auto" },
      ],
    },
    {
      id: "camera",
      label: "Camera / Framing",
      value: "THREE_QUARTER",
      options: [
        {
          value: "AUTO",
          label: "Auto / No Camera Filter",
        },
        {
          value: "THREE_QUARTER",
          label: "Three-Quarter Body",
        },
      ],
    },
    {
      id: "wardrobe",
      label: "Wardrobe Theme",
      value: "AUTO",
      options: [
        { value: "AUTO", label: "Auto" },
      ],
    },
    {
      id: "aspectRatio",
      label: "Aspect Ratio",
      value: "PORTRAIT_4_5",
      options: [
        {
          value: "PORTRAIT_4_5",
          label: "Portrait 4:5",
        },
      ],
    },
    {
      id: "outputCount",
      label: "Output Count",
      value: "1",
      options: [
        { value: "1", label: "1 image" },
      ],
    },
  ],
  coinBalanceLabel: "40",
  coinCostLabel: "5",
  showInsufficientCoins: false,
  canGenerate: true,
  generationHelpText: "",
  videoOptionFields: [],
  videoDirectionValue: "",
});

export const kitImageCreatorCameraSceneryLocationOnlyFixture = Object.freeze({
  kitPanelProps:
    kitImageCreatorCameraSceneryBasePanelFixture,
  cameraPresetValue: "THREE_QUARTER",
  selectedIngredients: {
    location: {
      id: "location-workshop",
      title: "Brasswhisker Workshop",
      type: "LOCATION",
    },
  },
  sceneryOnlyHelperEnabled: true,
});

export const kitImageCreatorCameraSceneryCharacterFixture = Object.freeze({
  ...kitImageCreatorCameraSceneryLocationOnlyFixture,
  cameraPresetValue: "CLOSE_UP",
  selectedIngredients: {
    location: {
      id: "location-workshop",
      title: "Brasswhisker Workshop",
      type: "LOCATION",
    },
    character: {
      id: "character-kessa",
      title: "Kessa Cindervell",
      type: "CHARACTER",
    },
  },
});

export const kitImageCreatorCameraSceneryVideoFixture = Object.freeze({
  ...kitImageCreatorCameraSceneryLocationOnlyFixture,
  kitPanelProps: {
    ...kitImageCreatorCameraSceneryBasePanelFixture,
    mode: "VIDEO",
  },
});

export const kitImageCreatorCameraSceneryNoCameraFieldFixture = Object.freeze({
  ...kitImageCreatorCameraSceneryLocationOnlyFixture,
  kitPanelProps: {
    ...kitImageCreatorCameraSceneryBasePanelFixture,
    optionFields:
      kitImageCreatorCameraSceneryBasePanelFixture.optionFields.filter(
        (field) => field.id !== "camera"
      ),
  },
  cameraPresetValue: "VERTIGO_SHOT",
});

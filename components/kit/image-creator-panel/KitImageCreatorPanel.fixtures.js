// Fixture states per docs/SPRINT-E-PLAN.md section 4: default,
// emptySlots, insufficientCoins, customIngredient, videoMode,
// longestContent. Option lists mirror
// components/studio/image-studio/imageStudioData.js verbatim (READ
// ONLY reference, values copied not imported, since that package
// belongs to the live composer and this kit piece never imports live
// product code). Exported so phase 3's Images page integration
// consumes the same lists rather than re-declaring them.
const noop = () => {};

export const RENDER_STYLE_OPTIONS = [
  { value: "auto", label: "Auto / Character Default" },
  { value: "crestfall_fantasy", label: "Crestfall Fantasy" },
  { value: "crestfall_realistic", label: "Crestfall Realistic" },
  { value: "crestfall_anime_anime", label: "Crestfall Anime / Anime" },
  { value: "crestfall_fantasy_realistic", label: "Crestfall Fantasy → Realistic" },
  { value: "crestfall_realistic_fantasy", label: "Crestfall Realistic → Fantasy" },
];

export const CAMERA_OPTIONS = [
  { value: "AUTO", label: "Auto / No Camera Filter" },
  { value: "FACE_CLOSEUP", label: "Face Close-Up" },
  { value: "HEAD_SHOULDERS", label: "Head & Shoulders" },
  { value: "BUST", label: "Bust / Chest-Up" },
  { value: "WAIST_UP", label: "Waist-Up" },
  { value: "THREE_QUARTER", label: "Three-Quarter Body" },
  { value: "FULL_BODY", label: "Full Body" },
];

export const WARDROBE_THEME_OPTIONS = [
  { value: "AUTO", label: "Auto / Wardrobe Default" },
  { value: "DEFAULT", label: "Default" },
  { value: "CASUAL", label: "Casual" },
  { value: "FORMAL", label: "Formal" },
  { value: "WORK", label: "Work" },
  { value: "TRAVEL", label: "Travel" },
  { value: "COMBAT", label: "Combat" },
  { value: "SLEEPWEAR", label: "Sleepwear" },
  { value: "CEREMONIAL", label: "Ceremonial" },
  { value: "DISGUISE", label: "Disguise" },
  { value: "SEASONAL", label: "Seasonal" },
  { value: "SPECIAL", label: "Special" },
];

export const ASPECT_RATIO_OPTIONS = [
  { value: "PORTRAIT_4_5", label: "Portrait 4:5" },
  { value: "LANDSCAPE_5_4", label: "Landscape 5:4" },
  { value: "PORTRAIT_9_16", label: "9:16" },
  { value: "LANDSCAPE_16_9", label: "16:9" },
  { value: "SQUARE_1_1", label: "1:1" },
];

export const OUTPUT_COUNT_OPTIONS = [
  { value: "1", label: "1 image" },
  { value: "2", label: "2 images" },
  { value: "4", label: "4 images" },
];

export const VIDEO_DURATION_OPTIONS = [
  { value: "4", label: "4 seconds" },
  { value: "8", label: "8 seconds" },
  { value: "12", label: "12 seconds" },
];

export const VIDEO_ASPECT_OPTIONS = [
  { value: "PORTRAIT", label: "Portrait 9:16" },
  { value: "SQUARE", label: "Square 1:1" },
  { value: "LANDSCAPE", label: "Landscape 16:9" },
];

export const VIDEO_MOTION_STYLE_OPTIONS = [
  { value: "SUBTLE", label: "Subtle motion" },
  { value: "CINEMATIC", label: "Cinematic motion" },
  { value: "ACTION", label: "Action motion" },
  { value: "EMOTIVE", label: "Emotive motion" },
];

// Live block-reason / help-text grammar, copied verbatim from
// getImageGenerationAvailability (useImageStudioWorkbenchViewModel.js).
export const NO_SOURCE_HELP_TEXT =
  "Select a character, clothing source, wardrobe, or location before generating.";
export const NO_CLOTHING_HELP_TEXT =
  "No clothing source selected. Crestfall will use the character's default clothing when available, otherwise simple generic SFW clothing.";
export const CUSTOM_SUBJECT_HELP_TEXT =
  "The custom Character guidance will be used as the complete SFW visual subject for this request.";
export function insufficientCoinsHelpText(coinCost) {
  return `You need at least ${coinCost} coins to generate an image.`;
}

function baseOptionFields() {
  return [
    { id: "wardrobe", label: "Wardrobe Theme", value: "AUTO", options: WARDROBE_THEME_OPTIONS },
    { id: "aspectRatio", label: "Aspect Ratio", value: "PORTRAIT_4_5", options: ASPECT_RATIO_OPTIONS },
    { id: "outputCount", label: "Output Count", value: "1", options: OUTPUT_COUNT_OPTIONS },
  ];
}


function baseRenderStyleRailProps() {
  return {
    value: "crestfall_fantasy_realistic",
    activeLabel: "Crestfall Fantasy → Realistic",
    helperText:
      "Choose the validated Crestfall workflow family. Fantasy is the left endpoint; Realistic is the right endpoint.",
    options: [
      { value: "crestfall_fantasy", shortLabel: "Fantasy", mappedLabel: "Crestfall Fantasy", index: 0, active: false },
      { value: "crestfall_anime_anime", shortLabel: "Anime", mappedLabel: "Crestfall Anime / Anime", index: 1, active: false },
      { value: "crestfall_fantasy_realistic", shortLabel: "Fantasy → Real", mappedLabel: "Crestfall Fantasy → Realistic", index: 2, active: true },
      { value: "crestfall_realistic_fantasy", shortLabel: "Real → Fantasy", mappedLabel: "Crestfall Realistic → Fantasy", index: 3, active: false },
      { value: "crestfall_realistic", shortLabel: "Realistic", mappedLabel: "Crestfall Realistic", index: 4, active: false },
    ],
    onChange: noop,
  };
}

function baseVideoOptionFields() {
  return [
    { id: "duration", label: "Duration", value: "4", options: VIDEO_DURATION_OPTIONS },
    { id: "videoAspect", label: "Video Aspect", value: "PORTRAIT", options: VIDEO_ASPECT_OPTIONS },
    { id: "motionStyle", label: "Motion Style", value: "SUBTLE", options: VIDEO_MOTION_STYLE_OPTIONS },
  ];
}

const sharedCallbacks = {
  onChangeMode: noop,
  onSlotActivate: noop,
  onSlotClear: noop,
  onCustomChangeText: noop,
  onCustomBackToPresets: noop,
  onCustomSavePreset: noop,
  onChangePrompt: noop,
  onChangeNegativePrompt: noop,
  onChangeOption: noop,
  onOpenCameraPresetPicker: noop,
  onGenerate: noop,
  onChangeVideoOption: noop,
  onChangeVideoDirection: noop,
};

const defaultFixture = {
  id: "default",
  label: "Default",
  props: {
    ...sharedCallbacks,
    mode: "IMAGE",
    slots: {
      character: { selection: { title: "Vesper Ash", subtitle: "Character", imageSrc: "/assets/covers/crestfall-ballerina-cover.png" }, isCustomMode: false, customText: "" },
      pose: { selection: { title: "Half-Turn, Cloak Drawn Back", subtitle: "Pose" }, isCustomMode: false, customText: "" },
      location: { selection: { title: "Harborfront at Dusk", subtitle: "Location / Scene", imageSrc: "/assets/covers/crestfall-painting-cover.png" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    negativePromptValue: "",
    renderStyleRailProps: baseRenderStyleRailProps(),
    optionFields: baseOptionFields(),
    coinBalanceLabel: "40",
    coinCostLabel: "5",
    showInsufficientCoins: false,
    canGenerate: true,
    generationHelpText: NO_CLOTHING_HELP_TEXT,
    videoOptionFields: baseVideoOptionFields(),
    videoDirectionValue: "",
  },
};

const emptySlotsFixture = {
  id: "emptySlots",
  label: "Empty slots",
  props: {
    ...sharedCallbacks,
    mode: "IMAGE",
    slots: {},
    promptValue: "",
    negativePromptValue: "",
    renderStyleRailProps: baseRenderStyleRailProps(),
    optionFields: baseOptionFields(),
    coinBalanceLabel: "40",
    coinCostLabel: "5",
    showInsufficientCoins: false,
    canGenerate: false,
    generationHelpText: NO_SOURCE_HELP_TEXT,
    videoOptionFields: baseVideoOptionFields(),
    videoDirectionValue: "",
  },
};

const insufficientCoinsFixture = {
  id: "insufficientCoins",
  label: "Insufficient coins",
  props: {
    ...sharedCallbacks,
    mode: "IMAGE",
    slots: {
      character: { selection: { title: "Vesper Ash", subtitle: "Character", imageSrc: "/assets/covers/crestfall-ballerina-cover.png" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    negativePromptValue: "",
    renderStyleRailProps: baseRenderStyleRailProps(),
    optionFields: baseOptionFields(),
    coinBalanceLabel: "2",
    coinCostLabel: "5",
    showInsufficientCoins: true,
    canGenerate: false,
    generationHelpText: insufficientCoinsHelpText("5"),
    videoOptionFields: baseVideoOptionFields(),
    videoDirectionValue: "",
  },
};

const customIngredientFixture = {
  id: "customIngredient",
  label: "Custom ingredient",
  props: {
    ...sharedCallbacks,
    mode: "IMAGE",
    slots: {
      character: {
        selection: null,
        isCustomMode: true,
        customText: "A weathered dockhand with storm-grey eyes and a coat two sizes too large.",
      },
      pose: {
        selection: null,
        isCustomMode: true,
        customText: "Leaning against a piling, watching the tide come in.",
      },
      location: { selection: { title: "Harborfront at Dusk", subtitle: "Location / Scene", imageSrc: "/assets/covers/crestfall-painting-cover.png" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    negativePromptValue: "",
    renderStyleRailProps: baseRenderStyleRailProps(),
    optionFields: baseOptionFields(),
    coinBalanceLabel: "40",
    coinCostLabel: "5",
    showInsufficientCoins: false,
    canGenerate: true,
    generationHelpText: CUSTOM_SUBJECT_HELP_TEXT,
    videoOptionFields: baseVideoOptionFields(),
    videoDirectionValue: "",
  },
};

const videoModeFixture = {
  id: "videoMode",
  label: "Video mode",
  props: {
    ...sharedCallbacks,
    mode: "VIDEO",
    slots: {
      character: { selection: { title: "Vesper Ash", subtitle: "Character", imageSrc: "/assets/covers/crestfall-ballerina-cover.png" }, isCustomMode: false, customText: "" },
      location: { selection: { title: "Harborfront at Dusk", subtitle: "Location / Scene", imageSrc: "/assets/covers/crestfall-painting-cover.png" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    negativePromptValue: "",
    renderStyleRailProps: baseRenderStyleRailProps(),
    optionFields: baseOptionFields(),
    coinBalanceLabel: "40",
    coinCostLabel: "5",
    showInsufficientCoins: false,
    canGenerate: false,
    generationHelpText: "",
    videoOptionFields: baseVideoOptionFields(),
    videoDirectionValue: "Slow push toward the harbor as lamps flicker on, one by one.",
  },
};

const longestContentFixture = {
  id: "longestContent",
  label: "Longest content",
  props: {
    ...sharedCallbacks,
    mode: "IMAGE",
    slots: {
      character: {
        selection: {
          title: "Vesper Ash, the Lantern-Keeper of the Vermillion Coast, Third Cycle Portrait Study",
          subtitle: "Character",
        },
        isCustomMode: false,
        customText: "",
      },
      playerCharacter: { selection: null, isCustomMode: false, customText: "" },
      pose: {
        selection: null,
        isCustomMode: true,
        customText:
          "A deliberately long custom guidance string written to stress the textarea's wrapping behavior across many lines, describing a half-turned stance with one hand raised toward a lantern that has not yet been lit, right up against the field's practical limits so the layout is exercised honestly rather than guessed at from a short fixture.",
      },
      outfit: {
        selection: {
          title: "The Long Coat of the Coldwater Vigil, Weathered Third Edition",
          subtitle: "Clothing Source",
        },
        isCustomMode: false,
        customText: "",
      },
      location: {
        selection: { title: "Harbor at Dusk, an Unassigned Reference Kept for Later Palette Matching", subtitle: "Location / Scene" },
        isCustomMode: false,
        customText: "",
      },
      preset: { selection: { title: "Crestfall Realistic, High Detail", subtitle: "Rendering Preset" }, isCustomMode: false, customText: "" },
    },
    promptValue:
      "A deliberately long prompt written to stress the field's wrapping behavior across many lines, describing a quiet harbor moment before a storm breaks, lanterns swaying, gulls scattering ahead of the first gust, and a figure standing perfectly still at the edge of the dock, right up against the field's practical limits so the layout is exercised honestly rather than guessed at from a short fixture.",
    negativePromptValue: "blurry, low detail, extra limbs, warped hands, oversaturated color",
    optionFields: baseOptionFields().map((field) => ({
      ...field,
      value: field.options[field.options.length - 1].value,
    })),
    coinBalanceLabel: "128400",
    coinCostLabel: "5",
    showInsufficientCoins: false,
    canGenerate: true,
    generationHelpText: "",
    videoOptionFields: baseVideoOptionFields(),
    videoDirectionValue: "",
  },
};

export const kitImageCreatorPanelFixtures = [
  defaultFixture,
  emptySlotsFixture,
  insufficientCoinsFixture,
  customIngredientFixture,
  videoModeFixture,
  longestContentFixture,
];

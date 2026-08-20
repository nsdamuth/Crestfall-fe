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
  { value: "EXTREME_WIDE_SHOT", label: "Extreme Wide Shot (EWS)" },
  { value: "WIDE_SHOT", label: "Wide Shot (WS)" },
  { value: "MEDIUM_WIDE_SHOT", label: "Medium Wide Shot (MWS)" },
  { value: "MEDIUM_SHOT", label: "Medium Shot (MS)" },
  { value: "MEDIUM_CLOSE_UP", label: "Medium Close-Up (MCU)" },
  { value: "CLOSE_UP", label: "Close-Up (CU)" },
  { value: "EXTREME_CLOSE_UP", label: "Extreme Close-Up (ECU)" },
  { value: "LOW_ANGLE_SHOT", label: "Low Angle Shot" },
  { value: "HIGH_ANGLE_SHOT", label: "High Angle Shot" },
  { value: "DUTCH_ANGLE", label: "Dutch Angle / Dutch Tilt" },
  { value: "POINT_OF_VIEW_SHOT", label: "Point of View (POV) Shot" },
  { value: "OVER_THE_SHOULDER_SHOT", label: "Over-the-Shoulder Shot" },
  { value: "TRACKING_SHOT", label: "Tracking Shot" },
  { value: "CRANE_SHOT", label: "Crane Shot" },
  { value: "HANDHELD_SHOT", label: "Handheld Shot" },
  { value: "ZOOM_SHOT", label: "Zoom Shot" },
  { value: "WIDE_ANGLE_LENS", label: "Wide Angle Lens" },
  { value: "TELEPHOTO_LENS", label: "Telephoto Lens" },
  { value: "FISH_EYE_LENS", label: "Fish Eye Lens" },
  { value: "SHALLOW_DEPTH_OF_FIELD", label: "Shallow Depth of Field" },
  { value: "DEEP_FOCUS", label: "Deep Focus" },
  { value: "RACK_FOCUS", label: "Rack Focus" },
  { value: "BACKLIT_SHOT", label: "Backlit Shot" },
  { value: "SIDE_LIT_SHOT", label: "Side Lit Shot" },
  { value: "FRONT_LIT_SHOT", label: "Front Lit Shot" },
  { value: "DUTCH_PAN", label: "Dutch Pan" },
  { value: "VERTIGO_SHOT", label: "Vertigo Shot / Dolly Zoom" },
  { value: "THROUGH_VIEWFINDER", label: "Through the Viewfinder" },
]

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
    { id: "renderStyle", label: "Render Style", value: "auto", options: RENDER_STYLE_OPTIONS },
    { id: "camera", label: "Camera / Framing", value: "AUTO", options: CAMERA_OPTIONS },
    { id: "wardrobe", label: "Wardrobe Theme", value: "AUTO", options: WARDROBE_THEME_OPTIONS },
    { id: "aspectRatio", label: "Aspect Ratio", value: "PORTRAIT_4_5", options: ASPECT_RATIO_OPTIONS },
    { id: "outputCount", label: "Output Count", value: "1", options: OUTPUT_COUNT_OPTIONS },
  ];
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
  onChangeSceneryOnlyHelper: noop,
  onChangePrompt: noop,
  onChangeNegativePrompt: noop,
  onChangeOption: noop,
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
      character: { selection: { title: "Vesper Ash", subtitle: "Character" }, isCustomMode: false, customText: "" },
      pose: { selection: { title: "Half-Turn, Cloak Drawn Back", subtitle: "Pose" }, isCustomMode: false, customText: "" },
      location: { selection: { title: "Harborfront at Dusk", subtitle: "Location / Scene" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    negativePromptValue: "",
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
      character: { selection: { title: "Vesper Ash", subtitle: "Character" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    negativePromptValue: "",
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
      location: { selection: { title: "Harborfront at Dusk", subtitle: "Location / Scene" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    negativePromptValue: "",
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

const sceneryOnlyFixture = {
  id: "sceneryOnly",
  label: "Location-only scenery helper",
  props: {
    ...sharedCallbacks,
    mode: "IMAGE",
    slots: {
      location: { selection: { title: "Harborfront at Dusk", subtitle: "Location / Scene" }, isCustomMode: false, customText: "" },
    },
    sceneryHelper: {
      visible: true,
      enabled: true,
      title: "Optimize for scenery-only image",
      description: "Adds scenic composition guidance and suppresses people.",
    },
    promptValue: "Rain on the harborfront before dawn.",
    negativePromptValue: "",
    optionFields: baseOptionFields(),
    coinBalanceLabel: "40",
    coinCostLabel: "5",
    showInsufficientCoins: false,
    canGenerate: true,
    generationHelpText: "",
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
      character: { selection: { title: "Vesper Ash", subtitle: "Character" }, isCustomMode: false, customText: "" },
      location: { selection: { title: "Harborfront at Dusk", subtitle: "Location / Scene" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    negativePromptValue: "",
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
  sceneryOnlyFixture,
  videoModeFixture,
  longestContentFixture,
];

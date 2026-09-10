// Fixture states, contract 2.1.0 (9 Sep 2026, FE/MEDIA-STUDIO; Remix
// 10 Sep 2026): default, emptySlots, insufficientCoins,
// customIngredient, remixStage, remixFull, videoMode, longestContent.
// Option lists mirror
// components/studio/image-studio/imageStudioData.js verbatim (READ
// ONLY reference, values copied not imported, since that package
// belongs to the live composer and this kit piece never imports live
// product code).
const noop = () => {};

export const NOT_AVAILABLE_LABEL = "Not available yet";

// Legacy lists kept only for the unrouted fixture-era mockup
// (app/studio/v2/images/ImagesV2Mockup.jsx); the 2.0.0 composer does
// not read them. Delete with that file.
export const RENDER_STYLE_OPTIONS = [
  { value: "auto", label: "Auto / Character Default" },
  { value: "crestfall_fantasy", label: "Crestfall Fantasy" },
  { value: "crestfall_realistic", label: "Crestfall Realistic" },
  { value: "crestfall_anime_anime", label: "Crestfall Anime" },
  { value: "crestfall_fantasy_realistic", label: "Crestfall Illustrative" },
  { value: "crestfall_fantasy_realism", label: "Crestfall Heroic" },
  { value: "crestfall_realistic_fantasy", label: "Crestfall Cinematic" },
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

export const OUTPUT_COUNT_OPTIONS = [
  { value: "2", label: "2 images" },
  { value: "4", label: "4 images" },
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

// Count list RULED 9 Sep 2026: 2, 4, 8, 16, 32, 64, 128, 256, default
// 2. The backend serves up to 4; the rest render disabled.
// Generate's list starts at 2 images; Remix's (below) at 1. Both end
// at 128 (Brian's browser review of Remix, round 2, 10 Sep 2026).
export const COUNT_OPTIONS = [
  { value: "2", label: "2 images" },
  { value: "4", label: "4 images" },
  { value: "8", label: "8 images", isDisabled: true, tooltip: "Soon" },
  { value: "16", label: "16 images", isDisabled: true, tooltip: "Soon" },
  { value: "32", label: "32 images", isDisabled: true, tooltip: "Soon" },
  { value: "64", label: "64 images", isDisabled: true, tooltip: "Soon" },
  { value: "128", label: "128 images", isDisabled: true, tooltip: "Soon" },
];

export const REMIX_COUNT_OPTIONS = [{ value: "1", label: "1 image" }, ...COUNT_OPTIONS];

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

// Live block-reason grammar, copied from getImageGenerationAvailability
// (useImageStudioWorkbenchViewModel.js). Block reasons render as the
// disabled Generate button's tooltip, never as helper copy.
export const NO_SOURCE_HELP_TEXT =
  "Select a character, clothing source, wardrobe, or location before generating.";
export const NO_CLOTHING_HELP_TEXT =
  "No clothing source selected. Crestfall will use the character's default clothing when available, otherwise simple generic SFW clothing.";
export const CUSTOM_SUBJECT_HELP_TEXT =
  "The custom Character guidance will be used as the complete SFW visual subject for this request.";
export function insufficientCoinsHelpText(coinCost, count = 1) {
  return `You need at least ${coinCost} coins to generate ${count === 1 ? "an image" : `${count} images`}.`;
}

function baseOptionFields() {
  return [
    { id: "wardrobe-theme", label: "Wardrobe theme", value: "AUTO", defaultValue: "AUTO", options: WARDROBE_THEME_OPTIONS },
    { id: "aspect-ratio", label: "Aspect ratio", value: "PORTRAIT_4_5", defaultValue: "PORTRAIT_4_5", options: ASPECT_RATIO_OPTIONS },
  ];
}

function baseRenderStyleRailProps() {
  return {
    value: "crestfall_fantasy_realistic",
    defaultValue: "crestfall_fantasy",
    activeLabel: "Crestfall Illustrative",
    options: [
      { value: "crestfall_fantasy", shortLabel: "Fantasy", mappedLabel: "Crestfall Fantasy", definition: "Painterly fantasy illustration with soft light and rich color.", index: 0, active: false },
      { value: "crestfall_anime_anime", shortLabel: "Anime", mappedLabel: "Crestfall Anime", definition: "Clean line work and flat shading in an anime style.", index: 1, active: false },
      { value: "crestfall_fantasy_realistic", shortLabel: "Illustrative", mappedLabel: "Crestfall Illustrative", definition: "Fantasy illustration with realistic proportions and detail.", index: 2, active: true },
      { value: "crestfall_fantasy_realism", shortLabel: "Heroic", mappedLabel: "Crestfall Heroic", definition: "Dramatic, polished fantasy realism built for hero shots.", index: 3, active: false },
      { value: "crestfall_realistic_fantasy", shortLabel: "Cinematic", mappedLabel: "Crestfall Cinematic", definition: "Photographic realism with fantasy lighting and mood.", index: 4, active: false },
      { value: "crestfall_realistic", shortLabel: "Realistic", mappedLabel: "Crestfall Realistic", definition: "Photographic realism with natural light and texture.", index: 5, active: false },
    ],
    onChange: noop,
  };
}

function baseVideoOptionFields() {
  return [
    { id: "duration", label: "Duration", value: "4", options: VIDEO_DURATION_OPTIONS },
    { id: "videoAspect", label: "Video aspect", value: "PORTRAIT", options: VIDEO_ASPECT_OPTIONS },
    { id: "motionStyle", label: "Motion style", value: "SUBTLE", options: VIDEO_MOTION_STYLE_OPTIONS },
  ];
}

const sharedCallbacks = {
  onChangeMode: noop,
  onChangeStage: noop,
  onSlotActivate: noop,
  onSlotClear: noop,
  onCustomChangeText: noop,
  onCustomBackToPresets: noop,
  onCustomSavePreset: noop,
  onChangePrompt: noop,
  onChangeNegativePrompt: noop,
  onChangeOption: noop,
  onChangeCount: noop,
  onOpenCameraPresetPicker: noop,
  onGenerate: noop,
  onChangeVideoOption: noop,
  onChangeVideoDirection: noop,
};

const sharedShape = {
  mode: "IMAGE",
  videoDisabled: true,
  videoSoonLabel: "Soon",
  stage: "GENERATE",
  negativePromptValue: "",
  renderStyleRailProps: baseRenderStyleRailProps(),
  optionFields: baseOptionFields(),
  countOptions: COUNT_OPTIONS,
  countValue: "2",
  generateCostLabel: "10",
  generationStatus: "idle",
  generationError: "",
  videoOptionFields: baseVideoOptionFields(),
  videoDirectionValue: "",
};

const defaultFixture = {
  id: "default",
  label: "Default",
  props: {
    ...sharedCallbacks,
    ...sharedShape,
    slots: {
      character: { selection: { title: "Vesper Ash", subtitle: "Character", imageSrc: "/assets/covers/crestfall-ballerina-cover.png" }, isCustomMode: false, customText: "" },
      pose: { selection: { title: "Half-Turn, Cloak Drawn Back", subtitle: "Pose" }, isCustomMode: false, customText: "" },
      location: { selection: { title: "Harborfront at Dusk", subtitle: "Location" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    canGenerate: true,
    generationHelpText: NO_CLOTHING_HELP_TEXT,
  },
};

const emptySlotsFixture = {
  id: "emptySlots",
  label: "Empty slots",
  props: {
    ...sharedCallbacks,
    ...sharedShape,
    slots: {},
    promptValue: "",
    canGenerate: false,
    generationHelpText: NO_SOURCE_HELP_TEXT,
  },
};

const insufficientCoinsFixture = {
  id: "insufficientCoins",
  label: "Insufficient coins",
  props: {
    ...sharedCallbacks,
    ...sharedShape,
    slots: {
      character: { selection: { title: "Vesper Ash", subtitle: "Character", imageSrc: "/assets/covers/crestfall-ballerina-cover.png" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    countValue: "4",
    generateCostLabel: "20",
    canGenerate: false,
    generationHelpText: insufficientCoinsHelpText("20", 4),
  },
};

const customIngredientFixture = {
  id: "customIngredient",
  label: "Custom ingredient",
  props: {
    ...sharedCallbacks,
    ...sharedShape,
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
      location: { selection: { title: "Harborfront at Dusk", subtitle: "Location", imageSrc: "/assets/covers/crestfall-painting-cover.png" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    canGenerate: true,
    generationHelpText: CUSTOM_SUBJECT_HELP_TEXT,
  },
};

// Remix fixtures (contract 2.1.0, session 4). Mention handles bind to
// slot position; the limit line and the cost label are pre-computed
// by the caller (here: a six-character limit and a count of 2 at the
// proposed per-image cost).
const REMIX_REFERENCES = [
  { slotId: "remixCharacter1", position: 1, mention: "@img1", selection: { title: "Vesper Ash", subtitle: "Character", imageSrc: "/assets/covers/crestfall-ballerina-cover.png" } },
  { slotId: "remixCharacter2", position: 2, mention: "@img2", selection: { title: "Ilse of the Reeds", subtitle: "Character", imageSrc: "/assets/covers/crestfall-painting-cover.png" } },
  { slotId: "remixCharacter3", position: 3, mention: "@img3", selection: { title: "Custom", subtitle: "A tall knight in white plate with a braided crest", imageSrc: "" } },
];

const REMIX_LOCATION = {
  slotId: "remixLocation1",
  mention: "@location",
  selection: { title: "Throne Chamber", subtitle: "Location", imageSrc: "/assets/covers/crestfall-painting-cover.png" },
};

function baseRemixProps(overrides = {}) {
  const references = overrides.references || REMIX_REFERENCES;
  const location = overrides.location === undefined ? REMIX_LOCATION : overrides.location;
  return {
    references,
    canAddCharacter: references.length < 6,
    addLimitLabel: "Up to 6 characters",
    location,
    onAddCharacter: noop,
    onChangeCharacter: noop,
    onRemoveCharacter: noop,
    onSelectLocation: noop,
    onClearLocation: noop,
    promptValue:
      "@img1 relaxes on the throne while @img2 stands guard at her side and @img3 waits on the steps of @location, all looking to the viewer.",
    onChangePrompt: noop,
    mentionOptions: [
      ...references.map((reference) => ({
        mention: reference.mention,
        title: reference.selection.title,
        imageSrc: reference.selection.imageSrc,
      })),
      ...(location?.selection
        ? [{ mention: location.mention, title: location.selection.title, imageSrc: location.selection.imageSrc }]
        : []),
    ],
    countOptions: REMIX_COUNT_OPTIONS,
    countValue: "1",
    onChangeCount: noop,
    generateCostLabel: "20",
    canGenerate: true,
    generationHelpText: "",
    available: false,
    onGenerate: null,
    ...overrides,
  };
}

const remixStageFixture = {
  id: "remixStage",
  label: "Remix stage",
  props: {
    ...sharedCallbacks,
    ...sharedShape,
    stage: "REMIX",
    slots: {},
    promptValue: "",
    canGenerate: false,
    generationHelpText: "",
    remix: baseRemixProps(),
  },
};

const remixFullFixture = {
  id: "remixFull",
  label: "Remix at the limit",
  props: {
    ...sharedCallbacks,
    ...sharedShape,
    stage: "REMIX",
    slots: {},
    promptValue: "",
    canGenerate: false,
    generationHelpText: "",
    remix: baseRemixProps({
      references: Array.from({ length: 6 }, (_, index) => ({
        slotId: `remixCharacter${index + 1}`,
        position: index + 1,
        mention: `@img${index + 1}`,
        selection: {
          title: REMIX_REFERENCES[index % 2].selection.title,
          subtitle: "Character",
          imageSrc: REMIX_REFERENCES[index % 2].selection.imageSrc,
        },
      })),
      location: { ...REMIX_LOCATION, selection: null },
    }),
  },
};

const videoModeFixture = {
  id: "videoMode",
  label: "Video mode",
  props: {
    ...sharedCallbacks,
    ...sharedShape,
    mode: "VIDEO",
    videoDisabled: false,
    slots: {
      character: { selection: { title: "Vesper Ash", subtitle: "Character", imageSrc: "/assets/covers/crestfall-ballerina-cover.png" }, isCustomMode: false, customText: "" },
      location: { selection: { title: "Harborfront at Dusk", subtitle: "Location", imageSrc: "/assets/covers/crestfall-painting-cover.png" }, isCustomMode: false, customText: "" },
    },
    promptValue: "A quiet moment before the storm breaks over the harbor.",
    canGenerate: false,
    generationHelpText: "",
    videoDirectionValue: "Slow push toward the harbor as lamps flicker on, one by one.",
  },
};

const longestContentFixture = {
  id: "longestContent",
  label: "Longest content",
  props: {
    ...sharedCallbacks,
    ...sharedShape,
    slots: {
      character: {
        selection: {
          title: "Vesper Ash, the Lantern-Keeper of the Vermillion Coast, Third Cycle Portrait Study",
          subtitle: "Character",
        },
        isCustomMode: false,
        customText: "",
      },
      pose: {
        selection: null,
        isCustomMode: true,
        customText:
          "A deliberately long custom guidance string written to stress the textarea's wrapping behavior across many lines, describing a half-turned stance with one hand raised toward a lantern that has not yet been lit, right up against the field's practical limits so the layout is exercised honestly rather than guessed at from a short fixture.",
      },
      outfit: {
        selection: {
          title: "The Long Coat of the Coldwater Vigil, Weathered Third Edition",
          subtitle: "Outfit",
        },
        isCustomMode: false,
        customText: "",
      },
      location: {
        selection: { title: "Harbor at Dusk, an Unassigned Reference Kept for Later Palette Matching", subtitle: "Location" },
        isCustomMode: false,
        customText: "",
      },
      preset: { selection: { title: "Crestfall Realistic, High Detail", subtitle: "Preset" }, isCustomMode: false, customText: "" },
    },
    promptValue:
      "A deliberately long prompt written to stress the field's wrapping behavior across many lines, describing a quiet harbor moment before a storm breaks, lanterns swaying, gulls scattering ahead of the first gust, and a figure standing perfectly still at the edge of the dock, right up against the field's practical limits so the layout is exercised honestly rather than guessed at from a short fixture.",
    negativePromptValue: "blurry, low detail, extra limbs, warped hands, oversaturated color",
    optionFields: baseOptionFields().map((field) => ({
      ...field,
      value: field.options[field.options.length - 1].value,
    })),
    countValue: "4",
    generateCostLabel: "20",
    canGenerate: true,
    generationHelpText: "",
  },
};

export const kitImageCreatorPanelFixtures = [
  defaultFixture,
  emptySlotsFixture,
  insufficientCoinsFixture,
  customIngredientFixture,
  remixStageFixture,
  remixFullFixture,
  videoModeFixture,
  longestContentFixture,
];

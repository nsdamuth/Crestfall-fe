import {
  MapPin,
  Shirt,
  Sparkles,
  Theater,
  User,
  Users,
} from "lucide-react";

import { customIngredientEditorPresetFixture } from "../custom-ingredient-editor/CustomIngredientEditor.fixtures";
import {
  ingredientSlotCustomFixture,
  ingredientSlotOptionalEmptyFixture,
  ingredientSlotRequiredEmptyFixture,
  ingredientSlotSelectedFixture,
} from "../ingredient-slot/IngredientSlot.fixtures";
import { videoToolsCinematicFixture } from "../video-tools-panel/VideoToolsPanel.fixtures";

const noop = () => {};

const modeOptions = [
  { id: "IMAGE", label: "Image", iconKind: "image" },
  { id: "VIDEO", label: "Video", iconKind: "video" },
];

const imageOptionFields = [
  {
    id: "render-style",
    label: "Render Style",
    value: "crestfall_fantasy",
    options: [
      { value: "auto", label: "Auto / Character Default" },
      { value: "crestfall_fantasy", label: "Crestfall Fantasy" },
      { value: "crestfall_realistic", label: "Crestfall Realistic" },
    ],
    onChange: noop,
  },
  {
    id: "camera-preset",
    label: "Camera / Framing",
    value: "THREE_QUARTER",
    options: [
      { value: "AUTO", label: "Auto / No Camera Filter" },
      { value: "THREE_QUARTER", label: "Three-Quarter Body" },
      { value: "FULL_BODY", label: "Full Body" },
    ],
    onChange: noop,
  },
  {
    id: "wardrobe-theme",
    label: "Wardrobe Theme",
    value: "FORMAL",
    options: [
      { value: "AUTO", label: "Auto / Wardrobe Default" },
      { value: "FORMAL", label: "Formal" },
      { value: "COMBAT", label: "Combat" },
    ],
    onChange: noop,
  },
  {
    id: "aspect-ratio",
    label: "Aspect Ratio",
    value: "PORTRAIT_4_5",
    options: [
      { value: "PORTRAIT_4_5", label: "Portrait 4:5" },
      { value: "LANDSCAPE_16_9", label: "16:9" },
      { value: "SQUARE_1_1", label: "1:1" },
    ],
    onChange: noop,
  },
  {
    id: "image-count",
    label: "Output Count",
    value: "1",
    options: [
      { value: "1", label: "1 image" },
      { value: "2", label: "2 images" },
      { value: "4", label: "4 images" },
    ],
    onChange: noop,
  },
];

const ingredientSlotItems = [
  {
    id: "character",
    viewProps: {
      ...ingredientSlotRequiredEmptyFixture,
      SlotIcon: Users,
    },
  },
  {
    id: "playerCharacter",
    viewProps: {
      ...ingredientSlotOptionalEmptyFixture,
      label: "Player Character",
      SlotIcon: User,
      clearLabel: "Clear Player Character",
    },
  },
  {
    id: "pose",
    viewProps: {
      ...ingredientSlotCustomFixture,
      SlotIcon: Theater,
    },
  },
  {
    id: "outfit",
    viewProps: {
      ...ingredientSlotSelectedFixture,
      SlotIcon: Shirt,
    },
  },
  {
    id: "location",
    viewProps: {
      ...ingredientSlotOptionalEmptyFixture,
      SlotIcon: MapPin,
    },
  },
  {
    id: "preset",
    viewProps: {
      ...ingredientSlotOptionalEmptyFixture,
      label: "Rendering Preset",
      SlotIcon: Sparkles,
      clearLabel: "Clear Rendering Preset",
    },
  },
];

const baseFixture = {
  modeOptions,
  mode: "IMAGE",
  composerTitle: "Build an Image",
  ingredientSlotItems,
  customEditorItems: [],
  videoToolsProps: null,
  promptValue:
    "A cinematic dark-fantasy portrait in the moonlit upper gallery.",
  negativePromptValue: "low detail, distorted hands, flat lighting",
  inheritedNegativePromptItems: [
    {
      id: "character",
      label: "Kessa Cindervell",
      sourceLabel: "Character",
      text: "beard, modern clothing",
    },
    {
      id: "location",
      label: "Brasswhisker Workshop",
      sourceLabel: "Location",
      text: "daylight, sterile white room",
    },
  ],
  canGenerateImage: true,
  generationHelpText: "",
  generationError: "",
  imageOptionFields,
  coinBalanceLabel: "45",
  coinCostLabel: "5",
  showInsufficientCoins: false,
  coinError: "",
  onChangeMode: noop,
  onChangePrompt: noop,
  onChangeNegativePrompt: noop,
  onGenerateImage: noop,
};

export const imageStudioComposerDefaultFixture = {
  ...baseFixture,
};

export const imageStudioComposerUnavailableFixture = {
  ...baseFixture,
  canGenerateImage: false,
  generationHelpText:
    "Select a Character or Player Character before generating an image.",
  coinBalanceLabel: "2",
  showInsufficientCoins: true,
};

export const imageStudioComposerCustomFixture = {
  ...baseFixture,
  customEditorItems: [
    {
      id: "pose",
      viewProps: customIngredientEditorPresetFixture,
    },
  ],
};

export const imageStudioComposerVideoFixture = {
  ...baseFixture,
  mode: "VIDEO",
  composerTitle: "Build a Video",
  videoToolsProps: videoToolsCinematicFixture,
};

export const imageStudioComposerCoinLoadingFixture = {
  ...baseFixture,
  canGenerateImage: false,
  coinBalanceLabel: "Loading...",
  generationHelpText: "Checking Studio coin balance...",
};

export const imageStudioComposerErrorFixture = {
  ...baseFixture,
  canGenerateImage: false,
  generationError:
    "The image-generation request could not be started. Review the selected ingredients and try again.",
  coinError: "Studio coin balance could not be loaded.",
};

export const imageStudioComposerLongContentFixture = {
  ...baseFixture,
  promptValue:
    "A wide atmospheric scene showing an exhausted archivist crossing the storm-dark upper gallery while silver lamps ignite behind them, formal clothing catching the wind, distant machinery visible through fractured windows, and multiple layers of depth preserved across the composition.",
  negativePromptValue:
    "flat perspective, unreadable architecture, duplicate figures, stiff clothing, incorrect lighting direction, low-detail background, muddy color separation",
  coinBalanceLabel: "1250",
};

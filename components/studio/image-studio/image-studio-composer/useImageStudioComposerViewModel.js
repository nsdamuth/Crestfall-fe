import { getCustomIngredientEditorViewProps } from "../custom-ingredient-editor/useCustomIngredientEditorViewModel";
import { getIngredientSlotViewProps } from "../ingredient-slot/useIngredientSlotViewModel";
import { getVideoToolsPanelViewProps } from "../video-tools-panel/useVideoToolsPanelViewModel";
import {
  aspectRatioOptions,
  cameraPresetOptions,
  imageCountOptions,
  ingredientSlots,
  renderStyleOptions,
  wardrobeThemeOptions,
} from "../imageStudioData";

function normalizeOption(option, index, prefix) {
  return {
    value: String(option?.value || `${prefix}-${index + 1}`),
    label: String(option?.label || `Option ${index + 1}`),
  };
}

function normalizeOptions(options, prefix) {
  return Array.isArray(options)
    ? options.map((option, index) => normalizeOption(option, index, prefix))
    : [];
}

const MODE_OPTIONS = Object.freeze([
  Object.freeze({ id: "IMAGE", label: "Image", iconKind: "image" }),
  Object.freeze({ id: "VIDEO", label: "Video", iconKind: "video" }),
]);

const RENDER_STYLE_OPTIONS = normalizeOptions(renderStyleOptions, "render-style");
const CAMERA_PRESET_OPTIONS = normalizeOptions(cameraPresetOptions, "camera");
const WARDROBE_THEME_OPTIONS = normalizeOptions(wardrobeThemeOptions, "wardrobe");
const ASPECT_RATIO_OPTIONS = normalizeOptions(aspectRatioOptions, "aspect-ratio");
const IMAGE_COUNT_OPTIONS = normalizeOptions(imageCountOptions, "image-count");

export function getImageStudioComposerViewProps({
  mode = "IMAGE",
  setMode = null,
  selectedIngredients = {},
  onOpenIngredient = null,
  onClearIngredient = null,
  customIngredientPrompts = {},
  onUpdateCustomIngredientPrompt = null,
  onSaveCustomIngredient = null,
  prompt = "",
  setPrompt = null,
  renderStyle = "",
  setRenderStyle = null,
  cameraPreset = "",
  setCameraPreset = null,
  aspectRatio = "",
  setAspectRatio = null,
  imageCount = "",
  setImageCount = null,
  negativePrompt = "",
  setNegativePrompt = null,
  videoDuration = "",
  setVideoDuration = null,
  videoAspectRatio = "",
  setVideoAspectRatio = null,
  videoMotionStyle = "",
  setVideoMotionStyle = null,
  onGenerateImage = null,
  canGenerateImage = false,
  generationError = "",
  generationHelpText = "",
  coinBalance = 0,
  coinCost = 5,
  coinStatus = "idle",
  coinError = "",
  hasEnoughCoins = false,
  wardrobeTheme = "",
  setWardrobeTheme = null,
} = {}) {
  const normalizedMode = mode === "VIDEO" ? "VIDEO" : "IMAGE";
  const ingredientValues =
    selectedIngredients && typeof selectedIngredients === "object"
      ? selectedIngredients
      : {};
  const promptValues =
    customIngredientPrompts && typeof customIngredientPrompts === "object"
      ? customIngredientPrompts
      : {};

  const ingredientSlotItems = ingredientSlots.map((slot) => ({
    id: String(slot.id),
    viewProps: getIngredientSlotViewProps({
      slot,
      value: ingredientValues[slot.id] || null,
      onOpen: () => onOpenIngredient?.(slot),
      onClear: () => onClearIngredient?.(slot.id),
    }),
  }));

  const customEditorItems = ingredientSlots
    .filter((slot) => Boolean(ingredientValues[slot.id]?.custom))
    .map((slot) => ({
      id: String(slot.id),
      viewProps: getCustomIngredientEditorViewProps({
        slot,
        value: ingredientValues[slot.id],
        promptValue: promptValues[slot.id] || "",
        onPromptChange: (nextValue) =>
          onUpdateCustomIngredientPrompt?.(slot.id, nextValue),
        onBackToPresets: () => onOpenIngredient?.(slot),
        onClear: () => onClearIngredient?.(slot.id),
        onSavePreset: () => onSaveCustomIngredient?.(slot),
        canSavePreset: Boolean(slot.allowCreatePreset),
      }),
    }));

  return {
    modeOptions: MODE_OPTIONS,
    mode: normalizedMode,
    composerTitle:
      normalizedMode === "VIDEO" ? "Build a Video" : "Build an Image",
    ingredientSlotItems,
    customEditorItems,
    videoToolsProps:
      normalizedMode === "VIDEO"
        ? getVideoToolsPanelViewProps({
            videoDuration,
            setVideoDuration,
            videoAspectRatio,
            setVideoAspectRatio,
            videoMotionStyle,
            setVideoMotionStyle,
            prompt,
            setPrompt,
          })
        : null,
    promptValue: String(prompt || ""),
    negativePromptValue: String(negativePrompt || ""),
    canGenerateImage: Boolean(canGenerateImage),
    generationHelpText: String(generationHelpText || ""),
    generationError: String(generationError || ""),
    imageOptionFields: [
      {
        id: "render-style",
        label: "Render Style",
        value: String(renderStyle || ""),
        options: RENDER_STYLE_OPTIONS,
        onChange: (nextValue) => setRenderStyle?.(nextValue),
      },
      {
        id: "camera-preset",
        label: "Camera / Framing",
        value: String(cameraPreset || ""),
        options: CAMERA_PRESET_OPTIONS,
        onChange: (nextValue) => setCameraPreset?.(nextValue),
      },
      {
        id: "wardrobe-theme",
        label: "Wardrobe Theme",
        value: String(wardrobeTheme || ""),
        options: WARDROBE_THEME_OPTIONS,
        onChange: (nextValue) => setWardrobeTheme?.(nextValue),
      },
      {
        id: "aspect-ratio",
        label: "Aspect Ratio",
        value: String(aspectRatio || ""),
        options: ASPECT_RATIO_OPTIONS,
        onChange: (nextValue) => setAspectRatio?.(nextValue),
      },
      {
        id: "image-count",
        label: "Output Count",
        value: String(imageCount || ""),
        options: IMAGE_COUNT_OPTIONS,
        onChange: (nextValue) => setImageCount?.(nextValue),
      },
    ],
    coinBalanceLabel:
      coinStatus === "loading" ? "Loading..." : String(coinBalance ?? 0),
    coinCostLabel: String(coinCost ?? 5),
    showInsufficientCoins:
      coinStatus !== "loading" && !Boolean(hasEnoughCoins),
    coinError: String(coinError || ""),
    onChangeMode: (nextMode) => setMode?.(nextMode),
    onChangePrompt: (nextValue) => setPrompt?.(nextValue),
    onChangeNegativePrompt: (nextValue) => setNegativePrompt?.(nextValue),
    onGenerateImage: () => onGenerateImage?.(),
  };
}

export function useImageStudioComposerViewModel(props = {}) {
  return getImageStudioComposerViewProps(props);
}

"use client";

// Thin pass-through ViewModel, matching kit-batch practice: the kit
// piece is fixture-fed and owns no data. Generation availability,
// coin state, and every option list are computed by the caller
// (fixture logic in phase 1, the Images page mockup from phase 3);
// this hook only normalizes display-ready props.
export function useKitImageCreatorPanelViewModel({
  mode = "IMAGE",
  onChangeMode = null,
  slots = {},
  onSlotActivate = null,
  onSlotClear = null,
  onCustomChangeText = null,
  onCustomBackToPresets = null,
  onCustomSavePreset = null,
  promptValue = "",
  onChangePrompt = null,
  negativePromptValue = "",
  onChangeNegativePrompt = null,
  renderStyleRailProps = null,
  optionFields = [],
  onChangeOption = null,
  advancedTuningProps = null,
  coinBalanceLabel = "0",
  coinCostLabel = "5",
  showInsufficientCoins = false,
  canGenerate = false,
  generationHelpText = "",
  generationStatus = "idle",
  generationError = "",
  cameraPresetLabel = "Auto / No Camera Filter",
  cameraPresetDescription = "",
  onOpenCameraPresetPicker = null,
  showSceneryOnlyHelper = false,
  sceneryOnlyHelperEnabled = true,
  onChangeSceneryOnlyHelper = null,
  onGenerate = null,
  videoOptionFields = [],
  onChangeVideoOption = null,
  videoDirectionValue = "",
  onChangeVideoDirection = null,
} = {}) {
  return {
    mode: mode === "VIDEO" ? "VIDEO" : "IMAGE",
    onChangeMode,
    slots: slots && typeof slots === "object" ? slots : {},
    onSlotActivate,
    onSlotClear,
    onCustomChangeText,
    onCustomBackToPresets,
    onCustomSavePreset,
    promptValue: promptValue || "",
    onChangePrompt,
    negativePromptValue: negativePromptValue || "",
    onChangeNegativePrompt,
    renderStyleRailProps:
      renderStyleRailProps && typeof renderStyleRailProps === "object"
        ? renderStyleRailProps
        : null,
    optionFields: Array.isArray(optionFields) ? optionFields : [],
    onChangeOption,
    advancedTuningProps:
      advancedTuningProps && typeof advancedTuningProps === "object"
        ? advancedTuningProps
        : null,
    coinBalanceLabel: String(coinBalanceLabel ?? "0"),
    coinCostLabel: String(coinCostLabel ?? "5"),
    showInsufficientCoins: Boolean(showInsufficientCoins),
    canGenerate: Boolean(canGenerate),
    generationHelpText: generationHelpText || "",
    generationStatus: String(generationStatus || "idle"),
    generationError: generationError || "",
    cameraPresetLabel: cameraPresetLabel || "Auto / No Camera Filter",
    cameraPresetDescription: cameraPresetDescription || "",
    onOpenCameraPresetPicker,
    showSceneryOnlyHelper: Boolean(showSceneryOnlyHelper),
    sceneryOnlyHelperEnabled: Boolean(sceneryOnlyHelperEnabled),
    onChangeSceneryOnlyHelper,
    onGenerate,
    videoOptionFields: Array.isArray(videoOptionFields) ? videoOptionFields : [],
    onChangeVideoOption,
    videoDirectionValue: videoDirectionValue || "",
    onChangeVideoDirection,
  };
}

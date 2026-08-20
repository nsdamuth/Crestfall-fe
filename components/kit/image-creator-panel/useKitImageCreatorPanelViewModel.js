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
  sceneryHelper = null,
  onChangeSceneryOnlyHelper = null,
  promptValue = "",
  onChangePrompt = null,
  negativePromptValue = "",
  onChangeNegativePrompt = null,
  optionFields = [],
  onChangeOption = null,
  coinBalanceLabel = "0",
  coinCostLabel = "5",
  showInsufficientCoins = false,
  canGenerate = false,
  generationHelpText = "",
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
    sceneryHelper:
      sceneryHelper && typeof sceneryHelper === "object"
        ? {
            visible: Boolean(sceneryHelper.visible),
            enabled: Boolean(sceneryHelper.enabled),
            title: String(sceneryHelper.title || ""),
            description: String(sceneryHelper.description || ""),
          }
        : null,
    onChangeSceneryOnlyHelper,
    promptValue: promptValue || "",
    onChangePrompt,
    negativePromptValue: negativePromptValue || "",
    onChangeNegativePrompt,
    optionFields: Array.isArray(optionFields) ? optionFields : [],
    onChangeOption,
    coinBalanceLabel: String(coinBalanceLabel ?? "0"),
    coinCostLabel: String(coinCostLabel ?? "5"),
    showInsufficientCoins: Boolean(showInsufficientCoins),
    canGenerate: Boolean(canGenerate),
    generationHelpText: generationHelpText || "",
    onGenerate,
    videoOptionFields: Array.isArray(videoOptionFields) ? videoOptionFields : [],
    onChangeVideoOption,
    videoDirectionValue: videoDirectionValue || "",
    onChangeVideoDirection,
  };
}

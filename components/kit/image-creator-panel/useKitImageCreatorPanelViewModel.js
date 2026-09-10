"use client";

// Thin pass-through ViewModel, matching kit-batch practice: the kit
// piece is fixture-fed and owns no data. Generation availability,
// the coin cost, and every option list are computed by the caller
// (fixture logic, or the Media Studio page's adapter); this hook only
// normalizes display-ready props. Contract 2.1.0 (10 Sep 2026): the
// nested `remix` object passes through untouched; the View treats a
// null `remix` as the session 1 stub, so dropping it here is the
// regression the live adapter diagnostics guard against. Contract
// 2.3.0 (10 Sep 2026): the nested `video` object passes through the
// same way; null keeps the 2.2.0 video block. Contract 2.4.0 keeps
// Director cue timing inside that same nested object unchanged here.
export function useKitImageCreatorPanelViewModel({
  mode = "IMAGE",
  onChangeMode = null,
  videoDisabled = true,
  videoSoonLabel = "Soon",
  stage = "GENERATE",
  onChangeStage = null,
  remix = null,
  video = null,
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
  countOptions = [],
  countValue = "",
  onChangeCount = null,
  generateCostLabel = "",
  canGenerate = false,
  generationHelpText = "",
  generationStatus = "idle",
  generationError = "",
  cameraPresetLabel = "Auto / No Camera Filter",
  cameraPresetDescription = "",
  cameraPresetChanged = false,
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
    videoDisabled: Boolean(videoDisabled),
    videoSoonLabel: String(videoSoonLabel ?? "Soon"),
    stage: stage === "REMIX" ? "REMIX" : "GENERATE",
    onChangeStage,
    remix: remix && typeof remix === "object" ? remix : null,
    video: video && typeof video === "object" ? video : null,
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
    countOptions: Array.isArray(countOptions) ? countOptions : [],
    countValue: String(countValue ?? ""),
    onChangeCount,
    generateCostLabel: String(generateCostLabel ?? ""),
    canGenerate: Boolean(canGenerate),
    generationHelpText: generationHelpText || "",
    generationStatus: String(generationStatus || "idle"),
    generationError: generationError || "",
    cameraPresetLabel: cameraPresetLabel || "Auto / No Camera Filter",
    cameraPresetDescription: cameraPresetDescription || "",
    cameraPresetChanged: Boolean(cameraPresetChanged),
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

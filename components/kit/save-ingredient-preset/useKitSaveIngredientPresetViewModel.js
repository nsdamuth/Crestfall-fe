"use client";

// Thin pass-through ViewModel: fixture-fed, owns no data.
export function useKitSaveIngredientPresetViewModel({
  presetTypeLabel = "Ingredient Preset",
  introText = "",
  helperText = "",
  nameValue = "",
  onChangeName = null,
  descriptionValue = "",
  onChangeDescription = null,
  promptValue = "",
  onChangePrompt = null,
  tagsValue = "",
  onChangeTags = null,
  isSaving = false,
  canSave = false,
  onSavePreset = null,
  onUseOnce = null,
  onClose = null,
} = {}) {
  return {
    presetTypeLabel: presetTypeLabel || "Ingredient Preset",
    introText: introText || "",
    helperText: helperText || "",
    nameValue: nameValue || "",
    onChangeName,
    descriptionValue: descriptionValue || "",
    onChangeDescription,
    promptValue: promptValue || "",
    onChangePrompt,
    tagsValue: tagsValue || "",
    onChangeTags,
    isSaving: Boolean(isSaving),
    canSave: Boolean(canSave),
    onSavePreset,
    onUseOnce,
    onClose,
  };
}

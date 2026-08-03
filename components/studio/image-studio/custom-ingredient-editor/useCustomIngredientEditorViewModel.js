"use client";

export function getCustomIngredientEditorViewProps({
  slot = {},
  value = null,
  promptValue = "",
  onPromptChange = null,
  onBackToPresets = null,
  onClear = null,
  onSavePreset = null,
  canSavePreset = false,
} = {}) {
  const ingredientLabel = slot?.label || "Ingredient";
  const showSavePresetAction = Boolean(canSavePreset);

  function changePrompt(nextValue) {
    onPromptChange?.(String(nextValue || ""));
  }

  function backToPresets() {
    onBackToPresets?.();
  }

  function clearCustomIngredient() {
    onClear?.();
  }

  function savePreset() {
    if (!showSavePresetAction) return;
    onSavePreset?.();
  }

  return {
    open: Boolean(value?.custom),
    ingredientLabel,
    introText: showSavePresetAction
      ? "Write a custom prompt fragment for this ingredient. It can be used once in this request, or saved later as a reusable preset."
      : "Write a custom prompt fragment for this ingredient. It will be used once in this request.",
    promptValue: String(promptValue || ""),
    promptPlaceholder: `Describe the custom ${ingredientLabel.toLowerCase()} guidance...`,
    showSavePresetAction,
    onChangePrompt: changePrompt,
    onBackToPresets: backToPresets,
    onClear: clearCustomIngredient,
    onSavePreset: savePreset,
  };
}

export function useCustomIngredientEditorViewModel(props = {}) {
  return getCustomIngredientEditorViewProps(props);
}

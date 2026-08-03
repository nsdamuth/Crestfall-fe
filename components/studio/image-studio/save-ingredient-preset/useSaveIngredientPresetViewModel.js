"use client";

import { useState } from "react";

const PRESET_TYPE_LABEL_BY_SLOT_ID = Object.freeze({
  pose: "Pose",
  outfit: "Outfit Preset",
  location: "Location / Scene",
  preset: "Rendering Preset",
  character: "Character Ingredient",
  playerCharacter: "Player Character Ingredient",
});

function getPresetTypeLabel(slot) {
  return (
    PRESET_TYPE_LABEL_BY_SLOT_ID[slot?.id] ||
    `${slot?.label || "Ingredient"} Preset`
  );
}

function getInitialName(slot) {
  return slot ? `Custom ${slot.label}` : "Custom Preset";
}

export function useSaveIngredientPresetViewModel({
  slot = null,
  promptValue = "",
  onPromptChange = null,
  onSave = null,
  onClose = null,
} = {}) {
  const [name, setName] = useState(() => getInitialName(slot));
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const normalizedPromptValue = String(promptValue || "");
  const isSaving = saveStatus === "saving";
  const canSave = Boolean(name.trim() && normalizedPromptValue.trim());

  function closeModal() {
    if (isSaving) return;
    onClose?.();
  }

  function useOnce() {
    if (isSaving) return;
    onClose?.();
  }

  function changePrompt(nextValue) {
    onPromptChange?.(String(nextValue || ""));
  }

  async function savePreset() {
    if (isSaving || !canSave || typeof onSave !== "function") return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        tags,
        promptValue: normalizedPromptValue.trim(),
      });

      onClose?.();
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || "Preset could not be saved.");
    }
  }

  return {
    open: Boolean(slot),
    presetTypeLabel: getPresetTypeLabel(slot),
    introText:
      "Save this custom guidance as a private reusable draft. You can return to it later from My Creations or select it again from the Image Studio picker.",
    helperText:
      "Saving creates a private SFW draft and selects it for the current Image Studio request. Using it once does not create a saved asset.",
    nameValue: name,
    descriptionValue: description,
    promptValue: normalizedPromptValue,
    tagsValue: tags,
    isSaving,
    canSave,
    saveMessage,
    saveMessageTone: saveStatus === "error" ? "error" : "info",
    onChangeName: setName,
    onChangeDescription: setDescription,
    onChangePrompt: changePrompt,
    onChangeTags: setTags,
    onSavePreset: savePreset,
    onUseOnce: useOnce,
    onClose: closeModal,
  };
}

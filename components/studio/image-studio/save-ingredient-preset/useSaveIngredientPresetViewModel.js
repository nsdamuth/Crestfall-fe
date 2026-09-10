"use client";

import { useState } from "react";

// Legacy per-slot titles, used only when the caller passes no
// assetLabel (the /studio/image-studio page). Media Studio passes the
// tile word (Pose, Outfit, Location, Preset, Character).
const PRESET_TYPE_LABEL_BY_SLOT_ID = Object.freeze({
  pose: "Pose",
  outfit: "Outfit Preset",
  location: "Location / Scene",
  preset: "Rendering Preset",
  character: "Character Ingredient",
  playerCharacter: "Player Character Ingredient",
});

function getPresetTypeLabel(slot, assetLabel) {
  if (assetLabel) return assetLabel;
  return (
    PRESET_TYPE_LABEL_BY_SLOT_ID[slot?.id] ||
    `${slot?.label || "Ingredient"} Preset`
  );
}

function getInitialName(label) {
  return label ? `Custom ${label}` : "Custom Preset";
}

function getIntroText(label, saveAvailable) {
  const lower = String(label || "asset").toLowerCase();
  return saveAvailable
    ? `Describe the ${lower} in your own words. Use it once, or save it as a preset to reuse later.`
    : `Describe the ${lower} in your own words and use it once.`;
}

export function useSaveIngredientPresetViewModel({
  slot = null,
  assetLabel = "",
  saveAvailable = true,
  promptValue = "",
  onPromptChange = null,
  onSave = null,
  onUseOnce = null,
  onClose = null,
} = {}) {
  const label = getPresetTypeLabel(slot, assetLabel);
  const initialName = getInitialName(label);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  // The prompt the modal opened with; typing past it is what makes
  // the form dirty, the prefilled name alone never does.
  const [initialPrompt] = useState(() => String(promptValue || ""));
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const normalizedPromptValue = String(promptValue || "");
  const isSaving = saveStatus === "saving";
  const canUseOnce = Boolean(normalizedPromptValue.trim());
  const canSave = Boolean(name.trim() && canUseOnce);
  const hasUnsavedChanges = Boolean(
    name !== initialName ||
      description ||
      tags ||
      normalizedPromptValue !== initialPrompt
  );

  function closeModal() {
    if (isSaving) return;
    onClose?.();
  }

  function useOnce() {
    if (isSaving || !canUseOnce) return;
    onUseOnce?.(slot);
    onClose?.();
  }

  function changePrompt(nextValue) {
    onPromptChange?.(String(nextValue || ""));
  }

  async function savePreset() {
    if (isSaving || !canSave || !saveAvailable || typeof onSave !== "function") {
      return;
    }

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
    presetTypeLabel: label,
    assetLabel: label,
    introText: getIntroText(label, saveAvailable),
    saveAvailable: Boolean(saveAvailable),
    nameValue: name,
    descriptionValue: description,
    promptValue: normalizedPromptValue,
    tagsValue: tags,
    isSaving,
    canSave,
    canUseOnce,
    hasUnsavedChanges,
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

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";
import {
  buildWardrobeCreationPayload,
  createEmptyWardrobeData,
  createEmptyWardrobeEntry,
  limitWardrobePromptValue,
  listToText,
  normalizeListText,
  normalizeWardrobeData,
  normalizeWardrobeEntry,
  WARDROBE_ENTRY_ROLE_OPTIONS,
  WARDROBE_FALLBACK_MODE_OPTIONS,
  WARDROBE_IMAGE_PROMPT_MAX_LENGTH,
  WARDROBE_NEGATIVE_PROMPT_MAX_LENGTH,
} from "@/components/studio/create/wardrobe/wardrobeUtils";
import { buildWardrobeBuilderTabs } from "./WardrobeBuilder.contract";

function cloneInitialData(initialData) {
  const source =
    initialData && typeof initialData === "object" ? initialData : {};
  const base = createEmptyWardrobeData();

  return normalizeWardrobeData({
    ...base,
    ...source,
    entries: Array.isArray(source.entries) ? [...source.entries] : [],
    selectionRules: {
      ...base.selectionRules,
      ...(source.selectionRules || {}),
    },
    promptGuidance: {
      ...base.promptGuidance,
      ...(source.promptGuidance || {}),
    },
    middleware_hints: {
      ...base.middleware_hints,
      ...(source.middleware_hints || {}),
    },
  });
}

function formatOptionLabel(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

function toSelectOptions(options = []) {
  return options.map((option) => {
    if (typeof option !== "string") return option;

    return {
      value: option,
      label: formatOptionLabel(option),
    };
  });
}

export function useWardrobeBuilderViewModel({
  initialTitle = "Untitled Wardrobe",
  initialDescription = "",
  initialData = null,
  createDraft = createCreationDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [title, setTitleState] = useState(initialTitle);
  const [description, setDescriptionState] = useState(initialDescription);
  const [data, setData] = useState(() => cloneInitialData(initialData));
  const [activeTab, setActiveTab] = useState("overview");
  const [activeEntryId, setActiveEntryId] = useState(null);
  const [activePickerEntryId, setActivePickerEntryId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [savedCreationId, setSavedCreationId] = useState(null);

  const wardrobeData = useMemo(() => normalizeWardrobeData(data), [data]);

  const activeEntry = useMemo(
    () =>
      activeEntryId
        ? wardrobeData.entries.find((entry) => entry.id === activeEntryId) || null
        : null,
    [activeEntryId, wardrobeData.entries]
  );

  const activePickerEntry = useMemo(
    () =>
      activePickerEntryId
        ? wardrobeData.entries.find(
            (entry) => entry.id === activePickerEntryId
          ) || null
        : null,
    [activePickerEntryId, wardrobeData.entries]
  );

  const entries = useMemo(
    () =>
      wardrobeData.entries.map((entry) => ({
        ...entry,
        contextTagsText: listToText(entry.contextTags),
      })),
    [wardrobeData.entries]
  );

  const viewActiveEntry = useMemo(
    () =>
      activeEntry
        ? {
            ...activeEntry,
            contextTagsText: listToText(activeEntry.contextTags),
          }
        : null,
    [activeEntry]
  );

  const tabs = useMemo(
    () => buildWardrobeBuilderTabs(activeTab),
    [activeTab]
  );

  const entryRoleOptions = useMemo(
    () => toSelectOptions(WARDROBE_ENTRY_ROLE_OPTIONS),
    []
  );
  const fallbackModeOptions = useMemo(
    () => toSelectOptions(WARDROBE_FALLBACK_MODE_OPTIONS),
    []
  );

  function markDirty() {
    setSaveStatus("idle");
    setSaveMessage("");
  }

  function setTitle(value) {
    setTitleState(value);
    markDirty();
  }

  function setDescription(value) {
    setDescriptionState(value);
    markDirty();
  }

  function updateDataField(field, value) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
    markDirty();
  }

  function updateSelectionRule(field, value) {
    setData((current) => ({
      ...current,
      selectionRules: {
        ...(current.selectionRules || {}),
        [field]: value,
      },
    }));
    markDirty();
  }

  function updatePromptGuidance(field, value) {
    setData((current) => ({
      ...current,
      promptGuidance: {
        ...(current.promptGuidance || {}),
        [field]: value,
      },
    }));
    markDirty();
  }

  function addEntry() {
    const entry = createEmptyWardrobeEntry();

    setData((current) => ({
      ...current,
      entries: [...(current.entries || []), entry],
    }));
    setActiveEntryId(entry.id);
    setActiveTab("entries");
    markDirty();
  }

  function updateEntry(entryId, updates) {
    setData((current) => ({
      ...current,
      entries: (current.entries || []).map((entry) =>
        entry.id === entryId
          ? normalizeWardrobeEntry({
              ...entry,
              ...updates,
            })
          : entry
      ),
    }));
    markDirty();
  }

  function updateEntryContextTags(entryId, contextTagsText) {
    updateEntry(entryId, {
      contextTags: normalizeListText(contextTagsText),
    });
  }

  function deleteEntry(entryId) {
    setData((current) => ({
      ...current,
      entries: (current.entries || []).filter((entry) => entry.id !== entryId),
    }));

    if (activeEntryId === entryId) {
      setActiveEntryId(null);
    }
    if (activePickerEntryId === entryId) {
      setActivePickerEntryId(null);
    }
    markDirty();
  }

  function openOutfitPicker(entryId) {
    setActivePickerEntryId(entryId);
  }

  function closeOutfitPicker() {
    setActivePickerEntryId(null);
  }

  function handleSelectOutfit(outfitSelection) {
    if (!activePickerEntryId) return;

    const pickerEntry = wardrobeData.entries.find(
      (entry) => entry.id === activePickerEntryId
    );

    updateEntry(activePickerEntryId, {
      ...outfitSelection,
      label:
        pickerEntry?.label ||
        outfitSelection?.outfitTitle ||
        "Untitled Outfit Entry",
    });
    setActivePickerEntryId(null);
  }

  function updateImagePrompt(value) {
    updateDataField(
      "image_prompt",
      limitWardrobePromptValue(value, WARDROBE_IMAGE_PROMPT_MAX_LENGTH)
    );
  }

  function updateNegativePrompt(value) {
    updateDataField(
      "negative_prompt",
      limitWardrobePromptValue(value, WARDROBE_NEGATIVE_PROMPT_MAX_LENGTH)
    );
  }

  async function handleSave() {
    if (saveStatus === "saving" || savedCreationId) return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = buildWardrobeCreationPayload({
        title,
        description,
        data: wardrobeData,
      });

      const response = await createDraft(
        payload,
        "Wardrobe could not be saved."
      );

      const creation = response?.data?.creation || response?.creation || null;

      if (!creation?.id) {
        throw new Error(
          "Wardrobe draft was saved, but no creation ID was returned."
        );
      }

      setSavedCreationId(creation.id);
      setSaveStatus("saved");
      setSaveMessage("Wardrobe saved. Opening the editor...");

      if (typeof onCreated === "function") {
        onCreated(creation);
      } else {
        router.replace(`/studio/my-creations/${creation.id}/edit`);
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || "Wardrobe could not be saved.");
    }
  }

  return {
    viewProps: {
      title,
      description,
      scope: wardrobeData.scope || "",
      tabs,
      activeTab,
      entries,
      activeEntryId,
      activeEntry: viewActiveEntry,
      selectionRules: wardrobeData.selectionRules || {},
      promptGuidance: wardrobeData.promptGuidance || {},
      imagePrompt: wardrobeData.image_prompt || "",
      negativePrompt: wardrobeData.negative_prompt || "",
      imagePromptMaxLength: WARDROBE_IMAGE_PROMPT_MAX_LENGTH,
      negativePromptMaxLength: WARDROBE_NEGATIVE_PROMPT_MAX_LENGTH,
      entryRoleOptions,
      fallbackModeOptions,
      saveStatus,
      saveMessage,
      savedCreationId,
      onTitleChange: setTitle,
      onDescriptionChange: setDescription,
      onScopeChange: (value) => updateDataField("scope", value),
      onSelectTab: setActiveTab,
      onSelectEntry: setActiveEntryId,
      onAddEntry: addEntry,
      onUpdateEntry: updateEntry,
      onUpdateEntryContextTags: updateEntryContextTags,
      onDeleteEntry: deleteEntry,
      onChooseOutfit: openOutfitPicker,
      onSelectionRuleChange: updateSelectionRule,
      onPromptGuidanceChange: updatePromptGuidance,
      onImagePromptChange: updateImagePrompt,
      onNegativePromptChange: updateNegativePrompt,
      onSave: handleSave,
    },
    applicationContentProps: {
      wardrobeData,
      activeEntry,
      activePickerEntry,
      updateDataField,
      updateSelectionRule,
      updatePromptGuidance,
      addEntry,
      updateEntry,
      deleteEntry,
      setActiveTab,
      setActiveEntryId,
      setTitle,
      setDescription,
      openOutfitPicker,
      closeOutfitPicker,
      handleSelectOutfit,
      handleSave,
    },
  };
}

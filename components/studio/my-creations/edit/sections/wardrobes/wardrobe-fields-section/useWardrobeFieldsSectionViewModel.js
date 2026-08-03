"use client";

import { useEffect, useMemo, useState } from "react";

import {
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

const SECTION_COPY = Object.freeze({
  overview: {
    eyebrow: "Wardrobe",
    title: "Wardrobe Identity",
    body: "Describe this wardrobe and which character, setting, or continuity use it supports.",
  },
  entries: {
    eyebrow: "Entries",
    title: "Outfit Entries",
    body: "Each entry points to an Outfit creation selected from your saved outfits.",
  },
  rules: {
    eyebrow: "Selection Rules",
    title: "Default Selection Behavior",
    body: "These rules prepare the future resolver for chat and image generation.",
  },
});

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

function buildViewEntry({
  entry,
  activeEntryId,
  setActiveEntryId,
  updateEntry,
  deleteEntry,
  openOutfitPicker,
}) {
  return {
    id: entry.id,
    isActive: activeEntryId === entry.id,
    labelValue: entry.label || "",
    labelDisplay: entry.label || "Untitled Outfit Entry",
    roleValue: entry.role || "DEFAULT",
    roleDisplay: formatOptionLabel(entry.role || "DEFAULT"),
    enabledChecked: entry.enabled !== false,
    enabledDisplay: entry.enabled !== false ? "Enabled" : "Disabled",
    priorityValue: String(entry.priority ?? 50),
    contextTagsText: listToText(entry.contextTags),
    notesValue: entry.notes || "",
    outfitCreationId: entry.outfitCreationId || "",
    outfitTitle: entry.outfitTitle || "Selected Outfit",
    outfitDescription: entry.outfitDescription || "No description.",
    outfitImageUrl: entry.outfitImageUrl || "",
    onSelect: () => setActiveEntryId(entry.id),
    onChangeLabel: (value) => updateEntry(entry.id, { label: value }),
    onChangeRole: (value) => updateEntry(entry.id, { role: value }),
    onChangePriority: (value) => updateEntry(entry.id, { priority: value }),
    onChangeContextTagsText: (value) =>
      updateEntry(entry.id, { contextTags: normalizeListText(value) }),
    onChangeNotes: (value) => updateEntry(entry.id, { notes: value }),
    onChangeEnabled: (value) => updateEntry(entry.id, { enabled: value }),
    onChooseOutfit: () => openOutfitPicker(entry.id),
    onDelete: () => deleteEntry(entry.id),
  };
}

export function useWardrobeFieldsSectionViewModel({
  section = "overview",
  form = {},
  updateField = null,
  updateDataField = null,
} = {}) {
  const wardrobeData = useMemo(
    () => normalizeWardrobeData(form?.data || {}),
    [form?.data]
  );
  const [activeEntryId, setActiveEntryId] = useState(
    wardrobeData.entries?.[0]?.id || null
  );
  const [activePickerEntryId, setActivePickerEntryId] = useState(null);

  useEffect(() => {
    if (!wardrobeData.entries.length) {
      if (activeEntryId !== null) setActiveEntryId(null);
      if (activePickerEntryId !== null) setActivePickerEntryId(null);
      return;
    }

    if (!wardrobeData.entries.some((entry) => entry.id === activeEntryId)) {
      setActiveEntryId(wardrobeData.entries[0].id);
    }

    if (
      activePickerEntryId &&
      !wardrobeData.entries.some((entry) => entry.id === activePickerEntryId)
    ) {
      setActivePickerEntryId(null);
    }
  }, [activeEntryId, activePickerEntryId, wardrobeData.entries]);

  const activeSection = SECTION_COPY[section] ? section : "overview";
  const sectionCopy = SECTION_COPY[activeSection];

  function updatePromptGuidance(field, value) {
    updateDataField?.("promptGuidance", {
      ...(wardrobeData.promptGuidance || {}),
      [field]: value,
    });
  }

  function updateSelectionRule(field, value) {
    updateDataField?.("selectionRules", {
      ...(wardrobeData.selectionRules || {}),
      [field]: value,
    });
  }

  function addEntry() {
    const entry = createEmptyWardrobeEntry();
    updateDataField?.("entries", [...wardrobeData.entries, entry]);
    setActiveEntryId(entry.id);
  }

  function updateEntry(entryId, updates) {
    updateDataField?.(
      "entries",
      wardrobeData.entries.map((entry) =>
        entry.id === entryId
          ? normalizeWardrobeEntry({
              ...entry,
              ...updates,
            })
          : entry
      )
    );
  }

  function deleteEntry(entryId) {
    const nextEntries = wardrobeData.entries.filter(
      (entry) => entry.id !== entryId
    );

    updateDataField?.("entries", nextEntries);

    if (activeEntryId === entryId) {
      setActiveEntryId(nextEntries[0]?.id || null);
    }

    if (activePickerEntryId === entryId) {
      setActivePickerEntryId(null);
    }
  }

  function openOutfitPicker(entryId) {
    setActivePickerEntryId(entryId);
  }

  function closeOutfitPicker() {
    setActivePickerEntryId(null);
  }

  function selectOutfit(outfitSelection) {
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

  const entries = wardrobeData.entries.map((entry) =>
    buildViewEntry({
      entry,
      activeEntryId,
      setActiveEntryId,
      updateEntry,
      deleteEntry,
      openOutfitPicker,
    })
  );
  const activeEntry =
    entries.find((entry) => entry.id === activeEntryId) || null;
  const activePickerEntry = activePickerEntryId
    ? wardrobeData.entries.find(
        (entry) => entry.id === activePickerEntryId
      ) || null
    : null;

  return {
    viewProps: {
      activeSection,
      sectionEyebrow: sectionCopy.eyebrow,
      sectionTitle: sectionCopy.title,
      sectionDescription: sectionCopy.body,
      wardrobeTitleValue: form?.title || "",
      wardrobeScopeValue: wardrobeData.scope || "",
      wardrobeDescriptionValue: form?.description || "",
      entries,
      activeEntry,
      entryRoleOptions: toSelectOptions(WARDROBE_ENTRY_ROLE_OPTIONS),
      fallbackModeOptions: toSelectOptions(WARDROBE_FALLBACK_MODE_OPTIONS),
      fallbackModeValue:
        wardrobeData.selectionRules?.fallbackMode || "DEFAULT_THEN_FIRST",
      allowRandomChecked: Boolean(
        wardrobeData.selectionRules?.allowRandom
      ),
      promptSummaryValue: wardrobeData.promptGuidance?.summary || "",
      promptUsageNotesValue:
        wardrobeData.promptGuidance?.usageNotes || "",
      imagePromptValue: wardrobeData.image_prompt || "",
      negativePromptValue: wardrobeData.negative_prompt || "",
      imagePromptMaxLength: WARDROBE_IMAGE_PROMPT_MAX_LENGTH,
      negativePromptMaxLength: WARDROBE_NEGATIVE_PROMPT_MAX_LENGTH,
      onChangeWardrobeTitle: (value) => updateField?.("title", value),
      onChangeWardrobeScope: (value) => updateDataField?.("scope", value),
      onChangeWardrobeDescription: (value) =>
        updateField?.("description", value),
      onAddEntry: addEntry,
      onChangeFallbackMode: (value) =>
        updateSelectionRule("fallbackMode", value),
      onChangeAllowRandom: (value) =>
        updateSelectionRule("allowRandom", value),
      onChangePromptSummary: (value) =>
        updatePromptGuidance("summary", value),
      onChangePromptUsageNotes: (value) =>
        updatePromptGuidance("usageNotes", value),
      onChangeImagePrompt: (value) =>
        updateDataField?.(
          "image_prompt",
          limitWardrobePromptValue(
            value,
            WARDROBE_IMAGE_PROMPT_MAX_LENGTH
          )
        ),
      onChangeNegativePrompt: (value) =>
        updateDataField?.(
          "negative_prompt",
          limitWardrobePromptValue(
            value,
            WARDROBE_NEGATIVE_PROMPT_MAX_LENGTH
          )
        ),
    },
    applicationContentProps: {
      activePickerEntry,
      closeOutfitPicker,
      selectOutfit,
    },
  };
}

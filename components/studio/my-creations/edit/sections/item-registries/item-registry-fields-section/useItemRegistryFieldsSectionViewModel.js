"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CONSUMPTION_MODE_OPTIONS,
  createEmptyItemEntry,
  DEFAULT_PLACEMENT_OPTIONS,
  DURABILITY_MODE_OPTIONS,
  ITEM_CATEGORY_OPTIONS,
  ITEM_ROLE_OPTIONS,
  listToText,
  normalizeItemEntry,
  normalizeItemRegistryData,
  normalizeListText,
  QUANTITY_MODE_OPTIONS,
} from "@/components/studio/registries/itemRegistryUtils";

const SECTION_COPY = Object.freeze({
  overview: {
    eyebrow: "Object Continuity",
    title: "Inventory & Signature Objects",
    body: "Describe what this registry tracks. This can cover character inventory, signature objects, wardrobe sets, equipment, faction caches, location props, quest objects, and image-generation props.",
  },
  entries: {
    eyebrow: "Entries",
    title: "Objects",
    body: "Add important objects, equipment, consumables, wardrobes, caches, quest objects, or memory props.",
  },
  associations: {
    eyebrow: "Associations",
    title: "Starting Ownership and Location",
    body: "Assign each item to its starting Character, Player Character, Location, general Story inventory, or leave it unassigned. Runtime transfers later change Story state without rewriting this source registry.",
  },
  tracking: {
    eyebrow: "Tracking",
    title: "Runtime Tracking Rules",
    body: "These fields prepare future middleware. The AI should not track this by prompt memory; runtime services will use these rules later.",
  },
  prompt: {
    eyebrow: "Prompt Guidance",
    title: "Image and Runtime Guidance",
    body: "Describe how this registry should feed image generation and later runtime packets.",
  },
  review: {
    eyebrow: "Review",
    title: "Structured Payload Preview",
    body: "This is the current structured registry payload saved into creations.data.",
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

    const shouldFormat = option.includes("_") || option === option.toUpperCase();

    return {
      value: option,
      label: shouldFormat ? formatOptionLabel(option) : option,
    };
  });
}

function buildViewEntry({
  entry,
  activeEntryId,
  setActiveEntryId,
  updateEntry,
  deleteEntry,
}) {
  return {
    id: entry.id,
    isActive: activeEntryId === entry.id,
    nameValue: entry.name || "",
    nameDisplay: entry.name || "Untitled Object",
    categoryValue: entry.category || "General",
    categoryDisplay: entry.category || "General",
    roleValue: entry.role || "SIGNATURE_OBJECT",
    roleDisplay: formatOptionLabel(entry.role || "SIGNATURE_OBJECT"),
    defaultPlacementValue: entry.defaultPlacement || "UNKNOWN",
    aliasesText: listToText(entry.aliases),
    descriptionValue: entry.description || "",
    visualDescriptionValue: entry.visualDescription || "",
    symbolicMeaningValue: entry.symbolicMeaning || "",
    ownershipNotesValue: entry.ownershipNotes || "",
    locationNotesValue: entry.locationNotes || "",
    quantityModeValue: entry.quantityMode || "UNIQUE",
    startingQuantityValue: entry.startingQuantity || "",
    consumptionModeValue: entry.consumptionMode || "NONE",
    durabilityModeValue: entry.durabilityMode || "NONE",
    conditionPercentValue: entry.conditionPercent || "",
    availabilityRuleValue: entry.availabilityRule || "",
    doNotHallucinateAvailabilityChecked:
      entry.doNotHallucinateAvailability !== false,
    promptGuidanceValue: entry.promptGuidance || "",
    negativePromptNotesValue: entry.negativePromptNotes || "",
    onSelect: () => setActiveEntryId(entry.id),
    onChangeName: (value) => updateEntry(entry.id, { name: value }),
    onChangeCategory: (value) => updateEntry(entry.id, { category: value }),
    onChangeRole: (value) => updateEntry(entry.id, { role: value }),
    onChangeDefaultPlacement: (value) =>
      updateEntry(entry.id, { defaultPlacement: value }),
    onChangeAliasesText: (value) =>
      updateEntry(entry.id, { aliases: normalizeListText(value) }),
    onChangeDescription: (value) =>
      updateEntry(entry.id, { description: value }),
    onChangeVisualDescription: (value) =>
      updateEntry(entry.id, { visualDescription: value }),
    onChangeSymbolicMeaning: (value) =>
      updateEntry(entry.id, { symbolicMeaning: value }),
    onChangeOwnershipNotes: (value) =>
      updateEntry(entry.id, { ownershipNotes: value }),
    onChangeLocationNotes: (value) =>
      updateEntry(entry.id, { locationNotes: value }),
    onChangeQuantityMode: (value) =>
      updateEntry(entry.id, { quantityMode: value }),
    onChangeStartingQuantity: (value) =>
      updateEntry(entry.id, { startingQuantity: value }),
    onChangeConsumptionMode: (value) =>
      updateEntry(entry.id, { consumptionMode: value }),
    onChangeDurabilityMode: (value) =>
      updateEntry(entry.id, { durabilityMode: value }),
    onChangeConditionPercent: (value) =>
      updateEntry(entry.id, { conditionPercent: value }),
    onChangeAvailabilityRule: (value) =>
      updateEntry(entry.id, { availabilityRule: value }),
    onChangeDoNotHallucinateAvailability: (value) =>
      updateEntry(entry.id, { doNotHallucinateAvailability: value }),
    onChangePromptGuidance: (value) =>
      updateEntry(entry.id, { promptGuidance: value }),
    onChangeNegativePromptNotes: (value) =>
      updateEntry(entry.id, { negativePromptNotes: value }),
    onDelete: () => deleteEntry(entry.id),
  };
}

export function useItemRegistryFieldsSectionViewModel({
  section = "overview",
  form = {},
  updateField = null,
  updateDataField = null,
} = {}) {
  const registryData = useMemo(
    () => normalizeItemRegistryData(form?.data || {}),
    [form?.data]
  );
  const [activeEntryId, setActiveEntryId] = useState(
    registryData.entries?.[0]?.id || null
  );

  useEffect(() => {
    if (!registryData.entries.length) {
      if (activeEntryId !== null) setActiveEntryId(null);
      return;
    }

    if (!registryData.entries.some((entry) => entry.id === activeEntryId)) {
      setActiveEntryId(registryData.entries[0].id);
    }
  }, [activeEntryId, registryData.entries]);

  const activeSection = SECTION_COPY[section] ? section : "overview";
  const sectionCopy = SECTION_COPY[activeSection];

  function updatePromptGuidance(field, value) {
    updateDataField?.("prompt_guidance", {
      ...(registryData.prompt_guidance || {}),
      [field]: value,
    });
  }

  function addEntry() {
    const entry = createEmptyItemEntry();
    updateDataField?.("entries", [...registryData.entries, entry]);
    setActiveEntryId(entry.id);
  }

  function updateEntry(entryId, updates) {
    updateDataField?.(
      "entries",
      registryData.entries.map((entry) =>
        entry.id === entryId
          ? normalizeItemEntry({
              ...entry,
              ...updates,
            })
          : entry
      )
    );
  }

  function deleteEntry(entryId) {
    const nextEntries = registryData.entries.filter(
      (entry) => entry.id !== entryId
    );

    updateDataField?.("entries", nextEntries);

    if (activeEntryId === entryId) {
      setActiveEntryId(nextEntries[0]?.id || null);
    }
  }

  const entries = registryData.entries.map((entry) =>
    buildViewEntry({
      entry,
      activeEntryId,
      setActiveEntryId,
      updateEntry,
      deleteEntry,
    })
  );
  const activeEntry =
    entries.find((entry) => entry.id === activeEntryId) || null;

  return {
    viewProps: {
      activeSection,
      sectionEyebrow: sectionCopy.eyebrow,
      sectionTitle: sectionCopy.title,
      sectionDescription: sectionCopy.body,
      registryTitleValue: form?.title || "",
      registryScopeValue: registryData.scope || "",
      registryDescriptionValue: form?.description || "",
      entries,
      activeEntry,
      categoryOptions: toSelectOptions(ITEM_CATEGORY_OPTIONS),
      roleOptions: toSelectOptions(ITEM_ROLE_OPTIONS),
      placementOptions: toSelectOptions(DEFAULT_PLACEMENT_OPTIONS),
      quantityOptions: toSelectOptions(QUANTITY_MODE_OPTIONS),
      consumptionOptions: toSelectOptions(CONSUMPTION_MODE_OPTIONS),
      durabilityOptions: toSelectOptions(DURABILITY_MODE_OPTIONS),
      promptSummaryValue: registryData.prompt_guidance?.summary || "",
      promptUsageNotesValue:
        registryData.prompt_guidance?.usageNotes || "",
      promptNegativeNotesValue:
        registryData.prompt_guidance?.negativePromptNotes || "",
      reviewEntryCountValue: String(registryData.entries.length),
      reviewScopeValue: registryData.scope || "Not set",
      reviewPayloadText: JSON.stringify(registryData, null, 2),
      onChangeRegistryTitle: (value) => updateField?.("title", value),
      onChangeRegistryScope: (value) => updateDataField?.("scope", value),
      onChangeRegistryDescription: (value) =>
        updateField?.("description", value),
      onAddEntry: addEntry,
      onChangePromptSummary: (value) =>
        updatePromptGuidance("summary", value),
      onChangePromptUsageNotes: (value) =>
        updatePromptGuidance("usageNotes", value),
      onChangePromptNegativeNotes: (value) =>
        updatePromptGuidance("negativePromptNotes", value),
    },
    applicationContentProps: {
      registryEntries: registryData.entries,
      updateEntryStartingAssignment: (entryId, startingAssignment) =>
        updateEntry(entryId, { startingAssignment }),
    },
  };
}

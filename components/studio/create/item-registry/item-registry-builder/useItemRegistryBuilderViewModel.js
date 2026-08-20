"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";
import {
  buildItemRegistryCreationPayload,
  CONSUMPTION_MODE_OPTIONS,
  createEmptyItemEntry,
  createEmptyItemRegistryData,
  createRegistryId,
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
import {
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
  normalizeItemEquipmentModifierReference,
} from "@/components/studio/registries/item-equipment-modifier-references/ItemEquipmentModifierReferences.contract";
import {
  ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
  ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
  normalizeItemOperationEffectReference,
  normalizeItemOperationRequirementSet,
  resolveItemOperationEffectAuthoringOption,
} from "@/components/studio/registries/item-operation-authoring/ItemOperationAuthoring.contract";
import { buildItemRegistryBuilderTabs } from "./ItemRegistryBuilder.contract";

function createEmptyItemEquipmentModifierReference() {
  return normalizeItemEquipmentModifierReference({
    id: createRegistryId("equipment"),
    enabled: true,
    statsPoolsBindingId: "stats",
    modifierDefinitionId: "",
    stacks: 1,
    metadata: {},
  });
}

function createEmptyItemOperationRequirementSet() {
  return normalizeItemOperationRequirementSet({
    id: createRegistryId("item_requirement"),
    enabled: true,
    actionTypes: ["ITEM_USE"],
    requirementMode: "ALL",
    requirements: [],
    metadata: {},
  });
}

function createEmptyItemOperationRequirement() {
  return {
    id: createRegistryId("requirement"),
    type: "STATS_POOLS_STAT_CURRENT",
    bindingId: "stats",
    targetId: "stat.strength",
    operator: "GTE",
    value: 1,
  };
}

function createEmptyItemOperationEffectReference() {
  const catalogEntry = resolveItemOperationEffectAuthoringOption({
    domain: "STATS_POOLS",
    operation: "MUTATE_POOL",
  });

  return normalizeItemOperationEffectReference({
    id: createRegistryId("item_effect"),
    enabled: true,
    actionTypes: ["ITEM_USE"],
    domain: catalogEntry?.domain || "STATS_POOLS",
    operation: catalogEntry?.operation || "MUTATE_POOL",
    version:
      catalogEntry?.version ||
      "actor_mechanics_profile.stats_pools.mutate_pool.v0",
    targetRole: "SOURCE_ACTOR",
    arguments: { ...(catalogEntry?.defaultArguments || {}) },
    metadata: {},
  });
}

function cloneInitialData(initialData) {
  const source =
    initialData && typeof initialData === "object" ? initialData : {};

  return normalizeItemRegistryData({
    ...createEmptyItemRegistryData(),
    ...source,
    entries: Array.isArray(source.entries) ? [...source.entries] : [],
    prompt_guidance: {
      ...createEmptyItemRegistryData().prompt_guidance,
      ...(source.prompt_guidance || {}),
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

    const shouldFormat = option.includes("_") || option === option.toUpperCase();

    return {
      value: option,
      label: shouldFormat ? formatOptionLabel(option) : option,
    };
  });
}

export function useItemRegistryBuilderViewModel({
  initialTitle = "Untitled Item Registry",
  initialDescription = "",
  initialData = null,
  createDraft = createCreationDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [data, setData] = useState(() => cloneInitialData(initialData));
  const [activeTab, setActiveTab] = useState("overview");
  const [activeEntryId, setActiveEntryId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [savedCreationId, setSavedCreationId] = useState(null);

  const registryData = useMemo(() => normalizeItemRegistryData(data), [data]);

  const activeEntry = useMemo(
    () =>
      activeEntryId
        ? registryData.entries.find((entry) => entry.id === activeEntryId) || null
        : null,
    [activeEntryId, registryData.entries]
  );

  const entryItems = useMemo(
    () =>
      registryData.entries.map((entry) => ({
        ...entry,
        aliasesText: listToText(entry.aliases),
      })),
    [registryData.entries]
  );

  const viewActiveEntry = useMemo(
    () =>
      activeEntry
        ? {
            ...activeEntry,
            aliasesText: listToText(activeEntry.aliases),
          }
        : null,
    [activeEntry]
  );

  const tabs = useMemo(
    () => buildItemRegistryBuilderTabs(activeTab),
    [activeTab]
  );

  const categoryOptions = useMemo(
    () => toSelectOptions(ITEM_CATEGORY_OPTIONS),
    []
  );
  const roleOptions = useMemo(() => toSelectOptions(ITEM_ROLE_OPTIONS), []);
  const placementOptions = useMemo(
    () => toSelectOptions(DEFAULT_PLACEMENT_OPTIONS),
    []
  );
  const quantityOptions = useMemo(
    () => toSelectOptions(QUANTITY_MODE_OPTIONS),
    []
  );
  const consumptionOptions = useMemo(
    () => toSelectOptions(CONSUMPTION_MODE_OPTIONS),
    []
  );
  const durabilityOptions = useMemo(
    () => toSelectOptions(DURABILITY_MODE_OPTIONS),
    []
  );

  function markDirty() {
    setSaveStatus("idle");
    setSaveMessage("");
  }

  function updateDataField(field, value) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
    markDirty();
  }

  function updatePromptGuidance(field, value) {
    setData((current) => ({
      ...current,
      prompt_guidance: {
        ...(current.prompt_guidance || {}),
        [field]: value,
      },
    }));
    markDirty();
  }

  function addEntry() {
    const entry = createEmptyItemEntry();

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
          ? normalizeItemEntry({
              ...entry,
              ...updates,
            })
          : entry
      ),
    }));
    markDirty();
  }

  function updateEntryAliases(entryId, aliasesText) {
    updateEntry(entryId, {
      aliases: normalizeListText(aliasesText),
    });
  }

  function addEntryEquipmentModifierReference(entryId) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const references = Array.isArray(entry?.equipmentModifierReferences)
      ? entry.equipmentModifierReferences
      : [];

    if (references.length >= ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT) return;

    updateEntry(entryId, {
      equipmentModifierReferences: [
        ...references,
        createEmptyItemEquipmentModifierReference(),
      ],
    });
  }

  function updateEntryEquipmentModifierReference(entryId, index, updates) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const references = Array.isArray(entry?.equipmentModifierReferences)
      ? entry.equipmentModifierReferences
      : [];

    updateEntry(entryId, {
      equipmentModifierReferences: references.map((reference, referenceIndex) =>
        referenceIndex === index
          ? normalizeItemEquipmentModifierReference(
              { ...reference, ...updates },
              referenceIndex
            )
          : reference
      ),
    });
  }

  function removeEntryEquipmentModifierReference(entryId, index) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const references = Array.isArray(entry?.equipmentModifierReferences)
      ? entry.equipmentModifierReferences
      : [];

    updateEntry(entryId, {
      equipmentModifierReferences: references.filter(
        (_reference, referenceIndex) => referenceIndex !== index
      ),
    });
  }

  function addEntryOperationRequirementSet(entryId) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const sets = Array.isArray(entry?.operationRequirementSets)
      ? entry.operationRequirementSets
      : [];

    if (sets.length >= ITEM_OPERATION_REQUIREMENT_SET_LIMIT) return;

    updateEntry(entryId, {
      operationRequirementSets: [
        ...sets,
        createEmptyItemOperationRequirementSet(),
      ],
    });
  }

  function updateEntryOperationRequirementSet(entryId, index, updates) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const sets = Array.isArray(entry?.operationRequirementSets)
      ? entry.operationRequirementSets
      : [];

    updateEntry(entryId, {
      operationRequirementSets: sets.map((set, setIndex) =>
        setIndex === index
          ? {
              ...set,
              ...normalizeItemOperationRequirementSet(
                { ...set, ...updates },
                setIndex
              ),
            }
          : set
      ),
    });
  }

  function removeEntryOperationRequirementSet(entryId, index) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const sets = Array.isArray(entry?.operationRequirementSets)
      ? entry.operationRequirementSets
      : [];

    updateEntry(entryId, {
      operationRequirementSets: sets.filter(
        (_set, setIndex) => setIndex !== index
      ),
    });
  }

  function addEntryOperationRequirement(entryId, setIndex) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const sets = Array.isArray(entry?.operationRequirementSets)
      ? entry.operationRequirementSets
      : [];
    const targetSet = sets[setIndex];
    if (!targetSet) return;

    const requirements = Array.isArray(targetSet.requirements)
      ? targetSet.requirements
      : [];

    updateEntryOperationRequirementSet(entryId, setIndex, {
      requirements: [...requirements, createEmptyItemOperationRequirement()],
    });
  }

  function updateEntryOperationRequirement(
    entryId,
    setIndex,
    requirementIndex,
    updates
  ) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const sets = Array.isArray(entry?.operationRequirementSets)
      ? entry.operationRequirementSets
      : [];
    const targetSet = sets[setIndex];
    if (!targetSet) return;

    const requirements = Array.isArray(targetSet.requirements)
      ? targetSet.requirements
      : [];

    updateEntryOperationRequirementSet(entryId, setIndex, {
      requirements: requirements.map((requirement, index) =>
        index === requirementIndex
          ? { ...requirement, ...updates }
          : requirement
      ),
    });
  }

  function removeEntryOperationRequirement(entryId, setIndex, requirementIndex) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const sets = Array.isArray(entry?.operationRequirementSets)
      ? entry.operationRequirementSets
      : [];
    const targetSet = sets[setIndex];
    if (!targetSet) return;

    const requirements = Array.isArray(targetSet.requirements)
      ? targetSet.requirements
      : [];

    updateEntryOperationRequirementSet(entryId, setIndex, {
      requirements: requirements.filter(
        (_requirement, index) => index !== requirementIndex
      ),
    });
  }

  function addEntryOperationEffectReference(entryId) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const references = Array.isArray(entry?.operationEffectReferences)
      ? entry.operationEffectReferences
      : [];

    if (references.length >= ITEM_OPERATION_EFFECT_REFERENCE_LIMIT) return;

    updateEntry(entryId, {
      operationEffectReferences: [
        ...references,
        createEmptyItemOperationEffectReference(),
      ],
    });
  }

  function updateEntryOperationEffectReference(entryId, index, updates) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const references = Array.isArray(entry?.operationEffectReferences)
      ? entry.operationEffectReferences
      : [];

    updateEntry(entryId, {
      operationEffectReferences: references.map((reference, referenceIndex) =>
        referenceIndex === index
          ? {
              ...reference,
              ...normalizeItemOperationEffectReference(
                { ...reference, ...updates },
                referenceIndex
              ),
            }
          : reference
      ),
    });
  }

  function removeEntryOperationEffectReference(entryId, index) {
    const entry = registryData.entries.find((item) => item.id === entryId);
    const references = Array.isArray(entry?.operationEffectReferences)
      ? entry.operationEffectReferences
      : [];

    updateEntry(entryId, {
      operationEffectReferences: references.filter(
        (_reference, referenceIndex) => referenceIndex !== index
      ),
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
    markDirty();
  }

  async function handleSave() {
    if (saveStatus === "saving" || savedCreationId) return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = buildItemRegistryCreationPayload({
        title,
        description,
        data: registryData,
      });

      const response = await createDraft(
        payload,
        "Item registry could not be saved."
      );

      const creation = response?.data?.creation || response?.creation || null;

      if (!creation?.id) {
        throw new Error(
          "Item registry was saved, but no creation ID was returned."
        );
      }

      setSavedCreationId(creation.id);
      setSaveStatus("saved");
      setSaveMessage("Item registry saved as a draft.");

      if (typeof onCreated === "function") {
        onCreated(creation);
      } else {
        router.replace("/studio/my-creations");
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || "Item registry could not be saved.");
    }
  }

  return {
    viewProps: {
      title,
      description,
      scope: registryData.scope || "",
      tabs,
      activeTab,
      entries: entryItems,
      activeEntryId,
      activeEntry: viewActiveEntry,
      promptGuidance: registryData.prompt_guidance || {},
      reviewPayloadText: JSON.stringify(registryData, null, 2),
      saveStatus,
      saveMessage,
      savedCreationId,
      openDraftHref: savedCreationId
        ? `/studio/my-creations/${savedCreationId}/edit`
        : "",
      categoryOptions,
      roleOptions,
      placementOptions,
      quantityOptions,
      consumptionOptions,
      durabilityOptions,
      equipmentModifierReferenceLimit: ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
      operationRequirementSetLimit: ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
      operationEffectReferenceLimit: ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
      onTitleChange: setTitle,
      onDescriptionChange: setDescription,
      onScopeChange: (value) => updateDataField("scope", value),
      onSelectTab: setActiveTab,
      onSelectEntry: setActiveEntryId,
      onAddEntry: addEntry,
      onUpdateEntry: updateEntry,
      onUpdateEntryAliases: updateEntryAliases,
      onAddEquipmentModifierReference: addEntryEquipmentModifierReference,
      onUpdateEquipmentModifierReference: updateEntryEquipmentModifierReference,
      onRemoveEquipmentModifierReference: removeEntryEquipmentModifierReference,
      onAddOperationRequirementSet: addEntryOperationRequirementSet,
      onUpdateOperationRequirementSet: updateEntryOperationRequirementSet,
      onRemoveOperationRequirementSet: removeEntryOperationRequirementSet,
      onAddOperationRequirement: addEntryOperationRequirement,
      onUpdateOperationRequirement: updateEntryOperationRequirement,
      onRemoveOperationRequirement: removeEntryOperationRequirement,
      onAddOperationEffectReference: addEntryOperationEffectReference,
      onUpdateOperationEffectReference: updateEntryOperationEffectReference,
      onRemoveOperationEffectReference: removeEntryOperationEffectReference,
      onDeleteEntry: deleteEntry,
      onPromptGuidanceChange: updatePromptGuidance,
      onSave: handleSave,
    },
    applicationContentProps: {
      registryData,
      activeEntry,
      updateEntry,
      updateDataField,
      updatePromptGuidance,
      addEntry,
      deleteEntry,
      handleSave,
      setTitle,
      setDescription,
      setActiveTab,
      setActiveEntryId,
    },
  };
}

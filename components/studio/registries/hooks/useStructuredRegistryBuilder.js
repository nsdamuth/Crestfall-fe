"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createCreationDraft } from "@/lib/client/studio/creations/creationClient";
import { getStructuredRegistryConfig } from "@/components/studio/registries/structuredRegistryConfigs";
import {
  buildStructuredRegistryCreationPayload,
  createEmptyStructuredRegistryData,
  createEmptyStructuredRegistryEntry,
  normalizeStructuredRegistryData,
  normalizeStructuredRegistryEntry,
} from "@/components/studio/registries/structuredRegistryUtils";

export function useStructuredRegistryBuilder({
  registryType,
  mode = "create",
  currentRegistryCreationId = "",
  initialTitle = "",
  initialDescription = "",
  initialData = null,
  onChange,
}) {
  const router = useRouter();
  const config = getStructuredRegistryConfig(registryType);
  const isEditMode = mode === "edit";

  const [title, setTitleState] = useState(() => initialTitle || "");
  const [description, setDescriptionState] = useState(
    () => initialDescription || ""
  );
  const [data, setDataState] = useState(() =>
    initialData
      ? normalizeStructuredRegistryData(initialData, registryType, {
          currentRegistryCreationId,
        })
      : createEmptyStructuredRegistryData(registryType)
  );

  const [activeTab, setActiveTab] = useState("overview");
  const [activeEntryId, setActiveEntryId] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [savedCreationId, setSavedCreationId] = useState(null);

  const registryData = useMemo(
    () =>
      normalizeStructuredRegistryData(data, registryType, {
        currentRegistryCreationId,
      }),
    [currentRegistryCreationId, data, registryType]
  );

  const activeEntry = activeEntryId
    ? registryData.entries.find((entry) => entry.id === activeEntryId) || null
    : null;

  function emitEditChange({
    nextTitle = title,
    nextDescription = description,
    nextData = data,
  } = {}) {
    if (!isEditMode || typeof onChange !== "function") return;

    onChange({
      title: nextTitle,
      description: nextDescription,
      data: normalizeStructuredRegistryData(nextData, registryType, {
        currentRegistryCreationId,
      }),
    });
  }

  function setTitle(value) {
    setTitleState(value);
    emitEditChange({ nextTitle: value });
  }

  function setDescription(value) {
    setDescriptionState(value);
    emitEditChange({ nextDescription: value });
  }

  function commitData(nextData) {
    const normalizedData = normalizeStructuredRegistryData(
      nextData,
      registryType,
      { currentRegistryCreationId }
    );

    setDataState(normalizedData);
    emitEditChange({ nextData: normalizedData });
  }

  function updateDataField(field, value) {
    commitData({
      ...registryData,
      [field]: value,
    });
  }

  function updatePromptGuidance(field, value) {
    commitData({
      ...registryData,
      prompt_guidance: {
        ...(registryData.prompt_guidance || {}),
        [field]: value,
      },
    });
  }

  function addEntry() {
    const entry = createEmptyStructuredRegistryEntry(registryType);
    const nextData = {
      ...registryData,
      entries: [...registryData.entries, entry],
    };

    commitData(nextData);
    setActiveEntryId(entry.id);
    setActiveTab("entries");
  }

  function updateEntry(entryId, updates) {
    commitData({
      ...registryData,
      entries: registryData.entries.map((entry) =>
        entry.id === entryId
          ? normalizeStructuredRegistryEntry(
              {
                ...entry,
                ...updates,
              },
              registryType,
              { currentRegistryCreationId }
            )
          : entry
      ),
    });
  }

  function deleteEntry(entryId) {
    const nextEntries = registryData.entries.filter(
      (entry) => entry.id !== entryId
    );

    commitData({
      ...registryData,
      entries: nextEntries,
    });

    if (activeEntryId === entryId) {
      setActiveEntryId(nextEntries[0]?.id || null);
    }
  }

  async function handleSave() {
    if (isEditMode) {
      setSaveStatus("idle");
      setSaveMessage("");
      return;
    }

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = buildStructuredRegistryCreationPayload({
        registryType,
        title,
        description,
        data: registryData,
        currentRegistryCreationId,
      });

      const response = await createCreationDraft(
        payload,
        `${config.label} could not be saved.`
      );

      const creation = response?.data?.creation || response?.creation || null;

      if (!creation?.id) {
        throw new Error(
          `${config.label} was saved, but no creation ID was returned.`
        );
      }

      setSavedCreationId(creation.id);
      setSaveStatus("saved");
      setSaveMessage(`${config.label} saved. Opening the editor...`);

      router.replace(`/studio/my-creations/${creation.id}/edit`);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error?.message || `${config.label} could not be saved.`);
    }
  }

  return {
    mode,
    isEditMode,
    config,
    title,
    setTitle,
    description,
    setDescription,
    data: registryData,
    activeTab,
    setActiveTab,
    activeEntryId,
    setActiveEntryId,
    activeEntry,
    saveStatus,
    saveMessage,
    savedCreationId,
    updateDataField,
    updatePromptGuidance,
    addEntry,
    updateEntry,
    deleteEntry,
    handleSave,
  };
}

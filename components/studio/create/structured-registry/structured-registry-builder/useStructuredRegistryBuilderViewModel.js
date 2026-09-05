"use client";

import { useMemo, useState } from "react";

import { useStructuredRegistryBuilder } from "@/components/studio/registries/hooks/useStructuredRegistryBuilder";
import {
  createLinkedCreationLink,
  listToText,
  normalizeListText,
} from "@/components/studio/registries/structuredRegistryUtils";
import { buildStructuredRegistryBuilderTabs } from "./StructuredRegistryBuilder.contract";
import { useStructuredRegistryDocumentToolsViewModel } from "../structured-registry-document-tools/useStructuredRegistryDocumentToolsViewModel";

function toSelectOptions(options = []) {
  return options.map((option) =>
    typeof option === "string"
      ? {
          value: option,
          label: option,
        }
      : option
  );
}

function withPresentationFields(entry) {
  return {
    ...entry,
    aliasesText: listToText(entry?.aliases),
  };
}

export function useStructuredRegistryBuilderViewModel({
  registryType,
  mode = "create",
  initialTitle = "",
  initialDescription = "",
  initialData = null,
  onChange,
  activeTab: controlledActiveTab = null,
  hideTabs = false,
} = {}) {
  const registry = useStructuredRegistryBuilder({
    registryType,
    mode,
    initialTitle,
    initialDescription,
    initialData,
    onChange,
  });
  const [linkPicker, setLinkPicker] = useState(null);
  const documentTools = useStructuredRegistryDocumentToolsViewModel({
    registryType,
    registryData: registry.data,
    onAddSample: registry.addEntryFromTemplate,
    onReplaceData: registry.replaceData,
  });

  const activeTab = controlledActiveTab || registry.activeTab;
  const tabs = useMemo(
    () => buildStructuredRegistryBuilderTabs(activeTab),
    [activeTab]
  );
  const entries = useMemo(
    () => registry.data.entries.map(withPresentationFields),
    [registry.data.entries]
  );
  const activeEntry = useMemo(
    () =>
      registry.activeEntry
        ? withPresentationFields(registry.activeEntry)
        : null,
    [registry.activeEntry]
  );
  const categoryOptions = useMemo(
    () => toSelectOptions(registry.config.categoryOptions || ["Other"]),
    [registry.config.categoryOptions]
  );

  const pickerEntry = useMemo(
    () =>
      linkPicker?.entryId
        ? registry.data.entries.find(
            (entry) => entry.id === linkPicker.entryId
          ) || null
        : null,
    [linkPicker?.entryId, registry.data.entries]
  );

  const selectedCreationIds = useMemo(() => {
    if (!pickerEntry || !linkPicker?.group?.id) return [];

    const links = Array.isArray(pickerEntry[linkPicker.group.id])
      ? pickerEntry[linkPicker.group.id]
      : [];

    return links.map((link) => link.creationId).filter(Boolean);
  }, [pickerEntry, linkPicker]);

  function openLinkPicker(entryId, groupId) {
    const group = (registry.config.relationshipGroups || []).find(
      (candidate) => candidate.id === groupId
    );

    if (!group) return;

    setLinkPicker({ entryId, group });
  }

  function selectLinkedCreation(creation) {
    if (!pickerEntry || !linkPicker?.group?.id) return;

    const field = linkPicker.group.id;
    const currentLinks = Array.isArray(pickerEntry[field])
      ? pickerEntry[field]
      : [];

    if (!currentLinks.some((link) => link.creationId === creation.id)) {
      registry.updateEntry(pickerEntry.id, {
        [field]: [...currentLinks, createLinkedCreationLink(creation)],
      });
    }

    setLinkPicker(null);
  }

  function removeLinkedCreation(entryId, groupId, linkId) {
    const entry = registry.data.entries.find((candidate) => candidate.id === entryId);
    const links = Array.isArray(entry?.[groupId]) ? entry[groupId] : [];

    registry.updateEntry(entryId, {
      [groupId]: links.filter((link) => link.id !== linkId),
    });
  }

  function updateLinkedCreationNotes(entryId, groupId, linkId, notes) {
    const entry = registry.data.entries.find((candidate) => candidate.id === entryId);
    const links = Array.isArray(entry?.[groupId]) ? entry[groupId] : [];

    registry.updateEntry(entryId, {
      [groupId]: links.map((link) =>
        link.id === linkId
          ? {
              ...link,
              notes,
            }
          : link
      ),
    });
  }

  return {
    viewProps: {
      contractVersion: "structured-registry-builder.view.v1",
      config: registry.config,
      title: registry.title,
      description: registry.description,
      scope: registry.data.scope || "",
      entries,
      activeEntryId: registry.activeEntryId,
      activeEntry,
      promptGuidance: registry.data.prompt_guidance || {},
      reviewPayloadText: JSON.stringify(registry.data, null, 2),
      tabs,
      activeTab,
      hideTabs,
      isEditMode: registry.isEditMode,
      saveStatus: registry.saveStatus,
      saveMessage: registry.saveMessage,
      categoryOptions,
      onTitleChange: registry.setTitle,
      onDescriptionChange: registry.setDescription,
      onScopeChange: (value) => registry.updateDataField("scope", value),
      onSelectTab: registry.setActiveTab,
      onSelectEntry: registry.setActiveEntryId,
      onAddEntry: registry.addEntry,
      onUpdateEntry: registry.updateEntry,
      onEntryAliasesTextChange: (entryId, value) =>
        registry.updateEntry(entryId, {
          aliases: normalizeListText(value),
        }),
      onDeleteEntry: registry.deleteEntry,
      onOpenLinkPicker: openLinkPicker,
      onRemoveLinkedCreation: removeLinkedCreation,
      onLinkedCreationNotesChange: updateLinkedCreationNotes,
      onPromptGuidanceChange: registry.updatePromptGuidance,
      onSave: registry.handleSave,
    },
    documentTools,
    linkedCreationPickerProps: linkPicker
      ? {
          title: linkPicker.group?.pickerTitle || "Link Creation",
          body: "Choose a creation to link to this registry entry.",
          allowedTypes: linkPicker.group?.allowedTypes || [],
          selectedCreationIds,
          onClose: () => setLinkPicker(null),
          onSelect: selectLinkedCreation,
        }
      : null,
  };
}

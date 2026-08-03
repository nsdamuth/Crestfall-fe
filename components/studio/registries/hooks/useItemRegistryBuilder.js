"use client";

import { useItemRegistryBuilderViewModel } from "@/components/studio/create/item-registry/item-registry-builder/useItemRegistryBuilderViewModel";

export function useItemRegistryBuilder(options = {}) {
  const { viewProps, applicationContentProps } =
    useItemRegistryBuilderViewModel(options);

  return {
    title: viewProps.title,
    setTitle: applicationContentProps.setTitle,
    description: viewProps.description,
    setDescription: applicationContentProps.setDescription,
    data: applicationContentProps.registryData,
    activeTab: viewProps.activeTab,
    setActiveTab: applicationContentProps.setActiveTab,
    activeEntryId: viewProps.activeEntryId,
    setActiveEntryId: applicationContentProps.setActiveEntryId,
    activeEntry: applicationContentProps.activeEntry,
    saveStatus: viewProps.saveStatus,
    saveMessage: viewProps.saveMessage,
    savedCreationId: viewProps.savedCreationId,
    updateDataField: applicationContentProps.updateDataField,
    updatePromptGuidance: applicationContentProps.updatePromptGuidance,
    addEntry: applicationContentProps.addEntry,
    updateEntry: applicationContentProps.updateEntry,
    deleteEntry: applicationContentProps.deleteEntry,
    handleSave: applicationContentProps.handleSave,
  };
}

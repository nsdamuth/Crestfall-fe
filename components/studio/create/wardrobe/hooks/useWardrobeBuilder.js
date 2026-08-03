"use client";

import { useWardrobeBuilderViewModel } from "@/components/studio/create/wardrobe/wardrobe-builder/useWardrobeBuilderViewModel";

export function useWardrobeBuilder(options = {}) {
  const { viewProps, applicationContentProps } =
    useWardrobeBuilderViewModel(options);

  return {
    title: viewProps.title,
    setTitle: viewProps.onTitleChange,
    description: viewProps.description,
    setDescription: viewProps.onDescriptionChange,
    data: applicationContentProps.wardrobeData,
    activeTab: viewProps.activeTab,
    setActiveTab: applicationContentProps.setActiveTab,
    activeEntryId: viewProps.activeEntryId,
    setActiveEntryId: applicationContentProps.setActiveEntryId,
    activeEntry: applicationContentProps.activeEntry,
    saveStatus: viewProps.saveStatus,
    saveMessage: viewProps.saveMessage,
    updateDataField: applicationContentProps.updateDataField,
    updateSelectionRule: applicationContentProps.updateSelectionRule,
    updatePromptGuidance: applicationContentProps.updatePromptGuidance,
    addEntry: applicationContentProps.addEntry,
    updateEntry: applicationContentProps.updateEntry,
    deleteEntry: applicationContentProps.deleteEntry,
    handleSave: applicationContentProps.handleSave,
  };
}

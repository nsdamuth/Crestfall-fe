"use client";

// Thin pass-through ViewModel: the View is fixture-fed and owns no
// data. Dirty-state and save orchestration stay with the caller.
export function useEditorSaveBarViewModel({
  hasUnsavedChanges = false,
  saveStatus = "idle",
  saveMessage = "",
  onSave = null,
  onDiscard = null,
} = {}) {
  return {
    hasUnsavedChanges: Boolean(hasUnsavedChanges),
    saveStatus,
    saveMessage,
    onSave,
    onDiscard,
  };
}

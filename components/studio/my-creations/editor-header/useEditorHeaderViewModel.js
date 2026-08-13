"use client";

// Thin pass-through ViewModel, matching kit-batch practice: the View
// is fixture-fed and owns no data. Identity resolution (terminology
// lookup, visibility/canon labeling) is the caller's job.
export function useEditorHeaderViewModel({
  imageSrc = null,
  title = "Untitled Creation",
  typeLabel = "",
  typeIcon = null,
  visibilityLabel = "",
  visibilityVariant = "status",
  hasUnsavedChanges = false,
  switcherLabel = "Switch creation",
  onOpenSwitcher = null,
  onOpenSections = null,
  actions = null,
} = {}) {
  return {
    imageSrc,
    title,
    typeLabel,
    typeIcon,
    visibilityLabel,
    visibilityVariant,
    hasUnsavedChanges: Boolean(hasUnsavedChanges),
    switcherLabel,
    onOpenSwitcher,
    onOpenSections,
    actions,
  };
}

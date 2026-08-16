"use client";

// Thin pass-through ViewModel, matching kit-batch practice: the View
// is fixture-fed and owns no data. Identity resolution (terminology
// lookup, visibility/canon labeling) and slot derivation are the
// caller's job.
export function useEditorHeaderViewModel({
  primaryImageSrc = null,
  slots = [],
  onSelectSlot = null,
  onReplaceActiveSlot = null,
  generateHref = null,
  imageLibraryHref = null,
  title = "Untitled Creation",
  typeLabel = "",
  typeIcon = null,
  visibilityLabel = "",
  visibilityVariant = "status",
  actions = null,
} = {}) {
  return {
    primaryImageSrc,
    slots: Array.isArray(slots) ? slots : [],
    onSelectSlot,
    onReplaceActiveSlot,
    generateHref,
    imageLibraryHref,
    title,
    typeLabel,
    typeIcon,
    visibilityLabel,
    visibilityVariant,
    actions,
  };
}

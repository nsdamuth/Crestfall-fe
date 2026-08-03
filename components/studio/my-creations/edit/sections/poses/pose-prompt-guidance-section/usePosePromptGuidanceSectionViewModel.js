const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Prompt Guidance",
  sectionDescription:
    "Edit the reusable image-generation guidance this pose contributes when selected in Image Studio.",
  promptGuidanceLabel: "Prompt Guidance",
  promptGuidancePlaceholder:
    "Reusable image-generation wording for this pose.",
  usageNotesLabel: "Usage Notes",
  usageNotesPlaceholder:
    "When should this pose be used? What character types, outfits, locations, or image presets does it support?",
  compatibilityNotesLabel: "Compatibility Notes",
  compatibilityNotesPlaceholder:
    "Optional compatibility notes for characters, outfits, props, image presets, or scene types.",
});

export function getPosePromptGuidanceSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    promptGuidanceValue: data.prompt_guidance || data.prompt || "",
    usageNotesValue: data.usage_notes || "",
    compatibilityNotesValue: data.compatibility_notes || "",
    onChangePromptGuidance: (value) =>
      updateDataField?.("prompt_guidance", value),
    onChangeUsageNotes: (value) => updateDataField?.("usage_notes", value),
    onChangeCompatibilityNotes: (value) =>
      updateDataField?.("compatibility_notes", value),
  };
}

export function usePosePromptGuidanceSectionViewModel(props = {}) {
  return getPosePromptGuidanceSectionViewProps(props);
}

import {
  buildPosePromptFromSemantics,
  normalizePoseSemantics,
} from "@/lib/shared/creations/poseSemantics";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Pose Editor",
  sectionTitle: "Prompt Guidance",
  sectionDescription:
    "Prompt Guidance is the image-generation wording contributed when this pose is selected. Structured pose semantics remain separate so chat matching and future pose references do not depend on prompt prose.",
  promptGuidanceLabel: "Prompt Guidance",
  promptGuidancePlaceholder:
    "Reusable image-generation wording for this pose.",
  promptGuidanceHelper:
    "High-authority pose wording for image generation. Keep it focused on geometry and staging; explicit scene/camera requests can still override soft defaults.",
  usageNotesLabel: "Usage Notes",
  usageNotesPlaceholder:
    "When should this pose be used? What character types, outfits, locations, or image presets does it support?",
  usageNotesHelper:
    "Human/recommendation metadata. This is not automatically inserted into the generation prompt.",
  compatibilityNotesLabel: "Compatibility Notes",
  compatibilityNotesPlaceholder:
    "Optional compatibility notes for characters, outfits, props, image presets, or scene types.",
  compatibilityNotesHelper:
    "Reserved for recommendation/filtering and future pose-reference compatibility checks.",
});

export function getPosePromptGuidanceSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};
  const semantics = normalizePoseSemantics(data);
  const generatedGuidance = buildPosePromptFromSemantics(data);

  return {
    ...DEFAULT_COPY,
    promptGuidanceValue: data.prompt_guidance || data.prompt || "",
    suggestedPromptGuidance: generatedGuidance,
    usageNotesValue: semantics.usage_notes,
    compatibilityNotesValue: semantics.compatibility_notes,
    onChangePromptGuidance: (value) =>
      updateDataField?.("prompt_guidance", value),
    onUseSuggestedPromptGuidance: generatedGuidance
      ? () => updateDataField?.("prompt_guidance", generatedGuidance)
      : null,
    onChangeUsageNotes: (value) => updateDataField?.("usage_notes", value),
    onChangeCompatibilityNotes: (value) =>
      updateDataField?.("compatibility_notes", value),
  };
}

export function usePosePromptGuidanceSectionViewModel(props = {}) {
  return getPosePromptGuidanceSectionViewProps(props);
}

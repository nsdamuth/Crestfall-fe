export const IMAGE_PRESET_IMAGE_PROMPT_MAX_LENGTH = 2000;
export const IMAGE_PRESET_NEGATIVE_PROMPT_MAX_LENGTH = 2000;

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Image Preset Editor",
  sectionTitle: "Prompt Stack",
  sectionDescription:
    "Edit the reusable prompt language this image preset contributes when selected in Image Studio.",
  promptGuidanceLabel: "Prompt Guidance",
  promptGuidancePlaceholder:
    "Reusable image-generation wording for this style preset.",
  stylePromptLabel: "Style Prompt",
  stylePromptPlaceholder:
    "Specific style terms, medium descriptors, rendering phrases, or art-direction language.",
  qualityNotesLabel: "Quality / Polish Notes",
  qualityNotesPlaceholder:
    "Optional quality, finish, detail, polish, or consistency guidance.",
  imagePromptLabel: "Standalone Image Prompt",
  imagePromptPlaceholder:
    "Optional standalone prompt for generating preview, catalogue, or reference images for this image preset as its own visual asset. Max 2,000 characters.",
  negativePromptLabel: "Negative Prompt",
  negativePromptPlaceholder:
    "Optional negatives this image preset should contribute when selected. Example: photorealistic, 3d render, dull colors, flat lighting. Max 2,000 characters.",
  usageNotesLabel: "Usage Notes",
  usageNotesPlaceholder:
    "When should this preset be used? What characters, scenes, poses, outfits, or locations does it support?",
  compatibilityNotesLabel: "Compatibility Notes",
  compatibilityNotesPlaceholder:
    "Optional compatibility notes for characters, outfits, poses, locations, or visual genres.",
});

export function limitImagePresetPromptValue(value, maxLength) {
  return String(value || "").slice(0, maxLength);
}

export function getImagePresetPromptStackSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    promptGuidanceValue: data.prompt_guidance || data.prompt || "",
    stylePromptValue: data.style_prompt || "",
    qualityNotesValue: data.quality_notes || "",
    imagePromptValue: data.image_prompt || "",
    negativePromptValue: data.negative_prompt || "",
    usageNotesValue: data.usage_notes || "",
    compatibilityNotesValue: data.compatibility_notes || "",
    onChangePromptGuidance: (value) =>
      updateDataField?.("prompt_guidance", value),
    onChangeStylePrompt: (value) => updateDataField?.("style_prompt", value),
    onChangeQualityNotes: (value) =>
      updateDataField?.("quality_notes", value),
    onChangeImagePrompt: (value) =>
      updateDataField?.(
        "image_prompt",
        limitImagePresetPromptValue(value, IMAGE_PRESET_IMAGE_PROMPT_MAX_LENGTH)
      ),
    onChangeNegativePrompt: (value) =>
      updateDataField?.(
        "negative_prompt",
        limitImagePresetPromptValue(
          value,
          IMAGE_PRESET_NEGATIVE_PROMPT_MAX_LENGTH
        )
      ),
    onChangeUsageNotes: (value) => updateDataField?.("usage_notes", value),
    onChangeCompatibilityNotes: (value) =>
      updateDataField?.("compatibility_notes", value),
  };
}

export function useImagePresetPromptStackSectionViewModel(props = {}) {
  return getImagePresetPromptStackSectionViewProps(props);
}

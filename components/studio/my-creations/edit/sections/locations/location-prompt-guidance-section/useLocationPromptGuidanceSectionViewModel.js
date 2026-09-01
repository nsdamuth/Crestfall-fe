"use client";

export const LOCATION_IMAGE_PROMPT_MAX_LENGTH = 2000;
export const LOCATION_NEGATIVE_PROMPT_MAX_LENGTH = 300;

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Location Editor",
  sectionTitle: "Prompt Guidance",
  sectionDescription:
    "Edit the reusable image-generation guidance this location contributes when selected in Image Studio.",
  promptGuidanceLabel: "Prompt Guidance",
  promptGuidancePlaceholder:
    "Reusable image-generation wording for this location.",
  imagePromptLabel: "Standalone Image Prompt",
  imagePromptPlaceholder:
    "Optional standalone prompt for generating environment, catalogue, or reference images of this location as its own visual asset. Max 2,000 characters.",
  negativePromptLabel: "Negative Prompt",
  negativePromptPlaceholder:
    "Optional negatives this location should contribute when selected in image generation. Example: no modern electronics, no empty white room, no outdoor scene. Max 300 characters.",
  usageNotesLabel: "Usage Notes",
  usageNotesPlaceholder:
    "When should this location be used? What scenes, characters, moods, or image presets does it support?",
  compatibilityNotesLabel: "Compatibility Notes",
  compatibilityNotesPlaceholder:
    "Optional compatibility notes for characters, poses, outfits, image presets, or story moods.",
  registryNotesLabel: "Future Registry Notes",
  registryNotesPlaceholder:
    "Optional notes for future Location Registry links. This visual asset can describe how a registry location should look.",
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeText(value) {
  return value === null || value === undefined ? "" : String(value);
}

export function limitLocationPromptValue(value, maxLength) {
  return normalizeText(value).slice(0, maxLength);
}

export function normalizeLocationPromptGuidanceData(data = {}) {
  const source = normalizeObject(data);

  return {
    promptGuidance: normalizeText(
      source.prompt_guidance || source.prompt || ""
    ),
    imagePrompt: normalizeText(source.image_prompt),
    negativePrompt: limitLocationPromptValue(
      source.negative_prompt,
      LOCATION_NEGATIVE_PROMPT_MAX_LENGTH
    ),
    usageNotes: normalizeText(source.usage_notes),
    compatibilityNotes: normalizeText(source.compatibility_notes),
    registryNotes: normalizeText(source.registry_notes),
  };
}

export function useLocationPromptGuidanceSectionViewModel({
  form = {},
  updateDataField = null,
} = {}) {
  const values = normalizeLocationPromptGuidanceData(form?.data);

  return {
    ...DEFAULT_COPY,
    promptGuidanceValue: values.promptGuidance,
    imagePromptValue: values.imagePrompt,
    imagePromptMaxLength: LOCATION_IMAGE_PROMPT_MAX_LENGTH,
    negativePromptValue: values.negativePrompt,
    negativePromptMaxLength: LOCATION_NEGATIVE_PROMPT_MAX_LENGTH,
    usageNotesValue: values.usageNotes,
    compatibilityNotesValue: values.compatibilityNotes,
    registryNotesValue: values.registryNotes,
    onChangePromptGuidance: (value) =>
      updateDataField?.("prompt_guidance", value),
    onChangeImagePrompt: (value) =>
      updateDataField?.(
        "image_prompt",
        limitLocationPromptValue(value, LOCATION_IMAGE_PROMPT_MAX_LENGTH)
      ),
    onChangeNegativePrompt: (value) =>
      updateDataField?.(
        "negative_prompt",
        limitLocationPromptValue(value, LOCATION_NEGATIVE_PROMPT_MAX_LENGTH)
      ),
    onChangeUsageNotes: (value) => updateDataField?.("usage_notes", value),
    onChangeCompatibilityNotes: (value) =>
      updateDataField?.("compatibility_notes", value),
    onChangeRegistryNotes: (value) =>
      updateDataField?.("registry_notes", value),
  };
}

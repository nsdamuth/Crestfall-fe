"use client";

import { useState } from "react";
import {
  createLocationCustomImageViewId,
  normalizeLocationCustomImageViews,
  LOCATION_CUSTOM_VIEW_LABEL_MAX_LENGTH,
} from "@/lib/shared/image-generation/locationImageViews";

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
  imagePromptLabel: "General Image Prompt",
  imagePromptPlaceholder:
    "Optional fallback image prompt used when no Interior, Exterior, or Scenic prompt is available. Max 2,000 characters.",
  negativePromptLabel: "General Negative Prompt",
  negativePromptPlaceholder:
    "Optional fallback negatives used when no matching Interior, Exterior, or Scenic negative prompt is available. Max 300 characters.",
  interiorPromptLabel: "Interior Prompt",
  interiorPromptPlaceholder:
    "Optional guidance for images rendered from inside this location. Max 2,000 characters.",
  interiorNegativePromptLabel: "Interior Negative Prompt",
  interiorNegativePromptPlaceholder:
    "Optional negatives specific to interior views. Max 300 characters.",
  exteriorPromptLabel: "Exterior Prompt",
  exteriorPromptPlaceholder:
    "Optional guidance for images rendered from outside or approaching this location. Max 2,000 characters.",
  exteriorNegativePromptLabel: "Exterior Negative Prompt",
  exteriorNegativePromptPlaceholder:
    "Optional negatives specific to exterior views. Max 300 characters.",
  scenicPromptLabel: "Scenic Prompt",
  scenicPromptPlaceholder:
    "Optional guidance for broad establishing, aerial, elevated, distant, panoramic, skyline, or realm-scale views. Max 2,000 characters.",
  scenicNegativePromptLabel: "Scenic Negative Prompt",
  scenicNegativePromptPlaceholder:
    "Optional negatives specific to scenic or establishing views. Max 300 characters.",
  customViewsTitle: "Additional Views",
  customViewsDescription:
    "Create reusable named views for specific districts, rooms, landmarks, perspectives, or other visual contexts within this Location.",
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
    interiorPrompt: limitLocationPromptValue(
      source.interior_image_prompt || source.interiorImagePrompt,
      LOCATION_IMAGE_PROMPT_MAX_LENGTH
    ),
    interiorNegativePrompt: limitLocationPromptValue(
      source.interior_negative_prompt || source.interiorNegativePrompt,
      LOCATION_NEGATIVE_PROMPT_MAX_LENGTH
    ),
    exteriorPrompt: limitLocationPromptValue(
      source.exterior_image_prompt || source.exteriorImagePrompt,
      LOCATION_IMAGE_PROMPT_MAX_LENGTH
    ),
    exteriorNegativePrompt: limitLocationPromptValue(
      source.exterior_negative_prompt || source.exteriorNegativePrompt,
      LOCATION_NEGATIVE_PROMPT_MAX_LENGTH
    ),
    scenicPrompt: limitLocationPromptValue(
      source.scenic_image_prompt || source.scenicImagePrompt,
      LOCATION_IMAGE_PROMPT_MAX_LENGTH
    ),
    scenicNegativePrompt: limitLocationPromptValue(
      source.scenic_negative_prompt || source.scenicNegativePrompt,
      LOCATION_NEGATIVE_PROMPT_MAX_LENGTH
    ),
    customViews: normalizeLocationCustomImageViews(
      source.custom_image_views || source.customImageViews
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
  const [customViewEditor, setCustomViewEditor] = useState(null);

  function openAddCustomView() {
    setCustomViewEditor({
      editingId: null,
      label: "",
      prompt: "",
      negativePrompt: "",
    });
  }

  function openEditCustomView(id) {
    const view = values.customViews.find((entry) => entry.id === id);
    if (!view) return;

    setCustomViewEditor({
      editingId: view.id,
      label: view.label,
      prompt: view.prompt,
      negativePrompt: view.negative_prompt,
    });
  }

  function updateCustomViewEditor(field, value) {
    setCustomViewEditor((current) =>
      current
        ? {
            ...current,
            [field]:
              field === "label"
                ? String(value || "").slice(0, LOCATION_CUSTOM_VIEW_LABEL_MAX_LENGTH)
                : field === "negativePrompt"
                  ? limitLocationPromptValue(
                      value,
                      LOCATION_NEGATIVE_PROMPT_MAX_LENGTH
                    )
                  : limitLocationPromptValue(
                      value,
                      LOCATION_IMAGE_PROMPT_MAX_LENGTH
                    ),
          }
        : current
    );
  }

  function saveCustomView() {
    if (!customViewEditor) return;

    const label = String(customViewEditor.label || "").trim();
    const prompt = limitLocationPromptValue(
      customViewEditor.prompt,
      LOCATION_IMAGE_PROMPT_MAX_LENGTH
    ).trim();
    if (!label || !prompt) return;

    const editingId = customViewEditor.editingId;
    const id =
      editingId || createLocationCustomImageViewId(label, values.customViews);
    const nextEntry = {
      id,
      label,
      prompt,
      negative_prompt: limitLocationPromptValue(
        customViewEditor.negativePrompt,
        LOCATION_NEGATIVE_PROMPT_MAX_LENGTH
      ).trim(),
    };
    const nextViews = editingId
      ? values.customViews.map((entry) =>
          entry.id === editingId ? nextEntry : entry
        )
      : [...values.customViews, nextEntry];

    updateDataField?.("custom_image_views", nextViews);
    setCustomViewEditor(null);
  }

  function removeCustomView(id) {
    updateDataField?.(
      "custom_image_views",
      values.customViews.filter((entry) => entry.id !== id)
    );

    if (customViewEditor?.editingId === id) {
      setCustomViewEditor(null);
    }
  }

  return {
    ...DEFAULT_COPY,
    promptGuidanceValue: values.promptGuidance,
    imagePromptValue: values.imagePrompt,
    imagePromptMaxLength: LOCATION_IMAGE_PROMPT_MAX_LENGTH,
    negativePromptValue: values.negativePrompt,
    negativePromptMaxLength: LOCATION_NEGATIVE_PROMPT_MAX_LENGTH,
    interiorPromptValue: values.interiorPrompt,
    interiorPromptMaxLength: LOCATION_IMAGE_PROMPT_MAX_LENGTH,
    interiorNegativePromptValue: values.interiorNegativePrompt,
    interiorNegativePromptMaxLength: LOCATION_NEGATIVE_PROMPT_MAX_LENGTH,
    exteriorPromptValue: values.exteriorPrompt,
    exteriorPromptMaxLength: LOCATION_IMAGE_PROMPT_MAX_LENGTH,
    exteriorNegativePromptValue: values.exteriorNegativePrompt,
    exteriorNegativePromptMaxLength: LOCATION_NEGATIVE_PROMPT_MAX_LENGTH,
    scenicPromptValue: values.scenicPrompt,
    scenicPromptMaxLength: LOCATION_IMAGE_PROMPT_MAX_LENGTH,
    scenicNegativePromptValue: values.scenicNegativePrompt,
    scenicNegativePromptMaxLength: LOCATION_NEGATIVE_PROMPT_MAX_LENGTH,
    customViews: values.customViews,
    customViewEditor,
    customViewLabelMaxLength: LOCATION_CUSTOM_VIEW_LABEL_MAX_LENGTH,
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
    onChangeInteriorPrompt: (value) =>
      updateDataField?.(
        "interior_image_prompt",
        limitLocationPromptValue(value, LOCATION_IMAGE_PROMPT_MAX_LENGTH)
      ),
    onChangeInteriorNegativePrompt: (value) =>
      updateDataField?.(
        "interior_negative_prompt",
        limitLocationPromptValue(value, LOCATION_NEGATIVE_PROMPT_MAX_LENGTH)
      ),
    onChangeExteriorPrompt: (value) =>
      updateDataField?.(
        "exterior_image_prompt",
        limitLocationPromptValue(value, LOCATION_IMAGE_PROMPT_MAX_LENGTH)
      ),
    onChangeExteriorNegativePrompt: (value) =>
      updateDataField?.(
        "exterior_negative_prompt",
        limitLocationPromptValue(value, LOCATION_NEGATIVE_PROMPT_MAX_LENGTH)
      ),
    onChangeScenicPrompt: (value) =>
      updateDataField?.(
        "scenic_image_prompt",
        limitLocationPromptValue(value, LOCATION_IMAGE_PROMPT_MAX_LENGTH)
      ),
    onChangeScenicNegativePrompt: (value) =>
      updateDataField?.(
        "scenic_negative_prompt",
        limitLocationPromptValue(value, LOCATION_NEGATIVE_PROMPT_MAX_LENGTH)
      ),
    onAddCustomView: openAddCustomView,
    onEditCustomView: openEditCustomView,
    onRemoveCustomView: removeCustomView,
    onChangeCustomViewEditor: updateCustomViewEditor,
    onSaveCustomView: saveCustomView,
    onCloseCustomViewEditor: () => setCustomViewEditor(null),
    onChangeUsageNotes: (value) => updateDataField?.("usage_notes", value),
    onChangeCompatibilityNotes: (value) =>
      updateDataField?.("compatibility_notes", value),
    onChangeRegistryNotes: (value) =>
      updateDataField?.("registry_notes", value),
  };
}

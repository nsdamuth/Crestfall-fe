import {
  bodyTypeOptions,
  heightOptions,
  buildOptions,
  proportionOptions,
} from "@/components/studio/create/character/constants/constants";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Character Editor",
  sectionTitle: "Body",
  sectionDescription:
    "Edit physical silhouette fields using the same guided controls from character creation.",
  bodyTypeLabel: "Body Type",
  bodyTypeDescription: "Choose a broad body silhouette.",
  heightLabel: "Height",
  heightDescription:
    "Use relative adult height descriptors rather than exact measurements.",
  buildLabel: "Build",
  buildDescription: "Choose how the character’s frame feels physically.",
  proportionsLabel: "Proportions",
  proportionsDescription:
    "Optional silhouette emphasis for image generation and narration. You can select multiple compatible traits.",
  bodyPromptLabel: "Custom Body Prompt",
  bodyPromptPlaceholder:
    "Optional model-neutral physical details that should affect image generation across all rendering styles.",
  fantasyPromptLabel: "Fantasy Specific Prompt Details",
  fantasyPromptPlaceholder:
    "Optional short guidance applied only to fantasy and anime rendering stages.",
  realisticPromptLabel: "Realistic Specific Prompt Details",
  realisticPromptPlaceholder:
    "Optional short guidance applied only to realistic rendering stages.",
});

export function normalizeCharacterProportions(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  const single = String(value || "").trim();
  return single ? [single] : [];
}

export function getCharacterBodySectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};
  const bodyData = {
    ...data,
    proportions: normalizeCharacterProportions(data.proportions),
  };

  return {
    ...DEFAULT_COPY,
    bodyData,
    bodyTypeField: "body_type",
    heightField: "height",
    buildField: "build",
    proportionsField: "proportions",
    bodyTypeOptions,
    heightOptions,
    buildOptions,
    proportionOptions,
    bodyPromptValue: data.body_notes || "",
    fantasyPromptValue: data.fantasy_body_notes || "",
    realisticPromptValue: data.realistic_body_notes || "",
    onChangeCharacterField: (field, value) =>
      updateDataField?.(field, value),
    onChangeBodyPrompt: (value) => updateDataField?.("body_notes", value),
    onChangeFantasyPrompt: (value) =>
      updateDataField?.("fantasy_body_notes", value),
    onChangeRealisticPrompt: (value) =>
      updateDataField?.("realistic_body_notes", value),
  };
}

export function useCharacterBodySectionViewModel(props = {}) {
  return getCharacterBodySectionViewProps(props);
}

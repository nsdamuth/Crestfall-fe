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
  bodyNotesLabel: "Custom Body Notes",
  bodyNotesPlaceholder:
    "Optional physical details that should affect image generation or narration.",
});

export function normalizeCharacterProportions(value) {
  return Array.isArray(value) ? value : [];
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
    bodyNotesValue: data.body_notes || "",
    onChangeCharacterField: (field, value) =>
      updateDataField?.(field, value),
    onChangeBodyNotes: (value) => updateDataField?.("body_notes", value),
  };
}

export function useCharacterBodySectionViewModel(props = {}) {
  return getCharacterBodySectionViewProps(props);
}

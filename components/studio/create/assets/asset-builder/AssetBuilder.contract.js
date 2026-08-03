export const ASSET_BUILDER_VIEW_CONTRACT_VERSION = "1.0.0";

export const ASSET_IMAGE_PROMPT_MAX_LENGTH = 2000;
export const ASSET_NEGATIVE_PROMPT_MAX_LENGTH = 2000;

export const ASSET_VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
]);

export const ASSET_CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
]);

export const ASSET_RENDERING_STYLE_OPTIONS = Object.freeze([
  { value: "EITHER", label: "Either / Auto" },
  { value: "ANIME", label: "Anime" },
  { value: "REALISTIC", label: "Realistic" },
]);

export const ASSET_IMAGE_COUNT_OPTIONS = Object.freeze([
  { value: "2", label: "2 images" },
  { value: "4", label: "4 images" },
  { value: "8", label: "8 images" },
]);

/**
 * Portable View contract.
 *
 * The View receives normalized builder configuration, visual form values,
 * location presentation state, application-owned location slots, save state,
 * and semantic callbacks. It must not create persistence payloads, call APIs,
 * navigate, or import application Binding Shells.
 */
export const ASSET_BUILDER_VIEW_CONTRACT = Object.freeze({
  config: "normalized asset builder configuration",
  creationType: "OUTFIT | POSE | IMAGE_PRESET | LOCATION",
  form: "normalized visual asset form values",
  extraFields: "array",
  extraValues: "object",
  candidates: "array",
  selectedCover: "string | null",
  supportsImagePromptFields: "boolean",
  parentLocation: "normalized parent-location presentation state",
  options: {
    visibilityOptions: "array",
    contentRatingOptions: "array",
    renderingStyleOptions: "array",
    imageCountOptions: "array",
  },
  locationRuntimeContent: "ReactNode | null",
  locationRegistryContent: "ReactNode | null",
  parentPickerContent: "ReactNode | null",
  saveStatus: "idle | saving | saved | error",
  saveMessage: "string",
  saveDisabled: "boolean",
  onUpdateField: "function(field, value)",
  onUpdateExtra: "function(field, value)",
  onSelectCover: "function(candidateId)",
  onOpenParentPicker: "function()",
  onClearParentLocation: "function()",
  onSave: "function()",
});

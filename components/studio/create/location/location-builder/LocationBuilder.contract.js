export const LOCATION_BUILDER_VIEW_CONTRACT_VERSION = "1.0.0";

export const LOCATION_IMAGE_PROMPT_MAX_LENGTH = 2000;
export const LOCATION_NEGATIVE_PROMPT_MAX_LENGTH = 300;

export const LOCATION_VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
]);

export const LOCATION_CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
]);

export const LOCATION_RENDERING_STYLE_OPTIONS = Object.freeze([
  { value: "EITHER", label: "Either / Auto" },
  { value: "ANIME", label: "Anime" },
  { value: "REALISTIC", label: "Realistic" },
]);

export const LOCATION_IMAGE_COUNT_OPTIONS = Object.freeze([
  { value: "2", label: "2 images" },
  { value: "4", label: "4 images" },
  { value: "8", label: "8 images" },
]);

/**
 * Portable View contract.
 *
 * The View receives normalized location-authoring state, semantic callbacks,
 * and application-owned runtime/registry/picker slots. It must not build the
 * stored creation payload, call APIs, navigate, or import another Crestfall
 * Binding Shell.
 */
export const LOCATION_BUILDER_VIEW_CONTRACT = Object.freeze({
  form: "normalized location identity and image-authoring fields",
  locationData: "normalized hierarchy, inheritance, and runtime summary data",
  classificationFields: "array of semantic select-field definitions",
  promptLabel: "string",
  promptPlaceholder: "string",
  candidates: "array of cover candidate presentation items",
  selectedCover: "string | null",
  runtimeSummary: {
    registryCount: "number",
    hasWeatherModule: "boolean",
    hasTimeCalendarModule: "boolean",
  },
  saveStatus: "idle | saving | saved | error",
  saveMessage: "string",
  saveDisabled: "boolean",
  slots: {
    sensoryEnvironmentContent: "ReactNode | null",
    runtimeModulesContent: "ReactNode | null",
    registryAttachmentsContent: "ReactNode | null",
    parentPickerContent: "ReactNode | null",
  },
  onUpdateField: "function(field, value)",
  onUpdateLocationData: "function(field, value)",
  onUpdateInheritance: "function(field, value)",
  onSelectCover: "function(candidateId)",
  onOpenParentPicker: "function()",
  onClearParentLocation: "function()",
  onSave: "function()",
});

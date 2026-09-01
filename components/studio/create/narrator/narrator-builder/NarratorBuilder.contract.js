export const NARRATOR_BUILDER_VIEW_CONTRACT_VERSION = "1.1.0";

export const NARRATOR_BUILDER_DEFAULT_MODULES = Object.freeze({
  prose_style: "cinematic",
  detail_level: "balanced",
  pacing: "balanced",
  dialogue_style: "naturalistic",
  knowledge_behavior: "moderate",
  atmosphere: "adventurous",
});

/**
 * Portable View contract.
 *
 * The View receives normalized display values, option lists, semantic
 * callbacks, and portable child-View props. It must not call APIs, map
 * Crestfall storage fields, build creation payloads, or navigate.
 */
export const NARRATOR_BUILDER_VIEW_CONTRACT = Object.freeze({
  identity: {
    name: "string",
    description: "string",
    tone: "string",
    narratorGuidance: "string",
    avoidGuidance: "string",
    narratorDirectives: "object | null",
    tags: "string",
    visibility: "string",
    contentRating: "string",
  },
  options: {
    toneOptions: "array",
    visibilityOptions: "array",
    contentRatingOptions: "array",
  },
  moduleSummaryItems: "array",
  moduleSelectorViewProps: "object",
  saveStatus: "idle | saving | saved | error",
  saveMessage: "string",
  saveDisabled: "boolean",
  onUpdateField: "function(field, value)",
  onSave: "function()",
});

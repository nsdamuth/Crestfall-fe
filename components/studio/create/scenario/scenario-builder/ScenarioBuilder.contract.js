export const SCENARIO_BUILDER_VIEW_CONTRACT_VERSION = "scenario-builder.view.v1";

/**
 * Portable Scenario Builder View contract.
 *
 * The View receives normalized scenario-authoring state, semantic callbacks,
 * and presentation-ready reference fields. It must not load creations, build
 * persistence payloads, navigate, or import the Scenario reference picker Shell.
 */
export const SCENARIO_BUILDER_VIEW_CONTRACT = Object.freeze({
  form: "normalized Scenario identity, runtime, and publishing fields",
  circle: "story-circle values keyed by canonical step id",
  enabledModules: "middleware intent flags keyed by module id",
  completion: "number from 0 through 100",
  storyCircleSteps: "presentation-ready story-circle definitions",
  middlewareModules: "presentation-ready middleware definitions",
  referenceFields: "semantic reference selector field definitions",
  referenceLoadError: "string",
  saveStatus: "idle | saving | saved | error",
  saveMessage: "string",
  saveDisabled: "boolean",
  onUpdateField: "function(field, value)",
  onUpdateCircle: "function(stepId, value)",
  onToggleModule: "function(moduleId)",
  onSave: "function()",
});

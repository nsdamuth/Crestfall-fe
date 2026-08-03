export const MECHANICS_PRESET_APPLICATION_MODAL_VIEW_CONTRACT_VERSION =
  "1.1.0";

/**
 * Portable View contract for the Mechanics Preset Library.
 *
 * The View receives display-ready preset cards, target-command choices,
 * application modes, preview evidence, reference live-validation guidance,
 * validation issues, and semantic user actions. It does not know creation JSONB
 * storage, updateDataField, services,
 * or persistence payloads.
 */
export const MECHANICS_PRESET_APPLICATION_MODAL_VIEW_CONTRACT = Object.freeze({
  version: MECHANICS_PRESET_APPLICATION_MODAL_VIEW_CONTRACT_VERSION,
  values: [
    "title",
    "description",
    "query",
    "scopeFilter",
    "scopeOptions",
    "presetCards",
    "selectedPresetId",
    "selectedPreset",
    "commandTargets",
    "selectedCommandId",
    "requiresCommandTarget",
    "applyModeOptions",
    "selectedApplyMode",
    "preview",
    "errors",
    "warnings",
    "confirmationRequired",
    "replacementConfirmed",
    "canApply",
    "statusMessage",
  ],
  callbacks: [
    "onClose",
    "onChangeQuery",
    "onChooseScope",
    "onChoosePreset",
    "onChooseCommand",
    "onChooseApplyMode",
    "onToggleReplacementConfirmation",
    "onApplyPreset",
  ],
});

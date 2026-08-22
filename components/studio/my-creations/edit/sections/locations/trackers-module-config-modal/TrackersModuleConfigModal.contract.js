export const TRACKERS_MODULE_CONFIG_MODAL_VIEW_CONTRACT_VERSION =
  "trackers-module-config-modal.view.v1";

export const trackersModuleConfigModalViewContract = Object.freeze({
  version: TRACKERS_MODULE_CONFIG_MODAL_VIEW_CONTRACT_VERSION,
  purpose:
    "Render and edit a location's abstract mechanics fields (meters), event-driven mutation hints/effects, and guard/gate rules, without owning Location binding persistence.",
  inputs: Object.freeze({
    lifecycle: ["message", "messageTone", "hasUnsavedChanges"],
    identity: ["locationTitle", "eyebrow", "title", "description", "moduleId"],
    form: ["form", "trackerOptions", "targetOptions", "percentByTrackerId"],
  }),
  callbacks: Object.freeze([
    "onClose",
    "onSave",
    "onToggleEnabled",
    "onInheritanceModeChange",
    "onPriorityChange",
    "onAddTracker",
    "onAddGuard",
    "onClearAll",
    "onUpdateTracker",
    "onRemoveTracker",
    "onAddPhase",
    "onUpdatePhase",
    "onRemovePhase",
    "onAddHint",
    "onUpdateHint",
    "onRemoveHint",
    "onAddEffect",
    "onUpdateEffect",
    "onRemoveEffect",
    "onUpdateGuard",
    "onRemoveGuard",
    "onAddCondition",
    "onUpdateCondition",
    "onRemoveCondition",
  ]),
  storage: Object.freeze({
    moduleId: "core.trackers.v1",
    instanceDataVersion: "trackers_instance_data.v0_1",
  }),
});

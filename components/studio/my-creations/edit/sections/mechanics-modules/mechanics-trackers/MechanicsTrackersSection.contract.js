export const MECHANICS_TRACKERS_CONTRACT_VERSION =
  "crestfall.loom.mechanics-trackers.v1";

export const MECHANICS_TRACKERS_PHASE = "M2";
export const MECHANICS_TRACKERS_STATUS = "ACTIVE_DOMAIN_PACKAGE";
export const MECHANICS_TRACKERS_STORAGE_PATH = "instanceData.trackers";

export const MECHANICS_TRACKER_KINDS = Object.freeze(["meter"]);

export const MECHANICS_TRACKER_KEYS = Object.freeze([
  "id",
  "kind",
  "label",
  "min",
  "max",
  "initial",
  "phases",
  "mutationHints",
]);

export const MECHANICS_TRACKER_PHASE_KEYS = Object.freeze([
  "id",
  "label",
  "min",
  "max",
]);

export const MECHANICS_TRACKER_MUTATION_HINT_KEYS = Object.freeze([
  "id",
  "eventTypes",
  "triggers",
  "delta",
  "reason",
]);

export const MECHANICS_TRACKER_LEGACY_ALIASES = Object.freeze({
  mutationHints: Object.freeze(["mutation_hints"]),
  eventTypes: Object.freeze(["event_types"]),
  delta: Object.freeze(["amount"]),
});

export const TRACKERS_MODULE_CONFIG_MODAL_CLASSIFICATION =
  "QUARANTINED_UNREFERENCED_LEGACY_OR_FUTURE";

export const MECHANICS_COMPATIBILITY_BASELINE_CONTRACT_VERSION =
  "crestfall.loom.mechanics-compatibility-baseline.v1";

export const MECHANICS_COMPATIBILITY_BASELINE_PHASE = "M0";
export const MECHANICS_COMPATIBILITY_BASELINE_STATUS =
  "FROZEN_BEFORE_DOMAIN_EXTRACTION";

export const MECHANICS_CURRENT_IDENTITIES = Object.freeze({
  builder: "MECHANICS_MODULE_BUILDER",
  builderVersion: "0.3",
  moduleDefinitionId: "core.trackers.v1",
  moduleId: "core.trackers.v1",
  contractVersion: "trackers_instance_data.v0_2",
  defaultOperation: "get_tracker_context",
  defaultPriority: 65,
});

export const MECHANICS_ROOT_STORAGE_PATHS = Object.freeze([
  "builder",
  "builder_version",
  "moduleDefinitionId",
  "moduleId",
  "contractVersion",
  "priority",
  "operationTriggers",
  "tags",
  "instanceData",
]);

export const MECHANICS_INSTANCE_STORAGE_PATHS = Object.freeze([
  "contractVersion",
  "trackers",
  "commands",
  "defaults.flags",
  "defaults.counters",
  "defaults.stages",
  "statusBlocks",
  "guards",
]);

export const MECHANICS_ATOMIC_REPLACEMENT_BOUNDARIES = Object.freeze([
  Object.freeze({ id: "CREATE_PARENT", operation: "replaceMechanicsData(nextData)", storageBoundary: "form.data" }),
  Object.freeze({ id: "EDIT_PARENT", operation: 'updateField("data", nextData)', storageBoundary: "form.data" }),
  Object.freeze({ id: "JSON_APPLICATION", operation: "replaceMechanicsData(nextData)", storageBoundary: "complete Mechanics data document" }),
  Object.freeze({ id: "PRESET_APPLICATION", operation: "replaceMechanicsData(nextData)", storageBoundary: "complete Mechanics data document" }),
]);

export const MECHANICS_CREATE_PAYLOAD_ALLOWLIST = Object.freeze({
  root: MECHANICS_ROOT_STORAGE_PATHS,
  instanceData: MECHANICS_INSTANCE_STORAGE_PATHS,
  behavior:
    "Create currently projects the documented root and instanceData fields. Unknown create-draft keys are not promised to survive this projection and must be addressed deliberately in M1 rather than silently changing M0 behavior.",
});

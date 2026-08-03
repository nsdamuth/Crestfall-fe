export const MECHANICS_DOCUMENT_CORE_CONTRACT_VERSION =
  "crestfall.loom.mechanics-document-core.v1";

export const MECHANICS_DOCUMENT_CORE_PHASE = "M1";
export const MECHANICS_DOCUMENT_CORE_STATUS =
  "ACTIVE_SHARED_COMPATIBILITY_LAYER";

export const MECHANICS_DOCUMENT_IDENTITIES = Object.freeze({
  builder: "MECHANICS_MODULE_BUILDER",
  builderVersion: "0.3",
  moduleDefinitionId: "core.trackers.v1",
  moduleId: "core.trackers.v1",
  contractVersion: "trackers_instance_data.v0_2",
  defaultOperation: "get_tracker_context",
  defaultPriority: 65,
});

export const MECHANICS_DOCUMENT_CANONICAL_ROOT_KEYS = Object.freeze([
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

export const MECHANICS_DOCUMENT_CANONICAL_INSTANCE_KEYS = Object.freeze([
  "contractVersion",
  "trackers",
  "commands",
  "defaults",
  "statusBlocks",
  "guards",
]);

export const MECHANICS_DOCUMENT_DEFAULT_BUCKET_KEYS = Object.freeze([
  "flags",
  "counters",
  "stages",
]);

export const MECHANICS_DOCUMENT_LEGACY_ALIASES = Object.freeze({
  builderVersion: Object.freeze(["builderVersion"]),
  moduleDefinitionId: Object.freeze(["module_definition_id"]),
  moduleId: Object.freeze(["module_id"]),
  contractVersion: Object.freeze(["contract_version"]),
  operationTriggers: Object.freeze(["operation_triggers"]),
  instanceData: Object.freeze(["instance_data"]),
  instanceContractVersion: Object.freeze(["contract_version"]),
  statusBlocks: Object.freeze(["status_blocks"]),
  chatTurnDefault: Object.freeze(["chat_turn_default"]),
});

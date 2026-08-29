import { MECHANICS_DOCUMENT_IDENTITIES } from "./MechanicsDocumentCore.contract.js";

export function createDefaultMechanicsInstanceData() {
  return {
    contractVersion: MECHANICS_DOCUMENT_IDENTITIES.contractVersion,
    trackers: [],
    commands: [],
    defaults: {
      flags: [],
      counters: [],
      stages: [],
    },
    statusBlocks: [],
    storyStatusSurfaces: [],
    guards: [],
  };
}

export function createDefaultMechanicsDocument() {
  return {
    builder: MECHANICS_DOCUMENT_IDENTITIES.builder,
    builder_version: MECHANICS_DOCUMENT_IDENTITIES.builderVersion,
    moduleDefinitionId: MECHANICS_DOCUMENT_IDENTITIES.moduleDefinitionId,
    moduleId: MECHANICS_DOCUMENT_IDENTITIES.moduleId,
    contractVersion: MECHANICS_DOCUMENT_IDENTITIES.contractVersion,
    priority: MECHANICS_DOCUMENT_IDENTITIES.defaultPriority,
    operationTriggers: {
      chatTurnDefault: MECHANICS_DOCUMENT_IDENTITIES.defaultOperation,
    },
    tags: [],
    instanceData: createDefaultMechanicsInstanceData(),
  };
}

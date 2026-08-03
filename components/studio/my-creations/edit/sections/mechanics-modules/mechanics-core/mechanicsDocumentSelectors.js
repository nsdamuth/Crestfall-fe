import { normalizeMechanicsDocument } from "./mechanicsDocumentNormalization.js";

export function selectMechanicsInstanceData(document) {
  return normalizeMechanicsDocument(document).instanceData;
}

export function selectMechanicsModuleIdentity(document) {
  const normalized = normalizeMechanicsDocument(document);

  return {
    moduleDefinitionId: normalized.moduleDefinitionId,
    moduleId: normalized.moduleId,
    contractVersion: normalized.contractVersion,
    priority: normalized.priority,
    tags: normalized.tags,
  };
}

export function selectMechanicsDomainCounts(document) {
  const instanceData = selectMechanicsInstanceData(document);

  return {
    trackers: instanceData.trackers.length,
    commands: instanceData.commands.length,
    defaults:
      instanceData.defaults.flags.length +
      instanceData.defaults.counters.length +
      instanceData.defaults.stages.length,
    statusBlocks: instanceData.statusBlocks.length,
    guards: instanceData.guards.length,
  };
}

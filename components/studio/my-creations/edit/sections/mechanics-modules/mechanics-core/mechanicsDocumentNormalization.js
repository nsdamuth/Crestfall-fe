import { MECHANICS_DOCUMENT_IDENTITIES } from "./MechanicsDocumentCore.contract.js";
import {
  normalizeMechanicsDefaults as normalizeMechanicsDefaultsDomain,
} from "../mechanics-defaults/mechanicsDefaultsNormalization.js";
import {
  normalizeMechanicsStatusBlocks as normalizeMechanicsStatusBlocksDomain,
} from "../mechanics-status-blocks/mechanicsStatusBlocksNormalization.js";
import {
  normalizeMechanicsGuards as normalizeMechanicsGuardsDomain,
} from "../mechanics-guards/mechanicsGuardsNormalization.js";
import {
  createDefaultMechanicsDocument,
  createDefaultMechanicsInstanceData,
} from "./mechanicsDocumentDefaults.js";

export function isMechanicsPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function asMechanicsObject(value) {
  return isMechanicsPlainObject(value) ? value : {};
}

export function asMechanicsArray(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeMechanicsString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeMechanicsNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function normalizeMechanicsTags(value) {
  const source = Array.isArray(value) ? value : String(value || "").split(",");

  return source
    .map((tag) => normalizeMechanicsString(tag))
    .filter(Boolean);
}

function firstDefined(source, canonicalKey, aliases = []) {
  if (source[canonicalKey] !== undefined && source[canonicalKey] !== null) {
    return source[canonicalKey];
  }

  for (const alias of aliases) {
    if (source[alias] !== undefined && source[alias] !== null) {
      return source[alias];
    }
  }

  return undefined;
}

export function normalizeMechanicsDefaults(value) {
  return normalizeMechanicsDefaultsDomain(value);
}

export function normalizeMechanicsStatusBlocks(value) {
  return normalizeMechanicsStatusBlocksDomain(value);
}

export function normalizeMechanicsGuards(value) {
  return normalizeMechanicsGuardsDomain(value);
}

export function normalizeMechanicsInstanceData(
  value,
  { contractVersion = MECHANICS_DOCUMENT_IDENTITIES.contractVersion } = {}
) {
  const source = asMechanicsObject(value);
  const fallback = createDefaultMechanicsInstanceData();
  const normalizedContractVersion =
    normalizeMechanicsString(
      firstDefined(source, "contractVersion", ["contract_version"])
    ) ||
    normalizeMechanicsString(contractVersion) ||
    fallback.contractVersion;

  return {
    ...source,
    contractVersion: normalizedContractVersion,
    trackers: Array.isArray(source.trackers) ? source.trackers : fallback.trackers,
    commands: Array.isArray(source.commands) ? source.commands : fallback.commands,
    defaults: normalizeMechanicsDefaults(source.defaults),
    statusBlocks: normalizeMechanicsStatusBlocks(
      firstDefined(source, "statusBlocks", ["status_blocks"]) ??
        fallback.statusBlocks
    ),
    guards: normalizeMechanicsGuards(
      firstDefined(source, "guards", ["guard_rules", "guardRules"]) ??
        fallback.guards
    ),
  };
}

export function normalizeMechanicsDocument(value) {
  const source = asMechanicsObject(value);
  const fallback = createDefaultMechanicsDocument();
  const sourceInstanceData = asMechanicsObject(
    firstDefined(source, "instanceData", ["instance_data"])
  );
  const contractVersion =
    normalizeMechanicsString(
      firstDefined(source, "contractVersion", ["contract_version"])
    ) ||
    normalizeMechanicsString(
      firstDefined(sourceInstanceData, "contractVersion", ["contract_version"])
    ) ||
    fallback.contractVersion;
  const moduleDefinitionId =
    normalizeMechanicsString(
      firstDefined(source, "moduleDefinitionId", ["module_definition_id"])
    ) ||
    normalizeMechanicsString(firstDefined(source, "moduleId", ["module_id"])) ||
    fallback.moduleDefinitionId;
  const moduleId =
    normalizeMechanicsString(firstDefined(source, "moduleId", ["module_id"])) ||
    moduleDefinitionId;
  const operationTriggersSource = asMechanicsObject(
    firstDefined(source, "operationTriggers", ["operation_triggers"])
  );

  return {
    ...source,
    builder: normalizeMechanicsString(source.builder) || fallback.builder,
    builder_version:
      normalizeMechanicsString(
        firstDefined(source, "builder_version", ["builderVersion"])
      ) || fallback.builder_version,
    moduleDefinitionId,
    moduleId,
    contractVersion,
    priority: normalizeMechanicsNumber(source.priority, fallback.priority),
    operationTriggers: {
      ...operationTriggersSource,
      chatTurnDefault:
        normalizeMechanicsString(
          firstDefined(operationTriggersSource, "chatTurnDefault", [
            "chat_turn_default",
          ])
        ) || fallback.operationTriggers.chatTurnDefault,
    },
    tags: normalizeMechanicsTags(source.tags),
    instanceData: normalizeMechanicsInstanceData(sourceInstanceData, {
      contractVersion,
    }),
  };
}

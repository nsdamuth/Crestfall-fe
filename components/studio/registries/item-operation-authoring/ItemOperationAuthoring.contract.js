export const ITEM_OPERATION_AUTHORING_PRESENTATION_CONTRACT_VERSION =
  "item_operation_authoring.presentation.v1";

export const ITEM_OPERATION_REQUIREMENT_SET_VERSION =
  "item_operation_requirement_set_v0";

export const ITEM_OPERATION_REQUIREMENTS_VERSION =
  "mechanics_command_requirements_v1";

export const ITEM_OPERATION_EFFECT_REFERENCE_VERSION =
  "item_operation_effect_reference_v0";

export const ITEM_OPERATION_EFFECT_AUTHORING_CATALOG_VERSION =
  "item_operation_effect_authoring_catalog_v0";

export const ITEM_OPERATION_REQUIREMENT_SET_LIMIT = 16;
export const ITEM_OPERATION_EFFECT_REFERENCE_LIMIT = 32;

export const ITEM_OPERATION_ACTION_TYPES = Object.freeze([
  "ITEM_GIVE",
  "ITEM_DROP",
  "ITEM_TAKE",
  "ITEM_EQUIP",
  "ITEM_UNEQUIP",
  "ITEM_STORE",
  "ITEM_PLACE",
  "ITEM_USE",
  "ITEM_CONSUME",
  "ITEM_DAMAGE",
  "ITEM_REPAIR",
]);

export const ITEM_OPERATION_EFFECT_TARGET_ROLES = Object.freeze([
  "SOURCE_ACTOR",
  "AUTHORIZED_TARGET",
]);

export const ITEM_OPERATION_EFFECT_AUTHORING_OPTIONS = Object.freeze([
  Object.freeze({
    domain: "STATS_POOLS",
    operation: "MUTATE_POOL",
    version: "actor_mechanics_profile.stats_pools.mutate_pool.v0",
    label: "Mutate Pool",
    defaultArguments: Object.freeze({
      mutationType: "RESTORE",
      poolQuery: "",
      amount: 1,
      bindingId: "stats",
    }),
  }),
  Object.freeze({
    domain: "STATS_POOLS",
    operation: "APPLY_CONDITION",
    version: "actor_mechanics_profile.stats_pools.apply_condition.v0",
    label: "Apply Condition",
    defaultArguments: Object.freeze({
      conditionQuery: "",
      stacks: 1,
      durationPolicy: "PERSISTENT",
      durationTurns: null,
      bindingId: "stats",
    }),
  }),
  Object.freeze({
    domain: "STATS_POOLS",
    operation: "REMOVE_CONDITION",
    version: "actor_mechanics_profile.stats_pools.remove_condition.v0",
    label: "Remove Condition",
    defaultArguments: Object.freeze({
      conditionQuery: "",
      removeStacks: 1,
      removeAll: false,
      bindingId: "stats",
    }),
  }),
  Object.freeze({
    domain: "STATS_POOLS",
    operation: "APPLY_MODIFIER",
    version: "actor_mechanics_profile.stats_pools.apply_modifier.v0",
    label: "Apply Modifier",
    defaultArguments: Object.freeze({
      modifierQuery: "",
      stacks: 1,
      durationPolicy: "PERSISTENT",
      durationTurns: null,
      bindingId: "stats",
    }),
  }),
  Object.freeze({
    domain: "STATS_POOLS",
    operation: "REMOVE_MODIFIER",
    version: "actor_mechanics_profile.stats_pools.remove_modifier.v0",
    label: "Remove Modifier",
    defaultArguments: Object.freeze({
      modifierQuery: "",
      removeStacks: 1,
      removeAll: false,
      bindingId: "stats",
    }),
  }),
  Object.freeze({
    domain: "PROGRESSION",
    operation: "MUTATE_EXPERIENCE",
    version: "actor_mechanics_profile.progression.mutate_experience.v0",
    label: "Mutate Experience",
    defaultArguments: Object.freeze({
      mutationType: "AWARD_EXPERIENCE",
      amount: 1,
      bindingId: "progression",
    }),
  }),
  Object.freeze({
    domain: "SKILLS",
    operation: "ADVANCE_RANK",
    version: "actor_mechanics_profile.skills.advance_rank.v0",
    label: "Advance Skill Rank",
    defaultArguments: Object.freeze({
      skillQuery: "",
      bindingId: "skills",
    }),
  }),
  Object.freeze({
    domain: "WALLET",
    operation: "MUTATE_BALANCE",
    version: "actor_mechanics_profile.wallet.mutate_balance.v0",
    label: "Mutate Wallet Balance",
    defaultArguments: Object.freeze({
      mutationType: "CREDIT",
      currencyQuery: "",
      amount: 1,
      bindingId: "wallet",
    }),
  }),
  Object.freeze({
    domain: "ABILITY_SPELL",
    operation: "SET_KNOWLEDGE",
    version: "actor_mechanics_profile.ability_spell.set_knowledge.v0",
    label: "Set Ability / Spell Knowledge",
    defaultArguments: Object.freeze({
      abilityQuery: "",
      knowledgeState: "KNOWN",
      unlockState: "UNLOCKED",
    }),
  }),
]);

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function upper(value) {
  return text(value).toUpperCase();
}

function normalizeIdentifier(value, fallback = "") {
  return text(value)
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 128) || fallback;
}

export function normalizeItemOperationActionTypes(value) {
  const values = Array.isArray(value) ? value : [value];
  const allowed = new Set(ITEM_OPERATION_ACTION_TYPES);

  return [...new Set(
    values
      .map(upper)
      .map((entry) =>
        entry && !entry.startsWith("ITEM_") ? `ITEM_${entry}` : entry
      )
      .filter((entry) => allowed.has(entry))
  )];
}

export function listItemOperationEffectAuthoringOptions() {
  return ITEM_OPERATION_EFFECT_AUTHORING_OPTIONS.map((entry) => ({
    ...entry,
    targetRoles: [...ITEM_OPERATION_EFFECT_TARGET_ROLES],
    defaultArguments: { ...entry.defaultArguments },
  }));
}

export function resolveItemOperationEffectAuthoringOption({
  domain,
  operation,
} = {}) {
  const normalizedDomain = upper(domain);
  const normalizedOperation = upper(operation);
  const entry = ITEM_OPERATION_EFFECT_AUTHORING_OPTIONS.find(
    (candidate) =>
      candidate.domain === normalizedDomain &&
      candidate.operation === normalizedOperation
  );

  return entry
    ? {
        ...entry,
        targetRoles: [...ITEM_OPERATION_EFFECT_TARGET_ROLES],
        defaultArguments: { ...entry.defaultArguments },
      }
    : null;
}

export function normalizeItemOperationRequirementSet(
  value = {},
  index = 0
) {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  const requirements = Array.isArray(source.requirements)
    ? source.requirements
        .filter(
          (entry) =>
            entry &&
            typeof entry === "object" &&
            !Array.isArray(entry)
        )
        .map((entry) => ({ ...entry }))
    : [];

  return {
    contractVersion: ITEM_OPERATION_REQUIREMENT_SET_VERSION,
    id: normalizeIdentifier(
      source.id,
      `item_requirement_set_${index + 1}`
    ),
    enabled: source.enabled !== false,
    actionTypes: normalizeItemOperationActionTypes(
      source.actionTypes || source.actions
    ),
    requirementMode: "ALL",
    requirementsVersion: ITEM_OPERATION_REQUIREMENTS_VERSION,
    requirements,
    metadata:
      source.metadata &&
      typeof source.metadata === "object" &&
      !Array.isArray(source.metadata)
        ? { ...source.metadata }
        : {},
  };
}

export function normalizeItemOperationEffectReference(
  value = {},
  index = 0
) {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  const domain = upper(source.domain);
  const operation = upper(source.operation);
  const catalogEntry = resolveItemOperationEffectAuthoringOption({
    domain,
    operation,
  });
  const requestedTargetRole = upper(
    source.targetRole || source.target_role
  );
  const targetRole = ITEM_OPERATION_EFFECT_TARGET_ROLES.includes(
    requestedTargetRole
  )
    ? requestedTargetRole
    : "SOURCE_ACTOR";

  return {
    referenceVersion: ITEM_OPERATION_EFFECT_REFERENCE_VERSION,
    id: normalizeIdentifier(
      source.id,
      `item_effect_${index + 1}`
    ),
    enabled: source.enabled !== false,
    actionTypes: normalizeItemOperationActionTypes(
      source.actionTypes || source.actions
    ),
    domain,
    operation,
    version: text(source.version) || catalogEntry?.version || "",
    targetRole,
    arguments:
      source.arguments &&
      typeof source.arguments === "object" &&
      !Array.isArray(source.arguments)
        ? { ...source.arguments }
        : {},
    metadata:
      source.metadata &&
      typeof source.metadata === "object" &&
      !Array.isArray(source.metadata)
        ? { ...source.metadata }
        : {},
  };
}

export function projectItemOperationAuthoringPresentation({
  requirementSets = [],
  effectReferences = [],
} = {}) {
  const normalizedRequirementSets = (Array.isArray(requirementSets)
    ? requirementSets
    : []
  )
    .slice(0, ITEM_OPERATION_REQUIREMENT_SET_LIMIT)
    .map(normalizeItemOperationRequirementSet);

  const normalizedEffectReferences = (Array.isArray(effectReferences)
    ? effectReferences
    : []
  )
    .slice(0, ITEM_OPERATION_EFFECT_REFERENCE_LIMIT)
    .map(normalizeItemOperationEffectReference);

  return {
    contractVersion:
      ITEM_OPERATION_AUTHORING_PRESENTATION_CONTRACT_VERSION,
    actionTypes: [...ITEM_OPERATION_ACTION_TYPES],
    effectTargetRoles: [...ITEM_OPERATION_EFFECT_TARGET_ROLES],
    effectCatalogVersion:
      ITEM_OPERATION_EFFECT_AUTHORING_CATALOG_VERSION,
    effectOptions: listItemOperationEffectAuthoringOptions(),
    requirementSets: normalizedRequirementSets,
    effectReferences: normalizedEffectReferences,
    limits: {
      requirementSets: ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
      effectReferences: ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
    },
    summary: {
      requirementSetCount: normalizedRequirementSets.length,
      enabledRequirementSetCount: normalizedRequirementSets.filter(
        (entry) => entry.enabled
      ).length,
      effectReferenceCount: normalizedEffectReferences.length,
      enabledEffectReferenceCount: normalizedEffectReferences.filter(
        (entry) => entry.enabled
      ).length,
    },
  };
}

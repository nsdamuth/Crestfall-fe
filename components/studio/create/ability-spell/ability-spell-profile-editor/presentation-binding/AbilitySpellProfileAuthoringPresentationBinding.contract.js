import {
  ABILITY_SPELL_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,
  ABILITY_SPELL_PROFILE_CONTRACT_VERSION,
  ABILITY_SPELL_PROFILE_LIMITS,
  ABILITY_SPELL_TYPES,
  ABILITY_SPELL_TARGET_MODES,
  ABILITY_SPELL_COOLDOWN_MODES,
  ABILITY_SPELL_COOLDOWN_UNITS,
  ABILITY_SPELL_CHARGE_MODES,
  ABILITY_SPELL_CHARGE_RESET_POLICIES,
  ABILITY_SPELL_MASTERY_MODES,
  ABILITY_SPELL_COST_RESOURCE_TYPES,
  ABILITY_SPELL_COST_TIMINGS,
  ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
} from "../AbilitySpellProfileEditor.contract.js";

import {
  ABILITY_SPELL_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,
  ABILITY_SPELL_PROFILE_CREATION_TYPE,
} from "../../ability-spell-profile-builder/AbilitySpellProfileBuilder.contract.js";

export const ABILITY_SPELL_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION =
  "ability_spell_profile_authoring_presentation_binding_v1";

export const ABILITY_SPELL_PROFILE_AUTHORING_CALLBACK_KEYS = Object.freeze([
  "onUpdateProfileField",
  "onAddDefinition",
  "onRemoveDefinition",
  "onUpdateDefinitionField",
  "onUpdatePrerequisiteField",
  "onUpdateTargetField",
  "onUpdateRestrictionField",
  "onUpdatePolicyField",
  "onAddCost",
  "onUpdateCostField",
  "onRemoveCost",
  "onAddOperationReference",
  "onUpdateOperationReferenceField",
  "onRemoveOperationReference",
  "onOpenJsonEditor",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function issueProjection(issue = {}) {
  const source = object(issue);

  return {
    code: text(source.code),
    path: text(source.path),
    message: text(source.message),
    severity:
      text(source.severity).toUpperCase() || "ERROR",
  };
}

function skillRequirementProjection(value = {}) {
  const source = object(value);

  return {
    skillId: text(source.skillId),
    minimumRank: number(source.minimumRank, 1),
    displayValue:
      `${text(source.skillId)}:${number(source.minimumRank, 1)}`,
  };
}

function costProjection(value = {}, index = 0) {
  const source = object(value);

  return {
    index,
    id: text(source.id),
    resourceType: text(source.resourceType),
    resourceId: text(source.resourceId),
    amount: number(source.amount, 0),
    timing: text(source.timing),
  };
}

function operationProjection(value = {}, index = 0) {
  const source = object(value);
  const referenceVersion = text(source.referenceVersion);
  const targetBinding = object(source.targetBinding);

  return {
    index,
    id: text(source.id),
    referenceVersion,
    executable:
      referenceVersion ===
      ABILITY_SPELL_EXECUTABLE_OPERATION_REFERENCE_VERSION,
    domain: text(source.domain),
    operation: text(source.operation),
    version: text(source.version),
    targetBinding: {
      mode: text(targetBinding.mode),
      bindingVersion: text(targetBinding.bindingVersion),
    },
  };
}

function definitionProjection(value = {}, index = 0) {
  const source = object(value);
  const prerequisites = object(source.prerequisites);
  const targetModel = object(source.targetModel);
  const restrictions = object(source.restrictions);
  const cooldownPolicy = object(source.cooldownPolicy);
  const chargePolicy = object(source.chargePolicy);
  const masteryPolicy = object(source.masteryPolicy);

  const requiredSkills = array(
    prerequisites.requiredSkills
  ).map(skillRequirementProjection);

  const costs = array(source.costs).map(costProjection);
  const operationReferences = array(
    source.operationReferences
  ).map(operationProjection);

  return {
    index,
    key:
      text(source.id) ||
      `definition-${index + 1}`,

    identity: {
      id: text(source.id),
      title:
        text(source.title) ||
        text(source.id) ||
        `Definition ${index + 1}`,
      type: text(source.type),
      aliases: array(source.aliases).map(text).filter(Boolean),
      school: text(source.school),
      category: text(source.category),
      tags: array(source.tags).map(text).filter(Boolean),
      description: text(source.description),
      narrativeDescription:
        text(source.narrativeDescription),
      enabled: source.enabled !== false,
    },

    prerequisites: {
      minimumLevel:
        number(prerequisites.minimumLevel, 0),
      requiredTierIds:
        array(prerequisites.requiredTierIds)
          .map(text)
          .filter(Boolean),
      requiredSkills,
      requiredSkillsDisplay:
        requiredSkills
          .map((entry) => entry.displayValue)
          .join(", "),
      requiredUnlockCount:
        array(prerequisites.requiredUnlocks).length,
      unlockAuthoringState:
        "JSON_EDITOR_ONLY_IN_CURRENT_V0_UI",
    },

    targetModel: {
      mode: text(targetModel.mode),
      rangeClass: text(targetModel.rangeClass),
      minimumTargets:
        number(targetModel.minimumTargets, 0),
      maximumTargets:
        number(targetModel.maximumTargets, 0),
      requiresLineOfSight:
        targetModel.requiresLineOfSight === true,
    },

    restrictions: {
      requiredTags:
        array(restrictions.requiredTags)
          .map(text)
          .filter(Boolean),
      forbiddenTags:
        array(restrictions.forbiddenTags)
          .map(text)
          .filter(Boolean),
      notes: text(restrictions.notes),
    },

    costs: {
      title: "Costs",
      helper:
        "Definition-time references only. Resource mutation is not implemented by this profile.",
      items: costs,
      count: costs.length,
      maxCount:
        ABILITY_SPELL_PROFILE_LIMITS.maxCosts,
      canAdd:
        costs.length <
        ABILITY_SPELL_PROFILE_LIMITS.maxCosts,
    },

    operationReferences: {
      title: "Mechanical Operation References",
      helper:
        "Legacy v0 references remain declarative. Executable v1 references can be authored through JSON and run only after the trusted Ability/Spell use boundary.",
      items: operationReferences,
      count: operationReferences.length,
      executableCount:
        operationReferences.filter(
          (reference) => reference.executable
        ).length,
      maxCount:
        ABILITY_SPELL_PROFILE_LIMITS.maxOperationReferences,
      canAdd:
        operationReferences.length <
        ABILITY_SPELL_PROFILE_LIMITS.maxOperationReferences,
    },

    cooldownPolicy: {
      mode: text(cooldownPolicy.mode),
      amount: number(cooldownPolicy.amount, 0),
      unit: text(cooldownPolicy.unit),
    },

    chargePolicy: {
      mode: text(chargePolicy.mode),
      maximumCharges:
        number(chargePolicy.maximumCharges, 0),
      resetPolicy:
        text(chargePolicy.resetPolicy),
    },

    masteryPolicy: {
      mode: text(masteryPolicy.mode),
      maximumMastery:
        number(masteryPolicy.maximumMastery, 0),
    },

    removeLabel: "Remove",
  };
}

export function projectAbilitySpellProfileAuthoringPresentationBinding({
  profile = {},
  errors = [],
  warnings = [],
  metrics = {},
  jsonEditorOpen = false,
  callbacks = {},
} = {}) {
  const safeProfile = object(profile);
  const safeMetrics = object(metrics);
  const callbackSource = object(callbacks);

  const definitions = array(
    safeProfile.abilityDefinitions
  ).map(definitionProjection);

  const projectedErrors =
    array(errors).map(issueProjection);

  const projectedWarnings =
    array(warnings).map(issueProjection);

  const validationState =
    projectedErrors.length > 0
      ? "ERROR"
      : projectedWarnings.length > 0
        ? "WARNING"
        : "VALID";

  const definitionSummary = {
    definitionCount:
      number(
        safeMetrics.definitionCount,
        definitions.length
      ),
    enabledDefinitionCount:
      number(
        safeMetrics.enabledDefinitionCount,
        definitions.filter(
          (definition) =>
            definition.identity.enabled
        ).length
      ),
    spellCount:
      number(safeMetrics.spellCount, 0),
    abilityCount:
      number(safeMetrics.abilityCount, 0),
    techniqueCount:
      number(safeMetrics.techniqueCount, 0),
    passiveCount:
      number(safeMetrics.passiveCount, 0),
  };

  return {
    bindingContractVersion:
      ABILITY_SPELL_PROFILE_AUTHORING_PRESENTATION_BINDING_CONTRACT_VERSION,

    editorViewContractVersion:
      ABILITY_SPELL_PROFILE_EDITOR_VIEW_CONTRACT_VERSION,

    builderViewContractVersion:
      ABILITY_SPELL_PROFILE_BUILDER_VIEW_CONTRACT_VERSION,

    profileContractVersion:
      text(safeProfile.contractVersion) ||
      ABILITY_SPELL_PROFILE_CONTRACT_VERSION,

    creationType:
      ABILITY_SPELL_PROFILE_CREATION_TYPE,

    header: {
      eyebrow: "Definition Profile",
      title: "Ability & Spell Profile",
      description:
        "Shared definitions for Spells, Abilities, Techniques, Special Attacks, and Passives. Known state, mastery progress, cooldown remaining, charges, and resource balances remain actor-owned runtime state.",
    },

    profile: {
      title: text(safeProfile.title),
      description: text(safeProfile.description),
      enabled: safeProfile.enabled !== false,
      tags:
        array(safeProfile.tags)
          .map(text)
          .filter(Boolean),
    },

    validation: {
      state: validationState,
      valid:
        projectedErrors.length === 0,
      errors: projectedErrors,
      warnings: projectedWarnings,
      validMessage:
        "Ability & Spell Profile definitions are valid.",
    },

    definitions: {
      title: "Definitions",
      summary: definitionSummary,
      items: definitions,
      maxCount:
        ABILITY_SPELL_PROFILE_LIMITS.maxDefinitions,
      canAdd:
        definitions.length <
        ABILITY_SPELL_PROFILE_LIMITS.maxDefinitions,
      addLabel: "Add Definition",
      emptyState:
        "No definitions are authored yet. Add one or paste a complete profile through the JSON editor.",
    },

    enumOptions: {
      abilityTypes: [...ABILITY_SPELL_TYPES],
      targetModes: [...ABILITY_SPELL_TARGET_MODES],
      cooldownModes:
        [...ABILITY_SPELL_COOLDOWN_MODES],
      cooldownUnits:
        [...ABILITY_SPELL_COOLDOWN_UNITS],
      chargeModes:
        [...ABILITY_SPELL_CHARGE_MODES],
      chargeResetPolicies:
        [...ABILITY_SPELL_CHARGE_RESET_POLICIES],
      masteryModes:
        [...ABILITY_SPELL_MASTERY_MODES],
      costResourceTypes:
        [...ABILITY_SPELL_COST_RESOURCE_TYPES],
      costTimings:
        [...ABILITY_SPELL_COST_TIMINGS],
    },

    jsonEditor: {
      open: jsonEditorOpen === true,
      actionLabel:
        "JSON Editor & AI Guide",
      visualStatus:
        "WIRED_LEGACY_PRESENTATION",
      helper:
        "W33 mounts the current definition-only JSON Editor & AI Guide in FE. Crestfall remains validation/application authority; later visual normalization may restyle the FE View without changing this behavior.",
    },

    visualExtensionStatus: {
      profileEditor:
        "WIRED_LEGACY_PRESENTATION",
      jsonEditor:
        "WIRED_LEGACY_PRESENTATION",
    },

    callbacks: {
      onUpdateProfileField:
        callbackSource.onUpdateProfileField || null,
      onAddDefinition:
        callbackSource.onAddDefinition || null,
      onRemoveDefinition:
        callbackSource.onRemoveDefinition || null,
      onUpdateDefinitionField:
        callbackSource.onUpdateDefinitionField || null,
      onUpdatePrerequisiteField:
        callbackSource.onUpdatePrerequisiteField || null,
      onUpdateTargetField:
        callbackSource.onUpdateTargetField || null,
      onUpdateRestrictionField:
        callbackSource.onUpdateRestrictionField || null,
      onUpdatePolicyField:
        callbackSource.onUpdatePolicyField || null,
      onAddCost:
        callbackSource.onAddCost || null,
      onUpdateCostField:
        callbackSource.onUpdateCostField || null,
      onRemoveCost:
        callbackSource.onRemoveCost || null,
      onAddOperationReference:
        callbackSource.onAddOperationReference || null,
      onUpdateOperationReferenceField:
        callbackSource.onUpdateOperationReferenceField || null,
      onRemoveOperationReference:
        callbackSource.onRemoveOperationReference || null,
      onOpenJsonEditor:
        callbackSource.onOpenJsonEditor || null,
    },

    architecture: {
      profileNormalizationOwnedByChassis: true,
      profileValidationOwnedByChassis: true,
      editorMutationOwnedByChassis: true,
      jsonValidationOwnedByChassis: true,
      creationPayloadOwnedByChassis: true,
      persistenceOwnedByChassis: true,
      runtimeAbilityStateExcluded: true,
      runtimeExecutionOwnedByChassis: true,
      editorVisualCompositionOwnedByFe: true,
    },
  };
}

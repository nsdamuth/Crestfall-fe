"use client";

import { useMemo, useState } from "react";

import {
  ABILITY_SPELL_PROFILE_LIMITS,
  normalizeAbilitySpellCost,
  normalizeAbilitySpellDefinition,
  normalizeAbilitySpellOperationReference,
  normalizeAbilitySpellProfileEditorValue,
  validateAbilitySpellProfileEditorValue,
} from "./AbilitySpellProfileEditor.contract";

function parseList(value) {
  return String(value || "").split(",").map((entry) => entry.trim()).filter(Boolean);
}

function parseSkillRequirements(value) {
  return parseList(value).map((entry, index) => {
    const [skillId, rankText] = entry.split(":");
    const rank = Number(rankText);
    return {
      skillId: String(skillId || `skill.${index + 1}`).trim().toLowerCase(),
      minimumRank: Number.isFinite(rank) ? Math.max(0, Math.round(rank)) : 1,
      metadata: {},
    };
  });
}

function toInteger(value, fallback = 0, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

function toNumber(value, fallback = 0, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}

export function useAbilitySpellProfileEditorViewModel({ value = {}, onChange = null } = {}) {
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const profile = useMemo(() => normalizeAbilitySpellProfileEditorValue(value), [value]);
  const validation = useMemo(() => validateAbilitySpellProfileEditorValue(profile), [profile]);

  function commit(nextProfile) {
    onChange?.(normalizeAbilitySpellProfileEditorValue(nextProfile));
  }

  function updateProfileField(field, nextValue) {
    commit({
      ...profile,
      [field]: field === "tags" ? parseList(nextValue) : nextValue,
    });
  }

  function addDefinition() {
    const index = profile.abilityDefinitions.length;
    if (index >= ABILITY_SPELL_PROFILE_LIMITS.maxDefinitions) return;
    const definition = normalizeAbilitySpellDefinition({
      id: `ability.${index + 1}`,
      title: `Ability ${index + 1}`,
      type: "ABILITY",
      school: "GENERAL",
      category: "GENERAL",
      enabled: true,
      targetModel: { mode: "SELF", minimumTargets: 1, maximumTargets: 1, rangeClass: "SELF" },
      cooldownPolicy: { mode: "NONE" },
      chargePolicy: { mode: "UNLIMITED" },
      masteryPolicy: { mode: "NONE" },
    }, index);
    commit({ ...profile, abilityDefinitions: [...profile.abilityDefinitions, definition] });
  }

  function removeDefinition(definitionIndex) {
    commit({
      ...profile,
      abilityDefinitions: profile.abilityDefinitions.filter((_entry, index) => index !== definitionIndex),
    });
  }

  function updateDefinition(definitionIndex, updater) {
    commit({
      ...profile,
      abilityDefinitions: profile.abilityDefinitions.map((definition, index) =>
        index === definitionIndex ? updater(definition) : definition
      ),
    });
  }

  function updateDefinitionField(definitionIndex, field, nextValue) {
    updateDefinition(definitionIndex, (definition) => {
      const fieldValue = {
        id: String(nextValue || "").trim().toLowerCase(),
        type: String(nextValue || "").trim().toUpperCase(),
        school: String(nextValue || "").trim().toUpperCase(),
        category: String(nextValue || "").trim().toUpperCase(),
        aliases: parseList(nextValue),
        tags: parseList(nextValue),
      };
      return {
        ...definition,
        [field]: Object.hasOwn(fieldValue, field) ? fieldValue[field] : nextValue,
      };
    });
  }

  function updatePrerequisiteField(definitionIndex, field, nextValue) {
    updateDefinition(definitionIndex, (definition) => ({
      ...definition,
      prerequisites: {
        ...definition.prerequisites,
        [field]: field === "minimumLevel"
          ? toInteger(nextValue, definition.prerequisites.minimumLevel, 0)
          : field === "requiredTierIds"
            ? parseList(nextValue).map((entry) => entry.toLowerCase())
            : field === "requiredSkills"
              ? parseSkillRequirements(nextValue)
              : nextValue,
      },
    }));
  }

  function updateTargetField(definitionIndex, field, nextValue) {
    updateDefinition(definitionIndex, (definition) => {
      const numeric = field === "minimumTargets" || field === "maximumTargets";
      return {
        ...definition,
        targetModel: {
          ...definition.targetModel,
          [field]: numeric
            ? toInteger(nextValue, definition.targetModel[field], 0, ABILITY_SPELL_PROFILE_LIMITS.maxTargets)
            : field === "mode" || field === "rangeClass"
              ? String(nextValue || "").trim().toUpperCase()
              : nextValue,
        },
      };
    });
  }

  function updateRestrictionField(definitionIndex, field, nextValue) {
    updateDefinition(definitionIndex, (definition) => ({
      ...definition,
      restrictions: {
        ...definition.restrictions,
        [field]: field === "requiredTags" || field === "forbiddenTags" ? parseList(nextValue) : nextValue,
      },
    }));
  }

  function updatePolicyField(definitionIndex, policyName, field, nextValue) {
    updateDefinition(definitionIndex, (definition) => {
      const integerFields = new Set(["amount", "maximumCharges", "maximumMastery"]);
      return {
        ...definition,
        [policyName]: {
          ...definition[policyName],
          [field]: integerFields.has(field)
            ? toInteger(nextValue, definition[policyName]?.[field], 0, ABILITY_SPELL_PROFILE_LIMITS.maxPolicyAmount)
            : String(nextValue || "").trim().toUpperCase(),
        },
      };
    });
  }

  function addCost(definitionIndex) {
    updateDefinition(definitionIndex, (definition) => {
      if (definition.costs.length >= ABILITY_SPELL_PROFILE_LIMITS.maxCosts) return definition;
      const index = definition.costs.length;
      return {
        ...definition,
        costs: [...definition.costs, normalizeAbilitySpellCost({ id: `cost.${index + 1}`, resourceType: "POOL", amount: 1, timing: "ON_USE" }, index)],
      };
    });
  }

  function updateCostField(definitionIndex, costIndex, field, nextValue) {
    updateDefinition(definitionIndex, (definition) => ({
      ...definition,
      costs: definition.costs.map((cost, index) => index === costIndex ? {
        ...cost,
        [field]: field === "id" || field === "resourceId"
          ? String(nextValue || "").trim().toLowerCase()
          : field === "amount"
            ? toNumber(nextValue, cost.amount, 0, ABILITY_SPELL_PROFILE_LIMITS.maxCostAmount)
            : String(nextValue || "").trim().toUpperCase(),
      } : cost),
    }));
  }

  function removeCost(definitionIndex, costIndex) {
    updateDefinition(definitionIndex, (definition) => ({
      ...definition,
      costs: definition.costs.filter((_cost, index) => index !== costIndex),
    }));
  }

  function addOperationReference(definitionIndex) {
    updateDefinition(definitionIndex, (definition) => {
      if (definition.operationReferences.length >= ABILITY_SPELL_PROFILE_LIMITS.maxOperationReferences) return definition;
      const index = definition.operationReferences.length;
      return {
        ...definition,
        operationReferences: [
          ...definition.operationReferences,
          normalizeAbilitySpellOperationReference({ id: `operation.${index + 1}`, domain: "CUSTOM", operation: "DEFINE_ME" }, index),
        ],
      };
    });
  }

  function updateOperationReferenceField(definitionIndex, referenceIndex, field, nextValue) {
    updateDefinition(definitionIndex, (definition) => ({
      ...definition,
      operationReferences: definition.operationReferences.map((reference, index) => index === referenceIndex ? {
        ...reference,
        [field]: field === "id"
          ? String(nextValue || "").trim().toLowerCase()
          : field === "domain" || field === "operation"
            ? String(nextValue || "").trim().toUpperCase()
            : nextValue,
      } : reference),
    }));
  }

  function removeOperationReference(definitionIndex, referenceIndex) {
    updateDefinition(definitionIndex, (definition) => ({
      ...definition,
      operationReferences: definition.operationReferences.filter((_entry, index) => index !== referenceIndex),
    }));
  }

  function applyJsonProfile(nextProfile) {
    commit(nextProfile);
    setJsonEditorOpen(false);
  }

  return {
    viewProps: {
      profile,
      errors: validation.errors,
      warnings: validation.warnings,
      metrics: validation.metrics,
      onUpdateProfileField: updateProfileField,
      onAddDefinition: addDefinition,
      onRemoveDefinition: removeDefinition,
      onUpdateDefinitionField: updateDefinitionField,
      onUpdatePrerequisiteField: updatePrerequisiteField,
      onUpdateTargetField: updateTargetField,
      onUpdateRestrictionField: updateRestrictionField,
      onUpdatePolicyField: updatePolicyField,
      onAddCost: addCost,
      onUpdateCostField: updateCostField,
      onRemoveCost: removeCost,
      onAddOperationReference: addOperationReference,
      onUpdateOperationReferenceField: updateOperationReferenceField,
      onRemoveOperationReference: removeOperationReference,
      onOpenJsonEditor: () => setJsonEditorOpen(true),
    },
    jsonEditorProps: jsonEditorOpen ? {
      value: profile,
      onApply: applyJsonProfile,
      onClose: () => setJsonEditorOpen(false),
    } : null,
  };
}

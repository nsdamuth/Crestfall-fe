"use client";

import { useMemo, useState } from "react";

import {
  ABILITY_SPELL_DEFINITION_SELECTION_MODE_OPTIONS,
  ABILITY_SPELL_ROOM_LOCAL_CHOICE_INPUT_MODES,
  ABILITY_SPELL_ROOM_LOCAL_CORE_FIELDS,
  ABILITY_SPELL_ROOM_LOCAL_CUSTOM_FIELD_INPUT_MODES,
  ABILITY_SPELL_ROOM_LOCAL_DEFINITION_AUTHORING_MODE_OPTIONS,
  ABILITY_SPELL_PROFILE_LIMITS,
  normalizeAbilitySpellCost,
  normalizeAbilitySpellDefinition,
  normalizeAbilitySpellOperationReference,
  normalizeAbilitySpellSelectionGroup,
  normalizeAbilitySpellRoomLocalCustomTextField,
  normalizeAbilitySpellRoomLocalDefinitionAuthoringGroup,
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


  function updateDefinitionSelectionMode(nextMode) {
    const mode = String(nextMode || "").trim().toUpperCase();
    const current = profile.actorConfiguration?.definitionSelection || {};
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        definitionSelection: {
          ...current,
          mode,
          requireUniqueDefinitions:
            mode === "GROUPS" ? current.requireUniqueDefinitions !== false : false,
          groups: mode === "GROUPS" ? current.groups || [] : [],
        },
      },
    });
  }

  function updateDefinitionSelectionUnique(nextValue) {
    const current = profile.actorConfiguration?.definitionSelection || {};
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        definitionSelection: {
          ...current,
          requireUniqueDefinitions: nextValue === true,
        },
      },
    });
  }

  function addDefinitionSelectionGroup() {
    const current = profile.actorConfiguration?.definitionSelection || {};
    const groups = Array.isArray(current.groups) ? current.groups : [];
    if (groups.length >= ABILITY_SPELL_PROFILE_LIMITS.maxSelectionGroups) return;
    const index = groups.length;
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        definitionSelection: {
          ...current,
          groups: [
            ...groups,
            normalizeAbilitySpellSelectionGroup(
              {
                id: `selection.${index + 1}`,
                title: `Starting Ability Group ${index + 1}`,
                minimumSelections: 1,
                maximumSelections: 1,
                allowedTypes: [],
                allowedSchools: [],
                allowedCategories: [],
                requireSameSchool: false,
              },
              index
            ),
          ],
        },
      },
    });
  }

  function removeDefinitionSelectionGroup(groupIndex) {
    const current = profile.actorConfiguration?.definitionSelection || {};
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        definitionSelection: {
          ...current,
          groups: (current.groups || []).filter((_group, index) => index !== groupIndex),
        },
      },
    });
  }

  function updateDefinitionSelectionGroupField(groupIndex, field, nextValue) {
    const current = profile.actorConfiguration?.definitionSelection || {};
    const groups = (current.groups || []).map((group, index) => {
      if (index !== groupIndex) return group;
      const parsedByField = {
        id: String(nextValue || "").trim().toLowerCase(),
        minimumSelections: toInteger(
          nextValue,
          group.minimumSelections,
          0,
          ABILITY_SPELL_PROFILE_LIMITS.maxSelectionsPerGroup
        ),
        maximumSelections: toInteger(
          nextValue,
          group.maximumSelections,
          0,
          ABILITY_SPELL_PROFILE_LIMITS.maxSelectionsPerGroup
        ),
        allowedTypes: parseList(nextValue).map((entry) => entry.toUpperCase()),
        allowedSchools: parseList(nextValue).map((entry) => entry.toUpperCase()),
        allowedCategories: parseList(nextValue).map((entry) => entry.toUpperCase()),
        requireSameSchool: nextValue === true,
      };
      const updated = {
        ...group,
        [field]: Object.hasOwn(parsedByField, field) ? parsedByField[field] : nextValue,
      };
      if (field === "minimumSelections") {
        updated.maximumSelections = Math.max(
          updated.minimumSelections,
          Number(updated.maximumSelections || 0)
        );
      }
      if (field === "maximumSelections") {
        updated.minimumSelections = Math.min(
          Number(updated.minimumSelections || 0),
          updated.maximumSelections
        );
      }
      return updated;
    });
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        definitionSelection: {
          ...current,
          groups,
        },
      },
    });
  }

  function updateRoomLocalDefinitionAuthoringMode(nextMode) {
    const mode = String(nextMode || "").trim().toUpperCase();
    const current = profile.actorConfiguration?.roomLocalDefinitionAuthoring || {};
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        roomLocalDefinitionAuthoring: {
          ...current,
          mode,
          requireUniqueTitles:
            mode === "GROUPS" ? current.requireUniqueTitles !== false : false,
          groups: mode === "GROUPS" ? current.groups || [] : [],
        },
      },
    });
  }

  function updateRoomLocalDefinitionAuthoringUniqueTitles(nextValue) {
    const current = profile.actorConfiguration?.roomLocalDefinitionAuthoring || {};
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        roomLocalDefinitionAuthoring: {
          ...current,
          requireUniqueTitles: nextValue === true,
        },
      },
    });
  }

  function addRoomLocalDefinitionAuthoringGroup() {
    const current = profile.actorConfiguration?.roomLocalDefinitionAuthoring || {};
    const groups = Array.isArray(current.groups) ? current.groups : [];
    if (groups.length >= ABILITY_SPELL_PROFILE_LIMITS.maxRoomLocalAuthoringGroups) return;
    const index = groups.length;
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        roomLocalDefinitionAuthoring: {
          ...current,
          groups: [
            ...groups,
            normalizeAbilitySpellRoomLocalDefinitionAuthoringGroup(
              {
                id: `authoring.${index + 1}`,
                title: `Player-authored definition group ${index + 1}`,
                minimumDefinitions: 1,
                maximumDefinitions: 1,
                allowedTypes: ["ABILITY"],
                allowedSchools: [],
                allowedCategories: [],
                visibleFields: [...ABILITY_SPELL_ROOM_LOCAL_CORE_FIELDS],
                schoolInputMode: "AUTO",
                categoryInputMode: "AUTO",
                requireSameSchool: false,
                requiredFields: ["DESCRIPTION"],
                customTextFields: [],
                mechanicsMode: "NARRATIVE_ONLY",
              },
              index
            ),
          ],
        },
      },
    });
  }

  function removeRoomLocalDefinitionAuthoringGroup(groupIndex) {
    const current = profile.actorConfiguration?.roomLocalDefinitionAuthoring || {};
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        roomLocalDefinitionAuthoring: {
          ...current,
          groups: (current.groups || []).filter((_group, index) => index !== groupIndex),
        },
      },
    });
  }

  function updateRoomLocalDefinitionAuthoringGroupField(groupIndex, field, nextValue) {
    const current = profile.actorConfiguration?.roomLocalDefinitionAuthoring || {};
    const groups = (current.groups || []).map((group, index) => {
      if (index !== groupIndex) return group;
      const parsedByField = {
        id: String(nextValue || "").trim().toLowerCase(),
        minimumDefinitions: toInteger(
          nextValue,
          group.minimumDefinitions,
          0,
          ABILITY_SPELL_PROFILE_LIMITS.maxRoomLocalDefinitionsPerGroup
        ),
        maximumDefinitions: toInteger(
          nextValue,
          group.maximumDefinitions,
          0,
          ABILITY_SPELL_PROFILE_LIMITS.maxRoomLocalDefinitionsPerGroup
        ),
        allowedTypes: parseList(nextValue).map((entry) => entry.toUpperCase()),
        allowedSchools: parseList(nextValue).map((entry) => entry.toUpperCase()),
        allowedCategories: parseList(nextValue).map((entry) => entry.toUpperCase()),
        visibleFields: Array.isArray(nextValue)
          ? nextValue.map((entry) => String(entry || "").toUpperCase())
          : parseList(nextValue).map((entry) => entry.toUpperCase()),
        schoolInputMode: String(nextValue || "AUTO").trim().toUpperCase(),
        categoryInputMode: String(nextValue || "AUTO").trim().toUpperCase(),
        requiredFields: Array.isArray(nextValue)
          ? nextValue.map((entry) => String(entry || "").toUpperCase())
          : parseList(nextValue).map((entry) => entry.toUpperCase()),
        requireSameSchool: nextValue === true,
      };
      const updated = {
        ...group,
        [field]: Object.hasOwn(parsedByField, field) ? parsedByField[field] : nextValue,
      };
      if (field === "minimumDefinitions") {
        updated.maximumDefinitions = Math.max(
          updated.minimumDefinitions,
          Number(updated.maximumDefinitions || 0)
        );
      }
      if (field === "maximumDefinitions") {
        updated.minimumDefinitions = Math.min(
          Number(updated.minimumDefinitions || 0),
          updated.maximumDefinitions
        );
      }
      return updated;
    });
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        roomLocalDefinitionAuthoring: {
          ...current,
          groups,
        },
      },
    });
  }

  function toggleRoomLocalDefinitionAuthoringGroupListValue(
    groupIndex,
    field,
    value,
    checked
  ) {
    const current = profile.actorConfiguration?.roomLocalDefinitionAuthoring || {};
    const normalizedValue = String(value || "").trim().toUpperCase();
    const groups = (current.groups || []).map((group, index) => {
      if (index !== groupIndex) return group;
      const existing = Array.isArray(group?.[field])
        ? group[field].map((entry) => String(entry || "").toUpperCase())
        : [];
      const next = checked
        ? [...new Set([...existing, normalizedValue])]
        : existing.filter((entry) => entry !== normalizedValue);
      if (field === "visibleFields" && !checked) {
        return {
          ...group,
          visibleFields: next,
          requiredFields: Array.isArray(group.requiredFields)
            ? group.requiredFields.filter(
                (entry) => String(entry || "").toUpperCase() !== normalizedValue
              )
            : [],
          ...(normalizedValue === "SCHOOL" ? { requireSameSchool: false } : {}),
        };
      }
      return { ...group, [field]: next };
    });
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        roomLocalDefinitionAuthoring: { ...current, groups },
      },
    });
  }

  function addRoomLocalDefinitionCustomTextField(groupIndex) {
    const current = profile.actorConfiguration?.roomLocalDefinitionAuthoring || {};
    const groups = (current.groups || []).map((group, index) => {
      if (index !== groupIndex) return group;
      const fields = Array.isArray(group.customTextFields) ? group.customTextFields : [];
      if (fields.length >= ABILITY_SPELL_PROFILE_LIMITS.maxRoomLocalCustomTextFields) return group;
      return {
        ...group,
        customTextFields: [
          ...fields,
          normalizeAbilitySpellRoomLocalCustomTextField(
            {
              id: `field.${fields.length + 1}`,
              title: `Custom field ${fields.length + 1}`,
              helperText: "",
              required: false,
              inputMode: "LONG_TEXT",
              options: [],
              maxLength: 1200,
            },
            fields.length
          ),
        ],
      };
    });
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        roomLocalDefinitionAuthoring: { ...current, groups },
      },
    });
  }

  function removeRoomLocalDefinitionCustomTextField(groupIndex, fieldIndex) {
    const current = profile.actorConfiguration?.roomLocalDefinitionAuthoring || {};
    const groups = (current.groups || []).map((group, index) =>
      index === groupIndex
        ? {
            ...group,
            customTextFields: (group.customTextFields || []).filter(
              (_field, candidateIndex) => candidateIndex !== fieldIndex
            ),
          }
        : group
    );
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        roomLocalDefinitionAuthoring: { ...current, groups },
      },
    });
  }

  function updateRoomLocalDefinitionCustomTextField(groupIndex, fieldIndex, field, nextValue) {
    const current = profile.actorConfiguration?.roomLocalDefinitionAuthoring || {};
    const groups = (current.groups || []).map((group, index) => {
      if (index !== groupIndex) return group;
      return {
        ...group,
        customTextFields: (group.customTextFields || []).map((entry, candidateIndex) => {
          if (candidateIndex !== fieldIndex) return entry;
          const parsedByField = {
            id: String(nextValue || "").trim().toLowerCase(),
            required: nextValue === true,
            inputMode: String(nextValue || "LONG_TEXT").trim().toUpperCase(),
            options: parseList(nextValue),
            maxLength: toInteger(
              nextValue,
              entry.maxLength,
              1,
              ABILITY_SPELL_PROFILE_LIMITS.maxRoomLocalCustomTextLength
            ),
          };
          return {
            ...entry,
            [field]: Object.hasOwn(parsedByField, field)
              ? parsedByField[field]
              : nextValue,
          };
        }),
      };
    });
    commit({
      ...profile,
      actorConfiguration: {
        ...profile.actorConfiguration,
        roomLocalDefinitionAuthoring: { ...current, groups },
      },
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
      definitionSelectionModeOptions: ABILITY_SPELL_DEFINITION_SELECTION_MODE_OPTIONS,
      onUpdateDefinitionSelectionMode: updateDefinitionSelectionMode,
      onUpdateDefinitionSelectionUnique: updateDefinitionSelectionUnique,
      onAddDefinitionSelectionGroup: addDefinitionSelectionGroup,
      onRemoveDefinitionSelectionGroup: removeDefinitionSelectionGroup,
      onUpdateDefinitionSelectionGroupField: updateDefinitionSelectionGroupField,
      roomLocalDefinitionAuthoringModeOptions:
        ABILITY_SPELL_ROOM_LOCAL_DEFINITION_AUTHORING_MODE_OPTIONS,
      roomLocalDefinitionCoreFields: ABILITY_SPELL_ROOM_LOCAL_CORE_FIELDS,
      roomLocalDefinitionChoiceInputModes: ABILITY_SPELL_ROOM_LOCAL_CHOICE_INPUT_MODES,
      roomLocalCustomFieldInputModes: ABILITY_SPELL_ROOM_LOCAL_CUSTOM_FIELD_INPUT_MODES,
      onUpdateRoomLocalDefinitionAuthoringMode: updateRoomLocalDefinitionAuthoringMode,
      onUpdateRoomLocalDefinitionAuthoringUniqueTitles:
        updateRoomLocalDefinitionAuthoringUniqueTitles,
      onAddRoomLocalDefinitionAuthoringGroup: addRoomLocalDefinitionAuthoringGroup,
      onRemoveRoomLocalDefinitionAuthoringGroup: removeRoomLocalDefinitionAuthoringGroup,
      onUpdateRoomLocalDefinitionAuthoringGroupField:
        updateRoomLocalDefinitionAuthoringGroupField,
      onToggleRoomLocalDefinitionAuthoringGroupListValue:
        toggleRoomLocalDefinitionAuthoringGroupListValue,
      onAddRoomLocalDefinitionCustomTextField: addRoomLocalDefinitionCustomTextField,
      onRemoveRoomLocalDefinitionCustomTextField: removeRoomLocalDefinitionCustomTextField,
      onUpdateRoomLocalDefinitionCustomTextField: updateRoomLocalDefinitionCustomTextField,
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

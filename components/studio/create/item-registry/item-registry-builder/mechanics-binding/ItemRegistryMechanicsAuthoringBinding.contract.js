import {
  ITEM_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
} from "../ItemRegistryBuilder.contract.js";

import {
  ITEM_OPERATION_AUTHORING_PRESENTATION_CONTRACT_VERSION,
  ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
  ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
  projectItemOperationAuthoringPresentation,
} from "../../../../registries/item-operation-authoring/ItemOperationAuthoring.contract.js";

import {
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
  ITEM_EQUIPMENT_MODIFIER_REFERENCE_PRESENTATION_CONTRACT_VERSION,
  projectItemEquipmentModifierReferencesPresentation,
} from "../../../../registries/item-equipment-modifier-references/ItemEquipmentModifierReferences.contract.js";

export const ITEM_REGISTRY_MECHANICS_AUTHORING_BINDING_CONTRACT_VERSION =
  "item_registry_mechanics_authoring_binding_v1";

export const ITEM_REGISTRY_MECHANICS_AUTHORING_CALLBACK_KEYS = Object.freeze([
  "onAddEquipmentModifierReference",
  "onUpdateEquipmentModifierReference",
  "onRemoveEquipmentModifierReference",
  "onAddOperationRequirementSet",
  "onUpdateOperationRequirementSet",
  "onRemoveOperationRequirementSet",
  "onAddOperationEffectReference",
  "onUpdateOperationEffectReference",
  "onRemoveOperationEffectReference",
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

export function projectItemRegistryMechanicsAuthoringBinding({
  activeEntry = null,
  callbacks = {},
} = {}) {
  const entry = object(activeEntry);
  const callbackSource = object(callbacks);
  const entryId = text(entry.id);
  const entryName = text(entry.name) || "Item";
  const hasActiveEntry = Boolean(entryId);

  const equipmentModifiers =
    projectItemEquipmentModifierReferencesPresentation({
      references: array(entry.equipmentModifierReferences),
      maxReferences: ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
    });

  const operations = projectItemOperationAuthoringPresentation({
    requirementSets: array(entry.operationRequirementSets),
    effectReferences: array(entry.operationEffectReferences),
  });

  const equipmentSection = {
    id: "equipment-effects",
    title: "Equipment Effects",
    description:
      "Reference existing Stats & Pools modifiers that become relevant while this item is equipped. Modifier definitions remain owned by Stats & Pools.",
    activeEntryId: entryId,
    activeEntryName: entryName,
    disabled: !hasActiveEntry,
    maxReferences: equipmentModifiers.maxReferences,
    canAdd: hasActiveEntry && equipmentModifiers.summary.canAdd,
    referenceCount: equipmentModifiers.summary.referenceCount,
    enabledReferenceCount:
      equipmentModifiers.summary.enabledReferenceCount,
    references: equipmentModifiers.references,
    emptyState: equipmentModifiers.emptyState,
  };

  const requirementSection = {
    id: "operation-requirements",
    title: "Operation Requirements",
    description:
      "Gate Item actions with the same typed requirement language used by Mechanics commands. Runtime authorization remains authoritative.",
    activeEntryId: entryId,
    activeEntryName: entryName,
    disabled: !hasActiveEntry,
    maxRequirementSets: ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
    canAdd:
      hasActiveEntry &&
      operations.summary.requirementSetCount <
        ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
    requirementSetCount:
      operations.summary.requirementSetCount,
    enabledRequirementSetCount:
      operations.summary.enabledRequirementSetCount,
    actionTypes: operations.actionTypes,
    requirementSets: operations.requirementSets,
  };

  const effectSection = {
    id: "operation-effects",
    title: "Operation Effects",
    description:
      "Reference registered typed mechanics operations for authorized Item actions. Authoring a reference does not grant execution authority.",
    activeEntryId: entryId,
    activeEntryName: entryName,
    disabled: !hasActiveEntry,
    maxEffectReferences: ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
    canAdd:
      hasActiveEntry &&
      operations.summary.effectReferenceCount <
        ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,
    effectReferenceCount:
      operations.summary.effectReferenceCount,
    enabledEffectReferenceCount:
      operations.summary.enabledEffectReferenceCount,
    actionTypes: operations.actionTypes,
    targetRoles: operations.effectTargetRoles,
    effectOptions: operations.effectOptions,
    effectReferences: operations.effectReferences,
  };

  return {
    bindingContractVersion:
      ITEM_REGISTRY_MECHANICS_AUTHORING_BINDING_CONTRACT_VERSION,
    itemRegistryBuilderViewContractVersion:
      ITEM_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION,
    itemOperationPresentationContractVersion:
      ITEM_OPERATION_AUTHORING_PRESENTATION_CONTRACT_VERSION,
    equipmentModifierPresentationContractVersion:
      ITEM_EQUIPMENT_MODIFIER_REFERENCE_PRESENTATION_CONTRACT_VERSION,

    activeEntry: hasActiveEntry
      ? {
          id: entryId,
          name: entryName,
        }
      : null,

    sections: {
      equipmentModifiers: equipmentSection,
      operationRequirements: requirementSection,
      operationEffects: effectSection,
    },

    itemRegistryBuilderProps: {
      equipmentModifierReferenceLimit:
        ITEM_EQUIPMENT_MODIFIER_REFERENCE_LIMIT,
      operationRequirementSetLimit:
        ITEM_OPERATION_REQUIREMENT_SET_LIMIT,
      operationEffectReferenceLimit:
        ITEM_OPERATION_EFFECT_REFERENCE_LIMIT,

      mechanicsAuthoring: {
        activeEntryId: entryId,
        equipmentModifiers: equipmentSection,
        operationRequirements: requirementSection,
        operationEffects: effectSection,
      },

      onAddEquipmentModifierReference:
        callbackSource.onAddEquipmentModifierReference || null,
      onUpdateEquipmentModifierReference:
        callbackSource.onUpdateEquipmentModifierReference || null,
      onRemoveEquipmentModifierReference:
        callbackSource.onRemoveEquipmentModifierReference || null,
      onAddOperationRequirementSet:
        callbackSource.onAddOperationRequirementSet || null,
      onUpdateOperationRequirementSet:
        callbackSource.onUpdateOperationRequirementSet || null,
      onRemoveOperationRequirementSet:
        callbackSource.onRemoveOperationRequirementSet || null,
      onAddOperationEffectReference:
        callbackSource.onAddOperationEffectReference || null,
      onUpdateOperationEffectReference:
        callbackSource.onUpdateOperationEffectReference || null,
      onRemoveOperationEffectReference:
        callbackSource.onRemoveOperationEffectReference || null,
    },

    architecture: {
      itemEntryNormalizationOwnedByChassis: true,
      addUpdateRemoveOperationsOwnedByChassis: true,
      payloadPersistenceOwnedByChassis: true,
      itemActionAuthorizationOwnedByChassis: true,
      typedOperationExecutionOwnedByChassis: true,
      statsPoolsModifierResolutionOwnedByChassis: true,
      actorStateMutationOwnedByChassis: true,
      mechanicsAuthoringPresentationOwnedByFe: true,
    },
  };
}
